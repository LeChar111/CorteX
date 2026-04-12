import { getDb, getProjectById, searchGraphNodes, getGraphAroundEntity } from '@cortex/db';
export async function buildContext(message, projectId, _mode = 'mix') {
    let projectName;
    if (projectId) {
        const db = getDb();
        const project = await getProjectById(db, projectId);
        if (project) {
            projectName = project.name;
        }
    }
    try {
        const db = getDb();
        // Search graph nodes matching the message
        const nodes = await searchGraphNodes(db, message, projectId, 10);
        if (nodes.length === 0) {
            return { context: '', sources: [], projectName };
        }
        // Get graph context around the top matches
        const topMatches = nodes.slice(0, 3);
        const contextParts = [];
        const sources = [];
        for (const node of topMatches) {
            const graph = await getGraphAroundEntity(db, node.label, 1);
            const relations = graph.edges.map((e) => {
                const src = graph.nodes.find((n) => n.id === e.sourceNodeId);
                const tgt = graph.nodes.find((n) => n.id === e.targetNodeId);
                return `  ${src?.label ?? e.sourceNodeId} --[${e.relation}]--> ${tgt?.label ?? e.targetNodeId}`;
            });
            contextParts.push(`**${node.label}** (${node.type})${node.sourceFile ? ` in \`${node.sourceFile}\`` : ''}` +
                (relations.length > 0 ? `\n${relations.join('\n')}` : ''));
            if (node.sourceFile) {
                sources.push(node.sourceFile);
            }
        }
        return {
            context: contextParts.join('\n\n'),
            sources: [...new Set(sources)].slice(0, 10),
            projectName,
        };
    }
    catch {
        // Graph query failed -- return empty context
        return { context: '', sources: [], projectName };
    }
}
//# sourceMappingURL=context.js.map