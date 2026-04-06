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
    async getGraph() {
        const res = await this.request('/api/graph');
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
}
//# sourceMappingURL=client.js.map