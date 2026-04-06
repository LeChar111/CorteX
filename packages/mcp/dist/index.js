import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { CortexClient } from './client.js';
import { detectProject } from './detector.js';
// Read tools
import { queryTool } from './tools/query.js';
import { getContextTool } from './tools/get-context.js';
import { getEntityTool } from './tools/get-entity.js';
import { getGraphTool } from './tools/get-graph.js';
import { searchTool } from './tools/search.js';
// Write tools
import { ingestTool } from './tools/ingest.js';
import { addKnowledgeTool } from './tools/add-knowledge.js';
import { linkTool } from './tools/link.js';
import { scanTool } from './tools/scan.js';
import { syncStatusTool } from './tools/sync-status.js';
import { historyTool } from './tools/history.js';
import { listProjectsTool } from './tools/list-projects.js';
import { impactTool } from './tools/impact.js';
import { annotateTool } from './tools/annotate.js';
import { exportKbTool } from './tools/export-kb.js';
const allTools = [
    queryTool,
    getContextTool,
    getEntityTool,
    getGraphTool,
    searchTool,
    ingestTool,
    addKnowledgeTool,
    linkTool,
    scanTool,
    syncStatusTool,
    historyTool,
    listProjectsTool,
    impactTool,
    annotateTool,
    exportKbTool,
];
const apiUrl = process.env.CORTEX_API_URL || 'http://localhost:3100';
const apiKey = process.env.CORTEX_API_KEY ||
    process.env.API_KEYS?.split(',')[0] ||
    'dev-key-1';
const client = new CortexClient(apiUrl, apiKey);
const server = new Server({ name: 'cortex', version: '1.0.0' }, { capabilities: { tools: {} } });
// List tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools.map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
    })),
}));
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const tool = allTools.find((t) => t.name === name);
    if (!tool) {
        return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
        };
    }
    try {
        // Detect project from CWD (passed by Claude Code)
        const cwd = args?.cwd || process.cwd();
        const detected = await detectProject(cwd, apiUrl, apiKey);
        const result = await tool.handler(args || {}, client, detected);
        return { content: [{ type: 'text', text: result }] };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            content: [{ type: 'text', text: `Error: ${message}` }],
            isError: true,
        };
    }
});
// Start
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Cortex MCP server running on stdio');
}
main().catch((err) => {
    console.error('Fatal:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map