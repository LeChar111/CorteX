CREATE TABLE IF NOT EXISTS arch_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  rule JSONB NOT NULL,
  severity VARCHAR(32) NOT NULL DEFAULT 'warning',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS annotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name VARCHAR(512) NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS annotations_entity_name_idx ON annotations(entity_name);
CREATE INDEX IF NOT EXISTS annotations_project_id_idx ON annotations(project_id);
