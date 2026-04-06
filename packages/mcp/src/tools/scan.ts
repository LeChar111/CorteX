import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const scanTool = {
  name: 'scan',
  description:
    'Trigger a scan of a repository to analyze code and update the knowledge graph.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      project: { type: 'string', description: 'Project name to scan' },
      repo: { type: 'string', description: 'Repository name (optional, scans first repo if omitted)' },
      branch: { type: 'string', description: 'Branch to scan (optional)' },
      mode: {
        type: 'string',
        enum: ['full', 'diff'],
        description: 'Scan mode (default: full)',
      },
    },
    required: ['project'],
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    detected: DetectedProject | null,
  ): Promise<string> {
    const projectName = args.project as string;
    const repoName = args.repo as string | undefined;
    const branch = args.branch as string | undefined;
    const mode = (args.mode as string) || 'full';

    // Resolve project name to projectId
    const projects = await client.listProjects() as Array<{ id: string; name: string }>;
    const project = projects.find(
      p => p.name.toLowerCase() === projectName.toLowerCase(),
    );
    if (!project) {
      throw new Error(`Project "${projectName}" not found`);
    }

    // Resolve repoId
    const repos = await client.getRepos(project.id) as Array<{ id: string; name: string; slug: string }>;
    let repo: { id: string; name: string; slug: string } | undefined;
    if (repoName) {
      repo = repos.find(
        r =>
          r.name.toLowerCase() === repoName.toLowerCase() ||
          r.slug.toLowerCase() === repoName.toLowerCase(),
      );
      if (!repo) {
        throw new Error(`Repo "${repoName}" not found in project "${projectName}"`);
      }
    } else {
      // Fall back to detected repo or first available
      if (detected && detected.projectId === project.id) {
        repo = repos.find(r => r.id === detected.repoId);
      }
      if (!repo) {
        repo = repos[0];
      }
      if (!repo) {
        throw new Error(`No repositories found in project "${projectName}"`);
      }
    }

    const result = await client.triggerScan({
      projectId: project.id,
      repoId: repo.id,
      branch,
      mode,
    }) as { id?: string; status?: string; [k: string]: unknown };

    return `Scan triggered for ${projectName}/${repo.name}${branch ? ` (branch: ${branch})` : ''} in ${mode} mode. Job ID: ${result.id ?? 'unknown'}, status: ${result.status ?? 'queued'}.`;
  },
};
