export const getGraphTool = {
    name: 'get_graph',
    description: 'Get the knowledge graph around an entity showing connected entities and relations.',
    inputSchema: {
        type: 'object',
        properties: {
            entityName: { type: 'string', description: 'Name of the entity to center the graph on' },
            depth: { type: 'number', description: 'Depth of relations to traverse (default: 2)' },
        },
        required: ['entityName'],
    },
    async handler(args, client, _detected) {
        const entityName = args.entityName;
        const depth = args.depth || 2;
        const result = await client.getGraph({ entityName, depth });
        const nodes = result.nodes ?? [];
        const edges = result.edges ?? [];
        const lines = [
            `# Graph around "${entityName}" (depth: ${depth})`,
            '',
            `**${nodes.length} nodes, ${edges.length} edges**`,
            '',
        ];
        if (nodes.length > 0) {
            lines.push('## Nodes');
            for (const node of nodes.slice(0, 50)) {
                lines.push(`- ${node.label ?? node.id ?? 'unknown'}`);
            }
            if (nodes.length > 50)
                lines.push(`- ... and ${nodes.length - 50} more`);
            lines.push('');
        }
        if (edges.length > 0) {
            lines.push('## Relations');
            for (const edge of edges.slice(0, 50)) {
                const label = edge.label ? ` [${edge.label}]` : '';
                lines.push(`- ${edge.source} →${label} ${edge.target}`);
            }
            if (edges.length > 50)
                lines.push(`- ... and ${edges.length - 50} more`);
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=get-graph.js.map