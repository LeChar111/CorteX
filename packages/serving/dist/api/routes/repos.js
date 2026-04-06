import { Hono } from 'hono';
import { z } from 'zod';
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { getDb, listReposByProject, getRepoById, createRepo, updateRepo, deleteRepo, } from '@cortex/db';
export const reposRouter = new Hono();
const repoSchema = z.object({
    projectId: z.string().uuid(),
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255),
    cloneUrl: z.string().min(1),
    provider: z.enum(['github', 'gitlab', 'bitbucket', 'local']),
    techStack: z.array(z.string()).optional(),
    defaultBranch: z.string().optional(),
    trackedBranches: z.array(z.string()).optional(),
    metadata: z.record(z.unknown()).optional(),
});
const updateRepoSchema = repoSchema
    .omit({ projectId: true })
    .partial();
// GET /repos
reposRouter.get('/repos', async (c) => {
    const projectId = c.req.query('projectId');
    if (!projectId) {
        return c.json({ error: 'projectId query parameter is required' }, 400);
    }
    const db = getDb();
    const repos = await listReposByProject(db, projectId);
    return c.json(repos);
});
// GET /repos/:id
reposRouter.get('/repos/:id', async (c) => {
    const db = getDb();
    const repo = await getRepoById(db, c.req.param('id'));
    if (!repo) {
        return c.json({ error: 'Repo not found' }, 404);
    }
    return c.json(repo);
});
// POST /repos
reposRouter.post('/repos', async (c) => {
    const body = await c.req.json();
    const parsed = repoSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
    }
    try {
        const db = getDb();
        const repo = await createRepo(db, {
            ...parsed.data,
            cloneUrl: parsed.data.cloneUrl,
            techStack: parsed.data.techStack ?? [],
            trackedBranches: parsed.data.trackedBranches ?? null,
            metadata: parsed.data.metadata ?? null,
        });
        return c.json(repo, 201);
    }
    catch (err) {
        if (isPostgresError(err)) {
            if (err.code === '23505') {
                return c.json({ error: 'Repo slug already exists in this project' }, 409);
            }
            if (err.code === '23503') {
                return c.json({ error: 'Project not found' }, 404);
            }
        }
        throw err;
    }
});
// PUT /repos/:id
reposRouter.put('/repos/:id', async (c) => {
    const body = await c.req.json();
    const parsed = updateRepoSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
    }
    try {
        const db = getDb();
        const repo = await updateRepo(db, c.req.param('id'), parsed.data);
        if (!repo) {
            return c.json({ error: 'Repo not found' }, 404);
        }
        return c.json(repo);
    }
    catch (err) {
        if (isPostgresError(err) && err.code === '23505') {
            return c.json({ error: 'Repo slug already exists in this project' }, 409);
        }
        throw err;
    }
});
// DELETE /repos/:id
reposRouter.delete('/repos/:id', async (c) => {
    const db = getDb();
    await deleteRepo(db, c.req.param('id'));
    return new Response(null, { status: 204 });
});
// GET /repos/:id/branches — list remote branches for a repo
reposRouter.get('/repos/:id/branches', async (c) => {
    const db = getDb();
    const repo = await getRepoById(db, c.req.param('id'));
    if (!repo) {
        return c.json({ error: 'Repo not found' }, 404);
    }
    try {
        const branches = await fetchRemoteBranches(repo.cloneUrl, repo.provider);
        return c.json(branches);
    }
    catch (err) {
        return c.json({ error: err instanceof Error ? err.message : 'Failed to fetch branches' }, 500);
    }
});
async function loadCredEnv() {
    const credPath = resolve(process.env['CORTEX_ROOT'] || resolve(import.meta.dirname, '../../../../..'), '.cred.env');
    try {
        const raw = await readFile(credPath, 'utf-8');
        const entries = {};
        for (const line of raw.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#'))
                continue;
            const eq = trimmed.indexOf('=');
            if (eq > 0)
                entries[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
        }
        return entries;
    }
    catch {
        return {};
    }
}
async function fetchRemoteBranches(cloneUrl, provider) {
    const creds = await loadCredEnv();
    if (provider === 'bitbucket') {
        // Extract org/repo from clone URL
        const match = cloneUrl.match(/bitbucket\.org\/([^/]+)\/([^/.]+)/);
        if (!match)
            throw new Error('Cannot parse Bitbucket URL');
        const [, workspace, repoSlug] = match;
        const username = creds['BITBUCKET_USERNAME'];
        const token = creds['BITBUCKET_API_TOKEN'] || creds['BITBUCKET_APP_PASSWORD'];
        const headers = {};
        if (username && token) {
            headers['Authorization'] = `Basic ${Buffer.from(`${username}:${token}`).toString('base64')}`;
        }
        const branches = [];
        let url = `https://api.bitbucket.org/2.0/repositories/${workspace}/${repoSlug}/refs/branches?pagelen=100`;
        while (url) {
            const res = await fetch(url, { headers });
            if (!res.ok)
                throw new Error(`Bitbucket API error: ${res.status}`);
            const data = await res.json();
            branches.push(...data.values.map((b) => b.name));
            url = data.next ?? null;
        }
        return branches.sort();
    }
    if (provider === 'github') {
        const match = cloneUrl.match(/github\.com\/([^/]+)\/([^/.]+)/);
        if (!match)
            throw new Error('Cannot parse GitHub URL');
        const [, owner, repoName] = match;
        const token = creds['GITHUB_TOKEN'] || creds['GITHUB_PAT'];
        const headers = { 'Accept': 'application/vnd.github+json' };
        if (token)
            headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch(`https://api.github.com/repos/${owner}/${repoName}/branches?per_page=100`, { headers });
        if (!res.ok)
            throw new Error(`GitHub API error: ${res.status}`);
        const data = await res.json();
        return data.map((b) => b.name).sort();
    }
    if (provider === 'local') {
        // Use git to list local branches
        const { execFile } = await import('node:child_process');
        const { promisify } = await import('node:util');
        const execFileAsync = promisify(execFile);
        const { stdout } = await execFileAsync('git', ['branch', '-a', '--format=%(refname:short)'], { cwd: cloneUrl });
        return stdout.split('\n').map(b => b.trim()).filter(Boolean).sort();
    }
    throw new Error(`Unsupported provider: ${provider}`);
}
function isPostgresError(err) {
    return typeof err === 'object' && err !== null && 'code' in err;
}
//# sourceMappingURL=repos.js.map