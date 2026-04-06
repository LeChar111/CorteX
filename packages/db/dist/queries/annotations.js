import { eq, desc } from 'drizzle-orm';
import { annotations } from '../schema.js';
export async function createAnnotation(db, data) {
    const [row] = await db.insert(annotations).values(data).returning();
    return row;
}
export async function listAnnotationsByEntity(db, entityName) {
    return db.select().from(annotations).where(eq(annotations.entityName, entityName)).orderBy(desc(annotations.createdAt));
}
export async function listAnnotationsByProject(db, projectId) {
    return db.select().from(annotations).where(eq(annotations.projectId, projectId)).orderBy(desc(annotations.createdAt));
}
export async function updateAnnotation(db, id, data) {
    const [row] = await db.update(annotations).set({ ...data, updatedAt: new Date() }).where(eq(annotations.id, id)).returning();
    return row ?? null;
}
export async function deleteAnnotation(db, id) {
    const result = await db.delete(annotations).where(eq(annotations.id, id)).returning();
    return result.length > 0;
}
//# sourceMappingURL=annotations.js.map