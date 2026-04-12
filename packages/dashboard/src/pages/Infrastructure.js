import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Cpu, Brain, RefreshCw, Server, Play, Square, RotateCcw, Loader2, CheckCircle2, AlertCircle, Settings, ChevronDown, ChevronUp, Terminal, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { DOCKER_SERVICES, ENV_VARS, SETUP_COMMANDS } from '../lib/config.ts';
import { StatusDot } from '../components/StatusDot.tsx';
import { CopyButton } from '../components/CopyButton.tsx';
import { usePolling } from '../hooks/usePolling.ts';
import { useAsyncData } from '../hooks/useAsyncData.ts';
import { TerminalPage } from './TerminalPage';
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
    const [loadingModel, setLoadingModel] = useState(null);
    const [expandedScan, setExpandedScan] = useState(null);
    const [showAllModels, setShowAllModels] = useState(false);
    const [showTerminal, setShowTerminal] = useState(false);
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-6xl font-bold text-text", children: "Infrastructure" }), _jsx("p", { className: "mt-0.5 text-xl text-muted", children: "Docker services status & setup guide" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: handleStart, disabled: restarting !== null, className: "flex items-center gap-2 rounded-xl border border-success/30 bg-success-light px-3 py-2 text-sm font-medium text-success hover:bg-success/15 transition-colors disabled:opacity-50", children: [_jsx(Play, { className: "h-3.5 w-3.5" }), "Start All"] }), _jsxs("button", { onClick: () => handleRestart(), disabled: restarting !== null, className: "flex items-center gap-2 rounded-full border border-accent/30 bg-accent-light px-3 py-2 text-sm font-medium text-accent hover:bg-accent/15 transition-colors disabled:opacity-50", children: [restarting === 'all' ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : _jsx(RotateCcw, { className: "h-3.5 w-3.5" }), "Restart All"] }), _jsxs("button", { onClick: handleStop, disabled: restarting !== null, className: "flex items-center gap-2 rounded-full border border-error/30 bg-error-light px-3 py-2 text-sm font-medium text-error hover:bg-error/15 transition-colors disabled:opacity-50", children: [_jsx(Square, { className: "h-3.5 w-3.5" }), "Stop All"] }), _jsxs("button", { onClick: () => setShowTerminal((value) => !value), className: "flex items-center gap-2 rounded-full border border-border-light bg-card px-3 py-2 text-sm font-medium text-text hover:bg-hover transition-colors", children: [_jsx(Terminal, { className: "h-4 w-4 text-muted" }), showTerminal ? 'Hide Terminal' : 'Show Terminal'] }), _jsxs("button", { onClick: fetchHealth, className: "flex items-center gap-2 rounded-full border border-border-light bg-card px-3 py-2 text-sm font-medium text-text hover:bg-hover transition-colors", children: [_jsx(RefreshCw, { className: cn('h-4 w-4 text-muted', loading && 'animate-spin') }), "Refresh"] })] })] }), _jsx("div", { className: cn('overflow-hidden transition-all duration-300 ease-out', showTerminal ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'), children: _jsx("div", { className: cn('pt-6', showTerminal ? 'opacity-100' : 'opacity-0'), children: _jsx(TerminalPage, { hideHeader: true }) }) }), _jsx("h1", { className: "text-4xl mt-10 font-bold text-text", children: "Models configuration" }), (() => {
                const ollamaData = getServiceData(health, 'ollama');
                const claudeData = getServiceData(health, 'claude');
                const gpu = ollamaData?.gpu ?? null;
                const ollamaRunning = (ollamaData?.running ?? []);
                const ollamaAvail = (ollamaData?.available ?? []);
                const ollamaRoles = (ollamaData?.roles ?? {});
                const cardClass = 'bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden';
                const headerClass = 'flex items-center justify-between px-5 py-3 border-b border-border-light';
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [_jsxs("div", { className: cardClass, children: [_jsxs("div", { className: headerClass, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Cpu, { className: "size-6 text-accent" }), _jsx("h2", { className: "text-4xl font-black text-text", children: "Ollama" }), ollamaData?.latency != null && (_jsxs("span", { className: "text-[10px] font-mono text-muted", children: [String(ollamaData.latency), "ms"] }))] }), _jsx(StatusDot, { ok: serviceStatus(health, 'ollama') })] }), _jsxs("div", { className: "p-5 space-y-4", children: [gpu ? (gpu.type === 'discrete' ? (
                                                /* NVIDIA / discrete GPU */
                                                _jsxs("div", { className: "rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("p", { className: "text-2xl font-semibold text-accent uppercase tracking-wide", children: "GPU" }), gpu.temperature && _jsx("span", { className: "text-3xl font-black text-muted", children: gpu.temperature })] }), _jsx("p", { className: "text-md font-bold text-text", children: gpu.name }), _jsxs("div", { className: "mt-3 space-y-2", children: [gpu.memoryUsed && gpu.memoryTotal && (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "text-muted", children: "VRAM" }), _jsxs("span", { className: "font-mono text-text", children: [gpu.memoryUsed, " / ", gpu.memoryTotal] })] }), _jsx("div", { className: "h-2 rounded-full bg-hover overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-accent transition-all", style: {
                                                                                    width: `${Math.round((parseInt(gpu.memoryUsed) / parseInt(gpu.memoryTotal)) * 100)}%`
                                                                                } }) })] })), gpu.utilization && (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { className: "text-muted", children: "Utilization" }), _jsx("span", { className: "font-mono font-semibold text-text", children: gpu.utilization })] }), _jsx("div", { className: "h-2 rounded-full bg-hover overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-success transition-all", style: {
                                                                                    width: `${parseInt(gpu.utilization) || 0}%`
                                                                                } }) })] }))] })] })) : (
                                                /* Apple Silicon / unified memory GPU */
                                                _jsxs("div", { className: "rounded-xl bg-gradient-to-br from-accent/5 to-transparent border border-accent/10 p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("p", { className: "text-2xl font-semibold text-accent uppercase tracking-wide", children: "GPU" }), _jsx("span", { className: "px-2 py-0.5 rounded-md text-md font-bold bg-accent/10 text-accent uppercase", children: "Unified Memory" })] }), _jsx("p", { className: "text-md font-bold text-text", children: gpu.name }), _jsxs("div", { className: "mt-3 grid grid-cols-2 gap-3", children: [gpu.unifiedMemory && (_jsxs("div", { className: "rounded-lg bg-hover/50 px-3 py-2", children: [_jsx("p", { className: "text-sm text-muted", children: "Shared Memory" }), _jsx("p", { className: "text-lg font-mono font-semibold text-text", children: gpu.unifiedMemory })] })), gpu.gpuCores && (_jsxs("div", { className: "rounded-lg bg-hover/50 px-3 py-2", children: [_jsx("p", { className: "text-sm text-muted", children: "GPU Cores" }), _jsx("p", { className: "text-lg font-mono font-semibold text-text", children: gpu.gpuCores })] })), gpu.metalFamily && (_jsxs("div", { className: "rounded-lg bg-hover/50 px-3 py-2 col-span-2", children: [_jsx("p", { className: "text-sm text-muted", children: "Metal Support" }), _jsx("p", { className: "text-lg font-mono font-semibold text-text", children: gpu.metalFamily })] }))] })] }))) : (_jsxs("div", { className: "rounded-xs border border-border-light p-4 text-center", children: [_jsx("p", { className: "text-xl text-muted", children: "No GPU detected" }), _jsx("p", { className: "text-md text-light mt-0.5", children: "Running on CPU" })] })), ollamaRunning.length > 0 && (_jsxs("div", { children: [_jsx("p", { className: "text-xl font-semibold text-muted uppercase tracking-wide mb-2", children: "Loaded Models" }), _jsx("div", { className: "space-y-1.5", children: ollamaRunning.map((r) => (_jsx("div", { className: "flex items-center gap-2 rounded-xs px-2.5 py-2 bg-success/5 border border-success/15", children: _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("span", { className: "text-xl font-mono font-semibold text-text truncate block", children: r.name }), _jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [_jsx("span", { className: cn('px-1.5 py-0.5 rounded text-md font-bold uppercase', r.processor === 'gpu' ? 'bg-success/15 text-success' :
                                                                                        r.processor === 'cpu' ? 'bg-warning/15 text-warning' :
                                                                                            'bg-accent/15 text-accent'), children: r.processor }), _jsxs("span", { className: "text-md text-muted", children: ["ctx:", r.contextLength] }), _jsx("span", { className: "text-lg font-black text-muted", children: r.size })] })] }) }, r.name))) })] }))] })] }), _jsxs("div", { className: cardClass, children: [_jsx("div", { className: headerClass, children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Settings, { className: "size-6 text-accent" }), _jsx("h2", { className: "text-4xl font-semibold text-text", children: "Ollama Config" })] }) }), _jsxs("div", { className: "p-5 space-y-4", children: [ollamaAvail.length > 0 && (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-md font-semibold text-muted uppercase tracking-wide", children: "Model Assignment" }), ([
                                                            { role: 'llm', label: 'Extraction', desc: 'Code analysis' },
                                                            { role: 'chat', label: 'Chat', desc: 'Chat widget' },
                                                        ]).map(({ role, label, desc }) => (_jsxs("div", { className: "flex-2 items-center gap-2", children: [_jsxs("div", { className: "flex-shrink-0 flex gap-2 items-center", children: [_jsx("span", { className: "text-sm font-semibold text-text", children: label }), _jsx("span", { className: "h-1 w-1 bg-accent" }), _jsx("p", { className: "text-sm text-muted leading-tight", children: desc })] }), _jsx("select", { value: ollamaRoles[role] ?? '', onChange: async (e) => {
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
                                                                    }, disabled: loadingModel !== null, className: "flex-1 w-full mt-2 rounded border border-border-light bg-card px-2 py-1 text-[11px] font-mono text-text outline-none focus:border-accent disabled:opacity-50", children: ollamaAvail.map((m) => (_jsxs("option", { value: m.name, children: [m.name, " (", m.parameterSize || m.size, ")"] }, m.name))) }), loadingModel === role && _jsx(Loader2, { className: "h-3 w-3 animate-spin text-accent flex-shrink-0" })] }, role)))] })), _jsxs("div", { children: [_jsxs("p", { className: "text-md font-semibold text-muted uppercase tracking-wide mb-2", children: ["Available Models (", ollamaAvail.length, ")"] }), _jsxs("div", { className: "space-y-1.5", children: [[...ollamaAvail].sort((a, b) => {
                                                                    const aRunning = ollamaRunning.some((r) => r.name === a.name) ? 0 : 1;
                                                                    const bRunning = ollamaRunning.some((r) => r.name === b.name) ? 0 : 1;
                                                                    return aRunning - bRunning;
                                                                }).slice(0, showAllModels ? undefined : 3).map((m) => {
                                                                    const running = ollamaRunning.find((r) => r.name === m.name);
                                                                    const isLoading = loadingModel === m.name;
                                                                    return (_jsxs("div", { className: cn('flex items-center gap-2 rounded-xs px-2.5 py-2 transition-colors', running ? 'bg-success/5 border border-success/15' : 'bg-hover/50'), children: [_jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-mono font-semibold text-text truncate", children: m.name }), _jsx("span", { className: "text-xl text-muted font-black", children: m.parameterSize || m.size })] }) }), _jsx("div", { className: "flex items-center gap-1 flex-shrink-0", children: isLoading ? (_jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin text-accent" })) : running ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: async () => {
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
                                                                                            }, disabled: loadingModel !== null, title: running.processor === 'gpu' ? 'Switch to CPU' : 'Switch to GPU', className: cn('px-2 py-1 rounded text-xl font-bold uppercase transition-colors disabled:opacity-50', running.processor === 'gpu'
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
                                                                                            }, disabled: loadingModel !== null, title: "Unload model", className: "p-2 rounded-full ml-2 border text-error hover:bg-error/10 transition-colors disabled:opacity-50", children: _jsx(Square, { className: "size-4" }) })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: async () => {
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
                                                                                            }, disabled: loadingModel !== null, title: "Load on GPU", className: "px-2 py-1 rounded text-xl font-bold uppercase bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50", children: "GPU" }), _jsx("button", { onClick: async () => {
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
                                                                                            }, disabled: loadingModel !== null, title: "Load on CPU", className: "px-2 py-1 rounded text-xl font-bold uppercase bg-hover text-muted hover:bg-warning/15 hover:text-warning transition-colors disabled:opacity-50", children: "CPU" })] })) })] }, m.name));
                                                                }), ollamaAvail.length > 3 && (_jsxs("button", { onClick: () => setShowAllModels(!showAllModels), className: "flex items-center gap-1 text-xs text-accent hover:underline mt-1 px-2", children: [showAllModels ? _jsx(ChevronUp, { className: "w-3 h-3" }) : _jsx(ChevronDown, { className: "w-3 h-3" }), showAllModels ? 'Show less' : `Show all ${ollamaAvail.length} models`] }))] })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [_jsxs("div", { className: cardClass, children: [_jsxs("div", { className: headerClass, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "size-6 text-accent" }), _jsx("h2", { className: "text-4xl font-semibold text-text", children: "Graph Storage" })] }), _jsx(StatusDot, { ok: serviceStatus(health, 'graphStorage') })] }), _jsx("div", { className: "p-5 space-y-4", children: _jsxs("div", { className: "rounded-xs border border-success/20 bg-gradient-to-br from-success/5 to-transparent p-4", children: [_jsx("p", { className: "text-xl font-semibold uppercase tracking-wide text-muted mb-2", children: "Engine" }), _jsx("p", { className: "text-sm font-mono text-text", children: "graphify + PostgreSQL" })] }) })] }), _jsxs("div", { className: cardClass, children: [_jsxs("div", { className: headerClass, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "size-6 text-accent" }), _jsx("h2", { className: "text-4xl font-semibold text-text", children: "Claude CLI" })] }), _jsx(StatusDot, { ok: claudeData?.status === 'ok' ? true : claudeData ? false : null })] }), _jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: cn('rounded-xs border p-4', claudeData?.status === 'ok'
                                                        ? 'border-success/20 bg-gradient-to-br from-success/5 to-transparent'
                                                        : 'border-error/20 bg-gradient-to-br from-error/5 to-transparent'), children: [_jsx("p", { className: "text-2xl font-semibold uppercase tracking-wide text-muted mb-2", children: "Extraction Engine" }), claudeData?.status === 'ok' ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-success" }), _jsx("span", { className: "text-sm font-semibold text-success", children: "Available" })] }), _jsx("p", { className: "text-[11px] font-mono text-muted", children: String(claudeData.version) })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "h-4 w-4 text-error" }), _jsx("span", { className: "text-sm font-semibold text-error", children: "Not found" })] }))] }), claudeData?.model && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "rounded-lg bg-hover/50 p-4", children: [_jsx("p", { className: "text-xl text-muted uppercase tracking-wide mb-2 text-center", children: "Extraction Model" }), _jsx("div", { className: "flex items-center gap-2", children: ['haiku', 'sonnet', 'opus'].map((m) => {
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
                                                                            }, className: cn('flex-1 py-2 rounded-lg text-lg font-bold uppercase tracking-wide transition-all', isActive
                                                                                ? 'bg-accent text-white shadow-sm'
                                                                                : 'bg-transparent border border-border-light text-muted hover:border-accent/50 hover:text-text', savingModel && 'opacity-50 cursor-not-allowed'), children: m }, m));
                                                                    }) })] }), _jsxs("div", { className: "text-md text-muted space-y-1.5 pt-6", children: [_jsxs("p", { children: ["Used for code analysis during scans. Each file is analyzed via ", _jsx("code", { className: "px-1 py-0.5 rounded bg-hover font-mono", children: "claude --print" })] }), _jsxs("div", { className: "flex items-center justify-between text-xl pt-2 border-t border-border-light/50", children: [_jsx("span", { className: "font-black", children: "Speed" }), _jsx("span", { className: "font-mono text-text", children: claudeData.model === 'haiku' ? 'Fast (3x)' :
                                                                                claudeData.model === 'sonnet' ? 'Medium' : 'Slow (best quality)' })] }), _jsxs("div", { className: "flex items-center justify-between text-xl", children: [_jsx("span", { className: "font-black", children: "Config" }), _jsx("span", { className: "font-mono text-text", children: "CORTEX_LLM_MODEL" })] })] })] })), _jsxs("div", { className: "border-t border-border-light/50 pt-10 space-y-2", children: [_jsx("p", { className: "text-2xl font-semibold text-muted uppercase tracking-wide", children: "Core Services" }), ['postgres', 'redis'].map((key) => {
                                                            const ok = serviceStatus(health, key);
                                                            const data = getServiceData(health, key);
                                                            const name = key === 'postgres' ? 'PostgreSQL' : 'Redis';
                                                            return (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(StatusDot, { ok: ok }), _jsx("span", { className: "text-xl text-text", children: name })] }), data?.latency != null && (_jsxs("span", { className: "text-[10px] font-mono text-muted", children: [data.latency, "ms"] }))] }, key));
                                                        })] })] })] })] })] }));
            })(), _jsx("h1", { className: "text-4xl mt-10 font-bold text-text", children: "Variables and setup" }), _jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [_jsxs("div", { className: "lg:col-span-2 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-5 px-5 py-4 border-b border-border-light", children: [_jsx(Server, { className: "size-6 text-accent" }), _jsx("h2", { className: "text-4xl font-semibold text-text", children: "Docker Services" })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border-light bg-bg", children: [_jsx("th", { className: "px-5 py-3 text-left text-lg font-medium text-muted uppercase tracking-wide", children: "Service" }), _jsx("th", { className: "px-5 py-3 text-left text-lg font-medium text-muted uppercase tracking-wide", children: "Image" }), _jsx("th", { className: "px-5 py-3 text-left text-lg font-medium text-muted uppercase tracking-wide", children: "Status" }), _jsx("th", { className: "px-5 py-3 text-left text-lg font-medium text-muted uppercase tracking-wide", children: "Port" }), _jsx("th", { className: "px-5 py-3 text-right text-lg font-medium text-muted uppercase tracking-wide", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: DOCKER_SERVICES.map((svc) => {
                                                const ok = svc.key === 'api' ? (health?.status === 'ok' ? true : null) : serviceStatus(health, svc.key);
                                                const dockerName = svc.key === 'api' ? undefined : svc.key === 'postgres' ? 'postgres' : svc.key;
                                                return (_jsxs("tr", { className: "hover:bg-hover/40 transition-colors h-20", children: [_jsx("td", { className: "px-5 py-3.5 font-medium text-xl text-text", children: svc.name }), _jsx("td", { className: "px-5 py-3.5 font-mono text-lg text-muted", children: svc.image }), _jsx("td", { className: "px-5 py-3.5", children: _jsxs("span", { className: cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-md font-medium', ok === null ? 'bg-border-light text-muted' : ok ? 'bg-success-light text-success' : 'bg-error-light text-error'), children: [_jsx(StatusDot, { ok: ok }), ok === null ? 'Unknown' : ok ? 'Running' : 'Stopped'] }) }), _jsx("td", { className: "px-5 py-3.5 font-mono text-xl text-muted", children: svc.port }), _jsx("td", { className: "px-5 py-3.5 text-right", children: dockerName && (_jsxs("button", { onClick: () => handleRestart(dockerName), disabled: restarting !== null, className: "inline-flex items-center gap-1 px-2 py-1 rounded text-md border-2 border-accent font-medium text-muted hover:text-accent hover:bg-accent-light transition-colors disabled:opacity-40", children: [restarting === dockerName
                                                                        ? _jsx(Loader2, { className: "h-3 w-3 animate-spin" })
                                                                        : _jsx(RotateCcw, { className: "h-3 w-3" }), "Restart"] })) })] }, svc.key));
                                            }) })] }) }), lastUpdated && (_jsxs("div", { className: "px-5 py-2 border-t border-border-light text-xs text-muted", children: ["Last updated: ", lastUpdated.toLocaleTimeString()] }))] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-border-light", children: [_jsx("h2", { className: "text-3xl font-semibold text-text", children: "Environment Variables" }), _jsx("p", { className: "mt-0.5 text-xl text-muted", children: "Required for local development" })] }), _jsx("div", { className: "p-4 space-y-3", children: ENV_VARS.map(({ key, sample }) => (_jsxs("div", { className: "rounded-xs bg-bg border border-border-light p-3", children: [_jsx("p", { className: "text-xl font-semibold text-accent mb-1 font-mono", children: key }), _jsx("p", { className: "text-xs text-muted font-mono truncate", title: sample, children: sample })] }, key))) })] })] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 border-b border-border-light", children: [_jsx("h2", { className: "text-5xl font-semibold text-text", children: "Quick Setup" }), _jsx("p", { className: "mt-0.5 text-xl text-muted", children: "Run these commands to bootstrap the full Cortex stack" })] }), _jsx("div", { className: "p-5 grid grid-cols-1 gap-3 md:grid-cols-2", children: SETUP_COMMANDS.map(({ label, command }) => (_jsxs("div", { className: "bg-black rounded-[--radius-md] overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-white/10", children: [_jsxs("span", { className: "text-xl font-medium text-white/40", children: ["# ", label] }), _jsx(CopyButton, { text: command })] }), _jsx("div", { className: "px-4 py-3", children: _jsx("code", { className: "font-mono text-md text-white/90 break-all", children: command }) })] }, label))) })] })] }));
}
