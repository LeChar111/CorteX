import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  FolderKanban,
  GitBranch,
  Clock,
  ScanSearch,
  Network,
  Loader2,
  Calendar,
  Hash,
  Tag,
  GitMerge,
  Plus,
  X,
  Check,
  ChevronDown,
  Plug,
} from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import type { Project as ProjectType, Repo, ScanJob, CortexEvent } from '../types.ts';
import { timeAgo, formatDate, formatDuration, slugify } from '../lib/helpers.ts';
import { PROVIDERS } from '../lib/config.ts';
import { ScanStatusBadge } from '../components/ScanStatusBadge.tsx';
import { ProviderBadge } from '../components/ProviderBadge.tsx';
import { EventIcon } from '../components/EventIcon.tsx';
import { ProjectLinksPanel } from '../components/ProjectLinksPanel.tsx';

function BranchSelector({
  repo,
  onBranchChanged,
}: {
  repo: Repo;
  onBranchChanged: (repoId: string, branch: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [branches, setBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (branches.length === 0) {
      setLoading(true);
      try {
        const list = await api.getBranches(repo.id);
        setBranches(list);
      } catch {
        setBranches([]);
      }
      setLoading(false);
    }
  };

  const handleSelect = async (branch: string) => {
    if (branch === repo.defaultBranch) {
      setOpen(false);
      return;
    }
    try {
      await api.updateRepo(repo.id, { defaultBranch: branch });
      onBranchChanged(repo.id, branch);
    } catch (err) {
      console.error('Failed to update branch:', err);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
      >
        <GitBranch className="w-3 h-3" />
        <span className="font-mono">{repo.defaultBranch}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 w-56 max-h-48 overflow-y-auto bg-card border border-[var(--color-border-light)] rounded-[var(--radius-md)] shadow-lg">
          {loading ? (
            <div className="px-3 py-2 text-xs text-muted flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />Loading branches...
            </div>
          ) : branches.length === 0 ? (
            <div className="px-3 py-2 text-xs text-muted">No branches found</div>
          ) : (
            branches.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => handleSelect(b)}
                className={cn(
                  'w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-[var(--color-hover)] transition-colors flex items-center gap-2',
                  b === repo.defaultBranch ? 'text-accent font-semibold' : 'text-text',
                )}
              >
                {b === repo.defaultBranch && <Check className="w-3 h-3" />}
                <span className={b === repo.defaultBranch ? '' : 'pl-5'}>{b}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const emptyRepoForm = {
  name: '',
  slug: '',
  cloneUrl: '',
  provider: 'bitbucket' as string,
  techStack: '',
  defaultBranch: 'main',
};

function AddRepoModal({
  projectId,
  onClose,
  onCreated,
}: {
  projectId: string;
  onClose: () => void;
  onCreated: (repo: Repo) => void;
}) {
  const [form, setForm] = useState(emptyRepoForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (field: string, value: string) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      if (field === 'name' && f.slug === slugify(f.name)) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const repo = await api.createRepo({
        projectId,
        name: form.name.trim(),
        slug: form.slug.trim(),
        cloneUrl: form.cloneUrl.trim(),
        provider: form.provider,
        techStack: form.techStack
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        defaultBranch: form.defaultBranch.trim() || 'main',
      });
      onCreated(repo as Repo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create repo');
    }
    setSaving(false);
  };

  const inputCls =
    'w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-text placeholder:text-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        className="relative bg-card rounded-[var(--radius-lg)] shadow-lg border border-[var(--color-border-light)] w-full max-w-lg p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text">Add Repository</h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="px-3 py-2 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-error text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              placeholder="backend-device"
              className={inputCls}
            />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted">Slug</span>
            <input
              required
              value={form.slug}
              onChange={(e) => setField('slug', e.target.value)}
              placeholder="backend-device"
              className={inputCls}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted">Provider</span>
            <select
              value={form.provider}
              onChange={(e) => setField('provider', e.target.value)}
              className={inputCls}
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-medium text-muted">Default Branch</span>
            <input
              value={form.defaultBranch}
              onChange={(e) => setField('defaultBranch', e.target.value)}
              placeholder="main"
              className={inputCls}
            />
          </label>
        </div>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted">
            {form.provider === 'local' ? 'Local Path' : 'Clone URL'}
          </span>
          <input
            required
            value={form.cloneUrl}
            onChange={(e) => setField('cloneUrl', e.target.value)}
            placeholder={form.provider === 'local' ? '/home/user/projects/my-repo' : 'https://bitbucket.org/org/repo.git'}
            className={inputCls}
          />
          {form.provider === 'local' && (
            <p className="text-[10px] text-[var(--color-text-light)]">Absolute path to the local git repository</p>
          )}
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-muted">Tech Stack <span className="font-normal text-[var(--color-text-light)]">(comma-separated)</span></span>
          <input
            value={form.techStack}
            onChange={(e) => setField('techStack', e.target.value)}
            placeholder="typescript, react, postgresql"
            className={inputCls}
          />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-colors',
              saving
                ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                : 'bg-accent text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)]',
            )}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Adding...' : 'Add Repo'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ScanProgressBar({ status, label }: { status: 'queued' | 'running' | 'completed' | 'failed'; label: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      setProgress(100);
      return;
    }
    // Animate progress: fast at start, slow near end (asymptotic to 90%)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev + 0.1;
        return prev + (90 - prev) * 0.05;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [status]);

  const barColor =
    status === 'failed'
      ? 'bg-error'
      : status === 'completed'
        ? 'bg-success'
        : 'bg-accent';

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="text-muted font-mono">{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--color-hover)] overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300 ease-out', barColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function Project() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [scans, setScans] = useState<ScanJob[]>([]);
  const [events, setEvents] = useState<CortexEvent[]>([]);
  const [scanning, setScanning] = useState<Record<string, { jobId: string; status: string }>>({});
  const [scanningAll, setScanningAll] = useState(false);
  const [showAddRepo, setShowAddRepo] = useState(false);
  const [connCheck, setConnCheck] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
  const [connError, setConnError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getProject(id).then(setProject).catch(console.error);
    api.getRepos(id).then(setRepos).catch(console.error);
    api.getScanStatus(id).then(setScans).catch(console.error);
    api.getEvents({ projectId: id, limit: 8 }).then(setEvents).catch(console.error);
  }, [id]);

  // Poll active scan jobs
  useEffect(() => {
    const activeJobs = Object.entries(scanning).filter(
      ([, s]) => s.status === 'queued' || s.status === 'running',
    );
    if (activeJobs.length === 0) return;

    const interval = setInterval(async () => {
      for (const [repoId, s] of activeJobs) {
        try {
          const job = await api.getScanJob(s.jobId);
          setScanning((prev) => ({
            ...prev,
            [repoId]: { ...prev[repoId], status: job.status },
          }));
          if (job.status === 'completed' || job.status === 'failed') {
            // Refresh scans list AND repos to update lastScannedAt
            if (id) {
              api.getScanStatus(id).then(setScans).catch(console.error);
              api.getRepos(id).then(setRepos).catch(console.error);
              api.getEvents({ projectId: id, limit: 8 }).then(setEvents).catch(console.error);
            }
          }
        } catch {
          // ignore poll errors
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [scanning, id]);

  // Auto-clear completed scans after 3s
  useEffect(() => {
    const done = Object.entries(scanning).filter(
      ([, s]) => s.status === 'completed' || s.status === 'failed',
    );
    if (done.length === 0) return;
    const timeout = setTimeout(() => {
      setScanning((prev) => {
        const next = { ...prev };
        for (const [repoId] of done) delete next[repoId];
        return next;
      });
    }, 3000);
    return () => clearTimeout(timeout);
  }, [scanning]);

  // Periodic repo refresh while scans are active
  useEffect(() => {
    if (!id) return;
    const hasActiveScans = Object.values(scanning).some(
      (s) => s.status === 'queued' || s.status === 'running',
    );
    if (!hasActiveScans) return;
    const interval = setInterval(() => {
      api.getRepos(id).then(setRepos).catch(console.error);
    }, 10_000);
    return () => clearInterval(interval);
  }, [id, scanning]);

  const handleScanRepo = async (repoId: string) => {
    if (!id) return;
    const repo = repos.find((r) => r.id === repoId);
    try {
      const { jobId } = await api.triggerScan({ projectId: id, repoId, branch: repo?.defaultBranch });
      setScanning((prev) => ({ ...prev, [repoId]: { jobId, status: 'queued' } }));
    } catch (err) {
      console.error('Scan failed:', err);
    }
  };

  const handleCheckConnection = async () => {
    if (repos.length === 0) return;
    setConnCheck('checking');
    setConnError(null);
    try {
      await Promise.all(repos.map((r) => api.getBranches(r.id)));
      setConnCheck('ok');
      setTimeout(() => setConnCheck('idle'), 3000);
    } catch (err) {
      setConnCheck('error');
      setConnError(err instanceof Error ? err.message : 'Connection failed');
      setTimeout(() => setConnCheck('idle'), 5000);
    }
  };

  const handleScanAll = async () => {
    if (!id) return;
    setScanningAll(true);
    try {
      const results = await Promise.all(
        repos.map(async (r) => {
          const { jobId } = await api.triggerScan({ projectId: id, repoId: r.id, branch: r.defaultBranch });
          return [r.id, { jobId, status: 'queued' }] as const;
        }),
      );
      setScanning((prev) => ({ ...prev, ...Object.fromEntries(results) }));
    } catch (err) {
      console.error('Scan all failed:', err);
    }
    setScanningAll(false);
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading project...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Overview
      </Link>

      {/* Header */}
      <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] flex items-center justify-center flex-shrink-0">
              <FolderKanban className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-muted mt-1">{project.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {formatDate(project.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <GitMerge className="w-3.5 h-3.5" />
                  {repos.length} {repos.length === 1 ? 'repo' : 'repos'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCheckConnection}
              disabled={connCheck === 'checking' || repos.length === 0}
              title={connError ?? undefined}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border transition-colors',
                connCheck === 'checking'
                  ? 'border-[var(--color-border)] text-muted cursor-not-allowed'
                  : connCheck === 'ok'
                    ? 'border-success/30 bg-success/10 text-success'
                    : connCheck === 'error'
                      ? 'border-error/30 bg-error/10 text-error'
                      : 'border-[var(--color-border)] text-text hover:bg-[var(--color-hover)]',
              )}
            >
              {connCheck === 'checking' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : connCheck === 'ok' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plug className="w-4 h-4" />
              )}
              {connCheck === 'checking' ? 'Checking...' : connCheck === 'ok' ? 'Connected' : connCheck === 'error' ? 'Failed' : 'Check Connection'}
            </button>
            <button
              onClick={() => setShowAddRepo(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Repo
            </button>
            <button
              onClick={handleScanAll}
              disabled={scanningAll || repos.length === 0}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
                scanningAll || repos.length === 0
                  ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)]'
              )}
            >
              {scanningAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanSearch className="w-4 h-4" />}
              {scanningAll ? 'Scanning...' : 'Scan All Repos'}
            </button>
            <Link
              to={`/graph/${id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors"
            >
              <Network className="w-4 h-4" />
              View Graph
            </Link>
          </div>
        </div>
      </div>

      {/* Project Links */}
      <ProjectLinksPanel projectId={id!} />

      {/* Repos section */}
      <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Repositories</h2>
          <span className="text-xs text-muted">{repos.length} repos</span>
        </div>
        {repos.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted">No repositories found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="rounded-[var(--radius-md)] border border-[var(--color-border-light)] p-4 hover:border-accent/30 hover:shadow-[var(--shadow-sm)] transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text truncate">{repo.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <ProviderBadge provider={repo.provider} />
                      <BranchSelector
                        repo={repo}
                        onBranchChanged={(repoId, branch) =>
                          setRepos((prev) =>
                            prev.map((r) => r.id === repoId ? { ...r, defaultBranch: branch } : r),
                          )
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleScanRepo(repo.id)}
                    disabled={!!scanning[repo.id]}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold transition-colors flex-shrink-0',
                      scanning[repo.id]
                        ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                        : 'bg-accent text-white hover:bg-[var(--color-accent-hover)]'
                    )}
                  >
                    {scanning[repo.id]
                      ? <><Loader2 className="w-3 h-3 animate-spin" />Scanning</>
                      : <><ScanSearch className="w-3 h-3" />Scan</>
                    }
                  </button>
                </div>

                {/* Tech stack */}
                {repo.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {repo.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-[var(--color-hover)] text-muted font-medium"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 text-xs">
                  {repo.lastScannedAt ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-success font-medium">
                        <Check className="w-3 h-3" />
                        Scanned
                      </span>
                      <span className="flex items-center gap-1 text-muted">
                        <Clock className="w-3 h-3" />
                        {timeAgo(repo.lastScannedAt)}
                      </span>
                      {repo.lastScannedCommit && (
                        <span className="flex items-center gap-1 font-mono text-muted">
                          <Hash className="w-3 h-3" />
                          {repo.lastScannedCommit.slice(0, 7)}
                        </span>
                      )}
                    </>
                  ) : !scanning[repo.id] ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--color-hover)] text-muted font-medium">
                      Never scanned
                    </span>
                  ) : null}
                </div>

                {scanning[repo.id] && (
                  <ScanProgressBar
                    status={scanning[repo.id].status as 'queued' | 'running' | 'completed' | 'failed'}
                    label={scanning[repo.id].status === 'queued' ? 'Queued...' : scanning[repo.id].status === 'running' ? 'Scanning...' : scanning[repo.id].status === 'completed' ? 'Done' : 'Failed'}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scan History */}
      <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Scan History</h2>
          <span className="text-xs text-muted">{scans.length} scans</span>
        </div>
        {scans.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted">No scans yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[var(--color-border-light)] bg-[var(--color-bg)]">
                  {['Date', 'Repo', 'Branch', 'Mode', 'Duration', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-light)]">
                {scans.slice(0, 10).map((scan) => {
                  const scanRepo = repos.find((r) => r.id === scan.repoId);
                  return (
                    <tr key={scan.id} className="hover:bg-[var(--color-hover)] transition-colors">
                      <td className="px-5 py-3 text-muted whitespace-nowrap">
                        {new Date(scan.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-3 font-medium text-text whitespace-nowrap">{scanRepo?.name ?? '—'}</td>
                      <td className="px-5 py-3 font-mono text-text whitespace-nowrap">{scan.branch}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded bg-[var(--color-hover)] text-muted font-medium">{scan.mode}</span>
                      </td>
                      <td className="px-5 py-3 text-muted whitespace-nowrap">
                        {formatDuration(scan.startedAt, scan.completedAt)}
                      </td>
                      <td className="px-5 py-3">
                        <ScanStatusBadge status={scan.status === 'failed' && scan.error?.includes('Superseded') ? 'superseded' : scan.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Repo Modal */}
      {showAddRepo && id && (
        <AddRepoModal
          projectId={id}
          onClose={() => setShowAddRepo(false)}
          onCreated={(repo) => {
            setRepos((prev) => [...prev, repo]);
            setShowAddRepo(false);
          }}
        />
      )}

      {/* Events Timeline */}
      <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">Recent Events</h2>
          <span className="text-xs text-muted">{events.length} shown</span>
        </div>
        {events.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted">No events yet</div>
        ) : (
          <div className="p-4">
            <div className="relative pl-6">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--color-border-light)]" />
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="relative flex items-start gap-3">
                    {/* Dot */}
                    <div className="absolute -left-6 w-5 h-5 rounded-full bg-[var(--color-hover)] border-2 border-[var(--color-border-light)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <EventIcon type={event.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-medium text-text">{event.type}</p>
                        <span className="text-xs text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {timeAgo(event.createdAt)}
                        </span>
                      </div>
                      {typeof event.payload?.message === 'string' && (
                        <p className="text-xs text-muted mt-0.5">{event.payload.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
