import { eq, and, desc } from 'drizzle-orm';
import { events } from '../schema.js';
export async function insertEvent(db, data) {
    const [row] = await db.insert(events).values(data).returning();
    return row;
}
export async function listEvents(db, options = {}) {
    const { projectId, type, limit = 50, offset = 0 } = options;
    const conditions = [];
    if (projectId)
        conditions.push(eq(events.projectId, projectId));
    if (type)
        conditions.push(eq(events.type, type));
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
//# sourceMappingURL=events.js.map