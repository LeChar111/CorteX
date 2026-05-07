import { simpleGit } from 'simple-git';

export interface DetectedProject {
  projectId: string;
  repoId: string;
  projectName: string;
  repoName: string;
  repoBranch: string;
}

// In-memory cache: cwd → { result, timestamp }
const cache = new Map<string, { result: DetectedProject | null; ts: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Normalize git URLs for comparison
// git@github.com:user/repo.git → github.com/user/repo
// https://github.com/user/repo.git → github.com/user/repo
export function normalizeGitUrl(url: string): string {
  return url
    .replace(/^git@/, '')
    .replace(/^https?:\/\//, '')
    .replace(/\.git$/, '')
    .replace(':', '/');
}

export async function detectProject(
  cwd: string,
  apiBaseUrl: string,
  apiKey: string,
): Promise<DetectedProject | null> {
  // Check cache first
  const cached = cache.get(cwd);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.result;
  }

  const result = await detectProjectUncached(cwd, apiBaseUrl, apiKey);
  cache.set(cwd, { result, ts: Date.now() });
  return result;
}

async function detectProjectUncached(
  cwd: string,
  apiBaseUrl: string,
  apiKey: string,
): Promise<DetectedProject | null> {
  try {
    const git = simpleGit(cwd);

    // 1. Get git remote URL and current branch
    const [remotes, branchResult] = await Promise.all([
      git.getRemotes(true),
      git.branch().catch(() => null),
    ]);

    const origin = remotes.find(r => r.name === 'origin');
    if (!origin?.refs?.fetch) return null;

    const remoteUrl = normalizeGitUrl(origin.refs.fetch);
    const currentBranch = branchResult?.current ?? 'main';

    // 2. Get all projects and repos from API in one pass
    const projectsRes = await fetch(`${apiBaseUrl}/api/projects`, {
      headers: { 'X-API-Key': apiKey },
      signal: AbortSignal.timeout(5000),
    });
    if (!projectsRes.ok) return null;
    const projects = await projectsRes.json() as Array<{ id: string; name: string }>;

    // Fetch all repos for all projects in parallel
    const reposByProject = await Promise.all(
      projects.map(async (project) => {
        const reposRes = await fetch(`${apiBaseUrl}/api/repos?projectId=${project.id}`, {
          headers: { 'X-API-Key': apiKey },
          signal: AbortSignal.timeout(5000),
        });
        if (!reposRes.ok) return { project, repos: [] as Array<{ id: string; name: string; slug: string; cloneUrl?: string }> };
        const repos = await reposRes.json() as Array<{ id: string; name: string; slug: string; cloneUrl?: string }>;
        return { project, repos };
      }),
    );

    // 3. Match by cloneUrl
    for (const { project, repos } of reposByProject) {
      for (const repo of repos) {
        if (repo.cloneUrl && normalizeGitUrl(repo.cloneUrl) === remoteUrl) {
          return {
            projectId: project.id,
            repoId: repo.id,
            projectName: project.name,
            repoName: repo.name,
            repoBranch: currentBranch,
          };
        }
      }
    }

    // 4. Fallback: match directory name against repo slugs (reuse already-fetched data)
    const dirName = cwd.split('/').pop()?.toLowerCase();
    if (dirName) {
      for (const { project, repos } of reposByProject) {
        for (const repo of repos) {
          if (repo.slug.toLowerCase() === dirName || repo.name.toLowerCase() === dirName) {
            return {
              projectId: project.id,
              repoId: repo.id,
              projectName: project.name,
              repoName: repo.name,
              repoBranch: currentBranch,
            };
          }
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}
