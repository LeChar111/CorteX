export const ingestTool = {
    name: 'ingest',
    description: 'Submit code or documentation for ingestion into the knowledge graph.',
    inputSchema: {
        type: 'object',
        properties: {
            content: { type: 'string', description: 'The code or documentation content to ingest' },
            filePath: { type: 'string', description: 'File path where the content originates from' },
            language: { type: 'string', description: 'Programming language of the content (optional)' },
            project: { type: 'string', description: 'Project name (auto-detected if omitted)' },
        },
        required: ['content', 'filePath'],
    },
    async handler(args, client, detected) {
        const content = args.content;
        const filePath = args.filePath;
        const language = args.language;
        const project = args.project || detected?.projectName;
        const result = await client.ingest({ content, filePath, language, project, type: 'code' });
        return JSON.stringify(result, null, 2);
    },
};
//# sourceMappingURL=ingest.js.map