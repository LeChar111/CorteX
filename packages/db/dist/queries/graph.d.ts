import type { Database } from '../connection.js';
import { graphNodes, graphEdges, graphCommunities } from '../schema.js';
export type GraphNode = typeof graphNodes.$inferSelect;
export type NewGraphNode = typeof graphNodes.$inferInsert;
export type GraphEdge = typeof graphEdges.$inferSelect;
export type NewGraphEdge = typeof graphEdges.$inferInsert;
export type GraphCommunity = typeof graphCommunities.$inferSelect;
export type NewGraphCommunity = typeof graphCommunities.$inferInsert;
/** Upsert a single graph node */
export declare function upsertGraphNode(db: Database, node: NewGraphNode): Promise<GraphNode>;
/** Batch upsert nodes (500 at a time) with ON CONFLICT UPDATE */
export declare function upsertGraphNodes(db: Database, nodes: NewGraphNode[]): Promise<void>;
/** Batch insert edges (500 at a time) */
export declare function insertGraphEdges(db: Database, edges: NewGraphEdge[]): Promise<void>;
/** Upsert communities */
export declare function upsertGraphCommunities(db: Database, communities: NewGraphCommunity[]): Promise<void>;
/** Delete all graph data for a repo (edges cascade from nodes) */
export declare function deleteGraphDataForRepo(db: Database, repoId: string): Promise<void>;
/** Delete all graph data for a project */
export declare function deleteGraphDataForProject(db: Database, projectId: string): Promise<void>;
/** Get full graph for a project (nodes + edges where nodes belong to project) */
export declare function getGraphForProject(db: Database, projectId: string): Promise<{
    nodes: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string | null;
        repoId: string | null;
        type: string;
        label: string;
        fileType: string | null;
        sourceFile: string | null;
        sourceLocation: string | null;
        communityId: string | null;
        properties: unknown;
    }[];
    edges: {
        id: string;
        projectId: string | null;
        sourceFile: string | null;
        properties: unknown;
        sourceNodeId: string;
        targetNodeId: string;
        relation: string;
        confidence: string | null;
        confidenceScore: string | null;
        weight: string | null;
    }[];
}>;
/** Get full graph (all nodes + edges) */
export declare function getGraphFull(db: Database): Promise<{
    nodes: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string | null;
        repoId: string | null;
        type: string;
        label: string;
        fileType: string | null;
        sourceFile: string | null;
        sourceLocation: string | null;
        communityId: string | null;
        properties: unknown;
    }[];
    edges: {
        id: string;
        projectId: string | null;
        sourceFile: string | null;
        properties: unknown;
        sourceNodeId: string;
        targetNodeId: string;
        relation: string;
        confidence: string | null;
        confidenceScore: string | null;
        weight: string | null;
    }[];
}>;
/** BFS: get graph around an entity name, up to `depth` hops */
export declare function getGraphAroundEntity(db: Database, entityName: string, depth?: number): Promise<{
    nodes: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string | null;
        repoId: string | null;
        type: string;
        label: string;
        fileType: string | null;
        sourceFile: string | null;
        sourceLocation: string | null;
        communityId: string | null;
        properties: unknown;
    }[];
    edges: {
        id: string;
        projectId: string | null;
        sourceFile: string | null;
        properties: unknown;
        sourceNodeId: string;
        targetNodeId: string;
        relation: string;
        confidence: string | null;
        confidenceScore: string | null;
        weight: string | null;
    }[];
}>;
/** Search nodes by label (case-insensitive ILIKE) */
export declare function searchGraphNodes(db: Database, query: string, projectId?: string, limit?: number): Promise<GraphNode[]>;
/** Get communities for a project */
export declare function getCommunitiesForProject(db: Database, projectId: string): Promise<GraphCommunity[]>;
//# sourceMappingURL=graph.d.ts.map