import { useState } from 'react';
import {
  Cpu,
  Brain,
  RefreshCw,
  Server,
  Play,
  Pause,
  Square,
  RotateCcw,
  Loader2,
  ScanSearch,
  CheckCircle2,
  AlertCircle,
  Clock,
  Settings,
  ChevronDown,
  ChevronUp,
  Terminal,
} from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
// timeAgo used in scan job display (future)
import { DOCKER_SERVICES, ENV_VARS, SETUP_COMMANDS } from '../lib/config.ts';
import { StatusDot } from '../components/StatusDot.tsx';
import { CopyButton } from '../components/CopyButton.tsx';
import { usePolling } from '../hooks/usePolling.ts';
import { useAsyncData } from '../hooks/useAsyncData.ts';
import { TerminalPage } from './TerminalPage';
import type { ScanJob, Repo } from '../types.ts';

interface ServiceData {
  status: string;
  latency?: number;
  version?: string;
  // Ollama extras
  models?: Array<{ name: string; size: string; vram?: string }>;
  available?: string[];
  gpu?: {
    name: string;
    type: 'discrete' | 'unified';
    memoryUsed?: string;
    memoryTotal?: string;
    utilization?: string;
    temperature?: string;
    unifiedMemory?: string;
    gpuCores?: string;
    metalFamily?: string;
  };
  running?: Array<{ name: string; size: string; vram: string; contextLength: number }>;
  // Claude extras
  model?: string;
  [key: string]: unknown;
}

interface HealthData {
  status: string;
  services: Record<string, string | ServiceData | undefined>;
  timestamp?: string;
}

function getServiceData(health: HealthData | null, key: string): ServiceData | null {
  if (!health) return null;
  const svc = health.services[key];
  if (!svc) return null;
  if (typeof svc === 'string') return { status: svc };
  return svc;
}


function serviceStatus(health: HealthData | null, key: string): boolean | null {
  if (!health) return null;
  const svc = (health.services as Record<string, string | { status: string } | undefined>)[key];
  if (!svc) return null;
  // API returns either a string ("ok") or an object ({ status: "ok" })
  if (typeof svc === 'string') return svc === 'ok';
  return svc.status === 'ok';
}


export function Infrastructure() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [restarting, setRestarting] = useState<string | null>(null);
  const [savingModel, setSavingModel] = useState(false);
  const [loadingModel, setLoadingModel] = useState<string | null>(null);
  const [_expandedScan, _setExpandedScan] = useState<string | null>(null);
  const [showAllModels, setShowAllModels] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);

  // Centralized polling for health and scans
  const { data: health, loading, refetch: fetchHealth } = usePolling<HealthData>(
    async () => {
      const data = await api.health() as HealthData;
      setLastUpdated(new Date());
      return data;
    },
    30_000,
  );

  const { data: _scanJobs } = usePolling<ScanJob[]>(
    () => api.getScanStatus(),
    5_000,
  );

  // Build repo name lookup
  const { data: _repoMap } = useAsyncData(async () => {
    const projects = await api.listProjects();
    const allRepos = await Promise.all(projects.map((p) => api.getRepos(p.id).catch(() => [] as Repo[])));
    const map: Record<string, string> = {};
    allRepos.flat().forEach((r) => { map[r.id] = r.name; });
    return map;
  }, []);

  const handleRestart = async (service?: string) => {
    const key = service || 'all';
    setRestarting(key);
    try {
      await api.restartServices(service);
      // Wait a bit for services to come back
      setTimeout(fetchHealth, 3000);
    } catch (err) {
      console.error('Restart failed:', err);
    }
    setTimeout(() => setRestarting(null), 4000);
  };

  const handleStart = async () => {
    setRestarting('all');
    try {
      await api.startServices();
      setTimeout(fetchHealth, 5000);
    } catch (err) {
      console.error('Start failed:', err);
    }
    setTimeout(() => setRestarting(null), 6000);
  };

  const handleStop = async () => {
    setRestarting('all');
    try {
      await api.stopServices();
      setTimeout(fetchHealth, 3000);
    } catch (err) {
      console.error('Stop failed:', err);
    }
    setTimeout(() => setRestarting(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-6xl font-bold text-text">Infrastructure</h1>
          <p className="mt-0.5 text-xl text-muted">
            Docker services status &amp; setup guide
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            disabled={restarting !== null}
            className="flex items-center gap-2 rounded-xl border border-success/30 bg-success-light px-3 py-2 text-sm font-medium text-success hover:bg-success/15 transition-colors disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" />
            Start All
          </button>
          <button
            onClick={() => handleRestart()}
            disabled={restarting !== null}
            className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent-light px-3 py-2 text-sm font-medium text-accent hover:bg-accent/15 transition-colors disabled:opacity-50"
          >
            {restarting === 'all' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}
            Restart All
          </button>
          <button
            onClick={handleStop}
            disabled={restarting !== null}
            className="flex items-center gap-2 rounded-full border border-error/30 bg-error-light px-3 py-2 text-sm font-medium text-error hover:bg-error/15 transition-colors disabled:opacity-50"
          >
            <Square className="h-3.5 w-3.5" />
            Stop All
          </button>
          <button
            onClick={() => setShowTerminal((value) => !value)}
            className="flex items-center gap-2 rounded-full border border-border-light bg-card px-3 py-2 text-sm font-medium text-text hover:bg-hover transition-colors"
          >
            <Terminal className="h-4 w-4 text-muted" />
            {showTerminal ? 'Hide Terminal' : 'Show Terminal'}
          </button>
          <button
            onClick={fetchHealth}
            className="flex items-center gap-2 rounded-full border border-border-light bg-card px-3 py-2 text-sm font-medium text-text hover:bg-hover transition-colors"
          >
            <RefreshCw className={cn('h-4 w-4 text-muted', loading && 'animate-spin')} />
            Refresh
          </button>
        </div>
      </div>

      <div className={cn('overflow-hidden transition-all duration-300 ease-out', showTerminal ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0')}>
        <div className={cn('pt-6', showTerminal ? 'opacity-100' : 'opacity-0')}> 
          <TerminalPage hideHeader />
        </div>
      </div>

      <h1 className="text-4xl mt-10 font-bold text-text">Models configuration</h1>
          
      {/* ── AI Services Dashboard ── */}
      {(() => {
        const ollamaData = getServiceData(health, 'ollama');
        const claudeData = getServiceData(health, 'claude');
        const gpu = ollamaData?.gpu ?? null;
        const ollamaRunning = (ollamaData?.running ?? []) as Array<{ name: string; size: string; vram: string; processor: string; contextLength: number }>;
        const ollamaAvail = ((ollamaData?.available ?? []) as unknown) as Array<{ name: string; size: string; parameterSize: string }>;
        const ollamaRoles = (ollamaData?.roles ?? {}) as { llm?: string; chat?: string };

        const cardClass = 'bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden';
        const headerClass = 'flex items-center justify-between px-5 py-3 border-b border-border-light';

        return (
          <div className="space-y-4">

            {/* ── Row 1: Ollama ── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

              {/* ── Card 1: Ollama GPU & Status ── */}
              <div className={cardClass}>
                <div className={headerClass}>
                  <div className="flex items-center gap-2">
                    <Cpu className="size-6 text-accent" />
                    <h2 className="text-4xl font-black text-text">Ollama</h2>
                    {ollamaData?.latency != null && (
                      <span className="text-[10px] font-mono text-muted">{String(ollamaData.latency)}ms</span>
                    )}
                  </div>
                  <StatusDot ok={serviceStatus(health, 'ollama')} />
                </div>
                <div className="p-5 space-y-4">
                  {/* GPU Card */}
                  {gpu ? (
                    gpu.type === 'discrete' ? (
                      /* NVIDIA / discrete GPU */
                      <div className="rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-2xl font-semibold text-accent uppercase tracking-wide">GPU</p>
                          {gpu.temperature && <span className="text-3xl font-black text-muted">{gpu.temperature}</span>}
                        </div>
                        <p className="text-md font-bold text-text">{gpu.name}</p>
                        <div className="mt-3 space-y-2">
                          {gpu.memoryUsed && gpu.memoryTotal && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted">VRAM</span>
                                <span className="font-mono text-text">{gpu.memoryUsed} / {gpu.memoryTotal}</span>
                              </div>
                              <div className="h-2 rounded-full bg-hover overflow-hidden">
                                <div className="h-full rounded-full bg-accent transition-all" style={{
                                  width: `${Math.round((parseInt(gpu.memoryUsed) / parseInt(gpu.memoryTotal)) * 100)}%`
                                }} />
                              </div>
                            </div>
                          )}
                          {gpu.utilization && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted">Utilization</span>
                                <span className="font-mono font-semibold text-text">{gpu.utilization}</span>
                              </div>
                              <div className="h-2 rounded-full bg-hover overflow-hidden">
                                <div className="h-full rounded-full bg-success transition-all" style={{
                                  width: `${parseInt(gpu.utilization) || 0}%`
                                }} />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Apple Silicon / unified memory GPU */
                      <div className="rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-2xl font-semibold text-accent uppercase tracking-wide">GPU</p>
                          <span className="px-2 py-0.5 rounded-md text-md font-bold bg-accent/10 text-accent uppercase">Unified Memory</span>
                        </div>
                        <p className="text-md font-bold text-text">{gpu.name}</p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {gpu.unifiedMemory && (
                            <div className="rounded-lg bg-hover/50 px-3 py-2">
                              <p className="text-sm text-muted">Shared Memory</p>
                              <p className="text-lg font-mono font-semibold text-text">{gpu.unifiedMemory}</p>
                            </div>
                          )}
                          {gpu.gpuCores && (
                            <div className="rounded-lg bg-hover/50 px-3 py-2">
                              <p className="text-sm text-muted">GPU Cores</p>
                              <p className="text-lg font-mono font-semibold text-text">{gpu.gpuCores}</p>
                            </div>
                          )}
                          {gpu.metalFamily && (
                            <div className="rounded-lg bg-hover/50 px-3 py-2 col-span-2">
                              <p className="text-sm text-muted">Metal Support</p>
                              <p className="text-lg font-mono font-semibold text-text">{gpu.metalFamily}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="rounded-xs border border-border-light p-4 text-center">
                      <p className="text-xl text-muted">No GPU detected</p>
                      <p className="text-md text-light mt-0.5">Running on CPU</p>
                    </div>
                  )}

                  {/* Loaded models list */}
                  {ollamaRunning.length > 0 && (
                    <div>
                      <p className="text-xl font-semibold text-muted uppercase tracking-wide mb-2">Loaded Models</p>
                      <div className="space-y-1.5">
                        {ollamaRunning.map((r) => (
                          <div key={r.name} className="flex items-center gap-2 rounded-xs px-2.5 py-2 bg-success/5 border border-success/15">
                            <div className="flex-1 min-w-0">
                              <span className="text-xl font-mono font-semibold text-text truncate block">{r.name}</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={cn(
                                  'px-1.5 py-0.5 rounded text-md font-bold uppercase',
                                  r.processor === 'gpu' ? 'bg-success/15 text-success' :
                                  r.processor === 'cpu' ? 'bg-warning/15 text-warning' :
                                  'bg-accent/15 text-accent'
                                )}>
                                  {r.processor}
                                </span>
                                <span className="text-md text-muted">ctx:{r.contextLength}</span>
                                <span className="text-lg font-black text-muted">{r.size}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Card 2: Ollama Config & Models ── */}
              <div className={cardClass}>
                <div className={headerClass}>
                  <div className="flex items-center gap-2">
                    <Settings className="size-6 text-accent" />
                    <h2 className="text-4xl font-semibold text-text">Ollama Config</h2>
                  </div>
                </div>
                <div className="p-5 space-y-4">

                  {/* Model roles assignment */}
                  {ollamaAvail.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-md font-semibold text-muted uppercase tracking-wide">Model Assignment</p>
                      {([
                        { role: 'llm' as const, label: 'Extraction', desc: 'Code analysis' },
                        { role: 'chat' as const, label: 'Chat', desc: 'Chat widget' },
                      ]).map(({ role, label, desc }) => (
                        <div key={role} className="flex-2 items-center gap-2">
                          <div className="flex-shrink-0 flex gap-2 items-center">
                            <span className="text-sm font-semibold text-text">{label}</span>
                            <span className="h-1 w-1 bg-accent"></span>
                            <p className="text-sm text-muted leading-tight">{desc}</p>
                          </div>
                          <select
                            value={ollamaRoles[role] ?? ''}
                            onChange={async (e) => {
                              setLoadingModel(role);
                              try {
                                await api.setOllamaModel(role, e.target.value);
                                await fetchHealth();
                              } catch (err) { console.error(err); }
                              finally { setLoadingModel(null); }
                            }}
                            disabled={loadingModel !== null}
                            className="flex-1 w-full mt-2 rounded border border-border-light bg-card px-2 py-1 text-[11px] font-mono text-text outline-none focus:border-accent disabled:opacity-50"
                          >
                            {ollamaAvail.map((m) => (
                              <option key={m.name} value={m.name}>{m.name} ({m.parameterSize || m.size})</option>
                            ))}
                          </select>
                          {loadingModel === role && <Loader2 className="h-3 w-3 animate-spin text-accent flex-shrink-0" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Available models with load/unload */}
                  <div>
                    <p className="text-md font-semibold text-muted uppercase tracking-wide mb-2">Available Models ({ollamaAvail.length})</p>
                    <div className="space-y-1.5">
                      {[...ollamaAvail].sort((a, b) => {
                        const aRunning = ollamaRunning.some((r) => r.name === a.name) ? 0 : 1;
                        const bRunning = ollamaRunning.some((r) => r.name === b.name) ? 0 : 1;
                        return aRunning - bRunning;
                      }).slice(0, showAllModels ? undefined : 3).map((m) => {
                        const running = ollamaRunning.find((r) => r.name === m.name);
                        const isLoading = loadingModel === m.name;
                        return (
                          <div key={m.name} className={cn(
                            'flex items-center gap-2 rounded-xs px-2.5 py-2 transition-colors',
                            running ? 'bg-success/5 border border-success/15' : 'bg-hover/50',
                          )}>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-mono font-semibold text-text truncate">{m.name}</span>
                                <span className="text-xl text-muted font-black">{m.parameterSize || m.size}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {isLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                              ) : running ? (
                                <>
                                  {/* Toggle CPU/GPU */}
                                  <button
                                    onClick={async () => {
                                      const newProc = running.processor === 'gpu' ? 'cpu' : 'gpu';
                                      setLoadingModel(m.name);
                                      try {
                                        await api.loadOllamaModel(m.name, newProc);
                                        await fetchHealth();
                                      } catch (err) { console.error(err); }
                                      finally { setLoadingModel(null); }
                                    }}
                                    disabled={loadingModel !== null}
                                    title={running.processor === 'gpu' ? 'Switch to CPU' : 'Switch to GPU'}
                                    className={cn(
                                      'px-2 py-1 rounded text-xl font-bold uppercase transition-colors disabled:opacity-50',
                                      running.processor === 'gpu'
                                        ? 'bg-success/10 text-success hover:bg-warning/15 hover:text-warning'
                                        : 'bg-warning/10 text-warning hover:bg-success/15 hover:text-success',
                                    )}
                                  >
                                    {running.processor === 'gpu' ? '→ CPU' : '→ GPU'}
                                  </button>
                                  {/* Unload */}
                                  <button
                                    onClick={async () => {
                                      setLoadingModel(m.name);
                                      try {
                                        await api.unloadOllamaModel(m.name);
                                        await fetchHealth();
                                      } catch (err) { console.error(err); }
                                      finally { setLoadingModel(null); }
                                    }}
                                    disabled={loadingModel !== null}
                                    title="Unload model"
                                    className="p-2 rounded-full ml-2 border text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                                  >
                                    <Square className="size-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  {/* Load GPU */}
                                  <button
                                    onClick={async () => {
                                      setLoadingModel(m.name);
                                      try {
                                        await api.loadOllamaModel(m.name, 'gpu');
                                        await fetchHealth();
                                      } catch (err) { console.error(err); }
                                      finally { setLoadingModel(null); }
                                    }}
                                    disabled={loadingModel !== null}
                                    title="Load on GPU"
                                    className="px-2 py-1 rounded text-xl font-bold uppercase bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50"
                                  >
                                    GPU
                                  </button>
                                  {/* Load CPU */}
                                  <button
                                    onClick={async () => {
                                      setLoadingModel(m.name);
                                      try {
                                        await api.loadOllamaModel(m.name, 'cpu');
                                        await fetchHealth();
                                      } catch (err) { console.error(err); }
                                      finally { setLoadingModel(null); }
                                    }}
                                    disabled={loadingModel !== null}
                                    title="Load on CPU"
                                    className="px-2 py-1 rounded text-xl font-bold uppercase bg-hover text-muted hover:bg-warning/15 hover:text-warning transition-colors disabled:opacity-50"
                                  >
                                    CPU
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {ollamaAvail.length > 3 && (
                        <button
                          onClick={() => setShowAllModels(!showAllModels)}
                          className="flex items-center gap-1 text-xs text-accent hover:underline mt-1 px-2"
                        >
                          {showAllModels ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          {showAllModels ? 'Show less' : `Show all ${ollamaAvail.length} models`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Row 2: Graph Storage + Claude ── */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

              {/* ── Card 3: Graph Storage (PostgreSQL) ── */}
              <div className={cardClass}>
                <div className={headerClass}>
                  <div className="flex items-center gap-2">
                    <Brain className="size-6 text-accent" />
                    <h2 className="text-4xl font-semibold text-text">Graph Storage</h2>
                  </div>
                  <StatusDot ok={serviceStatus(health, 'graphStorage')} />
                </div>
                <div className="p-5 space-y-4">
                  <div className="rounded-xs border border-success/20 bg-gradient-to-br from-success/5 to-transparent p-4">
                    <p className="text-xl font-semibold uppercase tracking-wide text-muted mb-2">Engine</p>
                    <p className="text-sm font-mono text-text">graphify + PostgreSQL</p>
                  </div>
                </div>
              </div>

              {/* ── Card 4: Claude CLI ── */}
              <div className={cardClass}>
                <div className={headerClass}>
                  <div className="flex items-center gap-2">
                    <Brain className="size-6 text-accent" />
                    <h2 className="text-4xl font-semibold text-text">Claude CLI</h2>
                  </div>
                  <StatusDot ok={claudeData?.status === 'ok' ? true : claudeData ? false : null} />
                </div>
                <div className="p-5 space-y-4">
                {/* Status card */}
                <div className={cn(
                  'rounded-xs border p-4',
                  claudeData?.status === 'ok'
                    ? 'border-success/20 bg-gradient-to-br from-success/5 to-transparent'
                    : 'border-error/20 bg-gradient-to-br from-error/5 to-transparent'
                )}>
                  <p className="text-2xl font-semibold uppercase tracking-wide text-muted mb-2">Extraction Engine</p>
                  {claudeData?.status === 'ok' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm font-semibold text-success">Available</span>
                      </div>
                      <p className="text-[11px] font-mono text-muted">{String(claudeData.version)}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-error" />
                      <span className="text-sm font-semibold text-error">Not found</span>
                    </div>
                  )}
                </div>

                {/* Model config */}
                {claudeData?.model && (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-hover/50 p-4">
                      <p className="text-xl text-muted uppercase tracking-wide mb-2 text-center">Extraction Model</p>
                      <div className="flex items-center gap-2">
                        {(['haiku', 'sonnet', 'opus'] as const).map((m) => {
                          const current = claudeData.model as string;
                          const isActive = current === m;
                          return (
                            <button
                              key={m}
                              disabled={savingModel}
                              onClick={async () => {
                                if (isActive) return;
                                setSavingModel(true);
                                try {
                                  await api.setModel(m);
                                  await fetchHealth();
                                } catch (err) {
                                  console.error('Failed to set model:', err);
                                } finally {
                                  setSavingModel(false);
                                }
                              }}
                              className={cn(
                                'flex-1 py-2 rounded-lg text-lg font-bold uppercase tracking-wide transition-all',
                                isActive
                                  ? 'bg-accent text-white shadow-sm'
                                  : 'bg-transparent border border-border-light text-muted hover:border-accent/50 hover:text-text',
                                savingModel && 'opacity-50 cursor-not-allowed',
                              )}
                            >
                              {m}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-md text-muted space-y-1.5 pt-6">
                      <p>Used for code analysis during scans. Each file is analyzed via <code className="px-1 py-0.5 rounded bg-hover font-mono">claude --print</code></p>
                      <div className="flex items-center justify-between text-xl pt-2 border-t border-border-light/50">
                        <span className="font-black">Speed</span>
                        <span className="font-mono text-text">
                          {(claudeData.model as string) === 'haiku' ? 'Fast (3x)' :
                           (claudeData.model as string) === 'sonnet' ? 'Medium' : 'Slow (best quality)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xl">
                        <span className="font-black">Config</span>
                        <span className="font-mono text-text">CORTEX_LLM_MODEL</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Small status for Postgres + Redis */}
                <div className="border-t border-border-light/50 pt-10 space-y-2">
                  <p className="text-2xl font-semibold text-muted uppercase tracking-wide">Core Services</p>
                  {['postgres', 'redis'].map((key) => {
                    const ok = serviceStatus(health, key);
                    const data = getServiceData(health, key);
                    const name = key === 'postgres' ? 'PostgreSQL' : 'Redis';
                    return (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusDot ok={ok} />
                          <span className="text-xl text-text">{name}</span>
                        </div>
                        {data?.latency != null && (
                          <span className="text-[10px] font-mono text-muted">{data.latency}ms</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}

<h1 className="text-4xl mt-10 font-bold text-text">Variables and setup</h1>


      {/* Scan Progress Monitor */}
      {/* {scanJobs && scanJobs.length > 0 && (
        <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <div className="flex items-center gap-5">
              <ScanSearch className="size-6 text-accent" />
              <h2 className="text-4xl font-semibold text-text">Scan Monitor</h2>
            </div>
            <div className="flex items-center gap-2">
              {scanJobs.some((j) => j.status === 'paused') && (
                <button
                  onClick={async () => { try { await api.resumePausedScans(); fetchScans(); } catch {} }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30 text-xs font-semibold text-warning hover:bg-warning/20 transition-colors"
                >
                  <Play className="h-3 w-3" />
                  Resume all
                </button>
              )}
              {scanJobs.some((j) => j.status === 'completed' || j.status === 'failed') && (
                <button
                  onClick={async () => {
                    const done = scanJobs.filter((j) => j.status === 'completed' || j.status === 'failed');
                    await Promise.all(done.map((j) => api.deleteScanJob(j.id).catch(() => {})));
                    fetchScans();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hover border border-border-light text-xs font-medium text-muted hover:text-error hover:border-error/30 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Clear done
                </button>
              )}
              <span className="text-xs text-muted ml-1">
                {scanJobs.filter((j) => j.status === 'running' || j.status === 'queued').length} active
                {scanJobs.some((j) => j.status === 'paused') && ` · ${scanJobs.filter((j) => j.status === 'paused').length} paused`}
              </span>
            </div>
          </div>
          <div className="divide-y divide-border-light">
            {scanJobs
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 15)
              .map((job) => {
                const isRunning = job.status === 'running';
                const isQueued = job.status === 'queued';
                const isActive = isRunning || isQueued;
                const isPaused = job.status === 'paused';
                const isOk = job.status === 'completed';
                const isFailed = job.status === 'failed';
                const isSuperseded = isFailed && job.error?.includes('Superseded');
                const isExpanded = expandedScan === job.id;
                const stats = (job.stats ?? {}) as Record<string, unknown>;
                const phase = stats.phase as string | undefined;
                const totalFiles = stats.totalFiles as number | undefined;
                const totalDocs = stats.totalDocuments as number | undefined;
                const llmBatches = stats.llmBatches as number | undefined;
                return (
                  <div key={job.id}>
                  <div
                    className={cn(
                      'group flex items-center gap-4 px-5 py-3 transition-colors cursor-pointer',
                      isActive && 'bg-accent-light/30',
                      isPaused && 'bg-warning/5',
                      isExpanded && 'bg-hover/50',
                    )}
                    onClick={() => setExpandedScan(isExpanded ? null : job.id)}
                  >*
                    <div className="shrink-0 w-4">
                      {isExpanded
                        ? <ChevronDown className="h-3.5 w-3.5 text-muted" />
                        : <ChevronRight className="h-3.5 w-3.5 text-muted" />}
                    </div>*
                    <div className="shrink-0">
                      {isRunning ? (
                        <Loader2 className="h-4 w-4 text-accent animate-spin" />
                      ) : isQueued ? (
                        <Clock className="h-4 w-4 text-muted" />
                      ) : isPaused ? (
                        <Pause className="h-4 w-4 text-warning" />
                      ) : isOk ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : isSuperseded ? (
                        <AlertCircle className="h-4 w-4 text-muted" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-error" />
                      )}
                    </div>
*
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-medium text-text truncate">{(repoMap ?? {})[job.repoId] || job.repoId.slice(0, 8)}</span>
                        <span className="text-[10px] font-mono text-muted">{job.branch}</span>
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase',
                          isPaused ? 'bg-warning/10 text-warning' : isActive ? 'bg-accent-light text-accent' : isOk ? 'bg-success-light text-success' : isSuperseded ? 'bg-hover text-muted' : isFailed ? 'bg-error-light text-error' : 'bg-hover text-muted'
                        )}>
                          {job.mode}
                        </span>
                      </div>
                      {isActive && (
                        <div className="mt-1.5 h-1 rounded-full bg-hover overflow-hidden">
                          <div className="h-full rounded-full bg-accent transition-all duration-500" style={{
                            width: isRunning
                              ? phase === 'parsing'
                                ? totalFiles ? `${Math.round(((stats.filesProcessed as number) / totalFiles) * 50)}%` : '20%'
                                : phase === 'llm_extraction' ? '60%'
                                : phase === 'ingestion'
                                  ? totalDocs ? `${50 + Math.round(((stats.documentsIngested as number) / totalDocs) * 50)}%` : '80%'
                                : '30%'
                              : '5%'
                          }} />
                        </div>
                      )}
                      {phase && isRunning && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-accent/10 text-[9px] font-mono font-semibold text-accent uppercase">
                          {phase.replace('_', ' ')}
                        </span>
                      )}
                      {!isExpanded && stats && typeof stats === 'object' && (
                        <div className="flex gap-3 mt-1 text-[10px] text-muted">
                          {Object.entries(stats).filter(([k, v]) => typeof v === 'number' && v > 0 && !['totalFiles', 'totalDocuments', 'llmBatches'].includes(k)).slice(0, 4).map(([k, v]) => (
                            <span key={k}>{k}: <strong>{v as number}</strong></span>
                          ))}
                        </div>
                      )}
                    </div>
*
                    <div className="flex-shrink-0 text-right mr-2">
                      <span className={cn(
                        'text-xs font-semibold',
                        isPaused ? 'text-warning' : isActive ? 'text-accent' : isOk ? 'text-success' : isSuperseded ? 'text-muted' : isFailed ? 'text-error' : 'text-muted'
                      )}>
                        {isSuperseded ? 'superseded' : job.status}
                      </span>
                      <p className="text-[10px] text-muted">{timeAgo(job.createdAt)}</p>
                    </div>
*
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
             *
                      {isActive && (
                        <button
                          onClick={async () => { try { await api.pauseScanJob(job.id); fetchScans(); } catch {} }}
                          title="Pause scan"
                          className="p-1.5 rounded hover:bg-warning/10 text-muted hover:text-warning transition-colors"
                        >
                          <Pause className="h-3.5 w-3.5" />
                        </button>
                      )}*
                      {isPaused && (
                        <button
                          onClick={async () => { try { await api.resumeScanJob(job.id); fetchScans(); } catch {} }}
                          title="Resume scan"
                          className="p-1.5 rounded hover:bg-success/10 text-muted hover:text-success transition-colors"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </button>
                      )}*
                      <button
                        onClick={async () => { try { await api.deleteScanJob(job.id); fetchScans(); } catch {} }}
                        title="Delete scan"
                        className="p-1.5 rounded hover:bg-error/10 text-muted hover:text-error transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
*
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-2 bg-bg/50 border-t border-border-light/30">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        {[
                          { label: 'Files', value: stats.filesProcessed, total: totalFiles },
                          { label: 'Chunks', value: stats.chunksProcessed },
                          { label: 'Entities', value: stats.entitiesExtracted },
                          { label: 'Ingested', value: stats.documentsIngested, total: totalDocs },
                        ].map(({ label, value, total }) => (
                          <div key={label} className="rounded-lg bg-card border border-border-light/50 p-3">
                            <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">{label}</span>
                            <p className="text-lg font-bold font-mono text-text mt-0.5">
                              {typeof value === 'number' ? value : 0}
                              {total != null && <span className="text-xs font-normal text-muted"> / {total}</span>}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg bg-card border border-border-light/50 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-muted uppercase tracking-wide">Details</span>
                          {phase && (
                            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-[10px] font-mono font-bold text-accent uppercase">
                              {phase.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                          <div className="flex justify-between"><span className="text-muted">Job ID</span><span className="font-mono text-text">{job.id.slice(0, 8)}</span></div>
                          <div className="flex justify-between"><span className="text-muted">Mode</span><span className="font-mono text-text uppercase">{job.mode}</span></div>
                          {job.startedAt && <div className="flex justify-between"><span className="text-muted">Started</span><span className="font-mono text-text">{new Date(job.startedAt).toLocaleTimeString()}</span></div>}
                          {job.completedAt && <div className="flex justify-between"><span className="text-muted">Completed</span><span className="font-mono text-text">{new Date(job.completedAt).toLocaleTimeString()}</span></div>}
                          {job.startedAt && (
                            <div className="flex justify-between"><span className="text-muted">Duration</span><span className="font-mono text-text">{(() => { const s = Math.round(((job.completedAt ? new Date(job.completedAt).getTime() : Date.now()) - new Date(job.startedAt!).getTime()) / 1000); return s < 60 ? `${s}s` : `${Math.floor(s/60)}m ${s%60}s`; })()}</span></div>
                          )}
                          {llmBatches != null && <div className="flex justify-between"><span className="text-muted">LLM batches</span><span className="font-mono text-text">{llmBatches}</span></div>}
                          {(stats.relationsExtracted as number) > 0 && <div className="flex justify-between"><span className="text-muted">Relations</span><span className="font-mono text-text">{stats.relationsExtracted as number}</span></div>}
                        </div>
                        {job.error && !isSuperseded && (
                          <div className="mt-2 rounded-lg bg-error/5 border border-error/15 p-2">
                            <p className="text-[11px] text-error font-mono break-all">{job.error}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  </div>
                );
              })}
          </div>
        </div>
      )} */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Docker services table */}
        <div className="lg:col-span-2 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
          <div className="flex items-center gap-5 px-5 py-4 border-b border-border-light">
            <Server className="size-6 text-accent" />
            <h2 className="text-4xl font-semibold text-text">Docker Services</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light bg-bg">
                  <th className="px-5 py-3 text-left text-lg font-medium text-muted uppercase tracking-wide">Service</th>
                  <th className="px-5 py-3 text-left text-lg font-medium text-muted uppercase tracking-wide">Image</th>
                  <th className="px-5 py-3 text-left text-lg font-medium text-muted uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-left text-lg font-medium text-muted uppercase tracking-wide">Port</th>
                  <th className="px-5 py-3 text-right text-lg font-medium text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {DOCKER_SERVICES.map((svc) => {
                  const ok = svc.key === 'api' ? (health?.status === 'ok' ? true : null) : serviceStatus(health, svc.key);
                  const dockerName = svc.key === 'api' ? undefined : svc.key === 'postgres' ? 'postgres' : svc.key;
                  return (
                    <tr key={svc.key} className="hover:bg-hover/40 transition-colors h-20">
                      <td className="px-5 py-3.5 font-medium text-xl text-text">{svc.name}</td>
                      <td className="px-5 py-3.5 font-mono text-lg text-muted">{svc.image}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-md font-medium',
                          ok === null ? 'bg-border-light text-muted' : ok ? 'bg-success-light text-success' : 'bg-error-light text-error',
                        )}>
                          <StatusDot ok={ok} />
                          {ok === null ? 'Unknown' : ok ? 'Running' : 'Stopped'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xl text-muted">{svc.port}</td>
                      <td className="px-5 py-3.5 text-right">
                        {dockerName && (
                          <button
                            onClick={() => handleRestart(dockerName)}
                            disabled={restarting !== null}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded text-md border-2 border-accent font-medium text-muted hover:text-accent hover:bg-accent-light transition-colors disabled:opacity-40"
                          >
                            {restarting === dockerName
                              ? <Loader2 className="h-3 w-3 animate-spin" />
                              : <RotateCcw className="h-3 w-3" />
                            }
                            Restart
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {lastUpdated && (
            <div className="px-5 py-2 border-t border-border-light text-xs text-muted">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Environment Variables card */}
        <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light">
            <h2 className="text-3xl font-semibold text-text">Environment Variables</h2>
            <p className="mt-0.5 text-xl text-muted">Required for local development</p>
          </div>
          <div className="p-4 space-y-3">
            {ENV_VARS.map(({ key, sample }) => (
              <div key={key} className="rounded-xs bg-bg border border-border-light p-3">
                <p className="text-xl font-semibold text-accent mb-1 font-mono">{key}</p>
                <p className="text-xs text-muted font-mono truncate" title={sample}>{sample}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Setup card */}
      <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border-light">
          <h2 className="text-5xl font-semibold text-text">Quick Setup</h2>
          <p className="mt-0.5 text-xl text-muted">Run these commands to bootstrap the full Cortex stack</p>
        </div>
        <div className="p-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {SETUP_COMMANDS.map(({ label, command }) => (
            <div key={label} className="bg-black rounded-[--radius-md] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-xl font-medium text-white/40"># {label}</span>
                <CopyButton text={command} />
              </div>
              <div className="px-4 py-3">
                <code className="font-mono text-md text-white/90 break-all">{command}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
