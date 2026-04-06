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
    async handler(args, _client, _detected) {
        const result = await _client.getGraph();
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=get-graph.js.map