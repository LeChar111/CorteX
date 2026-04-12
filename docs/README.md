# Cortex Documentation

Knowledge Hub platform for multi-project AI teams. Scans repositories, builds a
knowledge graph via [graphify](https://github.com/safishamsi/graphify), and
exposes it through a REST API, dashboard, and MCP server.

## Table of Contents

### Features

- [Knowledge Graph](features/knowledge-graph.md) — graph storage, nodes, edges, communities
- [Graph Exploration](features/graph-exploration.md) — progressive visualization (hubs, communities, search)
- [Chat Backends](features/chat-backends.md) — Ollama, Claude CLI, Claude API
- [Graphify Bridge](features/graphify-bridge.md) — Python bridge that extracts the graph
- [Semantic Analysis](features/semantic-analysis.md) — link coherence verification via Claude CLI
- [Cross-Project Links](features/cross-project-links.md) — auto-detect shared entities between repos
- [Edge Enrichment](features/edge-enrichment.md) — cross-file relation propagation
- [MCP Server](features/mcp-server.md) — Model Context Protocol tools

### Architecture

- [Overview](architecture/overview.md) — components and data flow
- [Pipeline](architecture/scan-pipeline.md) — how a scan transforms code into a graph
- [Storage](architecture/storage.md) — PostgreSQL schema, Redis, caching

### API

- [REST Endpoints](api/rest-endpoints.md) — all HTTP routes
- [WebSocket Events](api/websocket.md) — real-time event stream
- [Authentication](api/auth.md) — API keys

### Operations

- [Installation](operations/installation.md) — `make install`, platform-specific notes
- [Configuration](operations/configuration.md) — env vars, tunables
- [Cross-Platform](operations/cross-platform.md) — macOS, Linux, Windows (WSL2)

### Design Specs & Plans

- [Specs](superpowers/specs/) — design documents
- [Plans](superpowers/plans/) — implementation plans

## Quick Links

- **Start the stack:** `make cortex`
- **Run a scan:** `POST /api/scan` with `projectId`, `repoId`, `branch`, `mode`
- **Explore the graph:** open `http://localhost:3100/graph`
- **Ask questions:** open the chat widget (bottom-right of dashboard)
