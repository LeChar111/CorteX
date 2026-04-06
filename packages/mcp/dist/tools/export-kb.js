export const exportKbTool = {
    name: 'export-kb',
    description: 'Export the entire knowledge base as a JSON snapshot. Returns a summary of the exported data.',
    inputSchema: {
        type: 'object',
        properties: {},
        required: [],
    },
    async handler(_args, client, _detected) {
        const result = (await client.exportKb());
        const projectCount = result.projects?.length ?? 0;
        const documentCount = result.documents?.length ?? 0;
        const nodeCount = result.graph?.nodes?.length ?? 0;
        const edgeCount = result.graph?.edges?.length ?? 0;
        const lines = [
            '# Knowledge Base Export',
            '',
            `Exported snapshot with ${projectCount} projects, ${documentCount} documents, ${nodeCount} graph nodes, ${edgeCount} graph edges.`,
            '',
            'The full export data is available via the API at GET /api/export.',
        ];
        // Include top-level keys for reference
        const keys = Object.keys(result);
        if (keys.length > 0) {
            lines.push('', '## Export sections');
            for (const key of keys) {
                const val = result[key];
                const count = Array.isArray(val) ? ` (${val.length} items)` : '';
                lines.push(`- ${key}${count}`);
            }
        }
        return lines.join('\n');
    },
};
//# sourceMappingURL=export-kb.js.map