import { Hono } from 'hono';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { getPool } from '@cortex/db';
import { getRedis } from '../../redis.js';
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
    const start = performance.now();
    try {
        const redis = getRedis();
        await redis.ping();
        return { status: 'ok', latency: Math.round(performance.now() - start) };
    }
    catch {
        return { status: 'error', latency: Math.round(performance.now() - start) };
    }
}
async function checkGraphStorage() {
    try {
        const { getPgGraphClient } = await import('../../graph/pg-graph-client.js');
        const client = getPgGraphClient();
        const { latency } = await timed(() => client.health());
        return { status: 'ok', latency, storage: 'postgresql' };
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
        // GPU info — try nvidia-smi first, then macOS Apple Silicon detection
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
                    type: 'discrete',
                };
            }
        }
        catch {
            // No NVIDIA GPU — try Apple Silicon detection via system_profiler
            if (process.platform === 'darwin') {
                try {
                    const { stdout: spJson } = await execFileAsync('system_profiler', [
                        'SPDisplaysDataType', '-json',
                    ], { timeout: 5000 });
                    const parsed = JSON.parse(spJson);
                    const displays = parsed.SPDisplaysDataType ?? [];
                    if (displays.length > 0) {
                        const d = displays[0];
                        const chipName = String(d.sppci_model ?? 'Apple GPU');
                        const cores = d.sppci_cores ? String(d.sppci_cores) : undefined;
                        const metalFamily = d.spdisplays_metal ? String(d.spdisplays_metal) : undefined;
                        // Get unified memory from hardware overview
                        let unifiedMemory;
                        try {
                            const { stdout: hwJson } = await execFileAsync('system_profiler', [
                                'SPHardwareDataType', '-json',
                            ], { timeout: 3000 });
                            const hwParsed = JSON.parse(hwJson);
                            const hw = hwParsed.SPHardwareDataType?.[0];
                            if (hw) {
                                unifiedMemory = String(hw.physical_memory ?? '');
                            }
                        }
                        catch { /* ignore */ }
                        gpu = {
                            name: chipName,
                            type: 'unified',
                            gpuCores: cores,
                            metalFamily,
                            unifiedMemory,
                        };
                    }
                }
                catch { /* no GPU info available */ }
            }
        }
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
    const [postgres, redis, graphStorage, ollama, claude] = await Promise.all([
        checkPostgres(),
        checkRedis(),
        checkGraphStorage(),
        checkOllama(),
        checkClaude(),
    ]);
    const services = { postgres, redis, graphStorage, ollama, claude };
    const coreOk = [postgres, redis, graphStorage, ollama].every((s) => s.status === 'ok');
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
// Graph storage is PostgreSQL (via pg-graph-client)
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