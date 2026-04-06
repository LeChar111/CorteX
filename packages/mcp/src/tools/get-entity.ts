import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const getEntityTool = {
  name: 'get_entity',
  description:
    'Get details of a specific entity (endpoint, table, service, etc.) and all its direct relations from the knowledge graph.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      name: { type: 'string', description: 'Name of the entity to look up' },
      type: {
        type: 'string',
        description: 'Type of entity to filter by (e.g. "endpoint", "table", "service")',
      },
    },
    required: ['name'],
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    detected: DetectedProject | null,
  ): Promise<string> {
    const name = args.name as string;
    const entityType = args.type as string | undefined;

    // Get the graph centered on this entity (depth 1 = direct relations only)
    const graphResult = await client.getGraph({ entityName: name, depth: 1 }) as {
      nodes?: Array<{ id?: string; label?: string; properties?: Record<string, unknown>; [k: string]: unknown }>;
      edges?: Array<{ source?: string; target?: string; label?: string; [k: string]: unknown }>;
    };

    const nodes = graphResult.nodes ?? [];
    const edges = graphResult.edges ?? [];

    // Find the matching entity node(s)
    const nameLower = name.toLowerCase();
    const typeLower = entityType?.toLowerCase();
    const matchingNodes = nodes.filter((n) => {
      const nodeLabel = (n.label ?? n.id ?? '').toLowerCase();
      if (!nodeLabel.includes(nameLower)) return false;
      if (typeLower) {
        const nodeType = String(n.properties?.entity_type ?? n.properties?.type ?? '').toLowerCase();
        if (nodeType && !nodeType.includes(typeLower)) return false;
      }
      return true;
    });

    if (matchingNodes.length === 0) {
      // Fallback: semantic search if graph has no match
      const queryResult = await client.query(
        entityType ? `[Type: ${entityType}] ${name}` : name,
        { project: detected?.projectName, mode: 'local' },
      );
      return `No exact graph entity found for "${name}". Semantic search results:\n\n${JSON.stringify(queryResult, null, 2)}`;
    }

    const lines: string[] = [`# Entity: ${name}`, ''];

    for (const entity of matchingNodes) {
      const props = entity.properties ?? {};
      const label = entity.label ?? entity.id ?? 'unknown';
      lines.push(`## ${label}`);
      const type = props.entity_type ?? props.type;
      if (type) lines.push(`**Type:** ${String(type)}`);
      const desc = props.description;
      if (desc) lines.push(`**Description:** ${String(desc)}`);
      const source = props.source_id ?? props.file_path;
      if (source) lines.push(`**Source:** ${String(source)}`);
      lines.push('');
    }

    // Show direct relations
    if (edges.length > 0) {
      const matchingIds = new Set(matchingNodes.map(n => n.id));
      const outgoing = edges.filter(e => matchingIds.has(e.source));
      const incoming = edges.filter(e => matchingIds.has(e.target));

      if (outgoing.length > 0) {
        lines.push('## Outgoing Relations');
        for (const e of outgoing) {
          const label = e.label ? ` [${e.label}]` : '';
          lines.push(`- → ${e.target}${label}`);
        }
        lines.push('');
      }

      if (incoming.length > 0) {
        lines.push('## Incoming Relations');
        for (const e of incoming) {
          const label = e.label ? ` [${e.label}]` : '';
          lines.push(`- ← ${e.source}${label}`);
        }
      }
    }

    return lines.join('\n');
  },
};
