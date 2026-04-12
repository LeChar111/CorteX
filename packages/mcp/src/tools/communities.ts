import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const communitiesTool = {
  name: 'communities',
  description: 'Get community clusters detected in the codebase. Shows how code is naturally grouped and the cohesion of each cluster.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      projectId: { type: 'string', description: 'Project UUID (auto-detected if not provided)' },
    },
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    detected: DetectedProject | null,
  ): Promise<string> {
    const projectId = (args.projectId as string) || detected?.projectId;
    if (!projectId) return 'No project detected. Provide a projectId.';

    const result = await client.getCommunities(projectId) as {
      communities?: Array<{
        id: string;
        index: string;
        memberCount: number;
        cohesionScore: number;
        godNodes?: Array<{ label: string; edges: number }>;
      }>;
      totalCommunities?: number;
    };

    const communities = result.communities ?? [];
    if (communities.length === 0) return 'No communities found. Run a scan first.';

    const lines = [
      `# Communities (${communities.length} clusters)`,
      '',
    ];

    for (const c of communities) {
      const gods = (c.godNodes ?? []) as Array<{ label: string; edges: number }>;
      const godStr = gods.length > 0
        ? ` | Hub nodes: ${gods.map(g => g.label).join(', ')}`
        : '';
      lines.push(`- **Community ${c.index}**: ${c.memberCount} members, cohesion ${(c.cohesionScore * 100).toFixed(0)}%${godStr}`);
    }

    return lines.join('\n');
  },
};
