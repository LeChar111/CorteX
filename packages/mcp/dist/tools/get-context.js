export const getContextTool = {
    name: 'get_context',
    description: 'Load the full context of the current project. Returns architecture, repos, tech stack, graph summary, linked projects, architecture rules, and annotations.',
    inputSchema: {
        type: 'object',
        properties: {
            cwd: { type: 'string', description: 'Working directory (auto-detected if omitted)' },
            focus: {
                type: 'string',
                description: 'Specific area to focus on (e.g. "authentication", "database")',
            },
        },
        required: [],
    },
    async handler(args, client, detected) {
        const focus = args.focus;
        const projectRef = detected?.projectName ?? detected?.projectId;
        if (!projectRef) {
            return 'Could not detect current project. Make sure you are in a git repository that has been registered in Cortex.';
        }
        const ctx = await client.getContext(projectRef, focus);
        const lines = [];
        const p = ctx.project;
        lines.push(`# ${p?.name ?? projectRef}`);
        if (p?.description)
            lines.push(p.description);
        lines.push('');
        // Repos
        const repos = ctx.repos ?? [];
        if (repos.length > 0) {
            lines.push('## Repositories');
            for (const r of repos) {
                const stack = Array.isArray(r.techStack) ? r.techStack.join(', ') : '';
                const scanned = r.lastScannedAt ? ` (last scan: ${r.lastScannedAt})` : ' (not scanned)';
                lines.push(`- **${r.name}** [${r.provider}] ${stack}${scanned}`);
            }
            lines.push('');
        }
        // Graph summary
        const gs = ctx.graphSummary;
        if (gs && gs.entityCount) {
            lines.push('## Knowledge Graph');
            lines.push(`${gs.entityCount} entities, ${gs.edgeCount} edges`);
            if (gs.topTypes) {
                const types = Object.entries(gs.topTypes).sort((a, b) => b[1] - a[1]).slice(0, 10);
                lines.push(types.map(([t, c]) => `${t}: ${c}`).join(', '));
            }
            lines.push('');
        }
        // Linked projects
        const linked = ctx.linkedProjects ?? [];
        if (linked.length > 0) {
            lines.push('## Linked Projects');
            for (const l of linked)
                lines.push(`- ${l.name} (${l.linkType}, ${l.direction})`);
            lines.push('');
        }
        // Architecture rules
        const rules = ctx.archRules ?? [];
        if (rules.length > 0) {
            lines.push('## Architecture Rules');
            for (const r of rules)
                lines.push(`- [${r.severity}] **${r.name}**: ${r.description}`);
            lines.push('');
        }
        // Annotations
        const anns = ctx.annotations ?? [];
        if (anns.length > 0) {
            lines.push('## Annotations');
            for (const a of anns)
                lines.push(`- [${a.type}] ${a.entity}: ${a.content}`);
            lines.push('');
        }
        // Focused context from knowledge graph
        if (ctx.focusedContext) {
            lines.push(`## Focus: ${focus}`);
            lines.push(ctx.focusedContext);
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=get-context.js.map