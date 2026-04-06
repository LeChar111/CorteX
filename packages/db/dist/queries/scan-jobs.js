import { eq, desc } from 'drizzle-orm';
import { scanJobs } from '../schema.js';
export async function createScanJob(db, data) {
    const [row] = await db
        .insert(scanJobs)
        .values({ ...data, status: 'queued' })
        .returning();
    return row;
}
export async function getScanJob(db, id) {
    const [row] = await db.select().from(scanJobs).where(eq(scanJobs.id, id));
    return row ?? null;
}
export async function updateScanJob(db, id, data) {
    const [row] = await db
        .update(scanJobs)
        .set(data)
        .where(eq(scanJobs.id, id))
        .returning();
    return row ?? null;
}
export async function deleteScanJob(db, id) {
    await db.delete(scanJobs).where(eq(scanJobs.id, id));
}
export async function listScanJobs(db, projectId) {
    if (projectId) {
        return db.select().from(scanJobs).where(eq(scanJobs.projectId, projectId)).orderBy(desc(scanJobs.createdAt));
    }
    return db.select().from(scanJobs).orderBy(desc(scanJobs.createdAt));
}
//# sourceMappingURL=scan-jobs.js.map