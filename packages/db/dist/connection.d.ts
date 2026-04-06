import pg from 'pg';
import * as schema from './schema.js';
export declare function getPool(): pg.Pool;
export declare function getDb(): import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: import("pg").Pool;
};
export type Database = ReturnType<typeof getDb>;
export declare function runMigrations(): Promise<void>;
export declare function closePool(): Promise<void>;
//# sourceMappingURL=connection.d.ts.map