export const annotateTool = {
    name: 'annotate',
    description: 'Add or list annotations on knowledge graph entities. Use action "list" to view existing annotations or "add" to create a new one.',
    inputSchema: {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['add', 'list'],
                description: 'Whether to add a new annotation or list existing ones',
            },
            entityName: { type: 'string', description: 'Name of the entity to annotate' },
            type: { type: 'string', description: 'Annotation type (e.g. "note", "warning", "todo") — used with action "add"' },
            content: { type: 'string', description: 'Annotation content — used with action "add"' },
            projectId: { type: 'string', description: 'Project ID (auto-detected if omitted)' },
        },
        required: ['action', 'entityName'],
    },
    async handler(args, client, detected) {
        const action = args.action;
        const entityName = args.entityName;
        const projectId = args.projectId || detected?.projectId;
        if (action === 'list') {
            const annotations = await client.listAnnotations(entityName);
            if (!annotations || annotations.length === 0) {
                return `No annotations found for entity "${entityName}".`;
            }
            const lines = [`# Annotations for "${entityName}"`, ''];
            for (const ann of annotations) {
                const typeLabel = ann.type ? `[${ann.type}]` : '';
                const date = ann.createdAt ? ` (${ann.createdAt})` : '';
                lines.push(`- ${typeLabel} ${ann.content || JSON.stringify(ann)}${date}`);
            }
            return lines.join('\n');
        }
        if (action === 'add') {
            const type = args.type;
            const content = args.content;
            if (!content) {
                throw new Error('content is required when action is "add"');
            }
            const result = await client.addAnnotation({ entityName, type, content, projectId });
            return `Annotation added to "${entityName}": ${JSON.stringify(result, null, 2)}`;
        }
        throw new Error(`Unknown action "${action}". Use "add" or "list".`);
    },
};
//# sourceMappingURL=annotate.js.map