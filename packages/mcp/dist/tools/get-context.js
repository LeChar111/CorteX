export const getContextTool = {
    name: 'get_context',
    description: 'Load the full context of the current project. Returns architecture, endpoints, DB schemas, dependencies, and inter-repo connections.',
    inputSchema: {
        type: 'object',
        properties: {
            cwd: { type: 'string', description: 'Working directory (auto-detected if omitted)' },
            focus: {
                type: 'string',
                description: 'Specific area to focus on (e.g. "authentication", "database")',
            },
            maxTokens: { type: 'number', description: 'Maximum tokens for the response' },
        },
        required: [],
    },
    async handler(args, client, detected) {
        const focus = args.focus;
        const project = detected?.projectName;
        const baseQuery = 'architecture overview and key components';
        const query = focus ? `${focus}: ${baseQuery}` : baseQuery;
        const result = await client.query(query, { project, mode: 'mix' });
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=get-context.js.map