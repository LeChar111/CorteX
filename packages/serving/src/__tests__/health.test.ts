import 'dotenv/config';
import { describe, it, expect } from 'vitest';
import { createApp } from '../api/app.js';

const TEST_KEY = 'test-health-key';

describe('GET /api/health', () => {
  it('returns 200 with status and services', async () => {
    const app = createApp({ apiKeys: [TEST_KEY] });
    // Health skips auth, so no key needed
    const res = await app.request('/api/health');

    expect(res.status).toBe(200);

    const body = await res.json() as {
      status: string;
      services: Record<string, string>;
      timestamp: string;
    };

    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('services');
    expect(body).toHaveProperty('timestamp');

    expect(typeof body.status).toBe('string');
    expect(['ok', 'degraded']).toContain(body.status);

    expect(body.services).toHaveProperty('postgres');
    expect(body.services).toHaveProperty('graphStorage');
    expect(body.services).toHaveProperty('ollama');
  });

  it('reports postgres as ok when DB is reachable', async () => {
    const app = createApp({ apiKeys: [TEST_KEY] });
    const res = await app.request('/api/health');
    const body = await res.json() as { services: Record<string, string> };
    // Postgres should be running in CI / local dev
    expect(body.services['postgres']).toBe('ok');
  });
});
