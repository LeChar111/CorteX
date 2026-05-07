import React, { useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Trash2,
  RefreshCw,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
  Brain,
  Layers,
  X,
} from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { timeAgo, formatDuration } from '../lib/helpers.ts';
import { ScanStatusBadge } from '../components/ScanStatusBadge.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { usePolling } from '../hooks/usePolling.ts';
import { useAsyncData } from '../hooks/useAsyncData.ts';
import type { ScanJob } from '../types.ts';

// ─── Types ─────────────────────────────────────────────
type PipelineView = 'scan' | 'documents';
type TabKey = 'running' | 'queued' | 'paused' | 'failed' | 'completed' | 'documents';

const PIPELINE_STEPS: { key: PipelineView; label: string; sublabel: string; icon: React.ElementType }[] = [
  { key: 'scan', label: 'Scan Pipeline', sublabel: 'Code extraction via graphify', icon: Layers },
  { key: 'documents', label: 'Document Status', sublabel: 'Graph document status', icon: Brain },
];

interface QueueData {
  running: ScanJob[];
  queued: ScanJob[];
  paused: ScanJob[];
  failed: ScanJob[];
  completed: ScanJob[];
}

interface DocData {
  documents: unknown[];
  statusCounts: Record<string, number>;
  total: number;
}

interface DocumentPipeline {
  busy: boolean;
  job_name: string;
  docs: number;
  batchs: number;
  cur_batch: number;
  latest_message: string;
  history_messages: string[];
  counts: Record<string, number>;
}

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'running', label: 'Running', icon: Loader2 },
  { key: 'queued', label: 'Queued', icon: Clock },
  { key: 'paused', label: 'Paused', icon: Pause },
  { key: 'failed', label: 'Failed', icon: XCircle },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  { key: 'documents', label: 'Graph Docs', icon: FileText },
];

// ─── Main Component ────────────────────────────────────
export function PipelinePage() {
  const [view, setView] = useState<PipelineView>('scan');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-6xl font-bold text-text">Pipeline Manager</h1>
          <p className="text-xl text-muted mt-1">Monitor and manage scan jobs and document processing</p>
        </div>
      </div>

      {/* Pipeline Steps — ordered flow */}
      <div className="flex items-stretch gap-0">
        {PIPELINE_STEPS.map((step, i) => {
          const active = view === step.key;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex items-center">
              {i > 0 && (
                <div className="flex items-center px-2 text-muted">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
              <button
                onClick={() => setView(step.key)}
                className={cn(
                  'flex items-center gap-3 px-5 py-3 rounded-xl transition-all',
                  active
                    ? 'bg-sidebar-active text-white shadow-md'
                    : 'bg-card border border-border-light text-muted hover:text-text hover:border-accent/40',
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-lg',
                  active ? 'bg-white/20' : 'bg-hover',
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className={cn('text-xs font-bold uppercase tracking-wider', active ? 'text-white/60' : 'text-muted')}>
                      Step {i + 1}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">{step.label}</p>
                  <p className={cn('text-[11px]', active ? 'text-white/50' : 'text-light')}>{step.sublabel}</p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {view === 'scan' ? <ScanPipelineView /> : <DocumentPipelineView />}
    </div>
  );
}

// ─── Scan Pipeline View ────────────────────────────────
function ScanPipelineView() {
  const [activeTab, setActiveTab] = useState<TabKey>('running');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const { data: queue, loading, refetch: refetchQueue } = usePolling<QueueData>(
    () => api.getScanQueue(),
    5000,
  );

  const { data: docStatus } = useAsyncData(
    () => api.getDocumentStatus().catch(() => ({} as Record<string, number>)),
    [],
  );

  const { data: repoMap } = useAsyncData(async () => {
    const projects = await api.listProjects();
    const map: Record<string, string> = {};
    for (const p of projects) {
      const repos = await api.getRepos(p.id);
      for (const r of repos) map[r.id] = r.name;
    }
    return map;
  }, []);

  const [docData, setDocData] = useState<DocData | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      const data = await api.getDocuments();
      setDocData(data);
    } catch { /* ignore */ }
  }, []);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSelected(new Set());
    if (tab === 'documents' && !docData) loadDocuments();
  };

  const currentJobs: ScanJob[] =
    queue && activeTab !== 'documents' ? queue[activeTab] : [];

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(currentJobs.map((j) => j.id)));
  const deselectAll = () => setSelected(new Set());

  const toggleError = (id: string) => {
    setExpandedErrors((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  async function batchAction(action: () => Promise<unknown>) {
    if (selected.size === 0) return;
    setActionLoading(true);
    try {
      await action();
      setSelected(new Set());
      await refetchQueue();
    } finally {
      setActionLoading(false);
    }
  }

  async function singleAction(action: () => Promise<unknown>) {
    setActionLoading(true);
    try {
      await action();
      await refetchQueue();
    } finally {
      setActionLoading(false);
    }
  }

  const tabCounts: Record<TabKey, number> = {
    running: queue?.running.length ?? 0,
    queued: queue?.queued.length ?? 0,
    paused: queue?.paused.length ?? 0,
    failed: queue?.failed.length ?? 0,
    completed: queue?.completed.length ?? 0,
    documents: docData?.total ?? ((docStatus as Record<string, unknown>)?.nodes as number ?? 0),
  };

  const statCards: { key: TabKey; label: string; color: string; icon: React.ElementType; animate?: boolean }[] = [
    { key: 'running', label: 'Running', color: 'text-info', icon: Loader2, animate: true },
    { key: 'queued', label: 'Queued', color: 'text-muted', icon: Clock },
    { key: 'paused', label: 'Paused', color: 'text-warning', icon: Pause },
    { key: 'failed', label: 'Failed', color: 'text-error', icon: AlertCircle },
    { key: 'completed', label: 'Completed', color: 'text-success', icon: CheckCircle2 },
  ];

  if (loading) return <LoadingSkeleton lines={5} />;

  return (
    <>
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map(({ key, label, color, icon: Icon, animate }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={cn(
              'bg-card rounded-[--radius-lg] border shadow-sm p-4 w-full transition-all',
              activeTab === key ? 'border-accent ring-1 ring-accent/30' : 'border-border-light hover:border-accent/40',
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={cn('w-4 h-4', color, animate && tabCounts[key] > 0 && 'animate-spin')} />
              <span className="text-md font-medium text-muted uppercase tracking-wide">{label}</span>
            </div>
            <span className={cn('text-6xl justify-end font-bold', color)}>{tabCounts[key]}</span>
          </button>
        ))}
        <button
          onClick={() => handleTabChange('documents')}
          className={cn(
            'bg-card rounded-[--radius-lg] border shadow-sm p-4 transition-all',
            activeTab === 'documents' ? 'border-accent ring-1 ring-accent/30' : 'border-border-light hover:border-accent/40',
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-md font-medium text-muted uppercase tracking-wide">Graph Docs</span>
          </div>
          <span className="text-6xl font-bold justify-end text-accent">{tabCounts.documents}</span>
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center justify-between border-b border-border-light">
        <div className="flex gap-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === key
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-text hover:border-border-light',
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              <span className="ml-1 text-xs bg-hover rounded-full px-1.5 py-0.5">{tabCounts[key]}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => refetchQueue()}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border-light bg-card text-text hover:bg-hover transition-colors mb-1"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Bulk action bar */}
      {activeTab !== 'documents' && selected.size > 0 && (
        <div className="flex items-center gap-3 bg-card rounded-[--radius-lg] border border-accent/30 p-3 shadow-sm">
          <span className="text-sm font-medium text-text">{selected.size} selected</span>
          <div className="flex-1" />
          {(activeTab === 'running' || activeTab === 'queued') && (
            <button onClick={() => batchAction(() => api.batchPauseScans([...selected]))} disabled={actionLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors disabled:opacity-50">
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
          )}
          {activeTab === 'paused' && (
            <button onClick={() => batchAction(() => api.batchRetryScans([...selected]))} disabled={actionLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50">
              <Play className="w-3.5 h-3.5" /> Resume
            </button>
          )}
          {activeTab === 'failed' && (
            <button onClick={() => batchAction(() => api.batchRetryScans([...selected]))} disabled={actionLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-info/10 text-info hover:bg-info/20 transition-colors disabled:opacity-50">
              <RotateCcw className="w-3.5 h-3.5" /> Retry
            </button>
          )}
          <button onClick={() => batchAction(() => api.batchDeleteScans([...selected]))} disabled={actionLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50">
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
          <button onClick={selected.size === currentJobs.length ? deselectAll : selectAll} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-hover text-muted hover:text-text transition-colors">
            {selected.size === currentJobs.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'documents' ? (
        <DocumentsPanel docData={docData} docStatus={docStatus ?? {}} onRefresh={loadDocuments} />
      ) : currentJobs.length === 0 ? (
        <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-12">
          <EmptyState icon={Activity} message={`No ${activeTab} jobs`} />
        </div>
      ) : (
        <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light bg-hover/50">
                  <th className="w-10 px-3 py-3">
                    <input type="checkbox" checked={selected.size === currentJobs.length && currentJobs.length > 0} onChange={() => selected.size === currentJobs.length ? deselectAll() : selectAll()} className="rounded border-border-light" />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Job ID</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Repo</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Branch</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Mode</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Time</th>
                  {activeTab === 'completed' && <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Duration</th>}
                  {(activeTab === 'completed' || activeTab === 'running') && <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Stats</th>}
                  {activeTab === 'failed' && <th className="px-3 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">Error</th>}
                  <th className="px-3 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentJobs.map((job, idx) => {
                  const isExpanded = expandedJob === job.id;
                  const st = (job.stats ?? {}) as Record<string, unknown>;
                  const phase = st.phase as string | undefined;
                  const totalFiles = st.totalFiles as number | undefined;
                  const totalDocs = st.totalDocuments as number | undefined;
                  const llmBatches = st.llmBatches as number | undefined;
                  const llmBatchesDone = st.llmBatchesDone as number | undefined;
                  const colCount = 7 + (activeTab === 'completed' ? 1 : 0) + ((activeTab === 'completed' || activeTab === 'running') ? 1 : 0) + (activeTab === 'failed' ? 1 : 0) + 1;
                  return (
                  <React.Fragment key={job.id}>
                  <tr
                    className={cn(
                      'border-b border-border-light last:border-0 transition-colors cursor-pointer',
                      idx % 2 === 1 && 'bg-hover/30',
                      selected.has(job.id) && 'bg-accent/5',
                      isExpanded && 'bg-accent/5 border-b-0',
                    )}
                    onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                  >
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selected.has(job.id)} onChange={() => toggleSelect(job.id)} className="rounded border-border-light" /></td>
                    <td className="px-3 py-3 font-mono text-xs text-muted" title={job.id}>
                      <span className="inline-flex items-center gap-1.5">
                        {isExpanded ? <ChevronDown className="w-3 h-3 text-accent" /> : <ChevronDown className="w-3 h-3 text-muted opacity-0 group-hover:opacity-100" />}
                        {job.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-3 py-3 font-medium text-text">{(repoMap ?? {})[job.repoId] || job.repoId.slice(0, 8)}</td>
                    <td className="px-3 py-3 text-muted">{job.branch}</td>
                    <td className="px-3 py-3">
                      <span className={cn('inline-flex px-2 py-0.5 rounded text-xs font-bold uppercase', job.mode === 'full' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning')}>{job.mode}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <ScanStatusBadge status={job.status} />
                        {phase && job.status === 'running' && (
                          <span className="px-1.5 py-0.5 rounded bg-accent/10 text-[9px] font-mono font-bold text-accent uppercase">{phase.replace('_', ' ')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted" title={job.startedAt || job.createdAt}>{timeAgo(job.startedAt || job.createdAt)}</td>
                    {activeTab === 'completed' && <td className="px-3 py-3 text-xs text-muted">{formatDuration(job.startedAt, job.completedAt)}</td>}
                    {(activeTab === 'completed' || activeTab === 'running') && <td className="px-3 py-3 text-xs text-muted"><StatsDisplay stats={job.stats} /></td>}
                    {activeTab === 'failed' && (
                      <td className="px-3 py-3 max-w-xs">
                        {job.error ? (
                          <div>
                            <span className="text-xs text-error">{expandedErrors.has(job.id) ? job.error : job.error.length > 80 ? job.error.slice(0, 80) + '...' : job.error}</span>
                            {job.error.length > 80 && (
                              <button onClick={(e) => { e.stopPropagation(); toggleError(job.id); }} className="ml-1 text-xs text-accent hover:underline">
                                {expandedErrors.has(job.id) ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />}
                              </button>
                            )}
                          </div>
                        ) : <span className="text-xs text-muted">--</span>}
                      </td>
                    )}
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        {(job.status === 'running' || job.status === 'queued') && <ActionBtn icon={Pause} title="Pause" color="text-warning" onClick={() => singleAction(() => api.pauseScanJob(job.id))} disabled={actionLoading} />}
                        {job.status === 'paused' && <ActionBtn icon={Play} title="Resume" color="text-success" onClick={() => singleAction(() => api.resumeScanJob(job.id))} disabled={actionLoading} />}
                        {job.status === 'failed' && <ActionBtn icon={RotateCcw} title="Retry" color="text-info" onClick={() => singleAction(() => api.batchRetryScans([job.id]))} disabled={actionLoading} />}
                        <ActionBtn icon={Trash2} title="Delete" color="text-error" onClick={() => singleAction(() => api.deleteScanJob(job.id))} disabled={actionLoading} />
                      </div>
                    </td>
                  </tr>
                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <tr>
                      <td colSpan={colCount} className="p-0">
                        <div className="px-5 py-4 bg-bg/80 border-b border-border-light space-y-3">
                          {/* Progress bar for running jobs */}
                          {job.status === 'running' && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-muted">Progress</span>
                                <span className="font-mono text-text">
                                  {phase === 'parsing' && totalFiles ? `Parsing ${st.filesProcessed}/${totalFiles} files` :
                                   phase === 'llm_extraction' && llmBatches ? `LLM extraction (${llmBatchesDone ?? 0}/${llmBatches} batches)` :
                                   phase === 'llm_extraction' ? 'LLM extraction (?)' :
                                   phase === 'ingestion' && totalDocs ? `Ingesting ${st.documentsIngested}/${totalDocs} docs` :
                                   'Starting...'}
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-hover overflow-hidden">
                                <div className="h-full rounded-full bg-accent transition-all duration-500" style={{
                                  width: phase === 'parsing' && totalFiles ? `${Math.round(((st.filesProcessed as number) / totalFiles) * 33)}%`
                                    : phase === 'llm_extraction' && llmBatches ? `${33 + Math.round(((llmBatchesDone ?? 0) / llmBatches) * 33)}%`
                                    : phase === 'llm_extraction' ? '50%'
                                    : phase === 'ingestion' && totalDocs ? `${66 + Math.round(((st.documentsIngested as number) / totalDocs) * 34)}%`
                                    : '10%'
                                }} />
                              </div>
                            </div>
                          )}

                          {/* Stats grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              { label: 'Files processed', value: st.filesProcessed, total: totalFiles },
                              { label: 'Chunks', value: st.chunksProcessed },
                              { label: 'Entities extracted', value: st.entitiesExtracted },
                              { label: 'Documents ingested', value: st.documentsIngested, total: totalDocs },
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

                          {/* Detail info */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-1.5 text-[11px] rounded-lg bg-card border border-border-light/50 p-3">
                            <div className="flex justify-between"><span className="text-muted">Job ID</span><span className="font-mono text-text">{job.id.slice(0, 12)}</span></div>
                            <div className="flex justify-between"><span className="text-muted">Mode</span><span className="font-mono text-text uppercase">{job.mode}</span></div>
                            {job.startedAt && <div className="flex justify-between"><span className="text-muted">Started</span><span className="font-mono text-text">{new Date(job.startedAt).toLocaleTimeString()}</span></div>}
                            {job.completedAt && <div className="flex justify-between"><span className="text-muted">Completed</span><span className="font-mono text-text">{new Date(job.completedAt).toLocaleTimeString()}</span></div>}
                            {job.startedAt && (
                              <div className="flex justify-between"><span className="text-muted">Duration</span><span className="font-mono text-text">{formatDuration(job.startedAt, job.completedAt || new Date().toISOString())}</span></div>
                            )}
                            {llmBatches != null && <div className="flex justify-between"><span className="text-muted">LLM batches</span><span className="font-mono text-text">{llmBatches}</span></div>}
                            {(st.relationsExtracted as number) > 0 && <div className="flex justify-between"><span className="text-muted">Relations</span><span className="font-mono text-text">{st.relationsExtracted as number}</span></div>}
                            {phase && <div className="flex justify-between"><span className="text-muted">Phase</span><span className="font-mono text-accent uppercase">{phase.replace('_', ' ')}</span></div>}
                          </div>

                          {/* Error */}
                          {job.error && (
                            <div className="rounded-lg bg-error/5 border border-error/15 p-3">
                              <p className="text-[11px] text-error font-mono break-all">{job.error}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Document Pipeline View ───────────────────────────
function DocumentPipelineView() {
  const { data: pipeline, loading, refetch } = usePolling<DocumentPipeline>(
    () => api.getDocumentPipeline(),
    3000,
  );

  const [actionLoading, setActionLoading] = useState(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  if (loading || !pipeline) return <LoadingSkeleton lines={5} />;

  const counts = pipeline.counts;
  const processed: number = counts.processed ?? 0;
  const processing: number = counts.processing ?? 0;
  const pending: number = counts.pending ?? 0;
  const failed: number = counts.failed ?? 0;
  const total: number = counts.all ?? 0;
  const progressPct = pipeline.docs > 0 ? Math.round((pipeline.cur_batch / pipeline.docs) * 100) : 0;
  const pct = (v: number) => total > 0 ? `${((v / total) * 100).toFixed(1)}%` : '—';

  async function pipelineAction(action: () => Promise<unknown>) {
    setActionLoading(true);
    setPipelineError(null);
    try {
      await action();
      await refetch();
    } catch (err) {
      setPipelineError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(false);
    }
  }

  // Filter out long tracebacks from messages for display
  const cleanMessages = pipeline.history_messages
    .filter((m) => !m.startsWith('Traceback'))
    .slice(-20)
    .reverse();

  return (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {([
          { label: 'Processed', icon: CheckCircle2, value: processed, sub: pct(processed), color: 'text-success', iconColor: 'text-success' },
          { label: 'Processing', icon: Loader2, value: processing, sub: processing > 0 ? 'in progress' : 'idle', color: processing > 0 ? 'text-info' : 'text-muted', iconColor: 'text-info', animate: processing > 0 },
          { label: 'Pending', icon: Clock, value: pending, sub: pct(pending), color: pending > 0 ? 'text-warning' : 'text-muted', iconColor: 'text-warning' },
          { label: 'Failed', icon: XCircle, value: failed, sub: pct(failed), color: failed > 0 ? 'text-error' : 'text-muted', iconColor: 'text-error' },
          { label: 'Documents', icon: FileText, value: total, sub: `${pipeline.busy ? 'processing' : 'idle'}`, color: 'text-text', iconColor: 'text-accent' },
          { label: 'Graph Nodes', icon: Brain, value: counts.graphLabels ?? counts.processed ?? 0, sub: `${counts.graphEdges ?? 0} edges`, color: 'text-accent', iconColor: 'text-accent' },
        ] as const).map(({ label, icon: Icon, value, sub, color, iconColor, ...rest }) => (
          <div key={label} className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={cn('w-4 h-4', iconColor, 'animate' in rest && rest.animate && 'animate-spin')} />
              <span className="text-md font-medium text-muted uppercase tracking-wide">{label}</span>
            </div>
            <span className={cn('text-4xl font-bold', color)}>{typeof value === 'number' ? value.toLocaleString() : value}</span>
            <p className="text-xs text-light mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar (when busy) */}
      {pipeline.busy && (
        <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text">Processing Documents</h3>
              <p className="text-xs text-muted mt-0.5">{pipeline.job_name || 'Document batch'}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold font-mono text-text">{pipeline.cur_batch}</span>
              <span className="text-sm text-muted"> / {pipeline.docs}</span>
              <span className="text-xs text-muted ml-2">({progressPct}%)</span>
            </div>
          </div>
          <div className="h-3 rounded-full bg-hover overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>
          {pipeline.latest_message && (
            <p className="text-xs text-muted font-mono truncate">{pipeline.latest_message}</p>
          )}
        </div>
      )}

      {/* Pipeline Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border-light bg-card text-text hover:bg-hover transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
        {!pipeline.busy && (
          <button
            onClick={() => pipelineAction(() => api.scanDocuments())}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Start Pipeline
          </button>
        )}
        {pipeline.busy && (
          <button
            onClick={() => pipelineAction(() => api.cancelPipeline())}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
            Stop Pipeline
          </button>
        )}
        {failed > 0 && !pipeline.busy && (
          <button
            onClick={() => pipelineAction(() => api.reprocessFailedDocuments())}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            Retry {failed} failed
          </button>
        )}
        {!pipeline.busy && pending > 0 && (
          <button
            onClick={() => pipelineAction(() => api.reprocessFailedDocuments())}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Process {pending} pending
          </button>
        )}
      </div>

      {pipelineError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          <XCircle className="w-4 h-4 shrink-0" />
          <span>{pipelineError}</span>
          <button onClick={() => setPipelineError(null)} className="ml-auto text-error/60 hover:text-error">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Document Status Breakdown */}
      {total > 0 && (
        <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-5">
          <h3 className="text-sm font-semibold text-text mb-3">Document Status Breakdown</h3>
          <div className="space-y-3">
            {/* Stacked bar */}
            <div className="flex h-4 rounded-full overflow-hidden bg-hover">
              {[
                { key: 'processed', color: 'bg-success' },
                { key: 'processing', color: 'bg-info' },
                { key: 'pending', color: 'bg-warning' },
                { key: 'failed', color: 'bg-error' },
              ].map(({ key, color }) => {
                const count = counts[key] ?? 0;
                const pct = total > 0 ? (count / total) * 100 : 0;
                if (pct === 0) return null;
                return (
                  <div key={key} className={cn('transition-all', color)} style={{ width: `${pct}%` }} title={`${key}: ${count} (${pct.toFixed(1)}%)`} />
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-4">
              {Object.entries(counts).filter(([k]) => k !== 'all' && k !== 'preprocessed' && k !== 'graphLabels').map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', status === 'processed' ? 'bg-success' : status === 'processing' ? 'bg-info' : status === 'pending' ? 'bg-warning' : status === 'failed' ? 'bg-error' : 'bg-muted')} />
                  <span className="text-xs text-muted capitalize">{status}</span>
                  <span className="text-xs font-semibold text-text">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border-light">
          <h3 className="text-sm font-semibold text-text">Activity Log</h3>
        </div>
        {cleanMessages.length === 0 ? (
          <div className="p-5">
            <EmptyState message="No recent pipeline activity" />
          </div>
        ) : (
          <div className="divide-y divide-border-light max-h-[400px] overflow-y-auto">
            {cleanMessages.map((msg, i) => (
              <div key={i} className={cn('px-5 py-2.5 text-xs font-mono', i === 0 ? 'text-text bg-accent/5' : 'text-muted')}>
                {msg.includes('Failed') || msg.includes('Error') ? (
                  <span className="text-error">{msg}</span>
                ) : msg.includes('Merged') || msg.includes('Phase') ? (
                  <span className="text-success">{msg}</span>
                ) : (
                  msg
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Shared Sub-Components ─────────────────────────────
function ActionBtn({ icon: Icon, title, color, onClick, disabled }: { icon: React.ElementType; title: string; color: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} title={title} className={cn('p-1.5 rounded-lg hover:bg-hover transition-colors disabled:opacity-50', color)}>
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function StatsDisplay({ stats }: { stats: Record<string, unknown> }) {
  if (!stats || Object.keys(stats).length === 0) return <span className="text-muted">--</span>;
  const items: string[] = [];
  if (stats.filesProcessed) items.push(`${stats.filesProcessed} files`);
  if (stats.entitiesExtracted) items.push(`${stats.entitiesExtracted} entities`);
  if (stats.documentsIngested) items.push(`${stats.documentsIngested} docs`);
  if (stats.chunksCreated) items.push(`${stats.chunksCreated} chunks`);
  if (items.length === 0) {
    for (const [k, v] of Object.entries(stats)) {
      if (typeof v === 'number') items.push(`${v} ${k}`);
    }
  }
  return <span>{items.join(', ') || '--'}</span>;
}

function DocumentsPanel({ docData, docStatus, onRefresh }: { docData: DocData | null; docStatus: Record<string, number>; onRefresh: () => void }) {
  const counts = docData?.statusCounts ?? docStatus;
  const total = docData?.total ?? (counts.all ?? Object.entries(counts).filter(([k]) => k !== 'all').reduce((a, [, b]) => a + b, 0));

  const statusColors: Record<string, string> = { completed: 'bg-success', processing: 'bg-info', pending: 'bg-warning', failed: 'bg-error' };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text">Document Status</h3>
          <button onClick={onRefresh} className="text-xs text-accent hover:underline inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>
        <p className="text-3xl font-bold text-text mb-4">{total} <span className="text-sm font-normal text-muted">total documents</span></p>
        {total > 0 && (
          <div className="space-y-3">
            <div className="flex h-4 rounded-full overflow-hidden bg-hover">
              {Object.entries(counts).filter(([k]) => k !== 'all').map(([status, count]) => {
                const pct = total > 0 ? (count / total) * 100 : 0;
                if (pct === 0) return null;
                return <div key={status} className={cn('transition-all', statusColors[status] ?? 'bg-muted')} style={{ width: `${pct}%` }} title={`${status}: ${count} (${pct.toFixed(1)}%)`} />;
              })}
            </div>
            <div className="flex flex-wrap gap-4">
              {Object.entries(counts).filter(([k]) => k !== 'all').map(([status, count]) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', statusColors[status] ?? 'bg-muted')} />
                  <span className="text-xs text-muted capitalize">{status}</span>
                  <span className="text-xs font-semibold text-text">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {total === 0 && <EmptyState icon={FileText} message="No documents found" />}
      </div>
    </div>
  );
}
