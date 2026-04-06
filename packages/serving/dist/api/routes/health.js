import { Hono } from 'hono';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createConnection } from 'node:net';
import { getPool } from '@cortex/db';
const execFileAsync = promisify(execFile);
export const healthRouter = new Hono();
async function timed(fn) {
    const start = Date.now();
    const result = await fn();
    return { result, latency: Date.now() - start };
}
async function fetchJson(url, timeoutMs = 3000) {
    const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok)
        throw new Error(`${res.status}`);
    return res.json();
}
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
// ── Service checks ──────────────────────────────────────────
async function checkPostgres() {
    try {
        const { latency } = await timed(() => getPool().query('SELECT 1'));
        return { status: 'ok', latency };
    }
    catch {
        return { status: 'error', latency: 0 };
    }
}
async function checkRedis() {
    const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
    const url = new URL(redisUrl.replace('redis://', 'http://'));
    const host = url.hostname;
    const port = Number(url.port) || 6379;
    try {
        const { latency } = await timed(() => new Promise((resolve, reject) => {
            const socket = createConnection({ host, port }, () => {
                socket.destroy();
                resolve();
            });
            socket.on('error', reject);
            socket.setTimeout(2000, () => { socket.destroy(); reject(new Error('timeout')); });
        }));
        return { status: 'ok', latency };
    }
    catch {
        return { status: 'error', latency: 0 };
    }
}
async function checkLightrag() {
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    try {
        const { result: health, latency } = await timed(() => fetchJson(`${lightragUrl}/health`));
        let documents = {};
        try {
            const counts = await fetchJson(`${lightragUrl}/documents/status_counts`);
            documents = counts.status_counts ?? {};
        }
        catch { /* ignore */ }
        // Graph stats
        let graphLabels = 0;
        try {
            const labels = await fetchJson(`${lightragUrl}/graph/label/list`);
            graphLabels = labels.length;
        }
        catch { /* ignore */ }
        const conf = health.configuration;
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
    }
    catch {
        return { status: 'error', latency: 0 };
    }
}
async function checkOllama() {
    const ollamaUrl = process.env['OLLAMA_URL'] ?? 'http://localhost:11434';
    try {
        const { result: tagsData, latency } = await timed(() => fetchJson(`${ollamaUrl}/api/tags`));
        const available = (tagsData.models ?? []).map((m) => ({
            name: String(m.name ?? ''),
            size: formatBytes(Number(m.size ?? 0)),
            parameterSize: String(m.details?.parameter_size ?? ''),
        }));
        // Running models with VRAM usage and processor info
        let running = [];
        try {
            const ps = await fetchJson(`${ollamaUrl}/api/ps`);
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
        }
        catch { /* ignore */ }
        // Include assigned roles
        const roles = {
            llm: process.env['OLLAMA_LLM_MODEL'] ?? 'qwen2.5:7b',
            chat: process.env['OLLAMA_CHAT_MODEL'] ?? 'qwen3.5:9b',
        };
        // GPU info via nvidia-smi
        let gpu = null;
        try {
            const { stdout } = await execFileAsync('nvidia-smi', [
                '--query-gpu=name,memory.used,memory.total,utilization.gpu,temperature.gpu',
                '--format=csv,noheader,nounits',
            ], { timeout: 3000 });
            const parts = stdout.trim().split(', ');
            if (parts.length >= 5) {
                gpu = {
                    name: parts[0],
                    memoryUsed: `${parts[1]} MiB`,
                    memoryTotal: `${parts[2]} MiB`,
                    utilization: `${parts[3]}%`,
                    temperature: `${parts[4]}°C`,
                };
            }
        }
        catch { /* no GPU or nvidia-smi not available */ }
        return { status: 'ok', latency, available, running, gpu, roles };
    }
    catch {
        return { status: 'error', latency: 0 };
    }
}
async function checkClaude() {
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
    }
    catch {
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
function dockerCompose(...args) {
    return execFileAsync('docker', ['compose', '-f', resolve(PROJECT_ROOT, 'docker-compose.yml'), ...args], {
        timeout: 60000,
        cwd: PROJECT_ROOT,
    });
}
healthRouter.post('/services/restart', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const service = body.service;
    try {
        if (service) {
            const { stdout, stderr } = await dockerCompose('restart', service);
            return c.json({ status: 'restarted', service, output: (stdout || stderr).trim() });
        }
        else {
            const { stdout, stderr } = await dockerCompose('restart');
            return c.json({ status: 'restarted', service: 'all', output: (stdout || stderr).trim() });
        }
    }
    catch (err) {
        return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
    }
});
healthRouter.post('/services/start', async (c) => {
    try {
        const { stdout, stderr } = await dockerCompose('up', '-d');
        return c.json({ status: 'started', output: (stdout || stderr).trim() });
    }
    catch (err) {
        return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
    }
});
healthRouter.put('/settings/model', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const model = body.model;
    const allowed = ['haiku', 'sonnet', 'opus'];
    if (!model || !allowed.includes(model)) {
        return c.json({ status: 'error', message: `Invalid model. Allowed: ${allowed.join(', ')}` }, 400);
    }
    process.env['CORTEX_LLM_MODEL'] = model;
    return c.json({ status: 'ok', model });
});
healthRouter.put('/settings/lightrag', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const config = {};
    if (body.maxParallelInsert != null)
        config['MAX_PARALLEL_INSERT'] = String(body.maxParallelInsert);
    if (body.maxAsync != null)
        config['MAX_ASYNC'] = String(body.maxAsync);
    if (body.embeddingFuncMaxAsync != null)
        config['EMBEDDING_FUNC_MAX_ASYNC'] = String(body.embeddingFuncMaxAsync);
    if (body.embeddingBatchNum != null)
        config['EMBEDDING_BATCH_NUM'] = String(body.embeddingBatchNum);
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
    }
    catch (err) {
        return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
    }
});
// ── Ollama model management ─────────────────────────────────
healthRouter.put('/settings/ollama-model', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const role = body.role; // 'llm' or 'chat'
    const model = body.model;
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
        }
        catch (err) {
            return c.json({ status: 'partial', model, message: 'Env set but LightRAG restart failed' }, 207);
        }
    }
    return c.json({ status: 'ok', role, model });
});
healthRouter.post('/ollama/load', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const model = body.model;
    const processor = body.processor; // 'gpu' or 'cpu'
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
    }
    catch (err) {
        return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
    }
});
healthRouter.post('/ollama/unload', async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const model = body.model;
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
    }
    catch (err) {
        return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
    }
});
healthRouter.post('/services/stop', async (c) => {
    try {
        const { stdout, stderr } = await dockerCompose('stop');
        return c.json({ status: 'stopped', output: (stdout || stderr).trim() });
    }
    catch (err) {
        return c.json({ status: 'error', message: err instanceof Error ? err.message : String(err) }, 500);
    }
});
//# sourceMappingURL=health.js.map