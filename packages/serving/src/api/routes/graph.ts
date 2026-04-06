import { Hono } from 'hono';
import { LightRAGClient } from '../../lightrag/client.js';

export const graphRoutes = new Hono();

graphRoutes.get('/graph', async (c) => {
  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  const client = new LightRAGClient(lightragUrl);
  const label = c.req.query('label');
  const entityName = c.req.query('entity');
  const depth = parseInt(c.req.query('depth') ?? '2', 10);

  try {
    const graphs = await client.getGraphFull() as { nodes: Array<{ id: string; label?: string; [k: string]: unknown }>; edges: Array<{ source: string; target: string; [k: string]: unknown }> };

    // If no entity filter, return full graph (existing behavior)
    if (!entityName) {
      if (label) {
        // Fallback to label-based query for backward compat
        const labelGraphs = await client.getGraphs(label);
        return c.json(labelGraphs);
      }
      return c.json(graphs);
    }

    // Filter graph around the entity up to `depth` hops
    const nameLower = entityName.toLowerCase();
    const seedNodes = new Set<string>();
    for (const node of graphs.nodes) {
      const nodeLabel = (node.label ?? node.id ?? '').toLowerCase();
      if (nodeLabel.includes(nameLower)) {
        seedNodes.add(node.id);
      }
    }

    if (seedNodes.size === 0) {
      return c.json({ nodes: [], edges: [], entity: entityName, depth });
    }

    // BFS to collect nodes within `depth` hops
    const visited = new Set<string>(seedNodes);
    let frontier = new Set<string>(seedNodes);

    for (let d = 0; d < depth && frontier.size > 0; d++) {
      const nextFrontier = new Set<string>();
      for (const edge of graphs.edges) {
        if (frontier.has(edge.source) && !visited.has(edge.target)) {
          nextFrontier.add(edge.target);
          visited.add(edge.target);
        }
        if (frontier.has(edge.target) && !visited.has(edge.source)) {
          nextFrontier.add(edge.source);
          visited.add(edge.source);
        }
      }
      frontier = nextFrontier;
    }

    const filteredNodes = graphs.nodes.filter(n => visited.has(n.id));
    const filteredEdges = graphs.edges.filter(e => visited.has(e.source) && visited.has(e.target));

    return c.json({ nodes: filteredNodes, edges: filteredEdges, entity: entityName, depth });
  } catch {
    return c.json({ nodes: [], edges: [] });
  }
});
