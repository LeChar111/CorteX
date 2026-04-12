import { Hono } from 'hono';
import { z } from 'zod';
import {
  getDb,
  insertEvent,
  getProjectByName,
  upsertGraphNode,
  graphEdges,
} from '@cortex/db';

export const ingestRoutes = new Hono();

/** Generate a node ID from a name: lowercase, spaces to underscores */
function nameToId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_');
}

const IngestSchema = z.object({
  content: z.string().min(1),
  filePath: z.string().optional(),
  language: z.string().optional(),
  project: z.string().optional(),
  projectId: z.string().uuid().optional(),
  repo: z.string().optional(),
  type: z.enum(['code', 'doc', 'knowledge', 'relation']).default('code'),
  name: z.string().optional(),
  description: z.string().optional(),
  source: z.string().optional(),
  target: z.string().optional(),
  relationType: z.string().optional(),
});

ingestRoutes.post('/ingest', async (c) => {
  const body = await c.req.json();
  const data = IngestSchema.parse(body);
  const db = getDb();

  // Resolve projectId from project name if not provided
  let resolvedProjectId = data.projectId;
  if (!resolvedProjectId && data.project) {
    try {
      const project = await getProjectByName(db, data.project);
      if (project) resolvedProjectId = project.id;
    } catch {
      // proceed without projectId
    }
  }

  if (data.type === 'relation' && data.source && data.target && data.relationType) {
    // Direct graph relation — structural edge
    const sourceId = nameToId(data.source);
    const targetId = nameToId(data.target);

    await upsertGraphNode(db, {
      id: sourceId,
      label: data.source,
      type: 'ENTITY',
      projectId: resolvedProjectId ?? null,
      properties: {
        description: data.source,
        projectName: data.project,
      },
    });

    await upsertGraphNode(db, {
      id: targetId,
      label: data.target,
      type: 'ENTITY',
      projectId: resolvedProjectId ?? null,
      properties: {
        description: data.target,
        projectName: data.project,
      },
    });

    await db.insert(graphEdges).values({
      sourceNodeId: sourceId,
      targetNodeId: targetId,
      relation: data.relationType,
      weight: '1.0',
      projectId: resolvedProjectId ?? null,
      properties: {
        description: data.content || `${data.source} ${data.relationType} ${data.target}`,
      },
    });

  } else if (data.type === 'knowledge') {
    const entityName = data.name ?? 'Untitled';
    const entityId = nameToId(entityName);

    await upsertGraphNode(db, {
      id: entityId,
      label: entityName,
      type: 'CONCEPT',
      projectId: resolvedProjectId ?? null,
      properties: {
        description: data.description ?? data.content,
        projectName: data.project,
      },
    });

  } else {
    // Code/doc ingestion: create a node representing the file
    const filePath = data.filePath ?? 'unknown';
    const nodeId = nameToId(filePath.replace(/[/\\]/g, '_'));

    await upsertGraphNode(db, {
      id: nodeId,
      label: filePath.split('/').pop() ?? filePath,
      type: data.type === 'doc' ? 'DOCUMENT' : 'FILE',
      fileType: data.language ?? null,
      sourceFile: filePath,
      projectId: resolvedProjectId ?? null,
      properties: {
        language: data.language,
        projectName: data.project,
        content: data.content.slice(0, 500), // Store a preview
      },
    });
  }

  await insertEvent(db, {
    type: 'content.ingested',
    payload: { filePath: data.filePath, type: data.type, source: data.source, target: data.target },
  });

  return c.json({ status: 'ingested', type: data.type }, 201);
});
