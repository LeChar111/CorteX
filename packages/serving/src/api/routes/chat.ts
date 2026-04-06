import { Hono } from 'hono';
import { z } from 'zod';
import { streamSSE } from 'hono/streaming';
import { routeQuery } from '../../chat/router.js';
import { buildContext } from '../../chat/context.js';
import { streamOllama } from '../../chat/engines/ollama.js';
import { streamHaiku } from '../../chat/engines/haiku.js';
import { streamAgent } from '../../chat/engines/agent.js';
import type { ResolvedMode, SSEWriter } from '../../chat/types.js';

export const chatRouter = new Hono();

const ChatSchema = z.object({
  message: z.string().min(1).max(4000),
  projectId: z.string().uuid().optional(),
  mode: z.enum(['auto', 'fast', 'smart', 'agent']).default('auto'),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() }))
    .max(20)
    .default([]),
});

chatRouter.post('/chat', async (c) => {
  const body = await c.req.json();
  const parsed = ChatSchema.safeParse(body);

  if (!parsed.success) {
    return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
  }

  const { message, projectId, mode, history } = parsed.data;

  // Resolve mode
  const resolvedMode: ResolvedMode =
    mode === 'auto' ? routeQuery(message, !!projectId) : mode;

  // Build RAG context (lightweight for fast, full for smart/agent)
  const ragMode = resolvedMode === 'fast' ? 'naive' : 'mix';
  const { context, sources, projectName } = await buildContext(message, projectId, ragMode);

  const engineInput = { message, history, context, projectName };

  return streamSSE(c, async (stream) => {
    const writer: SSEWriter = {
      writeMeta(m, model) {
        stream.writeSSE({ event: 'meta', data: JSON.stringify({ mode: m, model }) });
      },
      writeToken(text) {
        stream.writeSSE({ event: 'token', data: JSON.stringify({ text }) });
      },
      writeSources(srcs) {
        stream.writeSSE({ event: 'sources', data: JSON.stringify({ sources: srcs }) });
      },
      writeDone() {
        if (sources.length > 0) {
          stream.writeSSE({ event: 'sources', data: JSON.stringify({ sources }) });
        }
        stream.writeSSE({ event: 'done', data: '{}' });
      },
      writeError(msg) {
        stream.writeSSE({ event: 'error', data: JSON.stringify({ message: msg }) });
      },
    };

    switch (resolvedMode) {
      case 'fast':
        await streamOllama(engineInput, writer);
        break;
      case 'smart':
        await streamHaiku(engineInput, writer);
        break;
      case 'agent':
        await streamAgent(engineInput, writer);
        break;
    }
  });
});
