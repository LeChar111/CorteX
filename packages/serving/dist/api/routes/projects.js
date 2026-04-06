import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, listProjects, getProjectById, createProject, updateProject, deleteProject, } from '@cortex/db';
export const projectsRouter = new Hono();
const projectSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
});
const updateProjectSchema = projectSchema.partial();
// GET /projects
projectsRouter.get('/projects', async (c) => {
    const db = getDb();
    const projects = await listProjects(db);
    return c.json(projects);
});
// GET /projects/:id
projectsRouter.get('/projects/:id', async (c) => {
    const db = getDb();
    const project = await getProjectById(db, c.req.param('id'));
    if (!project) {
        return c.json({ error: 'Project not found' }, 404);
    }
    return c.json(project);
});
// POST /projects
projectsRouter.post('/projects', async (c) => {
    const body = await c.req.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
    }
    try {
        const db = getDb();
        const project = await createProject(db, parsed.data);
        return c.json(project, 201);
    }
    catch (err) {
        if (isPostgresError(err) && err.code === '23505') {
            return c.json({ error: 'Project name already exists' }, 409);
        }
        throw err;
    }
});
// PUT /projects/:id
projectsRouter.put('/projects/:id', async (c) => {
    const body = await c.req.json();
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
    }
    try {
        const db = getDb();
        const project = await updateProject(db, c.req.param('id'), parsed.data);
        if (!project) {
            return c.json({ error: 'Project not found' }, 404);
        }
        return c.json(project);
    }
    catch (err) {
        if (isPostgresError(err) && err.code === '23505') {
            return c.json({ error: 'Project name already exists' }, 409);
        }
        throw err;
    }
});
// DELETE /projects/:id
projectsRouter.delete('/projects/:id', async (c) => {
    const db = getDb();
    await deleteProject(db, c.req.param('id'));
    return new Response(null, { status: 204 });
});
function isPostgresError(err) {
    return typeof err === 'object' && err !== null && 'code' in err;
}
//# sourceMappingURL=projects.js.map