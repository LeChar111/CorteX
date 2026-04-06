import { sources } from '../schema.js';
import type { Database } from '../connection.js';
export type NewSource = typeof sources.$inferInsert;
export type Source = typeof sources.$inferSelect;
export declare function upsertSource(db: Database, data: Pick<NewSource, 'repoId' | 'branch' | 'filePath' | 'fileHash' | 'language' | 'lastScannedAt' | 'metadata'>): Promise<Source>;
export declare function getSourceByPath(db: Database, repoId: string, branch: string, filePath: string): Promise<Source | null>;
export declare function listSourcesByRepo(db: Database, repoId: string, branch?: string): Promise<Source[]>;
export declare function deleteSourcesByRepo(db: Database, repoId: string): Promise<number>;
//# sourceMappingURL=sources.d.ts.map