import { eq, or } from 'drizzle-orm';
import { projectLinks } from '../schema.js';
export async function createProjectLink(db, data) {
    const [row] = await db.insert(projectLinks).values(data).returning();
    return row;
}
export async function listProjectLinks(db, projectId) {
    return db
        .select()
        .from(projectLinks)
        .where(or(eq(projectLinks.sourceProjectId, projectId), eq(projectLinks.targetProjectId, projectId)));
}
export async function deleteProjectLink(db, id) {
    const result = await db.delete(projectLinks).where(eq(projectLinks.id, id)).returning();
    return result.length > 0;
}
export async function listAllProjectLinks(db) {
    return db.select().from(projectLinks);
}
//# sourceMappingURL=project-links.js.map