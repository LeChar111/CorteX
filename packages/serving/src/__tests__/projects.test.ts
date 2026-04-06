import 'dotenv/config';
import { describe, it, expect, beforeEach } from 'vitest';
import { getPool } from '@cortex/db';
import { createApp } from '../api/app.js';

const TEST_KEY = 'test-projects-key';

async function truncateProjects() {
  const pool = getPool();
  await pool.query('TRUNCATE TABLE projects CASCADE');
}

function makeApp() {
  return createApp({ apiKeys: [TEST_KEY] });
}

function authHeaders() {
  return { 'X-API-Key': TEST_KEY, 'Content-Type': 'application/json' };
}

describe('Projects routes', () => {
  beforeEach(async () => {
    await truncateProjects();
  });

  it('POST /api/projects creates a project', async () => {
    const app = makeApp();
    const res = await app.request('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: 'Test Project', description: 'A test' }),
    });

    expect(res.status).toBe(201);
    const body = await res.json() as { id: string; name: string };
    expect(body.name).toBe('Test Project');
    expect(body.id).toBeTruthy();
  });

  it('GET /api/projects lists projects', async () => {
    const app = makeApp();

    // Create one first
    await app.request('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: 'Listed Project' }),
    });

    const res = await app.request('/api/projects', {
      headers: { 'X-API-Key': TEST_KEY },
    });

    expect(res.status).toBe(200);
    const body = await res.json() as unknown[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/projects/:id returns 404 for unknown id', async () => {
    const app = makeApp();
    const res = await app.request('/api/projects/00000000-0000-0000-0000-000000000000', {
      headers: { 'X-API-Key': TEST_KEY },
    });
    expect(res.status).toBe(404);
  });

  it('POST /api/projects returns 409 for duplicate name', async () => {
    const app = makeApp();

    await app.request('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: 'Duplicate Project' }),
    });

    const res = await app.request('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: 'Duplicate Project' }),
    });

    expect(res.status).toBe(409);
  });

  it('POST /api/projects returns 400 for missing name', async () => {
    const app = makeApp();
    const res = await app.request('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ description: 'No name here' }),
    });
    expect(res.status).toBe(400);
  });

  it('POST /api/projects returns 400 for empty name', async () => {
    const app = makeApp();
    const res = await app.request('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: '' }),
    });
    expect(res.status).toBe(400);
  });

  it('GET /api/projects/:id returns the project', async () => {
    const app = makeApp();

    const createRes = await app.request('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: 'Get By ID' }),
    });
    const created = await createRes.json() as { id: string; name: string };

    const res = await app.request(`/api/projects/${created.id}`, {
      headers: { 'X-API-Key': TEST_KEY },
    });
    expect(res.status).toBe(200);
    const body = await res.json() as { id: string; name: string };
    expect(body.id).toBe(created.id);
    expect(body.name).toBe('Get By ID');
  });

  it('DELETE /api/projects/:id returns 204', async () => {
    const app = makeApp();

    const createRes = await app.request('/api/projects', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name: 'To Delete' }),
    });
    const created = await createRes.json() as { id: string };

    const res = await app.request(`/api/projects/${created.id}`, {
      method: 'DELETE',
      headers: { 'X-API-Key': TEST_KEY },
    });
    expect(res.status).toBe(204);
  });
});
