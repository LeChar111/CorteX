import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const crossProjectQueryTool = {
  name: 'cross_project_query',
  description:
    'Search across the current project and all its linked projects. Combines semantic search with actual cross-project graph traversal.',
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
      entity: {
        type: 'string',
        description: 'Optional entity name to center the cross-project graph traversal on',
      },
      depth: {
        type: 'number',
        description: 'Graph traversal depth for entity-centered queries (default: 2)',
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
    const entityName = args.entity as string | undefined;
    const depth = (args.depth as number) || 2;
    const projectId = detected?.projectId;

    const lines: string[] = [`# Cross-Project Search: ${query}`, ''];

    // 1. Semantic search across linked projects
    const semanticResult = await client.query(query, {
      project,
      mode,
      projectId,
      includeLinked: true,
    }) as { response?: string; [k: string]: unknown };

    if (semanticResult.response && typeof semanticResult.response === 'string') {
      lines.push('## Semantic Results');
      lines.push(semanticResult.response);
      lines.push('');
    }

    // 2. If projectId available, do actual cross-project graph traversal
    if (projectId) {
      try {
        const graphResult = await client.getCrossProjectGraph(
          projectId,
          entityName ?? query.split(' ').slice(0, 3).join(' '),
          depth,
        ) as {
          nodes?: Array<{ id?: string; label?: string; _project?: string; _isCrossProject?: boolean; [k: string]: unknown }>;
          edges?: Array<{ source?: string; target?: string; label?: string; [k: string]: unknown }>;
          crossProjectEdges?: number;
          projectCount?: number;
        };

        const nodes = graphResult.nodes ?? [];
        const edges = graphResult.edges ?? [];
        const crossEdges = graphResult.crossProjectEdges ?? 0;

        if (nodes.length > 0) {
          lines.push('## Graph Traversal');
          lines.push(`${nodes.length} entities found across ${graphResult.projectCount ?? 1} project(s), ${crossEdges} cross-project edges`);
          lines.push('');

          // Show cross-project entities
          const crossNodes = nodes.filter((n) => n._isCrossProject);
          if (crossNodes.length > 0) {
            lines.push('### Cross-Project Entities');
            for (const n of crossNodes.slice(0, 20)) {
              lines.push(`- **${n.label ?? n.id ?? 'unknown'}** (project: ${n._project ?? '?'})`);
            }
            if (crossNodes.length > 20) lines.push(`- ... and ${crossNodes.length - 20} more`);
            lines.push('');
          }

          // Show edges
          if (edges.length > 0) {
            lines.push('### Key Relations');
            for (const e of edges.slice(0, 15)) {
              const label = e.label ? ` [${e.label}]` : '';
              lines.push(`- ${e.source} →${label} ${e.target}`);
            }
            if (edges.length > 15) lines.push(`- ... and ${edges.length - 15} more`);
          }
        }
      } catch {
        // Graph traversal failed, semantic results are still available
      }
    }

    return lines.join('\n');
  },
};
