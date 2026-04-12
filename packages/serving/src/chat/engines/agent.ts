import Anthropic from '@anthropic-ai/sdk';
import { getDb, searchGraphNodes, getGraphAroundEntity } from '@cortex/db';
import type { EngineInput, SSEWriter } from '../types.js';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOOL_ROUNDS = 3;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

const tools: Anthropic.Tool[] = [
  {
    name: 'query_knowledge',
    description: 'Search the knowledge graph with a natural language query. Returns matching entities and their relationships.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'The search query' },
        limit: { type: 'number', description: 'Max results (default 20)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'search_entities',
    description: 'Get the knowledge graph structure around an entity to find its relationships.',
    input_schema: {
      type: 'object' as const,
      properties: {
        label: { type: 'string', description: 'Entity label to explore' },
        depth: { type: 'number', description: 'Graph traversal depth (default 1)' },
      },
      required: ['label'],
    },
  },
];

async function executeTool(name: string, input: Record<string, unknown>): Promise<string> {
  const db = getDb();

  switch (name) {
    case 'query_knowledge': {
      try {
        const limit = (input.limit as number) ?? 20;
        const nodes = await searchGraphNodes(db, input.query as string, undefined, limit);
        if (nodes.length === 0) return 'No matching entities found.';
        const summaries = nodes.map((n) => {
          const props = (n.properties ?? {}) as Record<string, unknown>;
          return `- **${n.label}** (${n.type})${n.sourceFile ? ` in \`${n.sourceFile}\`` : ''}: ${String(props.description ?? '')}`;
        });
        return `Found ${nodes.length} entities:\n${summaries.join('\n')}`;
      } catch {
        return 'Knowledge graph query failed.';
      }
    }
    case 'search_entities': {
      try {
        const depth = (input.depth as number) ?? 1;
        const graph = await getGraphAroundEntity(db, input.label as string, depth);
        return JSON.stringify({
          nodes: graph.nodes.map((n) => ({ id: n.id, label: n.label, type: n.type })),
          edges: graph.edges.map((e) => ({ source: e.sourceNodeId, target: e.targetNodeId, relation: e.relation })),
        }).slice(0, 4000);
      } catch {
        return 'Graph query failed.';
      }
    }
    default:
      return `Unknown tool: ${name}`;
  }
}

export async function streamAgent(input: EngineInput, writer: SSEWriter): Promise<void> {
  const systemPrompt = buildSystemPrompt(input.context, input.projectName);

  const messages: Anthropic.MessageParam[] = [
    ...input.history.map((m) => ({
      role: m.role as 'user' | 'assistant',
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
      const toolBlocks = response.content.filter(
        (b): b is Anthropic.ContentBlock & { type: 'tool_use' } => b.type === 'tool_use',
      );

      if (toolBlocks.length === 0 || response.stop_reason === 'end_turn') {
        break;
      }

      // Execute tools and continue
      messages.push({ role: 'assistant', content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const tool of toolBlocks) {
        const result = await executeTool(tool.name, tool.input as Record<string, unknown>);
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    writer.writeError(`Agent error: ${msg}`);
  }
}

function buildSystemPrompt(context: string, projectName?: string): string {
  let prompt = 'You are Cortex Chat, an advanced code investigation assistant. Use the provided tools to gather information before answering. Be thorough but concise. Reply in the same language as the question.';
  if (projectName) {
    prompt += ` You are investigating the project "${projectName}".`;
  }
  if (context) {
    prompt += `\n\nInitial context from knowledge graph:\n${context}`;
  }
  return prompt;
}
