# Graph Exploration

The dashboard at `/graph` renders the knowledge graph using
[vis-network](https://visjs.github.io/vis-network/docs/network/) with a
progressive exploration UX. Scanning the two reference projects produces
**42,914 nodes and 76,430 edges** — rendering everything at once would
overwhelm both the browser and the user. Instead, we cap the view and let
you drill in.

## View modes

Three entry points, selected from the toolbar:

### Top Hubs (default)

Shows the **500 most connected nodes** across the entire graph (or within a
project, if filtered). Node size is proportional to degree — the giant
circles are architectural hubs, the small ones are peripheral functions.

Edges shown are only those **between visible nodes** — so the view is
hierarchical rather than a hairball. This is the best starting point for
understanding a codebase.

### Communities

Shows **one representative node per community**. Each node is the highest-
degree member of its cluster. Useful for an architectural bird's-eye view:
each dot is a "module" of the system.

### Search

Starts with an empty canvas. Typing in the search box searches by node
label and opens the 1-hop neighborhood around the first match.

## Node encoding

**Color** — by `community_id`. 20-color palette, cycled modulo community
index. Same color = same cluster.

**Shape** — by `type`:
- `dot` — function, method, variable, constant
- `diamond` — class, interface
- `square` — file, module
- `triangle` — import

**Size** — by `degree` (number of connections):
```
size = 8 + sqrt(degree) × 2.5
```
Degree 0 → 8px, 10 → 16px, 100 → 32px, 500+ → 48px. Label font scales
with size.

**Opacity / dimming** — non-matching nodes when a search filter is active.

## Edge encoding

**Color** — by relation type:
- `#6366f1` (indigo) — calls
- `#22c55e` (green) — imports
- `#94a3b8` (gray) — contains, method
- `#ef4444` (red) — inherits, extends
- `#f97316` (orange) — uses
- `#a855f7` (purple) — shares_name

**Style** — dashed line for `confidence: INFERRED` (uncertain edges from
enrichment or Claude analysis).

**Arrow** — direction shown with small arrowheads.

## Interaction

- **Click** a node → sidebar opens with details (type, file, location,
  community, connection count)
- **Double-click** → zoom to the node's neighborhood
- **Scroll** → zoom in/out
- **Drag** (on empty canvas) → pan
- **"Expand neighbors"** button in sidebar → fetch and add the node's 1-hop
  neighbors to the current view (capped at 500 total)
- **Search box** → filter/dim non-matching nodes
- **Project dropdown** → switch scope (persisted in `localStorage`)
- **Community dropdown** → filter by cluster

## Physics and performance

vis-network uses ForceAtlas2Based physics. Critical for UX:

- **Stabilization runs for up to 400 iterations**, then physics is
  **disabled** so panning/zooming is buttery smooth
- `gravitationalConstant: -250` (strong repulsion — spreads nodes out)
- `springLength: 200` (connected nodes sit ~200px apart)
- `avoidOverlap: 1.0` (hard collision avoidance)
- Straight edges (`smooth: false`), no shadows — keeps frame rate high

Without these settings, 500 nodes would cluster into an unreadable blob in
the center of the canvas. With them, communities naturally separate into
visual groups.

## Progressive expansion

The API endpoint `GET /api/graph/summary?mode=hubs&limit=500` returns only
the top-N most connected nodes and the edges between them. To grow the
view:

1. Click a node of interest
2. Press **"Expand neighbors"** in the sidebar
3. The widget calls `GET /api/graph?entity=<label>&depth=1` and merges
   the result into the current DataSet (deduping by node ID)
4. Physics briefly re-enables for 2s to settle the new layout, then freezes

This lets you start small and expand on demand — you never load the full
42k node graph at once.

## Overflow handling

If a filter returns more than 500 matching nodes, the client:

1. Computes local degree from the returned edges
2. Keeps the top 500 by degree
3. Shows a banner: *"Showing top 500 of X matching nodes. Refine your
   search or filter to see more."*

## API endpoints used

| Endpoint | Purpose |
|----------|---------|
| `GET /api/graph/summary?mode=hubs&limit=500` | Top-N hubs for default view |
| `GET /api/graph/summary?mode=communities` | One node per community |
| `GET /api/graph?entity=<name>&depth=1` | BFS around a specific entity |
| `GET /api/graph/search?q=<query>` | Text search on labels |

## Keyboard shortcuts

vis-network built-ins:
- `Arrow keys` — pan when focused on the canvas
- `+` / `-` — zoom (only when canvas has focus)
- `Home` — reset view (or click the "Fit" toolbar button)

## Files

- `packages/dashboard/src/pages/Graph.tsx` — main component
- `packages/serving/src/api/routes/graph.ts` — summary endpoint
- `packages/serving/src/graph/pg-graph-client.ts` — PG query layer
