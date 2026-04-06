import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, createProjectLink, listProjectLinks, deleteProjectLink, listAllProjectLinks } from '@cortex/db';

export const projectLinksRouter = new Hono();

const LinkSchema = z.object({
  sourceProjectId: z.string().uuid(),
  targetProjectId: z.string().uuid(),
  linkType: z.enum(['depends_on', 'tests', 'extends', 'deploys', 'shares_lib', 'related']),
  description: z.string().optional(),
});

// GET /project-links?projectId=xxx — links for a project (or all if no filter)
projectLinksRouter.get('/project-links', async (c) => {
  const db = getDb();
  const projectId = c.req.query('projectId');
  const links = projectId ? await listProjectLinks(db, projectId) : await listAllProjectLinks(db);
  return c.json(links);
});

// POST /project-links — create a link
projectLinksRouter.post('/project-links', async (c) => {
  const body = await c.req.json();
  const data = LinkSchema.parse(body);
  const db = getDb();
  const link = await createProjectLink(db, data);
  return c.json(link, 201);
});

// DELETE /project-links/:id — remove a link
projectLinksRouter.delete('/project-links/:id', async (c) => {
  const db = getDb();
  const deleted = await deleteProjectLink(db, c.req.param('id'));
  if (!deleted) return c.json({ error: 'Not found' }, 404);
  return new Response(null, { status: 204 });
});
