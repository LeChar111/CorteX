"""Main scan orchestration: detect -> extract -> build -> enrich -> cluster -> analyze -> export."""

import json
import os
import sys
import threading
import time
from pathlib import Path

from graphify.detect import detect
from graphify.extract import extract, collect_files
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections
from graphify.export import to_json
import networkx as nx

from cortex_bridge.edge_enrichment import enrich_cross_file_edges
from cortex_bridge.semantic_analyzer import run_semantic_analysis


def safe_cluster(G, timeout_seconds=30):
    """Run community detection with a timeout. Falls back to connected components."""
    result = {}
    error = [None]

    def do_cluster():
        nonlocal result
        try:
            result = cluster(G)
        except Exception as e:
            error[0] = e

    thread = threading.Thread(target=do_cluster)
    thread.start()
    thread.join(timeout=timeout_seconds)

    if thread.is_alive():
        print(f"[scanner] Clustering timed out after {timeout_seconds}s, using connected components fallback", file=sys.stderr)
        # Fallback: use connected components as communities
        undirected = G.to_undirected() if G.is_directed() else G
        components = list(nx.connected_components(undirected))
        result = {i: list(comp) for i, comp in enumerate(components)}
        return result

    if error[0]:
        print(f"[scanner] Clustering failed: {error[0]}, using connected components fallback", file=sys.stderr)
        undirected = G.to_undirected() if G.is_directed() else G
        components = list(nx.connected_components(undirected))
        return {i: list(comp) for i, comp in enumerate(components)}

    return result


def scan_directory(
    source_path: str,
    output_path: str,
    project_id: str = "",
    project_name: str = "",
    repo_id: str = "",
    repo_name: str = "",
) -> dict:
    """Run the full graphify pipeline on a directory."""
    root = Path(source_path)
    start = time.time()

    # 1. Detect files
    detection = detect(root)
    code_files = [Path(f) for f in detection["files"].get("code", [])]
    doc_files = detection["files"].get("document", [])
    total_files = detection.get("total_files", len(code_files))

    progress = {"phase": "extract", "files": total_files}
    print(json.dumps({"progress": progress}), file=sys.stderr, flush=True)

    # 2. Extract AST (deterministic, no LLM)
    if not code_files:
        extraction = {"nodes": [], "edges": []}
    else:
        extraction = extract(code_files)

    # Report extraction progress
    progress["phase"] = "extract"
    progress["nodes"] = len(extraction.get("nodes", []))
    progress["edges"] = len(extraction.get("edges", []))
    progress["files"] = total_files
    print(json.dumps({"progress": progress}), file=sys.stderr, flush=True)

    # 3. Build graph
    G = build_from_json(extraction, directed=True)

    # 4. Inject cortex metadata into every node
    for node_id in G.nodes:
        G.nodes[node_id]["project_id"] = project_id
        G.nodes[node_id]["project_name"] = project_name
        G.nodes[node_id]["repo_id"] = repo_id
        G.nodes[node_id]["repo_name"] = repo_name

    # Report graph build progress
    progress["phase"] = "build"
    progress["nodes"] = G.number_of_nodes()
    progress["edges"] = G.number_of_edges()
    print(json.dumps({"progress": progress}), file=sys.stderr, flush=True)

    # 5. Initial export (before enrichment)
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    to_json(G, {}, str(output))

    # 6. Cross-file edge enrichment
    progress["phase"] = "enrichment"
    print(json.dumps({"progress": progress}), file=sys.stderr, flush=True)
    enrichment_stats = enrich_cross_file_edges(str(output))

    # 7. Claude CLI semantic analysis (optional)
    semantic_enabled = os.environ.get("CORTEX_SEMANTIC_ANALYSIS", "true").lower() == "true"
    semantic_stats = {}
    if semantic_enabled and G.number_of_nodes() > 0:
        progress["phase"] = "semantic_analysis"
        print(json.dumps({"progress": progress}), file=sys.stderr, flush=True)
        # Run a preliminary cluster just for community grouping in the analysis
        # (will be re-done after)
        preliminary_communities = safe_cluster(G, timeout_seconds=15)
        semantic_stats = run_semantic_analysis(
            str(output),
            {str(cid): {"members": m, "size": len(m)} for cid, m in preliminary_communities.items()},
        )

    # 8. Re-load enriched graph, re-cluster, re-analyze
    # This ensures communities reflect the actual graph after all enrichments
    # (edge enrichment + semantic analysis may have added/removed edges)
    progress["phase"] = "final_cluster"
    print(json.dumps({"progress": progress}), file=sys.stderr, flush=True)

    with open(str(output)) as f:
        enriched_data = json.load(f)

    # graphify's to_json uses "links" key, but build_from_json expects "edges"
    if "links" in enriched_data and "edges" not in enriched_data:
        enriched_data["edges"] = enriched_data.pop("links")

    G_final = build_from_json(enriched_data, directed=True)

    # Re-inject metadata (build_from_json may not preserve all cortex attrs)
    for node_id in G_final.nodes:
        G_final.nodes[node_id].setdefault("project_id", project_id)
        G_final.nodes[node_id].setdefault("project_name", project_name)
        G_final.nodes[node_id].setdefault("repo_id", repo_id)
        G_final.nodes[node_id].setdefault("repo_name", repo_name)

    communities = safe_cluster(G_final) if G_final.number_of_nodes() > 0 else {}
    cohesion = score_all(G_final, communities) if communities else {}
    gods = god_nodes(G_final, top_n=20) if G_final.number_of_nodes() > 0 else []
    surprises = surprising_connections(G_final, communities, top_n=10) if G_final.number_of_nodes() > 0 else []

    # 9. Final export with communities
    progress["phase"] = "export"
    progress["nodes"] = G_final.number_of_nodes()
    progress["edges"] = G_final.number_of_edges()
    progress["community"] = str(len(communities))
    print(json.dumps({"progress": progress}), file=sys.stderr, flush=True)
    to_json(G_final, communities, str(output))

    # 10. Build result with final stats
    result = {
        "graph_path": str(output),
        "stats": {
            "total_files": total_files,
            "code_files": len(code_files),
            "doc_files": len(doc_files),
            "nodes": G_final.number_of_nodes(),
            "edges": G_final.number_of_edges(),
            "communities": len(communities),
            "enrichment": enrichment_stats,
            "duration_s": round(time.time() - start, 2),
        },
        "communities": {
            str(cid): {
                "members": members,
                "size": len(members),
                "cohesion": cohesion.get(cid, 0.0),
            }
            for cid, members in communities.items()
        },
        "god_nodes": gods,
        "surprising_connections": surprises,
        "metadata": {
            "project_id": project_id,
            "project_name": project_name,
            "repo_id": repo_id,
            "repo_name": repo_name,
        },
    }

    result["semantic_analysis"] = semantic_stats

    return result
