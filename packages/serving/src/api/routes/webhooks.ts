import { Hono } from 'hono';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { getDb, listProjects, listReposByProject, createScanJob, insertEvent } from '@cortex/db';

export const webhookRoutes = new Hono();

let scanQueue: Queue | null = null;
function getQueue(): Queue {
  if (!scanQueue) {
    const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
    const connection = new Redis.default(redisUrl, { maxRetriesPerRequest: null });
    scanQueue = new Queue('cortex-scan', { connection });
  }
  return scanQueue;
}

// POST /webhooks/github -- GitHub push event
webhookRoutes.post('/github', async (c) => {
  const payload = await c.req.json();
  const repoFullName = payload.repository?.full_name ?? '';
  const branch = (payload.ref ?? '').replace('refs/heads/', '');
  const commitSha = payload.after ?? '';

  if (!branch || !repoFullName) {
    return c.json({ error: 'Invalid payload' }, 400);
  }

  const db = getDb();
  // Try to find matching repo by name
  const allProjects = await listProjects(db);
  let matchedRepo = null;
  let matchedProjectId = '';

  for (const project of allProjects) {
    const repos = await listReposByProject(db, project.id);
    const match = repos.find((r) =>
      r.cloneUrl?.includes(repoFullName) || r.name === repoFullName.split('/').pop(),
    );
    if (match) {
      matchedRepo = match;
      matchedProjectId = project.id;
      break;
    }
  }

  if (!matchedRepo) {
    return c.json({ message: 'No matching repo found', repoFullName }, 200);
  }

  const scanJob = await createScanJob(db, {
    projectId: matchedProjectId,
    repoId: matchedRepo.id,
    branch,
    mode: 'diff',
  });

  const queue = getQueue();
  await queue.add('scan', {
    scanJobId: scanJob.id,
    projectId: matchedProjectId,
    repoId: matchedRepo.id,
    branch,
    mode: 'diff',
  });

  await insertEvent(db, {
    type: 'webhook.received',
    projectId: matchedProjectId,
    repoId: matchedRepo.id,
    userId: null,
    payload: { provider: 'github', branch, commit: commitSha },
  });

  return c.json({ status: 'scan_triggered', jobId: scanJob.id, repo: matchedRepo.name, branch });
});

// POST /webhooks/bitbucket -- Bitbucket push event
webhookRoutes.post('/bitbucket', async (c) => {
  const payload = await c.req.json();
  const repoSlug = payload.repository?.slug ?? '';
  const changes = payload.push?.changes ?? [];
  const branch = changes[0]?.new?.name ?? '';

  if (!branch || !repoSlug) {
    return c.json({ error: 'Invalid payload' }, 400);
  }

  const db = getDb();
  const allProjects = await listProjects(db);
  let matchedRepo = null;
  let matchedProjectId = '';

  for (const project of allProjects) {
    const repos = await listReposByProject(db, project.id);
    const match = repos.find((r) => r.slug === repoSlug || r.name === repoSlug);
    if (match) {
      matchedRepo = match;
      matchedProjectId = project.id;
      break;
    }
  }

  if (!matchedRepo) {
    return c.json({ message: 'No matching repo found', repoSlug }, 200);
  }

  const scanJob = await createScanJob(db, {
    projectId: matchedProjectId,
    repoId: matchedRepo.id,
    branch,
    mode: 'diff',
  });

  const queue = getQueue();
  await queue.add('scan', {
    scanJobId: scanJob.id,
    projectId: matchedProjectId,
    repoId: matchedRepo.id,
    branch,
    mode: 'diff',
  });

  await insertEvent(db, {
    type: 'webhook.received',
    projectId: matchedProjectId,
    repoId: matchedRepo.id,
    userId: null,
    payload: { provider: 'bitbucket', branch },
  });

  return c.json({ status: 'scan_triggered', jobId: scanJob.id, repo: matchedRepo.name, branch });
});
