import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const searchTool = {
  name: 'search',
  description:
    'Search entities and code by keywords using full-text, semantic, or hybrid search.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      query: { type: 'string', description: 'Search keywords or phrase' },
      mode: {
        type: 'string',
        enum: ['fulltext', 'semantic', 'hybrid'],
        description: 'Search mode (default: hybrid)',
      },
      project: { type: 'string', description: 'Project name to search in (optional)' },
      types: {
        type: 'array',
        items: { type: 'string' },
        description: 'Entity types to filter by (optional)',
      },
      limit: { type: 'number', description: 'Maximum number of results to return' },
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
    const mode = (args.mode as string) || 'hybrid';
    const types = args.types as string[] | undefined;
    const limit = args.limit as number | undefined;

    // Enrich query with type filter so LightRAG can scope results
    let enrichedQuery = query;
    if (types && types.length > 0) {
      enrichedQuery = `[Types: ${types.join(', ')}] ${query}`;
    }

    const result = await client.query(enrichedQuery, { project, mode, limit }) as {
      response?: string;
      [k: string]: unknown;
    };

    if (result.response && typeof result.response === 'string') {
      return result.response;
    }

    return JSON.stringify(result, null, 2);
  },
};
