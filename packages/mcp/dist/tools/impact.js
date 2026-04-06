export const impactTool = {
    name: 'impact-analysis',
    description: 'Analyze the impact of changes to a file across the codebase. Shows direct and transitive dependencies affected.',
    inputSchema: {
        type: 'object',
        properties: {
            filePath: { type: 'string', description: 'Path of the file to analyze impact for' },
            projectId: { type: 'string', description: 'Project ID (auto-detected if omitted)' },
        },
        required: ['filePath'],
    },
    async handler(args, client, detected) {
        const filePath = args.filePath;
        const projectId = args.projectId || detected?.projectId;
        const result = (await client.impactAnalysis({ filePath, projectId }));
        const lines = ['# Impact Analysis', `File: ${filePath}`, ''];
        if (result.directImpact && Array.isArray(result.directImpact)) {
            lines.push(`## Direct Impact (${result.directImpact.length} files)`);
            for (const item of result.directImpact) {
                lines.push(`- ${typeof item === 'string' ? item : JSON.stringify(item)}`);
            }
            lines.push('');
        }
        if (result.transitiveImpact && Array.isArray(result.transitiveImpact)) {
            lines.push(`## Transitive Impact (${result.transitiveImpact.length} files)`);
            for (const item of result.transitiveImpact) {
                lines.push(`- ${typeof item === 'string' ? item : JSON.stringify(item)}`);
            }
            lines.push('');
        }
        lines.push('## Raw Analysis');
        lines.push(JSON.stringify(result, null, 2));
        return lines.join('\n');
    },
};
//# sourceMappingURL=impact.js.map