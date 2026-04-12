import dotenv from 'dotenv';
import { resolve } from 'node:path';
dotenv.config({ path: resolve(import.meta.dirname, '../../../.env') });
import { createScanWorker } from './scan-worker.js';
import { createDiffWorker } from './diff-worker.js';
import { setupScheduledScans } from './cron.js';
const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
const scanWorker = createScanWorker(redisUrl);
const diffWorker = createDiffWorker(redisUrl);
console.log('Workers ready. Waiting for jobs...');
// Set up scheduled (cron) scans
setupScheduledScans().catch((err) => console.error('[cron] Failed to set up scheduled scans:', err));
for (const signal of ['SIGTERM', 'SIGINT']) {
    process.on(signal, async () => {
        await scanWorker.close();
        await diffWorker.close();
        process.exit(0);
    });
}
//# sourceMappingURL=index.js.map