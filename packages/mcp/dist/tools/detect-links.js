export const detectLinksTool = {
    name: 'detect_cross_project_links',
    description: 'Auto-detect shared entities, imports, and patterns between two projects. Suggests a link type and can auto-create a project link.',
    inputSchema: {
        type: 'object',
        properties: {
            sourceProjectId: { type: 'string', description: 'Source project UUID' },
            targetProjectId: { type: 'string', description: 'Target project UUID' },
            autoLink: {
                type: 'boolean',
                description: 'If true, automatically create a project link based on detection results (default: false)',
            },
        },
        required: ['sourceProjectId', 'targetProjectId'],
    },
    async handler(args, client, _detected) {
        const sourceProjectId = args.sourceProjectId;
        const targetProjectId = args.targetProjectId;
        const autoLink = args.autoLink;
        const result = await client.detectCrossProjectLinks(sourceProjectId, targetProjectId);
        const analysis = result.analysis ?? {};
        const sharedEntities = analysis.sharedEntities ?? [];
        const sharedImports = analysis.sharedImports ?? [];
        const lines = [
            `# Cross-Project Link Detection`,
            '',
            `**${result.sourceProject?.name ?? sourceProjectId}** (${result.sourceProject?.nodeCount ?? '?'} nodes) ↔ **${result.targetProject?.name ?? targetProjectId}** (${result.targetProject?.nodeCount ?? '?'} nodes)`,
            '',
        ];
        if (sharedEntities.length > 0) {
            lines.push(`## Shared Entities (${analysis.sharedEntityCount ?? sharedEntities.length})`);
            for (const e of sharedEntities.slice(0, 20)) {
                lines.push(`- **${e.name}** (${e.matchType})`);
            }
            if (sharedEntities.length > 20) {
                lines.push(`- ... and ${sharedEntities.length - 20} more`);
            }
            lines.push('');
        }
        if (sharedImports.length > 0) {
            lines.push(`## Shared Imports (${analysis.sharedImportCount ?? sharedImports.length})`);
            for (const imp of sharedImports.slice(0, 15)) {
                lines.push(`- ${imp}`);
            }
            if (sharedImports.length > 15) {
                lines.push(`- ... and ${sharedImports.length - 15} more`);
            }
            lines.push('');
        }
        lines.push(`**Overlap**: ${analysis.overlapRatio ?? 0}%`);
        lines.push(`**Suggested link type**: ${analysis.suggestedLinkType ?? 'related'}`);
        lines.push('');
        lines.push(result.recommendation ?? 'No significant overlap detected.');
        // Auto-link if requested
        if (autoLink && (sharedEntities.length > 0 || sharedImports.length > 3)) {
            const linkType = analysis.suggestedLinkType ?? 'related';
            await client.autoLinkProjects(sourceProjectId, targetProjectId, linkType);
            lines.push('');
            lines.push(`✓ Projects linked with type '${linkType}'.`);
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=detect-links.js.map