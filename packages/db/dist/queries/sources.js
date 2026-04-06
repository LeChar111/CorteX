import { eq, sql } from 'drizzle-orm';
import { sources } from '../schema.js';
export async function upsertSource(db, data) {
    const [row] = await db
        .insert(sources)
        .values(data)
        .onConflictDoUpdate({
        target: [sources.repoId, sources.branch, sources.filePath],
        set: {
            fileHash: sql `excluded.file_hash`,
            language: sql `excluded.language`,
            lastScannedAt: sql `excluded.last_scanned_at`,
            metadata: sql `excluded.metadata`,
        },
    })
        .returning();
    return row;
}
export async function getSourceByPath(db, repoId, branch, filePath) {
    const { and } = await import('drizzle-orm');
    const [row] = await db
        .select()
        .from(sources)
        .where(and(eq(sources.repoId, repoId), eq(sources.branch, branch), eq(sources.filePath, filePath)));
    return row ?? null;
}
export async function listSourcesByRepo(db, repoId, branch) {
    const { and } = await import('drizzle-orm');
    if (branch) {
        return db
            .select()
            .from(sources)
            .where(and(eq(sources.repoId, repoId), eq(sources.branch, branch)));
    }
    return db.select().from(sources).where(eq(sources.repoId, repoId));
}
export async function deleteSourcesByRepo(db, repoId) {
    const result = await db.delete(sources).where(eq(sources.repoId, repoId)).returning();
    return result.length;
}
//# sourceMappingURL=sources.js.map