import { Queue } from 'bullmq';
import { Redis as IORedis } from 'ioredis';
import { getDb, listProjects, listReposByProject } from '@cortex/db';
export async function setupScheduledScans() {
    const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
    const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
    const queue = new Queue('cortex-scan', { connection });
    // Remove existing repeatable jobs to avoid duplicates
    const existing = await queue.getRepeatableJobs();
    for (const job of existing) {
        await queue.removeRepeatableByKey(job.key);
    }
    const db = getDb();
    const projects = await listProjects(db);
    for (const project of projects) {
        const repos = await listReposByProject(db, project.id);
        for (const repo of repos) {
            const schedule = repo.metadata?.scanSchedule;
            // Default: nightly full scan at 2 AM
            await queue.add('scheduled-scan', {
                projectId: project.id,
                repoId: repo.id,
                branch: repo.defaultBranch,
                mode: 'full',
                scheduled: true,
            }, {
                repeat: { pattern: schedule ?? '0 2 * * *' },
                jobId: `scheduled-${repo.id}-full`,
            });
        }
    }
    console.log(`[cron] Scheduled scans configured for ${projects.length} projects`);
}
//# sourceMappingURL=cron.js.map