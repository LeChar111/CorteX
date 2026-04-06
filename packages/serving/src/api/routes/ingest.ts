import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, insertEvent } from '@cortex/db';
import { LightRAGClient } from '../../lightrag/client.js';

export const ingestRoutes = new Hono();

const IngestSchema = z.object({
  content: z.string().min(1),
  filePath: z.string().optional(),
  language: z.string().optional(),
  project: z.string().optional(),
  repo: z.string().optional(),
  type: z.enum(['code', 'doc', 'knowledge', 'relation']).default('code'),
  // For type='knowledge'
  name: z.string().optional(),
  description: z.string().optional(),
  // For type='relation'
  source: z.string().optional(),
  target: z.string().optional(),
  relationType: z.string().optional(),
});

ingestRoutes.post('/ingest', async (c) => {
  const body = await c.req.json();
  const data = IngestSchema.parse(body);

  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  const client = new LightRAGClient(lightragUrl);

  let document: string;

  if (data.type === 'knowledge') {
    document = `# Knowledge: ${data.name ?? 'Untitled'}\n\n${data.description ?? data.content}\n\nProject: ${data.project ?? 'unknown'}`;
  } else if (data.type === 'relation') {
    document = `# Relation\n\n${data.source} --[${data.relationType}]--> ${data.target}\n\nDescription: ${data.content}`;
  } else {
    document = `# File: ${data.filePath ?? 'unknown'}\nLanguage: ${data.language ?? 'text'}\nProject: ${data.project ?? 'unknown'}\n\n\`\`\`${data.language ?? ''}\n${data.content}\n\`\`\``;
  }

  await client.ingest(document, {
    project: data.project ?? '',
    type: data.type,
  });

  const db = getDb();
  await insertEvent(db, {
    type: 'content.ingested',
    payload: { filePath: data.filePath, type: data.type },
  });

  return c.json({ status: 'ingested', type: data.type }, 201);
});
