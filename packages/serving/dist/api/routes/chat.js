import { Hono } from 'hono';
import { z } from 'zod';
import { createAssistantStreamResponse } from 'assistant-stream';
import { routeQuery } from '../../chat/router.js';
import { buildContext } from '../../chat/context.js';
import { streamOllama } from '../../chat/engines/ollama.js';
import { streamHaiku } from '../../chat/engines/haiku.js';
import { streamAgent } from '../../chat/engines/agent.js';
export const chatRouter = new Hono();
const TextPartSchema = z.object({ type: z.literal('text'), text: z.string() });
const MessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.union([z.string(), z.array(TextPartSchema.passthrough())]),
});
const ChatSchema = z.object({
    messages: z.array(MessageSchema).min(1).max(50),
    projectId: z.string().uuid().optional(),
    mode: z.enum(['auto', 'fast', 'smart', 'agent']).default('auto'),
});
function extractText(content) {
    if (typeof content === 'string')
        return content;
    return content
        .filter((p) => p.type === 'text')
        .map((p) => p.text)
        .join('');
}
chatRouter.post('/chat', async (c) => {
    const body = await c.req.json();
    const parsed = ChatSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
    }
    const { messages, projectId, mode } = parsed.data;
    const flat = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: extractText(m.content) }));
    const last = flat[flat.length - 1];
    if (!last || last.role !== 'user' || !last.content.trim()) {
        return c.json({ error: 'Last message must be a non-empty user message' }, 400);
    }
    const userMessage = last.content;
    const history = flat.slice(0, -1).slice(-20);
    const resolvedMode = mode === 'auto' ? routeQuery(userMessage, !!projectId) : mode;
    const ragMode = resolvedMode === 'fast' ? 'naive' : 'mix';
    const { context, sources, projectName } = await buildContext(userMessage, projectId, ragMode);
    const engineInput = { message: userMessage, history, context, projectName };
    return createAssistantStreamResponse(async (controller) => {
        let engineEmittedSources = false;
        const writer = {
            writeMeta(m, model) {
                controller.appendData({ type: 'data', name: 'meta', data: { mode: m, model } });
            },
            writeToken(text) {
                if (text)
                    controller.appendText(text);
            },
            writeSources(srcs) {
                engineEmittedSources = true;
                srcs.forEach((s, i) => controller.appendSource({
                    type: 'source',
                    sourceType: 'url',
                    id: `engine-${i}`,
                    url: s,
                    title: s,
                }));
            },
            writeDone() {
                // no-op: stream closes when callback resolves
            },
            writeError(msgText) {
                controller.appendData({ type: 'data', name: 'error', data: { message: msgText } });
            },
        };
        try {
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
            if (!engineEmittedSources && sources.length > 0) {
                sources.forEach((s, i) => controller.appendSource({
                    type: 'source',
                    sourceType: 'url',
                    id: `ctx-${i}`,
                    url: s,
                    title: s,
                }));
            }
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            controller.appendData({ type: 'data', name: 'error', data: { message: msg } });
        }
    });
});
//# sourceMappingURL=chat.js.map