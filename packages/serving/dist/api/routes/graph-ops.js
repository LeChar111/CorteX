import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, getProjectById, listProjectLinks, graphNodes, graphEdges, upsertGraphNode, searchGraphNodes, getCommunitiesForProject, } from '@cortex/db';
import { eq, and } from 'drizzle-orm';
import { getPgGraphClient } from '../../graph/pg-graph-client.js';
export const graphOpsRoutes = new Hono();
/** Generate a node ID from a name: lowercase, spaces to underscores */
function nameToId(name) {
    return name.toLowerCase().replace(/\s+/g, '_');
}
// ── POST /graph/entity — create entity directly ──
const EntitySchema = z.object({
    name: z.string().min(1),
    type: z.string().default('ENTITY'),
    description: z.string().optional(),
    projectId: z.string().uuid().optional(),
    projectName: z.string().optional(),
    filePath: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
});
graphOpsRoutes.post('/graph/entity', async (c) => {
    const data = EntitySchema.parse(await c.req.json());
    const db = getDb();
    try {
        await upsertGraphNode(db, {
            id: nameToId(data.name),
            label: data.name,
            type: data.type.toUpperCase(),
            sourceFile: data.filePath ?? null,
            projectId: data.projectId ?? null,
            properties: {
                description: data.description ?? data.name,
                projectName: data.projectName,
                ...(data.metadata ?? {}),
            },
        });
        return c.json({ status: 'created', entity: data.name }, 201);
    }
    catch {
        return c.json({ error: 'Failed to create entity' }, 500);
    }
});
// ── POST /graph/relation — create relation directly ──
const RelationSchema = z.object({
    source: z.string().min(1),
    target: z.string().min(1),
    type: z.string().min(1),
    description: z.string().optional(),
    weight: z.number().min(0).max(1).default(1),
    projectId: z.string().uuid().optional(),
});
graphOpsRoutes.post('/graph/relation', async (c) => {
    const data = RelationSchema.parse(await c.req.json());
    const db = getDb();
    try {
        await db.insert(graphEdges).values({
            sourceNodeId: nameToId(data.source),
            targetNodeId: nameToId(data.target),
            relation: data.type,
            weight: String(data.weight),
            projectId: data.projectId ?? null,
            properties: {
                description: data.description ?? `${data.source} ${data.type} ${data.target}`,
            },
        });
        return c.json({ status: 'created', source: data.source, target: data.target, type: data.type }, 201);
    }
    catch {
        return c.json({ error: 'Failed to create relation. Ensure both entities exist.' }, 400);
    }
});
// ── GET /graph/entity/exists — check if entity exists ──
graphOpsRoutes.get('/graph/entity/exists', async (c) => {
    const name = c.req.query('name');
    if (!name)
        return c.json({ error: 'name required' }, 400);
    const db = getDb();
    const results = await searchGraphNodes(db, name, undefined, 1);
    const exists = results.some((n) => n.label.toLowerCase() === name.toLowerCase());
    return c.json({ name, exists });
});
// ── GET /graph/search — search entities by name ──
graphOpsRoutes.get('/graph/search', async (c) => {
    const q = c.req.query('q');
    if (!q)
        return c.json({ error: 'q required' }, 400);
    const limit = parseInt(c.req.query('limit') ?? '50', 10);
    const projectId = c.req.query('projectId') ?? undefined;
    const client = getPgGraphClient();
    const results = await client.searchEntities(q, projectId, limit);
    return c.json({ query: q, results });
});
// ── POST /graph/merge — merge duplicate entities ──
const MergeSchema = z.object({
    duplicates: z.array(z.string()).min(1),
    canonical: z.string().min(1),
});
graphOpsRoutes.post('/graph/merge', async (c) => {
    const data = MergeSchema.parse(await c.req.json());
    const db = getDb();
    const canonicalId = nameToId(data.canonical);
    try {
        for (const dup of data.duplicates) {
            const dupId = nameToId(dup);
            if (dupId === canonicalId)
                continue;
            // Re-point edges from duplicate to canonical
            await db.update(graphEdges)
                .set({ sourceNodeId: canonicalId })
                .where(eq(graphEdges.sourceNodeId, dupId));
            await db.update(graphEdges)
                .set({ targetNodeId: canonicalId })
                .where(eq(graphEdges.targetNodeId, dupId));
            // Delete the duplicate node
            await db.delete(graphNodes).where(eq(graphNodes.id, dupId));
        }
        return c.json({ status: 'merged', into: data.canonical, merged: data.duplicates });
    }
    catch {
        return c.json({ error: 'Merge failed' }, 500);
    }
});
// ── DELETE /graph/entity — delete entity ──
graphOpsRoutes.delete('/graph/entity', async (c) => {
    const name = c.req.query('name');
    if (!name)
        return c.json({ error: 'name required' }, 400);
    const db = getDb();
    try {
        // Edges cascade on delete thanks to FK
        await db.delete(graphNodes).where(eq(graphNodes.id, nameToId(name)));
        return c.json({ status: 'deleted', entity: name });
    }
    catch {
        return c.json({ error: 'Delete failed' }, 500);
    }
});
// ── DELETE /graph/relation — delete relation ──
graphOpsRoutes.delete('/graph/relation', async (c) => {
    const source = c.req.query('source');
    const target = c.req.query('target');
    if (!source || !target)
        return c.json({ error: 'source and target required' }, 400);
    const db = getDb();
    try {
        await db.delete(graphEdges).where(and(eq(graphEdges.sourceNodeId, nameToId(source)), eq(graphEdges.targetNodeId, nameToId(target))));
        return c.json({ status: 'deleted', source, target });
    }
    catch {
        return c.json({ error: 'Delete failed' }, 500);
    }
});
// ── GET /graph/communities — get communities for a project ──
graphOpsRoutes.get('/graph/communities', async (c) => {
    const projectId = c.req.query('projectId');
    if (!projectId)
        return c.json({ error: 'projectId required' }, 400);
    const db = getDb();
    const communities = await getCommunitiesForProject(db, projectId);
    return c.json({ projectId, communities });
});
// ── GET /graph/cross-project — cross-project graph traversal ──
graphOpsRoutes.get('/graph/cross-project', async (c) => {
    const projectId = c.req.query('projectId');
    const entityName = c.req.query('entity');
    const depth = parseInt(c.req.query('depth') ?? '2', 10);
    if (!projectId)
        return c.json({ error: 'projectId required' }, 400);
    const db = getDb();
    const project = await getProjectById(db, projectId);
    if (!project)
        return c.json({ error: 'Project not found' }, 404);
    const client = getPgGraphClient();
    // Get linked projects
    const links = await listProjectLinks(db, projectId);
    const linkedProjectIds = new Set(links.flatMap((l) => [l.sourceProjectId, l.targetProjectId])
        .filter((id) => id !== projectId));
    const allProjectIds = [projectId, ...linkedProjectIds];
    // Collect nodes and edges from all projects
    const allNodes = [];
    const allEdges = [];
    for (const pid of allProjectIds) {
        const graph = await client.getProjectGraph(pid);
        for (const n of graph.nodes) {
            allNodes.push({ ...n, _project: pid, _isCrossProject: pid !== projectId });
        }
        allEdges.push(...graph.edges);
    }
    // If entity filter, do BFS within the combined graph
    if (entityName) {
        const nameLower = entityName.toLowerCase();
        const seedIds = new Set();
        for (const n of allNodes) {
            const label = String(n.label ?? n.id ?? '').toLowerCase();
            if (label.includes(nameLower))
                seedIds.add(String(n.id));
        }
        if (seedIds.size === 0) {
            return c.json({ nodes: [], edges: [], entity: entityName, projects: allProjectIds.length });
        }
        const visited = new Set(seedIds);
        let frontier = new Set(seedIds);
        for (let d = 0; d < depth && frontier.size > 0; d++) {
            const next = new Set();
            for (const edge of allEdges) {
                const src = String(edge.source ?? '');
                const tgt = String(edge.target ?? '');
                if (frontier.has(src) && !visited.has(tgt)) {
                    next.add(tgt);
                    visited.add(tgt);
                }
                if (frontier.has(tgt) && !visited.has(src)) {
                    next.add(src);
                    visited.add(src);
                }
            }
            frontier = next;
        }
        const filteredNodes = allNodes.filter((n) => visited.has(String(n.id)));
        const filteredEdges = allEdges.filter((e) => visited.has(String(e.source ?? '')) && visited.has(String(e.target ?? '')));
        const taggedNodes = filteredNodes;
        return c.json({
            nodes: taggedNodes,
            edges: filteredEdges,
            entity: entityName,
            depth,
            projectCount: allProjectIds.length,
            crossProjectEdges: filteredEdges.filter((e) => {
                const srcProject = taggedNodes.find((n) => String(n.id) === String(e.source))?._project;
                const tgtProject = taggedNodes.find((n) => String(n.id) === String(e.target))?._project;
                return srcProject !== tgtProject;
            }).length,
        });
    }
    // No entity filter: return full multi-project subgraph
    const nodeIds = new Set(allNodes.map((n) => String(n.id)));
    const multiProjectEdges = allEdges.filter((e) => nodeIds.has(String(e.source ?? '')) || nodeIds.has(String(e.target ?? '')));
    return c.json({
        nodes: allNodes,
        edges: multiProjectEdges,
        projectCount: allProjectIds.length,
    });
});
//# sourceMappingURL=graph-ops.js.map