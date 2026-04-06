import { eq } from 'drizzle-orm';
import { projects } from '../schema.js';
export async function createProject(db, data) {
    const [row] = await db.insert(projects).values(data).returning();
    return row;
}
export async function getProjectById(db, id) {
    const [row] = await db.select().from(projects).where(eq(projects.id, id));
    return row ?? null;
}
export async function getProjectByName(db, name) {
    const [row] = await db.select().from(projects).where(eq(projects.name, name));
    return row ?? null;
}
export async function listProjects(db) {
    return db.select().from(projects);
}
export async function updateProject(db, id, data) {
    const [row] = await db
        .update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
    return row ?? null;
}
export async function deleteProject(db, id) {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
}
//# sourceMappingURL=projects.js.map