export const linkTool = {
    name: 'link',
    description: 'Create a structural relation between two entities directly in the knowledge graph.',
    inputSchema: {
        type: 'object',
        properties: {
            source: { type: 'string', description: 'Name of the source entity' },
            target: { type: 'string', description: 'Name of the target entity' },
            type: { type: 'string', description: 'Type of relation (e.g. "uses", "depends_on", "calls", "imports", "extends")' },
            description: { type: 'string', description: 'Optional description of the relation' },
        },
        required: ['source', 'target', 'type'],
    },
    async handler(args, client, detected) {
        const source = args.source;
        const target = args.target;
        const relationType = args.type;
        const description = args.description;
        const sourceExists = await client.entityExists(source);
        const targetExists = await client.entityExists(target);
        const created = [];
        if (!sourceExists) {
            await client.createGraphEntity({
                name: source,
                type: 'ENTITY',
                description: source,
                projectId: detected?.projectId,
                projectName: detected?.projectName,
            });
            created.push(source);
        }
        if (!targetExists) {
            await client.createGraphEntity({
                name: target,
                type: 'ENTITY',
                description: target,
                projectId: detected?.projectId,
                projectName: detected?.projectName,
            });
            created.push(target);
        }
        await client.createGraphRelation({
            source,
            target,
            type: relationType,
            description: description ?? `${source} ${relationType} ${target}`,
            projectId: detected?.projectId,
        });
        const createdMsg = created.length > 0 ? ` (created entities: ${created.join(', ')})` : '';
        return `Relation created: ${source} --[${relationType}]--> ${target}${createdMsg}`;
    },
};
//# sourceMappingURL=link.js.map