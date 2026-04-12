import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, listProjectLinks, searchGraphNodes, getGraphAroundEntity } from '@cortex/db';
import { buildCacheKey, getCached, setCache } from '../middleware/cache.js';
export const queryRoutes = new Hono();
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
    const db = getDb();
    const mode = data.mode;
    const limit = data.limit ?? 20;
    // Resolve project scope
    let projectIds = [];
    if (data.projectId) {
        projectIds.push(data.projectId);
        if (data.includeLinked) {
            const links = await listProjectLinks(db, data.projectId);
            const linkedIds = links
                .flatMap((l) => [l.sourceProjectId, l.targetProjectId])
                .filter((id) => id !== data.projectId);
            projectIds.push(...linkedIds);
        }
    }
    // Check cache
    const cacheKey = buildCacheKey(data.query, mode, data.projectId);
    const cached = await getCached(cacheKey);
    if (cached) {
        return c.json({
            query: data.query,
            mode,
            projectId: data.projectId,
            includeLinked: data.includeLinked,
            response: cached,
            cached: true,
            timestamp: new Date().toISOString(),
        });
    }
    try {
        // Search graph nodes matching the query across relevant projects
        const allMatches = [];
        if (projectIds.length > 0) {
            for (const pid of projectIds) {
                const nodes = await searchGraphNodes(db, data.query, pid, limit);
                allMatches.push(...nodes);
            }
        }
        else {
            const nodes = await searchGraphNodes(db, data.query, undefined, limit);
            allMatches.push(...nodes);
        }
        // Get graph context around the top matches (up to 3)
        const topMatches = allMatches.slice(0, 3);
        const contextNodes = [];
        const contextEdges = [];
        for (const match of topMatches) {
            const graph = await getGraphAroundEntity(db, match.label, 1);
            for (const n of graph.nodes) {
                if (!contextNodes.some((cn) => cn.id === n.id)) {
                    contextNodes.push(n);
                }
            }
            contextEdges.push(...graph.edges);
        }
        // Build a summary response
        const matchSummaries = allMatches.map((n) => {
            const props = (n.properties ?? {});
            return `- **${n.label}** (${n.type}): ${String(props.description ?? n.sourceFile ?? '')}`;
        });
        const response = allMatches.length > 0
            ? `Found ${allMatches.length} matching entities:\n\n${matchSummaries.join('\n')}`
            : `No entities found matching "${data.query}".`;
        await setCache(cacheKey, response);
        return c.json({
            query: data.query,
            mode,
            projectId: data.projectId,
            includeLinked: data.includeLinked,
            response,
            cached: false,
            timestamp: new Date().toISOString(),
        });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return c.json({
            query: data.query,
            mode,
            projectId: data.projectId,
            includeLinked: data.includeLinked,
            response: '',
            error: `Query failed: ${msg}`,
            timestamp: new Date().toISOString(),
        }, 500);
    }
});
//# sourceMappingURL=query.js.map