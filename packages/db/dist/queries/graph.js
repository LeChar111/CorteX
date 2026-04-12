import { eq, ilike, sql, inArray, and, or } from 'drizzle-orm';
import { graphNodes, graphEdges, graphCommunities } from '../schema.js';
const BATCH_SIZE = 500;
/** Upsert a single graph node */
export async function upsertGraphNode(db, node) {
    const [row] = await db.insert(graphNodes).values(node).onConflictDoUpdate({
        target: graphNodes.id,
        set: {
            label: sql `EXCLUDED.label`,
            type: sql `EXCLUDED.type`,
            fileType: sql `EXCLUDED.file_type`,
            sourceFile: sql `EXCLUDED.source_file`,
            sourceLocation: sql `EXCLUDED.source_location`,
            communityId: sql `EXCLUDED.community_id`,
            properties: sql `EXCLUDED.properties`,
            updatedAt: sql `now()`,
        },
    }).returning();
    return row;
}
/** Batch upsert nodes (500 at a time) with ON CONFLICT UPDATE */
export async function upsertGraphNodes(db, nodes) {
    for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
        const batch = nodes.slice(i, i + BATCH_SIZE);
        await db.insert(graphNodes).values(batch).onConflictDoUpdate({
            target: graphNodes.id,
            set: {
                label: sql `EXCLUDED.label`,
                type: sql `EXCLUDED.type`,
                fileType: sql `EXCLUDED.file_type`,
                sourceFile: sql `EXCLUDED.source_file`,
                sourceLocation: sql `EXCLUDED.source_location`,
                communityId: sql `EXCLUDED.community_id`,
                properties: sql `EXCLUDED.properties`,
                updatedAt: sql `now()`,
            },
        });
    }
}
/** Batch insert edges (500 at a time) */
export async function insertGraphEdges(db, edges) {
    for (let i = 0; i < edges.length; i += BATCH_SIZE) {
        const batch = edges.slice(i, i + BATCH_SIZE);
        await db.insert(graphEdges).values(batch);
    }
}
/** Upsert communities */
export async function upsertGraphCommunities(db, communities) {
    for (let i = 0; i < communities.length; i += BATCH_SIZE) {
        const batch = communities.slice(i, i + BATCH_SIZE);
        await db.insert(graphCommunities).values(batch).onConflictDoUpdate({
            target: graphCommunities.id,
            set: {
                communityIndex: sql `EXCLUDED.community_index`,
                memberCount: sql `EXCLUDED.member_count`,
                cohesionScore: sql `EXCLUDED.cohesion_score`,
                godNodes: sql `EXCLUDED.god_nodes`,
                surprisingConnections: sql `EXCLUDED.surprising_connections`,
                metadata: sql `EXCLUDED.metadata`,
            },
        });
    }
}
/** Delete all graph data for a repo (edges cascade from nodes) */
export async function deleteGraphDataForRepo(db, repoId) {
    await db.delete(graphNodes).where(eq(graphNodes.repoId, repoId));
}
/** Delete all graph data for a project */
export async function deleteGraphDataForProject(db, projectId) {
    await db.delete(graphEdges).where(eq(graphEdges.projectId, projectId));
    await db.delete(graphNodes).where(eq(graphNodes.projectId, projectId));
    await db.delete(graphCommunities).where(eq(graphCommunities.projectId, projectId));
}
/** Get full graph for a project (nodes + edges where nodes belong to project) */
export async function getGraphForProject(db, projectId) {
    const nodes = await db.select().from(graphNodes).where(eq(graphNodes.projectId, projectId));
    const edges = await db.select().from(graphEdges).where(eq(graphEdges.projectId, projectId));
    return { nodes, edges };
}
/** Get full graph (all nodes + edges) */
export async function getGraphFull(db) {
    const nodes = await db.select().from(graphNodes);
    const edges = await db.select().from(graphEdges);
    return { nodes, edges };
}
/** BFS: get graph around an entity name, up to `depth` hops */
export async function getGraphAroundEntity(db, entityName, depth = 2) {
    // Find seed nodes matching the entity name (case-insensitive)
    const seedNodes = await db.select().from(graphNodes)
        .where(ilike(graphNodes.label, entityName));
    if (seedNodes.length === 0) {
        return { nodes: [], edges: [] };
    }
    const visitedIds = new Set(seedNodes.map((n) => n.id));
    const allEdges = [];
    let frontier = [...visitedIds];
    for (let d = 0; d < depth; d++) {
        if (frontier.length === 0)
            break;
        const edges = await db.select().from(graphEdges).where(or(inArray(graphEdges.sourceNodeId, frontier), inArray(graphEdges.targetNodeId, frontier)));
        const nextFrontier = [];
        for (const edge of edges) {
            allEdges.push(edge);
            for (const nodeId of [edge.sourceNodeId, edge.targetNodeId]) {
                if (!visitedIds.has(nodeId)) {
                    visitedIds.add(nodeId);
                    nextFrontier.push(nodeId);
                }
            }
        }
        frontier = nextFrontier;
    }
    // Fetch all visited nodes
    const nodeIds = [...visitedIds];
    const allNodes = [];
    for (let i = 0; i < nodeIds.length; i += BATCH_SIZE) {
        const batch = nodeIds.slice(i, i + BATCH_SIZE);
        const rows = await db.select().from(graphNodes).where(inArray(graphNodes.id, batch));
        allNodes.push(...rows);
    }
    return { nodes: allNodes, edges: allEdges };
}
/** Search nodes by label (case-insensitive ILIKE) */
export async function searchGraphNodes(db, query, projectId, limit = 50) {
    const conditions = [ilike(graphNodes.label, `%${query}%`)];
    if (projectId) {
        conditions.push(eq(graphNodes.projectId, projectId));
    }
    return db.select().from(graphNodes)
        .where(and(...conditions))
        .limit(limit);
}
/** Get communities for a project */
export async function getCommunitiesForProject(db, projectId) {
    return db.select().from(graphCommunities).where(eq(graphCommunities.projectId, projectId));
}
//# sourceMappingURL=graph.js.map