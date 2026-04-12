import { Hono } from 'hono';
import {
  getDb, listProjects, listReposByProject, listSnapshots,
  createSnapshot, insertEvent, getGraphFull, upsertGraphNode, graphEdges,
  projects, repos,
} from '@cortex/db';

export const exportImportRoutes = new Hono();

// GET /export — full snapshot of Cortex metadata + graph
exportImportRoutes.get('/export', async (c) => {
  const db = getDb();

  const allProjects = await listProjects(db);
  const reposByProject: Record<string, unknown[]> = {};
  for (const p of allProjects) {
    reposByProject[p.id] = await listReposByProject(db, p.id);
  }

  const graphData = await getGraphFull(db).catch(() => ({ nodes: [] as unknown[], edges: [] as unknown[] }));

  const snapshot = {
    version: '2.0',
    exportedAt: new Date().toISOString(),
    cortex: {
      projects: allProjects.map((p) => ({
        ...p,
        repos: reposByProject[p.id] ?? [],
      })),
    },
    graph: {
      nodes: graphData.nodes,
      edges: graphData.edges,
    },
  };

  await createSnapshot(db, {
    name: `export-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`,
    metadata: {
      projectCount: allProjects.length,
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

  if (!body.version || !body.cortex) {
    return c.json({ error: 'Invalid snapshot format. Required: version, cortex' }, 400);
  }

  const db = getDb();

  const stats = { projectsImported: 0, reposImported: 0, nodesImported: 0, edgesImported: 0, errors: [] as string[] };

  // Import projects preserving original IDs (so graph nodes' FK projectId
  // remains valid). Conflict on id or name is skipped to keep import idempotent.
  for (const projectData of body.cortex.projects ?? []) {
    try {
      const inserted = await db.insert(projects)
        .values({
          id: projectData.id,
          name: projectData.name,
          description: projectData.description ?? null,
          metadata: projectData.metadata ?? null,
        })
        .onConflictDoNothing()
        .returning();
      if (inserted.length > 0) stats.projectsImported++;
    } catch (err) {
      stats.errors.push(`Project "${projectData.name}" import failed: ${err instanceof Error ? err.message : String(err)}`);
    }

    for (const repoData of projectData.repos ?? []) {
      try {
        const inserted = await db.insert(repos)
          .values({
            id: repoData.id,
            projectId: projectData.id,
            name: repoData.name,
            slug: repoData.slug,
            cloneUrl: repoData.cloneUrl,
            provider: repoData.provider,
            techStack: repoData.techStack ?? [],
            defaultBranch: repoData.defaultBranch,
            trackedBranches: repoData.trackedBranches ?? null,
            metadata: repoData.metadata ?? null,
          })
          .onConflictDoNothing()
          .returning();
        if (inserted.length > 0) stats.reposImported++;
      } catch (err) {
        stats.errors.push(`Repo "${repoData.slug}" import failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  }

  // Import graph data (v2 format) or legacy v1 snapshot format
  const graphData = body.graph ?? body.lightrag?.graph;
  if (graphData) {
    // Import nodes
    for (const node of graphData.nodes ?? []) {
      try {
        await upsertGraphNode(db, {
          id: node.id,
          label: node.label ?? node.id,
          type: node.type ?? 'unknown',
          fileType: node.fileType ?? node.file_type ?? null,
          sourceFile: node.sourceFile ?? node.source_file ?? null,
          sourceLocation: node.sourceLocation ?? node.source_location ?? null,
          projectId: node.projectId ?? node.project_id ?? null,
          repoId: node.repoId ?? node.repo_id ?? null,
          communityId: node.communityId ?? node.community_id ?? null,
          properties: node.properties ?? {},
        });
        stats.nodesImported++;
      } catch (err) {
        stats.errors.push(`Node import failed (${node.id}): ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    // Import edges
    const edgeBatch = [];
    for (const edge of graphData.edges ?? []) {
      edgeBatch.push({
        sourceNodeId: edge.sourceNodeId ?? edge.source_node_id ?? edge.source,
        targetNodeId: edge.targetNodeId ?? edge.target_node_id ?? edge.target,
        relation: edge.relation ?? 'RELATED_TO',
        confidence: edge.confidence ?? 'IMPORTED',
        confidenceScore: edge.confidenceScore ?? edge.confidence_score ?? null,
        weight: edge.weight ?? '1.0',
        sourceFile: edge.sourceFile ?? edge.source_file ?? null,
        properties: edge.properties ?? {},
        projectId: edge.projectId ?? edge.project_id ?? null,
      });
    }

    if (edgeBatch.length > 0) {
      try {
        const BATCH_SIZE = 500;
        for (let i = 0; i < edgeBatch.length; i += BATCH_SIZE) {
          const batch = edgeBatch.slice(i, i + BATCH_SIZE);
          await db.insert(graphEdges).values(batch).onConflictDoNothing();
        }
        stats.edgesImported = edgeBatch.length;
      } catch (err) {
        stats.errors.push(`Edge import failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
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
