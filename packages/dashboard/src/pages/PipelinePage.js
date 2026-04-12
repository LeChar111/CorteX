import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trash2, RefreshCw, Activity, Clock, CheckCircle2, AlertCircle, XCircle, Loader2, FileText, ChevronDown, ChevronUp, Brain, Layers, X, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { timeAgo, formatDuration } from '../lib/helpers.ts';
import { ScanStatusBadge } from '../components/ScanStatusBadge.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { usePolling } from '../hooks/usePolling.ts';
import { useAsyncData } from '../hooks/useAsyncData.ts';
const PIPELINE_STEPS = [
    { key: 'scan', label: 'Scan Pipeline', sublabel: 'Code extraction via graphify', icon: Layers },
    { key: 'documents', label: 'Document Status', sublabel: 'Graph document status', icon: Brain },
];
const TABS = [
    { key: 'running', label: 'Running', icon: Loader2 },
    { key: 'queued', label: 'Queued', icon: Clock },
    { key: 'paused', label: 'Paused', icon: Pause },
    { key: 'failed', label: 'Failed', icon: XCircle },
    { key: 'completed', label: 'Completed', icon: CheckCircle2 },
    { key: 'documents', label: 'Graph Docs', icon: FileText },
];
// ─── Main Component ────────────────────────────────────
export function PipelinePage() {
    const [view, setView] = useState('scan');
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsx("h1", { className: "text-6xl font-bold text-text", children: "Pipeline Manager" }), _jsx("p", { className: "text-xl text-muted mt-1", children: "Monitor and manage scan jobs and document processing" })] }) }), _jsx("div", { className: "flex items-stretch gap-0", children: PIPELINE_STEPS.map((step, i) => {
                    const active = view === step.key;
                    const Icon = step.icon;
                    return (_jsxs("div", { className: "flex items-center", children: [i > 0 && (_jsx("div", { className: "flex items-center px-2 text-muted", children: _jsx("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", children: _jsx("path", { d: "M7 4l6 6-6 6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }) })), _jsxs("button", { onClick: () => setView(step.key), className: cn('flex items-center gap-3 px-5 py-3 rounded-xl transition-all', active
                                    ? 'bg-sidebar-active text-white shadow-md'
                                    : 'bg-card border border-border-light text-muted hover:text-text hover:border-accent/40'), children: [_jsx("div", { className: cn('flex items-center justify-center w-8 h-8 rounded-lg', active ? 'bg-white/20' : 'bg-hover'), children: _jsx(Icon, { className: "w-4 h-4" }) }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "flex items-center gap-2", children: _jsxs("span", { className: cn('text-xs font-bold uppercase tracking-wider', active ? 'text-white/60' : 'text-muted'), children: ["Step ", i + 1] }) }), _jsx("p", { className: "text-sm font-semibold", children: step.label }), _jsx("p", { className: cn('text-[11px]', active ? 'text-white/50' : 'text-light'), children: step.sublabel })] })] })] }, step.key));
                }) }), view === 'scan' ? _jsx(ScanPipelineView, {}) : _jsx(DocumentPipelineView, {})] }));
}
// ─── Scan Pipeline View ────────────────────────────────
function ScanPipelineView() {
    const [activeTab, setActiveTab] = useState('running');
    const [selected, setSelected] = useState(new Set());
    const [actionLoading, setActionLoading] = useState(false);
    const [expandedErrors, setExpandedErrors] = useState(new Set());
    const [expandedJob, setExpandedJob] = useState(null);
    const { data: queue, loading, refetch: refetchQueue } = usePolling(() => api.getScanQueue(), 5000);
    const { data: docStatus } = useAsyncData(() => api.getDocumentStatus().catch(() => ({})), []);
    const { data: repoMap } = useAsyncData(async () => {
        const projects = await api.listProjects();
        const map = {};
        for (const p of projects) {
            const repos = await api.getRepos(p.id);
            for (const r of repos)
                map[r.id] = r.name;
        }
        return map;
    }, []);
    const [docData, setDocData] = useState(null);
    const loadDocuments = useCallback(async () => {
        try {
            const data = await api.getDocuments();
            setDocData(data);
        }
        catch { /* ignore */ }
    }, []);
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelected(new Set());
        if (tab === 'documents' && !docData)
            loadDocuments();
    };
    const currentJobs = queue && activeTab !== 'documents' ? queue[activeTab] : [];
    const toggleSelect = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    const selectAll = () => setSelected(new Set(currentJobs.map((j) => j.id)));
    const deselectAll = () => setSelected(new Set());
    const toggleError = (id) => {
        setExpandedErrors((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    async function batchAction(action) {
        if (selected.size === 0)
            return;
        setActionLoading(true);
        try {
            await action();
            setSelected(new Set());
            await refetchQueue();
        }
        finally {
            setActionLoading(false);
        }
    }
    async function singleAction(action) {
        setActionLoading(true);
        try {
            await action();
            await refetchQueue();
        }
        finally {
            setActionLoading(false);
        }
    }
    const tabCounts = {
        running: queue?.running.length ?? 0,
        queued: queue?.queued.length ?? 0,
        paused: queue?.paused.length ?? 0,
        failed: queue?.failed.length ?? 0,
        completed: queue?.completed.length ?? 0,
        documents: docData?.total ?? (docStatus?.all ?? Object.entries(docStatus ?? {}).filter(([k]) => k !== 'all').reduce((a, [, b]) => a + b, 0)),
    };
    const statCards = [
        { key: 'running', label: 'Running', color: 'text-info', icon: Loader2, animate: true },
        { key: 'queued', label: 'Queued', color: 'text-muted', icon: Clock },
        { key: 'paused', label: 'Paused', color: 'text-warning', icon: Pause },
        { key: 'failed', label: 'Failed', color: 'text-error', icon: AlertCircle },
        { key: 'completed', label: 'Completed', color: 'text-success', icon: CheckCircle2 },
    ];
    if (loading)
        return _jsx(LoadingSkeleton, { lines: 5 });
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3", children: [statCards.map(({ key, label, color, icon: Icon, animate }) => (_jsxs("button", { onClick: () => handleTabChange(key), className: cn('bg-card rounded-[--radius-lg] border shadow-sm p-4 w-full transition-all', activeTab === key ? 'border-accent ring-1 ring-accent/30' : 'border-border-light hover:border-accent/40'), children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Icon, { className: cn('w-4 h-4', color, animate && tabCounts[key] > 0 && 'animate-spin') }), _jsx("span", { className: "text-md font-medium text-muted uppercase tracking-wide", children: label })] }), _jsx("span", { className: cn('text-6xl justify-end font-bold', color), children: tabCounts[key] })] }, key))), _jsxs("button", { onClick: () => handleTabChange('documents'), className: cn('bg-card rounded-[--radius-lg] border shadow-sm p-4 transition-all', activeTab === 'documents' ? 'border-accent ring-1 ring-accent/30' : 'border-border-light hover:border-accent/40'), children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(FileText, { className: "w-4 h-4 text-accent" }), _jsx("span", { className: "text-md font-medium text-muted uppercase tracking-wide", children: "Graph Docs" })] }), _jsx("span", { className: "text-6xl font-bold justify-end text-accent", children: tabCounts.documents })] })] }), _jsxs("div", { className: "flex items-center justify-between border-b border-border-light", children: [_jsx("div", { className: "flex gap-1", children: TABS.map(({ key, label, icon: Icon }) => (_jsxs("button", { onClick: () => handleTabChange(key), className: cn('flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px', activeTab === key
                                ? 'border-accent text-accent'
                                : 'border-transparent text-muted hover:text-text hover:border-border-light'), children: [_jsx(Icon, { className: "w-4 h-4" }), label, _jsx("span", { className: "ml-1 text-xs bg-hover rounded-full px-1.5 py-0.5", children: tabCounts[key] })] }, key))) }), _jsxs("button", { onClick: () => refetchQueue(), className: "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border-light bg-card text-text hover:bg-hover transition-colors mb-1", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Refresh"] })] }), activeTab !== 'documents' && selected.size > 0 && (_jsxs("div", { className: "flex items-center gap-3 bg-card rounded-[--radius-lg] border border-accent/30 p-3 shadow-sm", children: [_jsxs("span", { className: "text-sm font-medium text-text", children: [selected.size, " selected"] }), _jsx("div", { className: "flex-1" }), (activeTab === 'running' || activeTab === 'queued') && (_jsxs("button", { onClick: () => batchAction(() => api.batchPauseScans([...selected])), disabled: actionLoading, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors disabled:opacity-50", children: [_jsx(Pause, { className: "w-3.5 h-3.5" }), " Pause"] })), activeTab === 'paused' && (_jsxs("button", { onClick: () => batchAction(() => api.batchRetryScans([...selected])), disabled: actionLoading, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50", children: [_jsx(Play, { className: "w-3.5 h-3.5" }), " Resume"] })), activeTab === 'failed' && (_jsxs("button", { onClick: () => batchAction(() => api.batchRetryScans([...selected])), disabled: actionLoading, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-info/10 text-info hover:bg-info/20 transition-colors disabled:opacity-50", children: [_jsx(RotateCcw, { className: "w-3.5 h-3.5" }), " Retry"] })), _jsxs("button", { onClick: () => batchAction(() => api.batchDeleteScans([...selected])), disabled: actionLoading, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50", children: [_jsx(Trash2, { className: "w-3.5 h-3.5" }), " Delete"] }), _jsx("button", { onClick: selected.size === currentJobs.length ? deselectAll : selectAll, className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-hover text-muted hover:text-text transition-colors", children: selected.size === currentJobs.length ? 'Deselect All' : 'Select All' })] })), activeTab === 'documents' ? (_jsx(DocumentsPanel, { docData: docData, docStatus: docStatus ?? {}, onRefresh: loadDocuments })) : currentJobs.length === 0 ? (_jsx("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-12", children: _jsx(EmptyState, { icon: Activity, message: `No ${activeTab} jobs` }) })) : (_jsx("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border-light bg-hover/50", children: [_jsx("th", { className: "w-10 px-3 py-3", children: _jsx("input", { type: "checkbox", checked: selected.size === currentJobs.length && currentJobs.length > 0, onChange: () => selected.size === currentJobs.length ? deselectAll() : selectAll(), className: "rounded border-border-light" }) }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Job ID" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Repo" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Branch" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Mode" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Status" }), _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Time" }), activeTab === 'completed' && _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Duration" }), (activeTab === 'completed' || activeTab === 'running') && _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Stats" }), activeTab === 'failed' && _jsx("th", { className: "px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: "Error" }), _jsx("th", { className: "px-3 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide", children: "Actions" })] }) }), _jsx("tbody", { children: currentJobs.map((job, idx) => {
                                    const isExpanded = expandedJob === job.id;
                                    const st = (job.stats ?? {});
                                    const phase = st.phase;
                                    const totalFiles = st.totalFiles;
                                    const totalDocs = st.totalDocuments;
                                    const llmBatches = st.llmBatches;
                                    const colCount = 7 + (activeTab === 'completed' ? 1 : 0) + ((activeTab === 'completed' || activeTab === 'running') ? 1 : 0) + (activeTab === 'failed' ? 1 : 0) + 1;
                                    return (_jsxs(React.Fragment, { children: [_jsxs("tr", { className: cn('border-b border-border-light last:border-0 transition-colors cursor-pointer', idx % 2 === 1 && 'bg-hover/30', selected.has(job.id) && 'bg-accent/5', isExpanded && 'bg-accent/5 border-b-0'), onClick: () => setExpandedJob(isExpanded ? null : job.id), children: [_jsx("td", { className: "px-3 py-3", onClick: (e) => e.stopPropagation(), children: _jsx("input", { type: "checkbox", checked: selected.has(job.id), onChange: () => toggleSelect(job.id), className: "rounded border-border-light" }) }), _jsx("td", { className: "px-3 py-3 font-mono text-xs text-muted", title: job.id, children: _jsxs("span", { className: "inline-flex items-center gap-1.5", children: [isExpanded ? _jsx(ChevronDown, { className: "w-3 h-3 text-accent" }) : _jsx(ChevronDown, { className: "w-3 h-3 text-muted opacity-0 group-hover:opacity-100" }), job.id.slice(0, 8), "..."] }) }), _jsx("td", { className: "px-3 py-3 font-medium text-text", children: (repoMap ?? {})[job.repoId] || job.repoId.slice(0, 8) }), _jsx("td", { className: "px-3 py-3 text-muted", children: job.branch }), _jsx("td", { className: "px-3 py-3", children: _jsx("span", { className: cn('inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase', job.mode === 'full' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'), children: job.mode }) }), _jsx("td", { className: "px-3 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(ScanStatusBadge, { status: job.status }), phase && job.status === 'running' && (_jsx("span", { className: "px-1.5 py-0.5 rounded bg-accent/10 text-[9px] font-mono font-bold text-accent uppercase", children: phase.replace('_', ' ') }))] }) }), _jsx("td", { className: "px-3 py-3 text-xs text-muted", title: job.startedAt || job.createdAt, children: timeAgo(job.startedAt || job.createdAt) }), activeTab === 'completed' && _jsx("td", { className: "px-3 py-3 text-xs text-muted", children: formatDuration(job.startedAt, job.completedAt) }), (activeTab === 'completed' || activeTab === 'running') && _jsx("td", { className: "px-3 py-3 text-xs text-muted", children: _jsx(StatsDisplay, { stats: job.stats }) }), activeTab === 'failed' && (_jsx("td", { className: "px-3 py-3 max-w-xs", children: job.error ? (_jsxs("div", { children: [_jsx("span", { className: "text-xs text-error", children: expandedErrors.has(job.id) ? job.error : job.error.length > 80 ? job.error.slice(0, 80) + '...' : job.error }), job.error.length > 80 && (_jsx("button", { onClick: (e) => { e.stopPropagation(); toggleError(job.id); }, className: "ml-1 text-xs text-accent hover:underline", children: expandedErrors.has(job.id) ? _jsx(ChevronUp, { className: "w-3 h-3 inline" }) : _jsx(ChevronDown, { className: "w-3 h-3 inline" }) }))] })) : _jsx("span", { className: "text-xs text-muted", children: "--" }) })), _jsx("td", { className: "px-3 py-3", onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [(job.status === 'running' || job.status === 'queued') && _jsx(ActionBtn, { icon: Pause, title: "Pause", color: "text-warning", onClick: () => singleAction(() => api.pauseScanJob(job.id)), disabled: actionLoading }), job.status === 'paused' && _jsx(ActionBtn, { icon: Play, title: "Resume", color: "text-success", onClick: () => singleAction(() => api.resumeScanJob(job.id)), disabled: actionLoading }), job.status === 'failed' && _jsx(ActionBtn, { icon: RotateCcw, title: "Retry", color: "text-info", onClick: () => singleAction(() => api.batchRetryScans([job.id])), disabled: actionLoading }), _jsx(ActionBtn, { icon: Trash2, title: "Delete", color: "text-error", onClick: () => singleAction(() => api.deleteScanJob(job.id)), disabled: actionLoading })] }) })] }), isExpanded && (_jsx("tr", { children: _jsx("td", { colSpan: colCount, className: "p-0", children: _jsxs("div", { className: "px-5 py-4 bg-bg/80 border-b border-border-light space-y-3", children: [job.status === 'running' && (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-[11px]", children: [_jsx("span", { className: "text-muted", children: "Progress" }), _jsx("span", { className: "font-mono text-text", children: phase === 'parsing' && totalFiles ? `Parsing ${st.filesProcessed}/${totalFiles} files` :
                                                                                    phase === 'llm_extraction' ? `LLM extraction (${llmBatches ?? '?'} batches)` :
                                                                                        phase === 'ingestion' && totalDocs ? `Ingesting ${st.documentsIngested}/${totalDocs} docs` :
                                                                                            'Starting...' })] }), _jsx("div", { className: "h-2 rounded-full bg-hover overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-accent transition-all duration-500", style: {
                                                                                width: phase === 'parsing' && totalFiles ? `${Math.round((st.filesProcessed / totalFiles) * 33)}%`
                                                                                    : phase === 'llm_extraction' ? '50%'
                                                                                        : phase === 'ingestion' && totalDocs ? `${66 + Math.round((st.documentsIngested / totalDocs) * 34)}%`
                                                                                            : '10%'
                                                                            } }) })] })), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
                                                                    { label: 'Files processed', value: st.filesProcessed, total: totalFiles },
                                                                    { label: 'Chunks', value: st.chunksProcessed },
                                                                    { label: 'Entities extracted', value: st.entitiesExtracted },
                                                                    { label: 'Documents ingested', value: st.documentsIngested, total: totalDocs },
                                                                ].map(({ label, value, total }) => (_jsxs("div", { className: "rounded-lg bg-card border border-border-light/50 p-3", children: [_jsx("span", { className: "text-[10px] font-semibold text-muted uppercase tracking-wide", children: label }), _jsxs("p", { className: "text-lg font-bold font-mono text-text mt-0.5", children: [typeof value === 'number' ? value : 0, total != null && _jsxs("span", { className: "text-xs font-normal text-muted", children: [" / ", total] })] })] }, label))) }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1.5 text-[11px] rounded-lg bg-card border border-border-light/50 p-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "Job ID" }), _jsx("span", { className: "font-mono text-text", children: job.id.slice(0, 12) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "Mode" }), _jsx("span", { className: "font-mono text-text uppercase", children: job.mode })] }), job.startedAt && _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "Started" }), _jsx("span", { className: "font-mono text-text", children: new Date(job.startedAt).toLocaleTimeString() })] }), job.completedAt && _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "Completed" }), _jsx("span", { className: "font-mono text-text", children: new Date(job.completedAt).toLocaleTimeString() })] }), job.startedAt && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "Duration" }), _jsx("span", { className: "font-mono text-text", children: formatDuration(job.startedAt, job.completedAt || new Date().toISOString()) })] })), llmBatches != null && _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "LLM batches" }), _jsx("span", { className: "font-mono text-text", children: llmBatches })] }), st.relationsExtracted > 0 && _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "Relations" }), _jsx("span", { className: "font-mono text-text", children: st.relationsExtracted })] }), phase && _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted", children: "Phase" }), _jsx("span", { className: "font-mono text-accent uppercase", children: phase.replace('_', ' ') })] })] }), job.error && (_jsx("div", { className: "rounded-lg bg-error/5 border border-error/15 p-3", children: _jsx("p", { className: "text-[11px] text-error font-mono break-all", children: job.error }) }))] }) }) }))] }, job.id));
                                }) })] }) }) }))] }));
}
// ─── Document Pipeline View ───────────────────────────
function DocumentPipelineView() {
    const { data: pipeline, loading, refetch } = usePolling(() => api.getDocumentPipeline(), 3000);
    const [actionLoading, setActionLoading] = useState(false);
    const [pipelineError, setPipelineError] = useState(null);
    if (loading || !pipeline)
        return _jsx(LoadingSkeleton, { lines: 5 });
    const counts = pipeline.counts;
    const processed = counts.processed ?? 0;
    const processing = counts.processing ?? 0;
    const pending = counts.pending ?? 0;
    const failed = counts.failed ?? 0;
    const total = counts.all ?? 0;
    const progressPct = pipeline.docs > 0 ? Math.round((pipeline.cur_batch / pipeline.docs) * 100) : 0;
    const pct = (v) => total > 0 ? `${((v / total) * 100).toFixed(1)}%` : '—';
    async function pipelineAction(action) {
        setActionLoading(true);
        setPipelineError(null);
        try {
            await action();
            await refetch();
        }
        catch (err) {
            setPipelineError(err instanceof Error ? err.message : 'Action failed');
        }
        finally {
            setActionLoading(false);
        }
    }
    // Filter out long tracebacks from messages for display
    const cleanMessages = pipeline.history_messages
        .filter((m) => !m.startsWith('Traceback'))
        .slice(-20)
        .reverse();
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3", children: [
                    { label: 'Processed', icon: CheckCircle2, value: processed, sub: pct(processed), color: 'text-success', iconColor: 'text-success' },
                    { label: 'Processing', icon: Loader2, value: processing, sub: processing > 0 ? 'in progress' : 'idle', color: processing > 0 ? 'text-info' : 'text-muted', iconColor: 'text-info', animate: processing > 0 },
                    { label: 'Pending', icon: Clock, value: pending, sub: pct(pending), color: pending > 0 ? 'text-warning' : 'text-muted', iconColor: 'text-warning' },
                    { label: 'Failed', icon: XCircle, value: failed, sub: pct(failed), color: failed > 0 ? 'text-error' : 'text-muted', iconColor: 'text-error' },
                    { label: 'Documents', icon: FileText, value: total, sub: `${pipeline.busy ? 'processing' : 'idle'}`, color: 'text-text', iconColor: 'text-accent' },
                    { label: 'Graph Entities', icon: Brain, value: counts.graphLabels ?? '—', sub: 'nodes extracted', color: 'text-accent', iconColor: 'text-accent' },
                ].map(({ label, icon: Icon, value, sub, color, iconColor, animate }) => (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Icon, { className: cn('w-4 h-4', iconColor, animate && 'animate-spin') }), _jsx("span", { className: "text-md font-medium text-muted uppercase tracking-wide", children: label })] }), _jsx("span", { className: cn('text-4xl font-bold', color), children: typeof value === 'number' ? value.toLocaleString() : value }), _jsx("p", { className: "text-xs text-light mt-0.5", children: sub })] }, label))) }), pipeline.busy && (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-5 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-text", children: "Processing Documents" }), _jsx("p", { className: "text-xs text-muted mt-0.5", children: pipeline.job_name || 'Document batch' })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-lg font-bold font-mono text-text", children: pipeline.cur_batch }), _jsxs("span", { className: "text-sm text-muted", children: [" / ", pipeline.docs] }), _jsxs("span", { className: "text-xs text-muted ml-2", children: ["(", progressPct, "%)"] })] })] }), _jsx("div", { className: "h-3 rounded-full bg-hover overflow-hidden", children: _jsx("div", { className: "h-full rounded-full bg-accent transition-all duration-500", style: { width: `${progressPct}%` } }) }), pipeline.latest_message && (_jsx("p", { className: "text-xs text-muted font-mono truncate", children: pipeline.latest_message }))] })), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: () => refetch(), className: "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border-light bg-card text-text hover:bg-hover transition-colors", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Refresh"] }), !pipeline.busy && (_jsxs("button", { onClick: () => pipelineAction(() => api.scanDocuments()), disabled: actionLoading, className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50", children: [actionLoading ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(Play, { className: "w-4 h-4" }), "Start Pipeline"] })), pipeline.busy && (_jsxs("button", { onClick: () => pipelineAction(() => api.cancelPipeline()), disabled: actionLoading, className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50", children: [actionLoading ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(XCircle, { className: "w-4 h-4" }), "Stop Pipeline"] })), failed > 0 && !pipeline.busy && (_jsxs("button", { onClick: () => pipelineAction(() => api.reprocessFailedDocuments()), disabled: actionLoading, className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors disabled:opacity-50", children: [actionLoading ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(RotateCcw, { className: "w-4 h-4" }), "Retry ", failed, " failed"] })), !pipeline.busy && pending > 0 && (_jsxs("button", { onClick: () => pipelineAction(() => api.reprocessFailedDocuments()), disabled: actionLoading, className: "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50", children: [actionLoading ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(Play, { className: "w-4 h-4" }), "Process ", pending, " pending"] }))] }), pipelineError && (_jsxs("div", { className: "flex items-center gap-2 px-4 py-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm", children: [_jsx(XCircle, { className: "w-4 h-4 shrink-0" }), _jsx("span", { children: pipelineError }), _jsx("button", { onClick: () => setPipelineError(null), className: "ml-auto text-error/60 hover:text-error", children: _jsx(X, { className: "w-4 h-4" }) })] })), total > 0 && (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-5", children: [_jsx("h3", { className: "text-sm font-semibold text-text mb-3", children: "Document Status Breakdown" }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex h-4 rounded-full overflow-hidden bg-hover", children: [
                                    { key: 'processed', color: 'bg-success' },
                                    { key: 'processing', color: 'bg-info' },
                                    { key: 'pending', color: 'bg-warning' },
                                    { key: 'failed', color: 'bg-error' },
                                ].map(({ key, color }) => {
                                    const count = counts[key] ?? 0;
                                    const pct = total > 0 ? (count / total) * 100 : 0;
                                    if (pct === 0)
                                        return null;
                                    return (_jsx("div", { className: cn('transition-all', color), style: { width: `${pct}%` }, title: `${key}: ${count} (${pct.toFixed(1)}%)` }, key));
                                }) }), _jsx("div", { className: "flex flex-wrap gap-4", children: Object.entries(counts).filter(([k]) => k !== 'all' && k !== 'preprocessed' && k !== 'graphLabels').map(([status, count]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: cn('w-3 h-3 rounded-full', status === 'processed' ? 'bg-success' : status === 'processing' ? 'bg-info' : status === 'pending' ? 'bg-warning' : status === 'failed' ? 'bg-error' : 'bg-muted') }), _jsx("span", { className: "text-xs text-muted capitalize", children: status }), _jsx("span", { className: "text-xs font-semibold text-text", children: count })] }, status))) })] })] })), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 border-b border-border-light", children: _jsx("h3", { className: "text-sm font-semibold text-text", children: "Activity Log" }) }), cleanMessages.length === 0 ? (_jsx("div", { className: "p-5", children: _jsx(EmptyState, { message: "No recent pipeline activity" }) })) : (_jsx("div", { className: "divide-y divide-border-light max-h-[400px] overflow-y-auto", children: cleanMessages.map((msg, i) => (_jsx("div", { className: cn('px-5 py-2.5 text-xs font-mono', i === 0 ? 'text-text bg-accent/5' : 'text-muted'), children: msg.includes('Failed') || msg.includes('Error') ? (_jsx("span", { className: "text-error", children: msg })) : msg.includes('Merged') || msg.includes('Phase') ? (_jsx("span", { className: "text-success", children: msg })) : (msg) }, i))) }))] })] }));
}
// ─── Shared Sub-Components ─────────────────────────────
function ActionBtn({ icon: Icon, title, color, onClick, disabled }) {
    return (_jsx("button", { onClick: onClick, disabled: disabled, title: title, className: cn('p-1.5 rounded-lg hover:bg-hover transition-colors disabled:opacity-50', color), children: _jsx(Icon, { className: "w-3.5 h-3.5" }) }));
}
function StatsDisplay({ stats }) {
    if (!stats || Object.keys(stats).length === 0)
        return _jsx("span", { className: "text-muted", children: "--" });
    const items = [];
    if (stats.filesProcessed)
        items.push(`${stats.filesProcessed} files`);
    if (stats.entitiesExtracted)
        items.push(`${stats.entitiesExtracted} entities`);
    if (stats.documentsIngested)
        items.push(`${stats.documentsIngested} docs`);
    if (stats.chunksCreated)
        items.push(`${stats.chunksCreated} chunks`);
    if (items.length === 0) {
        for (const [k, v] of Object.entries(stats)) {
            if (typeof v === 'number')
                items.push(`${v} ${k}`);
        }
    }
    return _jsx("span", { children: items.join(', ') || '--' });
}
function DocumentsPanel({ docData, docStatus, onRefresh }) {
    const counts = docData?.statusCounts ?? docStatus;
    const total = docData?.total ?? (counts.all ?? Object.entries(counts).filter(([k]) => k !== 'all').reduce((a, [, b]) => a + b, 0));
    const statusColors = { completed: 'bg-success', processing: 'bg-info', pending: 'bg-warning', failed: 'bg-error' };
    return (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-sm font-semibold text-text", children: "Document Status" }), _jsxs("button", { onClick: onRefresh, className: "text-xs text-accent hover:underline inline-flex items-center gap-1", children: [_jsx(RefreshCw, { className: "w-3 h-3" }), " Refresh"] })] }), _jsxs("p", { className: "text-3xl font-bold text-text mb-4", children: [total, " ", _jsx("span", { className: "text-sm font-normal text-muted", children: "total documents" })] }), total > 0 && (_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex h-4 rounded-full overflow-hidden bg-hover", children: Object.entries(counts).filter(([k]) => k !== 'all').map(([status, count]) => {
                                const pct = total > 0 ? (count / total) * 100 : 0;
                                if (pct === 0)
                                    return null;
                                return _jsx("div", { className: cn('transition-all', statusColors[status] ?? 'bg-muted'), style: { width: `${pct}%` }, title: `${status}: ${count} (${pct.toFixed(1)}%)` }, status);
                            }) }), _jsx("div", { className: "flex flex-wrap gap-4", children: Object.entries(counts).filter(([k]) => k !== 'all').map(([status, count]) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: cn('w-3 h-3 rounded-full', statusColors[status] ?? 'bg-muted') }), _jsx("span", { className: "text-xs text-muted capitalize", children: status }), _jsx("span", { className: "text-xs font-semibold text-text", children: count })] }, status))) })] })), total === 0 && _jsx(EmptyState, { icon: FileText, message: "No documents found" })] }) }));
}
