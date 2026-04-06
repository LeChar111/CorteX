import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Cpu, Brain, RefreshCw, Server, Play, Pause, Square, RotateCcw, Loader2, ScanSearch, CheckCircle2, AlertCircle, Clock, Trash2, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { timeAgo } from '../lib/helpers.ts';
import { DOCKER_SERVICES, ENV_VARS, SETUP_COMMANDS } from '../lib/config.ts';
import { StatusDot } from '../components/StatusDot.tsx';
import { CopyButton } from '../components/CopyButton.tsx';
import { usePolling } from '../hooks/usePolling.ts';
import { useAsyncData } from '../hooks/useAsyncData.ts';
function getServiceData(health, key) {
    if (!health)
        return null;
    const svc = health.services[key];
    if (!svc)
        return null;
    if (typeof svc === 'string')
        return { status: svc };
    return svc;
}
function serviceStatus(health, key) {
    if (!health)
        return null;
    const svc = health.services[key];
    if (!svc)
        return null;
    // API returns either a string ("ok") or an object ({ status: "ok" })
    if (typeof svc === 'string')
        return svc === 'ok';
    return svc.status === 'ok';
}
export function Infrastructure() {
    const [lastUpdated, setLastUpdated] = useState(null);
    const [restarting, setRestarting] = useState(null);
    const [savingModel, setSavingModel] = useState(false);
    const [savingLightrag, setSavingLightrag] = useState(false);
    const [loadingModel, setLoadingModel] = useState(null);
    // Centralized polling for health and scans
    const { data: health, loading, refetch: fetchHealth } = usePolling(async () => {
        const data = await api.health();
        setLastUpdated(new Date());
        return data;
    }, 30_000);
    const { data: scanJobs, refetch: fetchScans } = usePolling(() => api.getScanStatus(), 5_000);
    // Build repo name lookup
    const { data: repoMap } = useAsyncData(async () => {
        const projects = await api.listProjects();
        const allRepos = await Promise.all(projects.map((p) => api.getRepos(p.id).catch(() => [])));
        const map = {};
        allRepos.flat().forEach((r) => { map[r.id] = r.name; });
        return map;
    }, []);
    const handleRestart = async (service) => {
        const key = service || 'all';
        setRestarting(key);
        try {
            await api.restartServices(service);
            // Wait a bit for services to come back
            setTimeout(fetchHealth, 3000);
        }
        catch (err) {
            console.error('Restart failed:', err);
        }
        setTimeout(() => setRestarting(null), 4000);
    };
    const handleStart = async () => {
        setRestarting('all');
        try {
            await api.startServices();
            setTimeout(fetchHealth, 5000);
        }
        catch (err) {
            console.error('Start failed:', err);
        }
        setTimeout(() => setRestarting(null), 6000);
    };
    const handleStop = async () => {
        setRestarting('all');
        try {
            await api.stopServices();
            setTimeout(fetchHealth, 3000);
        }
        catch (err) {
            console.error('Stop failed:', err);
        }
        setTimeout(() => setRestarting(null), 4000);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-6xl font-bold text-text", children: "Infrastructure" }), _jsx("p", { className: "mt-0.5 text-xl text-muted", children: "Docker services status & setup guide" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: handleStart, disabled: restarting !== null, className: "flex items-center gap-2 rounded-xl border border-success/30 bg-success-light px-3 py-2 text-sm font-medium text-success hover:bg-success/15 transition-colors disabled:opacity-50", children: [_jsx(Play, { className: "h-3.5 w-3.5" }), "Start All"] }), _jsxs("button", { onClick: () => handleRestart(), disabled: restarting !== null, className: "flex items-center gap-2 rounded-full border border-accent/30 bg-accent-light px-3 py-2 text-sm font-medium text-accent hover:bg-accent/15 transition-colors disabled:opacity-50", children: [restarting === 'all' ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : _jsx(RotateCcw, { className: "h-3.5 w-3.5" }), "Restart All"] }), _jsxs("button", { onClick: handleStop, disabled: restarting !== null, className: "flex items-center gap-2 rounded-full border border-error/30 bg-error-light px-3 py-2 text-sm font-medium text-error hover:bg-error/15 transition-colors disabled:opacity-50", children: [_jsx(Square, { className: "h-3.5 w-3.5" }), "Stop All"] }), _jsxs("button", { onClick: fetchHealth, className: "flex items-center gap-2 rounded-full border border-border-light bg-card px-3 py-2 text-sm font-medium text-text hover:bg-hover transition-colors", children: [_jsx(RefreshCw, { className: cn('h-4 w-4 text-muted', loading && 'animate-spin') }), "Refresh"] })] })] }), (() => {
                const ollamaData = getServiceData(health, 'ollama');
                const lightragData = getServiceData(health, 'lightrag');
                const claudeData = getServiceData(health, 'claude');
                const gpu = ollamaData?.gpu ?? null;
                const ollamaRunning = (ollamaData?.running ?? []);
                const ollamaAvail = (ollamaData?.available ?? []);
                const ollamaRoles = (ollamaData?.roles ?? {});
                const docs = (lightragData?.documents ?? {});
                const totalDocs = docs.all ?? 0;
                const processedDocs = docs.processed ?? 0;
                const pendingDocs = (docs.pending ?? 0) + (docs.processing ?? 0);
                const failedDocs = docs.failed ?? 0;
                const progressPct = totalDocs > 0 ? Math.round((processedDocs / totalDocs) * 100) : 0;
                return (_jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3", children: [_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border-light", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Cpu, { className: "size-8 text-accent" }), _jsx("h2", { className: "text-4xl font-semibold text-text", children: "Ollama" })] }), _jsx(StatusDot, { ok: serviceStatus(health, 'ollama') })] }), _jsxs("div", { className: "p-5 space-y-4", children: [gpu ? (_jsxs("div", { className: "rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("p", { className: "text-xs font-semibold text-accent uppercase tracking-wide", children: "GPU" }), _jsx("span", { className: "text-[10px] font-mono text-muted", children: gpu.temperature })] }), _jsx("p", { className: "text-sm font-bold text-text", children: gpu.name }), _jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-[11px] mb-1", children: [_jsx("span", { className: "text-muted", children: "VRAM" }), _jsxs("span", { className: "font-mono text-text", children: [gpu.memoryUsed, " / ", gpu.memoryTotal] })] }), _jsx("div", { className: "h-2 rounded-full bg-hover overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-accent transition-all", style: {
                                                                            width: `${Math.round((parseInt(gpu.memoryUsed) / parseInt(gpu.memoryTotal)) * 100)}%`
                                                                        } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-[11px] mb-1", children: [_jsx("span", { className: "text-muted", children: "Utilization" }), _jsx("span", { className: "font-mono font-semibold text-text", children: gpu.utilization })] }), _jsx("div", { className: "h-2 rounded-full bg-hover overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-success transition-all", style: {
                                                                            width: `${parseInt(gpu.utilization) || 0}%`
                                                                        } }) })] })] })] })) : (_jsxs("div", { className: "rounded-xs border border-border-light p-4 text-center", children: [_jsx("p", { className: "text-xl text-muted", children: "No GPU detected" }), _jsx("p", { className: "text-md text-light mt-0.5", children: "Running on CPU" })] })), (() => {
                                            const conf = lightragData?.config;
                                            if (!conf)
                                                return null;
                                            const params = [
                                                { key: 'maxParallelInsert', label: 'Parallel', value: conf.maxParallelInsert, min: 1, max: 16 },
                                                { key: 'maxAsync', label: 'LLM Async', value: conf.maxAsync, min: 1, max: 32 },
                                                { key: 'embeddingFuncMaxAsync', label: 'Emb. Async', value: conf.embeddingFuncMaxAsync, min: 1, max: 32 },
                                                { key: 'embeddingBatchNum', label: 'Emb. Batch', value: conf.embeddingBatchNum, min: 1, max: 64 },
                                            ];
                                            return (_jsxs("div", { className: "rounded-lg bg-hover/50 p-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-[10px] font-semibold text-muted uppercase tracking-wide", children: "Perf. Tuning" }), savingLightrag && _jsx(Loader2, { className: "h-3 w-3 animate-spin text-accent" })] }), _jsx("div", { className: "grid grid-cols-2 gap-x-3 gap-y-1.5", children: params.map(({ key, label, value, min, max }) => (_jsxs("div", { className: "flex items-center justify-between gap-1", children: [_jsx("span", { className: "text-[10px] text-muted truncate", children: label }), _jsx("select", { value: value, onChange: async (e) => {
                                                                        setSavingLightrag(true);
                                                                        try {
                                                                            await api.updateLightragConfig({ [key]: Number(e.target.value) });
                                                                            await fetchHealth();
                                                                        }
                                                                        catch (err) {
                                                                            console.error(err);
                                                                        }
                                                                        finally {
                                                                            setSavingLightrag(false);
                                                                        }
                                                                    }, disabled: savingLightrag, className: "w-12 rounded border border-border-light bg-card px-1 py-0.5 text-[10px] font-mono font-semibold text-text outline-none disabled:opacity-50", children: Array.from({ length: Math.ceil(max / (max <= 16 ? 1 : 2)) }, (_, i) => {
                                                                        const v = max <= 16 ? i + 1 : (i + 1) * 2;
                                                                        return v <= max ? _jsx("option", { value: v, children: v }, v) : null;
                                                                    }) })] }, key))) })] }));
                                        })(), ollamaAvail.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-[10px] font-semibold text-muted uppercase tracking-wide", children: "Model Assignment" }), ([
                                                    { role: 'llm', label: 'LightRAG', desc: 'Extraction & RAG' },
                                                    { role: 'chat', label: 'Chat', desc: 'Chat widget' },
                                                ]).map(({ role, label, desc }) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "w-16 flex-shrink-0", children: [_jsx("span", { className: "text-[10px] font-semibold text-text", children: label }), _jsx("p", { className: "text-[9px] text-muted leading-tight", children: desc })] }), _jsx("select", { value: ollamaRoles[role] ?? '', onChange: async (e) => {
                                                                setLoadingModel(role);
                                                                try {
                                                                    await api.setOllamaModel(role, e.target.value);
                                                                    await fetchHealth();
                                                                }
                                                                catch (err) {
                                                                    console.error(err);
                                                                }
                                                                finally {
                                                                    setLoadingModel(null);
                                                                }
                                                            }, disabled: loadingModel !== null, className: "flex-1 min-w-0 rounded border border-border-light bg-card px-2 py-1 text-[11px] font-mono text-text outline-none focus:border-accent disabled:opacity-50", children: ollamaAvail.map((m) => (_jsxs("option", { value: m.name, children: [m.name, " (", m.parameterSize || m.size, ")"] }, m.name))) }), loadingModel === role && _jsx(Loader2, { className: "h-3 w-3 animate-spin text-accent flex-shrink-0" })] }, role)))] })), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-semibold text-muted uppercase tracking-wide mb-2", children: "Available Models" }), _jsx("div", { className: "space-y-1.5", children: ollamaAvail.map((m) => {
                                                        const running = ollamaRunning.find((r) => r.name === m.name);
                                                        const isLoading = loadingModel === m.name;
                                                        return (_jsxs("div", { className: cn('flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors', running ? 'bg-success/5 border border-success/15' : 'bg-hover/50'), children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[11px] font-mono font-semibold text-text truncate", children: m.name }), _jsx("span", { className: "text-[9px] text-muted", children: m.parameterSize || m.size })] }), running && (_jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [_jsx("span", { className: cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase', running.processor === 'gpu' ? 'bg-success/15 text-success' :
                                                                                        running.processor === 'cpu' ? 'bg-warning/15 text-warning' :
                                                                                            'bg-accent/15 text-accent'), children: running.processor }), _jsxs("span", { className: "text-[9px] text-muted", children: ["ctx:", running.contextLength] }), _jsx("span", { className: "text-[9px] text-muted", children: running.size })] }))] }), _jsx("div", { className: "flex items-center gap-1 flex-shrink-0", children: isLoading ? (_jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin text-accent" })) : running ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: async () => {
                                                                                    const newProc = running.processor === 'gpu' ? 'cpu' : 'gpu';
                                                                                    setLoadingModel(m.name);
                                                                                    try {
                                                                                        await api.loadOllamaModel(m.name, newProc);
                                                                                        await fetchHealth();
                                                                                    }
                                                                                    catch (err) {
                                                                                        console.error(err);
                                                                                    }
                                                                                    finally {
                                                                                        setLoadingModel(null);
                                                                                    }
                                                                                }, disabled: loadingModel !== null, title: running.processor === 'gpu' ? 'Switch to CPU' : 'Switch to GPU', className: cn('px-2 py-1 rounded text-[9px] font-bold uppercase transition-colors disabled:opacity-50', running.processor === 'gpu'
                                                                                    ? 'bg-success/10 text-success hover:bg-warning/15 hover:text-warning'
                                                                                    : 'bg-warning/10 text-warning hover:bg-success/15 hover:text-success'), children: running.processor === 'gpu' ? '→ CPU' : '→ GPU' }), _jsx("button", { onClick: async () => {
                                                                                    setLoadingModel(m.name);
                                                                                    try {
                                                                                        await api.unloadOllamaModel(m.name);
                                                                                        await fetchHealth();
                                                                                    }
                                                                                    catch (err) {
                                                                                        console.error(err);
                                                                                    }
                                                                                    finally {
                                                                                        setLoadingModel(null);
                                                                                    }
                                                                                }, disabled: loadingModel !== null, title: "Unload model", className: "p-1 rounded text-muted hover:text-error hover:bg-error/10 transition-colors disabled:opacity-50", children: _jsx(Square, { className: "h-3 w-3" }) })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: async () => {
                                                                                    setLoadingModel(m.name);
                                                                                    try {
                                                                                        await api.loadOllamaModel(m.name, 'gpu');
                                                                                        await fetchHealth();
                                                                                    }
                                                                                    catch (err) {
                                                                                        console.error(err);
                                                                                    }
                                                                                    finally {
                                                                                        setLoadingModel(null);
                                                                                    }
                                                                                }, disabled: loadingModel !== null, title: "Load on GPU", className: "px-2 py-1 rounded text-[9px] font-bold uppercase bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50", children: "GPU" }), _jsx("button", { onClick: async () => {
                                                                                    setLoadingModel(m.name);
                                                                                    try {
                                                                                        await api.loadOllamaModel(m.name, 'cpu');
                                                                                        await fetchHealth();
                                                                                    }
                                                                                    catch (err) {
                                                                                        console.error(err);
                                                                                    }
                                                                                    finally {
                                                                                        setLoadingModel(null);
                                                                                    }
                                                                                }, disabled: loadingModel !== null, title: "Load on CPU", className: "px-2 py-1 rounded text-[9px] font-bold uppercase bg-hover text-muted hover:bg-warning/15 hover:text-warning transition-colors disabled:opacity-50", children: "CPU" })] })) })] }, m.name));
                                                    }) })] }), ollamaData?.latency != null && (_jsxs("p", { className: "text-[10px] text-light", children: ["Response: ", String(ollamaData.latency), "ms"] }))] })] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border-light", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "size-8 text-accent" }), _jsx("h2", { className: "text-4xl font-semibold text-text", children: "LightRAG" })] }), _jsx(StatusDot, { ok: serviceStatus(health, 'lightrag') })] }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: cn('rounded-xl border p-4', lightragData?.pipelineBusy
                                                ? 'border-warning/20 bg-gradient-to-br from-warning/5 to-transparent'
                                                : 'border-success/20 bg-gradient-to-br from-success/5 to-transparent'), children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted", children: "Pipeline" }), _jsx("span", { className: cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase', lightragData?.pipelineBusy ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'), children: lightragData?.pipelineBusy ? 'Processing' : 'Idle' })] }), lightragData?.pipelineBusy && pendingDocs > 0 && (_jsxs("div", { className: "mt-2", children: [_jsxs("div", { className: "flex justify-between text-[11px] mb-1", children: [_jsx("span", { className: "text-muted", children: "Progress" }), _jsxs("span", { className: "font-mono text-text", children: [processedDocs, "/", totalDocs, " docs (", progressPct, "%)"] })] }), _jsx("div", { className: "h-2 rounded-full bg-hover overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-accent transition-all duration-500", style: { width: `${progressPct}%` } }) })] }))] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                                                { label: 'Processed', value: processedDocs, color: 'text-success' },
                                                { label: 'Pending', value: pendingDocs, color: 'text-warning' },
                                                { label: 'Failed', value: failedDocs, color: failedDocs > 0 ? 'text-error' : 'text-muted', action: failedDocs > 0 },
                                                { label: 'Total', value: totalDocs, color: 'text-text' },
                                            ].map(({ label, value, color, action }) => (_jsxs("div", { className: "rounded-lg bg-hover/50 p-3 text-center", children: [_jsx("p", { className: cn('text-lg font-bold font-mono', color), children: value }), _jsx("p", { className: "text-[10px] text-muted uppercase tracking-wide", children: label }), action && (_jsx("button", { onClick: async () => {
                                                            try {
                                                                await api.reprocessFailedDocuments();
                                                                fetchHealth();
                                                            }
                                                            catch (err) {
                                                                console.error(err);
                                                            }
                                                        }, className: "mt-1 text-[10px] font-semibold text-accent hover:underline", children: "Retry all" }))] }, label))) }), _jsxs("div", { className: "flex items-center justify-between text-xs border-t border-border-light/50 pt-3", children: [_jsx("span", { className: "text-muted", children: "Graph entities" }), _jsx("span", { className: "font-mono font-semibold text-text", children: String(lightragData?.graphLabels ?? 0) })] }), lightragData?.llmModel && (_jsxs("div", { className: "space-y-1 text-[11px]", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "LLM" }), _jsx("span", { className: "font-mono text-text", children: lightragData.llmModel })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "Embedding" }), _jsx("span", { className: "font-mono text-text", children: lightragData.embeddingModel })] })] })), lightragData?.version && (_jsxs("p", { className: "text-[10px] text-light", children: ["v", String(lightragData.version), " - ", String(lightragData?.latency), "ms"] }))] })] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border-light", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "size-8 text-accent" }), _jsx("h2", { className: "text-4xl font-semibold text-text", children: "Claude CLI" })] }), _jsx(StatusDot, { ok: claudeData?.status === 'ok' ? true : claudeData ? false : null })] }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: cn('rounded-xl border p-4', claudeData?.status === 'ok'
                                                ? 'border-success/20 bg-gradient-to-br from-success/5 to-transparent'
                                                : 'border-error/20 bg-gradient-to-br from-error/5 to-transparent'), children: [_jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted mb-2", children: "Extraction Engine" }), claudeData?.status === 'ok' ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-success" }), _jsx("span", { className: "text-sm font-semibold text-success", children: "Available" })] }), _jsx("p", { className: "text-[11px] font-mono text-muted", children: String(claudeData.version) })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-error" }), _jsx("span", { className: "text-sm font-semibold text-error", children: "Not found" })] }))] }), claudeData?.model && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "rounded-lg bg-hover/50 p-4", children: [_jsx("p", { className: "text-xs text-muted uppercase tracking-wide mb-2 text-center", children: "Extraction Model" }), _jsx("div", { className: "flex items-center gap-2", children: ['haiku', 'sonnet', 'opus'].map((m) => {
                                                                const current = claudeData.model;
                                                                const isActive = current === m;
                                                                return (_jsx("button", { disabled: savingModel, onClick: async () => {
                                                                        if (isActive)
                                                                            return;
                                                                        setSavingModel(true);
                                                                        try {
                                                                            await api.setModel(m);
                                                                            await fetchHealth();
                                                                        }
                                                                        catch (err) {
                                                                            console.error('Failed to set model:', err);
                                                                        }
                                                                        finally {
                                                                            setSavingModel(false);
                                                                        }
                                                                    }, className: cn('flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all', isActive
                                                                        ? 'bg-accent text-white shadow-sm'
                                                                        : 'bg-transparent border border-border-light text-muted hover:border-accent/50 hover:text-text', savingModel && 'opacity-50 cursor-not-allowed'), children: m }, m));
                                                            }) })] }), _jsxs("div", { className: "text-[11px] text-muted space-y-1.5", children: [_jsxs("p", { children: ["Used for code analysis during scans. Each file is analyzed via ", _jsx("code", { className: "px-1 py-0.5 rounded bg-hover font-mono", children: "claude --print" })] }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border-light/50", children: [_jsx("span", { children: "Speed" }), _jsx("span", { className: "font-mono text-text", children: claudeData.model === 'haiku' ? 'Fast (3x)' :
                                                                        claudeData.model === 'sonnet' ? 'Medium' : 'Slow (best quality)' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Config" }), _jsx("span", { className: "font-mono text-text", children: "CORTEX_LLM_MODEL" })] })] })] })), _jsxs("div", { className: "border-t border-border-light/50 pt-3 space-y-2", children: [_jsx("p", { className: "text-[11px] font-semibold text-muted uppercase tracking-wide", children: "Core Services" }), ['postgres', 'redis'].map((key) => {
                                                    const ok = serviceStatus(health, key);
                                                    const data = getServiceData(health, key);
                                                    const name = key === 'postgres' ? 'PostgreSQL' : 'Redis';
                                                    return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(StatusDot, { ok: ok }), _jsx("span", { className: "text-xs text-text", children: name })] }), data?.latency != null && (_jsxs("span", { className: "text-[10px] font-mono text-muted", children: [data.latency, "ms"] }))] }, key));
                                                })] })] })] })] }));
            })(), scanJobs && scanJobs.length > 0 && (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border-light", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ScanSearch, { className: "h-4 w-4 text-accent" }), _jsx("h2", { className: "text-sm font-semibold text-text", children: "Scan Monitor" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [scanJobs.some((j) => j.status === 'paused') && (_jsxs("button", { onClick: async () => { try {
                                            await api.resumePausedScans();
                                            fetchScans();
                                        }
                                        catch { } }, className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/30 text-xs font-semibold text-warning hover:bg-warning/20 transition-colors", children: [_jsx(Play, { className: "h-3 w-3" }), "Resume all"] })), scanJobs.some((j) => j.status === 'completed' || j.status === 'failed') && (_jsxs("button", { onClick: async () => {
                                            const done = scanJobs.filter((j) => j.status === 'completed' || j.status === 'failed');
                                            await Promise.all(done.map((j) => api.deleteScanJob(j.id).catch(() => { })));
                                            fetchScans();
                                        }, className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-hover border border-border-light text-xs font-medium text-muted hover:text-error hover:border-error/30 transition-colors", children: [_jsx(Trash2, { className: "h-3 w-3" }), "Clear done"] })), _jsxs("span", { className: "text-xs text-muted ml-1", children: [scanJobs.filter((j) => j.status === 'running' || j.status === 'queued').length, " active", scanJobs.some((j) => j.status === 'paused') && ` · ${scanJobs.filter((j) => j.status === 'paused').length} paused`] })] })] }), _jsx("div", { className: "divide-y divide-border-light", children: scanJobs
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
                            return (_jsxs("div", { className: cn('group flex items-center gap-4 px-5 py-3 transition-colors', isActive && 'bg-accent-light/30', isPaused && 'bg-warning/5'), children: [_jsx("div", { className: "flex-shrink-0", children: isRunning ? (_jsx(Loader2, { className: "h-4 w-4 text-accent animate-spin" })) : isQueued ? (_jsx(Clock, { className: "h-4 w-4 text-muted" })) : isPaused ? (_jsx(Pause, { className: "h-4 w-4 text-warning" })) : isOk ? (_jsx(CheckCircle2, { className: "h-4 w-4 text-success" })) : isSuperseded ? (_jsx(AlertCircle, { className: "h-4 w-4 text-muted" })) : (_jsx(AlertCircle, { className: "h-4 w-4 text-error" })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs font-mono font-medium text-text truncate", children: (repoMap ?? {})[job.repoId] || job.repoId.slice(0, 8) }), _jsx("span", { className: "text-[10px] font-mono text-muted", children: job.branch }), _jsx("span", { className: cn('px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase', isPaused ? 'bg-warning/10 text-warning' : isActive ? 'bg-accent-light text-accent' : isOk ? 'bg-success-light text-success' : isSuperseded ? 'bg-hover text-muted' : isFailed ? 'bg-error-light text-error' : 'bg-hover text-muted'), children: job.mode })] }), isActive && (_jsx("div", { className: "mt-1.5 h-1 rounded-full bg-hover overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-accent animate-pulse", style: { width: isRunning ? '60%' : '10%' } }) })), job.stats && typeof job.stats === 'object' && (_jsx("div", { className: "flex gap-3 mt-1 text-[10px] text-muted", children: Object.entries(job.stats).filter(([, v]) => typeof v === 'number' && v > 0).slice(0, 4).map(([k, v]) => (_jsxs("span", { children: [k, ": ", _jsx("strong", { children: v })] }, k))) }))] }), _jsxs("div", { className: "flex-shrink-0 text-right mr-2", children: [_jsx("span", { className: cn('text-xs font-semibold', isPaused ? 'text-warning' : isActive ? 'text-accent' : isOk ? 'text-success' : isSuperseded ? 'text-muted' : isFailed ? 'text-error' : 'text-muted'), children: isSuperseded ? 'superseded' : job.status }), _jsx("p", { className: "text-[10px] text-muted", children: timeAgo(job.createdAt) })] }), _jsxs("div", { className: "flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", children: [isActive && (_jsx("button", { onClick: async () => { try {
                                                    await api.pauseScanJob(job.id);
                                                    fetchScans();
                                                }
                                                catch { } }, title: "Pause scan", className: "p-1.5 rounded hover:bg-warning/10 text-muted hover:text-warning transition-colors", children: _jsx(Pause, { className: "h-3.5 w-3.5" }) })), isPaused && (_jsx("button", { onClick: async () => { try {
                                                    await api.resumeScanJob(job.id);
                                                    fetchScans();
                                                }
                                                catch { } }, title: "Resume scan", className: "p-1.5 rounded hover:bg-success/10 text-muted hover:text-success transition-colors", children: _jsx(Play, { className: "h-3.5 w-3.5" }) })), _jsx("button", { onClick: async () => { try {
                                                    await api.deleteScanJob(job.id);
                                                    fetchScans();
                                                }
                                                catch { } }, title: "Delete scan", className: "p-1.5 rounded hover:bg-error/10 text-muted hover:text-error transition-colors", children: _jsx(Trash2, { className: "h-3.5 w-3.5" }) })] })] }, job.id));
                        }) })] })), _jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [_jsxs("div", { className: "lg:col-span-2 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-light", children: [_jsx(Server, { className: "size-8 text-accent" }), _jsx("h2", { className: "text-4xl font-semibold text-text", children: "Docker Services" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border-light bg-bg", children: [_jsx("th", { className: "px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide", children: "Service" }), _jsx("th", { className: "px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide", children: "Image" }), _jsx("th", { className: "px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide", children: "Status" }), _jsx("th", { className: "px-5 py-3 text-left text-xs font-medium text-muted uppercase tracking-wide", children: "Port" }), _jsx("th", { className: "px-5 py-3 text-right text-xs font-medium text-muted uppercase tracking-wide", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: DOCKER_SERVICES.map((svc) => {
                                                const ok = svc.key === 'api' ? (health?.status === 'ok' ? true : null) : serviceStatus(health, svc.key);
                                                const dockerName = svc.key === 'api' ? undefined : svc.key === 'postgres' ? 'postgres' : svc.key;
                                                return (_jsxs("tr", { className: "hover:bg-hover/40 transition-colors", children: [_jsx("td", { className: "px-5 py-3.5 font-medium text-text", children: svc.name }), _jsx("td", { className: "px-5 py-3.5 font-mono text-xs text-muted", children: svc.image }), _jsx("td", { className: "px-5 py-3.5", children: _jsxs("span", { className: cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', ok === null ? 'bg-border-light text-muted' : ok ? 'bg-success-light text-success' : 'bg-error-light text-error'), children: [_jsx(StatusDot, { ok: ok }), ok === null ? 'Unknown' : ok ? 'Running' : 'Stopped'] }) }), _jsx("td", { className: "px-5 py-3.5 font-mono text-xs text-muted", children: svc.port }), _jsx("td", { className: "px-5 py-3.5 text-right", children: dockerName && (_jsxs("button", { onClick: () => handleRestart(dockerName), disabled: restarting !== null, className: "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-muted hover:text-accent hover:bg-accent-light transition-colors disabled:opacity-40", children: [restarting === dockerName
                                                                        ? _jsx(Loader2, { className: "h-3 w-3 animate-spin" })
                                                                        : _jsx(RotateCcw, { className: "h-3 w-3" }), "Restart"] })) })] }, svc.key));
                                            }) })] }) }), lastUpdated && (_jsxs("div", { className: "px-5 py-2 border-t border-border-light text-xs text-muted", children: ["Last updated: ", lastUpdated.toLocaleTimeString()] }))] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-border-light", children: [_jsx("h2", { className: "text-3xl font-semibold text-text", children: "Environment Variables" }), _jsx("p", { className: "mt-0.5 text-xl text-muted", children: "Required for local development" })] }), _jsx("div", { className: "p-4 space-y-3", children: ENV_VARS.map(({ key, sample }) => (_jsxs("div", { className: "rounded-xs bg-bg border border-border-light p-3", children: [_jsx("p", { className: "text-xl font-semibold text-accent mb-1 font-mono", children: key }), _jsx("p", { className: "text-xs text-muted font-mono truncate", title: sample, children: sample })] }, key))) })] })] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-border-light", children: [_jsx("h2", { className: "text-5xl font-semibold text-text", children: "Quick Setup" }), _jsx("p", { className: "mt-0.5 text-xl text-muted", children: "Run these commands to bootstrap the full Cortex stack" })] }), _jsx("div", { className: "p-5 grid grid-cols-1 gap-3 md:grid-cols-2", children: SETUP_COMMANDS.map(({ label, command }) => (_jsxs("div", { className: "bg-black rounded-[--radius-md] overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-white/10", children: [_jsxs("span", { className: "text-xl font-medium text-white/40", children: ["# ", label] }), _jsx(CopyButton, { text: command })] }), _jsx("div", { className: "px-4 py-3", children: _jsx("code", { className: "font-mono text-md text-white/90 break-all", children: command }) })] }, label))) })] })] }));
}
