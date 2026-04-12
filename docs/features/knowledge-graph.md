# Knowledge Graph

Cortex v2 stores the knowledge graph directly in PostgreSQL. The graph is
built by the [Graphify Bridge](graphify-bridge.md) and consumed by the API,
the dashboard, and the MCP server.

## Schema

Three tables in PostgreSQL:

### `graph_nodes`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `varchar(512)` PK | Stable ID from graphify (e.g., `module_function_name`) |
| `label` | `varchar(512)` | Human-readable name |
| `type` | `varchar(64)` | `function`, `class`, `file`, `import`, `module`, ... |
| `file_type` | `varchar(32)` | `code`, `document`, `paper`, `image` |
| `source_file` | `text` | File path where the entity lives |
| `source_location` | `varchar(32)` | Line number, e.g. `L42` |
| `project_id` | `uuid` FK | References `projects(id)` |
| `repo_id` | `uuid` FK | References `repos(id)` |
| `community_id` | `varchar(64)` | Community cluster assignment |
| `properties` | `jsonb` | Extra graphify-specific metadata |

Indexed on: `project_id`, `repo_id`, `type`, `community_id`, `source_file`,
and a trigram GIN index on `label` for fuzzy search.

### `graph_edges`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` PK | Generated |
| `source_node_id` | FK to graph_nodes | Edge source |
| `target_node_id` | FK to graph_nodes | Edge target |
| `relation` | `varchar(128)` | `calls`, `imports`, `contains`, `uses`, ... |
| `confidence` | `varchar(32)` | `EXTRACTED`, `INFERRED`, `AMBIGUOUS` |
| `confidence_score` | `varchar(16)` | Float 0-1, only for INFERRED |
| `weight` | `varchar(16)` | Typically `1.0` |
| `source_file` | `text` | File where the relation was detected |
| `properties` | `jsonb` | Extra metadata |
| `project_id` | `uuid` FK | Denormalized for fast project filtering |

### `graph_communities`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `varchar(64)` PK | `{project_id}:{community_index}` |
| `community_index` | `varchar(16)` | Community number from Leiden/Louvain |
| `project_id` | `uuid` FK | Project scope |
| `member_count` | `varchar(16)` | Number of nodes in this community |
| `cohesion_score` | `varchar(16)` | Ratio of intra-community edges (0-1) |
| `god_nodes` | `jsonb` | Top connected nodes in this community |
| `surprising_connections` | `jsonb` | Unexpected cross-community edges |
| `metadata` | `jsonb` | Other details (members list, etc.) |

## Node types

Default types from graphify's AST extraction:

- **`function`, `method`** — function / method definitions
- **`class`, `interface`** — class and interface declarations
- **`file`** — file-level container nodes
- **`import`, `module`** — import statements and module references
- **`variable`, `constant`** — top-level bindings
- **`rationale_for`** — docstring/comment annotations (Python only)

## Relation types

| Relation | Meaning | Source |
|----------|---------|--------|
| `contains` | Parent-child structural containment (file→class→method) | AST |
| `imports`, `imports_from` | Import statements at file level | AST |
| `calls` | Function/method invocations (intra-file) | AST call graph |
| `method` | Method belongs to class | AST |
| `inherits`, `extends` | Class inheritance | AST |
| `implements` | Interface implementation | AST |
| `uses` | Cross-file usage (propagated from imports) | Edge enrichment |
| `sibling_of` | Functions in the same container | Edge enrichment |
| `shares_name` | Same identifier in different files | Edge enrichment |
| `semantically_related` | Inferred by Claude semantic analysis | Claude CLI |

## Confidence levels

- **EXTRACTED** — Found directly by AST parsing. Highest confidence.
- **INFERRED** — Derived by enrichment or cross-file analysis. Has a
  `confidence_score` float.
- **AMBIGUOUS** — Multiple possible interpretations; included for search but
  weighted down.

## Communities

Communities are topological clusters detected after the graph is built:

1. Primary: **Leiden algorithm** (via `graspologic`) when installed
2. Fallback: **Louvain** (via NetworkX) with a 30-second timeout
3. Last resort: **Connected components** if clustering hangs on very large graphs

Communities larger than 25% of the graph (min 10 nodes) are automatically
re-partitioned to prevent a single "giant" community.

## God nodes

For each community, the top-N most connected nodes are stored in
`god_nodes` jsonb:

```json
[
  { "id": "types.go", "label": "types.go", "edges": 348 },
  { "id": "errnoErr", "label": "errnoErr()", "edges": 370 }
]
```

God nodes are architectural hubs — components that many other entities
depend on. They're great entry points for understanding a codebase.

## Sizing and limits

After scanning the two reference projects (`ap` + `lifi-manager`, 14 repos):

| Metric | Count |
|--------|-------|
| Total nodes | 42,914 |
| Total edges | 76,430 |
| Communities | 821 |
| Largest repo | `middleware` (24,400 nodes, 39,938 edges) |
| Scan time per repo | 0.3s – 3s |

## Related docs

- [Graph Exploration](graph-exploration.md) — how the dashboard visualizes this data
- [Graphify Bridge](graphify-bridge.md) — how the graph is built
- [Edge Enrichment](edge-enrichment.md) — how cross-file edges are inferred
