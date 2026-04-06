export const linkTool = {
    name: 'link',
    description: 'Create a relation between two existing entities.',
    inputSchema: {
        type: 'object',
        properties: {
            source: { type: 'string', description: 'Name of the source entity' },
            target: { type: 'string', description: 'Name of the target entity' },
            type: { type: 'string', description: 'Type of relation (e.g. "uses", "depends_on", "calls")' },
            description: { type: 'string', description: 'Optional description of the relation' },
        },
        required: ['source', 'target', 'type'],
    },
    async handler(args, client, _detected) {
        const source = args.source;
        const target = args.target;
        const relationType = args.type;
        const description = args.description;
        const result = await client.ingest({
            content: description || '',
            source,
            target,
            relationType,
            type: 'relation',
        });
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=link.js.map