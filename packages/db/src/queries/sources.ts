import { eq, sql } from 'drizzle-orm';
import { sources } from '../schema.js';
import type { Database } from '../connection.js';

export type NewSource = typeof sources.$inferInsert;
export type Source = typeof sources.$inferSelect;

export async function upsertSource(
  db: Database,
  data: Pick<NewSource, 'repoId' | 'branch' | 'filePath' | 'fileHash' | 'language' | 'lastScannedAt' | 'metadata'>,
): Promise<Source> {
  const [row] = await db
    .insert(sources)
    .values(data)
    .onConflictDoUpdate({
      target: [sources.repoId, sources.branch, sources.filePath],
      set: {
        fileHash: sql`excluded.file_hash`,
        language: sql`excluded.language`,
        lastScannedAt: sql`excluded.last_scanned_at`,
        metadata: sql`excluded.metadata`,
      },
    })
    .returning();
  return row!;
}

export async function getSourceByPath(
  db: Database,
  repoId: string,
  branch: string,
  filePath: string,
): Promise<Source | null> {
  const { and } = await import('drizzle-orm');
  const [row] = await db
    .select()
    .from(sources)
    .where(
      and(
        eq(sources.repoId, repoId),
        eq(sources.branch, branch),
        eq(sources.filePath, filePath),
      ),
    );
  return row ?? null;
}

export async function listSourcesByRepo(
  db: Database,
  repoId: string,
  branch?: string,
): Promise<Source[]> {
  const { and } = await import('drizzle-orm');
  if (branch) {
    return db
      .select()
      .from(sources)
      .where(and(eq(sources.repoId, repoId), eq(sources.branch, branch)));
  }
  return db.select().from(sources).where(eq(sources.repoId, repoId));
}

export async function deleteSourcesByRepo(
  db: Database,
  repoId: string,
): Promise<number> {
  const result = await db.delete(sources).where(eq(sources.repoId, repoId)).returning();
  return result.length;
}
