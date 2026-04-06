import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, createAnnotation, listAnnotationsByEntity, listAnnotationsByProject, updateAnnotation, deleteAnnotation } from '@cortex/db';

export const annotationsRouter = new Hono();

const AnnotationSchema = z.object({
  entityName: z.string().min(1),
  projectId: z.string().uuid().optional(),
  type: z.enum(['note', 'decision', 'warning', 'todo']),
  content: z.string().min(1),
  author: z.string().optional(),
});

annotationsRouter.get('/annotations', async (c) => {
  const db = getDb();
  const entity = c.req.query('entity');
  const projectId = c.req.query('projectId');
  if (entity) return c.json(await listAnnotationsByEntity(db, entity));
  if (projectId) return c.json(await listAnnotationsByProject(db, projectId));
  return c.json({ error: 'entity or projectId required' }, 400);
});

annotationsRouter.post('/annotations', async (c) => {
  const data = AnnotationSchema.parse(await c.req.json());
  const db = getDb();
  return c.json(await createAnnotation(db, data), 201);
});

annotationsRouter.put('/annotations/:id', async (c) => {
  const { content, type } = z.object({ content: z.string().optional(), type: z.string().optional() }).parse(await c.req.json());
  const db = getDb();
  const updated = await updateAnnotation(db, c.req.param('id'), { content, type });
  if (!updated) return c.json({ error: 'Not found' }, 404);
  return c.json(updated);
});

annotationsRouter.delete('/annotations/:id', async (c) => {
  const db = getDb();
  const deleted = await deleteAnnotation(db, c.req.param('id'));
  if (!deleted) return c.json({ error: 'Not found' }, 404);
  return new Response(null, { status: 204 });
});
