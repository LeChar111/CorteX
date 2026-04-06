export declare class CortexClient {
    private baseUrl;
    private apiKey;
    constructor(baseUrl: string, apiKey: string);
    private request;
    query(query: string, options?: {
        project?: string;
        mode?: string;
    }): Promise<unknown>;
    getGraph(): Promise<unknown>;
    ingest(data: {
        content: string;
        filePath?: string;
        language?: string;
        project?: string;
        type?: string;
        name?: string;
        description?: string;
        source?: string;
        target?: string;
        relationType?: string;
    }): Promise<unknown>;
    listProjects(): Promise<unknown[]>;
    getRepos(projectId: string): Promise<unknown[]>;
    triggerScan(data: {
        projectId: string;
        repoId: string;
        branch?: string;
        mode?: string;
    }): Promise<unknown>;
    getScanStatus(projectId?: string): Promise<unknown>;
    getEvents(options?: {
        projectId?: string;
        type?: string;
        limit?: number;
    }): Promise<unknown[]>;
    health(): Promise<unknown>;
    impactAnalysis(data: {
        filePath: string;
        projectId?: string;
    }): Promise<unknown>;
    listAnnotations(entityName: string): Promise<unknown[]>;
    addAnnotation(data: {
        entityName: string;
        type?: string;
        content?: string;
        projectId?: string;
    }): Promise<unknown>;
    exportKb(): Promise<unknown>;
}
//# sourceMappingURL=client.d.ts.map