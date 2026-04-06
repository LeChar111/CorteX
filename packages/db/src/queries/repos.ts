import { eq, and } from 'drizzle-orm';
import { repos } from '../schema.js';
import type { Database } from '../connection.js';

export type NewRepo = typeof repos.$inferInsert;
export type Repo = typeof repos.$inferSelect;

export async function createRepo(
  db: Database,
  data: Pick<NewRepo, 'projectId' | 'name' | 'slug' | 'cloneUrl' | 'provider' | 'techStack' | 'defaultBranch' | 'trackedBranches' | 'metadata'>,
): Promise<Repo> {
  const [row] = await db.insert(repos).values(data).returning();
  return row!;
}

export async function getRepoById(
  db: Database,
  id: string,
): Promise<Repo | null> {
  const [row] = await db.select().from(repos).where(eq(repos.id, id));
  return row ?? null;
}

export async function getRepoBySlug(
  db: Database,
  projectId: string,
  slug: string,
): Promise<Repo | null> {
  const [row] = await db
    .select()
    .from(repos)
    .where(and(eq(repos.projectId, projectId), eq(repos.slug, slug)));
  return row ?? null;
}

export async function listReposByProject(
  db: Database,
  projectId: string,
): Promise<Repo[]> {
  return db.select().from(repos).where(eq(repos.projectId, projectId));
}

export async function updateRepo(
  db: Database,
  id: string,
  data: Partial<Pick<NewRepo, 'name' | 'slug' | 'cloneUrl' | 'provider' | 'techStack' | 'defaultBranch' | 'trackedBranches' | 'lastScannedAt' | 'lastScannedCommit' | 'metadata'>>,
): Promise<Repo | null> {
  const [row] = await db
    .update(repos)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(repos.id, id))
    .returning();
  return row ?? null;
}

export async function deleteRepo(
  db: Database,
  id: string,
): Promise<boolean> {
  const result = await db.delete(repos).where(eq(repos.id, id)).returning();
  return result.length > 0;
}
