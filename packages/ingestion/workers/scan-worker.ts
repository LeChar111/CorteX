import { Worker, type Job } from 'bullmq';
import IORedis from 'ioredis';
import { getDb, getRepoById, getProjectById, updateScanJob, createScanJob } from '@cortex/db';
import { cloneOrPullCached, buildAuthenticatedUrl } from '../src/source-loader.js';
import { scanRepo } from '../src/pipeline.js';
import { existsSync } from 'node:fs';

export interface ScanJobData {
  scanJobId?: string;
  projectId: string;
  repoId: string;
  branch: string;
  mode: 'full' | 'diff';
  scheduled?: boolean;
}

export function createScanWorker(redisUrl: string, lightragUrl: string) {
  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

  const worker = new Worker<ScanJobData>(
    'cortex-scan',
    async (job: Job<ScanJobData>) => {
      const { projectId, repoId, branch } = job.data;

      const db = getDb();

      // For scheduled-scan jobs, create a scan job record in DB first
      let scanJobId = job.data.scanJobId;
      if (!scanJobId) {
        const scanJob = await createScanJob(db, {
          projectId,
          repoId,
          branch,
          mode: job.data.mode ?? 'full',
        });
        scanJobId = scanJob.id;
      }

      // Mark scan job as running
      await updateScanJob(db, scanJobId, {
        status: 'running',
        startedAt: new Date(),
      });

      try {
        // Get project and repo from DB
        const project = await getProjectById(db, projectId);
        if (!project) {
          throw new Error(`Project not found: ${projectId}`);
        }

        const repo = await getRepoById(db, repoId);
        if (!repo) {
          throw new Error(`Repo not found: ${repoId}`);
        }

        // Determine source path based on provider
        let sourcePath: string;

        if (repo.provider === 'local') {
          // Local provider — use cloneUrl as filesystem path directly
          sourcePath = repo.cloneUrl;
          if (!existsSync(sourcePath)) {
            throw new Error(`Local repo path does not exist: ${sourcePath}`);
          }
        } else {
          // Remote provider — clone/pull to a cached directory
          const authenticatedUrl = await buildAuthenticatedUrl(repo.cloneUrl, repo.provider);
          sourcePath = await cloneOrPullCached(authenticatedUrl, repo.slug, branch);
        }

        // Run the full scan pipeline
        const result = await scanRepo({
          projectId,
          projectName: project.name,
          repoId,
          repoName: repo.name,
          branch,
          sourcePath,
          techStack: Array.isArray(repo.techStack) ? (repo.techStack as string[]) : [],
          scanJobId,
          lightragUrl,
          ...(job.data.mode === 'diff' && repo.lastScannedCommit
            ? { lastScannedCommit: repo.lastScannedCommit }
            : {}),
        });

        // Mark completed
        await updateScanJob(db, scanJobId, {
          status: 'completed',
          completedAt: new Date(),
          stats: result as Record<string, unknown>,
        });

        return result;
      } catch (err) {
        // Mark failed
        await updateScanJob(db, scanJobId, {
          status: 'failed',
          completedAt: new Date(),
          error: err instanceof Error ? err.message : String(err),
        });
        throw err;
      }
    },
    { connection, concurrency: 1 },
  );

  worker.on('completed', (job) => {
    console.log(`Scan completed: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Scan failed: ${job?.id}`, err.message);
  });

  return worker;
}
