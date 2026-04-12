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
        const lines = ['# Sync Status', ''];
        if (result.entityCount !== undefined || result.relationCount !== undefined) {
            lines.push(`**Entities:** ${result.entityCount ?? 0} | **Relations:** ${result.relationCount ?? 0}`);
            lines.push('');
        }
        if (result.running && result.running.length > 0) {
            lines.push('## Running Jobs');
            for (const j of result.running) {
                lines.push(`- ${j.branch ?? 'unknown'} (${j.mode ?? 'full'}) started ${j.startedAt ?? '?'}`);
            }
            lines.push('');
        }
        else {
            lines.push('No running jobs.');
            lines.push('');
        }
        if (result.lastCompleted) {
            lines.push(`**Last completed:** ${result.lastCompleted.completedAt ?? 'unknown'}`);
        }
        // Include any extra fields as fallback
        const knownKeys = new Set(['running', 'lastCompleted', 'entityCount', 'relationCount']);
        const extraKeys = Object.keys(result).filter(k => !knownKeys.has(k));
        if (extraKeys.length > 0) {
            lines.push('', '## Details');
            for (const k of extraKeys) {
                lines.push(`- **${k}:** ${JSON.stringify(result[k])}`);
            }
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=sync-status.js.map