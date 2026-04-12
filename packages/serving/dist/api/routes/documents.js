import { Hono } from 'hono';
import { getDb, graphNodes, graphEdges, listEvents, listScanJobs } from '@cortex/db';
import { sql } from 'drizzle-orm';
export const documentsRouter = new Hono();
// GET /documents — list graph nodes as "documents" for backward compat
documentsRouter.get('/documents', async (c) => {
    const db = getDb();
    const nodeCount = await db.select({ count: sql `count(*)` }).from(graphNodes);
    const edgeCount = await db.select({ count: sql `count(*)` }).from(graphEdges);
    return c.json({
        documents: [],
        statusCounts: {
            nodes: Number(nodeCount[0]?.count ?? 0),
            edges: Number(edgeCount[0]?.count ?? 0),
        },
        total: Number(nodeCount[0]?.count ?? 0),
        message: 'Documents are now stored as graph nodes in PostgreSQL. Use /graph endpoints for access.',
    });
});
// GET /documents/pipeline — pipeline status with real graph counts + activity log
documentsRouter.get('/documents/pipeline', async (c) => {
    const db = getDb();
    const nodeCount = await db.select({ count: sql `count(*)` }).from(graphNodes);
    const edgeCount = await db.select({ count: sql `count(*)` }).from(graphEdges);
    const nodes = Number(nodeCount[0]?.count ?? 0);
    const edges = Number(edgeCount[0]?.count ?? 0);
    // Build history_messages from real events + scan jobs
    const historyMessages = [];
    // Fetch recent events
    const recentEvents = await listEvents(db, { limit: 20 });
    for (const evt of recentEvents) {
        const ts = new Date(evt.createdAt).toLocaleTimeString();
        const payload = evt.payload;
        if (evt.type === 'scan.completed') {
            const stats = payload ?? {};
            historyMessages.push(`[${ts}] Scan completed — ${stats.nodesImported ?? 0} nodes, ${stats.edgesImported ?? 0} edges imported`);
        }
        else if (evt.type === 'scan.failed') {
            historyMessages.push(`[${ts}] Scan failed — ${payload?.error ?? 'unknown error'}`);
        }
        else {
            historyMessages.push(`[${ts}] ${evt.type}`);
        }
    }
    // Fetch running/queued scan jobs for "busy" status
    const scanJobs = await listScanJobs(db);
    const runningJob = scanJobs.find((j) => j.status === 'running');
    const busy = !!runningJob;
    const jobName = runningJob
        ? `Scanning (phase: ${runningJob.stats?.phase ?? 'unknown'})`
        : '';
    if (runningJob) {
        const stats = runningJob.stats;
        historyMessages.unshift(`[running] Phase: ${stats?.phase ?? 'unknown'} — ${stats?.filesProcessed ?? 0}/${stats?.total ?? '?'} files processed`);
    }
    return c.json({
        busy,
        job_name: jobName,
        docs: nodes,
        batchs: 0,
        cur_batch: 0,
        latest_message: nodes > 0
            ? `Graph contains ${nodes.toLocaleString()} nodes and ${edges.toLocaleString()} edges`
            : 'No graph data yet. Run a scan to populate.',
        history_messages: historyMessages,
        counts: {
            processed: nodes,
            processing: 0,
            pending: 0,
            failed: 0,
            all: nodes,
            graphLabels: nodes,
            graphEdges: edges,
        },
    });
});
// POST /documents/scan — trigger document scanning (no-op, scanning is now via CLI)
documentsRouter.post('/documents/scan', async (c) => {
    return c.json({
        status: 'not_applicable',
        message: 'Document scanning is now handled by the graphify CLI pipeline. Use `cortex scan` instead.',
    });
});
// POST /documents/cancel — cancel running pipeline (no-op)
documentsRouter.post('/documents/cancel', async (c) => {
    return c.json({
        status: 'not_applicable',
        message: 'No active pipeline to cancel. Graph ingestion is now direct to PostgreSQL.',
    });
});
// POST /documents/reprocess-failed — no-op
documentsRouter.post('/documents/reprocess-failed', async (c) => {
    return c.json({
        status: 'not_applicable',
        message: 'Reprocessing is no longer needed. Use `cortex scan --force` to re-scan.',
    });
});
// GET /documents/status — graph storage stats
documentsRouter.get('/documents/status', async (c) => {
    const db = getDb();
    const nodeCount = await db.select({ count: sql `count(*)` }).from(graphNodes);
    const edgeCount = await db.select({ count: sql `count(*)` }).from(graphEdges);
    return c.json({
        nodes: Number(nodeCount[0]?.count ?? 0),
        edges: Number(edgeCount[0]?.count ?? 0),
        storage: 'postgresql',
    });
});
//# sourceMappingURL=documents.js.map