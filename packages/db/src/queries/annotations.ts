import { eq, desc } from 'drizzle-orm';
import { annotations } from '../schema.js';
import type { Database } from '../connection.js';

export type Annotation = typeof annotations.$inferSelect;

export async function createAnnotation(db: Database, data: { entityName: string; projectId?: string; type: string; content: string; author?: string }): Promise<Annotation> {
  const [row] = await db.insert(annotations).values(data).returning();
  return row!;
}

export async function listAnnotationsByEntity(db: Database, entityName: string): Promise<Annotation[]> {
  return db.select().from(annotations).where(eq(annotations.entityName, entityName)).orderBy(desc(annotations.createdAt));
}

export async function listAnnotationsByProject(db: Database, projectId: string): Promise<Annotation[]> {
  return db.select().from(annotations).where(eq(annotations.projectId, projectId)).orderBy(desc(annotations.createdAt));
}

export async function updateAnnotation(db: Database, id: string, data: { content?: string; type?: string }): Promise<Annotation | null> {
  const [row] = await db.update(annotations).set({ ...data, updatedAt: new Date() }).where(eq(annotations.id, id)).returning();
  return row ?? null;
}

export async function deleteAnnotation(db: Database, id: string): Promise<boolean> {
  const result = await db.delete(annotations).where(eq(annotations.id, id)).returning();
  return result.length > 0;
}
