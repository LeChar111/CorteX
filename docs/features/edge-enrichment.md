# Edge Enrichment

AST-based extraction tells you that file A imports file B, but it doesn't
tell you that function `foo` in A calls function `bar` in B. Without
enrichment, **63% of nodes end up with degree ≤ 1** — isolated islands.

The enrichment pass in `services/graphify-bridge/cortex_bridge/edge_enrichment.py`
propagates file-level imports to the function/class level, creating
meaningful cross-file `uses` edges.

## Three strategies

### 1. Cross-file `uses` (imports propagation)

For each `imports` / `imports_from` edge between two files:

- Collect the functions/classes/methods in the source file
- Collect the functions/classes/methods in the target file
- Create a `uses` edge between them when the source entity's label
  references the target entity's name

Confidence: `INFERRED`, score `0.6`.

### 2. `sibling_of` (same-container connectivity)

For each `contains` relationship (file → class, class → method), connect
all siblings to each other with a `sibling_of` edge.

Example: a class with 5 methods produces 10 sibling edges, so all methods
are reachable from each other even without direct calls.

Confidence: `EXTRACTED` (structural, deterministic).

### 3. `shares_name` (cross-file name matching)

For entities with identical cleaned names (e.g. function `createUser` in
file A and class `User` in file B), a `shares_name` edge is created.

This catches conventional naming patterns: `UserService` / `userController`
/ `createUser` often belong together even without explicit structural
links.

Confidence: `INFERRED`, score `0.5`.

## Pipeline position

Enrichment runs **after** initial extraction and **before** semantic
analysis:

```
extract() → build → initial graph.json
                ↓
         enrich_cross_file_edges()  ← adds sibling, uses, shares_name
                ↓
         run_semantic_analysis()   ← Claude CLI, optional
                ↓
         re-cluster + finalize
```

This order matters: Claude sees the enriched graph when evaluating
coherence, so it can remove enrichment edges that are wrong without
losing AST-verified edges.

## Results

On the middleware repo (2,214 Go/TS files):

| Strategy | Edges added |
|----------|-------------|
| Cross-file `uses` | Variable (depends on import structure) |
| `sibling_of` | Thousands (cheap, O(children²) per container) |
| `shares_name` | Hundreds (rarer but valuable) |

Combined, isolated-node rate typically drops from **~60%** to **<20%**.

## Dedup

All strategies check `existing_edges` (a set of `(src, tgt)` tuples,
bidirectional) before adding. An entity pair can be connected by at most
one edge even if multiple strategies apply.

## Limits

- **Only real entities**: nodes with `type` in `{function, method, class,
  interface, variable, constant}` participate. Import and file nodes are
  excluded.
- **Minimum name length**: names shorter than 3 characters are ignored to
  reduce false positives (e.g. `i`, `js`, `fn`).
- **In-file size**: there's no cap, but containers with >100 children
  produce O(n²) sibling edges that could balloon the graph.

## Files

- `services/graphify-bridge/cortex_bridge/edge_enrichment.py` — all three strategies
- `services/graphify-bridge/cortex_bridge/scanner.py` — invokes enrichment

## Configuration

The enrichment pass has no env vars today. To disable it, comment out the
call in `scanner.py`. Individual strategies can be disabled by editing the
module directly. A future improvement would be to expose toggles via env.
