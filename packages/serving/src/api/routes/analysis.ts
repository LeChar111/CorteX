import { Hono } from 'hono';
import { z } from 'zod';
import {
  getDb,
  getProjectById,
  getGraphForProject,
  getGraphFull,
  getCommunitiesForProject,
} from '@cortex/db';

export const analysisRoutes = new Hono();

// Helper: flatten node properties for backward compat
function nodeProps(n: Record<string, unknown>): Record<string, unknown> {
  const props = (n.properties ?? {}) as Record<string, unknown>;
  return { ...n, ...props };
}

// ── POST /analysis/impact ──────────────────────────────────────────────

const ImpactSchema = z.object({
  filePath: z.string().min(1),
  projectId: z.string().uuid().optional(),
});

analysisRoutes.post('/analysis/impact', async (c) => {
  const data = ImpactSchema.parse(await c.req.json());
  const db = getDb();

  const graph = data.projectId
    ? await getGraphForProject(db, data.projectId).catch(() => ({ nodes: [], edges: [] }))
    : await getGraphFull(db).catch(() => ({ nodes: [], edges: [] }));

  const directImpact: Array<{ entity: string; file: string; project: string; type: string }> = [];
  const transitiveImpact: Array<{ entity: string; file: string; project: string; depth: number }> = [];
  const crossProjectImpact: Array<{ entity: string; file: string; project: string }> = [];

  const allNodes = graph.nodes as Array<Record<string, unknown>>;
  const allEdges = graph.edges as Array<Record<string, unknown>>;

  // Find nodes matching the file path
  const fileNodes = allNodes.filter((n) => {
    const sourceFile = String(n.sourceFile ?? n.source_file ?? '');
    const label = String(n.label ?? '');
    return sourceFile.includes(data.filePath) || label.includes(data.filePath);
  });

  const currentProjectId = data.projectId;

  for (const node of fileNodes) {
    directImpact.push({
      entity: String(node.label ?? node.id ?? 'unknown'),
      file: data.filePath,
      project: String(node.projectId ?? node.project_id ?? 'unknown'),
      type: String(node.type ?? 'unknown'),
    });
  }

  // BFS: 1-hop and 2-hop connections
  const fileNodeIds = new Set(fileNodes.map((n) => String(n.id ?? '')));
  const visited = new Set<string>(fileNodeIds);

  // Hop 1: direct connections
  const hop1Edges = allEdges.filter(
    (e) => fileNodeIds.has(String(e.sourceNodeId ?? e.source_node_id ?? '')) ||
           fileNodeIds.has(String(e.targetNodeId ?? e.target_node_id ?? '')),
  );
  const hop1Ids = new Set<string>();

  for (const edge of hop1Edges) {
    const src = String(edge.sourceNodeId ?? edge.source_node_id ?? '');
    const tgt = String(edge.targetNodeId ?? edge.target_node_id ?? '');
    const otherId = fileNodeIds.has(src) ? tgt : src;
    if (!visited.has(otherId)) {
      visited.add(otherId);
      hop1Ids.add(otherId);
      const node = allNodes.find((n) => String(n.id ?? '') === otherId);

      const isExternal = currentProjectId && node
        ? String(node.projectId ?? node.project_id ?? '') !== currentProjectId
        : false;

      if (isExternal && node) {
        crossProjectImpact.push({
          entity: String(node.label ?? otherId),
          file: String(node.sourceFile ?? node.source_file ?? 'unknown'),
          project: String(node.projectId ?? node.project_id ?? 'unknown'),
        });
      } else {
        const p = node ? nodeProps(node) : {};
        transitiveImpact.push({
          entity: String(node?.label ?? otherId),
          file: String(p.sourceFile ?? p.source_file ?? 'unknown'),
          project: String(node?.projectId ?? node?.project_id ?? 'unknown'),
          depth: 1,
        });
      }
    }
  }

  // Hop 2: transitive connections
  const hop2Edges = allEdges.filter(
    (e) => hop1Ids.has(String(e.sourceNodeId ?? e.source_node_id ?? '')) ||
           hop1Ids.has(String(e.targetNodeId ?? e.target_node_id ?? '')),
  );

  for (const edge of hop2Edges) {
    const src = String(edge.sourceNodeId ?? edge.source_node_id ?? '');
    const tgt = String(edge.targetNodeId ?? edge.target_node_id ?? '');
    const otherId = hop1Ids.has(src) ? tgt : src;
    if (!visited.has(otherId)) {
      visited.add(otherId);
      const node = allNodes.find((n) => String(n.id ?? '') === otherId);

      const isExternal = currentProjectId && node
        ? String(node.projectId ?? node.project_id ?? '') !== currentProjectId
        : false;

      if (isExternal && node) {
        crossProjectImpact.push({
          entity: String(node.label ?? otherId),
          file: String(node.sourceFile ?? node.source_file ?? 'unknown'),
          project: String(node.projectId ?? node.project_id ?? 'unknown'),
        });
      } else {
        transitiveImpact.push({
          entity: String(node?.label ?? otherId),
          file: String(node?.sourceFile ?? node?.source_file ?? 'unknown'),
          project: String(node?.projectId ?? node?.project_id ?? 'unknown'),
          depth: 2,
        });
      }
    }
  }

  return c.json({
    filePath: data.filePath,
    directImpact,
    transitiveImpact,
    crossProjectImpact,
    rawAnalysis: `Graph analysis: ${directImpact.length} direct entities, ${transitiveImpact.length} transitive impacts, ${crossProjectImpact.length} cross-project impacts found.`,
  });
});

// ── POST /analysis/drift ───────────────────────────────────────────────

const DriftSchema = z.object({ projectId: z.string().uuid() });

analysisRoutes.post('/analysis/drift', async (c) => {
  const data = DriftSchema.parse(await c.req.json());
  const db = getDb();

  const project = await getProjectById(db, data.projectId);
  if (!project) return c.json({ error: 'Project not found' }, 404);

  const graph = await getGraphForProject(db, data.projectId).catch(() => ({
    nodes: [] as Array<Record<string, unknown>>,
    edges: [] as Array<Record<string, unknown>>,
  }));

  // Group entities by type
  const typeCounts: Record<string, number> = {};
  for (const n of graph.nodes) {
    const t = String((n as Record<string, unknown>).type ?? 'unknown');
    typeCounts[t] = (typeCounts[t] ?? 0) + 1;
  }
  const summary = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => `${count} ${type}`)
    .join(', ');

  return c.json({
    projectId: data.projectId,
    projectName: project.name,
    currentState: {
      entityCount: graph.nodes.length,
      entities: graph.nodes.slice(0, 50).map((n) => ({
        name: String((n as Record<string, unknown>).label ?? (n as Record<string, unknown>).id ?? ''),
        type: String((n as Record<string, unknown>).type ?? 'unknown'),
      })),
    },
    analysis: `Project ${project.name} graph contains ${graph.nodes.length} entities: ${summary}.`,
    timestamp: new Date().toISOString(),
  });
});

// ── GET /analysis/dead-code ────────────────────────────────────────────

analysisRoutes.get('/analysis/dead-code', async (c) => {
  const projectId = c.req.query('projectId');
  if (!projectId) return c.json({ error: 'projectId required' }, 400);

  const db = getDb();
  const project = await getProjectById(db, projectId);
  if (!project) return c.json({ error: 'Project not found' }, 404);

  const graph = await getGraphForProject(db, projectId).catch(() => ({
    nodes: [] as Array<Record<string, unknown>>,
    edges: [] as Array<Record<string, unknown>>,
  }));

  // Find nodes with zero incoming edges
  const targetIds = new Set(graph.edges.map((e) => String((e as Record<string, unknown>).targetNodeId ?? (e as Record<string, unknown>).target_node_id ?? '')));
  const unreferenced = graph.nodes.filter(
    (n) => !targetIds.has(String((n as Record<string, unknown>).id ?? '')),
  );

  // Filter out entry points and non-code entities
  const entryPatterns = /^(main|index|app|server|worker|export)/i;
  const nonCodeTypes = new Set(['dependency', 'env_variable', 'container', 'port', 'pipeline']);
  const deadCode = unreferenced.filter((n) => {
    const nr = n as Record<string, unknown>;
    const entityType = String(nr.type ?? '').toLowerCase();
    if (nonCodeTypes.has(entityType)) return false;
    return !entryPatterns.test(String(nr.label ?? ''));
  });

  return c.json({
    unreferencedEntities: deadCode.slice(0, 100).map((n) => {
      const nr = n as Record<string, unknown>;
      return {
        name: String(nr.label ?? nr.id ?? ''),
        type: String(nr.type ?? 'unknown'),
        file: String(nr.sourceFile ?? nr.source_file ?? ''),
      };
    }),
    count: deadCode.length,
    totalEntities: graph.nodes.length,
  });
});

// ── GET /analysis/health-score ─────────────────────────────────────────

analysisRoutes.get('/analysis/health-score', async (c) => {
  const projectId = c.req.query('projectId');
  if (!projectId) return c.json({ error: 'projectId required' }, 400);

  const db = getDb();
  const project = await getProjectById(db, projectId);
  if (!project) return c.json({ error: 'Project not found' }, 404);

  const graph = await getGraphForProject(db, projectId).catch(() => ({
    nodes: [] as Array<Record<string, unknown>>,
    edges: [] as Array<Record<string, unknown>>,
  }));

  // Get full graph for cross-project edge detection
  const fullGraph = await getGraphFull(db).catch(() => ({
    nodes: [] as Array<Record<string, unknown>>,
    edges: [] as Array<Record<string, unknown>>,
  }));

  const projectNodeIds = new Set(graph.nodes.map((n) => String((n as Record<string, unknown>).id ?? '')));
  const totalNodes = graph.nodes.length;

  const targetIds = new Set(graph.edges.map((e) => String((e as Record<string, unknown>).targetNodeId ?? (e as Record<string, unknown>).target_node_id ?? '')));
  const orphanCount = graph.nodes.filter(
    (n) => !targetIds.has(String((n as Record<string, unknown>).id ?? '')),
  ).length;
  const orphanRatio = totalNodes > 0 ? Math.round((orphanCount / totalNodes) * 100) : 0;

  // Cross-project edges
  const allEdges = fullGraph.edges as Array<Record<string, unknown>>;
  const externalEdges = allEdges.filter((e) => {
    const src = String(e.sourceNodeId ?? e.source_node_id ?? '');
    const tgt = String(e.targetNodeId ?? e.target_node_id ?? '');
    return (projectNodeIds.has(src) && !projectNodeIds.has(tgt)) ||
           (!projectNodeIds.has(src) && projectNodeIds.has(tgt));
  });
  const crossProjectCoupling = totalNodes > 0
    ? Math.round((externalEdges.length / Math.max(graph.edges.length, 1)) * 100)
    : 0;

  const graphCoverage = totalNodes > 0
    ? Math.min(100, Math.round((graph.edges.length / totalNodes) * 50))
    : 0;

  const score = Math.max(0, Math.min(100,
    graphCoverage * 0.4 +
    (100 - orphanRatio) * 0.3 +
    Math.min(crossProjectCoupling * 2, 30) +
    (totalNodes > 5 ? 10 : 0),
  ));

  return c.json({
    score: Math.round(score),
    breakdown: {
      graphCoverage,
      orphanRatio,
      cyclomaticComplexity: Math.round((graph.edges.length / Math.max(totalNodes, 1)) * 10),
      crossProjectCoupling,
    },
    stats: {
      totalEntities: totalNodes,
      totalRelations: graph.edges.length,
      orphanEntities: orphanCount,
      externalRelations: externalEdges.length,
    },
  });
});

// ── GET /analysis/communities ──────────────────────────────────────────

analysisRoutes.get('/analysis/communities', async (c) => {
  const projectId = c.req.query('projectId');
  if (!projectId) return c.json({ error: 'projectId required' }, 400);

  const db = getDb();
  const project = await getProjectById(db, projectId);
  if (!project) return c.json({ error: 'Project not found' }, 404);

  const communities = await getCommunitiesForProject(db, projectId);
  return c.json({
    projectId,
    projectName: project.name,
    communities,
    count: communities.length,
  });
});

// ── GET /analysis/god-nodes ────────────────────────────────────────────

analysisRoutes.get('/analysis/god-nodes', async (c) => {
  const projectId = c.req.query('projectId');
  if (!projectId) return c.json({ error: 'projectId required' }, 400);

  const db = getDb();
  const communities = await getCommunitiesForProject(db, projectId);

  const godNodes = communities.flatMap((comm) => {
    const gods = (comm.godNodes ?? []) as Array<Record<string, unknown>>;
    return gods.map((g) => ({
      ...g,
      communityId: comm.id,
      communityIndex: comm.communityIndex,
    }));
  });

  return c.json({ projectId, godNodes, count: godNodes.length });
});

// ── GET /analysis/surprising-connections ───────────────────────────────

analysisRoutes.get('/analysis/surprising-connections', async (c) => {
  const projectId = c.req.query('projectId');
  if (!projectId) return c.json({ error: 'projectId required' }, 400);

  const db = getDb();
  const communities = await getCommunitiesForProject(db, projectId);

  const surprisingConnections = communities.flatMap((comm) => {
    const connections = (comm.surprisingConnections ?? []) as Array<Record<string, unknown>>;
    return connections.map((sc) => ({
      ...sc,
      communityId: comm.id,
      communityIndex: comm.communityIndex,
    }));
  });

  return c.json({ projectId, surprisingConnections, count: surprisingConnections.length });
});
