# Cortex

Knowledge Hub for Multi-Project AI Teams. Cortex scans, indexes, and connects code across multiple repositories to build a queryable knowledge graph accessible via MCP (Model Context Protocol), REST API, and a web dashboard.

## Architecture

```
                    +-----------------+
                    |   Dashboard     |  React 19 + Vite + Tailwind
                    |   :5173 (dev)   |
                    +--------+--------+
                             |
                    +--------v--------+
                    |   Serving API   |  Hono + WebSocket
                    |     :3100       |
                    +--+---------+----+
                       |         |
              +--------v--+  +---v-----------+
              | PostgreSQL |  |    Redis      |
              |  pgvector  |  |   BullMQ      |
              |   :5432    |  |   :6379       |
              +--------+---+  +---+-----------+
                       |          |
                    +--v----------v---+
                    | Ingestion Worker |  Tree-sitter + LLM extraction
                    +---------+-------+
                              |
                    +---------v-------+
                    |    LightRAG     |  Graph RAG engine
                    |     :9621       |
                    +---------+-------+
                              |
                    +---------v-------+
                    |     Ollama      |  Local LLM + Embeddings
                    |    :11434       |
                    +-----------------+

                    +-----------------+
                    |    MCP Server   |  12 tools via stdio
                    |  (Claude Code)  |
                    +-----------------+
```

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd cortex
pnpm install

# 2. Configure
cp .env.example .env
# Edit .env with your settings

# 3. Start infrastructure
docker compose up -d

# 4. Initialize Ollama models
./scripts/init-ollama.sh

# 5. Run database migrations
pnpm migrate

# 6. Seed projects from config
pnpm seed

# 7. Start all services (API + Dashboard + Workers)
pnpm dev
```

The dashboard is available at http://localhost:5173, API at http://localhost:3100.

## Packages

| Package | Path | Description |
|---------|------|-------------|
| **@cortex/serving** | `packages/serving/` | HTTP API (Hono) + WebSocket server |
| **@cortex/dashboard** | `packages/dashboard/` | React web UI with project management, graph visualization |
| **@cortex/ingestion** | `packages/ingestion/` | BullMQ workers for repo scanning, Tree-sitter parsing, LLM extraction |
| **@cortex/db** | `packages/db/` | PostgreSQL schema (Drizzle ORM), migrations, query functions |
| **@cortex/mcp** | `packages/mcp/` | Model Context Protocol server (12 tools for Claude Code) |

## Commands

### Root

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all packages in parallel (API + dashboard + workers) |
| `pnpm build` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm migrate` | Run database migrations |
| `pnpm seed` | Seed DB from `config/projects.json` |
| `pnpm clean` | Remove all `dist/` folders |

### Per-package

```bash
# Dashboard only
pnpm --filter @cortex/dashboard run dev      # Vite dev server :5173
pnpm --filter @cortex/dashboard run build    # Production build

# API server only
pnpm --filter @cortex/serving run dev        # Hono dev :3100 (tsx watch)
pnpm --filter @cortex/serving run start      # Production

# Workers only
pnpm --filter @cortex/ingestion run dev      # Scan + diff workers

# Database
pnpm --filter @cortex/db run migrate         # Apply migrations
pnpm --filter @cortex/db run generate        # Generate migration from schema changes

# MCP server
pnpm --filter @cortex/mcp run dev            # Dev mode
pnpm --filter @cortex/mcp run start          # Production
```

## Infrastructure

### Docker Services

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| PostgreSQL | `pgvector/pgvector:pg16` | 5432 | Database + vector embeddings |
| Redis | `redis:7-alpine` | 6379 | Job queue (BullMQ) |
| LightRAG | custom build | 9621 | Graph RAG knowledge engine |
| Ollama | `ollama/ollama` | 11434 | Local LLM + embedding models |

```bash
docker compose up -d          # Start all
docker compose ps             # Status
docker compose logs -f        # Follow logs
docker compose down           # Stop all
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://cortex:cortex_dev@localhost:5432/cortex` | PostgreSQL connection |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `LIGHTRAG_URL` | `http://localhost:9621` | LightRAG API |
| `OLLAMA_LLM_MODEL` | `qwen2.5:7b` | Ollama model for LightRAG (100% GPU on 8GB VRAM) |
| `OLLAMA_CHAT_MODEL` | `qwen3.5:9b` | Ollama model for chat widget (higher quality) |
| `OLLAMA_EMBEDDING_MODEL` | `nomic-embed-text` | Embedding model |
| `CORTEX_LLM_MODEL` | `haiku` | Claude model for code extraction (`haiku`, `sonnet`, `opus`) |
| `API_KEYS` | `dev-key-1,...` | Comma-separated API keys (max 5 users) |
| `PORT` | `3100` | API server port |

### Credentials

External service credentials (Bitbucket, GitHub, etc.) are stored in `.cred.env` at the project root. This file is managed via the dashboard Settings page and is gitignored. Format:

```env
# label=Bitbucket Token | provider=bitbucket | id=uuid
BITBUCKET_USERNAME=myuser
BITBUCKET_API_TOKEN=ATBBxxxx
```

The ingestion worker reads these automatically when cloning private repositories.

## Database Schema

```
projects ──< repos ──< sources
    |           |
    |           └──< scan_jobs
    |
    └──< events

api_keys (standalone)
```

| Table | Purpose |
|-------|---------|
| `projects` | Top-level project groupings |
| `repos` | Git repositories (provider, cloneUrl, techStack, branches) |
| `sources` | Individual source files tracked per repo/branch |
| `scan_jobs` | Scan execution tracking (queued/running/completed/failed) |
| `events` | Activity log (scans, ingestion, errors) |
| `api_keys` | API authentication keys |

## MCP Integration

Register the MCP server with Claude Code:

```bash
claude mcp add cortex \
  --transport stdio \
  --scope user \
  -- pnpm --filter @cortex/mcp run start
```

### Available Tools

| Tool | Type | Description |
|------|------|-------------|
| `query` | Read | Natural language query against the knowledge graph |
| `get-context` | Read | Get context for current project/repo (auto-detected from cwd) |
| `get-entity` | Read | Retrieve a specific entity (function, class, module) |
| `get-graph` | Read | Get the knowledge graph structure |
| `search` | Read | Full-text + semantic search across all indexed code |
| `list_projects` | Read | List all configured projects and repos |
| `scan` | Write | Trigger a repository scan |
| `ingest` | Write | Manually ingest code or documentation |
| `add-knowledge` | Write | Add custom knowledge entries |
| `link` | Write | Create relationships between entities |
| `sync-status` | Read | Check scan/sync status |
| `history` | Read | View recent events and activity |

## Project Configuration

Projects and repositories are configured in `config/projects.json`:

```json
{
  "version": "1.0.0",
  "defaults": {
    "scan": {
      "maxFileSizeKb": 500,
      "ignorePatterns": ["node_modules/**", ".git/**", "dist/**"],
      "supportedLanguages": ["typescript", "javascript", "python", "go", "c", "cpp"]
    },
    "extraction": {
      "model": "claude-haiku-4-5-20251001",
      "chunkBatchSize": 5,
      "maxTokensPerChunk": 2000
    }
  },
  "projects": [
    {
      "name": "my-project",
      "description": "...",
      "repos": [
        {
          "name": "backend",
          "slug": "backend",
          "provider": "github",
          "cloneUrl": "https://github.com/org/backend.git",
          "techStack": ["typescript", "express", "postgresql"],
          "defaultBranch": "main",
          "trackedBranches": ["main", "develop"]
        }
      ]
    }
  ]
}
```

After editing, run `pnpm seed` to sync to the database.

## Scan Pipeline

When a scan is triggered (via dashboard, MCP, or API):

1. **API** creates a `scan_job` in DB + enqueues to BullMQ (`cortex-scan`)
2. **Worker** picks up the job, sets status to `running`
3. **Clone** — fetches repo using credentials from `.cred.env`
4. **Discover** — walks file tree, filters by extension and size
5. **Parse** — Tree-sitter AST parsing (TypeScript, JavaScript, Python, Go)
6. **Chunk** — splits code into logical chunks (AST-aware, falls back to naive)
7. **Extract** — static analysis (functions, classes, imports) + LLM extraction (Claude Haiku)
8. **Ingest** — sends formatted documents to LightRAG for graph storage
9. **Complete** — updates `scan_job` status, repo `lastScannedAt`

Supported languages: TypeScript, JavaScript (JSX), Python, Go, C, C++, Rust, Java, SQL, YAML, JSON, Markdown, Dockerfile.

## API Reference

Base URL: `http://localhost:3100/api`
Authentication: `X-API-Key` header

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health status |
| GET | `/projects` | List projects |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Get project |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/repos?projectId=` | List repos for project |
| POST | `/repos` | Create repo |
| PUT | `/repos/:id` | Update repo |
| DELETE | `/repos/:id` | Delete repo |
| POST | `/scan` | Trigger scan (returns 202) |
| GET | `/scan/status?projectId=` | List scan jobs |
| GET | `/scan/:jobId` | Get scan job status |
| GET | `/credentials` | List credentials (masked) |
| POST | `/credentials` | Add credential |
| PUT | `/credentials/:id` | Update credential |
| DELETE | `/credentials/:id` | Delete credential |
| GET | `/credentials/:id/reveal` | Get credential with full value |
| POST | `/query` | Query knowledge graph |
| GET | `/graph` | Get graph data |
| POST | `/ingest` | Ingest content |
| GET | `/events` | List events |
| POST | `/services/restart` | Restart Docker services |
| POST | `/services/start` | Start Docker services |
| POST | `/services/stop` | Stop Docker services |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, Recharts, D3-force |
| API | Hono, Node.js 22 |
| Database | PostgreSQL 16 + pgvector (Drizzle ORM) |
| Queue | Redis + BullMQ |
| Code Parsing | Tree-sitter (multi-language) |
| LLM Extraction | Claude Haiku (via CLI) |
| Knowledge Graph | LightRAG |
| Embeddings | Ollama (nomic-embed-text) |
| Local LLM | Ollama (qwen2.5:7b for RAG, qwen3.5:9b for chat) |
| MCP | @modelcontextprotocol/sdk |
| Monorepo | pnpm workspaces |
| Containerization | Docker Compose |

## Troubleshooting

### Ollama n'utilise pas le GPU (NVIDIA)

Si `docker exec cortex-ollama-1 ollama ps` affiche `100% CPU` au lieu de `100% GPU`, c'est un problème connu avec les drivers NVIDIA 580.xx (CUDA 13.0). Le module `nvidia_uvm` peut se retrouver dans un état incohérent (notamment après un suspend/resume).

**Diagnostic :**
```bash
# Vérifier si le GPU est détecté par Ollama
docker logs cortex-ollama-1 2>&1 | grep "inference compute"
# Si vous voyez "id=cpu library=cpu" au lieu de "library=CUDA", le GPU n'est pas utilisé
```

**Fix :**
```bash
# Recharger le module NVIDIA UVM
sudo rmmod nvidia_uvm && sudo modprobe nvidia_uvm

# Recréer le conteneur Ollama
docker compose down ollama && docker compose up -d ollama
```

**Vérification :**
```bash
docker exec cortex-ollama-1 ollama ps
# Doit afficher "100% GPU" dans la colonne PROCESSOR
```

Voir [ollama/ollama#14357](https://github.com/ollama/ollama/issues/14357) pour plus de détails.

## Production Build

```bash
# Build all packages
pnpm build

# Or build Docker image
docker build -t cortex .

# Run production
docker compose -f docker-compose.yml up -d
node packages/serving/dist/server.js
```

The Dockerfile uses a multi-stage build: deps -> build dashboard -> compile TypeScript -> minimal production image.
