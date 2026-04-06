import { Hono } from 'hono';
import { z } from 'zod';
import { LightRAGClient } from '../../lightrag/client.js';
import { getDb, getProjectById, listProjectLinks } from '@cortex/db';
export const queryRoutes = new Hono();
// Frontend uses user-friendly names, LightRAG uses its own mode names
const FRONTEND_TO_LIGHTRAG_MODE = {
    hybrid: 'mix',
    semantic: 'local',
    graph: 'global',
    fulltext: 'naive',
    // Also accept LightRAG native modes directly
    mix: 'mix',
    local: 'local',
    global: 'global',
    naive: 'naive',
};
const QuerySchema = z.object({
    query: z.string().min(1),
    project: z.string().optional(),
    mode: z.string().default('hybrid'),
    limit: z.number().optional(),
    projectId: z.string().uuid().optional(),
    includeLinked: z.boolean().default(false),
});
queryRoutes.post('/query', async (c) => {
    const body = await c.req.json();
    const data = QuerySchema.parse(body);
    const lightragMode = FRONTEND_TO_LIGHTRAG_MODE[data.mode] ?? 'mix';
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const client = new LightRAGClient(lightragUrl);
    let enrichedQuery = data.query;
    if (data.projectId) {
        const db = getDb();
        const project = await getProjectById(db, data.projectId);
        if (project) {
            enrichedQuery = `[Project: ${project.name}] ${data.query}`;
            if (data.includeLinked) {
                const links = await listProjectLinks(db, data.projectId);
                if (links.length > 0) {
                    const linkedIds = new Set(links.flatMap((l) => [l.sourceProjectId, l.targetProjectId])
                        .filter((id) => id !== data.projectId));
                    const linkedProjects = await Promise.all([...linkedIds].map((id) => getProjectById(db, id)));
                    const linkedNames = linkedProjects.filter(Boolean).map((p) => p.name);
                    if (linkedNames.length > 0) {
                        enrichedQuery = `[Projects: ${project.name}, ${linkedNames.join(', ')}] ${data.query}`;
                    }
                }
            }
        }
    }
    let response;
    try {
        response = await client.query(enrichedQuery, lightragMode, 90_000);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('timed out') || msg.includes('abort')) {
            return c.json({
                query: data.query,
                mode: data.mode,
                projectId: data.projectId,
                includeLinked: data.includeLinked,
                response: '',
                error: 'Query timed out. Try "Full-text" mode for faster results, or wait for LightRAG pipeline to finish processing.',
                timestamp: new Date().toISOString(),
            }, 504);
        }
        throw err;
    }
    return c.json({
        query: data.query,
        mode: data.mode,
        projectId: data.projectId,
        includeLinked: data.includeLinked,
        response,
        timestamp: new Date().toISOString(),
    });
});
//# sourceMappingURL=query.js.map