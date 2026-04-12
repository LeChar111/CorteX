# Installation

Cortex runs on **macOS**, **Linux**, and **Windows (WSL2 only)**. Native
Windows is not supported — use WSL2 with Ubuntu.

## Prerequisites

| Tool | Minimum version | Install |
|------|-----------------|---------|
| Node.js | 22 | [nodejs.org](https://nodejs.org/) |
| pnpm | 10 | `corepack enable` |
| Python | 3.10 | built-in on modern distros |
| Docker | 20.x | [docker.com](https://docker.com/) |
| Docker Compose | v2 | bundled with Docker Desktop |
| Git | 2.30+ | usually pre-installed |
| Ollama | latest | [ollama.com](https://ollama.com/) |
| Claude CLI | latest | `npm install -g @anthropic-ai/claude-code` (optional, for chat) |

## Quick install

From the repo root:

```bash
make install
```

This runs:

1. Creates `.env` from `.env.example` if missing
2. `pnpm install` — Node dependencies
3. `make infra` — Docker services (Postgres, Redis, optionally Ollama)
4. `make migrate` — database migrations
5. `make seed` — initial project fixtures
6. `make setup-graphify` — Python venv + graphify
7. Builds the db/shared packages
8. `make ollama-models` — pulls LLM models

After install, start the full stack:

```bash
make cortex
```

Serves:
- Dashboard at http://localhost:5173 (dev) or http://localhost:3100 (prod)
- API at http://localhost:3100

## Platform-specific notes

### macOS (Apple Silicon or Intel)

- **Ollama runs natively** (Metal GPU on M1+). The Makefile starts `ollama serve`
  in the background automatically.
- **Docker Desktop** is the recommended Docker runtime.
- No special config needed.

### Linux (Ubuntu, Fedora, Arch, etc.)

Two variants depending on hardware:

**NVIDIA GPU** — detected automatically via `nvidia-smi`:
```bash
docker compose --profile nvidia up -d
```

**CPU / AMD GPU** — fallback:
```bash
docker compose --profile linux up -d
```

Ollama runs in a Docker container in both cases.

### Windows

**Native Windows is not supported.** The Makefile uses bash-specific
features and the scan pipeline depends on POSIX shell behavior. Use
**WSL2 with Ubuntu 22.04+**:

1. Install WSL2 and Ubuntu from the Microsoft Store
2. Install Docker Desktop with WSL2 backend
3. Inside WSL: install Node.js, pnpm, Python, Git, Ollama
4. Clone cortex **inside the WSL filesystem** (not `/mnt/c/...`) for
   decent disk performance
5. Run `make install` normally

Ollama runs natively inside WSL2 and can use the Windows host's GPU via
WSL CUDA passthrough.

## Manual steps (if `make install` fails)

### 1. Install pnpm

```bash
corepack enable
corepack prepare pnpm@10 --activate
```

### 2. Node dependencies

```bash
pnpm install
```

### 3. Docker services

```bash
# Copy env
cp .env.example .env

# Start
docker compose up -d postgres redis

# Wait for postgres
until docker compose exec -T postgres pg_isready -U cortex -d cortex; do
  sleep 1
done
```

### 4. Database migrations

```bash
pnpm -F @cortex/db migrate
```

### 5. Graphify Python bridge

```bash
cd services/graphify-bridge
python3 -m venv .venv
.venv/bin/pip install -e .
```

Verify:

```bash
.venv/bin/python -c "from cortex_bridge.scanner import scan_directory; print('OK')"
```

### 6. Optional: Claude CLI

For the chat `smart` mode without an API key:

```bash
npm install -g @anthropic-ai/claude-code
claude  # run once to authenticate
```

Alternatively, set `ANTHROPIC_API_KEY` in `.env` to use the API directly.

### 7. Ollama models

```bash
bash scripts/init-ollama.sh
```

Pulls `qwen2.5:7b`, `qwen3.5:9b`, and `nomic-embed-text`.

## Verify installation

```bash
make status
```

Expected output:

```
Services:
  ✔  PostgreSQL   :5432
  ✔  Redis        :6379
  ✔  Ollama       :11434
  ✔  Serving API  :3100

Ollama models:
  - qwen2.5:7b
  - qwen3.5:9b
  - nomic-embed-text:latest
```

## Troubleshooting

### `make install` hangs on `pnpm install`

Network issue. Try:
```bash
pnpm install --registry=https://registry.npmjs.org/
```

### Python venv fails on macOS

Make sure Xcode command-line tools are installed:
```bash
xcode-select --install
```

### `cortex-scan: command not found` during scans

The Node pipeline auto-resolves the Python binary via:
1. `CORTEX_SCAN_BIN` env var
2. `services/graphify-bridge/.venv/bin/cortex-scan`
3. PATH

Run `make setup-graphify` if the venv is missing.

### Docker build fails in `tsconfig.base.json`

Already fixed in current version. Make sure you're on `feat/graphify-v2`
or newer. The Dockerfile's multi-stage build needs `tsconfig.base.json`
copied into the build context.

### Port conflicts

- **5432** (postgres) — set `POSTGRES_PORT=5433` in `.env`
- **6379** (redis) — set `REDIS_PORT=6380` (default already uses 6380 to
  avoid conflicts with local Redis)
- **3100** (API) — set `PORT=3101` in `.env`
- **11434** (ollama) — default, fixed

## Related

- [Configuration](configuration.md) — all environment variables
- [Cross-Platform](cross-platform.md) — detailed platform behavior
