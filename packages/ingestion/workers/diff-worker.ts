import { Worker, type Job } from 'bullmq';
import { Redis as IORedis } from 'ioredis';

// TODO: Rewrite diff-worker to use graphify bridge (same as scan pipeline).
// The old implementation used tree-sitter + LLM extraction + LightRAG which
// have been removed in favour of the graphify Python bridge.

interface DiffJobData {
  projectId: string;
  repoId: string;
  branch: string;
}

export function createDiffWorker(redisUrl: string) {
  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

  const worker = new Worker<DiffJobData>(
    'cortex-diff',
    async (job: Job<DiffJobData>) => {
      // TODO: Implement diff-mode scanning via graphify bridge.
      // For now, log a warning and skip — full scans still work via cortex-scan.
      console.warn(
        `[diff-worker] Diff scanning not yet implemented with graphify. ` +
        `Job ${job.id} for repo ${job.data.repoId} skipped. Use a full scan instead.`,
      );
      return { changed: 0, skipped: true, reason: 'diff-worker pending graphify migration' };
    },
    {
      connection,
      concurrency: 2,
      removeOnComplete: { count: 50 },
      removeOnFail: { count: 20 },
    },
  );

  worker.on('completed', (job) => {
    console.log(`Diff scan completed: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Diff scan failed: ${job?.id}`, err.message);
  });

  return worker;
}
