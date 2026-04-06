import type { Project, Repo, ScanJob, CortexEvent, HealthStatus, CredentialEntry, CortexSnapshot, ImportResult, Snapshot, ProjectLink, ImpactResult, DriftResult, DeadCodeResult, HealthScore, ArchRule, ConformanceResult, Annotation, ChangelogResult } from './types.ts';

const API_KEY = 'dev-key-1';
const headers = { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, { method: 'PUT', headers, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json();
}

async function del(path: string): Promise<void> {
  const res = await fetch(path, { method: 'DELETE', headers });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
}

export const api = {
  health: () => get<HealthStatus>('/api/health'),
  listProjects: () => get<Project[]>('/api/projects'),
  getProject: (id: string) => get<Project>(`/api/projects/${id}`),
  getRepos: (projectId: string) => get<Repo[]>(`/api/repos?projectId=${projectId}`),
  getScanStatus: (projectId?: string) => get<ScanJob[]>(projectId ? `/api/scan/status?projectId=${projectId}` : '/api/scan/status'),
  getScanJob: (jobId: string) => get<ScanJob>(`/api/scan/${jobId}`),
  triggerScan: (data: { projectId: string; repoId: string; branch?: string; mode?: string }) => post<{ jobId: string }>('/api/scan', data),
  resumePausedScans: () => post<{ resumed: number; jobIds?: string[] }>('/api/scan/resume', {}),
  pauseScanJob: (jobId: string) => put<{ status: string }>(`/api/scan/${jobId}/pause`, {}),
  resumeScanJob: (jobId: string) => put<{ status: string; jobId: string }>(`/api/scan/${jobId}/resume`, {}),
  deleteScanJob: (jobId: string) => del(`/api/scan/${jobId}`),
  getEvents: (params?: { projectId?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.projectId) qs.set('projectId', params.projectId);
    if (params?.limit) qs.set('limit', String(params.limit));
    return get<CortexEvent[]>(`/api/events?${qs}`);
  },
  query: (query: string, mode?: string, projectId?: string, includeLinked?: boolean) =>
    post<{ response: string }>('/api/query', { query, mode, projectId: projectId || undefined, includeLinked }),
  getGraph: () => get<unknown>('/api/graph'),
  createProject: (data: { name: string; description?: string; metadata?: Record<string, unknown> }) =>
    post<Project>('/api/projects', data),
  createRepo: (data: { projectId: string; name: string; slug: string; cloneUrl: string; provider: string; techStack?: string[]; defaultBranch?: string }) =>
    post<Repo>('/api/repos', data),
  restartServices: (service?: string) =>
    post<{ status: string; output?: string }>('/api/services/restart', service ? { service } : {}),
  startServices: () =>
    post<{ status: string; output?: string }>('/api/services/start', {}),
  stopServices: () =>
    post<{ status: string; output?: string }>('/api/services/stop', {}),
  setModel: (model: string) =>
    put<{ status: string; model: string }>('/api/settings/model', { model }),
  setOllamaModel: (role: string, model: string) =>
    put<{ status: string; role: string; model: string }>('/api/settings/ollama-model', { role, model }),
  loadOllamaModel: (model: string, processor: string) =>
    post<{ status: string; model: string; processor: string }>('/api/ollama/load', { model, processor }),
  unloadOllamaModel: (model: string) =>
    post<{ status: string; model: string }>('/api/ollama/unload', { model }),

  // Credentials
  listCredentials: (reveal = false) =>
    get<CredentialEntry[]>(`/api/credentials${reveal ? '?reveal=true' : ''}`),
  revealCredential: (id: string) =>
    get<CredentialEntry>(`/api/credentials/${id}/reveal`),
  addCredential: (data: { label: string; provider: string; key: string; value: string }) =>
    post<CredentialEntry>('/api/credentials', data),
  updateCredential: (id: string, data: { label?: string; provider?: string; key?: string; value?: string }) =>
    put<CredentialEntry>(`/api/credentials/${id}`, data),
  deleteCredential: (id: string) => del(`/api/credentials/${id}`),

  // Branches
  getBranches: (repoId: string) => get<string[]>(`/api/repos/${repoId}/branches`),
  updateRepo: (repoId: string, data: Partial<{ name: string; defaultBranch: string }>) =>
    put<Repo>(`/api/repos/${repoId}`, data),

  // Export/Import
  exportSnapshot: () => get<CortexSnapshot>('/api/export'),
  importSnapshot: (data: CortexSnapshot) => post<ImportResult>('/api/import', data),
  listSnapshots: () => get<Snapshot[]>('/api/snapshots'),

  // Project Links
  listProjectLinks: (projectId?: string) =>
    get<ProjectLink[]>(projectId ? `/api/project-links?projectId=${projectId}` : '/api/project-links'),
  createProjectLink: (data: { sourceProjectId: string; targetProjectId: string; linkType: string; description?: string }) =>
    post<ProjectLink>('/api/project-links', data),
  deleteProjectLink: (id: string) => del(`/api/project-links/${id}`),

  // Analysis
  analyzeImpact: (data: { filePath: string; projectId?: string }) =>
    post<ImpactResult>('/api/analysis/impact', data),
  analyzeDrift: (projectId: string) =>
    post<DriftResult>('/api/analysis/drift', { projectId }),
  analyzeDeadCode: (projectId: string) =>
    get<DeadCodeResult>(`/api/analysis/dead-code?projectId=${projectId}`),
  getHealthScore: (projectId: string) =>
    get<HealthScore>(`/api/analysis/health-score?projectId=${projectId}`),

  // Architecture Rules
  listArchRules: (projectId?: string) =>
    get<ArchRule[]>(projectId ? `/api/arch-rules?projectId=${projectId}` : '/api/arch-rules'),
  createArchRule: (data: { projectId?: string; name: string; rule: { source: string; target: string; relation: string; allow: boolean }; severity?: string; description?: string }) =>
    post<ArchRule>('/api/arch-rules', data),
  deleteArchRule: (id: string) => del(`/api/arch-rules/${id}`),
  checkConformance: (projectId: string) =>
    post<ConformanceResult>('/api/arch-rules/check', { projectId }),

  // Annotations
  listAnnotations: (params: { entity?: string; projectId?: string }) => {
    const qs = new URLSearchParams();
    if (params.entity) qs.set('entity', params.entity);
    if (params.projectId) qs.set('projectId', params.projectId);
    return get<Annotation[]>(`/api/annotations?${qs}`);
  },
  createAnnotation: (data: { entityName: string; projectId?: string; type: string; content: string; author?: string }) =>
    post<Annotation>('/api/annotations', data),
  updateAnnotation: (id: string, data: { content?: string; type?: string }) =>
    put<Annotation>(`/api/annotations/${id}`, data),
  deleteAnnotation: (id: string) => del(`/api/annotations/${id}`),

  // Changelog
  getChangelog: (projectId: string, since?: string) =>
    get<ChangelogResult>(`/api/changelog?projectId=${projectId}${since ? `&since=${since}` : ''}`),

  // Pipeline management
  getScanQueue: () => get<{ running: ScanJob[]; queued: ScanJob[]; paused: ScanJob[]; failed: ScanJob[]; completed: ScanJob[] }>('/api/scan/queue'),
  batchRetryScans: (jobIds: string[]) => post<{ retried: number; jobIds: string[] }>('/api/scan/batch/retry', { jobIds }),
  batchPauseScans: (jobIds: string[]) => put<{ paused: number; jobIds: string[] }>('/api/scan/batch/pause', { jobIds }),
  batchDeleteScans: (jobIds: string[]) => post<{ deleted: number }>('/api/scan/batch/delete', { jobIds }),
  getDocumentStatus: () => get<Record<string, number>>('/api/documents/status'),
  getDocuments: () => get<{ documents: unknown[]; statusCounts: Record<string, number>; total: number }>('/api/documents'),

  // LightRAG settings
  updateLightragConfig: (config: { maxParallelInsert?: number; maxAsync?: number; embeddingFuncMaxAsync?: number; embeddingBatchNum?: number }) =>
    put<{ status: string; applied: Record<string, string> }>('/api/settings/lightrag', config),
  reprocessFailedDocuments: () => post<{ reprocessed: number }>('/api/documents/reprocess-failed', {}),
  scanLightRAGDocuments: () => post<unknown>('/api/documents/scan', {}),
  cancelLightRAGPipeline: () => post<unknown>('/api/documents/cancel', {}),
  getLightRAGPipeline: () => get<{
    busy: boolean;
    job_name: string;
    docs: number;
    batchs: number;
    cur_batch: number;
    latest_message: string;
    history_messages: string[];
    counts: Record<string, number>;
  }>('/api/documents/pipeline'),
};
