import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LightRAGClient } from '../lightrag/client.js';

const BASE_URL = 'http://localhost:9621';

function makeFetchMock(options: {
  ok?: boolean;
  status?: number;
  json?: unknown;
  text?: string;
  throws?: boolean;
}) {
  if (options.throws) {
    return vi.fn().mockRejectedValue(new Error('Network error'));
  }
  const response = {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    json: vi.fn().mockResolvedValue(options.json ?? {}),
    text: vi.fn().mockResolvedValue(options.text ?? ''),
  };
  return vi.fn().mockResolvedValue(response);
}

describe('LightRAGClient', () => {
  let client: LightRAGClient;

  beforeEach(() => {
    client = new LightRAGClient(BASE_URL);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('health()', () => {
    it('returns true when fetch resolves ok', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ ok: true }));
      const result = await client.health();
      expect(result).toBe(true);
    });

    it('returns false when fetch throws', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ throws: true }));
      const result = await client.health();
      expect(result).toBe(false);
    });

    it('returns false when response is not ok', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ ok: false, status: 503 }));
      const result = await client.health();
      expect(result).toBe(false);
    });
  });

  describe('ingest()', () => {
    it('calls POST /documents/text with correct body', async () => {
      const fetchMock = makeFetchMock({ ok: true });
      vi.stubGlobal('fetch', fetchMock);

      await client.ingest('hello world', { source: 'test' });

      expect(fetchMock).toHaveBeenCalledOnce();
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(`${BASE_URL}/documents/text`);
      expect(init.method).toBe('POST');
      expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
      expect(JSON.parse(init.body as string)).toEqual({
        text: 'hello world',
        metadata: { source: 'test' },
      });
    });

    it('throws when response is not ok', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ ok: false, status: 500, text: 'Internal Error' }));
      await expect(client.ingest('text')).rejects.toThrow('LightRAG ingest failed (500): Internal Error');
    });
  });

  describe('query()', () => {
    it('calls POST /query with mode "mix" by default and returns response string', async () => {
      const fetchMock = makeFetchMock({ ok: true, json: { response: 'answer from RAG' } });
      vi.stubGlobal('fetch', fetchMock);

      const result = await client.query('what is cortex?');

      expect(fetchMock).toHaveBeenCalledOnce();
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(`${BASE_URL}/query`);
      expect(init.method).toBe('POST');
      expect(JSON.parse(init.body as string)).toEqual({
        query: 'what is cortex?',
        mode: 'mix',
      });
      expect(result).toBe('answer from RAG');
    });

    it('supports mode "local"', async () => {
      const fetchMock = makeFetchMock({ ok: true, json: { response: 'local answer' } });
      vi.stubGlobal('fetch', fetchMock);

      const result = await client.query('question', 'local');

      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(init.body as string).mode).toBe('local');
      expect(result).toBe('local answer');
    });

    it('supports mode "global"', async () => {
      const fetchMock = makeFetchMock({ ok: true, json: { response: 'global answer' } });
      vi.stubGlobal('fetch', fetchMock);

      const result = await client.query('question', 'global');

      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(init.body as string).mode).toBe('global');
      expect(result).toBe('global answer');
    });

    it('supports mode "naive"', async () => {
      const fetchMock = makeFetchMock({ ok: true, json: { response: 'naive answer' } });
      vi.stubGlobal('fetch', fetchMock);

      const result = await client.query('question', 'naive');

      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(JSON.parse(init.body as string).mode).toBe('naive');
      expect(result).toBe('naive answer');
    });

    it('throws when response is not ok', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ ok: false, status: 422, text: 'Unprocessable' }));
      await expect(client.query('question')).rejects.toThrow('LightRAG query failed (422): Unprocessable');
    });
  });

  describe('deleteDocument()', () => {
    it('calls DELETE /documents/{id}', async () => {
      const fetchMock = makeFetchMock({ ok: true });
      vi.stubGlobal('fetch', fetchMock);

      await client.deleteDocument('doc-123');

      expect(fetchMock).toHaveBeenCalledOnce();
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(`${BASE_URL}/documents/doc-123`);
      expect(init.method).toBe('DELETE');
    });

    it('throws when response is not ok', async () => {
      vi.stubGlobal('fetch', makeFetchMock({ ok: false, status: 404, text: 'Not Found' }));
      await expect(client.deleteDocument('missing-id')).rejects.toThrow('LightRAG delete failed (404): Not Found');
    });
  });
});
