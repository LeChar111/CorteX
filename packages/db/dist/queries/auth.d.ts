import { apiKeys } from '../schema.js';
import type { Database } from '../connection.js';
export type NewApiKey = typeof apiKeys.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export declare function hashApiKey(rawKey: string): string;
export declare function createApiKey(db: Database, data: Pick<NewApiKey, 'userId' | 'label'> & {
    rawKey: string;
}): Promise<ApiKey>;
export declare function verifyApiKey(db: Database, rawKey: string): Promise<ApiKey | null>;
export declare function deleteApiKey(db: Database, id: string): Promise<boolean>;
//# sourceMappingURL=auth.d.ts.map