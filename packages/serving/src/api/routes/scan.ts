import { Hono } from 'hono';
import { z } from 'zod';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { getDb, listScanJobs, getScanJob, createScanJob, updateScanJob, deleteScanJob, getRepoById } from '@cortex/db';

let scanQueue: Queue | null = null;

function getQueue(): Queue {
  if (!scanQueue) {
    const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
    const connection = new Redis.default(redisUrl, { maxRetriesPerRequest: null });
    scanQueue = new Queue('cortex-scan', { connection });
  }
  return scanQueue;
}

const ScanRequestSchema = z.object({
  projectId: z.string().uuid(),
  repoId: z.string().uuid(),
  branch: z.string().optional(),
  mode: z.enum(['full', 'diff']).default('full'),
});

export const scanRouter = new Hono();

// POST /scan — create scan job in DB, enqueue to BullMQ, return 202
scanRouter.post('/scan', async (c) => {
  const body = await c.req.json();
  const parsed = ScanRequestSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
  }

  const { projectId, repoId, mode } = parsed.data;

  // Resolve branch: use provided value, or fall back to repo's defaultBranch
  const db = getDb();
  let branch = parsed.data.branch;
  if (!branch) {
    const repo = await getRepoById(db, repoId);
    branch = repo?.defaultBranch || 'main';
  }
  const scanJob = await createScanJob(db, { projectId, repoId, branch, mode });

  // Enqueue to BullMQ
  const queue = getQueue();
  await queue.add('scan', {
    scanJobId: scanJob.id,
    projectId,
    repoId,
    branch,
    mode,
  });

  return c.json(
    {
      jobId: scanJob.id,
      status: 'queued',
      projectId,
      repoId,
      branch,
      mode,
    },
    202,
  );
});

// GET /scan/status — list recent scan jobs (optionally filtered by projectId)
scanRouter.get('/scan/status', async (c) => {
  const projectId = c.req.query('projectId');
  const db = getDb();
  const jobs = await listScanJobs(db, projectId);
  return c.json(jobs);
});

// POST /scan/resume — resume all paused scans
scanRouter.post('/scan/resume', async (c) => {
  const db = getDb();
  const allJobs = await listScanJobs(db);
  const paused = allJobs.filter((j) => j.status === 'paused');

  if (paused.length === 0) {
    return c.json({ resumed: 0, message: 'No paused scans' });
  }

  const queue = getQueue();
  const resumed: string[] = [];

  for (const job of paused) {
    // Create a new scan job to replace the paused one
    const newJob = await createScanJob(db, {
      projectId: job.projectId,
      repoId: job.repoId,
      branch: job.branch,
      mode: job.mode as 'full' | 'diff',
    });

    await queue.add('scan', {
      scanJobId: newJob.id,
      projectId: job.projectId,
      repoId: job.repoId,
      branch: job.branch,
      mode: job.mode,
    });

    // Mark old paused job as superseded
    await updateScanJob(db, job.id, {
      status: 'failed' as any,
      error: `Superseded by resumed scan ${newJob.id}`,
    });

    resumed.push(newJob.id);
  }

  return c.json({ resumed: resumed.length, jobIds: resumed });
});

// PUT /scan/:jobId/pause — pause a running/queued scan
scanRouter.put('/scan/:jobId/pause', async (c) => {
  const db = getDb();
  const job = await getScanJob(db, c.req.param('jobId'));
  if (!job) return c.json({ error: 'Scan job not found' }, 404);
  if (job.status !== 'running' && job.status !== 'queued') {
    return c.json({ error: `Cannot pause a ${job.status} scan` }, 400);
  }
  await updateScanJob(db, job.id, { status: 'paused' as any, error: 'Paused by user' });
  return c.json({ status: 'paused', jobId: job.id });
});

// PUT /scan/:jobId/resume — resume a paused scan
scanRouter.put('/scan/:jobId/resume', async (c) => {
  const db = getDb();
  const job = await getScanJob(db, c.req.param('jobId'));
  if (!job) return c.json({ error: 'Scan job not found' }, 404);
  if (job.status !== 'paused') {
    return c.json({ error: `Cannot resume a ${job.status} scan` }, 400);
  }
  const newJob = await createScanJob(db, {
    projectId: job.projectId,
    repoId: job.repoId,
    branch: job.branch,
    mode: job.mode as 'full' | 'diff',
  });
  const queue = getQueue();
  await queue.add('scan', {
    scanJobId: newJob.id,
    projectId: job.projectId,
    repoId: job.repoId,
    branch: job.branch,
    mode: job.mode,
  });
  await updateScanJob(db, job.id, { status: 'failed' as any, error: `Superseded by ${newJob.id}` });
  return c.json({ status: 'queued', jobId: newJob.id });
});

// DELETE /scan/:jobId — delete a scan job
scanRouter.delete('/scan/:jobId', async (c) => {
  const db = getDb();
  const job = await getScanJob(db, c.req.param('jobId'));
  if (!job) return c.json({ error: 'Scan job not found' }, 404);
  await deleteScanJob(db, job.id);
  return new Response(null, { status: 204 });
});

// GET /scan/queue — detailed queue view with all jobs grouped by status
scanRouter.get('/scan/queue', async (c) => {
  const db = getDb();
  const allJobs = await listScanJobs(db);

  // Detect and auto-clean stale "running" jobs:
  // 1. If a newer job for the same repo+branch has a terminal status, the old running one is a zombie
  // 2. If a job has been "running" for more than 6 hours, it's likely stale
  const STALE_THRESHOLD_MS = 6 * 60 * 60 * 1000; // 6 hours
  const now = Date.now();
  const staleJobIds = new Set<string>();

  const runningJobs = allJobs.filter((j) => j.status === 'running');
  for (const job of runningJobs) {
    // Check if a newer terminal job exists for the same repo+branch
    const hasNewerTerminal = allJobs.some(
      (other) =>
        other.id !== job.id &&
        other.repoId === job.repoId &&
        other.branch === job.branch &&
        (other.status === 'completed' || other.status === 'failed') &&
        new Date(other.createdAt).getTime() > new Date(job.createdAt).getTime(),
    );
    // Check if running for too long
    const startTime = job.startedAt ? new Date(job.startedAt).getTime() : new Date(job.createdAt).getTime();
    const isStale = now - startTime > STALE_THRESHOLD_MS;

    if (hasNewerTerminal || isStale) {
      staleJobIds.add(job.id);
      // Auto-mark as failed in the database
      await updateScanJob(db, job.id, {
        status: 'failed' as any,
        error: hasNewerTerminal ? 'Superseded by a newer scan' : 'Stale: exceeded maximum running time',
        completedAt: new Date(),
      });
    }
  }

  // Re-filter after cleanup
  const cleanJobs = staleJobIds.size > 0
    ? allJobs.map((j) => staleJobIds.has(j.id) ? { ...j, status: 'failed', error: 'Superseded by a newer scan' } : j)
    : allJobs;

  const running = cleanJobs.filter((j) => j.status === 'running');
  const queued = cleanJobs.filter((j) => j.status === 'queued');
  const paused = cleanJobs.filter((j) => j.status === 'paused');
  const failed = cleanJobs.filter((j) => j.status === 'failed' && !j.error?.includes('Superseded'));
  const completed = cleanJobs.filter((j) => j.status === 'completed');

  return c.json({ running, queued, paused, failed, completed });
});

// POST /scan/batch/retry — retry multiple failed jobs
scanRouter.post('/scan/batch/retry', async (c) => {
  const { jobIds } = z.object({ jobIds: z.array(z.string().uuid()) }).parse(await c.req.json());
  const db = getDb();
  const queue = getQueue();
  const retried: string[] = [];

  for (const jobId of jobIds) {
    const job = await getScanJob(db, jobId);
    if (!job || (job.status !== 'failed' && job.status !== 'paused')) continue;

    const newJob = await createScanJob(db, {
      projectId: job.projectId,
      repoId: job.repoId,
      branch: job.branch,
      mode: job.mode as 'full' | 'diff',
    });
    await queue.add('scan', {
      scanJobId: newJob.id,
      projectId: job.projectId,
      repoId: job.repoId,
      branch: job.branch,
      mode: job.mode,
    });
    retried.push(newJob.id);
  }

  return c.json({ retried: retried.length, jobIds: retried });
});

// PUT /scan/batch/pause — pause multiple jobs
scanRouter.put('/scan/batch/pause', async (c) => {
  const { jobIds } = z.object({ jobIds: z.array(z.string().uuid()) }).parse(await c.req.json());
  const db = getDb();
  const paused: string[] = [];

  for (const jobId of jobIds) {
    const job = await getScanJob(db, jobId);
    if (!job || (job.status !== 'running' && job.status !== 'queued')) continue;
    await updateScanJob(db, jobId, { status: 'paused' as any, error: 'Paused by user' });
    paused.push(jobId);
  }

  return c.json({ paused: paused.length, jobIds: paused });
});

// POST /scan/batch/delete — delete multiple jobs
scanRouter.post('/scan/batch/delete', async (c) => {
  const { jobIds } = z.object({ jobIds: z.array(z.string().uuid()) }).parse(await c.req.json());
  const db = getDb();
  let deleted = 0;
  for (const jobId of jobIds) {
    await deleteScanJob(db, jobId);
    deleted++;
  }
  return c.json({ deleted });
});

// GET /scan/:jobId — get a specific scan job
scanRouter.get('/scan/:jobId', async (c) => {
  const { jobId } = c.req.param();
  const db = getDb();
  const job = await getScanJob(db, jobId);
  if (!job) {
    return c.json({ error: 'Scan job not found' }, 404);
  }
  return c.json(job);
});
