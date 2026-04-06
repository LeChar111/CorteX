export class LightRAGClient {
  constructor(private baseUrl: string) {}

  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async ingest(text: string, metadata?: Record<string, string>): Promise<void> {
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

  async query(query: string, mode: 'mix' | 'local' | 'global' | 'naive' = 'mix', timeoutMs = 60_000): Promise<string> {
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
    const data = (await res.json()) as { response: string };
    return data.response;
  }

  async getGraphs(label?: string): Promise<unknown> {
    const params = new URLSearchParams();
    params.set('label', label || '*');
    const res = await fetch(`${this.baseUrl}/graphs?${params}`);
    if (!res.ok) throw new Error(`LightRAG graphs failed (${res.status})`);
    return res.json();
  }

  async deleteDocument(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/documents/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`LightRAG delete failed (${res.status}): ${body}`);
    }
  }

  async listDocuments(): Promise<unknown[]> {
    const res = await fetch(`${this.baseUrl}/documents`);
    if (!res.ok) throw new Error(`LightRAG list documents failed (${res.status})`);
    return (await res.json()) as unknown[];
  }

  async getDocumentContents(): Promise<{ documents: Array<{ id: string; content: string; metadata: Record<string, string>; status: string }> }> {
    const res = await fetch(`${this.baseUrl}/documents`);
    if (!res.ok) throw new Error(`LightRAG list documents failed (${res.status})`);
    const data = (await res.json()) as Record<string, unknown>;
    // LightRAG returns { statuses: { pending: [...], processed: [...], ... } }
    if (data.statuses && typeof data.statuses === 'object') {
      const allDocs: Array<{ id: string; content: string; metadata: Record<string, string>; status: string }> = [];
      for (const [status, docs] of Object.entries(data.statuses as Record<string, unknown>)) {
        if (Array.isArray(docs)) {
          for (const doc of docs) {
            allDocs.push({ ...doc, status });
          }
        }
      }
      return { documents: allDocs };
    }
    return { documents: Array.isArray(data) ? data : (data.documents as Array<{ id: string; content: string; metadata: Record<string, string>; status: string }>) ?? [] };
  }

  async getGraphFull(): Promise<{ nodes: unknown[]; edges: unknown[] }> {
    const res = await fetch(`${this.baseUrl}/graphs?label=*`);
    if (!res.ok) throw new Error(`LightRAG graphs failed (${res.status})`);
    const data = (await res.json()) as Record<string, unknown[]>;
    return { nodes: data.nodes ?? [], edges: data.edges ?? data.links ?? [] };
  }

  async getPipelineStatus(): Promise<{
    busy: boolean;
    job_name: string;
    docs: number;
    batchs: number;
    cur_batch: number;
    latest_message: string;
    history_messages: string[];
  }> {
    const res = await fetch(`${this.baseUrl}/documents/pipeline_status`);
    if (!res.ok) return { busy: false, job_name: '', docs: 0, batchs: 0, cur_batch: 0, latest_message: '', history_messages: [] };
    return (await res.json()) as { busy: boolean; job_name: string; docs: number; batchs: number; cur_batch: number; latest_message: string; history_messages: string[] };
  }

  async scanDocuments(): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}/documents/scan`, { method: 'POST' });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`LightRAG scan failed (${res.status}): ${body}`);
    }
    return res.json();
  }

  async cancelPipeline(): Promise<unknown> {
    const res = await fetch(`${this.baseUrl}/documents/cancel_pipeline`, { method: 'POST' });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`LightRAG cancel failed (${res.status}): ${body}`);
    }
    return res.json();
  }

  async reprocessFailed(): Promise<{ reprocessed: number }> {
    const res = await fetch(`${this.baseUrl}/documents/reprocess_failed`, { method: 'POST' });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`LightRAG reprocess failed (${res.status}): ${body}`);
    }
    return (await res.json()) as { reprocessed: number };
  }

  async getStatusCounts(): Promise<Record<string, number>> {
    const res = await fetch(`${this.baseUrl}/documents/status_counts`);
    if (!res.ok) return {};
    const data = (await res.json()) as { status_counts?: Record<string, number> };
    return data.status_counts ?? {};
  }
}
