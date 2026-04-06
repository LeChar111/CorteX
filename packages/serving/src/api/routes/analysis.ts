import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, getProjectById, listReposByProject } from '@cortex/db';
import { LightRAGClient } from '../../lightrag/client.js';

export const analysisRoutes = new Hono();

// Helper: extract properties from a graph node (LightRAG nests data in properties)
function nodeProps(n: Record<string, unknown>): Record<string, unknown> {
  const props = (n.properties ?? {}) as Record<string, unknown>;
  return { ...n, ...props };
}

// Helper: build a set of keywords to match nodes to a project
// Uses repo names + slugs which appear in file paths and descriptions
async function getProjectKeywords(projectId: string): Promise<string[]> {
  const db = getDb();
  const repos = await listReposByProject(db, projectId);
  const keywords: string[] = [];
  for (const r of repos) {
    keywords.push(r.name.toLowerCase());
    if (r.slug && r.slug !== r.name) keywords.push(r.slug.toLowerCase());
  }
  return keywords;
}

// Helper: check if a node belongs to a project (by matching keywords in description/source)
function nodeMatchesProject(n: Record<string, unknown>, keywords: string[]): boolean {
  const p = nodeProps(n);
  const text = `${String(p.description ?? '')} ${String(p.source_id ?? '')} ${String(p.file_path ?? '')}`.toLowerCase();
  return keywords.some((kw) => text.includes(kw));
}

// ── POST /analysis/impact ──────────────────────────────────────────────

const ImpactSchema = z.object({
  filePath: z.string().min(1),
  projectId: z.string().uuid().optional(),
});

analysisRoutes.post('/analysis/impact', async (c) => {
  const data = ImpactSchema.parse(await c.req.json());
  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  const client = new LightRAGClient(lightragUrl);

  const graph = await client.getGraphFull().catch(() => ({ nodes: [], edges: [] }));

  const directImpact: Array<{ entity: string; file: string; project: string; type: string }> = [];
  const transitiveImpact: Array<{ entity: string; file: string; project: string; depth: number }> = [];
  const crossProjectImpact: Array<{ entity: string; file: string; project: string }> = [];

  const allNodes = graph.nodes as Array<Record<string, unknown>>;
  const allEdges = graph.edges as Array<Record<string, unknown>>;

  // Find nodes matching the file path
  const fileNodes = allNodes.filter((n) => {
    const p = nodeProps(n);
    const desc = String(p.description ?? '');
    const name = String(p.entity_name ?? p.entity_id ?? n.id ?? '');
    return desc.includes(data.filePath) || name.includes(data.filePath);
  });

  for (const node of fileNodes) {
    const p = nodeProps(node);
    directImpact.push({
      entity: String(p.entity_name ?? p.entity_id ?? node.id ?? 'unknown'),
      file: data.filePath,
      project: String(p.source_id ?? 'unknown').slice(0, 40),
      type: String(p.entity_type ?? 'unknown'),
    });
  }

  // 1-hop connections
  const fileNodeIds = new Set(fileNodes.map((n) => String(n.id ?? '')));
  const hop1Edges = allEdges.filter(
    (e) => fileNodeIds.has(String(e.source ?? '')) || fileNodeIds.has(String(e.target ?? '')),
  );
  const hop1Ids = new Set<string>();

  for (const edge of hop1Edges) {
    const src = String(edge.source ?? '');
    const tgt = String(edge.target ?? '');
    const otherId = fileNodeIds.has(src) ? tgt : src;
    if (!fileNodeIds.has(otherId) && !hop1Ids.has(otherId)) {
      hop1Ids.add(otherId);
      const node = allNodes.find((n) => String(n.id ?? '') === otherId);
      const p = node ? nodeProps(node) : {};
      transitiveImpact.push({
        entity: String(p.entity_name ?? p.entity_id ?? otherId),
        file: String(p.description ?? 'unknown').slice(0, 100),
        project: String(p.source_id ?? 'unknown').slice(0, 40),
        depth: 1,
      });
    }
  }

  return c.json({
    filePath: data.filePath,
    directImpact,
    transitiveImpact,
    crossProjectImpact,
    rawAnalysis: `Graph analysis: ${directImpact.length} direct entities, ${transitiveImpact.length} transitive impacts found.`,
  });
});

// ── POST /analysis/drift ───────────────────────────────────────────────

const DriftSchema = z.object({ projectId: z.string().uuid() });

analysisRoutes.post('/analysis/drift', async (c) => {
  const data = DriftSchema.parse(await c.req.json());
  const db = getDb();
  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  const client = new LightRAGClient(lightragUrl);

  const project = await getProjectById(db, data.projectId);
  if (!project) return c.json({ error: 'Project not found' }, 404);

  const keywords = await getProjectKeywords(data.projectId);
  const graph = await client.getGraphFull().catch(() => ({ nodes: [], edges: [] }));

  const allNodes = graph.nodes as Array<Record<string, unknown>>;
  const projectNodes = keywords.length > 0
    ? allNodes.filter((n) => nodeMatchesProject(n, keywords))
    : allNodes; // if no repos, show all

  // Group entities by type
  const typeCounts: Record<string, number> = {};
  for (const n of projectNodes) {
    const p = nodeProps(n);
    const t = String(p.entity_type ?? 'unknown');
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
      entityCount: projectNodes.length,
      entities: projectNodes.slice(0, 50).map((n) => {
        const p = nodeProps(n);
        return {
          name: String(p.entity_name ?? p.entity_id ?? n.id ?? ''),
          type: String(p.entity_type ?? 'unknown'),
        };
      }),
    },
    analysis: `Project ${project.name} graph contains ${projectNodes.length} entities: ${summary}.`,
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

  const keywords = await getProjectKeywords(projectId);
  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  const client = new LightRAGClient(lightragUrl);

  const graph = await client.getGraphFull().catch(() => ({ nodes: [], edges: [] }));
  const allNodes = graph.nodes as Array<Record<string, unknown>>;
  const edges = graph.edges as Array<Record<string, unknown>>;

  const projectNodes = keywords.length > 0
    ? allNodes.filter((n) => nodeMatchesProject(n, keywords))
    : allNodes;

  // Find nodes with zero incoming edges
  const targetIds = new Set(edges.map((e) => String(e.target ?? '')));
  const unreferenced = projectNodes.filter(
    (n) => !targetIds.has(String(n.id ?? '')),
  );

  // Filter out entry points
  const entryPatterns = /^(main|index|app|server|worker|export)/i;
  const deadCode = unreferenced.filter((n) => {
    const p = nodeProps(n);
    return !entryPatterns.test(String(p.entity_name ?? p.entity_id ?? ''));
  });

  return c.json({
    unreferencedEntities: deadCode.slice(0, 100).map((n) => {
      const p = nodeProps(n);
      return {
        name: String(p.entity_name ?? p.entity_id ?? n.id ?? ''),
        type: String(p.entity_type ?? 'unknown'),
        file: String(p.description ?? '').slice(0, 200),
      };
    }),
    count: deadCode.length,
    totalEntities: projectNodes.length,
  });
});

// ── GET /analysis/health-score ─────────────────────────────────────────

analysisRoutes.get('/analysis/health-score', async (c) => {
  const projectId = c.req.query('projectId');
  if (!projectId) return c.json({ error: 'projectId required' }, 400);

  const db = getDb();
  const project = await getProjectById(db, projectId);
  if (!project) return c.json({ error: 'Project not found' }, 404);

  const keywords = await getProjectKeywords(projectId);
  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  const client = new LightRAGClient(lightragUrl);

  const graph = await client.getGraphFull().catch(() => ({ nodes: [], edges: [] }));
  const allNodes = graph.nodes as Array<Record<string, unknown>>;
  const allEdges = graph.edges as Array<Record<string, unknown>>;

  const projectNodes = keywords.length > 0
    ? allNodes.filter((n) => nodeMatchesProject(n, keywords))
    : allNodes;

  const projectNodeIds = new Set(projectNodes.map((n) => String(n.id ?? '')));
  const projectEdges = allEdges.filter(
    (e) => projectNodeIds.has(String(e.source ?? '')) || projectNodeIds.has(String(e.target ?? '')),
  );

  const totalNodes = projectNodes.length;
  const targetIds = new Set(projectEdges.map((e) => String(e.target ?? '')));
  const orphanCount = projectNodes.filter(
    (n) => !targetIds.has(String(n.id ?? '')),
  ).length;
  const orphanRatio = totalNodes > 0 ? Math.round((orphanCount / totalNodes) * 100) : 0;

  const externalEdges = projectEdges.filter((e) => {
    const src = String(e.source ?? '');
    const tgt = String(e.target ?? '');
    return (projectNodeIds.has(src) && !projectNodeIds.has(tgt)) ||
           (!projectNodeIds.has(src) && projectNodeIds.has(tgt));
  });
  const crossProjectCoupling = totalNodes > 0
    ? Math.round((externalEdges.length / Math.max(projectEdges.length, 1)) * 100)
    : 0;

  const graphCoverage = totalNodes > 0
    ? Math.min(100, Math.round((projectEdges.length / totalNodes) * 50))
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
      cyclomaticComplexity: Math.round((projectEdges.length / Math.max(totalNodes, 1)) * 10),
      crossProjectCoupling,
    },
    stats: {
      totalEntities: totalNodes,
      totalRelations: projectEdges.length,
      orphanEntities: orphanCount,
      externalRelations: externalEdges.length,
    },
  });
});
