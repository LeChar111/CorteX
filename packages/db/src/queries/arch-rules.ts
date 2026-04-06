import { eq } from 'drizzle-orm';
import { archRules } from '../schema.js';
import type { Database } from '../connection.js';

export type ArchRule = typeof archRules.$inferSelect;

export async function createArchRule(db: Database, data: { projectId?: string; name: string; rule: Record<string, unknown>; severity?: string; description?: string }): Promise<ArchRule> {
  const [row] = await db.insert(archRules).values(data).returning();
  return row!;
}

export async function listArchRules(db: Database, projectId?: string): Promise<ArchRule[]> {
  if (projectId) return db.select().from(archRules).where(eq(archRules.projectId, projectId));
  return db.select().from(archRules);
}

export async function deleteArchRule(db: Database, id: string): Promise<boolean> {
  const result = await db.delete(archRules).where(eq(archRules.id, id)).returning();
  return result.length > 0;
}
