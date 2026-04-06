import { Hono } from 'hono';
import { getDb, getProjectById, getProjectByName, listReposByProject, listProjectLinks, listArchRules, listAnnotationsByProject, listScanJobs, } from '@cortex/db';
import { LightRAGClient } from '../../lightrag/client.js';
export const contextRoutes = new Hono();
contextRoutes.get('/context/:projectId', async (c) => {
    const projectId = c.req.param('projectId');
    const focus = c.req.query('focus');
    const db = getDb();
    // Try UUID first, then name
    let project = await getProjectById(db, projectId).catch(() => null);
    if (!project) {
        project = await getProjectByName(db, projectId).catch(() => null);
    }
    if (!project)
        return c.json({ error: 'Project not found' }, 404);
    // Fetch all structured data in parallel
    const [repos, links, archRules, annotations, allScans] = await Promise.all([
        listReposByProject(db, project.id),
        listProjectLinks(db, project.id),
        listArchRules(db, project.id),
        listAnnotationsByProject(db, project.id),
        listScanJobs(db, project.id),
    ]);
    const recentScans = allScans.slice(0, 5);
    // Get graph summary (entity types + counts) from LightRAG
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const lightrag = new LightRAGClient(lightragUrl);
    let graphSummary = {
        entityCount: 0, edgeCount: 0, topTypes: {},
    };
    try {
        const graph = await lightrag.getGraphFull();
        const nodes = graph.nodes;
        const edges = graph.edges;
        // Filter nodes to this project using repo keywords
        const keywords = repos.flatMap(r => [r.name.toLowerCase(), r.slug.toLowerCase()]);
        const projectNodes = keywords.length > 0
            ? nodes.filter(n => {
                const text = `${String(n.properties?.description ?? '')} ${String(n.properties?.source_id ?? '')}`.toLowerCase();
                return keywords.some(kw => text.includes(kw));
            })
            : nodes;
        const typeCounts = {};
        for (const n of projectNodes) {
            const t = String(n.properties?.entity_type ?? 'unknown');
            typeCounts[t] = (typeCounts[t] ?? 0) + 1;
        }
        graphSummary = {
            entityCount: projectNodes.length,
            edgeCount: edges.length,
            topTypes: typeCounts,
        };
    }
    catch {
        // LightRAG may not be available
    }
    // Optionally enrich with focused semantic query
    let focusedContext = null;
    if (focus) {
        try {
            const response = await lightrag.query(`[Project: ${project.name}] ${focus}`, 'local', 30_000);
            focusedContext = response;
        }
        catch {
            // ignore timeout
        }
    }
    // Build linked projects info
    const linkedProjects = [];
    for (const link of links) {
        const otherId = link.sourceProjectId === project.id ? link.targetProjectId : link.sourceProjectId;
        const direction = link.sourceProjectId === project.id ? 'outgoing' : 'incoming';
        const other = await getProjectById(db, otherId).catch(() => null);
        if (other) {
            linkedProjects.push({ name: other.name, linkType: link.linkType, direction });
        }
    }
    return c.json({
        project: { id: project.id, name: project.name, description: project.description },
        repos: repos.map(r => ({
            name: r.name,
            provider: r.provider,
            techStack: r.techStack,
            defaultBranch: r.defaultBranch,
            lastScannedAt: r.lastScannedAt,
        })),
        graphSummary,
        linkedProjects,
        archRules: archRules.map(r => ({ name: r.name, severity: r.severity, description: r.description })),
        annotations: annotations.slice(0, 20).map(a => ({ entity: a.entityName, type: a.type, content: a.content })),
        recentScans: recentScans.map(s => ({ status: s.status, mode: s.mode, completedAt: s.completedAt })),
        ...(focusedContext ? { focusedContext } : {}),
    });
});
//# sourceMappingURL=context.js.map