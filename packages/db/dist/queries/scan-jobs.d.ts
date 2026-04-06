import { scanJobs } from '../schema.js';
import type { Database } from '../connection.js';
export type NewScanJob = typeof scanJobs.$inferInsert;
export type ScanJob = typeof scanJobs.$inferSelect;
export declare function createScanJob(db: Database, data: Pick<NewScanJob, 'projectId' | 'repoId' | 'branch' | 'mode'>): Promise<ScanJob>;
export declare function getScanJob(db: Database, id: string): Promise<ScanJob | null>;
export declare function updateScanJob(db: Database, id: string, data: Partial<Pick<NewScanJob, 'status' | 'startedAt' | 'completedAt' | 'stats' | 'error'>>): Promise<ScanJob | null>;
export declare function deleteScanJob(db: Database, id: string): Promise<void>;
export declare function listScanJobs(db: Database, projectId?: string): Promise<ScanJob[]>;
//# sourceMappingURL=scan-jobs.d.ts.map