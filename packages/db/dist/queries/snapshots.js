import { eq, desc } from 'drizzle-orm';
import { snapshots } from '../schema.js';
export async function createSnapshot(db, data) {
    const [row] = await db.insert(snapshots).values(data).returning();
    return row;
}
export async function listSnapshots(db) {
    return db.select().from(snapshots).orderBy(desc(snapshots.createdAt));
}
export async function deleteSnapshot(db, id) {
    const result = await db.delete(snapshots).where(eq(snapshots.id, id)).returning();
    return result.length > 0;
}
//# sourceMappingURL=snapshots.js.map