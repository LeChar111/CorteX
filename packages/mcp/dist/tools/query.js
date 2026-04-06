export const queryTool = {
    name: 'query',
    description: 'Search the knowledge base using semantic + graph search. Returns relevant code chunks, entities, and relations.',
    inputSchema: {
        type: 'object',
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
    async handler(args, client, detected) {
        const query = args.query;
        const project = args.project || detected?.projectName;
        const mode = args.mode || 'mix';
        const result = await client.query(query, { project, mode });
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=query.js.map