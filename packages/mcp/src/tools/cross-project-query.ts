import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const crossProjectQueryTool = {
  name: 'cross_project_query',
  description:
    'Search across the current project and all its linked projects. Useful for understanding cross-project dependencies and shared patterns.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: { type: 'string', description: 'Natural language question or search query' },
      project: { type: 'string', description: 'Project name (auto-detected if omitted)' },
      mode: {
        type: 'string',
        enum: ['mix', 'local', 'global', 'naive'],
        description: 'Search mode (default: mix)',
      },
    },
    required: ['query'],
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    detected: DetectedProject | null,
  ): Promise<string> {
    const query = args.query as string;
    const project = (args.project as string) || detected?.projectName;
    const mode = (args.mode as string) || 'mix';
    const projectId = detected?.projectId;

    // Use includeLinked to search across linked projects
    const result = await client.query(query, {
      project,
      mode,
      projectId,
      includeLinked: true,
    }) as { response?: string; [k: string]: unknown };

    if (result.response && typeof result.response === 'string') {
      return `# Cross-Project Search: ${query}\n\n${result.response}`;
    }

    return JSON.stringify(result, null, 2);
  },
};
