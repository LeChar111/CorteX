export class CortexClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request(path: string, options: RequestInit = {}): Promise<Response> {
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
  async query(query: string, options?: { project?: string; mode?: string; limit?: number; projectId?: string; includeLinked?: boolean }): Promise<unknown> {
    const res = await this.request('/api/query', {
      method: 'POST',
      body: JSON.stringify({ query, ...options }),
    });
    return res.json();
  }

  // Graph
  async getGraph(options?: { entityName?: string; depth?: number }): Promise<unknown> {
    const params = new URLSearchParams();
    if (options?.entityName) params.set('entity', options.entityName);
    if (options?.depth) params.set('depth', String(options.depth));
    const qs = params.toString();
    const res = await this.request(`/api/graph${qs ? '?' + qs : ''}`);
    return res.json();
  }

  // Ingest
  async ingest(data: {
    content: string;
    filePath?: string;
    language?: string;
    project?: string;
    projectId?: string;
    type?: string;
    name?: string;
    description?: string;
    source?: string;
    target?: string;
    relationType?: string;
  }): Promise<unknown> {
    const res = await this.request('/api/ingest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // ── Direct graph operations ──

  async createGraphEntity(data: {
    name: string;
    type?: string;
    description?: string;
    projectId?: string;
    projectName?: string;
    filePath?: string;
  }): Promise<unknown> {
    const res = await this.request('/api/graph/entity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async createGraphRelation(data: {
    source: string;
    target: string;
    type: string;
    description?: string;
    weight?: number;
    projectId?: string;
  }): Promise<unknown> {
    const res = await this.request('/api/graph/relation', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async entityExists(name: string): Promise<boolean> {
    try {
      const res = await this.request(`/api/graph/entity/exists?name=${encodeURIComponent(name)}`);
      const data = (await res.json()) as { exists?: boolean };
      return data.exists === true;
    } catch {
      return false;
    }
  }

  async searchGraphEntities(query: string, limit = 50): Promise<unknown> {
    const res = await this.request(`/api/graph/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return res.json();
  }

  async getCrossProjectGraph(projectId: string, entityName?: string, depth = 2): Promise<unknown> {
    const params = new URLSearchParams({ projectId });
    if (entityName) params.set('entity', entityName);
    params.set('depth', String(depth));
    const res = await this.request(`/api/graph/cross-project?${params}`);
    return res.json();
  }

  async mergeEntities(duplicates: string[], canonical: string): Promise<unknown> {
    const res = await this.request('/api/graph/merge', {
      method: 'POST',
      body: JSON.stringify({ duplicates, canonical }),
    });
    return res.json();
  }

  // Projects
  async listProjects(): Promise<unknown[]> {
    const res = await this.request('/api/projects');
    return res.json() as Promise<unknown[]>;
  }

  // Repos
  async getRepos(projectId: string): Promise<unknown[]> {
    const res = await this.request(`/api/repos?projectId=${projectId}`);
    return res.json() as Promise<unknown[]>;
  }

  // Scan
  async triggerScan(data: {
    projectId: string;
    repoId: string;
    branch?: string;
    mode?: string;
  }): Promise<unknown> {
    const res = await this.request('/api/scan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }

  async getScanStatus(projectId?: string): Promise<unknown> {
    const path = projectId ? `/api/scan/status?projectId=${projectId}` : '/api/scan/status';
    const res = await this.request(path);
    return res.json();
  }

  // Events
  async getEvents(options?: { projectId?: string; type?: string; limit?: number }): Promise<unknown[]> {
    const params = new URLSearchParams();
    if (options?.projectId) params.set('projectId', options.projectId);
    if (options?.type) params.set('type', options.type);
    if (options?.limit) params.set('limit', String(options.limit));
    const qs = params.toString();
    const res = await this.request(`/api/events${qs ? '?' + qs : ''}`);
    return res.json() as Promise<unknown[]>;
  }

  // Context
  async getContext(projectIdOrName: string, focus?: string): Promise<unknown> {
    const params = new URLSearchParams();
    if (focus) params.set('focus', focus);
    const qs = params.toString();
    const res = await this.request(`/api/context/${encodeURIComponent(projectIdOrName)}${qs ? '?' + qs : ''}`);
    return res.json();
  }

  // Community analysis
  async getCommunities(projectId: string): Promise<unknown> {
    const res = await this.request(`/api/analysis/communities?projectId=${projectId}`);
    return res.json();
  }

  async getGodNodes(projectId: string): Promise<unknown> {
    const res = await this.request(`/api/analysis/god-nodes?projectId=${projectId}`);
    return res.json();
  }

  async getSurprisingConnections(projectId: string): Promise<unknown> {
    const res = await this.request(`/api/analysis/surprising-connections?projectId=${projectId}`);
    return res.json();
  }

  // Health
  async health(): Promise<unknown> {
    const res = await this.request('/api/health');
    return res.json();
  }

  // Impact analysis
  async impactAnalysis(data: { filePath: string; projectId?: string }): Promise<unknown> {
    const res = await this.request('/api/analysis/impact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // Annotations
  async listAnnotations(entityName: string): Promise<unknown[]> {
    const res = await this.request(`/api/annotations?entity=${encodeURIComponent(entityName)}`);
    return res.json() as Promise<unknown[]>;
  }

  async addAnnotation(data: {
    entityName: string;
    type?: string;
    content?: string;
    projectId?: string;
  }): Promise<unknown> {
    const res = await this.request('/api/annotations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  }

  // Export
  async exportKb(): Promise<unknown> {
    const res = await this.request('/api/export');
    return res.json();
  }

  // Cross-project link detection
  async detectCrossProjectLinks(sourceProjectId: string, targetProjectId: string): Promise<unknown> {
    const res = await this.request('/api/analysis/detect-links', {
      method: 'POST',
      body: JSON.stringify({ sourceProjectId, targetProjectId }),
    });
    return res.json();
  }

  async autoLinkProjects(sourceProjectId: string, targetProjectId: string, linkType: string = 'related'): Promise<unknown> {
    const res = await this.request('/api/analysis/auto-link', {
      method: 'POST',
      body: JSON.stringify({ sourceProjectId, targetProjectId, linkType }),
    });
    return res.json();
  }
}
