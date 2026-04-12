import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, ChevronRight, ChevronLeft, GitBranch, FolderKanban, Check, AlertCircle, Loader2, Lock, Key, ShieldCheck, ShieldAlert, Eye, EyeOff, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
// ---------------------------------------------------------------------------
// URL parsing helper
// ---------------------------------------------------------------------------
function parseGitUrl(url) {
    const sshMatch = url.match(/git@([^:]+):([^/]+)\/([^.]+)(\.git)?$/);
    const httpsMatch = url.match(/https?:\/\/([^/]+)\/([^/]+)\/([^/.]+)(\.git)?$/);
    const match = sshMatch || httpsMatch;
    if (!match)
        return null;
    const host = match[1];
    const name = match[3];
    const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const provider = host.includes('github')
        ? 'github'
        : host.includes('bitbucket')
            ? 'bitbucket'
            : host.includes('gitlab')
                ? 'gitlab'
                : 'github';
    return { name, slug, provider };
}
function detectProtocol(url) {
    if (!url.trim())
        return 'unknown';
    if (url.startsWith('/') || url.startsWith('~'))
        return 'local';
    if (/^git@|^ssh:\/\//.test(url))
        return 'ssh';
    if (/^https?:\/\//.test(url))
        return 'https';
    return 'unknown';
}
function protocolLabel(protocol) {
    switch (protocol) {
        case 'ssh': return 'SSH';
        case 'https': return 'HTTPS';
        case 'local': return 'Local';
        default: return '';
    }
}
function emptyCredentials() {
    return { saved: false, saving: false, error: null, sshKeyPath: '~/.ssh/id_ed25519', token: '' };
}
function emptyRepo() {
    return {
        id: crypto.randomUUID(),
        cloneUrl: '',
        name: '',
        slug: '',
        provider: 'github',
        techStack: '',
        defaultBranch: 'main',
        credentials: emptyCredentials(),
        branches: [],
    };
}
// ---------------------------------------------------------------------------
// Step indicator
// ---------------------------------------------------------------------------
const STEPS = ['Project Info', 'Repositories', 'Review & Create'];
function StepIndicator({ current }) {
    return (_jsx("div", { className: "flex items-center justify-center gap-0 mb-8", children: STEPS.map((label, i) => {
            const done = i < current;
            const active = i === current;
            return (_jsxs("div", { className: "flex items-center", children: [_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors', done
                                    ? 'bg-accent border-accent text-white'
                                    : active
                                        ? 'border-accent text-accent bg-accent/10'
                                        : 'border-[var(--color-border)] text-muted bg-card'), children: done ? _jsx(Check, { className: "w-4 h-4" }) : i + 1 }), _jsx("span", { className: cn('mt-1.5 text-xs font-medium whitespace-nowrap', active ? 'text-accent' : done ? 'text-text' : 'text-muted'), children: label })] }), i < STEPS.length - 1 && (_jsx("div", { className: cn('w-16 h-0.5 mx-1 mb-5 transition-colors', done ? 'bg-accent' : 'bg-[var(--color-border)]') }))] }, i));
        }) }));
}
// ---------------------------------------------------------------------------
// Input / Textarea shared classes
// ---------------------------------------------------------------------------
const inputCls = 'w-full border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-text bg-card placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors';
// ---------------------------------------------------------------------------
// Step 1 – Project Info
// ---------------------------------------------------------------------------
function StepProjectInfo({ name, description, context, onName, onDescription, onContext, }) {
    return (_jsx("div", { className: "space-y-5", children: _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] p-6 space-y-5", children: [_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("div", { className: "w-9 h-9 rounded-[var(--radius-md)] bg-accent/10 flex items-center justify-center flex-shrink-0", children: _jsx(FolderKanban, { className: "w-4 h-4 text-accent" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-sm font-semibold text-text", children: "Project Details" }), _jsx("p", { className: "text-xs text-muted", children: "Basic information about your project" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-text mb-1.5", children: ["Project Name ", _jsx("span", { className: "text-error", children: "*" })] }), _jsx("input", { type: "text", value: name, onChange: (e) => onName(e.target.value), placeholder: "e.g. Cortex Platform", className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-text mb-1.5", children: "Description" }), _jsx("textarea", { rows: 3, value: description, onChange: (e) => onDescription(e.target.value), placeholder: "A short description of what this project does\u2026", className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-text mb-1.5", children: "Context / Notes" }), _jsx("p", { className: "text-xs text-muted mb-2", children: "Describe your project's purpose, architecture, key decisions \u2014 this helps Cortex understand where to place this project in the knowledge graph before scanning." }), _jsx("textarea", { rows: 5, value: context, onChange: (e) => onContext(e.target.value), placeholder: "e.g. This is a monorepo using Turborepo. The API is built with Fastify and talks to a PostgreSQL database via Drizzle ORM. Key decision: we use event sourcing for the scan pipeline\u2026", className: inputCls })] })] }) }));
}
// ---------------------------------------------------------------------------
// Credentials section per repo
// ---------------------------------------------------------------------------
/** Keys that match a given protocol+provider for filtering existing credentials */
function matchingCredKeys(protocol, provider) {
    if (protocol === 'ssh')
        return ['SSH_KEY_PATH', 'SSH_PRIVATE_KEY'];
    if (provider === 'github')
        return ['GITHUB_TOKEN', 'GITHUB_PAT'];
    if (provider === 'gitlab')
        return ['GITLAB_TOKEN', 'GITLAB_PAT'];
    if (provider === 'bitbucket')
        return ['BITBUCKET_APP_PASSWORD', 'BITBUCKET_API_TOKEN', 'BITBUCKET_TOKEN'];
    return [`${provider.toUpperCase()}_TOKEN`];
}
function RepoCredentialsSection({ cloneUrl, provider, credentials, onChange, onBranchesLoaded, }) {
    const [showValue, setShowValue] = useState(false);
    const [testStatus, setTestStatus] = useState('idle');
    const [testError, setTestError] = useState(null);
    const [existingCreds, setExistingCreds] = useState([]);
    const [sshKeys, setSshKeys] = useState([]);
    const [mode, setMode] = useState('select');
    const protocol = provider === 'local' ? 'local' : detectProtocol(cloneUrl);
    const effectiveProtocol = provider === 'local' ? 'local' : (protocol === 'unknown' ? 'https' : protocol);
    // Load existing credentials + SSH keys
    useEffect(() => {
        if (provider === 'local')
            return;
        const ep = protocol === 'unknown' ? 'https' : protocol;
        api.listCredentials(true).then((all) => {
            const keys = matchingCredKeys(ep, provider);
            const matching = all.filter((c) => keys.some((k) => c.key.startsWith(k) || c.key === k));
            setExistingCreds(matching);
            if (matching.length === 0 && ep !== 'ssh')
                setMode('new');
        }).catch(() => setMode('new'));
        if (ep === 'ssh') {
            api.listSshKeys().then((keys) => {
                setSshKeys(keys.filter((k) => k.type === 'private'));
                if (keys.filter((k) => k.type === 'private').length > 0)
                    setMode('select');
            }).catch(() => { });
        }
    }, [provider, protocol]);
    if (effectiveProtocol === 'local')
        return null;
    const handleSave = async () => {
        onChange({ ...credentials, saving: true, error: null });
        try {
            if (effectiveProtocol === 'ssh') {
                await api.addCredential({
                    label: `SSH Key — ${cloneUrl.split('/').pop()?.replace('.git', '') || 'repo'}`,
                    provider,
                    key: 'SSH_KEY_PATH',
                    value: credentials.sshKeyPath.trim(),
                });
            }
            else {
                if (!credentials.token.trim()) {
                    onChange({ ...credentials, saving: false, error: 'Token is required' });
                    return;
                }
                const keyName = provider === 'github'
                    ? 'GITHUB_TOKEN'
                    : provider === 'gitlab'
                        ? 'GITLAB_TOKEN'
                        : provider === 'bitbucket'
                            ? 'BITBUCKET_APP_PASSWORD'
                            : `${provider.toUpperCase()}_TOKEN`;
                await api.addCredential({
                    label: `${provider} Access Token`,
                    provider,
                    key: keyName,
                    value: credentials.token.trim(),
                });
            }
            onChange({ ...credentials, saving: false, saved: true, error: null });
            // Refresh existing creds list
            const ep = protocol === 'unknown' ? 'https' : protocol;
            api.listCredentials(true).then((all) => {
                const keys = matchingCredKeys(ep, provider);
                setExistingCreds(all.filter((c) => keys.some((k) => c.key.startsWith(k) || c.key === k)));
            }).catch(() => { });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to save credential';
            if (msg.includes('already exists')) {
                onChange({ ...credentials, saving: false, saved: true, error: null });
            }
            else {
                onChange({ ...credentials, saving: false, error: msg });
            }
        }
    };
    const handleSelectExisting = (credId) => {
        const cred = existingCreds.find((c) => c.id === credId);
        if (!cred)
            return;
        if (effectiveProtocol === 'ssh') {
            onChange({ ...credentials, sshKeyPath: cred.value, saved: true, error: null });
        }
        else {
            onChange({ ...credentials, token: cred.value, saved: true, error: null });
        }
    };
    const handleTestConnection = async () => {
        setTestStatus('testing');
        setTestError(null);
        try {
            const res = await api.testRepoConnection(cloneUrl, provider);
            if (res.ok) {
                setTestStatus('ok');
                if (res.branches && res.branches.length > 0) {
                    onBranchesLoaded(res.branches, res.defaultBranch ?? 'main');
                }
                setTimeout(() => setTestStatus('idle'), 4000);
            }
            else {
                setTestStatus('error');
                setTestError(res.error ?? 'Connection failed');
            }
        }
        catch (err) {
            setTestStatus('error');
            setTestError(err instanceof Error ? err.message : 'Connection failed');
        }
    };
    const tokenLabel = provider === 'bitbucket' ? 'App Password' : 'Personal Access Token';
    const tokenPlaceholder = provider === 'github' ? 'ghp_xxxxxxxxxxxxxxxxxxxx'
        : provider === 'gitlab' ? 'glpat-xxxxxxxxxxxxxxxxxxxx'
            : provider === 'bitbucket' ? 'ATBBxxxxxxxxxxxxxxxxxxxx'
                : 'token';
    const tokenHint = provider === 'github' ? 'A GitHub Personal Access Token (classic or fine-grained) with repo read access.'
        : provider === 'gitlab' ? 'A GitLab Personal Access Token with read_repository scope.'
            : provider === 'bitbucket' ? 'A Bitbucket App Password with repository read permission.'
                : 'An access token with repository read access.';
    return (_jsxs("div", { className: "rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg)] p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Lock, { className: "w-3.5 h-3.5 text-muted" }), _jsx("span", { className: "text-xs font-semibold text-text", children: "Authentication" }), _jsx("span", { className: cn('text-[10px] font-mono px-1.5 py-0.5 rounded', effectiveProtocol === 'ssh' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'), children: protocolLabel(effectiveProtocol) })] }), credentials.saved && (_jsxs("span", { className: "inline-flex items-center gap-1 text-[10px] font-medium text-success", children: [_jsx(ShieldCheck, { className: "w-3 h-3" }), "Credential selected"] }))] }), effectiveProtocol !== 'ssh' && existingCreds.length > 0 && (_jsxs("div", { className: "flex items-center bg-[var(--color-hover)] rounded-full p-0.5 w-fit", children: [_jsx("button", { type: "button", onClick: () => setMode('select'), className: cn('px-3 py-1 rounded-full text-[11px] font-medium transition-colors', mode === 'select' ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text'), children: "Use existing" }), _jsx("button", { type: "button", onClick: () => setMode('new'), className: cn('px-3 py-1 rounded-full text-[11px] font-medium transition-colors', mode === 'new' ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text'), children: "Add new" })] })), mode === 'select' && effectiveProtocol !== 'ssh' && existingCreds.length > 0 && (_jsx("div", { className: "space-y-2", children: existingCreds.map((cred) => {
                    const isSelected = credentials.saved && credentials.token === cred.value;
                    return (_jsxs("button", { type: "button", onClick: () => handleSelectExisting(cred.id), className: cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] border text-left transition-colors', isSelected
                            ? 'border-success/40 bg-success/5'
                            : 'border-[var(--color-border-light)] hover:border-accent/30 hover:bg-[var(--color-hover)]'), children: [_jsx("div", { className: cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0', isSelected ? 'bg-success/15' : 'bg-[var(--color-hover)]'), children: isSelected ? _jsx(Check, { className: "w-3.5 h-3.5 text-success" }) : _jsx(Key, { className: "w-3.5 h-3.5 text-muted" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-medium text-text truncate", children: cred.label }), _jsx("p", { className: "text-[10px] text-muted font-mono", children: cred.key })] }), isSelected && (_jsx("span", { className: "text-[10px] font-medium text-success flex-shrink-0", children: "Selected" }))] }, cred.id));
                }) })), effectiveProtocol === 'ssh' && (mode === 'select' || mode === 'new') && (_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-text mb-1.5", children: [_jsx(Key, { className: "w-3 h-3 inline mr-1" }), "SSH Private Key"] }), (sshKeys.length > 0 || existingCreds.length > 0) ? (_jsxs(_Fragment, { children: [_jsxs("select", { value: credentials.sshKeyPath, onChange: (e) => {
                                    const val = e.target.value;
                                    if (val === '__custom__') {
                                        onChange({ ...credentials, sshKeyPath: '', saved: false });
                                        setMode('new');
                                    }
                                    else {
                                        onChange({ ...credentials, sshKeyPath: val, saved: true });
                                    }
                                }, className: cn(inputCls, 'font-mono text-xs'), children: [_jsx("option", { value: "", disabled: true, children: "Select an SSH key\u2026" }), sshKeys.length > 0 && (_jsx("optgroup", { label: "~/.ssh", children: sshKeys.map((k) => (_jsx("option", { value: k.path, children: k.path }, k.path))) })), existingCreds.length > 0 && (_jsx("optgroup", { label: "Saved credentials", children: existingCreds.map((c) => (_jsxs("option", { value: c.value, children: [c.label, " (", c.value, ")"] }, c.id))) })), _jsx("optgroup", { label: "Other", children: _jsx("option", { value: "__custom__", children: "Enter custom path\u2026" }) })] }), credentials.sshKeyPath && credentials.sshKeyPath !== '__custom__' && (_jsxs("p", { className: "text-[10px] text-success mt-1 flex items-center gap-1", children: [_jsx(Check, { className: "w-3 h-3" }), "Key selected: ", credentials.sshKeyPath] }))] })) : (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: credentials.sshKeyPath, onChange: (e) => onChange({ ...credentials, sshKeyPath: e.target.value, saved: false }), placeholder: "~/.ssh/id_ed25519", className: cn(inputCls, 'font-mono text-xs flex-1') }), _jsxs("button", { type: "button", onClick: handleSave, disabled: credentials.saving || credentials.saved, className: cn('px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors flex-shrink-0 inline-flex items-center gap-1.5', credentials.saved
                                    ? 'bg-success/10 text-success border border-success/20'
                                    : credentials.saving
                                        ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                                        : 'bg-accent text-white hover:bg-accent/90'), children: [credentials.saving ? _jsx(Loader2, { className: "w-3 h-3 animate-spin" }) : credentials.saved ? _jsx(Check, { className: "w-3 h-3" }) : _jsx(ShieldCheck, { className: "w-3 h-3" }), credentials.saving ? 'Saving...' : credentials.saved ? 'Saved' : 'Save'] })] })), _jsx("p", { className: "text-[10px] text-muted mt-1", children: "Private key used to authenticate with this repository." })] })), mode === 'new' && effectiveProtocol !== 'ssh' && (_jsxs("div", { children: [_jsxs("label", { className: "block text-xs font-medium text-text mb-1.5", children: [_jsx(Key, { className: "w-3 h-3 inline mr-1" }), tokenLabel] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx("input", { type: showValue ? 'text' : 'password', value: credentials.token, onChange: (e) => onChange({ ...credentials, token: e.target.value, saved: false }), placeholder: tokenPlaceholder, className: cn(inputCls, 'font-mono text-xs pr-9') }), _jsx("button", { type: "button", onClick: () => setShowValue(!showValue), className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors", children: showValue ? _jsx(EyeOff, { className: "w-3.5 h-3.5" }) : _jsx(Eye, { className: "w-3.5 h-3.5" }) })] }), _jsxs("button", { type: "button", onClick: handleSave, disabled: credentials.saving || credentials.saved || !credentials.token.trim(), className: cn('px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors flex-shrink-0 inline-flex items-center gap-1.5', credentials.saved
                                    ? 'bg-success/10 text-success border border-success/20'
                                    : credentials.saving || !credentials.token.trim()
                                        ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                                        : 'bg-accent text-white hover:bg-accent/90'), children: [credentials.saving ? _jsx(Loader2, { className: "w-3 h-3 animate-spin" }) : credentials.saved ? _jsx(Check, { className: "w-3 h-3" }) : _jsx(ShieldCheck, { className: "w-3 h-3" }), credentials.saving ? 'Saving...' : credentials.saved ? 'Saved' : 'Save'] })] }), _jsx("p", { className: "text-[10px] text-muted mt-1", children: tokenHint })] })), credentials.error && (_jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-error", children: [_jsx(ShieldAlert, { className: "w-3 h-3 flex-shrink-0" }), credentials.error] })), _jsxs("div", { className: "flex items-center gap-2 pt-1 border-t border-[var(--color-border-light)]", children: [_jsxs("button", { type: "button", onClick: handleTestConnection, disabled: testStatus === 'testing' || !cloneUrl.trim(), className: cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-colors', testStatus === 'ok'
                            ? 'bg-success/10 text-success border border-success/20'
                            : testStatus === 'error'
                                ? 'bg-error/10 text-error border border-error/20'
                                : testStatus === 'testing'
                                    ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                                    : 'border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)]'), children: [testStatus === 'testing' ? (_jsx(Loader2, { className: "w-3 h-3 animate-spin" })) : testStatus === 'ok' ? (_jsx(ShieldCheck, { className: "w-3 h-3" })) : testStatus === 'error' ? (_jsx(ShieldAlert, { className: "w-3 h-3" })) : (_jsx(Lock, { className: "w-3 h-3" })), testStatus === 'testing' ? 'Testing...' : testStatus === 'ok' ? 'Connected!' : testStatus === 'error' ? 'Failed' : 'Test Connection'] }), testStatus === 'ok' && (_jsx("span", { className: "text-[10px] text-success", children: "Repository accessible" })), testError && (_jsx("span", { className: "text-[10px] text-error", children: testError }))] })] }));
}
// ---------------------------------------------------------------------------
// Repo row
// ---------------------------------------------------------------------------
function RepoRow({ repo, index, onChange, onRemove, canRemove, }) {
    function handleUrlChange(url) {
        const parsed = parseGitUrl(url);
        onChange({
            ...repo,
            cloneUrl: url,
            ...(parsed
                ? { name: parsed.name, slug: parsed.slug, provider: parsed.provider }
                : {}),
        });
    }
    const providerColors = {
        github: 'text-text',
        gitlab: 'text-warning',
        bitbucket: 'text-info',
    };
    return (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0", children: _jsx(GitBranch, { className: "w-3.5 h-3.5 text-accent" }) }), _jsxs("span", { className: "text-xs font-semibold text-text", children: ["Repository ", index + 1] }), repo.provider && (_jsx("span", { className: cn('text-xs font-mono px-1.5 py-0.5 rounded bg-[var(--color-hover)]', providerColors[repo.provider] ?? 'text-muted'), children: repo.provider }))] }), canRemove && (_jsx("button", { type: "button", onClick: onRemove, className: "w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors", "aria-label": "Remove repository", children: _jsx(X, { className: "w-3.5 h-3.5" }) }))] }), _jsxs("div", { className: "grid grid-cols-[140px_1fr] gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-text mb-1.5", children: "Provider" }), _jsxs("select", { value: repo.provider, onChange: (e) => onChange({ ...repo, provider: e.target.value }), className: inputCls, children: [_jsx("option", { value: "bitbucket", children: "bitbucket" }), _jsx("option", { value: "github", children: "github" }), _jsx("option", { value: "gitlab", children: "gitlab" }), _jsx("option", { value: "local", children: "local" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-text mb-1.5", children: repo.provider === 'local' ? 'Local Path' : 'Clone URL' }), _jsx("input", { type: "text", value: repo.cloneUrl, onChange: (e) => repo.provider === 'local' ? onChange({ ...repo, cloneUrl: e.target.value }) : handleUrlChange(e.target.value), placeholder: repo.provider === 'local' ? '/home/user/projects/my-repo' : 'git@github.com:org/repo.git or https://github.com/org/repo.git', className: inputCls }), repo.provider === 'local' && (_jsx("p", { className: "text-[10px] text-muted mt-0.5", children: "Absolute path to the local git repository" }))] })] }), _jsx(RepoCredentialsSection, { cloneUrl: repo.cloneUrl, provider: repo.provider, credentials: repo.credentials, onChange: (creds) => onChange({ ...repo, credentials: creds }), onBranchesLoaded: (branches, defaultBranch) => onChange({ ...repo, branches, defaultBranch }) }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-text mb-1.5", children: "Name" }), _jsx("input", { type: "text", value: repo.name, onChange: (e) => onChange({
                                    ...repo,
                                    name: e.target.value,
                                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
                                }), placeholder: "my-repo", className: inputCls })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-text mb-1.5", children: "Slug" }), _jsx("input", { type: "text", value: repo.slug, onChange: (e) => onChange({ ...repo, slug: e.target.value }), placeholder: "my-repo", className: cn(inputCls, 'font-mono text-xs') })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-text mb-1.5", children: "Tech Stack" }), _jsx("input", { type: "text", value: repo.techStack, onChange: (e) => onChange({ ...repo, techStack: e.target.value }), placeholder: "typescript, react, node", className: inputCls }), _jsx("p", { className: "text-xs text-muted mt-1", children: "Comma-separated tags" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-text mb-1.5", children: "Default Branch" }), repo.branches.length > 0 ? (_jsx("select", { value: repo.defaultBranch, onChange: (e) => onChange({ ...repo, defaultBranch: e.target.value }), className: cn(inputCls, 'font-mono text-xs'), children: repo.branches.map((b) => (_jsx("option", { value: b, children: b }, b))) })) : (_jsx("input", { type: "text", value: repo.defaultBranch, onChange: (e) => onChange({ ...repo, defaultBranch: e.target.value }), placeholder: "main", className: cn(inputCls, 'font-mono text-xs') })), repo.branches.length > 0 && (_jsxs("p", { className: "text-[10px] text-success mt-1", children: [repo.branches.length, " branches found"] }))] })] })] }));
}
// ---------------------------------------------------------------------------
// Step 2 – Repositories
// ---------------------------------------------------------------------------
function StepRepos({ repos, onChange, }) {
    function updateRepo(id, updated) {
        onChange(repos.map((r) => (r.id === id ? updated : r)));
    }
    function removeRepo(id) {
        onChange(repos.filter((r) => r.id !== id));
    }
    function addRepo() {
        onChange([...repos, emptyRepo()]);
    }
    return (_jsxs("div", { className: "space-y-4", children: [repos.map((repo, i) => (_jsx(RepoRow, { repo: repo, index: i, onChange: (updated) => updateRepo(repo.id, updated), onRemove: () => removeRepo(repo.id), canRemove: repos.length > 1 }, repo.id))), _jsxs("button", { type: "button", onClick: addRepo, className: "w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] text-muted hover:border-accent hover:text-accent transition-colors text-sm font-medium", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add another repo"] })] }));
}
// ---------------------------------------------------------------------------
// Step 3 – Review & Create
// ---------------------------------------------------------------------------
function StepReview({ name, description, context, repos, onSubmit, submitting, error, }) {
    const validRepos = repos.filter((r) => r.cloneUrl.trim() || r.name.trim());
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(FolderKanban, { className: "w-4 h-4 text-accent" }), _jsx("h2", { className: "text-sm font-semibold text-text", children: "Project" })] }), _jsx("p", { className: "text-base font-bold text-text", children: name || '—' }), description && _jsx("p", { className: "text-sm text-muted mt-1", children: description }), context && (_jsx("p", { className: "text-xs text-muted mt-3 whitespace-pre-wrap line-clamp-4 bg-[var(--color-hover)] rounded-[var(--radius-md)] px-3 py-2", children: context }))] }), validRepos.length > 0 && (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(GitBranch, { className: "w-4 h-4 text-accent" }), _jsxs("h2", { className: "text-sm font-semibold text-text", children: [validRepos.length, " Repositor", validRepos.length === 1 ? 'y' : 'ies'] })] }), _jsx("div", { className: "space-y-3", children: validRepos.map((repo, i) => (_jsxs("div", { className: "flex items-start gap-3 py-2 border-b border-[var(--color-border-light)] last:border-0", children: [_jsxs("span", { className: "text-xs font-mono text-muted w-4 pt-0.5", children: [i + 1, "."] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-sm font-semibold text-text", children: repo.name || repo.slug || '(unnamed)' }), _jsx("span", { className: "text-xs font-mono text-muted bg-[var(--color-hover)] px-1.5 py-0.5 rounded", children: repo.provider }), _jsx("span", { className: "text-xs font-mono text-muted bg-[var(--color-hover)] px-1.5 py-0.5 rounded", children: repo.defaultBranch }), detectProtocol(repo.cloneUrl) !== 'unknown' && (_jsx("span", { className: cn('text-[10px] font-mono px-1.5 py-0.5 rounded', detectProtocol(repo.cloneUrl) === 'ssh'
                                                        ? 'bg-violet-100 text-violet-700'
                                                        : 'bg-blue-100 text-blue-700'), children: protocolLabel(detectProtocol(repo.cloneUrl)) })), repo.credentials.saved && (_jsxs("span", { className: "text-[10px] text-success inline-flex items-center gap-0.5", children: [_jsx(ShieldCheck, { className: "w-3 h-3" }), " Creds"] }))] }), _jsx("p", { className: "text-xs text-muted mt-0.5 truncate font-mono", children: repo.cloneUrl }), repo.techStack && (_jsx("div", { className: "flex flex-wrap gap-1 mt-1.5", children: repo.techStack.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (_jsx("span", { className: "text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium", children: tag }, tag))) }))] })] }, repo.id))) })] })), error && (_jsxs("div", { className: "flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-error/10 border border-error/20", children: [_jsx(AlertCircle, { className: "w-4 h-4 text-error flex-shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-error", children: error })] })), _jsx("button", { type: "button", onClick: onSubmit, disabled: submitting || !name.trim(), className: cn('w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-colors', submitting || !name.trim()
                    ? 'bg-accent/40 text-white cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent/90'), children: submitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), "Creating\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4" }), "Create Project"] })) })] }));
}
// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export function NewProject() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    // Step 1 state
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [context, setContext] = useState('');
    // Step 2 state
    const [repos, setRepos] = useState([emptyRepo()]);
    // Step 3 state
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    // Validation per step
    function canNext() {
        if (step === 0)
            return name.trim().length > 0;
        return true;
    }
    function handleNext() {
        if (step < STEPS.length - 1)
            setStep((s) => s + 1);
    }
    function handleBack() {
        if (step > 0)
            setStep((s) => s - 1);
    }
    async function handleSubmit() {
        setError(null);
        setSubmitting(true);
        try {
            // Build metadata from context notes
            const metadata = {};
            if (context.trim())
                metadata.context = context.trim();
            const project = await api.createProject({
                name: name.trim(),
                description: description.trim() || undefined,
                metadata,
            });
            // Create repos
            const validRepos = repos.filter((r) => r.cloneUrl.trim() || r.name.trim());
            const repoErrors = [];
            for (const repo of validRepos) {
                try {
                    const techStackArr = repo.techStack
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean);
                    await api.createRepo({
                        projectId: project.id,
                        name: repo.name || repo.slug || 'repo',
                        slug: repo.slug || repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'repo',
                        cloneUrl: repo.cloneUrl.trim(),
                        provider: repo.provider,
                        techStack: techStackArr.length > 0 ? techStackArr : undefined,
                        defaultBranch: repo.defaultBranch || 'main',
                    });
                }
                catch (e) {
                    repoErrors.push(`Repo "${repo.name}": ${e instanceof Error ? e.message : String(e)}`);
                }
            }
            if (repoErrors.length > 0) {
                // Project created but some repos failed — still navigate, show warning
                setError(`Project created but some repos failed:\n${repoErrors.join('\n')}`);
                setSubmitting(false);
                // Navigate anyway after a short delay
                setTimeout(() => navigate(`/projects/${project.id}`), 2000);
                return;
            }
            navigate(`/projects/${project.id}`);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : String(e));
            setSubmitting(false);
        }
    }
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-text", children: "New Project" }), _jsx("p", { className: "text-sm text-muted mt-0.5", children: "Set up a new project and connect your repositories." })] }), _jsx(StepIndicator, { current: step }), step === 0 && (_jsx(StepProjectInfo, { name: name, description: description, context: context, onName: setName, onDescription: setDescription, onContext: setContext })), step === 1 && _jsx(StepRepos, { repos: repos, onChange: setRepos }), step === 2 && (_jsx(StepReview, { name: name, description: description, context: context, repos: repos, onSubmit: handleSubmit, submitting: submitting, error: error })), _jsxs("div", { className: "flex items-center justify-between pt-2", children: [_jsxs("button", { type: "button", onClick: handleBack, disabled: step === 0, className: cn('flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors', step === 0
                            ? 'text-muted cursor-not-allowed'
                            : 'text-text hover:bg-[var(--color-hover)]'), children: [_jsx(ChevronLeft, { className: "w-4 h-4" }), "Back"] }), step < STEPS.length - 1 && (_jsxs("button", { type: "button", onClick: handleNext, disabled: !canNext(), className: cn('flex items-center gap-1.5 px-5 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-colors', canNext()
                            ? 'bg-accent text-white hover:bg-accent/90'
                            : 'bg-accent/40 text-white cursor-not-allowed'), children: ["Next", _jsx(ChevronRight, { className: "w-4 h-4" })] }))] })] }));
}
