# Chat Backends

Cortex Chat supports three execution backends, each suited to different
query complexity. The router automatically picks the best one, or you can
force a specific mode.

## Modes

| Mode | Backend | Model | When |
|------|---------|-------|------|
| `fast` | Ollama (local) | `qwen3.5:9b` | Short questions, definitions, lookups |
| `smart` | Claude Haiku | `claude-haiku-4-5` | Default for non-trivial questions |
| `agent` | Ollama + tools | `qwen3.5:9b` with tool use | Investigation, architecture, debug |
| `auto` | Router chooses | — | (default) automatic selection |

## The Smart Backend: CLI vs API

Smart mode uses Claude Haiku. It runs via **one of two backends**:

### 1. Claude CLI (default when no API key)

Uses the `claude` command-line tool, which ships with Claude Code. This means:

- **No `ANTHROPIC_API_KEY` required** — auth comes from your local Claude
  subscription
- **No API costs** — your usage counts against your Claude subscription, not
  against a pay-per-token account
- Claude can use its **tools** (file search, bash, web) to answer questions
  about your codebase

The engine spawns:

```
claude --print --model haiku --max-turns 5 "<prompt>"
```

Stdout is streamed to the browser as it arrives, one chunk per SSE `token`
event. `--max-turns 5` lets Claude do multiple steps (e.g. search → read →
answer) in a single response.

### 2. Anthropic SDK (when `ANTHROPIC_API_KEY` is set)

Uses `@anthropic-ai/sdk` with the standard messages.stream() API. This is
faster than the CLI for conversational chat (no tool use overhead) but
requires a paid API key.

### Selection rules

| Env var | Behavior |
|---------|----------|
| `CORTEX_LLM_BACKEND` not set | Auto: CLI if no API key, API if key set |
| `CORTEX_LLM_BACKEND=cli` | Force CLI (ignores API key) |
| `CORTEX_LLM_BACKEND=api` | Force API (requires API key) |

### Fallback

If CLI fails and `ANTHROPIC_API_KEY` is set, the engine automatically falls
back to the API. Otherwise, a clear error is streamed to the client via the
SSE `error` event.

## Routing Logic

`routeQuery(message, hasProjectId)` in
`packages/serving/src/chat/router.ts` picks a mode based on heuristics:

```typescript
// Short simple question without project → fast
if (wordCount <= 12 && !hasProjectId && FAST_PATTERNS.test(message)) {
  return 'fast';
}

// Investigation keywords → agent
if (AGENT_PATTERNS.test(message) && wordCount > 8) {
  return 'agent';
}

// Default → smart if Claude available, else fast
return hasClaudeBackend() ? 'smart' : 'fast';
```

**FAST_PATTERNS** (French/English): `list`, `liste`, `qu'est-ce`, `what is`,
`define`, `version`, `name`, `show`, `affiche`, `montre`.

**AGENT_PATTERNS**: `comment`, `pourquoi`, `why`, `how`, `impact`, `compare`,
`analyse`, `explain`, `architecture`, `refactor`, `debug`.

## Streaming protocol

The `/api/chat` endpoint returns `Content-Type: text/event-stream`. Events:

```
event: meta
data: {"mode":"smart","model":"claude-haiku-4-5-20251001"}

event: token
data: {"text":"Hello"}

event: token
data: {"text":" world"}

event: sources
data: {"sources":["packages/ingestion/src/pipeline.ts"]}

event: done
data: {}
```

Errors use `event: error` with `{"message":"..."}`.

## Client integration

The dashboard's `ChatWidget.tsx` component handles streaming. Key points:

- **Cross-origin dev**: when running on the Vite dev server (`:5173`), the
  widget bypasses the proxy and hits `http://localhost:3100/api/chat`
  directly. This is because http-proxy buffers `text/event-stream` responses,
  which breaks the streaming UX.
- **CORS**: the API server uses `hono/cors` middleware that allows any
  `localhost` port (for dev).
- **SSE parser**: tracks `currentEvent` state to correctly attribute each
  `data:` line to its preceding `event:` label.

## Configuration

### Environment variables

```bash
# Default: auto (CLI if no key, API if key set)
CORTEX_LLM_BACKEND=cli

# Required for API mode; optional for CLI (fallback)
ANTHROPIC_API_KEY=sk-ant-...

# Ollama endpoint (fast and agent modes)
OLLAMA_HOST=http://localhost:11434
OLLAMA_LLM_MODEL=qwen2.5:7b
OLLAMA_CHAT_MODEL=qwen3.5:9b

# Chat timeouts
CORTEX_QUERY_TIMEOUT_MS=90000
```

### Per-request override

Clients can force a mode via the request body:

```json
{
  "message": "explain the scan pipeline",
  "mode": "agent",
  "projectId": "uuid-here",
  "history": [...]
}
```

## Troubleshooting

### "Réponse vide du serveur" (empty reply)

The stream opened but produced no tokens. Usually:

- `claude` CLI not in `PATH` → install Claude Code or use API
- `claude` CLI not logged in → run `claude` once interactively
- Vite proxy buffering SSE → the widget already bypasses this; check
  `window.location.port` detection

### "Reached max turns (1)"

Fixed in v2: `--max-turns` raised from 1 to 5. If you hit this again with
larger queries, edit `packages/serving/src/chat/engines/haiku.ts`.

### `Haiku error: ...`

Generic engine error. Check `/tmp/cortex-serving.log` for the full exception.
Common causes:

- Claude CLI not installed or not authenticated
- Invalid `ANTHROPIC_API_KEY`
- Network timeout (default: 90s)
