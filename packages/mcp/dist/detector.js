import simpleGit from 'simple-git';
// Normalize git URLs for comparison
// git@github.com:user/repo.git → github.com/user/repo
// https://github.com/user/repo.git → github.com/user/repo
export function normalizeGitUrl(url) {
    return url
        .replace(/^git@/, '')
        .replace(/^https?:\/\//, '')
        .replace(/\.git$/, '')
        .replace(':', '/');
}
export async function detectProject(cwd, apiBaseUrl, apiKey) {
    try {
        // 1. Get git remote URL
        const git = simpleGit(cwd);
        const remotes = await git.getRemotes(true);
        const origin = remotes.find(r => r.name === 'origin');
        if (!origin?.refs?.fetch)
            return null;
        const remoteUrl = normalizeGitUrl(origin.refs.fetch);
        // 2. Get all projects and repos from API
        const projectsRes = await fetch(`${apiBaseUrl}/api/projects`, {
            headers: { 'X-API-Key': apiKey },
        });
        if (!projectsRes.ok)
            return null;
        const projects = await projectsRes.json();
        // 3. For each project, get repos and match
        for (const project of projects) {
            const reposRes = await fetch(`${apiBaseUrl}/api/repos?projectId=${project.id}`, {
                headers: { 'X-API-Key': apiKey },
            });
            if (!reposRes.ok)
                continue;
            const repos = await reposRes.json();
            for (const repo of repos) {
                if (repo.cloneUrl && normalizeGitUrl(repo.cloneUrl) === remoteUrl) {
                    return {
                        projectId: project.id,
                        repoId: repo.id,
                        projectName: project.name,
                        repoName: repo.name,
                    };
                }
            }
        }
        // 4. Fallback: match directory name against repo slugs
        const dirName = cwd.split('/').pop()?.toLowerCase();
        if (dirName) {
            for (const project of projects) {
                const reposRes = await fetch(`${apiBaseUrl}/api/repos?projectId=${project.id}`, {
                    headers: { 'X-API-Key': apiKey },
                });
                if (!reposRes.ok)
                    continue;
                const repos = await reposRes.json();
                for (const repo of repos) {
                    if (repo.slug.toLowerCase() === dirName || repo.name.toLowerCase() === dirName) {
                        return {
                            projectId: project.id,
                            repoId: repo.id,
                            projectName: project.name,
                            repoName: repo.name,
                        };
                    }
                }
            }
        }
        return null;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=detector.js.map