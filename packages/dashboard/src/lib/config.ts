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
];

/** All Docker services including the API itself. */
export const DOCKER_SERVICES: ServiceDef[] = [
  { key: 'postgres', name: 'PostgreSQL', image: 'pgvector/pgvector:pg16', port: ':5432', desc: 'pgvector/pgvector:pg16' },
  { key: 'redis',    name: 'Redis',      image: 'redis:7-alpine',         port: ':6379', desc: 'redis:7-alpine' },
  { key: 'ollama',   name: 'Ollama',     image: 'ollama/ollama',          port: ':11434', desc: 'Local LLM / Embeddings' },
  { key: 'api',      name: 'Cortex API', image: 'node',                   port: ':3100', desc: 'Cortex API Server' },
];

// ---------------------------------------------------------------------------
// Environment variables
// ---------------------------------------------------------------------------

export interface EnvVarDef {
  key: string;
  sample: string;
}

/** Environment variables required for local development (voir .env.example). */
export const ENV_VARS: EnvVarDef[] = [
  { key: 'DATABASE_URL',           sample: 'postgresql://cortex:***@localhost:5432/cortex' },
  { key: 'REDIS_URL',              sample: 'redis://localhost:6379' },
  { key: 'OLLAMA_LLM_MODEL',       sample: 'qwen2.5:7b' },
  { key: 'OLLAMA_EMBEDDING_MODEL', sample: 'nomic-embed-text' },
  { key: 'ANTHROPIC_API_KEY',      sample: 'sk-ant-xxx' },
  { key: 'API_KEYS',               sample: 'dev-key-1,dev-key-2,...' },
  { key: 'PORT',                   sample: '3100' },
];

// ---------------------------------------------------------------------------
// Setup commands
// ---------------------------------------------------------------------------

export interface SetupCommandDef {
  label: string;
  command: string;
}

/** Quick-setup commands for bootstrapping the Cortex stack (flux Make du README). */
export const SETUP_COMMANDS: SetupCommandDef[] = [
  { label: 'Install complet (deps + Docker + migrations + modèles + MCP + skills)', command: 'make install' },
  { label: 'Lancer le stack dev (foreground, UI colorée)',                           command: 'make dev' },
  { label: 'Mode silencieux (détaché, terminal libre)',                              command: 'make cortex-bg' },
  { label: 'État compact (PIDs + Docker + health API)',                              command: 'make cortex-status' },
  { label: 'Arrêter les serveurs lancés par cortex-bg',                              command: 'make cortex-stop' },
  { label: 'Docker uniquement (PostgreSQL, Redis, Ollama)',                          command: 'make infra' },
  { label: 'Setup interactif alternatif (détecte la plateforme)',                    command: './setup.sh' },
  { label: 'Réenregistrer le MCP Claude Code (scope user)',                          command: 'make install-cli' },
  { label: 'Claude Code — finaliser + vérifier',                                     command: '/cortex-install' },
  { label: 'Claude Code — enregistrer le repo courant + scan',                       command: '/cortex .' },
  { label: 'Claude Code — snapshot horodaté sur branche backup',                     command: '/cortex-backup' },
  { label: 'Claude Code — restaurer depuis un snapshot',                             command: '/cortex-sync list' },
];
