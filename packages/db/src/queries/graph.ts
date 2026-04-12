import { eq, ilike, sql, inArray, and, or } from 'drizzle-orm';
import type { Database } from '../connection.js';
import { graphNodes, graphEdges, graphCommunities } from '../schema.js';

// Types
export type GraphNode = typeof graphNodes.$inferSelect;
export type NewGraphNode = typeof graphNodes.$inferInsert;
export type GraphEdge = typeof graphEdges.$inferSelect;
export type NewGraphEdge = typeof graphEdges.$inferInsert;
export type GraphCommunity = typeof graphCommunities.$inferSelect;
export type NewGraphCommunity = typeof graphCommunities.$inferInsert;

const BATCH_SIZE = 500;

/** Upsert a single graph node */
export async function upsertGraphNode(db: Database, node: NewGraphNode): Promise<GraphNode> {
  const [row] = await db.insert(graphNodes).values(node).onConflictDoUpdate({
    target: graphNodes.id,
    set: {
      label: sql`EXCLUDED.label`,
      type: sql`EXCLUDED.type`,
      fileType: sql`EXCLUDED.file_type`,
      sourceFile: sql`EXCLUDED.source_file`,
      sourceLocation: sql`EXCLUDED.source_location`,
      communityId: sql`EXCLUDED.community_id`,
      properties: sql`EXCLUDED.properties`,
      updatedAt: sql`now()`,
    },
  }).returning();
  return row!;
}

/** Batch upsert nodes (500 at a time) with ON CONFLICT UPDATE */
export async function upsertGraphNodes(db: Database, nodes: NewGraphNode[]): Promise<void> {
  for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
    const batch = nodes.slice(i, i + BATCH_SIZE);
    await db.insert(graphNodes).values(batch).onConflictDoUpdate({
      target: graphNodes.id,
      set: {
        label: sql`EXCLUDED.label`,
        type: sql`EXCLUDED.type`,
        fileType: sql`EXCLUDED.file_type`,
        sourceFile: sql`EXCLUDED.source_file`,
        sourceLocation: sql`EXCLUDED.source_location`,
        communityId: sql`EXCLUDED.community_id`,
        properties: sql`EXCLUDED.properties`,
        updatedAt: sql`now()`,
      },
    });
  }
}

/** Batch insert edges (500 at a time) */
export async function insertGraphEdges(db: Database, edges: NewGraphEdge[]): Promise<void> {
  for (let i = 0; i < edges.length; i += BATCH_SIZE) {
    const batch = edges.slice(i, i + BATCH_SIZE);
    await db.insert(graphEdges).values(batch);
  }
}

/** Upsert communities */
export async function upsertGraphCommunities(db: Database, communities: NewGraphCommunity[]): Promise<void> {
  for (let i = 0; i < communities.length; i += BATCH_SIZE) {
    const batch = communities.slice(i, i + BATCH_SIZE);
    await db.insert(graphCommunities).values(batch).onConflictDoUpdate({
      target: graphCommunities.id,
      set: {
        communityIndex: sql`EXCLUDED.community_index`,
        memberCount: sql`EXCLUDED.member_count`,
        cohesionScore: sql`EXCLUDED.cohesion_score`,
        godNodes: sql`EXCLUDED.god_nodes`,
        surprisingConnections: sql`EXCLUDED.surprising_connections`,
        metadata: sql`EXCLUDED.metadata`,
      },
    });
  }
}

/** Delete all graph data for a repo (edges cascade from nodes) */
export async function deleteGraphDataForRepo(db: Database, repoId: string): Promise<void> {
  await db.delete(graphNodes).where(eq(graphNodes.repoId, repoId));
}

/** Delete all graph data for a project */
export async function deleteGraphDataForProject(db: Database, projectId: string): Promise<void> {
  await db.delete(graphEdges).where(eq(graphEdges.projectId, projectId));
  await db.delete(graphNodes).where(eq(graphNodes.projectId, projectId));
  await db.delete(graphCommunities).where(eq(graphCommunities.projectId, projectId));
}

/** Get full graph for a project (nodes + edges where nodes belong to project) */
export async function getGraphForProject(db: Database, projectId: string) {
  const nodes = await db.select().from(graphNodes).where(eq(graphNodes.projectId, projectId));
  const edges = await db.select().from(graphEdges).where(eq(graphEdges.projectId, projectId));
  return { nodes, edges };
}

/** Get full graph (all nodes + edges) */
export async function getGraphFull(db: Database) {
  const nodes = await db.select().from(graphNodes);
  const edges = await db.select().from(graphEdges);
  return { nodes, edges };
}

/** BFS: get graph around an entity name, up to `depth` hops */
export async function getGraphAroundEntity(db: Database, entityName: string, depth: number = 2) {
  // Find seed nodes matching the entity name (case-insensitive)
  const seedNodes = await db.select().from(graphNodes)
    .where(ilike(graphNodes.label, entityName));

  if (seedNodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  const visitedIds = new Set<string>(seedNodes.map((n) => n.id));
  const allEdges: GraphEdge[] = [];

  let frontier = [...visitedIds];

  for (let d = 0; d < depth; d++) {
    if (frontier.length === 0) break;

    const edges = await db.select().from(graphEdges).where(
      or(
        inArray(graphEdges.sourceNodeId, frontier),
        inArray(graphEdges.targetNodeId, frontier),
      ),
    );

    const nextFrontier: string[] = [];
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
  const allNodes: GraphNode[] = [];
  for (let i = 0; i < nodeIds.length; i += BATCH_SIZE) {
    const batch = nodeIds.slice(i, i + BATCH_SIZE);
    const rows = await db.select().from(graphNodes).where(inArray(graphNodes.id, batch));
    allNodes.push(...rows);
  }

  return { nodes: allNodes, edges: allEdges };
}

/** Search nodes by label (case-insensitive ILIKE) */
export async function searchGraphNodes(db: Database, query: string, projectId?: string, limit: number = 50): Promise<GraphNode[]> {
  const conditions = [ilike(graphNodes.label, `%${query}%`)];
  if (projectId) {
    conditions.push(eq(graphNodes.projectId, projectId));
  }
  return db.select().from(graphNodes)
    .where(and(...conditions))
    .limit(limit);
}

/** Get communities for a project */
export async function getCommunitiesForProject(db: Database, projectId: string): Promise<GraphCommunity[]> {
  return db.select().from(graphCommunities).where(eq(graphCommunities.projectId, projectId));
}
