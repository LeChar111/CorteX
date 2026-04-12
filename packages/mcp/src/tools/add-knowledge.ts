import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const addKnowledgeTool = {
  name: 'add_knowledge',
  description:
    'Manually add knowledge to the graph. Creates a graph entity node and optional structural relations to existing entities.',
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
        description: 'Names of related entities — creates direct graph edges',
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
    const entryType = (args.type as string) || 'concept';
    const relatedTo = args.relatedTo as string[] | undefined;

    // Create the entity node directly in the graph
    await client.createGraphEntity({
      name,
      type: entryType.toUpperCase(),
      description,
      projectId: detected?.projectId,
      projectName: project,
    });

    // Also ingest as document for semantic search
    let content = description;
    if (relatedTo && relatedTo.length > 0) {
      content += `\n\nRelated entities: ${relatedTo.join(', ')}`;
    }

    await client.ingest({
      content,
      name,
      type: 'knowledge',
      project,
      projectId: detected?.projectId,
    });

    // Create direct structural relations (graph edges)
    const linked: string[] = [];
    if (relatedTo && relatedTo.length > 0) {
      for (const target of relatedTo) {
        try {
          await client.createGraphRelation({
            source: name,
            target,
            type: 'related_to',
            description: `${name} is related to ${target}`,
            projectId: detected?.projectId,
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
