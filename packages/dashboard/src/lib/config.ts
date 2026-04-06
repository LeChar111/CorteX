/**
 * Shared configuration constants used across dashboard pages.
 * Extracted from Infrastructure.tsx, SettingsPage.tsx, Project.tsx, NewProject.tsx.
 */

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

export const PROVIDERS = ['bitbucket', 'github', 'gitlab', 'local'] as const;
export type Provider = (typeof PROVIDERS)[number];

// ---------------------------------------------------------------------------
// Service definitions (data only — no React icons)
// ---------------------------------------------------------------------------

export interface ServiceDef {
  key: string;
  name: string;
  image: string;
  port: string;
  desc: string;
}

/** Core services monitored on Infrastructure and Settings pages. */
export const SERVICES: ServiceDef[] = [
  { key: 'postgres', name: 'PostgreSQL', image: 'pgvector/pgvector:pg16', port: ':5432', desc: 'pgvector/pgvector:pg16' },
  { key: 'redis',    name: 'Redis',      image: 'redis:7-alpine',         port: ':6379', desc: 'redis:7-alpine' },
  { key: 'ollama',   name: 'Ollama',     image: 'ollama/ollama',          port: ':11434', desc: 'Local LLM / Embeddings' },
  { key: 'lightrag', name: 'LightRAG',   image: 'custom',                 port: ':9621', desc: 'Graph RAG Engine' },
];

/** All Docker services including the API itself. */
export const DOCKER_SERVICES: ServiceDef[] = [
  { key: 'postgres', name: 'PostgreSQL', image: 'pgvector/pgvector:pg16', port: ':5432', desc: 'pgvector/pgvector:pg16' },
  { key: 'redis',    name: 'Redis',      image: 'redis:7-alpine',         port: ':6379', desc: 'redis:7-alpine' },
  { key: 'ollama',   name: 'Ollama',     image: 'ollama/ollama',          port: ':11434', desc: 'Local LLM / Embeddings' },
  { key: 'lightrag', name: 'LightRAG',   image: 'custom',                 port: ':9621', desc: 'Graph RAG Engine' },
  { key: 'api',      name: 'Cortex API', image: 'node',                   port: ':3100', desc: 'Cortex API Server' },
];

// ---------------------------------------------------------------------------
// Environment variables
// ---------------------------------------------------------------------------

export interface EnvVarDef {
  key: string;
  sample: string;
}

/** Environment variables required for local development. */
export const ENV_VARS: EnvVarDef[] = [
  { key: 'DATABASE_URL',        sample: 'postgresql://cortex:***@localhost:5432/cortex' },
  { key: 'REDIS_URL',           sample: 'redis://localhost:6379' },
  { key: 'LIGHTRAG_URL',        sample: 'http://localhost:9621' },
  { key: 'CORTEX_LLM_MODEL',   sample: 'llama3.2:3b' },
  { key: 'PORT',                sample: '3100' },
];

// ---------------------------------------------------------------------------
// Setup commands
// ---------------------------------------------------------------------------

export interface SetupCommandDef {
  label: string;
  command: string;
}

/** Quick-setup commands for bootstrapping the Cortex stack. */
export const SETUP_COMMANDS: SetupCommandDef[] = [
  { label: 'Start infrastructure', command: 'docker compose up -d' },
  { label: 'Pull Ollama models',   command: './scripts/init-ollama.sh' },
  { label: 'Run migrations',       command: 'pnpm --filter @cortex/db run migrate' },
  { label: 'Seed demo data',       command: 'pnpm seed' },
  { label: 'Start API',            command: 'pnpm --filter @cortex/serving run dev' },
  {
    label: 'Register MCP',
    command: 'claude mcp add cortex --transport stdio --scope user -- pnpm --filter @cortex/mcp run start',
  },
];
