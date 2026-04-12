import { Hono } from 'hono';
import { getDb, graphNodes } from '@cortex/db';
import { sql, eq } from 'drizzle-orm';
import { getPgGraphClient } from '../../graph/pg-graph-client.js';

export const graphRoutes = new Hono();

graphRoutes.get('/graph', async (c) => {
  const client = getPgGraphClient();
  const entityName = c.req.query('entity');
  const depth = parseInt(c.req.query('depth') ?? '2', 10);
  const projectId = c.req.query('projectId');

  try {
    if (entityName) {
      const result = await client.getEntityGraph(entityName, depth);
      return c.json(result);
    }
    if (projectId) {
      const result = await client.getProjectGraph(projectId);
      return c.json(result);
    }
    const result = await client.getFullGraph();
    return c.json(result);
  } catch {
    return c.json({ nodes: [], edges: [] });
  }
});

// GET /graph/summary?projectId=UUID&mode=hubs|communities&limit=500
// Returns a bounded subset of the graph for progressive exploration.
graphRoutes.get('/graph/summary', async (c) => {
  const db = getDb();
  const projectId = c.req.query('projectId');
  const mode = (c.req.query('mode') ?? 'hubs') as 'hubs' | 'communities';
  const limit = Math.min(parseInt(c.req.query('limit') ?? '500', 10), 1000);

  try {
    if (mode === 'hubs') {
      // Show ONLY the top-N most connected nodes (no neighbor expansion).
      // Only edges between visible nodes are included.
      const topNodesQuery = projectId
        ? sql`
            SELECT n.id, n.label, n.type, n.source_file, n.source_location,
                   n.project_id, n.community_id, n.properties,
                   (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) as degree
            FROM graph_nodes n
            WHERE n.project_id = ${projectId}
            ORDER BY degree DESC
            LIMIT ${limit}
          `
        : sql`
            SELECT n.id, n.label, n.type, n.source_file, n.source_location,
                   n.project_id, n.community_id, n.properties,
                   (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) as degree
            FROM graph_nodes n
            ORDER BY degree DESC
            LIMIT ${limit}
          `;

      const topNodesResult = await db.execute(topNodesQuery);
      const topNodes = (topNodesResult.rows ?? (topNodesResult as unknown as any[]) ?? []) as any[];

      if (topNodes.length === 0) {
        return c.json({ nodes: [], edges: [], mode, total: 0 });
      }

      const topIds = topNodes.map((r: any) => r.id as string);
      const visibleIds = new Set(topIds);

      const topIdsArr = sql.raw(`ARRAY[${topIds.map(id => `'${String(id).replace(/'/g, "''")}'`).join(',')}]::varchar[]`);

      // Fetch ALL edges where at least ONE end is a top hub
      const edgeQuery = sql`
        SELECT source_node_id, target_node_id, relation, confidence, confidence_score, weight, source_file
        FROM graph_edges
        WHERE source_node_id = ANY(${topIdsArr}) OR target_node_id = ANY(${topIdsArr})
      `;
      const edgesResult = await db.execute(edgeQuery);
      const allEdges = (edgesResult.rows ?? (edgesResult as unknown as any[]) ?? []) as any[];

      // Find bridge nodes: nodes NOT in topIds but connected to 2+ top hubs
      const bridgeCandidates: Record<string, number> = {};
      for (const e of allEdges) {
        const src = e.source_node_id as string;
        const tgt = e.target_node_id as string;
        if (visibleIds.has(src) && !visibleIds.has(tgt)) {
          bridgeCandidates[tgt] = (bridgeCandidates[tgt] ?? 0) + 1;
        }
        if (visibleIds.has(tgt) && !visibleIds.has(src)) {
          bridgeCandidates[src] = (bridgeCandidates[src] ?? 0) + 1;
        }
      }

      // Add bridge nodes that connect 2+ hubs (they densify the graph)
      const bridgeIds = Object.entries(bridgeCandidates)
        .filter(([, count]) => count >= 2)
        .map(([id]) => id);

      let bridgeNodes: any[] = [];
      if (bridgeIds.length > 0) {
        const bridgeIdsArr = sql.raw(`ARRAY[${bridgeIds.map(id => `'${String(id).replace(/'/g, "''")}'`).join(',')}]::varchar[]`);
        const bridgeQuery = sql`
          SELECT n.id, n.label, n.type, n.source_file, n.source_location,
                 n.project_id, n.community_id, n.properties,
                 (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) as degree
          FROM graph_nodes n
          WHERE n.id = ANY(${bridgeIdsArr})
        `;
        const bridgeResult = await db.execute(bridgeQuery);
        bridgeNodes = (bridgeResult.rows ?? (bridgeResult as unknown as any[]) ?? []) as any[];
        for (const bn of bridgeNodes) visibleIds.add(bn.id as string);
      }

      // Filter edges to only those where BOTH ends are visible (top hubs + bridges)
      const filteredEdges = allEdges
        .filter((e: any) => visibleIds.has(e.source_node_id) && visibleIds.has(e.target_node_id))
        .map((e: any) => ({
          source: e.source_node_id,
          target: e.target_node_id,
          relation: e.relation,
          confidence: e.confidence,
          confidence_score: e.confidence_score,
          weight: e.weight,
          source_file: e.source_file,
        }));

      // Find isolated nodes (visible but no edges) and pull in their best neighbor
      const edgeConnected = new Set<string>();
      for (const e of filteredEdges) {
        edgeConnected.add(e.source);
        edgeConnected.add(e.target);
      }
      const isolatedIds = [...visibleIds].filter(id => !edgeConnected.has(id));

      let neighborNodes: any[] = [];
      if (isolatedIds.length > 0) {
        const isoArr = sql.raw(`ARRAY[${isolatedIds.map(id => `'${String(id).replace(/'/g, "''")}'`).join(',')}]::varchar[]`);
        // For each isolated node, get its top neighbor (highest degree) from the full graph
        const neighborQuery = sql`
          WITH iso_edges AS (
            SELECT e.source_node_id AS iso_id, e.target_node_id AS neighbor_id
            FROM graph_edges e
            WHERE e.source_node_id = ANY(${isoArr})
            UNION ALL
            SELECT e.target_node_id AS iso_id, e.source_node_id AS neighbor_id
            FROM graph_edges e
            WHERE e.target_node_id = ANY(${isoArr})
          ),
          ranked AS (
            SELECT ie.iso_id, ie.neighbor_id,
                   (SELECT COUNT(*) FROM graph_edges e2 WHERE e2.source_node_id = ie.neighbor_id OR e2.target_node_id = ie.neighbor_id) AS ndegree,
                   ROW_NUMBER() OVER (PARTITION BY ie.iso_id ORDER BY (SELECT COUNT(*) FROM graph_edges e2 WHERE e2.source_node_id = ie.neighbor_id OR e2.target_node_id = ie.neighbor_id) DESC) AS rn
            FROM iso_edges ie
          )
          SELECT r.iso_id, r.neighbor_id, n.label, n.type, n.source_file, n.source_location,
                 n.project_id, n.community_id, n.properties, r.ndegree AS degree
          FROM ranked r
          JOIN graph_nodes n ON n.id = r.neighbor_id
          WHERE r.rn = 1
        `;
        const neighborResult = await db.execute(neighborQuery);
        const neighborRows = (neighborResult.rows ?? (neighborResult as unknown as any[]) ?? []) as any[];

        for (const row of neighborRows) {
          const nid = row.neighbor_id as string;
          const isoId = row.iso_id as string;
          if (!visibleIds.has(nid)) {
            visibleIds.add(nid);
            // Remap neighbor row to standard node format
            neighborNodes.push({
              id: nid,
              label: row.label,
              type: row.type,
              source_file: row.source_file,
              source_location: row.source_location,
              project_id: row.project_id,
              community_id: row.community_id,
              properties: row.properties,
              degree: row.degree,
            });
          }
          // Add edge from isolated node to its best neighbor
          filteredEdges.push({
            source: isoId,
            target: nid,
            relation: 'connected_to',
            confidence: 'EXTRACTED',
            confidence_score: null,
            weight: '1.0',
            source_file: null,
          });
          edgeConnected.add(isoId);
          edgeConnected.add(nid);
        }
      }

      const totalCountRow = projectId
        ? await db.select({ c: sql<number>`count(*)` }).from(graphNodes).where(eq(graphNodes.projectId, projectId))
        : await db.select({ c: sql<number>`count(*)` }).from(graphNodes);
      const totalNodes = Number(totalCountRow[0]?.c ?? 0);

      const allNodes = [...topNodes, ...bridgeNodes, ...neighborNodes];

      // Build community labels from the top-3 most connected nodes in each community
      const communityIds = [...new Set(allNodes.map((n: any) => n.community_id).filter(Boolean))];
      const communityLabels: Record<string, string> = {};

      if (communityIds.length > 0) {
        const commIdsSql = sql.raw(
          `ARRAY[${communityIds.map((id: any) => `'${String(id).replace(/'/g, "''")}'`).join(',')}]::varchar[]`,
        );
        const labelQuery = sql`
          SELECT community_id, label, degree FROM (
            SELECT n.community_id, n.label,
                   (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) as degree,
                   ROW_NUMBER() OVER (PARTITION BY n.community_id ORDER BY (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) DESC) as rn
            FROM graph_nodes n
            WHERE n.community_id = ANY(${commIdsSql})
              ${projectId ? sql`AND n.project_id = ${projectId}` : sql``}
          ) ranked
          WHERE rn <= 3
          ORDER BY community_id, degree DESC
        `;
        const labelResult = await db.execute(labelQuery);
        const labelRows = (labelResult.rows ?? (labelResult as unknown as any[]) ?? []) as any[];
        const grouped: Record<string, string[]> = {};
        for (const row of labelRows) {
          const cid = String(row.community_id);
          if (!grouped[cid]) grouped[cid] = [];
          grouped[cid].push(String(row.label));
        }
        for (const [cid, labels] of Object.entries(grouped)) {
          communityLabels[cid] = labels.join(', ');
        }
      }

      return c.json({
        nodes: allNodes.map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type,
          source_file: n.source_file,
          source_location: n.source_location,
          project_id: n.project_id,
          community: n.community_id,
          degree: Number(n.degree ?? 0),
          properties: n.properties,
        })),
        edges: filteredEdges,
        mode,
        total: totalNodes,
        communityLabels,
      });
    }

    if (mode === 'communities') {
      const communitiesQuery = projectId
        ? sql`
            SELECT DISTINCT ON (n.community_id) n.id, n.label, n.type, n.source_file, n.community_id,
                   (SELECT COUNT(*) FROM graph_nodes n2 WHERE n2.community_id = n.community_id AND n2.project_id = ${projectId}) as community_size
            FROM graph_nodes n
            WHERE n.project_id = ${projectId} AND n.community_id IS NOT NULL
            ORDER BY n.community_id, (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) DESC
            LIMIT ${limit}
          `
        : sql`
            SELECT DISTINCT ON (n.community_id) n.id, n.label, n.type, n.source_file, n.community_id,
                   (SELECT COUNT(*) FROM graph_nodes n2 WHERE n2.community_id = n.community_id) as community_size
            FROM graph_nodes n
            WHERE n.community_id IS NOT NULL
            ORDER BY n.community_id, (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) DESC
            LIMIT ${limit}
          `;

      const samplesResult = await db.execute(communitiesQuery);
      const samples = (samplesResult.rows ?? (samplesResult as unknown as any[]) ?? []) as any[];

      if (samples.length === 0) {
        return c.json({ nodes: [], edges: [], mode, total: 0 });
      }

      // Sort representatives by community size (biggest first)
      samples.sort((a: any, b: any) => Number(b.community_size ?? 0) - Number(a.community_size ?? 0));

      // Aggregate cross-community edges: count edges between each pair of communities
      // and expose them as edges between representative nodes.
      const repIds = samples.map((r: any) => String(r.id));
      const repIdsSql = sql.raw(`ARRAY[${repIds.map(id => `'${id.replace(/'/g, "''")}'`).join(',')}]::varchar[]`);
      const communityIds = samples.map((r: any) => r.community_id);
      const commIdsSql = sql.raw(`ARRAY[${communityIds.map((id: any) => `'${String(id).replace(/'/g, "''")}'`).join(',')}]::varchar[]`);

      const aggEdgeQuery = projectId
        ? sql`
            WITH reps AS (
              SELECT rep_id, community_id
              FROM unnest(${repIdsSql}, ${commIdsSql}) AS t(rep_id, community_id)
            )
            SELECT rs.rep_id AS source, rt.rep_id AS target, COUNT(*)::int AS weight
            FROM graph_edges e
            JOIN graph_nodes ns ON ns.id = e.source_node_id
            JOIN graph_nodes nt ON nt.id = e.target_node_id
            JOIN reps rs ON rs.community_id = ns.community_id
            JOIN reps rt ON rt.community_id = nt.community_id
            WHERE ns.project_id = ${projectId} AND nt.project_id = ${projectId}
              AND ns.community_id <> nt.community_id
            GROUP BY rs.rep_id, rt.rep_id
            ORDER BY weight DESC
            LIMIT 2000
          `
        : sql`
            WITH reps AS (
              SELECT rep_id, community_id
              FROM unnest(${repIdsSql}, ${commIdsSql}) AS t(rep_id, community_id)
            )
            SELECT rs.rep_id AS source, rt.rep_id AS target, COUNT(*)::int AS weight
            FROM graph_edges e
            JOIN graph_nodes ns ON ns.id = e.source_node_id
            JOIN graph_nodes nt ON nt.id = e.target_node_id
            JOIN reps rs ON rs.community_id = ns.community_id
            JOIN reps rt ON rt.community_id = nt.community_id
            WHERE ns.community_id <> nt.community_id
            GROUP BY rs.rep_id, rt.rep_id
            ORDER BY weight DESC
            LIMIT 2000
          `;

      let aggregatedEdges: any[] = [];
      try {
        const aggResult = await db.execute(aggEdgeQuery);
        aggregatedEdges = (aggResult.rows ?? (aggResult as unknown as any[]) ?? []) as any[];
      } catch (e) {
        console.error('[graph/summary] aggregated edges error:', e);
      }

      // Deduplicate reciprocal pairs (a->b and b->a) by summing weights
      type Pair = { source: string; target: string; weight: number; relation: string };
      const pairMap = new Map<string, Pair>();
      const addPair = (a: string, b: string, w: number, relation: string) => {
        if (a === b) return;
        const key = a < b ? `${a}|${b}` : `${b}|${a}`;
        const existing = pairMap.get(key);
        if (existing) {
          existing.weight += w;
        } else {
          pairMap.set(key, { source: a, target: b, weight: w, relation });
        }
      };

      for (const e of aggregatedEdges) {
        addPair(String(e.source), String(e.target), Number(e.weight ?? 1), 'community_link');
      }

      // Fallback: connect orphan communities via directory co-location.
      // Any community whose representative shares a top-level source-file directory
      // with another rep gets a soft "co_located" edge. Keeps the graph connected.
      const connected = new Set<string>();
      for (const p of pairMap.values()) {
        connected.add(p.source);
        connected.add(p.target);
      }

      const topDir = (path: string | null | undefined): string | null => {
        if (!path) return null;
        const parts = String(path).split('/').filter(Boolean);
        if (parts.length === 0) return null;
        // Use the first 2 segments as directory key (e.g. "packages/dashboard").
        return parts.slice(0, Math.min(2, parts.length)).join('/');
      };

      const byDir = new Map<string, string[]>(); // dir -> rep ids
      for (const n of samples) {
        const dir = topDir(n.source_file);
        if (!dir) continue;
        const arr = byDir.get(dir) ?? [];
        arr.push(String(n.id));
        byDir.set(dir, arr);
      }

      for (const n of samples) {
        const rid = String(n.id);
        if (connected.has(rid)) continue;
        const dir = topDir(n.source_file);
        if (!dir) continue;
        const siblings = byDir.get(dir) ?? [];
        // Prefer linking to an already-connected rep in the same directory,
        // so we pull orphans into the main graph rather than forming islands.
        const anchor =
          siblings.find(id => id !== rid && connected.has(id)) ??
          siblings.find(id => id !== rid);
        if (anchor) {
          addPair(rid, anchor, 1, 'co_located');
          connected.add(rid);
          connected.add(anchor);
        }
      }

      return c.json({
        nodes: samples.map((n: any) => ({
          id: n.id,
          label: n.label,
          type: n.type,
          source_file: n.source_file,
          community: n.community_id,
          community_size: Number(n.community_size ?? 1),
        })),
        edges: Array.from(pairMap.values()).map(e => ({
          source: e.source,
          target: e.target,
          relation: e.relation,
          weight: String(e.weight),
        })),
        mode,
        total: samples.length,
      });
    }

    return c.json({ nodes: [], edges: [], mode, total: 0 });
  } catch (err) {
    console.error('[graph/summary] error:', err);
    return c.json({ nodes: [], edges: [], mode, total: 0, error: String(err) }, 500);
  }
});

// GET /graph/community?communityId=X&projectId=UUID&limit=500
// Returns all nodes of a single community plus internal edges.
graphRoutes.get('/graph/community', async (c) => {
  const db = getDb();
  const communityId = c.req.query('communityId');
  const projectId = c.req.query('projectId');
  const limit = Math.min(parseInt(c.req.query('limit') ?? '500', 10), 1000);

  if (!communityId) {
    return c.json({ nodes: [], edges: [], total: 0, error: 'communityId required' }, 400);
  }

  try {
    const nodesQuery = projectId
      ? sql`
          SELECT n.id, n.label, n.type, n.source_file, n.source_location,
                 n.project_id, n.community_id, n.properties,
                 (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) as degree
          FROM graph_nodes n
          WHERE n.community_id = ${communityId} AND n.project_id = ${projectId}
          ORDER BY degree DESC
          LIMIT ${limit}
        `
      : sql`
          SELECT n.id, n.label, n.type, n.source_file, n.source_location,
                 n.project_id, n.community_id, n.properties,
                 (SELECT COUNT(*) FROM graph_edges e WHERE e.source_node_id = n.id OR e.target_node_id = n.id) as degree
          FROM graph_nodes n
          WHERE n.community_id = ${communityId}
          ORDER BY degree DESC
          LIMIT ${limit}
        `;

    const nodesResult = await db.execute(nodesQuery);
    const nodes = (nodesResult.rows ?? (nodesResult as unknown as any[]) ?? []) as any[];

    if (nodes.length === 0) {
      return c.json({ nodes: [], edges: [], total: 0 });
    }

    const ids = nodes.map((r: any) => String(r.id));
    const idsSql = sql.raw(`ARRAY[${ids.map(id => `'${id.replace(/'/g, "''")}'`).join(',')}]::varchar[]`);
    const edgeQuery = sql`
      SELECT source_node_id, target_node_id, relation, confidence, confidence_score, weight, source_file
      FROM graph_edges
      WHERE source_node_id = ANY(${idsSql}) AND target_node_id = ANY(${idsSql})
    `;
    const edgesResult = await db.execute(edgeQuery);
    const edges = (edgesResult.rows ?? (edgesResult as unknown as any[]) ?? []) as any[];

    const totalCountRow = projectId
      ? await db.execute(sql`SELECT COUNT(*)::int AS c FROM graph_nodes WHERE community_id = ${communityId} AND project_id = ${projectId}`)
      : await db.execute(sql`SELECT COUNT(*)::int AS c FROM graph_nodes WHERE community_id = ${communityId}`);
    const totalRows = (totalCountRow.rows ?? (totalCountRow as unknown as any[]) ?? []) as any[];
    const total = Number(totalRows[0]?.c ?? nodes.length);

    return c.json({
      nodes: nodes.map((n: any) => ({
        id: n.id,
        label: n.label,
        type: n.type,
        source_file: n.source_file,
        source_location: n.source_location,
        project_id: n.project_id,
        community: n.community_id,
        degree: Number(n.degree ?? 0),
        properties: n.properties,
      })),
      edges: edges.map((e: any) => ({
        source: e.source_node_id,
        target: e.target_node_id,
        relation: e.relation,
        confidence: e.confidence,
        confidence_score: e.confidence_score,
        weight: e.weight,
        source_file: e.source_file,
      })),
      total,
      communityId,
    });
  } catch (err) {
    console.error('[graph/community] error:', err);
    return c.json({ nodes: [], edges: [], total: 0, error: String(err) }, 500);
  }
});
