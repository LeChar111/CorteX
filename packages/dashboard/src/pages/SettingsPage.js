import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from 'react';
import { Key, Brain, Eye, EyeOff, Shield, Plus, Trash2, Sparkles, Globe, Lock, User, AlertTriangle, CheckCircle2, Database, Loader2, Download, Upload, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { CopyButton } from '../components/CopyButton.tsx';
import { SectionHeader } from '../components/SectionHeader.tsx';
/* ── Service Health Card ────────────────────────────── */
/** Maps service keys to their icon components (config is data-only). */
/* ── Credential Row ─────────────────────────────────── */
const PROVIDER_ICONS = {
    github: Globe,
    bitbucket: Globe,
    gitlab: Globe,
    anthropic: Brain,
    openai: Sparkles,
    custom: Key,
};
function CredentialRow({ cred, showSecrets, onDelete, onReveal }) {
    const [revealed, setRevealed] = useState(null);
    const Icon = PROVIDER_ICONS[cred.provider] || Key;
    const displayValue = showSecrets ? (revealed ?? cred.value) : cred.value;
    // If showSecrets toggled on and we haven't fetched, fetch
    useEffect(() => {
        if (showSecrets && !revealed) {
            onReveal(cred.id).then(setRevealed).catch(() => { });
        }
    }, [showSecrets]);
    return (_jsxs("div", { className: "group flex items-center gap-4 px-6 py-4 hover:bg-hover/50 transition-colors", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-info-light flex items-center justify-center flex-shrink-0", children: _jsx(Icon, { className: "w-4 h-4 text-info" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-text", children: cred.label }), _jsx("span", { className: "px-1.5 py-0.5 rounded text-[10px] font-medium bg-hover text-light uppercase tracking-wider", children: cred.provider })] }), _jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [_jsx("code", { className: "text-[11px] font-mono font-semibold text-accent/70", children: cred.key }), _jsx("span", { className: "text-[10px] text-light", children: "=" }), _jsx("code", { className: "text-xs font-mono text-muted truncate", children: displayValue })] })] }), _jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx(CopyButton, { text: revealed ?? cred.value }), _jsx("button", { onClick: () => onDelete(cred.id), className: "p-1.5 rounded-lg hover:bg-error-light transition-all active:scale-95", title: "Remove", children: _jsx(Trash2, { className: "w-3.5 h-3.5 text-light hover:text-error transition-colors" }) })] })] }));
}
/* ── Main Component ─────────────────────────────────── */
export function SettingsPage() {
    const [health, setHealth] = useState(null);
    const [showEnvKeys, setShowEnvKeys] = useState(false);
    const [showCredSecrets, setShowCredSecrets] = useState(false);
    // Credentials state — loaded from API
    const [credentials, setCredentials] = useState([]);
    const [credsLoading, setCredsLoading] = useState(true);
    const [credsError, setCredsError] = useState(null);
    const [showAddCred, setShowAddCred] = useState(false);
    const [newCred, setNewCred] = useState({ label: '', provider: 'bitbucket', key: '', value: '' });
    const [saving, setSaving] = useState(false);
    // Export/Import state
    const [snapshots, setSnapshots] = useState([]);
    const [exporting, setExporting] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const envVars = [
        { key: 'DATABASE_URL', value: 'postgresql://cortex:***@localhost:5432/cortex', sensitive: true, category: 'database' },
        { key: 'REDIS_URL', value: 'redis://localhost:6379', sensitive: false, category: 'cache' },
        { key: 'LIGHTRAG_URL', value: 'http://localhost:9621', sensitive: false, category: 'service' },
        { key: 'CORTEX_LLM_MODEL', value: 'haiku', sensitive: false, category: 'ai' },
        { key: 'OLLAMA_LLM_MODEL', value: 'qwen2.5:7b', sensitive: false, category: 'ai' },
        { key: 'OLLAMA_CHAT_MODEL', value: 'qwen3.5:9b', sensitive: false, category: 'ai' },
        { key: 'OLLAMA_EMBEDDING_MODEL', value: 'nomic-embed-text', sensitive: false, category: 'ai' },
        { key: 'PORT', value: '3100', sensitive: false, category: 'server' },
        { key: 'API_KEYS', value: 'dev-key-1,dev-key-2,...', sensitive: true, category: 'auth' },
    ];
    const fetchSnapshots = () => {
        api.listSnapshots().then(setSnapshots).catch(console.error);
    };
    // Load health + credentials + snapshots on mount
    useEffect(() => {
        api.health().then(setHealth).catch(console.error);
        loadCredentials();
        fetchSnapshots();
    }, []);
    const loadCredentials = async () => {
        setCredsLoading(true);
        setCredsError(null);
        try {
            const list = await api.listCredentials();
            setCredentials(list);
        }
        catch (err) {
            setCredsError(err instanceof Error ? err.message : 'Failed to load credentials');
        }
        setCredsLoading(false);
    };
    const handleRevealCredential = useCallback(async (id) => {
        const entry = await api.revealCredential(id);
        return entry.value;
    }, []);
    const addCredential = async () => {
        if (!newCred.label || !newCred.value || !newCred.key)
            return;
        setSaving(true);
        try {
            const created = await api.addCredential({
                label: newCred.label,
                provider: newCred.provider,
                key: newCred.key,
                value: newCred.value,
            });
            setCredentials((prev) => [...prev, created]);
            setNewCred({ label: '', provider: 'bitbucket', key: '', value: '' });
            setShowAddCred(false);
        }
        catch (err) {
            setCredsError(err instanceof Error ? err.message : 'Failed to add credential');
        }
        setSaving(false);
    };
    const deleteCred = async (id) => {
        try {
            await api.deleteCredential(id);
            setCredentials((prev) => prev.filter((c) => c.id !== id));
        }
        catch (err) {
            setCredsError(err instanceof Error ? err.message : 'Failed to delete credential');
        }
    };
    // Auto-generate key from label
    const setLabel = (label) => {
        const autoKey = label
            .toUpperCase()
            .replace(/[^A-Z0-9]+/g, '_')
            .replace(/^_|_$/g, '');
        setNewCred((prev) => ({
            ...prev,
            label,
            key: prev.key === autoKeyFromLabel(prev.label) ? autoKey : prev.key,
        }));
    };
    const handleExport = async () => {
        setExporting(true);
        try {
            const snapshot = await api.exportSnapshot();
            const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cortex-snapshot-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            fetchSnapshots();
        }
        catch (err) {
            console.error(err);
        }
        setExporting(false);
    };
    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setImporting(true);
        setImportResult(null);
        try {
            const text = await file.text();
            const snapshot = JSON.parse(text);
            const result = await api.importSnapshot(snapshot);
            setImportResult(result);
            fetchSnapshots();
        }
        catch (err) {
            console.error(err);
        }
        setImporting(false);
    };
    return (_jsxs("div", { className: "space-y-6 w-full", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-6xl font-bold text-text tracking-tight", children: "Settings" }), _jsx("p", { className: "text-xl text-muted mt-1", children: "System configuration, credentials, and service health" })] }), _jsx("div", { className: "flex items-center gap-2", children: health && (_jsxs("div", { className: cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium', health.status === 'ok'
                                ? 'bg-success-light text-success'
                                : 'bg-warning-light text-warning'), children: [health.status === 'ok' ? _jsx(CheckCircle2, { className: "w-4 h-4" }) : _jsx(AlertTriangle, { className: "w-4 h-4" }), "System ", health.status] })) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden", children: [_jsx(SectionHeader, { icon: Key, title: "Environment", subtitle: "System environment variables (.env)", action: _jsxs("button", { onClick: () => setShowEnvKeys(!showEnvKeys), className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-text bg-hover/50 hover:bg-hover transition-all", children: [showEnvKeys ? _jsx(EyeOff, { className: "w-3.5 h-3.5" }) : _jsx(Eye, { className: "w-3.5 h-3.5" }), showEnvKeys ? 'Hide' : 'Show', " sensitive"] }) }), _jsx("div", { className: "divide-y divide-border-light", children: envVars.map(({ key, value, sensitive, category }) => (_jsxs("div", { className: "flex items-center gap-4 px-6 py-3.5 hover:bg-hover/30 transition-colors", children: [_jsx("span", { className: cn('px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider', category === 'database' ? 'bg-info-light text-info'
                                                : category === 'ai' ? 'bg-accent-light text-accent'
                                                    : category === 'auth' ? 'bg-error-light text-error'
                                                        : 'bg-hover text-light'), children: category }), _jsx("code", { className: "text-xs font-mono font-semibold text-text min-w-[180px]", children: key }), _jsx("code", { className: "text-xs font-mono text-muted flex-1 truncate", children: sensitive && !showEnvKeys ? '••••••••••••' : value }), _jsx(CopyButton, { text: value })] }, key))) })] }), _jsxs("div", { className: "bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden", children: [_jsx(SectionHeader, { icon: Shield, title: "Credentials", subtitle: "API keys and tokens stored in .cred.env", action: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setShowCredSecrets(!showCredSecrets), className: "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-text bg-hover/50 hover:bg-hover transition-all", children: [showCredSecrets ? _jsx(EyeOff, { className: "w-3.5 h-3.5" }) : _jsx(Eye, { className: "w-3.5 h-3.5" }), showCredSecrets ? 'Hide' : 'Reveal'] }), _jsxs("button", { onClick: () => setShowAddCred(!showAddCred), className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-accent hover:bg-accent-hover transition-all active:scale-95 shadow-sm", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), "Add"] })] }) }), credsError && (_jsxs("div", { className: "px-6 py-3 bg-error-light border-b border-error/20 flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-error", children: credsError }), _jsx("button", { onClick: () => setCredsError(null), className: "text-xs text-error/60 hover:text-error", children: "dismiss" })] })), showAddCred && (_jsxs("div", { className: "px-6 py-5 bg-accent-light/30 border-b border-border-light", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsx("input", { type: "text", placeholder: "Label (e.g. Bitbucket Token)", value: newCred.label, onChange: (e) => setLabel(e.target.value), className: "px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-text placeholder:text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" }), _jsxs("select", { value: newCred.provider, onChange: (e) => setNewCred({ ...newCred, provider: e.target.value }), className: "px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all", children: [_jsx("option", { value: "bitbucket", children: "Bitbucket" }), _jsx("option", { value: "github", children: "GitHub" }), _jsx("option", { value: "gitlab", children: "GitLab" }), _jsx("option", { value: "anthropic", children: "Anthropic" }), _jsx("option", { value: "openai", children: "OpenAI" }), _jsx("option", { value: "custom", children: "Custom" })] }), _jsx("input", { type: "text", placeholder: "Key (e.g. BITBUCKET_TOKEN)", value: newCred.key, onChange: (e) => setNewCred({ ...newCred, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_') }), className: "px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-text font-mono placeholder:text-light placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" }), _jsx("input", { type: "password", placeholder: "Token or API key value", value: newCred.value, onChange: (e) => setNewCred({ ...newCred, value: e.target.value }), className: "px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-text placeholder:text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all" })] }), _jsxs("div", { className: "flex items-center justify-between mt-3", children: [_jsxs("p", { className: "text-[11px] text-light flex items-center gap-1.5", children: [_jsx(Lock, { className: "w-3 h-3" }), "Stored in .cred.env \u2014 never committed to git"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => { setShowAddCred(false); setNewCred({ label: '', provider: 'bitbucket', key: '', value: '' }); }, className: "px-3 py-2 rounded-xl text-sm font-medium text-muted hover:text-text hover:bg-hover transition-all", children: "Cancel" }), _jsxs("button", { onClick: addCredential, disabled: !newCred.label || !newCred.value || !newCred.key || saving, className: cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95', newCred.label && newCred.value && newCred.key && !saving
                                                            ? 'bg-accent text-white hover:bg-accent-hover shadow-sm'
                                                            : 'bg-hover text-light cursor-not-allowed'), children: [saving && _jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }), saving ? 'Saving...' : 'Save'] })] })] })] })), credsLoading ? (_jsxs("div", { className: "px-6 py-12 text-center", children: [_jsx(Loader2, { className: "w-5 h-5 text-muted animate-spin mx-auto mb-2" }), _jsx("p", { className: "text-xs text-muted", children: "Loading credentials..." })] })) : credentials.length > 0 ? (_jsx("div", { className: "divide-y divide-border-light", children: credentials.map((cred) => (_jsx(CredentialRow, { cred: cred, showSecrets: showCredSecrets, onDelete: deleteCred, onReveal: handleRevealCredential }, cred.id))) })) : (_jsxs("div", { className: "px-6 py-12 text-center", children: [_jsx(Shield, { className: "w-8 h-8 text-light mx-auto mb-3" }), _jsx("p", { className: "text-sm text-muted", children: "No credentials configured" }), _jsx("p", { className: "text-xs text-light mt-1", children: "Add API keys for Bitbucket, GitHub, or Anthropic to enable private repo scanning" })] }))] })] }), _jsxs("div", { className: "bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden", children: [_jsx(SectionHeader, { icon: Database, title: "Knowledge Base Snapshots", subtitle: "Export and import your Cortex knowledge base", action: _jsxs("button", { onClick: handleExport, disabled: exporting, className: cn('inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm', exporting
                                ? 'bg-hover text-light cursor-not-allowed'
                                : 'bg-success text-white hover:bg-success/90'), children: [exporting ? _jsx(Loader2, { className: "w-3.5 h-3.5 animate-spin" }) : _jsx(Download, { className: "w-3.5 h-3.5" }), exporting ? 'Exporting...' : 'Export Snapshot'] }) }), _jsxs("div", { className: "px-6 py-5 border-b border-border-light", children: [_jsxs("label", { className: cn('flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all', importing
                                    ? 'border-accent/40 bg-accent-light/30'
                                    : 'border-border-light hover:border-accent/30 hover:bg-hover/30'), children: [importing ? (_jsx(Loader2, { className: "w-6 h-6 text-accent animate-spin" })) : (_jsx(Upload, { className: "w-6 h-6 text-muted" })), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm font-medium text-text", children: importing ? 'Importing...' : 'Import Snapshot' }), _jsx("p", { className: "text-xs text-light mt-0.5", children: "Drop a .json snapshot file or click to browse" })] }), _jsx("input", { type: "file", accept: ".json", onChange: handleImport, disabled: importing, className: "hidden" })] }), importResult && (_jsxs("div", { className: "mt-4 p-4 rounded-xl bg-success-light border border-success/20", children: [_jsx("p", { className: "text-sm font-semibold text-success mb-2", children: "Import complete" }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-lg font-bold text-text", children: importResult.stats.projectsImported }), _jsx("p", { className: "text-[11px] text-muted", children: "Projects" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-lg font-bold text-text", children: importResult.stats.reposImported }), _jsx("p", { className: "text-[11px] text-muted", children: "Repos" })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-lg font-bold text-text", children: importResult.stats.documentsIngested }), _jsx("p", { className: "text-[11px] text-muted", children: "Documents" })] })] }), importResult.stats.errors.length > 0 && (_jsxs("div", { className: "mt-3 pt-3 border-t border-error/20", children: [_jsx("p", { className: "text-xs font-semibold text-error mb-1", children: "Errors:" }), importResult.stats.errors.map((err, i) => (_jsx("p", { className: "text-xs text-error/80", children: err }, i)))] }))] }))] }), snapshots.length > 0 ? (_jsxs("div", { className: "divide-y divide-border-light", children: [_jsxs("div", { className: "grid grid-cols-4 gap-4 px-6 py-3 text-[11px] font-semibold text-light uppercase tracking-wider bg-hover/30", children: [_jsx("span", { children: "Name" }), _jsx("span", { children: "Version" }), _jsx("span", { children: "Stats" }), _jsx("span", { children: "Date" })] }), snapshots.map((snap) => (_jsxs("div", { className: "grid grid-cols-4 gap-4 px-6 py-3.5 hover:bg-hover/30 transition-colors", children: [_jsx("span", { className: "text-sm font-medium text-text truncate", children: snap.name }), _jsx("span", { className: "text-xs font-mono text-muted", children: snap.version }), _jsx("span", { className: "text-xs text-light", children: snap.metadata?.projects != null ? `${snap.metadata.projects} projects` : '--' }), _jsx("span", { className: "text-xs text-light", children: new Date(snap.createdAt).toLocaleDateString() })] }, snap.id)))] })) : (_jsxs("div", { className: "px-6 py-12 text-center", children: [_jsx(Database, { className: "w-8 h-8 text-light mx-auto mb-3" }), _jsx("p", { className: "text-sm text-muted", children: "No snapshots yet" }), _jsx("p", { className: "text-xs text-light mt-1", children: "Export your knowledge base to create the first snapshot" })] }))] }), _jsxs("div", { className: "bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden", children: [_jsx(SectionHeader, { icon: Brain, title: "About Cortex", subtitle: "Knowledge Hub for Multi-Project AI Teams" }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "grid grid-cols-2 gap-6", children: [
                                    { label: 'Version', value: '0.1.0', mono: true },
                                    { label: 'Architecture', value: 'Hybrid RAG' },
                                    { label: 'Code Extraction', value: 'Claude Haiku (CLI)' },
                                    { label: 'Embeddings', value: 'nomic-embed-text' },
                                    { label: 'LightRAG LLM', value: 'qwen2.5:7b (Ollama)' },
                                    { label: 'Chat LLM', value: 'qwen3.5:9b (Ollama)' },
                                    { label: 'Database', value: 'PostgreSQL 16 + pgvector' },
                                    { label: 'Graph RAG', value: 'LightRAG' },
                                    { label: 'MCP Protocol', value: '12 tools (stdio)' },
                                ].map(({ label, value, mono }) => (_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-border-light/50 last:border-0", children: [_jsx("span", { className: "text-xs text-light font-medium", children: label }), _jsx("span", { className: cn('text-xs text-text font-semibold', mono && 'font-mono'), children: value })] }, label))) }), _jsx("div", { className: "mt-6 p-4 rounded-xl bg-accent-light/50 border border-accent/10", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(User, { className: "w-5 h-5 text-accent flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-text", children: "Multi-User Support" }), _jsx("p", { className: "text-xs text-muted mt-0.5", children: "Up to 5 concurrent users via API keys. Real-time sync through WebSocket + pg_notify. Each MCP client connects via stdio and shares the same backend." })] })] }) })] })] })] }));
}
function autoKeyFromLabel(label) {
    return label.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
}
