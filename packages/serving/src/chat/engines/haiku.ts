import Anthropic from '@anthropic-ai/sdk';
import { spawn } from 'node:child_process';
import type { EngineInput, SSEWriter } from '../types.js';

const MODEL = 'claude-haiku-4-5-20251001';
const CLI_MODEL = 'haiku'; // claude CLI alias
const CLI_TIMEOUT_MS = 90_000;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

/** True if ANTHROPIC_API_KEY is set (required for SDK usage). */
function hasApiKey(): boolean {
  return !!process.env['ANTHROPIC_API_KEY'];
}

/** Prefer Claude CLI over API when explicitly requested or when no API key is available. */
function shouldUseCli(): boolean {
  const backend = (process.env['CORTEX_LLM_BACKEND'] ?? '').toLowerCase();
  if (backend === 'cli') return true;
  if (backend === 'api') return false;
  // Auto: use CLI when API key is missing (common case for local devs)
  return !hasApiKey();
}

/** Stream tokens from Claude via the local `claude` CLI (terminal command). */
async function streamViaCli(
  prompt: string,
  writer: SSEWriter,
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Allow up to 5 turns so Claude can use tools (search, read files) to
    // answer questions about the codebase. Without this limit it would hit
    // "Reached max turns" on any non-trivial query.
    const proc = spawn(
      'claude',
      ['--print', '--model', CLI_MODEL, '--max-turns', '5', prompt],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    );

    let stderr = '';
    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      reject(new Error(`Claude CLI timed out after ${CLI_TIMEOUT_MS}ms`));
    }, CLI_TIMEOUT_MS);

    proc.stdout.on('data', (chunk: Buffer) => {
      // Stream each chunk as a token. `claude --print` emits a single
      // non-interactive response on stdout, possibly in multiple chunks.
      const text = chunk.toString('utf-8');
      if (text.length > 0) writer.writeToken(text);
    });

    proc.stderr.on('data', (d: Buffer) => {
      stderr += d.toString();
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Claude CLI exited ${code}: ${stderr.slice(0, 300)}`));
      }
    });
  });
}

/** Stream tokens from Claude via the Anthropic SDK (API key required). */
async function streamViaApi(
  input: EngineInput,
  systemPrompt: string,
  writer: SSEWriter,
): Promise<void> {
  const messages: Anthropic.MessageParam[] = [
    ...input.history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: input.message },
  ];

  const stream = getClient().messages.stream({
    model: MODEL,
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      writer.writeToken(event.delta.text);
    }
  }
}

export async function streamHaiku(input: EngineInput, writer: SSEWriter): Promise<void> {
  const systemPrompt = buildSystemPrompt(input.context, input.projectName);
  writer.writeMeta('smart', MODEL);

  const useCli = shouldUseCli();

  try {
    if (useCli) {
      // Build a single prompt combining system + history + user message
      const history = input.history
        .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
      const prompt = [
        systemPrompt,
        history && `\nConversation so far:\n${history}`,
        `\nUser: ${input.message}`,
      ]
        .filter(Boolean)
        .join('\n');

      await streamViaCli(prompt, writer);
    } else {
      await streamViaApi(input, systemPrompt, writer);
    }

    writer.writeDone();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // If CLI failed and API key is available, fall back to API
    if (useCli && hasApiKey()) {
      try {
        await streamViaApi(input, systemPrompt, writer);
        writer.writeDone();
        return;
      } catch (apiErr) {
        const apiMsg = apiErr instanceof Error ? apiErr.message : String(apiErr);
        writer.writeError(`Haiku CLI failed (${msg}) and API fallback failed (${apiMsg})`);
        return;
      }
    }
    writer.writeError(`Haiku error: ${msg}`);
  }
}

function buildSystemPrompt(context: string, projectName?: string): string {
  let prompt =
    'You are Cortex Chat, a knowledge assistant for code repositories. Answer precisely and concisely. Use the provided context to give accurate answers. Reply in the same language as the question.';
  if (projectName) {
    prompt += ` You are answering about the project "${projectName}".`;
  }
  if (context) {
    prompt += `\n\nKnowledge base context:\n${context}`;
  }
  return prompt;
}
