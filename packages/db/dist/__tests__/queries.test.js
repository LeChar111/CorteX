import { config } from 'dotenv';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
config({ path: resolve(__dirname, '../../../../.env') });
import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { getDb, closePool } from '../connection.js';
import { createProject, getProjectById, getProjectByName, listProjects, updateProject, deleteProject, } from '../queries/projects.js';
import { createRepo, getRepoById, getRepoBySlug, listReposByProject, updateRepo, deleteRepo, } from '../queries/repos.js';
import { hashApiKey, createApiKey, verifyApiKey, deleteApiKey, } from '../queries/auth.js';
import { sql } from 'drizzle-orm';
const db = getDb();
beforeEach(async () => {
    await db.execute(sql `TRUNCATE projects CASCADE`);
    await db.execute(sql `TRUNCATE api_keys CASCADE`);
});
afterAll(async () => {
    await closePool();
});
// ─── projects ────────────────────────────────────────────────────────────────
describe('projects', () => {
    it('creates a project', async () => {
        const project = await createProject(db, { name: 'test-project', description: 'A test project' });
        expect(project.id).toBeDefined();
        expect(project.name).toBe('test-project');
        expect(project.description).toBe('A test project');
    });
    it('gets project by name', async () => {
        const created = await createProject(db, { name: 'find-me' });
        const found = await getProjectByName(db, 'find-me');
        expect(found).not.toBeNull();
        expect(found.id).toBe(created.id);
    });
    it('returns null for unknown project name', async () => {
        const result = await getProjectByName(db, 'does-not-exist');
        expect(result).toBeNull();
    });
    it('lists projects', async () => {
        await createProject(db, { name: 'project-a' });
        await createProject(db, { name: 'project-b' });
        const list = await listProjects(db);
        expect(list.length).toBe(2);
    });
    it('updates a project', async () => {
        const project = await createProject(db, { name: 'to-update' });
        const updated = await updateProject(db, project.id, { description: 'updated description' });
        expect(updated).not.toBeNull();
        expect(updated.description).toBe('updated description');
        expect(updated.name).toBe('to-update');
    });
    it('deletes a project', async () => {
        const project = await createProject(db, { name: 'to-delete' });
        const deleted = await deleteProject(db, project.id);
        expect(deleted).toBe(true);
        const found = await getProjectById(db, project.id);
        expect(found).toBeNull();
    });
});
// ─── repos ───────────────────────────────────────────────────────────────────
describe('repos', () => {
    it('creates a repo and retrieves it by id', async () => {
        const project = await createProject(db, { name: 'repo-project' });
        const repo = await createRepo(db, {
            projectId: project.id,
            name: 'my-repo',
            slug: 'my-repo',
            cloneUrl: 'https://github.com/org/my-repo.git',
            provider: 'github',
        });
        expect(repo.id).toBeDefined();
        expect(repo.slug).toBe('my-repo');
        const found = await getRepoById(db, repo.id);
        expect(found).not.toBeNull();
        expect(found.id).toBe(repo.id);
    });
    it('gets repo by slug', async () => {
        const project = await createProject(db, { name: 'slug-project' });
        const repo = await createRepo(db, {
            projectId: project.id,
            name: 'slug-repo',
            slug: 'slug-repo',
            cloneUrl: 'https://github.com/org/slug-repo.git',
            provider: 'github',
        });
        const found = await getRepoBySlug(db, project.id, 'slug-repo');
        expect(found).not.toBeNull();
        expect(found.id).toBe(repo.id);
    });
    it('lists repos by project', async () => {
        const project = await createProject(db, { name: 'list-repos-project' });
        await createRepo(db, {
            projectId: project.id,
            name: 'repo-1',
            slug: 'repo-1',
            cloneUrl: 'https://github.com/org/repo-1.git',
            provider: 'github',
        });
        await createRepo(db, {
            projectId: project.id,
            name: 'repo-2',
            slug: 'repo-2',
            cloneUrl: 'https://github.com/org/repo-2.git',
            provider: 'github',
        });
        const list = await listReposByProject(db, project.id);
        expect(list.length).toBe(2);
    });
    it('updates a repo', async () => {
        const project = await createProject(db, { name: 'update-repo-project' });
        const repo = await createRepo(db, {
            projectId: project.id,
            name: 'update-me',
            slug: 'update-me',
            cloneUrl: 'https://github.com/org/update-me.git',
            provider: 'github',
        });
        const updated = await updateRepo(db, repo.id, { defaultBranch: 'develop' });
        expect(updated).not.toBeNull();
        expect(updated.defaultBranch).toBe('develop');
    });
    it('deletes a repo', async () => {
        const project = await createProject(db, { name: 'delete-repo-project' });
        const repo = await createRepo(db, {
            projectId: project.id,
            name: 'delete-me',
            slug: 'delete-me',
            cloneUrl: 'https://github.com/org/delete-me.git',
            provider: 'github',
        });
        const deleted = await deleteRepo(db, repo.id);
        expect(deleted).toBe(true);
        const found = await getRepoById(db, repo.id);
        expect(found).toBeNull();
    });
});
// ─── auth ────────────────────────────────────────────────────────────────────
describe('auth', () => {
    it('hashes an API key deterministically', () => {
        const hash1 = hashApiKey('my-secret-key');
        const hash2 = hashApiKey('my-secret-key');
        expect(hash1).toBe(hash2);
        expect(hash1).toHaveLength(64); // SHA-256 hex
    });
    it('creates and verifies an API key', async () => {
        const rawKey = 'test-api-key-12345';
        const created = await createApiKey(db, { userId: 'user-1', label: 'test key', rawKey });
        expect(created.id).toBeDefined();
        expect(created.keyHash).toBe(hashApiKey(rawKey));
        const verified = await verifyApiKey(db, rawKey);
        expect(verified).not.toBeNull();
        expect(verified.id).toBe(created.id);
    });
    it('returns null for unknown API key', async () => {
        const result = await verifyApiKey(db, 'nonexistent-key');
        expect(result).toBeNull();
    });
    it('deletes an API key', async () => {
        const created = await createApiKey(db, { userId: 'user-2', rawKey: 'delete-me-key' });
        const deleted = await deleteApiKey(db, created.id);
        expect(deleted).toBe(true);
        const result = await verifyApiKey(db, 'delete-me-key');
        expect(result).toBeNull();
    });
});
//# sourceMappingURL=queries.test.js.map