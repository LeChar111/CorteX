CREATE TABLE IF NOT EXISTS "graph_nodes" (
  "id" varchar(512) PRIMARY KEY,
  "label" varchar(512) NOT NULL,
  "type" varchar(64) NOT NULL DEFAULT 'unknown',
  "file_type" varchar(32),
  "source_file" text,
  "source_location" varchar(32),
  "project_id" uuid REFERENCES "projects"("id") ON DELETE CASCADE,
  "repo_id" uuid REFERENCES "repos"("id") ON DELETE CASCADE,
  "community_id" varchar(64),
  "properties" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "graph_nodes_project_id_idx" ON "graph_nodes" ("project_id");
CREATE INDEX IF NOT EXISTS "graph_nodes_repo_id_idx" ON "graph_nodes" ("repo_id");
CREATE INDEX IF NOT EXISTS "graph_nodes_type_idx" ON "graph_nodes" ("type");
CREATE INDEX IF NOT EXISTS "graph_nodes_community_id_idx" ON "graph_nodes" ("community_id");
CREATE INDEX IF NOT EXISTS "graph_nodes_source_file_idx" ON "graph_nodes" ("source_file");

CREATE TABLE IF NOT EXISTS "graph_edges" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "source_node_id" varchar(512) NOT NULL REFERENCES "graph_nodes"("id") ON DELETE CASCADE,
  "target_node_id" varchar(512) NOT NULL REFERENCES "graph_nodes"("id") ON DELETE CASCADE,
  "relation" varchar(128) NOT NULL,
  "confidence" varchar(32) DEFAULT 'EXTRACTED',
  "confidence_score" varchar(16),
  "weight" varchar(16) DEFAULT '1.0',
  "source_file" text,
  "properties" jsonb,
  "project_id" uuid REFERENCES "projects"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "graph_edges_source_idx" ON "graph_edges" ("source_node_id");
CREATE INDEX IF NOT EXISTS "graph_edges_target_idx" ON "graph_edges" ("target_node_id");
CREATE INDEX IF NOT EXISTS "graph_edges_relation_idx" ON "graph_edges" ("relation");
CREATE INDEX IF NOT EXISTS "graph_edges_project_id_idx" ON "graph_edges" ("project_id");

CREATE TABLE IF NOT EXISTS "graph_communities" (
  "id" varchar(64) PRIMARY KEY,
  "community_index" varchar(16) NOT NULL,
  "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
  "member_count" varchar(16) NOT NULL,
  "cohesion_score" varchar(16),
  "god_nodes" jsonb,
  "surprising_connections" jsonb,
  "metadata" jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "graph_communities_project_id_idx" ON "graph_communities" ("project_id");
