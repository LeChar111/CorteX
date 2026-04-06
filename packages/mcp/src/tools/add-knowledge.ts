import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const addKnowledgeTool = {
  name: 'add_knowledge',
  description:
    'Manually add knowledge to the graph. Useful for architecture decisions, conventions, or information not in code.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      name: { type: 'string', description: 'Name of the knowledge entry' },
      description: { type: 'string', description: 'Detailed description of the knowledge' },
      type: {
        type: 'string',
        description: 'Type of knowledge entry (default: concept)',
      },
      relatedTo: {
        type: 'array',
        items: { type: 'string' },
        description: 'Names of related entities (optional)',
      },
      project: { type: 'string', description: 'Project name (auto-detected if omitted)' },
    },
    required: ['name', 'description'],
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    detected: DetectedProject | null,
  ): Promise<string> {
    const name = args.name as string;
    const description = args.description as string;
    const project = (args.project as string) || detected?.projectName;
    const relatedTo = args.relatedTo as string[] | undefined;

    // Build enriched content that includes relations for LightRAG to index
    let content = description;
    if (relatedTo && relatedTo.length > 0) {
      content += `\n\nRelated entities: ${relatedTo.join(', ')}`;
    }

    await client.ingest({
      content,
      name,
      type: 'knowledge',
      project,
    });

    // Create explicit relations if relatedTo is provided
    const linked: string[] = [];
    if (relatedTo && relatedTo.length > 0) {
      for (const target of relatedTo) {
        try {
          await client.ingest({
            content: `${name} is related to ${target}`,
            source: name,
            target,
            relationType: 'related_to',
            type: 'relation',
          });
          linked.push(target);
        } catch {
          // best-effort linking
        }
      }
    }

    const linkMsg = linked.length > 0 ? ` Linked to: ${linked.join(', ')}.` : '';
    return `Knowledge "${name}" added to project "${project ?? 'unknown'}".${linkMsg}`;
  },
};
