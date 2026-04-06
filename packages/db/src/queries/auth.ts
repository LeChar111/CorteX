import { createHash } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { apiKeys } from '../schema.js';
import type { Database } from '../connection.js';

export type NewApiKey = typeof apiKeys.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;

export function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex');
}

export async function createApiKey(
  db: Database,
  data: Pick<NewApiKey, 'userId' | 'label'> & { rawKey: string },
): Promise<ApiKey> {
  const keyHash = hashApiKey(data.rawKey);
  const [row] = await db
    .insert(apiKeys)
    .values({ userId: data.userId, label: data.label, keyHash })
    .returning();
  return row!;
}

export async function verifyApiKey(
  db: Database,
  rawKey: string,
): Promise<ApiKey | null> {
  const keyHash = hashApiKey(rawKey);
  const [row] = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, keyHash));

  if (!row) return null;

  // Update lastUsedAt
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, row.id));

  return row;
}

export async function deleteApiKey(
  db: Database,
  id: string,
): Promise<boolean> {
  const result = await db.delete(apiKeys).where(eq(apiKeys.id, id)).returning();
  return result.length > 0;
}
