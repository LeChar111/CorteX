import { eq, desc } from 'drizzle-orm';
import { scanJobs } from '../schema.js';
import type { Database } from '../connection.js';

export type NewScanJob = typeof scanJobs.$inferInsert;
export type ScanJob = typeof scanJobs.$inferSelect;

export async function createScanJob(
  db: Database,
  data: Pick<NewScanJob, 'projectId' | 'repoId' | 'branch' | 'mode'>,
): Promise<ScanJob> {
  const [row] = await db
    .insert(scanJobs)
    .values({ ...data, status: 'queued' })
    .returning();
  return row!;
}

export async function getScanJob(
  db: Database,
  id: string,
): Promise<ScanJob | null> {
  const [row] = await db.select().from(scanJobs).where(eq(scanJobs.id, id));
  return row ?? null;
}

export async function updateScanJob(
  db: Database,
  id: string,
  data: Partial<Pick<NewScanJob, 'status' | 'startedAt' | 'completedAt' | 'stats' | 'error'>>,
): Promise<ScanJob | null> {
  const [row] = await db
    .update(scanJobs)
    .set(data)
    .where(eq(scanJobs.id, id))
    .returning();
  return row ?? null;
}

export async function deleteScanJob(
  db: Database,
  id: string,
): Promise<void> {
  await db.delete(scanJobs).where(eq(scanJobs.id, id));
}

export async function listScanJobs(
  db: Database,
  projectId?: string,
): Promise<ScanJob[]> {
  if (projectId) {
    return db.select().from(scanJobs).where(eq(scanJobs.projectId, projectId)).orderBy(desc(scanJobs.createdAt));
  }
  return db.select().from(scanJobs).orderBy(desc(scanJobs.createdAt));
}
