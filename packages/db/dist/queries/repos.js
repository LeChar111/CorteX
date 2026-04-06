import { eq, and } from 'drizzle-orm';
import { repos } from '../schema.js';
export async function createRepo(db, data) {
    const [row] = await db.insert(repos).values(data).returning();
    return row;
}
export async function getRepoById(db, id) {
    const [row] = await db.select().from(repos).where(eq(repos.id, id));
    return row ?? null;
}
export async function getRepoBySlug(db, projectId, slug) {
    const [row] = await db
        .select()
        .from(repos)
        .where(and(eq(repos.projectId, projectId), eq(repos.slug, slug)));
    return row ?? null;
}
export async function listReposByProject(db, projectId) {
    return db.select().from(repos).where(eq(repos.projectId, projectId));
}
export async function updateRepo(db, id, data) {
    const [row] = await db
        .update(repos)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(repos.id, id))
        .returning();
    return row ?? null;
}
export async function deleteRepo(db, id) {
    const result = await db.delete(repos).where(eq(repos.id, id)).returning();
    return result.length > 0;
}
//# sourceMappingURL=repos.js.map