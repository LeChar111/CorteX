import { Worker } from 'bullmq';
export interface ScanJobData {
    scanJobId?: string;
    projectId: string;
    repoId: string;
    branch: string;
    mode: 'full' | 'diff';
    scheduled?: boolean;
}
export declare function createScanWorker(redisUrl: string): Worker<ScanJobData, any, string>;
//# sourceMappingURL=scan-worker.d.ts.map