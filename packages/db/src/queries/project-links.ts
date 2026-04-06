import { eq, or } from 'drizzle-orm';
import { projectLinks } from '../schema.js';
import type { Database } from '../connection.js';

export type ProjectLink = typeof projectLinks.$inferSelect;
export type NewProjectLink = typeof projectLinks.$inferInsert;

export async function createProjectLink(
  db: Database,
  data: Pick<NewProjectLink, 'sourceProjectId' | 'targetProjectId' | 'linkType' | 'description' | 'metadata'>,
): Promise<ProjectLink> {
  const [row] = await db.insert(projectLinks).values(data).returning();
  return row!;
}

export async function listProjectLinks(db: Database, projectId: string): Promise<ProjectLink[]> {
  return db
    .select()
    .from(projectLinks)
    .where(or(eq(projectLinks.sourceProjectId, projectId), eq(projectLinks.targetProjectId, projectId)));
}

export async function deleteProjectLink(db: Database, id: string): Promise<boolean> {
  const result = await db.delete(projectLinks).where(eq(projectLinks.id, id)).returning();
  return result.length > 0;
}

export async function listAllProjectLinks(db: Database): Promise<ProjectLink[]> {
  return db.select().from(projectLinks);
}
