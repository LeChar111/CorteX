export declare class CortexClient {
    private baseUrl;
    private apiKey;
    constructor(baseUrl: string, apiKey: string);
    private request;
    query(query: string, options?: {
        project?: string;
        mode?: string;
        limit?: number;
        projectId?: string;
        includeLinked?: boolean;
    }): Promise<unknown>;
    getGraph(options?: {
        entityName?: string;
        depth?: number;
    }): Promise<unknown>;
    ingest(data: {
        content: string;
        filePath?: string;
        language?: string;
        project?: string;
        projectId?: string;
        type?: string;
        name?: string;
        description?: string;
        source?: string;
        target?: string;
        relationType?: string;
    }): Promise<unknown>;
    createGraphEntity(data: {
        name: string;
        type?: string;
        description?: string;
        projectId?: string;
        projectName?: string;
        filePath?: string;
    }): Promise<unknown>;
    createGraphRelation(data: {
        source: string;
        target: string;
        type: string;
        description?: string;
        weight?: number;
        projectId?: string;
    }): Promise<unknown>;
    entityExists(name: string): Promise<boolean>;
    searchGraphEntities(query: string, limit?: number): Promise<unknown>;
    getCrossProjectGraph(projectId: string, entityName?: string, depth?: number): Promise<unknown>;
    mergeEntities(duplicates: string[], canonical: string): Promise<unknown>;
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
    getContext(projectIdOrName: string, focus?: string): Promise<unknown>;
    getCommunities(projectId: string): Promise<unknown>;
    getGodNodes(projectId: string): Promise<unknown>;
    getSurprisingConnections(projectId: string): Promise<unknown>;
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
    detectCrossProjectLinks(sourceProjectId: string, targetProjectId: string): Promise<unknown>;
    autoLinkProjects(sourceProjectId: string, targetProjectId: string, linkType?: string): Promise<unknown>;
}
//# sourceMappingURL=client.d.ts.map