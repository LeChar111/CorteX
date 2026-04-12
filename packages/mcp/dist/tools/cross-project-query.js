export const crossProjectQueryTool = {
    name: 'cross_project_query',
    description: 'Search across the current project and all its linked projects. Combines semantic search with actual cross-project graph traversal.',
    inputSchema: {
        type: 'object',
        properties: {
            query: { type: 'string', description: 'Natural language question or search query' },
            project: { type: 'string', description: 'Project name (auto-detected if omitted)' },
            mode: {
                type: 'string',
                enum: ['mix', 'local', 'global', 'naive'],
                description: 'Search mode (default: mix)',
            },
            entity: {
                type: 'string',
                description: 'Optional entity name to center the cross-project graph traversal on',
            },
            depth: {
                type: 'number',
                description: 'Graph traversal depth for entity-centered queries (default: 2)',
            },
        },
        required: ['query'],
    },
    async handler(args, client, detected) {
        const query = args.query;
        const project = args.project || detected?.projectName;
        const mode = args.mode || 'mix';
        const entityName = args.entity;
        const depth = args.depth || 2;
        const projectId = detected?.projectId;
        const lines = [`# Cross-Project Search: ${query}`, ''];
        // 1. Semantic search across linked projects
        const semanticResult = await client.query(query, {
            project,
            mode,
            projectId,
            includeLinked: true,
        });
        if (semanticResult.response && typeof semanticResult.response === 'string') {
            lines.push('## Semantic Results');
            lines.push(semanticResult.response);
            lines.push('');
        }
        // 2. If projectId available, do actual cross-project graph traversal
        if (projectId) {
            try {
                const graphResult = await client.getCrossProjectGraph(projectId, entityName ?? query.split(' ').slice(0, 3).join(' '), depth);
                const nodes = graphResult.nodes ?? [];
                const edges = graphResult.edges ?? [];
                const crossEdges = graphResult.crossProjectEdges ?? 0;
                if (nodes.length > 0) {
                    lines.push('## Graph Traversal');
                    lines.push(`${nodes.length} entities found across ${graphResult.projectCount ?? 1} project(s), ${crossEdges} cross-project edges`);
                    lines.push('');
                    // Show cross-project entities
                    const crossNodes = nodes.filter((n) => n._isCrossProject);
                    if (crossNodes.length > 0) {
                        lines.push('### Cross-Project Entities');
                        for (const n of crossNodes.slice(0, 20)) {
                            lines.push(`- **${n.label ?? n.id ?? 'unknown'}** (project: ${n._project ?? '?'})`);
                        }
                        if (crossNodes.length > 20)
                            lines.push(`- ... and ${crossNodes.length - 20} more`);
                        lines.push('');
                    }
                    // Show edges
                    if (edges.length > 0) {
                        lines.push('### Key Relations');
                        for (const e of edges.slice(0, 15)) {
                            const label = e.label ? ` [${e.label}]` : '';
                            lines.push(`- ${e.source} →${label} ${e.target}`);
                        }
                        if (edges.length > 15)
                            lines.push(`- ... and ${edges.length - 15} more`);
                    }
                }
            }
            catch {
                // Graph traversal failed, semantic results are still available
            }
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=cross-project-query.js.map