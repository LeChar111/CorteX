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
        if (result.length === 0) {
            return 'No projects configured in Cortex.';
        }
        const lines = [`# Projects (${result.length})`, ''];
        for (const p of result) {
            lines.push(`## ${p.name}`);
            if (p.description)
                lines.push(p.description);
            if (p.repos.length > 0) {
                for (const r of p.repos) {
                    const stack = Array.isArray(r.techStack) ? ` [${r.techStack.join(', ')}]` : '';
                    lines.push(`  - ${r.name} (${r.provider ?? 'local'}, branch: ${r.defaultBranch ?? 'main'})${stack}`);
                }
            }
            else {
                lines.push('  - No repositories');
            }
            lines.push('');
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=list-projects.js.map