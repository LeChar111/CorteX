export const searchTool = {
    name: 'search',
    description: 'Search entities and code by keywords using full-text, semantic, or hybrid search.',
    inputSchema: {
        type: 'object',
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
    async handler(args, client, detected) {
        const query = args.query;
        const project = args.project || detected?.projectName;
        const mode = args.mode || 'hybrid';
        const types = args.types;
        const limit = args.limit;
        // Enrich query with type filter to scope results
        let enrichedQuery = query;
        if (types && types.length > 0) {
            enrichedQuery = `[Types: ${types.join(', ')}] ${query}`;
        }
        const result = await client.query(enrichedQuery, { project, mode, limit });
        if (result.response && typeof result.response === 'string') {
            return result.response;
        }
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=search.js.map