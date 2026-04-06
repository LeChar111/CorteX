import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const listProjectsTool = {
  name: 'list_projects',
  description: 'List all projects and repositories configured in Cortex.',
  inputSchema: {
    type: 'object' as const,
    properties: {},
    required: [],
  },
  async handler(
    _args: Record<string, unknown>,
    client: CortexClient,
    _detected: DetectedProject | null,
  ): Promise<string> {
    const projects = await client.listProjects() as Array<{ id: string; name: string; description?: string }>;
    const result = await Promise.all(
      projects.map(async (project) => {
        const repos = await client.getRepos(project.id) as Array<{ name?: string; provider?: string; techStack?: unknown; defaultBranch?: string }>;
        return { ...project, repos };
      }),
    );

    if (result.length === 0) {
      return 'No projects configured in Cortex.';
    }

    const lines: string[] = [`# Projects (${result.length})`, ''];
    for (const p of result) {
      lines.push(`## ${p.name}`);
      if (p.description) lines.push(p.description);
      if (p.repos.length > 0) {
        for (const r of p.repos) {
          const stack = Array.isArray(r.techStack) ? ` [${(r.techStack as string[]).join(', ')}]` : '';
          lines.push(`  - ${r.name} (${r.provider ?? 'local'}, branch: ${r.defaultBranch ?? 'main'})${stack}`);
        }
      } else {
        lines.push('  - No repositories');
      }
      lines.push('');
    }

    return lines.join('\n');
  },
};
