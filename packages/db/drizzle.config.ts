import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Load .env from repo root (drizzle-kit bundles this as CJS — no import.meta)
// pnpm runs scripts from the package dir, so cwd = packages/db
const envPaths = [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../../.env')];
for (const p of envPaths) {
  if (existsSync(p)) { config({ path: p }); break; }
}

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
