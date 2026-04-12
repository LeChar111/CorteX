"""Cross-file edge enrichment.

Propagates file-level imports to function/class level by analyzing
which entities in file A reference entities in file B.
"""

import json
import sys
import networkx as nx


def enrich_cross_file_edges(graph_path: str) -> dict:
    """Enrich graph with cross-file function-level edges.

    Strategy:
    1. Find all file-level import edges (imports, imports_from)
    2. For each import edge A->B, find functions/classes in A and B
    3. For functions in A that share names referenced by functions in B
       (name matching, parameter matching), create 'uses' edges
    4. Connect functions in the same file that aren't yet connected
       via 'internal_call' edges based on name references

    Returns stats dict.
    """
    with open(graph_path) as f:
        data = json.load(f)

    nodes = data.get("nodes", [])
    links = data.get("links", [])

    nodes_by_id = {n["id"]: n for n in nodes}

    # Build file -> entities mapping
    file_entities: dict[str, list[dict]] = {}
    for node in nodes:
        sf = node.get("source_file", "")
        if sf:
            file_entities.setdefault(sf, []).append(node)

    # Find file-level import edges
    import_relations = {"imports", "imports_from", "import"}
    file_imports: list[tuple[str, str]] = []  # (source_file, target_file)

    for link in links:
        rel = link.get("relation", "")
        if rel in import_relations:
            src_node = nodes_by_id.get(link["source"])
            tgt_node = nodes_by_id.get(link["target"])
            if src_node and tgt_node:
                src_file = src_node.get("source_file", "")
                tgt_file = tgt_node.get("source_file", "")
                if src_file and tgt_file and src_file != tgt_file:
                    file_imports.append((src_file, tgt_file))

    # Also find import edges where source/target are file nodes
    for link in links:
        src_node = nodes_by_id.get(link["source"])
        tgt_node = nodes_by_id.get(link["target"])
        if src_node and tgt_node:
            if src_node.get("type") == "file" and tgt_node.get("type") == "file":
                sf = src_node.get("source_file", src_node.get("id", ""))
                tf = tgt_node.get("source_file", tgt_node.get("id", ""))
                if sf and tf and sf != tf:
                    file_imports.append((sf, tf))

    file_imports = list(set(file_imports))

    # Build existing edge set for dedup
    existing_edges = set()
    for link in links:
        existing_edges.add((link["source"], link["target"]))
        existing_edges.add((link["target"], link["source"]))

    new_edges = []
    stats = {"cross_file_uses": 0, "name_match_edges": 0}

    # Strategy 1: For each file import, connect entities by name matching
    # If file A imports file B, and entity "Foo" in A shares a name substring
    # with entity "Foo" in B, create a 'uses' edge
    for src_file, tgt_file in file_imports:
        src_entities = [e for e in file_entities.get(src_file, [])
                       if e.get("type") in ("function", "class", "method", "interface", "variable", "constant")]
        tgt_entities = [e for e in file_entities.get(tgt_file, [])
                       if e.get("type") in ("function", "class", "method", "interface", "variable", "constant")]

        if not src_entities or not tgt_entities:
            continue

        # Build name index for target entities
        tgt_names: dict[str, list[dict]] = {}
        for e in tgt_entities:
            # Extract clean name from label (remove () suffix, etc.)
            label = e.get("label", e.get("id", ""))
            clean = label.rstrip("()").split(".")[-1].split("::")[-1].lower()
            if clean and len(clean) > 2:  # Skip very short names
                tgt_names.setdefault(clean, []).append(e)

        # For each source entity, check if its label references any target entity
        for src_e in src_entities:
            src_label = src_e.get("label", src_e.get("id", "")).lower()
            # Check all node IDs and labels in source for references to target names
            for tgt_name, tgt_list in tgt_names.items():
                # Direct name match in the source entity's label or ID
                if tgt_name in src_label or tgt_name in src_e.get("id", "").lower():
                    continue  # Skip self-references

                for tgt_e in tgt_list:
                    edge_key = (src_e["id"], tgt_e["id"])
                    if edge_key not in existing_edges:
                        new_edges.append({
                            "source": src_e["id"],
                            "target": tgt_e["id"],
                            "relation": "uses",
                            "confidence": "INFERRED",
                            "confidence_score": 0.6,
                            "weight": 0.8,
                            "source_file": src_file,
                        })
                        existing_edges.add(edge_key)
                        stats["cross_file_uses"] += 1

    # Strategy 2: Connect all entities within the same file that share
    # a contains relationship chain (file -> class -> method)
    # This helps connect methods to their sibling methods
    contains_edges = [(l["source"], l["target"]) for l in links if l.get("relation") == "contains"]
    parent_children: dict[str, list[str]] = {}
    for parent, child in contains_edges:
        parent_children.setdefault(parent, []).append(child)

    for parent, children in parent_children.items():
        if len(children) < 2:
            continue
        # Connect sibling entities (methods in same class, functions in same module)
        for i, child_a in enumerate(children):
            for child_b in children[i+1:]:
                edge_key = (child_a, child_b)
                if edge_key not in existing_edges:
                    node_a = nodes_by_id.get(child_a, {})
                    node_b = nodes_by_id.get(child_b, {})
                    # Only connect if both are functions/methods (not imports)
                    if (node_a.get("type") in ("function", "method", "class") and
                        node_b.get("type") in ("function", "method", "class")):
                        new_edges.append({
                            "source": child_a,
                            "target": child_b,
                            "relation": "sibling_of",
                            "confidence": "EXTRACTED",
                            "confidence_score": 1.0,
                            "weight": 0.5,
                            "source_file": node_a.get("source_file", ""),
                        })
                        existing_edges.add(edge_key)
                        stats["name_match_edges"] += 1

    # Strategy 3: Connect entities across files if their names match exactly
    # (e.g., function "createUser" in file A and class "User" in file B)
    all_entities = [n for n in nodes if n.get("type") in ("function", "class", "method", "interface")]
    name_to_entities: dict[str, list[dict]] = {}
    for e in all_entities:
        label = e.get("label", e.get("id", ""))
        # Extract base name
        clean = label.rstrip("()").split(".")[-1].split("::")[-1].lower()
        if clean and len(clean) > 3:
            name_to_entities.setdefault(clean, []).append(e)

    for name, entities in name_to_entities.items():
        if len(entities) < 2:
            continue
        # Connect entities with same name across different files
        for i, e_a in enumerate(entities):
            for e_b in entities[i+1:]:
                file_a = e_a.get("source_file", "")
                file_b = e_b.get("source_file", "")
                if file_a and file_b and file_a != file_b:
                    edge_key = (e_a["id"], e_b["id"])
                    if edge_key not in existing_edges:
                        new_edges.append({
                            "source": e_a["id"],
                            "target": e_b["id"],
                            "relation": "shares_name",
                            "confidence": "INFERRED",
                            "confidence_score": 0.5,
                            "weight": 0.6,
                            "source_file": "",
                        })
                        existing_edges.add(edge_key)
                        stats["name_match_edges"] += 1

    # Strategy 4: Connect entities in the same directory (co-location)
    # Files in the same directory are likely related (same module/feature)
    stats["co_location_edges"] = 0
    dir_entities: dict[str, list[dict]] = {}
    for node in nodes:
        sf = node.get("source_file", "")
        if not sf:
            continue
        # Use parent directory as grouping key
        parts = sf.replace("\\", "/").rsplit("/", 1)
        parent_dir = parts[0] if len(parts) > 1 else ""
        if parent_dir:
            dir_entities.setdefault(parent_dir, []).append(node)

    for dir_path, entities in dir_entities.items():
        # Only connect "main" entities (files, classes, exported functions)
        main_entities = [e for e in entities
                        if e.get("type") in ("file", "class", "module", "interface", "function", "method")
                        or e.get("id", "").endswith((".ts", ".tsx", ".js", ".jsx", ".py"))]
        if len(main_entities) < 2:
            continue
        # Connect file-level nodes in same directory
        file_nodes = [e for e in main_entities if e.get("type") == "file" or "." in e.get("label", "")]
        non_file_nodes = [e for e in main_entities if e not in file_nodes]
        targets = file_nodes if file_nodes else non_file_nodes
        if len(targets) < 2:
            continue
        # Connect each pair of file nodes (they co-exist in the same module)
        for i, e_a in enumerate(targets):
            for e_b in targets[i+1:]:
                edge_key = (e_a["id"], e_b["id"])
                if edge_key not in existing_edges:
                    new_edges.append({
                        "source": e_a["id"],
                        "target": e_b["id"],
                        "relation": "co_located",
                        "confidence": "INFERRED",
                        "confidence_score": 0.4,
                        "weight": 0.3,
                        "source_file": dir_path,
                    })
                    existing_edges.add(edge_key)
                    stats["co_location_edges"] += 1
                    # Cap co-location edges per directory to avoid explosion
                if stats["co_location_edges"] > 5000:
                    break
            if stats["co_location_edges"] > 5000:
                break
        if stats["co_location_edges"] > 5000:
            break

    # Strategy 5: Ensure every node has at least one edge
    # Find isolated nodes and connect them to the nearest node in the same file
    stats["isolation_fix_edges"] = 0
    connected_nodes = set()
    for link in links:
        connected_nodes.add(link["source"])
        connected_nodes.add(link["target"])
    for e in new_edges:
        connected_nodes.add(e["source"])
        connected_nodes.add(e["target"])

    isolated_nodes = [n for n in nodes if n["id"] not in connected_nodes]
    for iso_node in isolated_nodes:
        sf = iso_node.get("source_file", "")
        if not sf:
            continue
        # Find another node in the same file that IS connected
        same_file = [n for n in file_entities.get(sf, []) if n["id"] != iso_node["id"] and n["id"] in connected_nodes]
        if not same_file:
            # Fallback: any node in same file
            same_file = [n for n in file_entities.get(sf, []) if n["id"] != iso_node["id"]]
        if same_file:
            target = same_file[0]
            edge_key = (iso_node["id"], target["id"])
            if edge_key not in existing_edges:
                new_edges.append({
                    "source": iso_node["id"],
                    "target": target["id"],
                    "relation": "defined_in_same_file",
                    "confidence": "EXTRACTED",
                    "confidence_score": 1.0,
                    "weight": 0.5,
                    "source_file": sf,
                })
                existing_edges.add(edge_key)
                connected_nodes.add(iso_node["id"])
                stats["isolation_fix_edges"] += 1

    # Strategy 6: Cross-layer API matching (frontend API clients <-> backend routes)
    # Match files like "products.api.ts" (frontend) with "product.controller.ts" (backend)
    # and connect them via 'api_call' edges
    stats["api_bridge_edges"] = 0

    frontend_api_nodes = []
    backend_ctrl_nodes = []
    backend_service_nodes = []

    for node in nodes:
        sf = node.get("source_file", "")
        label = node.get("label", "")
        node_id = node.get("id", "")
        if not sf:
            continue

        # Frontend API clients: *.api.ts files or FrontBaseApi references
        if ("frontend" in sf or "lib/api" in sf) and (".api." in label or ".api." in sf):
            frontend_api_nodes.append(node)

        # Backend controllers
        if "backend" in sf and ("controller" in sf.lower() or "controller" in label.lower()):
            backend_ctrl_nodes.append(node)

        # Backend services
        if "backend" in sf and ("service" in sf.lower() or "Service" in label):
            backend_service_nodes.append(node)

    # Extract domain name from filename only (not path segments — too noisy)
    def extract_domain(label: str) -> str | None:
        """Extract the primary domain keyword from a filename label."""
        # Strip extensions and suffixes: products.api.ts -> products
        clean = label.lower()
        for suffix in (".tsx", ".ts", ".js", ".jsx", ".py",
                       ".api", ".controller", ".service", ".model",
                       ".routes", ".route", ".middleware", ".utils", ".types"):
            clean = clean.replace(suffix, "")
        # Remove common prefixes/suffixes
        for word in ("controller", "service", "view", "modal", "form",
                     "create", "update", "delete", "get", "list", "detail"):
            clean = clean.replace(word, "")
        # Clean up separators and take the main word
        parts = [p for p in clean.replace("-", " ").replace("_", " ").replace(".", " ").split() if len(p) > 3]
        return parts[0] if parts else None

    # Match frontend API nodes to backend controllers/services by domain
    # Require the SAME domain keyword (e.g. "product" in both)
    backend_targets = backend_ctrl_nodes + backend_service_nodes
    for fe_node in frontend_api_nodes:
        fe_domain = extract_domain(fe_node.get("label", ""))
        if not fe_domain:
            continue

        for be_node in backend_targets:
            be_domain = extract_domain(be_node.get("label", ""))
            if not be_domain:
                continue
            # Require exact match or substring containment of the domain
            if fe_domain == be_domain or (len(fe_domain) > 4 and fe_domain in be_domain) or (len(be_domain) > 4 and be_domain in fe_domain):
                edge_key = (fe_node["id"], be_node["id"])
                if edge_key not in existing_edges:
                    new_edges.append({
                        "source": fe_node["id"],
                        "target": be_node["id"],
                        "relation": "api_call",
                        "confidence": "INFERRED",
                        "confidence_score": 0.7,
                        "weight": 0.8,
                        "source_file": fe_node.get("source_file", ""),
                    })
                    existing_edges.add(edge_key)
                    stats["api_bridge_edges"] += 1

    # Strategy 7: Connect shared package types to backend/frontend consumers
    # Match files in packages/shared with consumers that have the SAME label
    stats["shared_bridge_edges"] = 0
    shared_nodes = [n for n in nodes if "packages/" in n.get("source_file", "") or "shared" in n.get("source_file", "")]

    # Build index of non-shared nodes by label for O(1) lookup
    label_index: dict[str, list[dict]] = {}
    for node in nodes:
        sf = node.get("source_file", "")
        if not sf or "packages/" in sf:
            continue
        label = node.get("label", "").lower().replace(".ts", "").replace(".tsx", "")
        if len(label) > 4:
            label_index.setdefault(label, []).append(node)

    for shared_node in shared_nodes:
        shared_label = shared_node.get("label", "").lower()
        shared_clean = shared_label.replace(".ts", "").replace(".tsx", "").replace(".types", "").replace(".d", "")
        if len(shared_clean) < 5:
            continue

        # Only exact label match
        matches = label_index.get(shared_clean, [])
        for match_node in matches:
            edge_key = (shared_node["id"], match_node["id"])
            if edge_key not in existing_edges:
                new_edges.append({
                    "source": shared_node["id"],
                    "target": match_node["id"],
                    "relation": "type_dependency",
                    "confidence": "INFERRED",
                    "confidence_score": 0.6,
                    "weight": 0.6,
                    "source_file": "",
                })
                existing_edges.add(edge_key)
                stats["shared_bridge_edges"] += 1

    if new_edges:
        data["links"].extend(new_edges)
        with open(graph_path, "w") as f:
            json.dump(data, f)

        total = (stats["cross_file_uses"] + stats["name_match_edges"]
                 + stats.get("co_location_edges", 0) + stats.get("isolation_fix_edges", 0)
                 + stats.get("api_bridge_edges", 0) + stats.get("shared_bridge_edges", 0))
        print(
            f"[enrichment] Added {total} edges "
            f"({stats['cross_file_uses']} uses, {stats['name_match_edges']} name, "
            f"{stats.get('co_location_edges', 0)} co-loc, {stats.get('isolation_fix_edges', 0)} iso-fix, "
            f"{stats.get('api_bridge_edges', 0)} api-bridge, {stats.get('shared_bridge_edges', 0)} shared-bridge)",
            file=sys.stderr,
        )

    return stats
