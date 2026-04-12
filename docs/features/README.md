# Features

Feature documentation for Cortex v2.

## Core features

- **[Knowledge Graph](knowledge-graph.md)** — PostgreSQL-backed graph store
  with nodes, edges, and communities. 20 language support via graphify.

- **[Graph Exploration](graph-exploration.md)** — Progressive visualization
  (Top Hubs / Communities / Search modes). Never renders more than 500
  nodes to keep navigation smooth.

- **[Chat Backends](chat-backends.md)** — Three execution backends
  (Ollama local, Claude CLI, Claude API). Auto-routed based on query
  complexity.

- **[Graphify Bridge](graphify-bridge.md)** — Python subprocess that
  extracts AST graphs. Replaced the v1 Rust + LLM pipeline.

- **[Semantic Analysis](semantic-analysis.md)** — Optional Claude CLI pass
  that validates link coherence and adds inferred semantic edges. No API
  key required.

- **[Edge Enrichment](edge-enrichment.md)** — Post-extraction pass that
  propagates file-level imports to function-level `uses` edges. Fixes the
  63%-isolated-nodes problem from pure AST extraction.

- **[Cross-Project Links](cross-project-links.md)** — Auto-detect shared
  entities, imports, and patterns between two projects. Create
  `project_links` rows for multi-project queries.

- **[MCP Server](mcp-server.md)** — Model Context Protocol tools exposing
  the graph to Claude Code, Cursor, and other AI coding assistants.

## Status

| Feature | Status |
|---------|--------|
| 20-language AST extraction | ✅ Production |
| Community detection (Leiden/Louvain) | ✅ Production |
| God nodes analysis | ✅ Production |
| Cross-file edge enrichment | ✅ Production |
| Claude CLI chat backend | ✅ Production |
| Claude API chat backend | ✅ Production |
| Semantic analysis (Claude CLI) | ⚠️ Opt-in (slow on large repos) |
| Cross-project link detection | ✅ Production |
| MCP tools | ✅ Production |
| Dashboard graph visualization | ✅ Production |
| Incremental diff scans | 🚧 Stubbed (v1 feature being rewritten) |
| Dashboard full-text search | 🚧 Planned |
| Snapshot comparison | 🚧 Planned |
