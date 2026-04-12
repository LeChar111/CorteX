export declare class PgGraphClient {
    getFullGraph(): Promise<any>;
    getProjectGraph(projectId: string): Promise<{
        nodes: {
            id: unknown;
            label: unknown;
            type: unknown;
            file_type: unknown;
            source_file: unknown;
            source_location: unknown;
            project_id: unknown;
            repo_id: unknown;
            community: unknown;
            properties: {};
        }[];
        edges: {
            source: unknown;
            target: unknown;
            relation: unknown;
            label: unknown;
            confidence: unknown;
            confidence_score: unknown;
            weight: unknown;
            source_file: unknown;
            properties: {};
        }[];
    }>;
    getEntityGraph(entityName: string, depth?: number): Promise<{
        nodes: {
            id: unknown;
            label: unknown;
            type: unknown;
            file_type: unknown;
            source_file: unknown;
            source_location: unknown;
            project_id: unknown;
            repo_id: unknown;
            community: unknown;
            properties: {};
        }[];
        edges: {
            source: unknown;
            target: unknown;
            relation: unknown;
            label: unknown;
            confidence: unknown;
            confidence_score: unknown;
            weight: unknown;
            source_file: unknown;
            properties: {};
        }[];
        entity: string;
        depth: number;
    }>;
    searchEntities(query: string, projectId?: string, limit?: number): Promise<{
        id: unknown;
        label: unknown;
        type: unknown;
        file_type: unknown;
        source_file: unknown;
        source_location: unknown;
        project_id: unknown;
        repo_id: unknown;
        community: unknown;
        properties: {};
    }[]>;
    getCommunities(projectId: string): Promise<{
        id: string;
        projectId: string;
        createdAt: Date;
        communityIndex: string;
        memberCount: string;
        cohesionScore: string | null;
        godNodes: unknown;
        surprisingConnections: unknown;
        metadata: unknown;
    }[]>;
    health(): Promise<boolean>;
}
export declare function getPgGraphClient(): PgGraphClient;
//# sourceMappingURL=pg-graph-client.d.ts.map