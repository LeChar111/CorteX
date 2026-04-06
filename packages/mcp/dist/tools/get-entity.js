export const getEntityTool = {
    name: 'get_entity',
    description: 'Get details of a specific entity (endpoint, table, service, etc.) and all its direct relations.',
    inputSchema: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Name of the entity to look up' },
            type: {
                type: 'string',
                description: 'Type of entity (e.g. "endpoint", "table", "service")',
            },
        },
        required: ['name'],
    },
    async handler(args, client, detected) {
        const name = args.name;
        const project = detected?.projectName;
        const result = await client.query(name, { project, mode: 'local' });
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=get-entity.js.map