import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, extname, basename, resolve } from 'node:path';
import { simpleGit } from 'simple-git';
const DEFAULT_IGNORE_PATTERNS = [
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    'vendor/**',
    '__pycache__/**',
    '.next/**',
    'coverage/**',
];
const DEFAULT_EXTENSIONS = [
    // Web / JS ecosystem
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
    '.css', '.scss', '.html', '.svelte', '.vue',
    '.graphql', '.gql',
    // Python
    '.py',
    // Go
    '.go',
    // Java / Kotlin
    '.java', '.kt',
    // Rust
    '.rs',
    // Ruby
    '.rb',
    // PHP
    '.php',
    // C / C++
    '.c', '.h', '.cpp', '.hpp', '.cc', '.hh',
    // Shell
    '.sh', '.bash',
    // SQL
    '.sql',
    // Protobuf
    '.proto',
    // Config / Data
    '.yaml', '.yml', '.json', '.toml', '.xml',
    '.ini', '.cfg', '.conf', '.env.example',
    // Build systems
    '.cmake', '.mk', '.makefile',
    '.bb', '.bbappend', '.bbclass',
    // Docs
    '.md', '.rst', '.txt',
    // Docker
    '.dockerfile',
];
const SPECIAL_FILENAMES = new Set([
    'Dockerfile', 'docker-compose.yml', 'docker-compose.yaml',
    'Makefile', 'CMakeLists.txt',
    '.env.example', '.gitignore',
]);
const DEFAULT_MAX_FILE_SIZE_KB = 500;
/**
 * Check if a filePath should be ignored based on the given patterns.
 * Patterns like "node_modules/**" are stripped to "node_modules" and used as prefixes.
 */
export function shouldIgnore(filePath, patterns) {
    for (const pattern of patterns) {
        // Strip trailing /** or /* to get the prefix
        const prefix = pattern.replace(/\/\*\*?$/, '');
        if (filePath === prefix || filePath.startsWith(prefix + '/')) {
            return true;
        }
    }
    return false;
}
/**
 * Recursively discover source files under rootPath.
 */
export async function discoverFiles(rootPath, options = {}) {
    const ignorePatterns = options.ignorePatterns ?? DEFAULT_IGNORE_PATTERNS;
    const maxFileSizeKb = options.maxFileSizeKb ?? DEFAULT_MAX_FILE_SIZE_KB;
    const extensions = new Set(options.extensions ?? DEFAULT_EXTENSIONS);
    const results = [];
    async function walk(dirPath) {
        let entries;
        try {
            entries = await readdir(dirPath, { withFileTypes: true, encoding: 'utf-8' });
        }
        catch {
            return;
        }
        for (const entry of entries) {
            const absolutePath = join(dirPath, entry.name);
            const relPath = relative(rootPath, absolutePath);
            if (shouldIgnore(relPath, ignorePatterns)) {
                continue;
            }
            if (entry.isDirectory()) {
                await walk(absolutePath);
            }
            else if (entry.isFile()) {
                const ext = extname(entry.name);
                const name = basename(entry.name);
                const isSpecial = SPECIAL_FILENAMES.has(name);
                if (!isSpecial && !extensions.has(ext)) {
                    continue;
                }
                const fileStat = await stat(absolutePath);
                const sizeKb = fileStat.size / 1024;
                if (sizeKb > maxFileSizeKb) {
                    continue;
                }
                const content = await readFile(absolutePath, 'utf-8');
                const hash = createHash('sha256').update(content).digest('hex');
                results.push({
                    relativePath: relPath,
                    absolutePath,
                    content,
                    hash,
                    size: fileStat.size,
                });
            }
        }
    }
    await walk(rootPath);
    return results;
}
/**
 * Read .cred.env and return key-value pairs.
 */
async function loadCredEnv() {
    const credPath = resolve(process.env['CORTEX_ROOT'] || resolve(import.meta.dirname, '../../..'), '.cred.env');
    try {
        const raw = await readFile(credPath, 'utf-8');
        const entries = {};
        for (const line of raw.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#'))
                continue;
            const eq = trimmed.indexOf('=');
            if (eq > 0) {
                entries[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
            }
        }
        return entries;
    }
    catch {
        return {};
    }
}
/**
 * Convert an HTTPS clone URL to its SSH equivalent.
 * e.g. https://bitbucket.org/org/repo.git → git@bitbucket.org:org/repo.git
 */
function httpsToSsh(httpsUrl) {
    const url = new URL(httpsUrl);
    const path = url.pathname.replace(/^\//, '');
    return `git@${url.hostname}:${path}`;
}
/**
 * Build an authenticated clone URL by injecting credentials from .cred.env.
 *
 * Provider credential mapping:
 *   bitbucket  → BITBUCKET_APP_PASSWORD + BITBUCKET_USERNAME (Basic auth)
 *                Falls back to SSH if only ATATT-style API tokens are available
 *   github     → GITHUB_TOKEN                              (token@ auth)
 *   gitlab     → GITLAB_TOKEN                              (oauth2:token@ auth)
 *   local      → returns cloneUrl as-is (it's a local path)
 *
 * If no credentials are found, falls back to SSH for known providers.
 */
export async function buildAuthenticatedUrl(cloneUrl, provider) {
    const p = provider.toLowerCase();
    // Local provider — cloneUrl is a filesystem path, return as-is
    if (p === 'local')
        return cloneUrl;
    // Already an SSH URL — return as-is
    if (cloneUrl.startsWith('git@') || cloneUrl.startsWith('ssh://'))
        return cloneUrl;
    const creds = await loadCredEnv();
    try {
        const url = new URL(cloneUrl);
        // Skip if already has credentials embedded
        if (url.username || url.password)
            return cloneUrl;
        if (p === 'bitbucket') {
            const username = creds['BITBUCKET_USERNAME'];
            const appPassword = creds['BITBUCKET_APP_PASSWORD'];
            const apiToken = creds['BITBUCKET_API_TOKEN'];
            // App passwords work for git clone — use them with Basic auth
            if (username && appPassword) {
                url.username = encodeURIComponent(username);
                url.password = encodeURIComponent(appPassword);
                return url.toString();
            }
            // ATATT-style API tokens only work for REST API, not git clone.
            // Fall back to SSH which uses the user's SSH key.
            if (apiToken && apiToken.startsWith('ATATT')) {
                console.log('[source-loader] Bitbucket API token detected (ATATT) — using SSH fallback');
                return httpsToSsh(cloneUrl);
            }
            // No credentials at all — try SSH
            console.log('[source-loader] No Bitbucket credentials — using SSH fallback');
            return httpsToSsh(cloneUrl);
        }
        else if (p === 'github') {
            const token = creds['GITHUB_TOKEN'] || creds['GITHUB_PAT'];
            if (token) {
                url.username = 'x-access-token';
                url.password = encodeURIComponent(token);
                return url.toString();
            }
            // Fallback to SSH
            return httpsToSsh(cloneUrl);
        }
        else if (p === 'gitlab') {
            const token = creds['GITLAB_TOKEN'] || creds['GITLAB_PAT'];
            if (token) {
                url.username = 'oauth2';
                url.password = encodeURIComponent(token);
                return url.toString();
            }
            // Fallback to SSH
            return httpsToSsh(cloneUrl);
        }
    }
    catch {
        // Not a valid URL — return as-is (could be SSH)
    }
    return cloneUrl;
}
/**
 * Clone a repo or pull the latest changes if already cloned.
 */
export async function cloneOrPull(cloneUrl, targetPath, branch = 'main') {
    const gitDir = join(targetPath, '.git');
    if (existsSync(gitDir)) {
        const git = simpleGit(targetPath);
        await git.checkout(branch);
        await git.pull('origin', branch);
    }
    else {
        const git = simpleGit();
        await git.clone(cloneUrl, targetPath, ['--branch', branch, '--single-branch']);
    }
}
/**
 * Clone or pull a repo using a persistent cache at /tmp/cortex-repos/<slug>.
 * Returns the path to the cached repo directory.
 */
export async function cloneOrPullCached(cloneUrl, repoSlug, branch) {
    const cacheDir = join(tmpdir(), 'cortex-repos', repoSlug);
    await mkdir(cacheDir, { recursive: true });
    await cloneOrPull(cloneUrl, cacheDir, branch);
    return cacheDir;
}
/**
 * Get files changed since a given commit using git diff.
 */
export async function getChangedFiles(repoPath, sinceCommit) {
    try {
        const { execSync } = await import('child_process');
        const output = execSync(`git diff --name-only ${sinceCommit}..HEAD`, {
            cwd: repoPath,
            encoding: 'utf-8',
        }).trim();
        return output ? output.split('\n').filter(Boolean) : [];
    }
    catch {
        return [];
    }
}
/**
 * Get the HEAD commit hash for a repository.
 */
export async function getHeadCommit(repoPath) {
    const git = simpleGit(repoPath);
    const log = await git.log({ maxCount: 1 });
    const latest = log.latest;
    if (!latest) {
        throw new Error(`No commits found in repository: ${repoPath}`);
    }
    return latest.hash;
}
//# sourceMappingURL=source-loader.js.map