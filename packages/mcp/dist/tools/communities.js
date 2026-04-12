export const communitiesTool = {
    name: 'communities',
    description: 'Get community clusters detected in the codebase. Shows how code is naturally grouped and the cohesion of each cluster.',
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
        const result = await client.getCommunities(projectId);
        const communities = result.communities ?? [];
        if (communities.length === 0)
            return 'No communities found. Run a scan first.';
        const lines = [
            `# Communities (${communities.length} clusters)`,
            '',
        ];
        for (const c of communities) {
            const gods = (c.godNodes ?? []);
            const godStr = gods.length > 0
                ? ` | Hub nodes: ${gods.map(g => g.label).join(', ')}`
                : '';
            lines.push(`- **Community ${c.index}**: ${c.memberCount} members, cohesion ${(c.cohesionScore * 100).toFixed(0)}%${godStr}`);
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=communities.js.map