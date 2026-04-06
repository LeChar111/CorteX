export const listProjectsTool = {
    name: 'list_projects',
    description: 'List all projects and repositories configured in Cortex.',
    inputSchema: {
        type: 'object',
        properties: {},
        required: [],
    },
    async handler(_args, client, _detected) {
        const projects = await client.listProjects();
        const result = await Promise.all(projects.map(async (project) => {
            const repos = await client.getRepos(project.id);
            return { ...project, repos };
        }));
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=list-projects.js.map