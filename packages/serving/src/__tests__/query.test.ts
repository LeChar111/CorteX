import { describe, it, expect, vi, afterEach } from 'vitest';
import { createApp } from '../api/app.js';

const TEST_KEY = 'test-query-key';

function makeApp() {
  return createApp({ apiKeys: [TEST_KEY] });
}

function authHeaders() {
  return { 'X-API-Key': TEST_KEY, 'Content-Type': 'application/json' };
}

function makeFetchMock(options: {
  ok?: boolean;
  status?: number;
  json?: unknown;
  text?: string;
}) {
  const response = {
    ok: options.ok ?? true,
    status: options.status ?? 200,
    json: vi.fn().mockResolvedValue(options.json ?? {}),
    text: vi.fn().mockResolvedValue(options.text ?? ''),
  };
  return vi.fn().mockResolvedValue(response);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('POST /api/query', () => {
  it('returns 200 with response for a valid query', async () => {
    vi.stubGlobal(
      'fetch',
      makeFetchMock({ ok: true, json: { response: 'The answer is 42.' } }),
    );

    const app = makeApp();
    const res = await app.request('/api/query', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ query: 'What is the meaning of life?' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as {
      query: string;
      mode: string;
      response: string;
      timestamp: string;
    };
    expect(body.query).toBe('What is the meaning of life?');
    expect(body.mode).toBe('mix');
    expect(body.response).toBe('The answer is 42.');
    expect(body.timestamp).toBeTruthy();
  });

  it('uses the provided mode', async () => {
    const fetchMock = makeFetchMock({ ok: true, json: { response: 'local result' } });
    vi.stubGlobal('fetch', fetchMock);

    const app = makeApp();
    const res = await app.request('/api/query', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ query: 'search me', mode: 'local' }),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as { mode: string; response: string };
    expect(body.mode).toBe('local');
    expect(body.response).toBe('local result');

    // Verify mode was included in the response
    expect(body.mode).toBe('local');
  });

  it('returns 400 when query is missing', async () => {
    const app = makeApp();
    const res = await app.request('/api/query', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ mode: 'mix' }),
    });
    expect(res.status).toBe(400);
    const body = await res.json() as { error: string };
    expect(body.error).toBe('Validation error');
  });

  it('returns 400 when query is empty string', async () => {
    const app = makeApp();
    const res = await app.request('/api/query', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ query: '' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid mode', async () => {
    const app = makeApp();
    const res = await app.request('/api/query', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ query: 'hello', mode: 'invalid_mode' }),
    });
    expect(res.status).toBe(400);
  });

  it('returns 401 without API key', async () => {
    const app = makeApp();
    const res = await app.request('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'hello' }),
    });
    expect(res.status).toBe(401);
  });

  it('returns 500 when graph storage is unavailable', async () => {
    vi.stubGlobal(
      'fetch',
      makeFetchMock({ ok: false, status: 503, text: 'Service Unavailable' }),
    );

    const app = makeApp();
    const res = await app.request('/api/query', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ query: 'will fail' }),
    });
    expect(res.status).toBe(500);
  });
});
