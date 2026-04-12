import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const queryTool = {
  name: 'query',
  description:
    'Search the knowledge base using semantic + graph search. Returns relevant code chunks, entities, and relations.',
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
    const result = await client.query(query, { project, mode }) as {
      response?: string;
      query?: string;
      mode?: string;
      [k: string]: unknown;
    };

    // The API returns a 'response' field with the text answer
    if (result.response && typeof result.response === 'string') {
      return result.response;
    }

    return JSON.stringify(result, null, 2);
  },
};
