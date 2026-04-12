import { pgTable, uuid, varchar, text, jsonb, timestamp, uniqueIndex, index, } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
// ─── projects ───────────────────────────────────────────────────────────────
export const projects = pgTable('projects', {
    id: uuid('id')
        .primaryKey()
        .default(sql `gen_random_uuid()`),
    name: varchar('name', { length: 255 }).notNull().unique(),
    description: text('description'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});
// ─── repos ──────────────────────────────────────────────────────────────────
export const repos = pgTable('repos', {
    id: uuid('id')
        .primaryKey()
        .default(sql `gen_random_uuid()`),
    projectId: uuid('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    cloneUrl: text('clone_url').notNull(),
    provider: varchar('provider', { length: 64 }).notNull(),
    techStack: jsonb('tech_stack'),
    defaultBranch: varchar('default_branch', { length: 255 })
        .notNull()
        .default('main'),
    trackedBranches: jsonb('tracked_branches'),
    lastScannedAt: timestamp('last_scanned_at', { withTimezone: true }),
    lastScannedCommit: varchar('last_scanned_commit', { length: 40 }),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [uniqueIndex('repos_project_id_slug_idx').on(table.projectId, table.slug)]);
// ─── sources ─────────────────────────────────────────────────────────────────
export const sources = pgTable('sources', {
    id: uuid('id')
        .primaryKey()
        .default(sql `gen_random_uuid()`),
    repoId: uuid('repo_id')
        .notNull()
        .references(() => repos.id, { onDelete: 'cascade' }),
    branch: varchar('branch', { length: 255 }).notNull(),
    filePath: text('file_path').notNull(),
    fileHash: varchar('file_hash', { length: 64 }),
    language: varchar('language', { length: 64 }),
    lastScannedAt: timestamp('last_scanned_at', { withTimezone: true }),
    metadata: jsonb('metadata'),
}, (table) => [
    uniqueIndex('sources_repo_id_branch_file_path_idx').on(table.repoId, table.branch, table.filePath),
]);
// ─── events ──────────────────────────────────────────────────────────────────
export const events = pgTable('events', {
    id: uuid('id')
        .primaryKey()
        .default(sql `gen_random_uuid()`),
    type: varchar('type', { length: 128 }).notNull(),
    projectId: uuid('project_id'),
    repoId: uuid('repo_id'),
    userId: varchar('user_id', { length: 255 }),
    payload: jsonb('payload'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    index('events_type_idx').on(table.type),
    index('events_project_id_idx').on(table.projectId),
    index('events_created_at_idx').on(table.createdAt),
]);
// ─── scan_jobs ───────────────────────────────────────────────────────────────
export const scanJobs = pgTable('scan_jobs', {
    id: uuid('id')
        .primaryKey()
        .default(sql `gen_random_uuid()`),
    projectId: uuid('project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    repoId: uuid('repo_id')
        .notNull()
        .references(() => repos.id, { onDelete: 'cascade' }),
    branch: varchar('branch', { length: 255 }).notNull(),
    mode: varchar('mode', { length: 64 }).notNull(),
    status: varchar('status', { length: 64 }).notNull().default('pending'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    stats: jsonb('stats'),
    error: text('error'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});
// ─── api_keys ─────────────────────────────────────────────────────────────────
export const apiKeys = pgTable('api_keys', {
    id: uuid('id')
        .primaryKey()
        .default(sql `gen_random_uuid()`),
    userId: varchar('user_id', { length: 255 }).notNull(),
    keyHash: varchar('key_hash', { length: 255 }).notNull().unique(),
    label: varchar('label', { length: 255 }),
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});
// ─── snapshots ──────────────────────────────────────────────────────────────
export const snapshots = pgTable('snapshots', {
    id: uuid('id')
        .primaryKey()
        .default(sql `gen_random_uuid()`),
    name: varchar('name', { length: 255 }).notNull(),
    version: varchar('version', { length: 64 }).notNull().default('1.0'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
});
// ─── project_links ──────────────────────────────────────────────────────────
export const projectLinks = pgTable('project_links', {
    id: uuid('id')
        .primaryKey()
        .default(sql `gen_random_uuid()`),
    sourceProjectId: uuid('source_project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    targetProjectId: uuid('target_project_id')
        .notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    linkType: varchar('link_type', { length: 128 }).notNull(),
    description: text('description'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .notNull()
        .defaultNow(),
}, (table) => [
    uniqueIndex('project_links_src_tgt_type_idx').on(table.sourceProjectId, table.targetProjectId, table.linkType),
]);
// ─── arch_rules ─────────────────────────────────────────────────────────────
export const archRules = pgTable('arch_rules', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    rule: jsonb('rule').notNull(), // { source: string, target: string, relation: string, allow: boolean }
    severity: varchar('severity', { length: 32 }).notNull().default('warning'),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
// ─── annotations ────────────────────────────────────────────────────────────
export const annotations = pgTable('annotations', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    entityName: varchar('entity_name', { length: 512 }).notNull(),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 64 }).notNull(), // note, decision, warning, todo
    content: text('content').notNull(),
    author: varchar('author', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index('annotations_entity_name_idx').on(table.entityName),
    index('annotations_project_id_idx').on(table.projectId),
]);
// ─── graph_nodes ────────────────────────────────────────────────────────
export const graphNodes = pgTable('graph_nodes', {
    id: varchar('id', { length: 512 }).primaryKey(),
    label: varchar('label', { length: 512 }).notNull(),
    type: varchar('type', { length: 64 }).notNull().default('unknown'),
    fileType: varchar('file_type', { length: 32 }),
    sourceFile: text('source_file'),
    sourceLocation: varchar('source_location', { length: 32 }),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    repoId: uuid('repo_id').references(() => repos.id, { onDelete: 'cascade' }),
    communityId: varchar('community_id', { length: 64 }),
    properties: jsonb('properties'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index('graph_nodes_project_id_idx').on(table.projectId),
    index('graph_nodes_repo_id_idx').on(table.repoId),
    index('graph_nodes_type_idx').on(table.type),
    index('graph_nodes_community_id_idx').on(table.communityId),
    index('graph_nodes_source_file_idx').on(table.sourceFile),
]);
// ─── graph_edges ────────────────────────────────────────────────────────
export const graphEdges = pgTable('graph_edges', {
    id: uuid('id').primaryKey().default(sql `gen_random_uuid()`),
    sourceNodeId: varchar('source_node_id', { length: 512 }).notNull()
        .references(() => graphNodes.id, { onDelete: 'cascade' }),
    targetNodeId: varchar('target_node_id', { length: 512 }).notNull()
        .references(() => graphNodes.id, { onDelete: 'cascade' }),
    relation: varchar('relation', { length: 128 }).notNull(),
    confidence: varchar('confidence', { length: 32 }).default('EXTRACTED'),
    confidenceScore: varchar('confidence_score', { length: 16 }),
    weight: varchar('weight', { length: 16 }).default('1.0'),
    sourceFile: text('source_file'),
    properties: jsonb('properties'),
    projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
}, (table) => [
    index('graph_edges_source_idx').on(table.sourceNodeId),
    index('graph_edges_target_idx').on(table.targetNodeId),
    index('graph_edges_relation_idx').on(table.relation),
    index('graph_edges_project_id_idx').on(table.projectId),
]);
// ─── graph_communities ──────────────────────────────────────────────────
export const graphCommunities = pgTable('graph_communities', {
    id: varchar('id', { length: 64 }).primaryKey(),
    communityIndex: varchar('community_index', { length: 16 }).notNull(),
    projectId: uuid('project_id').notNull()
        .references(() => projects.id, { onDelete: 'cascade' }),
    memberCount: varchar('member_count', { length: 16 }).notNull(),
    cohesionScore: varchar('cohesion_score', { length: 16 }),
    godNodes: jsonb('god_nodes'),
    surprisingConnections: jsonb('surprising_connections'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index('graph_communities_project_id_idx').on(table.projectId),
]);
//# sourceMappingURL=schema.js.map