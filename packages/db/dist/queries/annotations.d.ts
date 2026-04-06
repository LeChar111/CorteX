import { annotations } from '../schema.js';
import type { Database } from '../connection.js';
export type Annotation = typeof annotations.$inferSelect;
export declare function createAnnotation(db: Database, data: {
    entityName: string;
    projectId?: string;
    type: string;
    content: string;
    author?: string;
}): Promise<Annotation>;
export declare function listAnnotationsByEntity(db: Database, entityName: string): Promise<Annotation[]>;
export declare function listAnnotationsByProject(db: Database, projectId: string): Promise<Annotation[]>;
export declare function updateAnnotation(db: Database, id: string, data: {
    content?: string;
    type?: string;
}): Promise<Annotation | null>;
export declare function deleteAnnotation(db: Database, id: string): Promise<boolean>;
//# sourceMappingURL=annotations.d.ts.map