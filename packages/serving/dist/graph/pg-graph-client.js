import { sql } from 'drizzle-orm';
import { getDb } from '@cortex/db';
import { getGraphFull, getGraphForProject, getGraphAroundEntity, searchGraphNodes, getCommunitiesForProject, } from '@cortex/db';
import { getRedis } from '../redis.js';
const GRAPH_CACHE_KEY = 'graph:full';
const GRAPH_CACHE_TTL = 30; // seconds
export class PgGraphClient {
    async getFullGraph() {
        // Check Redis cache first
        const redis = getRedis();
        const cached = await redis.get(GRAPH_CACHE_KEY);
        if (cached)
            return JSON.parse(cached);
        const db = getDb();
        const { nodes, edges } = await getGraphFull(db);
        const result = {
            nodes: nodes.map(nodeToApi),
            edges: edges.map(edgeToApi),
        };
        await redis.setex(GRAPH_CACHE_KEY, GRAPH_CACHE_TTL, JSON.stringify(result));
        return result;
    }
    async getProjectGraph(projectId) {
        const db = getDb();
        const { nodes, edges } = await getGraphForProject(db, projectId);
        return { nodes: nodes.map(nodeToApi), edges: edges.map(edgeToApi) };
    }
    async getEntityGraph(entityName, depth = 2) {
        const db = getDb();
        const { nodes, edges } = await getGraphAroundEntity(db, entityName, depth);
        return { nodes: nodes.map(nodeToApi), edges: edges.map(edgeToApi), entity: entityName, depth };
    }
    async searchEntities(query, projectId, limit = 50) {
        const db = getDb();
        const nodes = await searchGraphNodes(db, query, projectId, limit);
        return nodes.map(nodeToApi);
    }
    async getCommunities(projectId) {
        const db = getDb();
        return getCommunitiesForProject(db, projectId);
    }
    async health() {
        try {
            const db = getDb();
            await db.execute(sql `SELECT 1`);
            return true;
        }
        catch {
            return false;
        }
    }
}
// Transform DB node to API response shape
function nodeToApi(node) {
    return {
        id: node.id,
        label: node.label,
        type: node.type,
        file_type: node.fileType ?? node.file_type,
        source_file: node.sourceFile ?? node.source_file,
        source_location: node.sourceLocation ?? node.source_location,
        project_id: node.projectId ?? node.project_id,
        repo_id: node.repoId ?? node.repo_id,
        community: node.communityId ?? node.community_id,
        properties: node.properties ?? {},
    };
}
// Transform DB edge to API response shape
function edgeToApi(edge) {
    return {
        source: edge.sourceNodeId ?? edge.source_node_id,
        target: edge.targetNodeId ?? edge.target_node_id,
        relation: edge.relation,
        label: edge.relation,
        confidence: edge.confidence,
        confidence_score: edge.confidenceScore ?? edge.confidence_score,
        weight: edge.weight,
        source_file: edge.sourceFile ?? edge.source_file,
        properties: edge.properties ?? {},
    };
}
// Singleton
let instance = null;
export function getPgGraphClient() {
    if (!instance)
        instance = new PgGraphClient();
    return instance;
}
//# sourceMappingURL=pg-graph-client.js.map