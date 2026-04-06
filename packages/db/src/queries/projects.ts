import { eq } from 'drizzle-orm';
import { projects } from '../schema.js';
import type { Database } from '../connection.js';

export type NewProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export async function createProject(
  db: Database,
  data: Pick<NewProject, 'name' | 'description' | 'metadata'>,
): Promise<Project> {
  const [row] = await db.insert(projects).values(data).returning();
  return row!;
}

export async function getProjectById(
  db: Database,
  id: string,
): Promise<Project | null> {
  const [row] = await db.select().from(projects).where(eq(projects.id, id));
  return row ?? null;
}

export async function getProjectByName(
  db: Database,
  name: string,
): Promise<Project | null> {
  const [row] = await db.select().from(projects).where(eq(projects.name, name));
  return row ?? null;
}

export async function listProjects(db: Database): Promise<Project[]> {
  return db.select().from(projects);
}

export async function updateProject(
  db: Database,
  id: string,
  data: Partial<Pick<NewProject, 'name' | 'description' | 'metadata'>>,
): Promise<Project | null> {
  const [row] = await db
    .update(projects)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();
  return row ?? null;
}

export async function deleteProject(
  db: Database,
  id: string,
): Promise<boolean> {
  const result = await db.delete(projects).where(eq(projects.id, id)).returning();
  return result.length > 0;
}
