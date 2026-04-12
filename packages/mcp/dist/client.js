export class CortexClient {
    baseUrl;
    apiKey;
    constructor(baseUrl, apiKey) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }
    async request(path, options = {}) {
        const res = await fetch(`${this.baseUrl}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': this.apiKey,
                ...options.headers,
            },
        });
        if (!res.ok) {
            const body = await res.text();
            throw new Error(`Cortex API ${options.method || 'GET'} ${path} failed (${res.status}): ${body}`);
        }
        return res;
    }
    // Query
    async query(query, options) {
        const res = await this.request('/api/query', {
            method: 'POST',
            body: JSON.stringify({ query, ...options }),
        });
        return res.json();
    }
    // Graph
    async getGraph(options) {
        const params = new URLSearchParams();
        if (options?.entityName)
            params.set('entity', options.entityName);
        if (options?.depth)
            params.set('depth', String(options.depth));
        const qs = params.toString();
        const res = await this.request(`/api/graph${qs ? '?' + qs : ''}`);
        return res.json();
    }
    // Ingest
    async ingest(data) {
        const res = await this.request('/api/ingest', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return res.json();
    }
    // ── Direct graph operations ──
    async createGraphEntity(data) {
        const res = await this.request('/api/graph/entity', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return res.json();
    }
    async createGraphRelation(data) {
        const res = await this.request('/api/graph/relation', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return res.json();
    }
    async entityExists(name) {
        try {
            const res = await this.request(`/api/graph/entity/exists?name=${encodeURIComponent(name)}`);
            const data = (await res.json());
            return data.exists === true;
        }
        catch {
            return false;
        }
    }
    async searchGraphEntities(query, limit = 50) {
        const res = await this.request(`/api/graph/search?q=${encodeURIComponent(query)}&limit=${limit}`);
        return res.json();
    }
    async getCrossProjectGraph(projectId, entityName, depth = 2) {
        const params = new URLSearchParams({ projectId });
        if (entityName)
            params.set('entity', entityName);
        params.set('depth', String(depth));
        const res = await this.request(`/api/graph/cross-project?${params}`);
        return res.json();
    }
    async mergeEntities(duplicates, canonical) {
        const res = await this.request('/api/graph/merge', {
            method: 'POST',
            body: JSON.stringify({ duplicates, canonical }),
        });
        return res.json();
    }
    // Projects
    async listProjects() {
        const res = await this.request('/api/projects');
        return res.json();
    }
    // Repos
    async getRepos(projectId) {
        const res = await this.request(`/api/repos?projectId=${projectId}`);
        return res.json();
    }
    // Scan
    async triggerScan(data) {
        const res = await this.request('/api/scan', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return res.json();
    }
    async getScanStatus(projectId) {
        const path = projectId ? `/api/scan/status?projectId=${projectId}` : '/api/scan/status';
        const res = await this.request(path);
        return res.json();
    }
    // Events
    async getEvents(options) {
        const params = new URLSearchParams();
        if (options?.projectId)
            params.set('projectId', options.projectId);
        if (options?.type)
            params.set('type', options.type);
        if (options?.limit)
            params.set('limit', String(options.limit));
        const qs = params.toString();
        const res = await this.request(`/api/events${qs ? '?' + qs : ''}`);
        return res.json();
    }
    // Context
    async getContext(projectIdOrName, focus) {
        const params = new URLSearchParams();
        if (focus)
            params.set('focus', focus);
        const qs = params.toString();
        const res = await this.request(`/api/context/${encodeURIComponent(projectIdOrName)}${qs ? '?' + qs : ''}`);
        return res.json();
    }
    // Community analysis
    async getCommunities(projectId) {
        const res = await this.request(`/api/analysis/communities?projectId=${projectId}`);
        return res.json();
    }
    async getGodNodes(projectId) {
        const res = await this.request(`/api/analysis/god-nodes?projectId=${projectId}`);
        return res.json();
    }
    async getSurprisingConnections(projectId) {
        const res = await this.request(`/api/analysis/surprising-connections?projectId=${projectId}`);
        return res.json();
    }
    // Health
    async health() {
        const res = await this.request('/api/health');
        return res.json();
    }
    // Impact analysis
    async impactAnalysis(data) {
        const res = await this.request('/api/analysis/impact', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return res.json();
    }
    // Annotations
    async listAnnotations(entityName) {
        const res = await this.request(`/api/annotations?entity=${encodeURIComponent(entityName)}`);
        return res.json();
    }
    async addAnnotation(data) {
        const res = await this.request('/api/annotations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return res.json();
    }
    // Export
    async exportKb() {
        const res = await this.request('/api/export');
        return res.json();
    }
    // Cross-project link detection
    async detectCrossProjectLinks(sourceProjectId, targetProjectId) {
        const res = await this.request('/api/analysis/detect-links', {
            method: 'POST',
            body: JSON.stringify({ sourceProjectId, targetProjectId }),
        });
        return res.json();
    }
    async autoLinkProjects(sourceProjectId, targetProjectId, linkType = 'related') {
        const res = await this.request('/api/analysis/auto-link', {
            method: 'POST',
            body: JSON.stringify({ sourceProjectId, targetProjectId, linkType }),
        });
        return res.json();
    }
}
//# sourceMappingURL=client.js.map