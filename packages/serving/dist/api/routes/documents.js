import { Hono } from 'hono';
import { LightRAGClient } from '../../lightrag/client.js';
export const documentsRouter = new Hono();
// GET /documents — list LightRAG documents with their status
documentsRouter.get('/documents', async (c) => {
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const client = new LightRAGClient(lightragUrl);
    const [docs, statusCounts] = await Promise.all([
        client.getDocumentContents().catch(() => ({ documents: [] })),
        client.getStatusCounts().catch(() => ({})),
    ]);
    const total = statusCounts.all ?? docs.documents.length;
    return c.json({
        documents: docs.documents,
        statusCounts,
        total,
    });
});
// GET /documents/pipeline — LightRAG pipeline status
documentsRouter.get('/documents/pipeline', async (c) => {
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const client = new LightRAGClient(lightragUrl);
    const graphLabelsFetch = fetch(`${lightragUrl}/graph/label/list`).then(r => r.ok ? r.json() : []).catch(() => []);
    const [pipeline, counts, graphLabels] = await Promise.all([
        client.getPipelineStatus().catch(() => ({ busy: false, job_name: '', docs: 0, batchs: 0, cur_batch: 0, latest_message: '', history_messages: [] })),
        client.getStatusCounts().catch(() => ({})),
        graphLabelsFetch,
    ]);
    return c.json({ ...pipeline, counts: { ...counts, graphLabels: graphLabels.length } });
});
// POST /documents/scan — trigger document scanning
documentsRouter.post('/documents/scan', async (c) => {
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const client = new LightRAGClient(lightragUrl);
    const result = await client.scanDocuments();
    return c.json(result);
});
// POST /documents/cancel — cancel running pipeline
documentsRouter.post('/documents/cancel', async (c) => {
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const client = new LightRAGClient(lightragUrl);
    const result = await client.cancelPipeline();
    return c.json(result);
});
// POST /documents/reprocess-failed — retry all failed documents
documentsRouter.post('/documents/reprocess-failed', async (c) => {
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const client = new LightRAGClient(lightragUrl);
    const result = await client.reprocessFailed();
    return c.json(result);
});
// GET /documents/status — just the status counts
documentsRouter.get('/documents/status', async (c) => {
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const client = new LightRAGClient(lightragUrl);
    const counts = await client.getStatusCounts().catch(() => ({}));
    return c.json(counts);
});
//# sourceMappingURL=documents.js.map