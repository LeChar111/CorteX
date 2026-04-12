export const historyTool = {
    name: 'history',
    description: 'Get the history of changes for the project: scans, entity updates, ingestions.',
    inputSchema: {
        type: 'object',
        properties: {
            entityName: { type: 'string', description: 'Filter history for a specific entity (optional)' },
            limit: { type: 'number', description: 'Maximum number of events to return (default: 20)' },
            project: { type: 'string', description: 'Project name (auto-detected if omitted)' },
        },
        required: [],
    },
    async handler(args, client, detected) {
        const projectName = args.project;
        const limit = args.limit || 20;
        let projectId;
        if (projectName) {
            // Resolve project name to projectId
            const projects = await client.listProjects();
            const project = projects.find(p => p.name.toLowerCase() === projectName.toLowerCase());
            if (!project) {
                throw new Error(`Project "${projectName}" not found`);
            }
            projectId = project.id;
        }
        else if (detected) {
            projectId = detected.projectId;
        }
        const result = await client.getEvents({ projectId, limit });
        if (!result || result.length === 0) {
            return 'No history events found.';
        }
        const lines = [`# History (${result.length} events)`, ''];
        for (const event of result) {
            const date = event.createdAt ? new Date(event.createdAt).toLocaleString() : '?';
            const type = event.type ?? 'unknown';
            const detail = event.payload
                ? Object.entries(event.payload).map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`).join(', ')
                : '';
            lines.push(`- **${type}** ${date}${detail ? ' — ' + detail : ''}`);
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=history.js.map