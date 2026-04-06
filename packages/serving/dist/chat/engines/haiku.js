import Anthropic from '@anthropic-ai/sdk';
const MODEL = 'claude-haiku-4-5-20251001';
let client = null;
function getClient() {
    if (!client) {
        client = new Anthropic();
    }
    return client;
}
export async function streamHaiku(input, writer) {
    const systemPrompt = buildSystemPrompt(input.context, input.projectName);
    const messages = [
        ...input.history.map((m) => ({
            role: m.role,
            content: m.content,
        })),
        { role: 'user', content: input.message },
    ];
    writer.writeMeta('smart', MODEL);
    try {
        const stream = getClient().messages.stream({
            model: MODEL,
            max_tokens: 2048,
            system: systemPrompt,
            messages,
        });
        for await (const event of stream) {
            if (event.type === 'content_block_delta' &&
                event.delta.type === 'text_delta') {
                writer.writeToken(event.delta.text);
            }
        }
        writer.writeDone();
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        writer.writeError(`Haiku error: ${msg}`);
    }
}
function buildSystemPrompt(context, projectName) {
    let prompt = 'You are Cortex Chat, a knowledge assistant for code repositories. Answer precisely and concisely. Use the provided context to give accurate answers. Reply in the same language as the question.';
    if (projectName) {
        prompt += ` You are answering about the project "${projectName}".`;
    }
    if (context) {
        prompt += `\n\nKnowledge base context:\n${context}`;
    }
    return prompt;
}
//# sourceMappingURL=haiku.js.map