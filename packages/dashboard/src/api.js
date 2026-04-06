const API_KEY = 'dev-key-1';
const headers = { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' };
async function get(path) {
    const res = await fetch(path, { headers });
    if (!res.ok)
        throw new Error(`API ${path} failed: ${res.status}`);
    return res.json();
}
async function post(path, body) {
    const res = await fetch(path, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok)
        throw new Error(`API ${path} failed: ${res.status}`);
    return res.json();
}
async function put(path, body) {
    const res = await fetch(path, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (!res.ok)
        throw new Error(`API ${path} failed: ${res.status}`);
    return res.json();
}
async function del(path) {
    const res = await fetch(path, { method: 'DELETE', headers });
    if (!res.ok)
        throw new Error(`API ${path} failed: ${res.status}`);
}
export const api = {
    health: () => get('/api/health'),
    listProjects: () => get('/api/projects'),
    getProject: (id) => get(`/api/projects/${id}`),
    getRepos: (projectId) => get(`/api/repos?projectId=${projectId}`),
    getScanStatus: (projectId) => get(projectId ? `/api/scan/status?projectId=${projectId}` : '/api/scan/status'),
    getScanJob: (jobId) => get(`/api/scan/${jobId}`),
    triggerScan: (data) => post('/api/scan', data),
    resumePausedScans: () => post('/api/scan/resume', {}),
    pauseScanJob: (jobId) => put(`/api/scan/${jobId}/pause`, {}),
    resumeScanJob: (jobId) => put(`/api/scan/${jobId}/resume`, {}),
    deleteScanJob: (jobId) => del(`/api/scan/${jobId}`),
    getEvents: (params) => {
        const qs = new URLSearchParams();
        if (params?.projectId)
            qs.set('projectId', params.projectId);
        if (params?.limit)
            qs.set('limit', String(params.limit));
        return get(`/api/events?${qs}`);
    },
    query: (query, mode, projectId, includeLinked) => post('/api/query', { query, mode, projectId: projectId || undefined, includeLinked }),
    getGraph: () => get('/api/graph'),
    createProject: (data) => post('/api/projects', data),
    createRepo: (data) => post('/api/repos', data),
    restartServices: (service) => post('/api/services/restart', service ? { service } : {}),
    startServices: () => post('/api/services/start', {}),
    stopServices: () => post('/api/services/stop', {}),
    setModel: (model) => put('/api/settings/model', { model }),
    setOllamaModel: (role, model) => put('/api/settings/ollama-model', { role, model }),
    loadOllamaModel: (model, processor) => post('/api/ollama/load', { model, processor }),
    unloadOllamaModel: (model) => post('/api/ollama/unload', { model }),
    // Credentials
    listCredentials: (reveal = false) => get(`/api/credentials${reveal ? '?reveal=true' : ''}`),
    revealCredential: (id) => get(`/api/credentials/${id}/reveal`),
    addCredential: (data) => post('/api/credentials', data),
    updateCredential: (id, data) => put(`/api/credentials/${id}`, data),
    deleteCredential: (id) => del(`/api/credentials/${id}`),
    // Branches
    getBranches: (repoId) => get(`/api/repos/${repoId}/branches`),
    updateRepo: (repoId, data) => put(`/api/repos/${repoId}`, data),
    // Export/Import
    exportSnapshot: () => get('/api/export'),
    importSnapshot: (data) => post('/api/import', data),
    listSnapshots: () => get('/api/snapshots'),
    // Project Links
    listProjectLinks: (projectId) => get(projectId ? `/api/project-links?projectId=${projectId}` : '/api/project-links'),
    createProjectLink: (data) => post('/api/project-links', data),
    deleteProjectLink: (id) => del(`/api/project-links/${id}`),
    // Analysis
    analyzeImpact: (data) => post('/api/analysis/impact', data),
    analyzeDrift: (projectId) => post('/api/analysis/drift', { projectId }),
    analyzeDeadCode: (projectId) => get(`/api/analysis/dead-code?projectId=${projectId}`),
    getHealthScore: (projectId) => get(`/api/analysis/health-score?projectId=${projectId}`),
    // Architecture Rules
    listArchRules: (projectId) => get(projectId ? `/api/arch-rules?projectId=${projectId}` : '/api/arch-rules'),
    createArchRule: (data) => post('/api/arch-rules', data),
    deleteArchRule: (id) => del(`/api/arch-rules/${id}`),
    checkConformance: (projectId) => post('/api/arch-rules/check', { projectId }),
    // Annotations
    listAnnotations: (params) => {
        const qs = new URLSearchParams();
        if (params.entity)
            qs.set('entity', params.entity);
        if (params.projectId)
            qs.set('projectId', params.projectId);
        return get(`/api/annotations?${qs}`);
    },
    createAnnotation: (data) => post('/api/annotations', data),
    updateAnnotation: (id, data) => put(`/api/annotations/${id}`, data),
    deleteAnnotation: (id) => del(`/api/annotations/${id}`),
    // Changelog
    getChangelog: (projectId, since) => get(`/api/changelog?projectId=${projectId}${since ? `&since=${since}` : ''}`),
    // Pipeline management
    getScanQueue: () => get('/api/scan/queue'),
    batchRetryScans: (jobIds) => post('/api/scan/batch/retry', { jobIds }),
    batchPauseScans: (jobIds) => put('/api/scan/batch/pause', { jobIds }),
    batchDeleteScans: (jobIds) => post('/api/scan/batch/delete', { jobIds }),
    getDocumentStatus: () => get('/api/documents/status'),
    getDocuments: () => get('/api/documents'),
    // LightRAG settings
    updateLightragConfig: (config) => put('/api/settings/lightrag', config),
    reprocessFailedDocuments: () => post('/api/documents/reprocess-failed', {}),
    scanLightRAGDocuments: () => post('/api/documents/scan', {}),
    cancelLightRAGPipeline: () => post('/api/documents/cancel', {}),
    getLightRAGPipeline: () => get('/api/documents/pipeline'),
};
