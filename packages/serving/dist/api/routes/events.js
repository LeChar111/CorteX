import { Hono } from 'hono';
import { getDb, listEvents } from '@cortex/db';
export const eventRoutes = new Hono();
eventRoutes.get('/events', async (c) => {
    const db = getDb();
    const projectId = c.req.query('projectId') ?? undefined;
    const type = c.req.query('type') ?? undefined;
    const limit = Number(c.req.query('limit')) || 50;
    const offset = Number(c.req.query('offset')) || 0;
    const events = await listEvents(db, { projectId, type, limit, offset });
    return c.json(events);
});
//# sourceMappingURL=events.js.map