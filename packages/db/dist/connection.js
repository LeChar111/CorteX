import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import * as schema from './schema.js';
let pool = null;
export function getPool() {
    if (!pool) {
        pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 5000,
        });
        // Prevent process crash on connection errors (e.g. postgres restart)
        pool.on('error', (err) => {
            console.error('[db] Pool error (will reconnect):', err.message);
        });
    }
    return pool;
}
export function getDb() {
    return drizzle(getPool(), { schema });
}
export async function runMigrations() {
    const db = getDb();
    const migrationsFolder = resolve(dirname(fileURLToPath(import.meta.url)), '../drizzle');
    await migrate(db, { migrationsFolder });
}
export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
//# sourceMappingURL=connection.js.map