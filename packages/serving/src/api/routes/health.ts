import { Hono } from 'hono';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createConnection } from 'node:net';
import { getPool } from '@cortex/db';

const execFileAsync = promisify(execFile);

export const healthRouter = new Hono();

interface ServiceHealth {
  status: string;
  latency: number;
  [key: string]: unknown;
}

async function timed<T>(fn: () => Promise<T>): Promise<{ result: T; latency: number }> {
  const start = Date.now();
  const result = await fn();
  return { result, latency: Date.now() - start };
}

async function fetchJson(url: string, timeoutMs = 3000): Promise<unknown> {
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// ── Service checks ──────────────────────────────────────────

async function checkPostgres(): Promise<ServiceHealth> {
  try {
    const { latency } = await timed(() => getPool().query('SELECT 1'));
    return { status: 'ok', latency };
  } catch {
    return { status: 'error', latency: 0 };
  }
}

async function checkRedis(): Promise<ServiceHealth> {
  const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
  const url = new URL(redisUrl.replace('redis://', 'http://'));
  const host = url.hostname;
  const port = Number(url.port) || 6379;

  try {
    const { latency } = await timed(() => new Promise<void>((resolve, reject) => {
      const socket = createConnection({ host, port }, () => {
        socket.destroy();
        resolve();
      });
      socket.on('error', reject);
      socket.setTimeout(2000, () => { socket.destroy(); reject(new Error('timeout')); });
    }));
    return { status: 'ok', latency };
  } catch {
    return { status: 'error', latency: 0 };
  }
}

async function checkLightrag(): Promise<ServiceHealth> {
  const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
  try {
    const { result: health, latency } = await timed(
      () => fetchJson(`${lightragUrl}/health`) as Promise<Record<string, unknown>>,
    );

    let documents: Record<string, number> = {};
    try {
      const counts = await fetchJson(`${lightragUrl}/documents/status_counts`) as { status_counts?: Record<string, number> };
      documents = counts.status_counts ?? {};
    } catch { /* ignore */ }

    // Graph stats
    let graphLabels = 0;
    try {
      const labels = await fetchJson(`${lightragUrl}/graph/label/list`) as string[];
      graphLabels = labels.length;
    } catch { /* ignore */ }

    const conf = health.configuration as Record<string, unknown> | undefined;

    return {
      status: 'ok',
      latency,
      version: health.core_version ?? null,
      pipelineBusy: health.pipeline_busy ?? false,
      documents,
      graphLabels,
      llmModel: conf?.llm_model ?? null,
      embeddingModel: conf?.embedding_model ?? null,
      config: {
        maxParallelInsert: conf?.max_parallel_insert ?? 2,
        maxAsync: conf?.max_async ?? 4,
        embeddingFuncMaxAsync: conf?.embedding_func_max_async ?? 8,
        embeddingBatchNum: conf?.embedding_batch_num ?? 10,
      },
    };
  } catch {
    return { status: 'error', latency: 0 };
  }
}

async function checkOllama(): Promise<ServiceHealth> {
  const ollamaUrl = process.env['OLLAMA_URL'] ?? 'http://localhost:11434';
  try {
    const { result: tagsData, latency } = await timed(
      () => fetchJson(`${ollamaUrl}/api/tags`) as Promise<{ models?: Array<Record<string, unknown>> }>,
    );

    const available = (tagsData.models ?? []).map((m) => ({
      name: String(m.name ?? ''),
      size: formatBytes(Number(m.size ?? 0)),
      parameterSize: String((m.details as Record<string, unknown>)?.parameter_size ?? ''),
    }));

    // Running models with VRAM usage and processor info
    let running: Array<{ name: string; size: string; vram: string; processor: string; contextLength: number }> = [];
    try {
      const ps = await fetchJson(`${ollamaUrl}/api/ps`) as { models?: Array<Record<string, unknown>> };
      running = (ps.models ?? []).map((m) => {
        const size = Number(m.size ?? 0);
        const sizeVram = Number(m.size_vram ?? 0);
        const gpuPct = size > 0 ? Math.round((sizeVram / size) * 100) : 0;
        return {
          name: String(m.name ?? ''),
          size: formatBytes(size),
          vram: formatBytes(sizeVram),
          processor: gpuPct === 0 ? 'cpu' : gpuPct === 100 ? 'gpu' : `${gpuPct}% GPU`,
          contextLength: Number(m.context_length ?? 0),
        };
      });
    } catch { /* ignore */ }

    // Include assigned roles
    const roles = {
      llm: process.env['OLLAMA_LLM_MODEL'] ?? 'qwen2.5:7b',
      chat: process.env['OLLAMA_CHAT_MODEL'] ?? 'qwen3.5:9b',
    };

    // GPU info via nvidia-smi
    let gpu: { name: string; memoryUsed: string; memoryTotal: string; utilization: string; temperature: string } | null = null;
    try {
      const { stdout } = await execFileAsync('nvidia-smi', [
        '--query-gpu=name,memory.used,memory.total,utilization.gpu,temperature.gpu',
        '--format=csv,noheader,nounits',
      ], { timeout: 3000 });
      const parts = stdout.trim().split(', ');
      if (parts.length >= 5) {
        gpu = {
          name: parts[0]!,
          memoryUsed: `${parts[1]} MiB`,
          memoryTotal: `${parts[2]} MiB`,
          utilization: `${parts[3]}%`,
          temperature: `${parts[4]}°C`,
        };
      }
    } catch { /* no GPU or nvidia-smi not available */ }

    return { status: 'ok', latency, available, running, gpu, roles };
  } catch {
    return { status: 'error', latency: 0 };
  }
}

async function checkClaude(): Promise<ServiceHealth> {
  try {
    const { result: version, latency } = await timed(async () => {
      const { stdout } = await execFileAsync('claude', ['--version'], { timeout: 5000 });
      return stdout.trim();
    });

    const model = process.env['CORTEX_LLM_MODEL'] || 'haiku';

    return {
      status: 'ok',
      latency,
      version,
      model,
    };
  } catch {
    return { status: 'error', latency: 0, version: null, model: null };
  }
}

// ── Routes ──────────────────────────────────────────────────

healthRouter.get('/health', async (c) => {
  const timestamp = new Date().toISOString();

  const [postgres, redis, lightrag, ollama, claude] = await Promise.all([
    checkPostgres(),
    checkRedis(),
    checkLightrag(),
    checkOllama(),
    checkClaude(),
  ]);

  const services = { postgres, redis, lightrag, ollama, claude };
  const coreOk = [postgres, redis, lightrag, ollama].every((s) => s.status === 'ok');

  return c.json({ status: coreOk ? 'ok' : 'degraded', services, timestamp });
});

// Resolve project root (where docker-compose.yml lives)
import { resolve } from 'node:path';
const PROJECT_ROOT = resolve(import.meta.dirname, '../../../../..');

function dockerCompose(...args: string[]) {
  return execFileAsync('docker', ['compose', '-f', resolve(PROJECT_ROOT, 'docker-compose.yml'), ...args], {
    timeout: 60000,
    cwd: PROJECT_ROOT,
  });
}

healthRouter.post('/services/restart', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const service = (body as Record<string, unknown>).service as string | undefined;

  try {
    if (service) {
      const { stdout, stderr } = await dockerCompose('restart', service);
      return c.json({ status: 'restarted', service, output: (stdout || stderr).trim() });
    } else {
      const { stdout, stderr } = await dockerCompose('restart');
      return c.json({ status: 'restarted', service: 'all', output: (stdout || stderr).trim() });
    }
  } catch (err) {
    return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
  }
});

healthRouter.post('/services/start', async (c) => {
  try {
    const { stdout, stderr } = await dockerCompose('up', '-d');
    return c.json({ status: 'started', output: (stdout || stderr).trim() });
  } catch (err) {
    return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
  }
});

healthRouter.put('/settings/model', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const model = (body as Record<string, unknown>).model as string | undefined;
  const allowed = ['haiku', 'sonnet', 'opus'];
  if (!model || !allowed.includes(model)) {
    return c.json({ status: 'error', message: `Invalid model. Allowed: ${allowed.join(', ')}` }, 400);
  }
  process.env['CORTEX_LLM_MODEL'] = model;
  return c.json({ status: 'ok', model });
});

healthRouter.put('/settings/lightrag', async (c) => {
  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;

  const config: Record<string, string> = {};
  if (body.maxParallelInsert != null) config['MAX_PARALLEL_INSERT'] = String(body.maxParallelInsert);
  if (body.maxAsync != null) config['MAX_ASYNC'] = String(body.maxAsync);
  if (body.embeddingFuncMaxAsync != null) config['EMBEDDING_FUNC_MAX_ASYNC'] = String(body.embeddingFuncMaxAsync);
  if (body.embeddingBatchNum != null) config['EMBEDDING_BATCH_NUM'] = String(body.embeddingBatchNum);

  if (Object.keys(config).length === 0) {
    return c.json({ status: 'error', message: 'No valid config parameters provided' }, 400);
  }

  // Apply by rebuilding LightRAG container with new env vars
  try {
    // Update the env vars for next restart
    for (const [k, v] of Object.entries(config)) {
      process.env[k] = v;
    }

    // Restart LightRAG to pick up changes
    await dockerCompose('up', '-d', '--build', 'lightrag');

    return c.json({ status: 'ok', applied: config });
  } catch (err) {
    return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
  }
});

// ── Ollama model management ─────────────────────────────────

healthRouter.put('/settings/ollama-model', async (c) => {
  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const role = body.role as string | undefined;    // 'llm' or 'chat'
  const model = body.model as string | undefined;

  if (!role || !['llm', 'chat'].includes(role)) {
    return c.json({ status: 'error', message: 'role must be "llm" or "chat"' }, 400);
  }
  if (!model) {
    return c.json({ status: 'error', message: 'model is required' }, 400);
  }

  const envKey = role === 'llm' ? 'OLLAMA_LLM_MODEL' : 'OLLAMA_CHAT_MODEL';
  process.env[envKey] = model;

  // If changing LightRAG model, restart it to pick up the new model
  if (role === 'llm') {
    try {
      await dockerCompose('down', 'lightrag');
      await dockerCompose('up', '-d', 'lightrag');
    } catch (err) {
      return c.json({ status: 'partial', model, message: 'Env set but LightRAG restart failed' }, 207);
    }
  }

  return c.json({ status: 'ok', role, model });
});

healthRouter.post('/ollama/load', async (c) => {
  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const model = body.model as string | undefined;
  const processor = body.processor as string | undefined; // 'gpu' or 'cpu'

  if (!model) {
    return c.json({ status: 'error', message: 'model is required' }, 400);
  }

  const ollamaUrl = process.env['OLLAMA_URL'] ?? 'http://localhost:11434';
  const numGpu = processor === 'cpu' ? 0 : 99;

  try {
    // Load model with specified processor by sending a dummy generate with keep_alive
    const res = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'hi' }],
        stream: false,
        options: { num_gpu: numGpu },
        keep_alive: '30m',
      }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) {
      const err = await res.text();
      return c.json({ status: 'error', message: err }, 500);
    }

    return c.json({ status: 'ok', model, processor: processor ?? 'gpu' });
  } catch (err) {
    return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
  }
});

healthRouter.post('/ollama/unload', async (c) => {
  const body = await c.req.json().catch(() => ({})) as Record<string, unknown>;
  const model = body.model as string | undefined;

  if (!model) {
    return c.json({ status: 'error', message: 'model is required' }, 400);
  }

  const ollamaUrl = process.env['OLLAMA_URL'] ?? 'http://localhost:11434';

  try {
    await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [],
        keep_alive: 0,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    return c.json({ status: 'ok', model });
  } catch (err) {
    return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
  }
});

healthRouter.post('/services/stop', async (c) => {
  try {
    const { stdout, stderr } = await dockerCompose('stop');
    return c.json({ status: 'stopped', output: (stdout || stderr).trim() });
  } catch (err) {
    return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
  }
});
