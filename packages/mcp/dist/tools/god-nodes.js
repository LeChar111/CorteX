export const godNodesTool = {
    name: 'god_nodes',
    description: 'Get the most connected entities in the codebase (architectural hubs). These are the components with the most relationships.',
    inputSchema: {
        type: 'object',
        properties: {
            projectId: { type: 'string', description: 'Project UUID (auto-detected if not provided)' },
        },
    },
    async handler(args, client, detected) {
        const projectId = args.projectId || detected?.projectId;
        if (!projectId)
            return 'No project detected. Provide a projectId.';
        const result = await client.getGodNodes(projectId);
        const gods = result.godNodes ?? [];
        if (gods.length === 0)
            return 'No god nodes found. Run a scan first.';
        const lines = [
            `# God Nodes (top ${gods.length} architectural hubs)`,
            '',
            '| Entity | Connections | Community |',
            '|--------|------------|-----------|',
        ];
        for (const g of gods) {
            lines.push(`| ${g.label} | ${g.edges} | ${g.communityId ?? '-'} |`);
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=god-nodes.js.map