import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const linkTool = {
  name: 'link',
  description: 'Create a relation between two existing entities.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      source: { type: 'string', description: 'Name of the source entity' },
      target: { type: 'string', description: 'Name of the target entity' },
      type: { type: 'string', description: 'Type of relation (e.g. "uses", "depends_on", "calls")' },
      description: { type: 'string', description: 'Optional description of the relation' },
    },
    required: ['source', 'target', 'type'],
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    _detected: DetectedProject | null,
  ): Promise<string> {
    const source = args.source as string;
    const target = args.target as string;
    const relationType = args.type as string;
    const description = args.description as string | undefined;
    await client.ingest({
      content: description || '',
      source,
      target,
      relationType,
      type: 'relation',
    });
    return `Relation created: ${source} --[${relationType}]--> ${target}`;
  },
};
