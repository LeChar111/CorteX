import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { z } from 'zod';
import { buildExtractionPrompt, type BuildExtractionPromptParams } from './prompts.js';

const execFileAsync = promisify(execFile);

// Zod schemas
const EntitySchema = z.object({
  type: z.string(),
  name: z.string(),
  qualified_name: z.string(),
  description: z.string().default(''),
  metadata: z.record(z.unknown()).default({}),
});

const RelationSchema = z.object({
  source: z.string(),
  target: z.string(),
  type: z.string(),
  description: z.string().default(''),
  confidence: z.number().min(0).max(1).default(1),
});

const ExtractionResultSchema = z.object({
  entities: z.array(EntitySchema).default([]),
  relations: z.array(RelationSchema).default([]),
});

export type Entity = z.infer<typeof EntitySchema>;
export type Relation = z.infer<typeof RelationSchema>;
export type ExtractionResult = z.infer<typeof ExtractionResultSchema>;

export interface ExtractWithLLMParams extends BuildExtractionPromptParams {
  apiKey?: string;
}

/** Thrown when Claude CLI signals a rate limit / token exhaustion */
export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

const RATE_LIMIT_PATTERNS = [
  /rate.?limit/i,
  /too many requests/i,
  /token.?limit/i,
  /quota.?exceeded/i,
  /usage.?limit/i,
  /capacity/i,
  /throttl/i,
  /429/,
  /overloaded/i,
  /try again later/i,
  /out of.*tokens/i,
  /billing/i,
];

function isRateLimitError(text: string): boolean {
  return RATE_LIMIT_PATTERNS.some((p) => p.test(text));
}

/**
 * Strips markdown code fences (```json ... ```) from a string,
 * then parses JSON. Returns { entities: [], relations: [] } on any error.
 */
export function parseExtractionResult(text: string): ExtractionResult {
  const empty: ExtractionResult = { entities: [], relations: [] };

  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/);
  if (fenceMatch) {
    cleaned = (fenceMatch[1] ?? '').trim();
  }

  if (!cleaned) return empty;

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return empty;
  }

  const result = ExtractionResultSchema.safeParse(parsed);
  if (!result.success) {
    return empty;
  }
  return result.data;
}

/**
 * Uses the `claude` CLI for extraction.
 * Throws RateLimitError if the CLI signals token/rate exhaustion.
 */
export async function extractWithLLM(params: ExtractWithLLMParams): Promise<ExtractionResult> {
  const prompt = buildExtractionPrompt(params);
  const model = process.env['CORTEX_LLM_MODEL'] || 'haiku';

  try {
    const { stdout, stderr } = await execFileAsync('claude', [
      '--print',
      '--model', model,
      '--max-turns', '1',
      prompt,
    ], {
      timeout: model.includes('sonnet') ? 120_000 : 60_000,
      maxBuffer: 1024 * 1024,
      env: { ...process.env, CLAUDE_CODE_ENTRYPOINT: 'cortex-ingestion' },
    });

    // Check for rate limit in stderr or stdout
    const combined = `${stdout}\n${stderr}`;
    if (isRateLimitError(combined)) {
      throw new RateLimitError(`Claude rate limited: ${stderr || stdout.slice(0, 200)}`);
    }

    return parseExtractionResult(stdout);
  } catch (err) {
    // Re-throw RateLimitError — don't swallow it
    if (err instanceof RateLimitError) throw err;

    // Check error message for rate limit patterns
    const msg = err instanceof Error ? err.message : String(err);
    if (isRateLimitError(msg)) {
      throw new RateLimitError(msg);
    }

    // Check exit code — Claude CLI returns specific codes for rate limits
    const exitCode = (err as { code?: number })?.code;
    if (exitCode === 2 || exitCode === 75) {
      throw new RateLimitError(`Claude CLI exited with code ${exitCode}: ${msg}`);
    }

    console.warn('Claude CLI extraction failed:', msg);
    return { entities: [], relations: [] };
  }
}

/**
 * Process multiple extraction params in parallel with concurrency limit.
 * Throws RateLimitError immediately if any extraction hits a rate limit.
 */
export async function extractBatchParallel(
  paramsList: ExtractWithLLMParams[],
  concurrency = 5,
): Promise<ExtractionResult[]> {
  const results: ExtractionResult[] = [];
  for (let i = 0; i < paramsList.length; i += concurrency) {
    const batch = paramsList.slice(i, i + concurrency);
    // RateLimitError will propagate up and stop all further batches
    const batchResults = await Promise.all(batch.map(p => extractWithLLM(p)));
    results.push(...batchResults);
  }
  return results;
}
