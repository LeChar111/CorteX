export const addKnowledgeTool = {
    name: 'add_knowledge',
    description: 'Manually add knowledge to the graph. Useful for architecture decisions, conventions, or information not in code.',
    inputSchema: {
        type: 'object',
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
    async handler(args, client, detected) {
        const name = args.name;
        const description = args.description;
        const project = args.project || detected?.projectName;
        const result = await client.ingest({
            content: description,
            name,
            type: 'knowledge',
            project,
        });
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=add-knowledge.js.map