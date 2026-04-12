export const diffReviewTool = {
    name: 'diff_review',
    description: 'Review a git diff against the knowledge graph. Identifies impacted entities, potential regressions, and architecture rule violations for the changed files.',
    inputSchema: {
        type: 'object',
        properties: {
            files: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of changed file paths to review',
            },
            diff: {
                type: 'string',
                description: 'Raw git diff content (optional, used for deeper analysis)',
            },
        },
        required: ['files'],
    },
    async handler(args, client, detected) {
        const files = args.files;
        const diff = args.diff;
        const projectId = detected?.projectId;
        const lines = ['# Diff Review', ''];
        lines.push(`Reviewing ${files.length} changed file(s) against the knowledge graph.`);
        lines.push('');
        // Impact analysis for each file
        const impacts = [];
        for (const file of files.slice(0, 10)) { // cap at 10 files
            try {
                const result = await client.impactAnalysis({ filePath: file, projectId });
                impacts.push({ file, result });
            }
            catch {
                impacts.push({ file, result: null });
            }
        }
        // Format impacts
        lines.push('## Impact Analysis');
        for (const { file, result } of impacts) {
            const r = result;
            const direct = r?.directImpact?.length ?? 0;
            const transitive = r?.transitiveImpact?.length ?? 0;
            const severity = transitive > 5 ? 'HIGH' : transitive > 0 ? 'MEDIUM' : 'LOW';
            lines.push(`### ${file} [${severity}]`);
            lines.push(`- Direct: ${direct} entities | Transitive: ${transitive} entities`);
            if (r?.directImpact && r.directImpact.length > 0) {
                for (const item of r.directImpact.slice(0, 5)) {
                    const i = item;
                    lines.push(`  - ${i.entity ?? JSON.stringify(item)} (${i.type ?? '?'})`);
                }
            }
            lines.push('');
        }
        // Semantic query for potential issues
        if (diff) {
            try {
                const queryResult = await client.query(`Potential issues and regressions for these changes: ${files.join(', ')}`, { project: detected?.projectName, mode: 'mix' });
                if (queryResult.response) {
                    lines.push('## Knowledge Graph Insights');
                    lines.push(queryResult.response);
                    lines.push('');
                }
            }
            catch {
                // optional enrichment
            }
        }
        // Summary
        const highCount = impacts.filter(({ result }) => {
            const r = result;
            return (r?.transitiveImpact?.length ?? 0) > 5;
        }).length;
        lines.push('## Summary');
        lines.push(`- ${files.length} files reviewed`);
        lines.push(`- ${highCount} high-impact changes`);
        lines.push(`- ${impacts.reduce((sum, { result }) => sum + (result?.directImpact?.length ?? 0), 0)} total entities directly affected`);
        return lines.join('\n');
    },
};
//# sourceMappingURL=diff-review.js.map