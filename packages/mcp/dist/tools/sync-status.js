export const syncStatusTool = {
    name: 'sync_status',
    description: 'Get the synchronization status: last scan, running jobs, entity/relation counts.',
    inputSchema: {
        type: 'object',
        properties: {
            project: { type: 'string', description: 'Project name (auto-detected if omitted)' },
        },
        required: [],
    },
    async handler(args, client, detected) {
        const projectName = args.project;
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
        const result = await client.getScanStatus(projectId);
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=sync-status.js.map