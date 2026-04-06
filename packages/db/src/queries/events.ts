import { eq, and, desc } from 'drizzle-orm';
import { events } from '../schema.js';
import type { Database } from '../connection.js';

export type NewEvent = typeof events.$inferInsert;
export type Event = typeof events.$inferSelect;

export async function insertEvent(
  db: Database,
  data: Pick<NewEvent, 'type' | 'projectId' | 'repoId' | 'userId' | 'payload'>,
): Promise<Event> {
  const [row] = await db.insert(events).values(data).returning();
  return row!;
}

export interface ListEventsOptions {
  projectId?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export async function listEvents(
  db: Database,
  options: ListEventsOptions = {},
): Promise<Event[]> {
  const { projectId, type, limit = 50, offset = 0 } = options;

  const conditions = [];
  if (projectId) conditions.push(eq(events.projectId, projectId));
  if (type) conditions.push(eq(events.type, type));

  const query = db
    .select()
    .from(events)
    .orderBy(desc(events.createdAt))
    .limit(limit)
    .offset(offset);

  if (conditions.length > 0) {
    return query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
  }

  return query;
}
