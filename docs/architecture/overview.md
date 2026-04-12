# Architecture Overview

Cortex v2 is a polyglot knowledge hub: a **Python bridge** extracts code
graphs, a **Node.js API** serves them, a **React dashboard** visualizes
them, and an **MCP server** exposes them to AI assistants.

## Components

```
┌────────────────────────────────────────────────────────────────┐
│                        User surfaces                            │
├──────────────────┬──────────────────┬───────────────────────────┤
│  React Dashboard │   MCP Server     │   External clients        │
│    (:5173 dev)   │   (stdio)        │   (Cursor, CLI, etc.)     │
└────────┬─────────┴────────┬─────────┴───────────┬───────────────┘
         │                  │                     │
         └──────────────────┼─────────────────────┘
                            │ HTTP (REST + WebSocket + SSE)
                            ▼
              ┌───────────────────────────────┐
              │     Hono API (:3100)          │
              │  • auth middleware            │
              │  • rate limit middleware      │
              │  • CORS middleware            │
              │  • WebSocket hub              │
              └───────────┬───────────────────┘
                          │
         ┌────────────────┼────────────────────┐
         │                │                    │
         ▼                ▼                    ▼
  ┌───────────┐   ┌──────────────┐   ┌────────────────┐
  │PostgreSQL │   │Redis / BullMQ│   │  Ollama / API  │
  │           │   │   queues     │   │                │
  │ projects  │   │              │   │ qwen3.5:9b     │
  │ repos     │   │ cortex-scan  │   │ claude-haiku   │
  │ scan_jobs │   │ cortex-diff  │   │ (via CLI/SDK)  │
  │ graph_*   │   │              │   │                │
  └─────┬─────┘   └──────┬───────┘   └────────────────┘
        │                │
        └────────────────┘
                │
                ▼
  ┌────────────────────────────────────────┐
  │    Node.js ingestion worker            │
  │    packages/ingestion                  │
  │                                        │
  │  1. Clone / pull repo                  │
  │  2. Spawn cortex-scan (Python)         │
  │  3. Import graph.json → PostgreSQL     │
  │  4. Update scan job status             │
  └──────────────┬─────────────────────────┘
                 │ subprocess
                 ▼
  ┌────────────────────────────────────────┐
  │    Python graphify bridge              │
  │    services/graphify-bridge            │
  │                                        │
  │  detect → extract → build → enrich     │
  │  → semantic → cluster → export         │
  └────────────────────────────────────────┘
```

## Data flow for a scan

1. **Trigger** — `POST /api/scan` with `projectId`, `repoId`, `branch`,
   `mode` ("full" or "diff"). Creates a `scan_jobs` row and enqueues a
   BullMQ job.
2. **Worker picks up the job** — `packages/ingestion/workers/scan-worker.ts`.
   Loads repo metadata from DB.
3. **Clone or pull** — `cloneOrPullCached()` fetches the repo to
   `/tmp/cortex-repos/<slug>` with auth.
4. **Spawn graphify** — `packages/ingestion/src/pipeline.ts` runs
   `cortex-scan --source /tmp/cortex-repos/<slug> --output /tmp/graph.json`.
5. **Python scanner** — builds the graph, enriches edges, runs optional
   semantic analysis, clusters, and writes `graph.json`.
6. **Node importer** — `graphify-importer.ts` reads the JSON, upserts
   nodes/edges/communities into PostgreSQL.
7. **Finalize** — scan job marked `completed`, repo's `last_scanned_commit`
   updated, `scan.completed` event inserted.
8. **Dashboard updates** — WebSocket notifies connected clients.

## Data flow for a query

### Graph exploration (dashboard)

```
Browser → GET /api/graph/summary?mode=hubs&limit=500
       → PgGraphClient.getTopHubs()
       → SELECT ... FROM graph_nodes ORDER BY degree DESC LIMIT 500
       → JSON response with nodes + inter-hub edges
       → vis-network renders with physics stabilization
```

### Chat query

```
Browser → POST /api/chat { message, mode }
       → routeQuery() selects mode: fast | smart | agent
       → buildContext() queries graph_nodes for relevant entities
       → Engine streams tokens via SSE:
             fast   → Ollama (qwen3.5:9b)
             smart  → Claude (CLI or API)
             agent  → Ollama + tools
       → Browser accumulates tokens in ChatWidget
```

## Storage strategy

| Store | Purpose | Scale |
|-------|---------|-------|
| **PostgreSQL 16 + pgvector** | Primary graph store, scan metadata, auth | 100k+ nodes per project |
| **Redis** | BullMQ queues, graph cache (TTL 30s), query cache | Volatile |
| **File cache** | Cloned repos under `/tmp/cortex-repos/` | Per-host |
| **Python venv** | `services/graphify-bridge/.venv` with graphify + tree-sitter | Per-host |

## Workflow orchestration

BullMQ queues (Redis-backed):
- `cortex-scan` — full repo scans (concurrency 1 per worker)
- `cortex-diff` — incremental diff scans (concurrency 2)

Workers run in the `cortex-ingestion` container (Docker) or natively via
`make dev-workers`.

## Communication

| Channel | Protocol | Purpose |
|---------|----------|---------|
| Dashboard → API | HTTP REST + SSE | Queries, graph data, chat |
| Dashboard → API | WebSocket | Real-time scan progress, events |
| API → Postgres | SQL | Primary data access |
| API → Redis | RESP | Queue producer, cache |
| Worker → API-less | subprocess | Direct graphify CLI invocation |
| Worker → Postgres | SQL | Scan state, graph import |
| MCP → API | HTTP REST | Tool calls |

## Tech stack

### Backend

- **Node.js 22** — API, workers, MCP server
- **Hono** — HTTP framework
- **Drizzle ORM** — PostgreSQL access
- **BullMQ** — queue management
- **@modelcontextprotocol/sdk** — MCP server
- **@anthropic-ai/sdk** — Claude API client

### Frontend

- **React 19** + **Vite 6** + **TypeScript 5**
- **Tailwind CSS 4**
- **vis-network** — graph visualization
- **d3-force** — lightweight force layouts (legacy, being phased out)

### Python

- **Python 3.10+**
- **graphifyy** ≥ 0.4.1 — AST extraction, 20 languages
- **networkx** — graph algorithms
- **graspologic** (optional) — Leiden community detection

### Infrastructure

- **Docker Compose** — postgres, redis, optionally ollama
- **Ollama** — local LLM runtime (Metal / CUDA / ROCm)
- **Claude Code CLI** — optional for Haiku via terminal

## Related docs

- [Scan Pipeline](scan-pipeline.md) — detailed scan flow
- [Storage](storage.md) — schema and indexes
- [Knowledge Graph](../features/knowledge-graph.md) — graph data model
- [Graphify Bridge](../features/graphify-bridge.md) — Python extraction layer
