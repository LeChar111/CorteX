import type { ResolvedMode } from './types.js';

const AGENT_PATTERNS = /\b(comment|pourquoi|why|how|impact|compare|compar|analyse|analyze|explain|expliqu|différence|difference|architecture|refactor|debug)\b/i;

const FAST_PATTERNS = /\b(list|liste|qu'est-ce|what is|define|définition|definition|version|nom|name|show|affiche|montre)\b/i;

/**
 * Smart mode uses Claude Haiku — available via the Anthropic API (requires
 * ANTHROPIC_API_KEY) OR via the `claude` CLI (requires the binary to be in PATH
 * and the user to be logged in). If neither is available we fall back to fast.
 */
function hasClaudeBackend(): boolean {
  if (process.env['ANTHROPIC_API_KEY']) return true;
  // CLI availability: cached for the process lifetime. The engine itself
  // will surface a clear error if the CLI is unreachable at runtime.
  if (claudeCliAvailable === undefined) {
    try {
      // node's require.resolve is ESM-unsafe; use a light sync check instead.
      // The CLI path is checked at engine call time — here we assume it exists
      // when CORTEX_LLM_BACKEND isn't explicitly set to "api".
      claudeCliAvailable = process.env['CORTEX_LLM_BACKEND'] !== 'api';
    } catch {
      claudeCliAvailable = false;
    }
  }
  return claudeCliAvailable;
}

let claudeCliAvailable: boolean | undefined;

export function routeQuery(message: string, hasProjectId: boolean): ResolvedMode {
  const wordCount = message.trim().split(/\s+/).length;
  const claudeAvailable = hasClaudeBackend();

  // Short simple questions without project scope → fast
  if (wordCount <= 12 && !hasProjectId && FAST_PATTERNS.test(message)) {
    return 'fast';
  }

  // Investigation keywords → agent (uses Ollama, always available)
  if (AGENT_PATTERNS.test(message) && wordCount > 8) {
    return 'agent';
  }

  // Default: smart (Claude Haiku via CLI or API) if available, else fast (Ollama)
  return claudeAvailable ? 'smart' : 'fast';
}
