CREATE TABLE IF NOT EXISTS project_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  target_project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  link_type VARCHAR(128) NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(source_project_id, target_project_id, link_type)
);
CREATE INDEX IF NOT EXISTS project_links_source_idx ON project_links(source_project_id);
CREATE INDEX IF NOT EXISTS project_links_target_idx ON project_links(target_project_id);
