import { Hono } from 'hono';
import {
  getDb, listProjects, listReposByProject, listSnapshots,
  createSnapshot, insertEvent,
} from '@cortex/db';
import { LightRAGClient } from '../../lightrag/client.js';

export const exportImportRoutes = new Hono();

// GET /export — full snapshot of Cortex metadata + LightRAG graph + documents
exportImportRoutes.get('/export', async (c) => {
  const db = getDb();
  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  const client = new LightRAGClient(lightragUrl);

  const allProjects = await listProjects(db);
  const reposByProject: Record<string, unknown[]> = {};
  for (const p of allProjects) {
    reposByProject[p.id] = await listReposByProject(db, p.id);
  }

  const [docData, graphData] = await Promise.all([
    client.getDocumentContents().catch(() => ({ documents: [] as unknown[] })),
    client.getGraphFull().catch(() => ({ nodes: [] as unknown[], edges: [] as unknown[] })),
  ]);

  const snapshot = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    cortex: {
      projects: allProjects.map((p) => ({
        ...p,
        repos: reposByProject[p.id] ?? [],
      })),
    },
    lightrag: {
      documents: docData.documents,
      graph: graphData,
    },
  };

  await createSnapshot(db, {
    name: `export-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`,
    metadata: {
      projectCount: allProjects.length,
      documentCount: docData.documents.length,
      graphNodeCount: graphData.nodes.length,
      graphEdgeCount: graphData.edges.length,
    },
  });

  c.header('Content-Disposition', `attachment; filename="cortex-snapshot-${Date.now()}.json"`);
  c.header('Content-Type', 'application/json');
  return c.json(snapshot);
});

// POST /import — restore a snapshot
exportImportRoutes.post('/import', async (c) => {
  const body = await c.req.json();

  if (!body.version || !body.cortex || !body.lightrag) {
    return c.json({ error: 'Invalid snapshot format. Required: version, cortex, lightrag' }, 400);
  }

  const db = getDb();
  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  const client = new LightRAGClient(lightragUrl);
  const { createProject, createRepo, getProjectByName } = await import('@cortex/db');

  const stats = { projectsImported: 0, reposImported: 0, documentsIngested: 0, errors: [] as string[] };

  for (const projectData of body.cortex.projects ?? []) {
    try {
      await createProject(db, {
        name: projectData.name,
        description: projectData.description,
        metadata: projectData.metadata,
      });
      stats.projectsImported++;
    } catch {
      // Project may already exist
    }

    for (const repoData of projectData.repos ?? []) {
      try {
        const project = await getProjectByName(db, projectData.name);
        if (project) {
          await createRepo(db, {
            projectId: project.id,
            name: repoData.name,
            slug: repoData.slug,
            cloneUrl: repoData.cloneUrl,
            provider: repoData.provider,
            techStack: repoData.techStack,
            defaultBranch: repoData.defaultBranch,
            trackedBranches: repoData.trackedBranches,
            metadata: repoData.metadata,
          });
          stats.reposImported++;
        }
      } catch {
        // Repo may already exist
      }
    }
  }

  const documents = body.lightrag.documents ?? [];
  const BATCH_SIZE = 5;
  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (doc: { content?: string; text?: string; metadata?: Record<string, string> }) => {
        try {
          const text = doc.content ?? doc.text ?? '';
          if (text) {
            await client.ingest(text, doc.metadata);
            stats.documentsIngested++;
          }
        } catch (err) {
          stats.errors.push(`Doc ingest failed: ${err instanceof Error ? err.message : String(err)}`);
        }
      }),
    );
  }

  await insertEvent(db, {
    type: 'snapshot.imported',
    payload: stats,
  });

  return c.json({ status: 'imported', stats });
});

// GET /snapshots — list past export snapshots
exportImportRoutes.get('/snapshots', async (c) => {
  const db = getDb();
  const list = await listSnapshots(db);
  return c.json(list);
});
