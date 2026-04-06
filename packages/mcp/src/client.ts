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
}
