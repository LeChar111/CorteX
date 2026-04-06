import { Hono } from 'hono';
import { getDb, getProjectById, listScanJobs } from '@cortex/db';
export const changelogRoutes = new Hono();
changelogRoutes.get('/changelog', async (c) => {
    const projectId = c.req.query('projectId');
    const since = c.req.query('since');
    if (!projectId)
        return c.json({ error: 'projectId required' }, 400);
    const db = getDb();
    const project = await getProjectById(db, projectId);
    if (!project)
        return c.json({ error: 'Project not found' }, 404);
    // Get scan jobs since date
    const allJobs = await listScanJobs(db, projectId);
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentJobs = allJobs.filter((j) => j.status === 'completed' && new Date(j.createdAt) >= sinceDate);
    // Build changelog entries from scan stats (no LLM — instant)
    const totalFiles = recentJobs.reduce((sum, j) => sum + (j.stats?.filesProcessed ?? 0), 0);
    const totalEntities = recentJobs.reduce((sum, j) => sum + (j.stats?.entitiesExtracted ?? 0), 0);
    const entries = recentJobs.map((job) => {
        const stats = job.stats;
        return {
            date: job.createdAt,
            type: 'scan',
            description: `Scanned ${stats?.filesProcessed ?? 0} files, extracted ${stats?.entitiesExtracted ?? 0} entities, ingested ${stats?.documentsIngested ?? 0} documents`,
            stats: stats ?? {},
        };
    });
    const analysis = recentJobs.length > 0
        ? `${recentJobs.length} scans completed since ${sinceDate.toISOString().slice(0, 10)}: ${totalFiles} files processed, ${totalEntities} entities extracted.`
        : 'No scans completed in this period.';
    return c.json({
        projectId,
        projectName: project.name,
        since: sinceDate.toISOString(),
        entries,
        analysis,
        scanCount: recentJobs.length,
    });
});
//# sourceMappingURL=changelog.js.map