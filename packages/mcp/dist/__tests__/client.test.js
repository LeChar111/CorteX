import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CortexClient } from '../client.js';
const BASE_URL = 'http://localhost:3100';
const API_KEY = 'test-api-key';
function makeOkResponse(body) {
    return {
        ok: true,
        status: 200,
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(JSON.stringify(body)),
    };
}
describe('CortexClient', () => {
    let client;
    let mockFetch;
    beforeEach(() => {
        client = new CortexClient(BASE_URL, API_KEY);
        mockFetch = vi.fn();
        vi.stubGlobal('fetch', mockFetch);
    });
    it('adds X-API-Key header to every request', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse({ ok: true }));
        await client.health();
        expect(mockFetch).toHaveBeenCalledOnce();
        const [_url, init] = mockFetch.mock.calls[0];
        expect(init.headers['X-API-Key']).toBe(API_KEY);
    });
    it('query() calls POST /api/query with the correct body', async () => {
        const responseBody = { results: [] };
        mockFetch.mockResolvedValueOnce(makeOkResponse(responseBody));
        const result = await client.query('find all services', { project: 'my-project', mode: 'fast' });
        expect(mockFetch).toHaveBeenCalledOnce();
        const [url, init] = mockFetch.mock.calls[0];
        expect(url).toBe(`${BASE_URL}/api/query`);
        expect(init.method).toBe('POST');
        expect(JSON.parse(init.body)).toEqual({
            query: 'find all services',
            project: 'my-project',
            mode: 'fast',
        });
        expect(result).toEqual(responseBody);
    });
    it('query() works without optional options', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse({ results: [] }));
        await client.query('hello');
        const [, init] = mockFetch.mock.calls[0];
        expect(JSON.parse(init.body)).toEqual({ query: 'hello' });
    });
    it('listProjects() calls GET /api/projects', async () => {
        const projects = [{ id: '1', name: 'Cortex' }];
        mockFetch.mockResolvedValueOnce(makeOkResponse(projects));
        const result = await client.listProjects();
        expect(mockFetch).toHaveBeenCalledOnce();
        const [url, init] = mockFetch.mock.calls[0];
        expect(url).toBe(`${BASE_URL}/api/projects`);
        expect(init.method).toBeUndefined(); // GET by default
        expect(result).toEqual(projects);
    });
    it('throws on non-ok response with error details', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: () => Promise.resolve('Unauthorized'),
        });
        await expect(client.listProjects()).rejects.toThrow('Cortex API GET /api/projects failed (401): Unauthorized');
    });
    it('getRepos() calls GET /api/repos with projectId query param', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse([]));
        await client.getRepos('proj-123');
        const [url] = mockFetch.mock.calls[0];
        expect(url).toBe(`${BASE_URL}/api/repos?projectId=proj-123`);
    });
    it('triggerScan() calls POST /api/scan', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse({ jobId: 'job-1' }));
        await client.triggerScan({ projectId: 'proj-1', repoId: 'repo-1', branch: 'main' });
        const [url, init] = mockFetch.mock.calls[0];
        expect(url).toBe(`${BASE_URL}/api/scan`);
        expect(init.method).toBe('POST');
        expect(JSON.parse(init.body)).toEqual({
            projectId: 'proj-1',
            repoId: 'repo-1',
            branch: 'main',
        });
    });
    it('getScanStatus() without projectId calls /api/scan/status', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse({ status: 'idle' }));
        await client.getScanStatus();
        const [url] = mockFetch.mock.calls[0];
        expect(url).toBe(`${BASE_URL}/api/scan/status`);
    });
    it('getScanStatus() with projectId appends query param', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse({ status: 'running' }));
        await client.getScanStatus('proj-42');
        const [url] = mockFetch.mock.calls[0];
        expect(url).toBe(`${BASE_URL}/api/scan/status?projectId=proj-42`);
    });
    it('getEvents() builds correct query string', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse([]));
        await client.getEvents({ projectId: 'p1', type: 'scan', limit: 50 });
        const [url] = mockFetch.mock.calls[0];
        const parsed = new URL(url);
        expect(parsed.pathname).toBe('/api/events');
        expect(parsed.searchParams.get('projectId')).toBe('p1');
        expect(parsed.searchParams.get('type')).toBe('scan');
        expect(parsed.searchParams.get('limit')).toBe('50');
    });
});
//# sourceMappingURL=client.test.js.map