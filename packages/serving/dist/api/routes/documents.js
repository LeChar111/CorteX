import { Hono } from 'hono';
import { getDb, graphNodes, graphEdges } from '@cortex/db';
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
// GET /documents/pipeline — pipeline status with real graph counts
documentsRouter.get('/documents/pipeline', async (c) => {
    const db = getDb();
    const nodeCount = await db.select({ count: sql `count(*)` }).from(graphNodes);
    const edgeCount = await db.select({ count: sql `count(*)` }).from(graphEdges);
    const nodes = Number(nodeCount[0]?.count ?? 0);
    const edges = Number(edgeCount[0]?.count ?? 0);
    return c.json({
        busy: false,
        job_name: '',
        docs: nodes,
        batchs: 0,
        cur_batch: 0,
        latest_message: nodes > 0
            ? `Graph contains ${nodes.toLocaleString()} nodes and ${edges.toLocaleString()} edges`
            : 'No graph data yet. Run a scan to populate.',
        history_messages: [],
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