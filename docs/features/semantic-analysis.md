# Semantic Analysis via Claude CLI

Cortex v2 augments the deterministic AST-based graph with an optional
**semantic analysis pass** powered by Claude CLI (no API key required).
This pass:

1. **Verifies link coherence** — identifies false positives (e.g. a class
   "calls" a config file)
2. **Enriches the graph** — adds semantic relations that AST can't see
   (e.g. "implements pattern X", "conceptually related")
3. **Triggers re-clustering** — communities are recomputed after enrichment

## How it works

For each community in the graph (skipping singletons), the scanner:

1. Packs the community's nodes and edges into a structured prompt
2. Calls `claude --print --model haiku --max-turns 1 "<prompt>"`
3. Parses the returned JSON (strict format, no markdown)
4. Applies the edits: removes incoherent edges, adds new semantic ones

The prompt asks Claude to respond **only** with valid JSON:

```json
{
  "incoherent_edges": [0, 5, 12],
  "new_edges": [
    {
      "source": "exact_node_id",
      "target": "exact_node_id",
      "relation": "uses",
      "description": "brief reason"
    }
  ],
  "notes": "One sentence summary of the community's purpose"
}
```

## Enabling / disabling

Controlled by the `CORTEX_SEMANTIC_ANALYSIS` environment variable:

| Value | Behavior |
|-------|----------|
| `true` (default) | Run semantic analysis after edge enrichment |
| `false` | Skip entirely — useful for CI or when CLI is unavailable |

Also available as a CLI flag:

```bash
cortex-scan --source /repo --output /tmp/g.json --no-semantic
```

## Graceful degradation

The analyzer **never blocks the pipeline**. If:

- `claude` CLI is not in `PATH` → skipped with warning on stderr
- `claude` CLI exits non-zero → community skipped, others continue
- Claude's response isn't valid JSON → community skipped
- Timeout (120s per community) → community skipped

The rest of the scan completes normally.

## Post-enrichment re-clustering

Because the graph changes (edges added and removed), communities detected
**before** the semantic pass no longer reflect the true topology. The
scanner therefore re-runs clustering **after** enrichment:

```
1. extract() → initial graph
2. Export initial graph.json
3. enrich_cross_file_edges() → file→function propagation
4. (optional) run_semantic_analysis() → Claude CLI coherence
5. Re-load the enriched graph.json
6. safe_cluster() → fresh communities
7. god_nodes(), surprising_connections() → fresh analysis
8. Export final graph.json with communities
```

This guarantees that communities you see in the dashboard match the actual
edges that were imported into PostgreSQL.

## Cost and throughput

- **No API cost**: uses your local Claude Code subscription via CLI
- **Latency**: ~3-10 seconds per community (depends on size)
- **Parallelism**: sequential today; parallel execution is a future improvement
- **For 713 communities (middleware repo)**: ~30-60 minutes full semantic
  analysis. For production scans, you may want to run this offline or
  disable it with `CORTEX_SEMANTIC_ANALYSIS=false`.

## Example output

On a successful pass, stderr shows:

```
[semantic] Analyzing community 42 (size 15)
[semantic] Analyzing community 43 (size 8)
[semantic] Removed 3 incoherent edges, added 2 semantic edges
```

And the final result dict includes:

```json
{
  "semantic_analysis": {
    "edges_removed": 3,
    "edges_added": 2,
    "communities_analyzed": 2,
    "notes": {
      "42": "Authentication flow with MKA/802.1X",
      "43": "Config parsing utilities"
    }
  }
}
```

## Files

- `services/graphify-bridge/cortex_bridge/semantic_analyzer.py`
- `services/graphify-bridge/cortex_bridge/scanner.py` (orchestration)

## Limitations & future work

- **Sequential**: each community is analyzed one at a time. Parallel
  workers (thread pool) would be a significant speedup.
- **No retry**: a single failed community is skipped, not retried.
- **Prompt size**: communities with >50 nodes or >100 edges are truncated
  in the prompt to fit context windows. For very large communities,
  this may miss important edges.
- **Validation**: new edges are only added if both source and target node
  IDs exist in the graph. Hallucinated node IDs are silently dropped.
