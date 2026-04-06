import { projectLinks } from '../schema.js';
import type { Database } from '../connection.js';
export type ProjectLink = typeof projectLinks.$inferSelect;
export type NewProjectLink = typeof projectLinks.$inferInsert;
export declare function createProjectLink(db: Database, data: Pick<NewProjectLink, 'sourceProjectId' | 'targetProjectId' | 'linkType' | 'description' | 'metadata'>): Promise<ProjectLink>;
export declare function listProjectLinks(db: Database, projectId: string): Promise<ProjectLink[]>;
export declare function deleteProjectLink(db: Database, id: string): Promise<boolean>;
export declare function listAllProjectLinks(db: Database): Promise<ProjectLink[]>;
//# sourceMappingURL=project-links.d.ts.map