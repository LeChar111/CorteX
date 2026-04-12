# Graphify Bridge

Cortex v2 delegates all code parsing to [graphify](https://github.com/safishamsi/graphify),
a Python library that extracts knowledge graphs from source code using
tree-sitter ASTs. The "bridge" is a thin Python wrapper at
`services/graphify-bridge/` that the Node.js scan worker invokes as a
subprocess.

## Why graphify?

Cortex v1 used a Rust pipeline (`cortex-parser`, `cortex-extractor`) with
tree-sitter for 5 languages and Claude Haiku for relation extraction. The
migration to graphify was motivated by:

| Before (v1) | After (v2, graphify) |
|-------------|----------------------|
| 5 languages (TS/TSX/JS/Python/Go) | **20 languages** (+ Rust, Java, C/C++, Ruby, C#, Kotlin, Scala, PHP, Swift, Lua, Zig, PowerShell, Elixir, Obj-C, Julia) |
| LLM on every file for relations | **Zero LLM** for structural relations (imports, calls, contains, inherits) |
| No call graph (too noisy) | **Deterministic call graph** via AST body traversal |
| No community detection | **Leiden/Louvain clustering** |
| No god nodes | **Top-N hubs** per community |
| Cost: every scan = many Haiku calls | **Cost: zero** for code — LLM only for docs/images/video |

## Architecture

```
Node.js scan worker
       │
       │ spawn('cortex-scan', [--source, --output, --project-id, ...])
       ▼
Python CLI entrypoint (services/graphify-bridge/cortex_bridge/cli.py)
       │
       ▼
scanner.scan_directory()
   1. detect()       → classify files (code / doc / image / video)
   2. extract()      → AST parse, collect nodes & edges
   3. build_from_json() → NetworkX graph
   4. enrich_cross_file_edges() → propagate imports to functions
   5. (optional) run_semantic_analysis() → Claude CLI coherence pass
   6. safe_cluster() → Leiden/Louvain with 30s timeout
   7. god_nodes(), surprising_connections() → analysis
   8. to_json()      → write graph.json
       │
       ▼
Node.js importer (packages/ingestion/src/graphify-importer.ts)
   → Upsert into PostgreSQL graph_nodes / graph_edges / graph_communities
```

## Pipeline phases

The scanner reports progress via JSON lines on stderr:

```json
{"progress": {"phase": "extract", "files": 2214}}
{"progress": {"phase": "enrichment", "files": 2214}}
{"progress": {"phase": "semantic_analysis", "files": 2214}}
{"progress": {"phase": "final_cluster", "files": 2214}}
{"progress": {"phase": "export", "files": 2214}}
```

The Node worker parses these lines and updates the scan job stats in real
time, so the dashboard can show progress.

## CLI contract

```bash
cortex-scan \
  --source /path/to/repo \
  --output /tmp/cortex-graph-<uuid>.json \
  --project-id <uuid> \
  --project-name "My Project" \
  --repo-id <uuid> \
  --repo-name "my-repo" \
  [--no-semantic]
```

Stdout receives a single JSON result:
```json
{
  "graph_path": "/tmp/cortex-graph-<uuid>.json",
  "stats": { "total_files": 2214, "nodes": 24400, "edges": 39938, "communities": 713, "duration_s": 3.16 },
  "communities": { "0": { "members": [...], "size": 347, "cohesion": 0.68 } },
  "god_nodes": [...],
  "surprising_connections": [...],
  "semantic_analysis": { ... }
}
```

**Stdout pollution caveat**: graphify's internal progress messages also go
to stdout. The CLI redirects Python's stdout to stderr during scanning and
only restores it to print the final JSON. The Node.js parser reads the
**last** JSON block on stdout to be robust.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `CORTEX_SEMANTIC_ANALYSIS` | `true` | Enable Claude CLI coherence pass |
| `CORTEX_SCAN_BIN` | (auto-detect) | Override path to `cortex-scan` binary |

The Node.js pipeline auto-detects the CLI via:
1. `CORTEX_SCAN_BIN` env var (explicit override)
2. Local venv at `services/graphify-bridge/.venv/bin/cortex-scan`
3. PATH fallback (`cortex-scan` command)

## Installation

```bash
make setup-graphify
```

which runs:
```bash
cd services/graphify-bridge
python3 -m venv .venv
.venv/bin/pip install -e .
```

Dependencies (from `pyproject.toml`):
- `graphifyy>=0.4.0` — the core extraction library
- `networkx>=3.0` — graph data structure
- Optional: `graspologic` for Leiden (install manually:
  `.venv/bin/pip install graspologic` — requires system `libgomp1`)

## Performance

| Metric | Value |
|--------|-------|
| Cold start (interpreter + imports) | ~300ms |
| AST extraction | ~1ms/file (cold), <0.1ms/file (cached via SHA256) |
| Build graph | O(nodes + edges), ~0.02s for 24k nodes |
| Cluster (Leiden) | O(edges), sub-second for <10k edges |
| Cluster (Louvain fallback) | Can hang on graphs with super-hubs (degree >200) |
| Full scan (2214 files) | ~3.2s total |

### Large project safety

For repos with thousands of files and super-connected nodes (e.g.
FastAPI), NetworkX's Louvain can enter an infinite loop. The scanner
wraps clustering in a **30-second timeout thread**:

```python
def safe_cluster(G, timeout_seconds=30):
    thread = threading.Thread(target=do_cluster)
    thread.start()
    thread.join(timeout=timeout_seconds)
    if thread.is_alive():
        # Fallback to connected components
        return {i: list(comp) for i, comp in enumerate(
            nx.connected_components(G.to_undirected()))}
```

## Files

- `services/graphify-bridge/pyproject.toml` — Python package manifest
- `services/graphify-bridge/cortex_bridge/__init__.py`
- `services/graphify-bridge/cortex_bridge/scanner.py` — orchestration
- `services/graphify-bridge/cortex_bridge/cli.py` — entry point
- `services/graphify-bridge/cortex_bridge/edge_enrichment.py` — cross-file edges
- `services/graphify-bridge/cortex_bridge/semantic_analyzer.py` — Claude CLI pass
- `packages/ingestion/src/pipeline.ts` — Node-side subprocess invocation
- `packages/ingestion/src/graphify-importer.ts` — graph.json → PostgreSQL

## JSON format

graphify uses NetworkX's node-link format:

```json
{
  "directed": true,
  "nodes": [
    {
      "id": "module_function_name",
      "label": "function_name()",
      "type": "function",
      "file_type": "code",
      "source_file": "path/to/file.py",
      "source_location": "L42",
      "community": 0,
      "project_id": "uuid",
      "repo_id": "uuid"
    }
  ],
  "links": [
    {
      "source": "node_id_1",
      "target": "node_id_2",
      "relation": "calls",
      "confidence": "EXTRACTED",
      "weight": 1.0
    }
  ]
}
```

**Key-name caveat**: `to_json()` emits `"links"`, but `build_from_json()`
reads `"edges"`. The scanner does the key rename when re-loading
enriched graphs.
