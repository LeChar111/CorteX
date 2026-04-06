import { eq } from 'drizzle-orm';
import { archRules } from '../schema.js';
export async function createArchRule(db, data) {
    const [row] = await db.insert(archRules).values(data).returning();
    return row;
}
export async function listArchRules(db, projectId) {
    if (projectId)
        return db.select().from(archRules).where(eq(archRules.projectId, projectId));
    return db.select().from(archRules);
}
export async function deleteArchRule(db, id) {
    const result = await db.delete(archRules).where(eq(archRules.id, id)).returning();
    return result.length > 0;
}
//# sourceMappingURL=arch-rules.js.map