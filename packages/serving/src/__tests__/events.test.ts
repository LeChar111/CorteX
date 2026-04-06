import 'dotenv/config';
import { describe, it, expect, beforeEach } from 'vitest';
import { getPool, getDb, insertEvent } from '@cortex/db';
import { createApp } from '../api/app.js';

const TEST_KEY = 'test-events-key';

async function truncateEvents() {
  const pool = getPool();
  await pool.query('TRUNCATE TABLE events CASCADE');
}

function makeApp() {
  return createApp({ apiKeys: [TEST_KEY] });
}

function authHeaders() {
  return { 'X-API-Key': TEST_KEY };
}

describe('GET /api/events', () => {
  beforeEach(async () => {
    await truncateEvents();
  });

  it('returns 200 with empty array when no events', async () => {
    const app = makeApp();
    const res = await app.request('/api/events', {
      headers: authHeaders(),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as unknown[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  it('returns events ordered by createdAt descending', async () => {
    const db = getDb();
    await insertEvent(db, { type: 'test.first', payload: { order: 1 } });
    await insertEvent(db, { type: 'test.second', payload: { order: 2 } });

    const app = makeApp();
    const res = await app.request('/api/events', {
      headers: authHeaders(),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as Array<{ type: string }>;
    expect(body.length).toBe(2);
    // Most recent first
    expect(body[0]!.type).toBe('test.second');
    expect(body[1]!.type).toBe('test.first');
  });

  it('filters by type query param', async () => {
    const db = getDb();
    await insertEvent(db, { type: 'content.ingested', payload: {} });
    await insertEvent(db, { type: 'scan.started', payload: {} });

    const app = makeApp();
    const res = await app.request('/api/events?type=content.ingested', {
      headers: authHeaders(),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as Array<{ type: string }>;
    expect(body.length).toBe(1);
    expect(body[0]!.type).toBe('content.ingested');
  });

  it('respects limit query param', async () => {
    const db = getDb();
    for (let i = 0; i < 5; i++) {
      await insertEvent(db, { type: 'batch.event', payload: { i } });
    }

    const app = makeApp();
    const res = await app.request('/api/events?limit=3', {
      headers: authHeaders(),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as unknown[];
    expect(body.length).toBe(3);
  });

  it('respects offset query param', async () => {
    const db = getDb();
    await insertEvent(db, { type: 'offset.event', payload: { n: 1 } });
    await insertEvent(db, { type: 'offset.event', payload: { n: 2 } });
    await insertEvent(db, { type: 'offset.event', payload: { n: 3 } });

    const app = makeApp();
    // Without offset: 3 results; with offset=1: 2 results
    const res = await app.request('/api/events?offset=1', {
      headers: authHeaders(),
    });

    expect(res.status).toBe(200);
    const body = await res.json() as unknown[];
    expect(body.length).toBe(2);
  });

  it('returns 401 without API key', async () => {
    const app = makeApp();
    const res = await app.request('/api/events');
    expect(res.status).toBe(401);
  });
});
