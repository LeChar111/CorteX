export class LightRAGClient {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async health() {
        try {
            const res = await fetch(`${this.baseUrl}/health`, {
                signal: AbortSignal.timeout(3000),
            });
            return res.ok;
        }
        catch {
            return false;
        }
    }
    async ingest(text, metadata) {
        const res = await fetch(`${this.baseUrl}/documents/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, metadata }),
        });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`LightRAG ingest failed (${res.status}): ${body}`);
        }
    }
    async query(query, mode = 'mix', timeoutMs = 60_000) {
        const res = await fetch(`${this.baseUrl}/query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, mode }),
            signal: AbortSignal.timeout(timeoutMs),
        });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`LightRAG query failed (${res.status}): ${body}`);
        }
        const data = (await res.json());
        return data.response;
    }
    async getGraphs(label) {
        const params = new URLSearchParams();
        params.set('label', label || '*');
        const res = await fetch(`${this.baseUrl}/graphs?${params}`);
        if (!res.ok)
            throw new Error(`LightRAG graphs failed (${res.status})`);
        return res.json();
    }
    async deleteDocument(id) {
        const res = await fetch(`${this.baseUrl}/documents/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`LightRAG delete failed (${res.status}): ${body}`);
        }
    }
    async listDocuments() {
        const res = await fetch(`${this.baseUrl}/documents`);
        if (!res.ok)
            throw new Error(`LightRAG list documents failed (${res.status})`);
        return (await res.json());
    }
    async getDocumentContents() {
        const res = await fetch(`${this.baseUrl}/documents`);
        if (!res.ok)
            throw new Error(`LightRAG list documents failed (${res.status})`);
        const data = (await res.json());
        // LightRAG returns { statuses: { pending: [...], processed: [...], ... } }
        if (data.statuses && typeof data.statuses === 'object') {
            const allDocs = [];
            for (const [status, docs] of Object.entries(data.statuses)) {
                if (Array.isArray(docs)) {
                    for (const doc of docs) {
                        allDocs.push({ ...doc, status });
                    }
                }
            }
            return { documents: allDocs };
        }
        return { documents: Array.isArray(data) ? data : data.documents ?? [] };
    }
    async getGraphFull() {
        const res = await fetch(`${this.baseUrl}/graphs?label=*`);
        if (!res.ok)
            throw new Error(`LightRAG graphs failed (${res.status})`);
        const data = (await res.json());
        return { nodes: data.nodes ?? [], edges: data.edges ?? data.links ?? [] };
    }
    async getPipelineStatus() {
        const res = await fetch(`${this.baseUrl}/documents/pipeline_status`);
        if (!res.ok)
            return { busy: false, job_name: '', docs: 0, batchs: 0, cur_batch: 0, latest_message: '', history_messages: [] };
        return (await res.json());
    }
    async scanDocuments() {
        const res = await fetch(`${this.baseUrl}/documents/scan`, { method: 'POST' });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`LightRAG scan failed (${res.status}): ${body}`);
        }
        return res.json();
    }
    async cancelPipeline() {
        const res = await fetch(`${this.baseUrl}/documents/cancel_pipeline`, { method: 'POST' });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`LightRAG cancel failed (${res.status}): ${body}`);
        }
        return res.json();
    }
    async reprocessFailed() {
        const res = await fetch(`${this.baseUrl}/documents/reprocess_failed`, { method: 'POST' });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`LightRAG reprocess failed (${res.status}): ${body}`);
        }
        return (await res.json());
    }
    async getStatusCounts() {
        const res = await fetch(`${this.baseUrl}/documents/status_counts`);
        if (!res.ok)
            return {};
        const data = (await res.json());
        return data.status_counts ?? {};
    }
}
//# sourceMappingURL=client.js.map