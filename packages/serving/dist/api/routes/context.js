import { Hono } from 'hono';
import { getDb, getProjectById, getProjectByName, listReposByProject, listProjectLinks, listArchRules, listAnnotationsByProject, listScanJobs, getGraphForProject, searchGraphNodes, } from '@cortex/db';
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
    // Get graph summary from PG
    let graphSummary = {
        entityCount: 0, edgeCount: 0, topTypes: {},
    };
    try {
        const graph = await getGraphForProject(db, project.id);
        const typeCounts = {};
        for (const n of graph.nodes) {
            const t = String(n.type ?? 'unknown');
            typeCounts[t] = (typeCounts[t] ?? 0) + 1;
        }
        graphSummary = {
            entityCount: graph.nodes.length,
            edgeCount: graph.edges.length,
            topTypes: typeCounts,
        };
    }
    catch {
        // Graph may not have data yet
    }
    // Optionally search graph nodes for focused context
    let focusedContext = null;
    if (focus) {
        try {
            const matches = await searchGraphNodes(db, focus, project.id, 10);
            if (matches.length > 0) {
                const lines = matches.map((n) => {
                    const props = (n.properties ?? {});
                    return `- ${n.label} (${n.type}): ${String(props.description ?? n.sourceFile ?? '')}`;
                });
                focusedContext = `Found ${matches.length} entities matching "${focus}":\n${lines.join('\n')}`;
            }
        }
        catch {
            // ignore
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