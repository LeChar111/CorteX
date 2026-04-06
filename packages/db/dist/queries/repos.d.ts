import { repos } from '../schema.js';
import type { Database } from '../connection.js';
export type NewRepo = typeof repos.$inferInsert;
export type Repo = typeof repos.$inferSelect;
export declare function createRepo(db: Database, data: Pick<NewRepo, 'projectId' | 'name' | 'slug' | 'cloneUrl' | 'provider' | 'techStack' | 'defaultBranch' | 'trackedBranches' | 'metadata'>): Promise<Repo>;
export declare function getRepoById(db: Database, id: string): Promise<Repo | null>;
export declare function getRepoBySlug(db: Database, projectId: string, slug: string): Promise<Repo | null>;
export declare function listReposByProject(db: Database, projectId: string): Promise<Repo[]>;
export declare function updateRepo(db: Database, id: string, data: Partial<Pick<NewRepo, 'name' | 'slug' | 'cloneUrl' | 'provider' | 'techStack' | 'defaultBranch' | 'trackedBranches' | 'lastScannedAt' | 'lastScannedCommit' | 'metadata'>>): Promise<Repo | null>;
export declare function deleteRepo(db: Database, id: string): Promise<boolean>;
//# sourceMappingURL=repos.d.ts.map