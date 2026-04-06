import { snapshots } from '../schema.js';
import type { Database } from '../connection.js';
export type Snapshot = typeof snapshots.$inferSelect;
export declare function createSnapshot(db: Database, data: {
    name: string;
    version?: string;
    metadata?: Record<string, unknown>;
}): Promise<Snapshot>;
export declare function listSnapshots(db: Database): Promise<Snapshot[]>;
export declare function deleteSnapshot(db: Database, id: string): Promise<boolean>;
//# sourceMappingURL=snapshots.d.ts.map