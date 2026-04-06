import { projects } from '../schema.js';
import type { Database } from '../connection.js';
export type NewProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;
export declare function createProject(db: Database, data: Pick<NewProject, 'name' | 'description' | 'metadata'>): Promise<Project>;
export declare function getProjectById(db: Database, id: string): Promise<Project | null>;
export declare function getProjectByName(db: Database, name: string): Promise<Project | null>;
export declare function listProjects(db: Database): Promise<Project[]>;
export declare function updateProject(db: Database, id: string, data: Partial<Pick<NewProject, 'name' | 'description' | 'metadata'>>): Promise<Project | null>;
export declare function deleteProject(db: Database, id: string): Promise<boolean>;
//# sourceMappingURL=projects.d.ts.map