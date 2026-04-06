import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FolderKanban, GitBranch, Clock, ScanSearch, Network, Loader2, Calendar, Hash, Tag, GitMerge, Plus, X, Check, ChevronDown, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { timeAgo, formatDate, formatDuration, slugify } from '../lib/helpers.ts';
import { PROVIDERS } from '../lib/config.ts';
import { ScanStatusBadge } from '../components/ScanStatusBadge.tsx';
import { ProviderBadge } from '../components/ProviderBadge.tsx';
import { EventIcon } from '../components/EventIcon.tsx';
import { ProjectLinksPanel } from '../components/ProjectLinksPanel.tsx';
function BranchSelector({ repo, onBranchChanged, }) {
    const [open, setOpen] = useState(false);
    const [branches, setBranches] = useState([]);
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
            }
            catch {
                setBranches([]);
            }
            setLoading(false);
        }
    };
    const handleSelect = async (branch) => {
        if (branch === repo.defaultBranch) {
            setOpen(false);
            return;
        }
        try {
            await api.updateRepo(repo.id, { defaultBranch: branch });
            onBranchChanged(repo.id, branch);
        }
        catch (err) {
            console.error('Failed to update branch:', err);
        }
        setOpen(false);
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { type: "button", onClick: handleOpen, className: "inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors", children: [_jsx(GitBranch, { className: "w-3 h-3" }), _jsx("span", { className: "font-mono", children: repo.defaultBranch }), _jsx(ChevronDown, { className: cn('w-3 h-3 transition-transform', open && 'rotate-180') })] }), open && (_jsx("div", { className: "absolute z-20 top-full left-0 mt-1 w-56 max-h-48 overflow-y-auto bg-card border border-[var(--color-border-light)] rounded-[var(--radius-md)] shadow-lg", children: loading ? (_jsxs("div", { className: "px-3 py-2 text-xs text-muted flex items-center gap-2", children: [_jsx(Loader2, { className: "w-3 h-3 animate-spin" }), "Loading branches..."] })) : branches.length === 0 ? (_jsx("div", { className: "px-3 py-2 text-xs text-muted", children: "No branches found" })) : (branches.map((b) => (_jsxs("button", { type: "button", onClick: () => handleSelect(b), className: cn('w-full text-left px-3 py-1.5 text-xs font-mono hover:bg-[var(--color-hover)] transition-colors flex items-center gap-2', b === repo.defaultBranch ? 'text-accent font-semibold' : 'text-text'), children: [b === repo.defaultBranch && _jsx(Check, { className: "w-3 h-3" }), _jsx("span", { className: b === repo.defaultBranch ? '' : 'pl-5', children: b })] }, b)))) }))] }));
}
const emptyRepoForm = {
    name: '',
    slug: '',
    cloneUrl: '',
    provider: 'bitbucket',
    techStack: '',
    defaultBranch: 'main',
};
function AddRepoModal({ projectId, onClose, onCreated, }) {
    const [form, setForm] = useState(emptyRepoForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const setField = (field, value) => {
        setForm((f) => {
            const updated = { ...f, [field]: value };
            if (field === 'name' && f.slug === slugify(f.name)) {
                updated.slug = slugify(value);
            }
            return updated;
        });
    };
    const handleSubmit = async (e) => {
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
            onCreated(repo);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create repo');
        }
        setSaving(false);
    };
    const inputCls = 'w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-text placeholder:text-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors';
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center", children: [_jsx("div", { className: "absolute inset-0 bg-black/40", onClick: onClose }), _jsxs("form", { onSubmit: handleSubmit, className: "relative bg-card rounded-[var(--radius-lg)] shadow-lg border border-[var(--color-border-light)] w-full max-w-lg p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-base font-semibold text-text", children: "Add Repository" }), _jsx("button", { type: "button", onClick: onClose, className: "text-muted hover:text-text transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), error && (_jsx("div", { className: "px-3 py-2 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-error text-xs", children: error })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("label", { className: "space-y-1", children: [_jsx("span", { className: "text-xs font-medium text-muted", children: "Name" }), _jsx("input", { required: true, value: form.name, onChange: (e) => setField('name', e.target.value), placeholder: "backend-device", className: inputCls })] }), _jsxs("label", { className: "space-y-1", children: [_jsx("span", { className: "text-xs font-medium text-muted", children: "Slug" }), _jsx("input", { required: true, value: form.slug, onChange: (e) => setField('slug', e.target.value), placeholder: "backend-device", className: inputCls })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("label", { className: "space-y-1", children: [_jsx("span", { className: "text-xs font-medium text-muted", children: "Provider" }), _jsx("select", { value: form.provider, onChange: (e) => setField('provider', e.target.value), className: inputCls, children: PROVIDERS.map((p) => (_jsx("option", { value: p, children: p }, p))) })] }), _jsxs("label", { className: "space-y-1", children: [_jsx("span", { className: "text-xs font-medium text-muted", children: "Default Branch" }), _jsx("input", { value: form.defaultBranch, onChange: (e) => setField('defaultBranch', e.target.value), placeholder: "main", className: inputCls })] })] }), _jsxs("label", { className: "block space-y-1", children: [_jsx("span", { className: "text-xs font-medium text-muted", children: form.provider === 'local' ? 'Local Path' : 'Clone URL' }), _jsx("input", { required: true, value: form.cloneUrl, onChange: (e) => setField('cloneUrl', e.target.value), placeholder: form.provider === 'local' ? '/home/user/projects/my-repo' : 'https://bitbucket.org/org/repo.git', className: inputCls }), form.provider === 'local' && (_jsx("p", { className: "text-[10px] text-[var(--color-text-light)]", children: "Absolute path to the local git repository" }))] }), _jsxs("label", { className: "block space-y-1", children: [_jsxs("span", { className: "text-xs font-medium text-muted", children: ["Tech Stack ", _jsx("span", { className: "font-normal text-[var(--color-text-light)]", children: "(comma-separated)" })] }), _jsx("input", { value: form.techStack, onChange: (e) => setField('techStack', e.target.value), placeholder: "typescript, react, postgresql", className: inputCls })] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: saving, className: cn('inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-colors', saving
                                    ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                                    : 'bg-accent text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)]'), children: [saving && _jsx(Loader2, { className: "w-4 h-4 animate-spin" }), saving ? 'Adding...' : 'Add Repo'] })] })] })] }));
}
function ScanProgressBar({ status, label }) {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (status === 'completed' || status === 'failed') {
            setProgress(100);
            return;
        }
        // Animate progress: fast at start, slow near end (asymptotic to 90%)
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90)
                    return prev + 0.1;
                return prev + (90 - prev) * 0.05;
            });
        }, 200);
        return () => clearInterval(interval);
    }, [status]);
    const barColor = status === 'failed'
        ? 'bg-error'
        : status === 'completed'
            ? 'bg-success'
            : 'bg-accent';
    return (_jsxs("div", { className: "mt-2 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-muted", children: label }), _jsxs("span", { className: "text-muted font-mono", children: [Math.round(progress), "%"] })] }), _jsx("div", { className: "h-1.5 rounded-full bg-[var(--color-hover)] overflow-hidden", children: _jsx("div", { className: cn('h-full rounded-full transition-all duration-300 ease-out', barColor), style: { width: `${progress}%` } }) })] }));
}
export function Project() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [repos, setRepos] = useState([]);
    const [scans, setScans] = useState([]);
    const [events, setEvents] = useState([]);
    const [scanning, setScanning] = useState({});
    const [scanningAll, setScanningAll] = useState(false);
    const [showAddRepo, setShowAddRepo] = useState(false);
    useEffect(() => {
        if (!id)
            return;
        api.getProject(id).then(setProject).catch(console.error);
        api.getRepos(id).then(setRepos).catch(console.error);
        api.getScanStatus(id).then(setScans).catch(console.error);
        api.getEvents({ projectId: id, limit: 8 }).then(setEvents).catch(console.error);
    }, [id]);
    // Poll active scan jobs
    useEffect(() => {
        const activeJobs = Object.entries(scanning).filter(([, s]) => s.status === 'queued' || s.status === 'running');
        if (activeJobs.length === 0)
            return;
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
                }
                catch {
                    // ignore poll errors
                }
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [scanning, id]);
    // Auto-clear completed scans after 3s
    useEffect(() => {
        const done = Object.entries(scanning).filter(([, s]) => s.status === 'completed' || s.status === 'failed');
        if (done.length === 0)
            return;
        const timeout = setTimeout(() => {
            setScanning((prev) => {
                const next = { ...prev };
                for (const [repoId] of done)
                    delete next[repoId];
                return next;
            });
        }, 3000);
        return () => clearTimeout(timeout);
    }, [scanning]);
    // Periodic repo refresh while scans are active
    useEffect(() => {
        if (!id)
            return;
        const hasActiveScans = Object.values(scanning).some((s) => s.status === 'queued' || s.status === 'running');
        if (!hasActiveScans)
            return;
        const interval = setInterval(() => {
            api.getRepos(id).then(setRepos).catch(console.error);
        }, 10_000);
        return () => clearInterval(interval);
    }, [id, scanning]);
    const handleScanRepo = async (repoId) => {
        if (!id)
            return;
        const repo = repos.find((r) => r.id === repoId);
        try {
            const { jobId } = await api.triggerScan({ projectId: id, repoId, branch: repo?.defaultBranch });
            setScanning((prev) => ({ ...prev, [repoId]: { jobId, status: 'queued' } }));
        }
        catch (err) {
            console.error('Scan failed:', err);
        }
    };
    const handleScanAll = async () => {
        if (!id)
            return;
        setScanningAll(true);
        try {
            const results = await Promise.all(repos.map(async (r) => {
                const { jobId } = await api.triggerScan({ projectId: id, repoId: r.id, branch: r.defaultBranch });
                return [r.id, { jobId, status: 'queued' }];
            }));
            setScanning((prev) => ({ ...prev, ...Object.fromEntries(results) }));
        }
        catch (err) {
            console.error('Scan all failed:', err);
        }
        setScanningAll(false);
    };
    if (!project) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsxs("div", { className: "flex items-center gap-3 text-muted", children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), _jsx("span", { className: "text-sm", children: "Loading project..." })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back to Overview"] }), _jsx("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] p-6", children: _jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-[var(--radius-lg)] bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] flex items-center justify-center flex-shrink-0", children: _jsx(FolderKanban, { className: "w-6 h-6 text-accent" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-text", children: project.name }), project.description && (_jsx("p", { className: "text-sm text-muted mt-1", children: project.description })), _jsxs("div", { className: "flex items-center gap-4 mt-2 text-xs text-muted", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3.5 h-3.5" }), "Created ", formatDate(project.createdAt)] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(GitMerge, { className: "w-3.5 h-3.5" }), repos.length, " ", repos.length === 1 ? 'repo' : 'repos'] })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setShowAddRepo(true), className: "inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Repo"] }), _jsxs("button", { onClick: handleScanAll, disabled: scanningAll || repos.length === 0, className: cn('inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors', scanningAll || repos.length === 0
                                        ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                                        : 'bg-accent text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-sm)]'), children: [scanningAll ? _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) : _jsx(ScanSearch, { className: "w-4 h-4" }), scanningAll ? 'Scanning...' : 'Scan All Repos'] }), _jsxs(Link, { to: `/graph/${id}`, className: "inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors", children: [_jsx(Network, { className: "w-4 h-4" }), "View Graph"] })] })] }) }), _jsx(ProjectLinksPanel, { projectId: id }), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between", children: [_jsx("h2", { className: "text-sm font-semibold text-text", children: "Repositories" }), _jsxs("span", { className: "text-xs text-muted", children: [repos.length, " repos"] })] }), repos.length === 0 ? (_jsx("div", { className: "px-6 py-10 text-center text-sm text-muted", children: "No repositories found" })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-4", children: repos.map((repo) => (_jsxs("div", { className: "rounded-[var(--radius-md)] border border-[var(--color-border-light)] p-4 hover:border-accent/30 hover:shadow-[var(--shadow-sm)] transition-all", children: [_jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-text truncate", children: repo.name }), _jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [_jsx(ProviderBadge, { provider: repo.provider }), _jsx(BranchSelector, { repo: repo, onBranchChanged: (repoId, branch) => setRepos((prev) => prev.map((r) => r.id === repoId ? { ...r, defaultBranch: branch } : r)) })] })] }), _jsx("button", { onClick: () => handleScanRepo(repo.id), disabled: !!scanning[repo.id], className: cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-semibold transition-colors flex-shrink-0', scanning[repo.id]
                                                ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                                                : 'bg-accent text-white hover:bg-[var(--color-accent-hover)]'), children: scanning[repo.id]
                                                ? _jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-3 h-3 animate-spin" }), "Scanning"] })
                                                : _jsxs(_Fragment, { children: [_jsx(ScanSearch, { className: "w-3 h-3" }), "Scan"] }) })] }), repo.techStack.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mb-3", children: repo.techStack.map((tech) => (_jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-[var(--color-hover)] text-muted font-medium", children: [_jsx(Tag, { className: "w-2.5 h-2.5" }), tech] }, tech))) })), _jsx("div", { className: "flex items-center gap-3 text-xs", children: repo.lastScannedAt ? (_jsxs(_Fragment, { children: [_jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-success font-medium", children: [_jsx(Check, { className: "w-3 h-3" }), "Scanned"] }), _jsxs("span", { className: "flex items-center gap-1 text-muted", children: [_jsx(Clock, { className: "w-3 h-3" }), timeAgo(repo.lastScannedAt)] }), repo.lastScannedCommit && (_jsxs("span", { className: "flex items-center gap-1 font-mono text-muted", children: [_jsx(Hash, { className: "w-3 h-3" }), repo.lastScannedCommit.slice(0, 7)] }))] })) : !scanning[repo.id] ? (_jsx("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--color-hover)] text-muted font-medium", children: "Never scanned" })) : null }), scanning[repo.id] && (_jsx(ScanProgressBar, { status: scanning[repo.id].status, label: scanning[repo.id].status === 'queued' ? 'Queued...' : scanning[repo.id].status === 'running' ? 'Scanning...' : scanning[repo.id].status === 'completed' ? 'Done' : 'Failed' }))] }, repo.id))) }))] }), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between", children: [_jsx("h2", { className: "text-sm font-semibold text-text", children: "Scan History" }), _jsxs("span", { className: "text-xs text-muted", children: [scans.length, " scans"] })] }), scans.length === 0 ? (_jsx("div", { className: "px-6 py-10 text-center text-sm text-muted", children: "No scans yet" })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-xs", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-[var(--color-border-light)] bg-[var(--color-bg)]", children: ['Date', 'Repo', 'Branch', 'Mode', 'Duration', 'Status'].map((h) => (_jsx("th", { className: "px-5 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide", children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-[var(--color-border-light)]", children: scans.slice(0, 10).map((scan) => {
                                        const scanRepo = repos.find((r) => r.id === scan.repoId);
                                        return (_jsxs("tr", { className: "hover:bg-[var(--color-hover)] transition-colors", children: [_jsx("td", { className: "px-5 py-3 text-muted whitespace-nowrap", children: new Date(scan.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                                                    }) }), _jsx("td", { className: "px-5 py-3 font-medium text-text whitespace-nowrap", children: scanRepo?.name ?? '—' }), _jsx("td", { className: "px-5 py-3 font-mono text-text whitespace-nowrap", children: scan.branch }), _jsx("td", { className: "px-5 py-3", children: _jsx("span", { className: "px-2 py-0.5 rounded bg-[var(--color-hover)] text-muted font-medium", children: scan.mode }) }), _jsx("td", { className: "px-5 py-3 text-muted whitespace-nowrap", children: formatDuration(scan.startedAt, scan.completedAt) }), _jsx("td", { className: "px-5 py-3", children: _jsx(ScanStatusBadge, { status: scan.status === 'failed' && scan.error?.includes('Superseded') ? 'superseded' : scan.status }) })] }, scan.id));
                                    }) })] }) }))] }), showAddRepo && id && (_jsx(AddRepoModal, { projectId: id, onClose: () => setShowAddRepo(false), onCreated: (repo) => {
                    setRepos((prev) => [...prev, repo]);
                    setShowAddRepo(false);
                } })), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between", children: [_jsx("h2", { className: "text-sm font-semibold text-text", children: "Recent Events" }), _jsxs("span", { className: "text-xs text-muted", children: [events.length, " shown"] })] }), events.length === 0 ? (_jsx("div", { className: "px-6 py-10 text-center text-sm text-muted", children: "No events yet" })) : (_jsx("div", { className: "p-4", children: _jsxs("div", { className: "relative pl-6", children: [_jsx("div", { className: "absolute left-[11px] top-2 bottom-2 w-px bg-[var(--color-border-light)]" }), _jsx("div", { className: "space-y-3", children: events.map((event) => (_jsxs("div", { className: "relative flex items-start gap-3", children: [_jsx("div", { className: "absolute -left-6 w-5 h-5 rounded-full bg-[var(--color-hover)] border-2 border-[var(--color-border-light)] flex items-center justify-center flex-shrink-0 mt-0.5", children: _jsx(EventIcon, { type: event.type }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: "text-xs font-medium text-text", children: event.type }), _jsxs("span", { className: "text-xs text-muted flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), timeAgo(event.createdAt)] })] }), typeof event.payload?.message === 'string' && (_jsx("p", { className: "text-xs text-muted mt-0.5", children: event.payload.message }))] })] }, event.id))) })] }) }))] })] }));
}
