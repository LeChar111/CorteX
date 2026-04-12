# Cross-Project Links

Cortex tracks multiple projects simultaneously (e.g. `ap` and
`lifi-manager` in the reference setup). Their knowledge graphs can be
joined to enable cross-project queries, impact analysis, and
architecture-level search.

## Data model

### `project_links` table

```sql
CREATE TABLE project_links (
  id uuid PRIMARY KEY,
  source_project_id uuid REFERENCES projects(id),
  target_project_id uuid REFERENCES projects(id),
  link_type varchar(128),          -- 'depends_on', 'tests', 'extends',
                                   --  'deploys', 'shares_lib', 'related'
  description text,
  metadata jsonb,
  UNIQUE (source_project_id, target_project_id, link_type)
);
```

Link types are free-form strings but the convention is:

- `depends_on` — project A's code directly imports project B
- `shares_lib` — both projects import a common library subset
- `tests` — project A contains tests for project B
- `extends` — A builds on or extends B
- `deploys` — A deploys or packages B
- `related` — loose association

## Auto-detection

`POST /api/analysis/detect-links` compares two project graphs and
suggests a link type based on overlap:

```bash
curl -X POST http://localhost:3100/api/analysis/detect-links \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-key-1" \
  -d '{
    "sourceProjectId": "<uuid-ap>",
    "targetProjectId": "<uuid-lifi-manager>"
  }'
```

Response:

```json
{
  "sourceProject": { "id": "...", "name": "ap", "nodeCount": 42288 },
  "targetProject": { "id": "...", "name": "lifi-manager", "nodeCount": 626 },
  "analysis": {
    "sharedEntities": [
      {
        "name": "loglevel",
        "sourceNode": { "id": "ap:...", "type": "import" },
        "targetNode": { "id": "lifi:...", "type": "import" },
        "matchType": "exact"
      }
    ],
    "sharedEntityCount": 12,
    "sharedImports": ["winston", "grpc", "mqtt"],
    "sharedImportCount": 3,
    "overlapRatio": 4,
    "suggestedLinkType": "related"
  },
  "recommendation": "These projects share 12 entities and 3 imports. Suggested link type: 'related'."
}
```

### Detection strategies

1. **Shared entity names** — case-insensitive label match after cleaning
   (strip parens, trim). Weighted higher for `matchType=exact` (same
   label **and** same type).
2. **Shared imports** — compare the set of `import` / `module` node
   labels between projects.
3. **Overlap ratio** — `sharedEntities / min(projectA.nodes, projectB.nodes)`.

### Suggested link type heuristic

```typescript
let suggested = 'related';
if (overlapRatio > 0.3) suggested = 'shares_lib';
else if (sharedImports.length > 5) suggested = 'depends_on';
```

## Creating the link

After reviewing the detection result:

```bash
curl -X POST http://localhost:3100/api/analysis/auto-link \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dev-key-1" \
  -d '{
    "sourceProjectId": "<uuid-a>",
    "targetProjectId": "<uuid-b>",
    "linkType": "depends_on"
  }'
```

This inserts a row in `project_links` (idempotent via ON CONFLICT).

## Cross-project graph traversal

`GET /api/graph/cross-project?projectId=<uuid>&entity=<name>&depth=2`

Walks the graph starting from `entity` in the given project, following
edges across **all linked projects**. Nodes are tagged with
`_isCrossProject: true/false` and `_project: <uuid>` so the dashboard
can visually distinguish cross-project components.

## MCP tools

- `detect_cross_project_links(sourceProjectId, targetProjectId)` — detection
- `auto_link(sourceProjectId, targetProjectId, linkType)` — creation
- `cross_project_query(query, projectId, depth)` — traversal

## Files

- `packages/serving/src/api/routes/cross-project-detect.ts` — detection endpoint
- `packages/serving/src/api/routes/graph-ops.ts` — cross-project graph traversal
- `packages/db/src/schema.ts` — `projectLinks` table definition
- `packages/mcp/src/tools/detect-links.ts` — MCP tool

## Example: AP ↔ LiFi Manager

For the two reference projects after scanning 14 repos:

- **AP** — 8 repos (42,288 nodes): embedded Go middleware, C authenticator,
  Yocto build, firmware
- **LiFi Manager** — 6 repos (626 nodes): Node.js microservices, React
  frontend, Docker Compose deployer

Running detect-links surfaces:
- Shared MQTT import → both systems communicate over MQTT
- Shared gRPC imports → backend-device talks to middleware via gRPC
- Shared config names → both use similar device/provisioning schemas

The recommended link type is `depends_on` (AP depends on the LiFi
backend's management protocol).
