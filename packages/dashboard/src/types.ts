export interface Project {
  id: string;
  name: string;
  description: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Repo {
  id: string;
  projectId: string;
  name: string;
  slug: string;
  cloneUrl: string | null;
  provider: string;
  techStack: string[];
  defaultBranch: string;
  lastScannedAt: string | null;
  lastScannedCommit: string | null;
  createdAt: string;
}

export interface ScanJob {
  id: string;
  projectId: string;
  repoId: string;
  branch: string;
  mode: string;
  status: string;
  startedAt: string | null;
  completedAt: string | null;
  stats: Record<string, unknown>;
  error: string | null;
  createdAt: string;
}

export interface CortexEvent {
  id: string;
  type: string;
  projectId: string | null;
  repoId: string | null;
  userId: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface HealthStatus {
  status: string;
  services: Record<string, string>;
  timestamp: string;
}

export interface ProjectWithRepos extends Project {
  repos: Repo[];
}

export interface CredentialEntry {
  id: string;
  label: string;
  provider: string;
  key: string;
  value: string;
}

export interface Snapshot {
  id: string;
  name: string;
  version: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface CortexSnapshot {
  version: string;
  exportedAt: string;
  cortex: { projects: Array<Project & { repos: Repo[] }> };
  lightrag: { documents: unknown[]; graph: { nodes: unknown[]; edges: unknown[] } };
}

export interface ImportResult {
  status: string;
  stats: { projectsImported: number; reposImported: number; documentsIngested: number; errors: string[] };
}

export interface ProjectLink {
  id: string;
  sourceProjectId: string;
  targetProjectId: string;
  linkType: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ImpactResult {
  filePath: string;
  directImpact: Array<{ entity: string; file: string; project: string; type: string }>;
  transitiveImpact: Array<{ entity: string; file: string; project: string; depth: number }>;
  crossProjectImpact: Array<{ entity: string; file: string; project: string }>;
  rawAnalysis: string;
}

export interface DriftResult {
  projectId: string;
  projectName: string;
  currentState: { entityCount: number; entities: Array<{ name: string; type: string }> };
  analysis: string;
  timestamp: string;
}

export interface DeadCodeResult {
  unreferencedEntities: Array<{ name: string; type: string; file: string }>;
  count: number;
  totalEntities: number;
}

export interface HealthScore {
  score: number;
  breakdown: { graphCoverage: number; orphanRatio: number; cyclomaticComplexity: number; crossProjectCoupling: number };
  stats: { totalEntities: number; totalRelations: number; orphanEntities: number; externalRelations: number };
}

export interface ArchRule {
  id: string;
  projectId: string | null;
  name: string;
  rule: { source: string; target: string; relation: string; allow: boolean };
  severity: string;
  description: string | null;
  createdAt: string;
}

export interface ConformanceResult {
  violations: Array<{ rule: string; severity: string; source: string; target: string; relation: string }>;
  passed: number;
  failed: number;
}

export interface Annotation {
  id: string;
  entityName: string;
  projectId: string | null;
  type: string;
  content: string;
  author: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChangelogResult {
  projectId: string;
  projectName: string;
  since: string;
  entries: Array<{ date: string; type: string; description: string; stats: Record<string, number> }>;
  analysis: string;
  scanCount: number;
}
