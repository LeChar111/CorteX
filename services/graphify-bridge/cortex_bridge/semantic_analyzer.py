"""Semantic analysis via Claude CLI (claude --print).

Post-processing step that validates link coherence and discovers
semantic relationships that AST extraction can't find.
"""

import json
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

import networkx as nx


# Max nodes per Claude CLI call (to avoid context overflow)
BATCH_SIZE = 50
# Max edges to include per batch
MAX_EDGES_PER_BATCH = 100
# Parallel Claude CLI calls (override via CORTEX_SEMANTIC_PARALLELISM)
DEFAULT_PARALLELISM = 8
# Min community size to bother analyzing (override via CORTEX_SEMANTIC_MIN_SIZE)
DEFAULT_MIN_COMMUNITY_SIZE = 4
# Max number of communities to analyze (largest first), 0 = unlimited
# (override via CORTEX_SEMANTIC_MAX_COMMUNITIES)
DEFAULT_MAX_COMMUNITIES = 50


def run_claude_cli(prompt: str, model: str = "claude-haiku-4-5-20251001") -> str | None:
    """Run claude --print and return the response text.

    Returns None if Claude CLI is not available or fails.
    """
    try:
        result = subprocess.run(
            ["claude", "--print", "--model", model, "--max-turns", "1", prompt],
            capture_output=True,
            text=True,
            timeout=120,  # 2 min timeout per call
        )
        if result.returncode != 0:
            print(f"[semantic] Claude CLI failed: {result.stderr[:200]}", file=sys.stderr)
            return None
        return result.stdout.strip()
    except FileNotFoundError:
        print("[semantic] Claude CLI not found, skipping semantic analysis", file=sys.stderr)
        return None
    except subprocess.TimeoutExpired:
        print("[semantic] Claude CLI timed out", file=sys.stderr)
        return None


def analyze_community_coherence(
    nodes: list[dict],
    edges: list[dict],
    community_id: str,
) -> dict:
    """Send a community's nodes and edges to Claude for coherence analysis.

    Returns:
        dict with keys:
        - "incoherent_edges": list of edge indices to remove
        - "new_edges": list of {"source", "target", "relation", "description"} to add
        - "notes": string with analysis summary
    """
    # Build a compact representation for the prompt
    node_list = "\n".join(
        f"  - {n.get('label', n.get('id', '?'))} ({n.get('type', '?')}) [file: {n.get('source_file', '?')}]"
        for n in nodes[:BATCH_SIZE]
    )

    edge_list = "\n".join(
        f"  [{i}] {e.get('source', '?')} --[{e.get('relation', '?')}]--> {e.get('target', '?')}"
        + (f" (confidence: {e.get('confidence', 'EXTRACTED')})" if e.get('confidence') != 'EXTRACTED' else "")
        for i, e in enumerate(edges[:MAX_EDGES_PER_BATCH])
    )

    prompt = f"""You are analyzing a code knowledge graph for coherence.
This is community #{community_id} from a codebase analysis.

## Nodes ({len(nodes)} entities):
{node_list}

## Edges ({len(edges)} relationships):
{edge_list}

## Tasks:
1. COHERENCE CHECK: Identify any edges that are likely WRONG (false positives from AST parsing). An edge is incoherent if:
   - The relation type doesn't make sense (e.g., a class "calls" a config file)
   - The source and target are completely unrelated (different domains, no logical connection)
   - The confidence is AMBIGUOUS and the connection seems unlikely

2. MISSING RELATIONS: Identify important relationships that are MISSING between the listed nodes. Only suggest relations that are clearly implied by the names, types, and file locations. Don't guess.

Respond in this exact JSON format (no markdown, no explanation):
{{
  "incoherent_edges": [0, 5, 12],
  "new_edges": [
    {{"source": "exact_node_id", "target": "exact_node_id", "relation": "uses", "description": "brief reason"}}
  ],
  "notes": "One sentence summary of the community's purpose"
}}

If everything looks coherent and you have no suggestions, return:
{{"incoherent_edges": [], "new_edges": [], "notes": "Community looks coherent"}}"""

    response = run_claude_cli(prompt)
    if not response:
        return {"incoherent_edges": [], "new_edges": [], "notes": "Skipped (CLI unavailable)"}

    # Parse JSON response (Claude may wrap in markdown code blocks)
    text = response.strip()
    if text.startswith("```"):
        # Remove markdown code fences
        lines = text.split("\n")
        text = "\n".join(
            line for line in lines
            if not line.strip().startswith("```")
        )

    try:
        return json.loads(text)
    except json.JSONDecodeError:
        print(f"[semantic] Failed to parse Claude response for community {community_id}", file=sys.stderr)
        return {"incoherent_edges": [], "new_edges": [], "notes": "Parse error"}


def _env_int(name: str, default: int) -> int:
    raw = os.environ.get(name)
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError:
        return default


def run_semantic_analysis(
    graph_path: str,
    communities: dict[str, dict],
    enabled: bool = True,
) -> dict:
    """Run semantic analysis on the graph using Claude CLI.

    Args:
        graph_path: Path to graph.json from graphify
        communities: Community data from scanner results
        enabled: If False, skip analysis entirely

    Returns:
        dict with:
        - "edges_removed": int - incoherent edges removed
        - "edges_added": int - semantic edges added
        - "communities_analyzed": int
        - "notes": dict of community notes
    """
    if not enabled:
        return {"edges_removed": 0, "edges_added": 0, "communities_analyzed": 0, "notes": {}}

    # Honor "fast" preset: tightens defaults if set
    fast = os.environ.get("CORTEX_SEMANTIC_FAST", "").lower() == "true"
    parallelism = _env_int("CORTEX_SEMANTIC_PARALLELISM", DEFAULT_PARALLELISM if not fast else 12)
    min_size = _env_int("CORTEX_SEMANTIC_MIN_SIZE", DEFAULT_MIN_COMMUNITY_SIZE if not fast else 6)
    max_communities = _env_int("CORTEX_SEMANTIC_MAX_COMMUNITIES", DEFAULT_MAX_COMMUNITIES if not fast else 30)

    # Check if Claude CLI is available
    test = run_claude_cli("Reply with just: OK")
    if test is None:
        print("[semantic] Claude CLI not available, skipping semantic analysis", file=sys.stderr)
        return {"edges_removed": 0, "edges_added": 0, "communities_analyzed": 0, "notes": {}}

    # Load graph
    with open(graph_path) as f:
        graph_data = json.load(f)

    nodes_by_id = {n["id"]: n for n in graph_data.get("nodes", [])}
    links = graph_data.get("links", [])

    stats = {"edges_removed": 0, "edges_added": 0, "communities_analyzed": 0, "notes": {}}
    edges_to_remove: set[int] = set()
    new_links: list[dict] = []

    # Phase C — pre-filter communities: drop trivials, keep top-N by size
    eligible: list[tuple[str, set, list, list]] = []
    for cid, cdata in communities.items():
        members = set(cdata.get("members", []))
        if len(members) < min_size:
            continue
        community_nodes = [nodes_by_id[m] for m in members if m in nodes_by_id]
        if not community_nodes:
            continue
        community_edges = []
        community_edge_indices = []
        for i, link in enumerate(links):
            src = link.get("source", "")
            tgt = link.get("target", "")
            if src in members or tgt in members:
                community_edges.append(link)
                community_edge_indices.append(i)
        eligible.append((str(cid), members, community_nodes, community_edges, community_edge_indices))

    # Sort by community size desc, then keep top-N
    eligible.sort(key=lambda t: len(t[2]), reverse=True)
    if max_communities > 0:
        eligible = eligible[:max_communities]

    total_eligible = len(eligible)
    print(
        f"[semantic] {total_eligible} communities to analyze "
        f"(min_size={min_size}, max={max_communities or 'unlimited'}, parallelism={parallelism})",
        file=sys.stderr,
    )

    if total_eligible == 0:
        return stats

    # Phase B — analyze in parallel via ThreadPoolExecutor
    completed_count = 0

    def _work(item):
        cid, _members, c_nodes, c_edges, c_edge_indices = item
        return cid, c_edge_indices, analyze_community_coherence(c_nodes, c_edges, cid)

    with ThreadPoolExecutor(max_workers=parallelism) as executor:
        futures = {executor.submit(_work, item): item for item in eligible}
        for fut in as_completed(futures):
            try:
                cid, c_edge_indices, result = fut.result()
            except Exception as e:
                print(f"[semantic] worker exception: {e}", file=sys.stderr)
                continue

            completed_count += 1
            progress = {
                "phase": "semantic_analysis",
                "community": str(completed_count),
                "total": total_eligible,
            }
            print(json.dumps({"progress": progress}), file=sys.stderr, flush=True)

            stats["communities_analyzed"] += 1
            stats["notes"][cid] = result.get("notes", "")

            for edge_idx in result.get("incoherent_edges", []):
                if 0 <= edge_idx < len(c_edge_indices):
                    edges_to_remove.add(c_edge_indices[edge_idx])
                    stats["edges_removed"] += 1

            for new_edge in result.get("new_edges", []):
                src = new_edge.get("source", "")
                tgt = new_edge.get("target", "")
                if src in nodes_by_id and tgt in nodes_by_id:
                    new_links.append({
                        "source": src,
                        "target": tgt,
                        "relation": new_edge.get("relation", "semantically_related"),
                        "confidence": "INFERRED",
                        "confidence_score": 0.7,
                        "weight": 1.0,
                        "source_file": "",
                        "description": new_edge.get("description", ""),
                    })
                    stats["edges_added"] += 1

    # Apply changes to graph
    if edges_to_remove or new_links:
        # Remove incoherent edges (in reverse order to maintain indices)
        filtered_links = [
            link for i, link in enumerate(links)
            if i not in edges_to_remove
        ]

        # Add new semantic edges
        filtered_links.extend(new_links)

        graph_data["links"] = filtered_links

        # Write back
        with open(graph_path, "w") as f:
            json.dump(graph_data, f, indent=2)

        print(
            f"[semantic] Removed {stats['edges_removed']} incoherent edges, "
            f"added {stats['edges_added']} semantic edges",
            file=sys.stderr,
        )

    return stats
