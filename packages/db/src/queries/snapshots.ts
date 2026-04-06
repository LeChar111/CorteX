import { eq, desc } from 'drizzle-orm';
import { snapshots } from '../schema.js';
import type { Database } from '../connection.js';

export type Snapshot = typeof snapshots.$inferSelect;

export async function createSnapshot(
  db: Database,
  data: { name: string; version?: string; metadata?: Record<string, unknown> },
): Promise<Snapshot> {
  const [row] = await db.insert(snapshots).values(data).returning();
  return row!;
}

export async function listSnapshots(db: Database): Promise<Snapshot[]> {
  return db.select().from(snapshots).orderBy(desc(snapshots.createdAt));
}

export async function deleteSnapshot(db: Database, id: string): Promise<boolean> {
  const result = await db.delete(snapshots).where(eq(snapshots.id, id)).returning();
  return result.length > 0;
}
