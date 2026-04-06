const ollamaUrl = () => process.env['OLLAMA_URL'] ?? 'http://localhost:11434';
const ollamaModel = () => process.env['OLLAMA_CHAT_MODEL'] ?? process.env['OLLAMA_LLM_MODEL'] ?? 'qwen3.5:9b';
export async function streamOllama(input, writer) {
    const systemPrompt = buildSystemPrompt(input.context, input.projectName);
    const messages = [
        { role: 'system', content: systemPrompt },
        ...input.history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: input.message },
    ];
    writer.writeMeta('fast', ollamaModel());
    const res = await fetch(`${ollamaUrl()}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: ollamaModel(),
            messages,
            stream: true,
            think: false,
        }),
        signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok || !res.body) {
        writer.writeError(`Ollama error: ${res.status}`);
        return;
    }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
        const { done, value } = await reader.read();
        if (done)
            break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
            if (!line.trim())
                continue;
            try {
                const json = JSON.parse(line);
                if (json.message?.content) {
                    writer.writeToken(json.message.content);
                }
            }
            catch {
                // skip malformed lines
            }
        }
    }
    writer.writeDone();
}
function buildSystemPrompt(context, projectName) {
    let prompt = 'You are Cortex Chat, a knowledge assistant for code repositories. Answer concisely in the same language as the question.';
    if (projectName) {
        prompt += ` You are answering about the project "${projectName}".`;
    }
    if (context) {
        prompt += `\n\nRelevant knowledge base context:\n${context}`;
    }
    return prompt;
}
//# sourceMappingURL=ollama.js.map