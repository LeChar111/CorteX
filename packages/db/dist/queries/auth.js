import { createHash } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { apiKeys } from '../schema.js';
export function hashApiKey(rawKey) {
    return createHash('sha256').update(rawKey).digest('hex');
}
export async function createApiKey(db, data) {
    const keyHash = hashApiKey(data.rawKey);
    const [row] = await db
        .insert(apiKeys)
        .values({ userId: data.userId, label: data.label, keyHash })
        .returning();
    return row;
}
export async function verifyApiKey(db, rawKey) {
    const keyHash = hashApiKey(rawKey);
    const [row] = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.keyHash, keyHash));
    if (!row)
        return null;
    // Update lastUsedAt
    await db
        .update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, row.id));
    return row;
}
export async function deleteApiKey(db, id) {
    const result = await db.delete(apiKeys).where(eq(apiKeys.id, id)).returning();
    return result.length > 0;
}
//# sourceMappingURL=auth.js.map