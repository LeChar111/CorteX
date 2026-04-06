import { archRules } from '../schema.js';
import type { Database } from '../connection.js';
export type ArchRule = typeof archRules.$inferSelect;
export declare function createArchRule(db: Database, data: {
    projectId?: string;
    name: string;
    rule: Record<string, unknown>;
    severity?: string;
    description?: string;
}): Promise<ArchRule>;
export declare function listArchRules(db: Database, projectId?: string): Promise<ArchRule[]>;
export declare function deleteArchRule(db: Database, id: string): Promise<boolean>;
//# sourceMappingURL=arch-rules.d.ts.map