import Anthropic from '@anthropic-ai/sdk';
import { LightRAGClient } from '../../lightrag/client.js';
const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOOL_ROUNDS = 3;
let client = null;
function getClient() {
    if (!client) {
        client = new Anthropic();
    }
    return client;
}
const lightragUrl = () => process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
const tools = [
    {
        name: 'query_knowledge',
        description: 'Search the knowledge base with a natural language query. Use modes: "mix" for balanced, "naive" for fast fulltext, "local" for semantic, "global" for graph traversal.',
        input_schema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'The search query' },
                mode: { type: 'string', enum: ['mix', 'naive', 'local', 'global'], description: 'Search mode' },
            },
            required: ['query'],
        },
    },
    {
        name: 'search_entities',
        description: 'Get the knowledge graph structure to find entities and their relationships.',
        input_schema: {
            type: 'object',
            properties: {
                label: { type: 'string', description: 'Entity label filter, or * for all' },
            },
            required: [],
        },
    },
];
async function executeTool(name, input) {
    const rag = new LightRAGClient(lightragUrl());
    switch (name) {
        case 'query_knowledge': {
            const mode = input.mode ?? 'mix';
            try {
                return await rag.query(input.query, mode, 10_000);
            }
            catch {
                return 'Knowledge base query timed out or failed.';
            }
        }
        case 'search_entities': {
            try {
                const graph = await rag.getGraphs(input.label ?? '*');
                return JSON.stringify(graph).slice(0, 4000);
            }
            catch {
                return 'Graph query failed.';
            }
        }
        default:
            return `Unknown tool: ${name}`;
    }
}
export async function streamAgent(input, writer) {
    const systemPrompt = buildSystemPrompt(input.context, input.projectName);
    const messages = [
        ...input.history.map((m) => ({
            role: m.role,
            content: m.content,
        })),
        { role: 'user', content: input.message },
    ];
    writer.writeMeta('agent', MODEL);
    try {
        let rounds = 0;
        while (rounds < MAX_TOOL_ROUNDS) {
            const response = await getClient().messages.create({
                model: MODEL,
                max_tokens: 2048,
                system: systemPrompt,
                messages,
                tools,
            });
            // Emit any text blocks
            for (const block of response.content) {
                if (block.type === 'text') {
                    writer.writeToken(block.text);
                }
            }
            // Check for tool use
            const toolBlocks = response.content.filter((b) => b.type === 'tool_use');
            if (toolBlocks.length === 0 || response.stop_reason === 'end_turn') {
                break;
            }
            // Execute tools and continue
            messages.push({ role: 'assistant', content: response.content });
            const toolResults = [];
            for (const tool of toolBlocks) {
                const result = await executeTool(tool.name, tool.input);
                toolResults.push({
                    type: 'tool_result',
                    tool_use_id: tool.id,
                    content: result,
                });
            }
            messages.push({ role: 'user', content: toolResults });
            rounds++;
        }
        writer.writeDone();
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        writer.writeError(`Agent error: ${msg}`);
    }
}
function buildSystemPrompt(context, projectName) {
    let prompt = 'You are Cortex Chat, an advanced code investigation assistant. Use the provided tools to gather information before answering. Be thorough but concise. Reply in the same language as the question.';
    if (projectName) {
        prompt += ` You are investigating the project "${projectName}".`;
    }
    if (context) {
        prompt += `\n\nInitial context from knowledge base:\n${context}`;
    }
    return prompt;
}
//# sourceMappingURL=agent.js.map