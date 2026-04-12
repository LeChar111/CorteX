import { Worker } from 'bullmq';
interface DiffJobData {
    projectId: string;
    repoId: string;
    branch: string;
}
export declare function createDiffWorker(redisUrl: string): Worker<DiffJobData, any, string>;
export {};
//# sourceMappingURL=diff-worker.d.ts.map