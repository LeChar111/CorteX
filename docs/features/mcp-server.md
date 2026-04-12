# MCP Server

Cortex exposes its knowledge graph to AI coding assistants (Claude Code,
Cursor, etc.) via the [Model Context Protocol](https://modelcontextprotocol.io/).
The MCP server is a thin wrapper that calls the Cortex REST API.

## Installation

The MCP server is a standalone Node.js binary:

```bash
cd packages/mcp
pnpm build
```

Register it with Claude Code (example `.mcp.json`):

```json
{
  "mcpServers": {
    "cortex": {
      "command": "node",
      "args": ["/path/to/cortex/packages/mcp/dist/index.js"],
      "env": {
        "CORTEX_API_URL": "http://localhost:3100",
        "CORTEX_API_KEY": "dev-key-1"
      }
    }
  }
}
```

## Auto-detection

When invoked from a working directory, the MCP server runs `git` commands
to detect:

- Remote URL (to match against cortex's `repos.cloneUrl`)
- Current branch
- Project and repo IDs from the matched record

This means a tool like `impact(filePath)` automatically scopes to the
correct project without you passing the UUID.

## Available tools

### Read / Query

- **`query(query, project?, mode?)`** — natural-language Q&A over the graph
- **`get_context(entity, depth?)`** — entity + N-hop neighborhood summary
- **`get_entity(name)`** — metadata for a single entity
- **`get_graph(entityName, depth?)`** — subgraph centered on an entity
- **`search(q)`** — label-based text search

### Write

- **`ingest(content, filePath?, projectId?)`** — add a document/code blob
- **`add_knowledge(entity, type, description)`** — manual entity creation
- **`link(source, target, type, description?)`** — create an edge
- **`scan(projectId, repoId, branch, mode?)`** — trigger a scan job

### Analysis

- **`impact(filePath, projectId?)`** — direct + transitive + cross-project impact
- **`arch_check(projectId)`** — architecture rule validation
- **`diff_review(fromCommit, toCommit)`** — review changes between commits
- **`cross_project_query(query, project?, mode?, entity?, depth?)`** — multi-project
- **`communities(projectId?)`** — list community clusters with cohesion
- **`god_nodes(projectId?)`** — most connected entities
- **`detect_cross_project_links(sourceProjectId, targetProjectId, autoLink?)`** — find shared entities

### Utility

- **`list_projects()`** — enumerate all projects
- **`sync_status(projectId)`** — repo scan status
- **`history(projectId, limit?)`** — recent events
- **`annotate(entity, type, content)`** — attach note/decision/warning/todo
- **`export_kb(projectId)`** — export the project's graph as JSON

## Example tool response

`communities({ projectId: "..." })`:

```markdown
# Communities (43 clusters)

- **Community 0**: 348 members, cohesion 68% | Hub nodes: types.go, errors.go
- **Community 1**: 127 members, cohesion 72% | Hub nodes: auth.c, eap_tls.c
- **Community 2**: 89 members, cohesion 81% | Hub nodes: MqttClient, Device
...
```

`god_nodes({ projectId: "..." })`:

```markdown
# God Nodes (top 20 architectural hubs)

| Entity | Connections | Community |
|--------|------------|-----------|
| types.go | 348 | 0 |
| errnoErr() | 370 | 0 |
| MqttClient | 127 | 2 |
...
```

## Files

- `packages/mcp/src/index.ts` — server entry point and tool registration
- `packages/mcp/src/client.ts` — REST API client (wraps fetch with auth)
- `packages/mcp/src/detector.ts` — CWD → project/repo auto-detection
- `packages/mcp/src/tools/*.ts` — one file per tool

## Authentication

The MCP server uses a Cortex API key (not the user's Claude Code
credentials). The key is passed via the `CORTEX_API_KEY` env var and
forwarded as `X-API-Key` header on every API call.

For local dev, the default key `dev-key-1` works. For production, generate
a key via the Cortex dashboard under Settings → Credentials.

## Protocol

Uses `@modelcontextprotocol/sdk`'s stdio transport. The server reads
JSON-RPC requests on stdin and writes responses on stdout. Logs go to
stderr to avoid polluting the protocol stream.

## Related

- [Cross-Project Links](cross-project-links.md)
- [Knowledge Graph](knowledge-graph.md)
- [Chat Backends](chat-backends.md)
