export declare class LightRAGClient {
    private baseUrl;
    constructor(baseUrl: string);
    health(): Promise<boolean>;
    ingest(text: string, metadata?: Record<string, string>): Promise<void>;
    query(query: string, mode?: 'mix' | 'local' | 'global' | 'naive', timeoutMs?: number): Promise<string>;
    getGraphs(label?: string): Promise<unknown>;
    deleteDocument(id: string): Promise<void>;
    listDocuments(): Promise<unknown[]>;
    getDocumentContents(): Promise<{
        documents: Array<{
            id: string;
            content: string;
            metadata: Record<string, string>;
            status: string;
        }>;
    }>;
    getGraphFull(): Promise<{
        nodes: unknown[];
        edges: unknown[];
    }>;
    getPipelineStatus(): Promise<{
        busy: boolean;
        job_name: string;
        docs: number;
        batchs: number;
        cur_batch: number;
        latest_message: string;
        history_messages: string[];
    }>;
    scanDocuments(): Promise<unknown>;
    cancelPipeline(): Promise<unknown>;
    reprocessFailed(): Promise<{
        reprocessed: number;
    }>;
    getStatusCounts(): Promise<Record<string, number>>;
}
//# sourceMappingURL=client.d.ts.map