import { useEffect, useState, useCallback } from 'react';
import {
  Key,
  Brain,
  Eye,
  EyeOff,
  Shield,
  Plus,
  Trash2,
  Sparkles,
  Globe,
  Lock,
  User,
  AlertTriangle,
  CheckCircle2,
  Database,
  Loader2,
  Download,
  Upload,
} from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { CopyButton } from '../components/CopyButton.tsx';
import { SectionHeader } from '../components/SectionHeader.tsx';
import type { HealthStatus, CredentialEntry, Snapshot, ImportResult } from '../types.ts';


/* ── Service Health Card ────────────────────────────── */

/** Maps service keys to their icon components (config is data-only). */

/* ── Credential Row ─────────────────────────────────── */

const PROVIDER_ICONS: Record<string, React.ElementType> = {
  github: Globe,
  bitbucket: Globe,
  gitlab: Globe,
  anthropic: Brain,
  openai: Sparkles,
  custom: Key,
};

function CredentialRow({ cred, showSecrets, onDelete, onReveal }: {
  cred: CredentialEntry;
  showSecrets: boolean;
  onDelete: (id: string) => void;
  onReveal: (id: string) => Promise<string>;
}) {
  const [revealed, setRevealed] = useState<string | null>(null);
  const Icon = PROVIDER_ICONS[cred.provider] || Key;
  const displayValue = showSecrets ? (revealed ?? cred.value) : cred.value;

  // If showSecrets toggled on and we haven't fetched, fetch
  useEffect(() => {
    if (showSecrets && !revealed) {
      onReveal(cred.id).then(setRevealed).catch(() => {});
    }
  }, [showSecrets]);

  return (
    <div className="group flex items-center gap-4 px-6 py-4 hover:bg-hover/50 transition-colors">
      <div className="w-9 h-9 rounded-xl bg-info-light flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-info" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text">{cred.label}</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-hover text-light uppercase tracking-wider">{cred.provider}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <code className="text-[11px] font-mono font-semibold text-accent/70">{cred.key}</code>
          <span className="text-[10px] text-light">=</span>
          <code className="text-xs font-mono text-muted truncate">
            {displayValue}
          </code>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={revealed ?? cred.value} />
        <button
          onClick={() => onDelete(cred.id)}
          className="p-1.5 rounded-lg hover:bg-error-light transition-all active:scale-95"
          title="Remove"
        >
          <Trash2 className="w-3.5 h-3.5 text-light hover:text-error transition-colors" />
        </button>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────── */

export function SettingsPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [showEnvKeys, setShowEnvKeys] = useState(false);
  const [showCredSecrets, setShowCredSecrets] = useState(false);
  // Credentials state — loaded from API
  const [credentials, setCredentials] = useState<CredentialEntry[]>([]);
  const [credsLoading, setCredsLoading] = useState(true);
  const [credsError, setCredsError] = useState<string | null>(null);
  const [showAddCred, setShowAddCred] = useState(false);
  const [newCred, setNewCred] = useState({ label: '', provider: 'bitbucket', key: '', value: '' });
  const [saving, setSaving] = useState(false);

  // Export/Import state
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

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
    } catch (err) {
      setCredsError(err instanceof Error ? err.message : 'Failed to load credentials');
    }
    setCredsLoading(false);
  };

  const handleRevealCredential = useCallback(async (id: string): Promise<string> => {
    const entry = await api.revealCredential(id);
    return entry.value;
  }, []);

  const addCredential = async () => {
    if (!newCred.label || !newCred.value || !newCred.key) return;
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
    } catch (err) {
      setCredsError(err instanceof Error ? err.message : 'Failed to add credential');
    }
    setSaving(false);
  };

  const deleteCred = async (id: string) => {
    try {
      await api.deleteCredential(id);
      setCredentials((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setCredsError(err instanceof Error ? err.message : 'Failed to delete credential');
    }
  };

  // Auto-generate key from label
  const setLabel = (label: string) => {
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
    } catch (err) { console.error(err); }
    setExporting(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const snapshot = JSON.parse(text);
      const result = await api.importSnapshot(snapshot);
      setImportResult(result);
      fetchSnapshots();
    } catch (err) { console.error(err); }
    setImporting(false);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-6xl font-bold text-text tracking-tight">Settings</h1>
          <p className="text-xl text-muted mt-1">System configuration, credentials, and service health</p>
        </div>
        <div className="flex items-center gap-2">
          {health && (
            <div className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
              health.status === 'ok'
                ? 'bg-success-light text-success'
                : 'bg-warning-light text-warning'
            )}>
              {health.status === 'ok' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              System {health.status}
            </div>
          )}
        </div>
      </div>

      {/* ── Top row: Infrastructure + Credentials side by side ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

       {/* ── Environment Variables ────────────────────── */}
       <div className="bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden">
        <SectionHeader
          icon={Key}
          title="Environment"
          subtitle="System environment variables (.env)"
          action={
            <button
              onClick={() => setShowEnvKeys(!showEnvKeys)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-text bg-hover/50 hover:bg-hover transition-all"
            >
              {showEnvKeys ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showEnvKeys ? 'Hide' : 'Show'} sensitive
            </button>
          }
        />
        <div className="divide-y divide-border-light">
          {envVars.map(({ key, value, sensitive, category }) => (
            <div key={key} className="flex items-center gap-4 px-6 py-3.5 hover:bg-hover/30 transition-colors">
              <span className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
                category === 'database' ? 'bg-info-light text-info'
                  : category === 'ai' ? 'bg-accent-light text-accent'
                  : category === 'auth' ? 'bg-error-light text-error'
                  : 'bg-hover text-light'
              )}>
                {category}
              </span>
              <code className="text-xs font-mono font-semibold text-text min-w-[180px]">{key}</code>
              <code className="text-xs font-mono text-muted flex-1 truncate">
                {sensitive && !showEnvKeys ? '••••••••••••' : value}
              </code>
              <CopyButton text={value} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Credentials ─────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden">
        <SectionHeader
          icon={Shield}
          title="Credentials"
          subtitle="API keys and tokens stored in .cred.env"
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCredSecrets(!showCredSecrets)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted hover:text-text bg-hover/50 hover:bg-hover transition-all"
              >
                {showCredSecrets ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showCredSecrets ? 'Hide' : 'Reveal'}
              </button>
              <button
                onClick={() => setShowAddCred(!showAddCred)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-accent hover:bg-accent-hover transition-all active:scale-95 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          }
        />

        {/* Error banner */}
        {credsError && (
          <div className="px-6 py-3 bg-error-light border-b border-error/20 flex items-center justify-between">
            <span className="text-xs text-error">{credsError}</span>
            <button onClick={() => setCredsError(null)} className="text-xs text-error/60 hover:text-error">dismiss</button>
          </div>
        )}

        {/* Add credential form */}
        {showAddCred && (
          <div className="px-6 py-5 bg-accent-light/30 border-b border-border-light">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Label (e.g. Bitbucket Token)"
                value={newCred.label}
                onChange={(e) => setLabel(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-text placeholder:text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <select
                value={newCred.provider}
                onChange={(e) => setNewCred({ ...newCred, provider: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              >
                <option value="bitbucket">Bitbucket</option>
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="anthropic">Anthropic</option>
                <option value="openai">OpenAI</option>
                <option value="custom">Custom</option>
              </select>
              <input
                type="text"
                placeholder="Key (e.g. BITBUCKET_TOKEN)"
                value={newCred.key}
                onChange={(e) => setNewCred({ ...newCred, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_') })}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-text font-mono placeholder:text-light placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
              <input
                type="password"
                placeholder="Token or API key value"
                value={newCred.value}
                onChange={(e) => setNewCred({ ...newCred, value: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-sm text-text placeholder:text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
              />
            </div>
            <div className="flex items-center justify-between mt-3">
              <p className="text-[11px] text-light flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Stored in .cred.env — never committed to git
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowAddCred(false); setNewCred({ label: '', provider: 'bitbucket', key: '', value: '' }); }}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-muted hover:text-text hover:bg-hover transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addCredential}
                  disabled={!newCred.label || !newCred.value || !newCred.key || saving}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95',
                    newCred.label && newCred.value && newCred.key && !saving
                      ? 'bg-accent text-white hover:bg-accent-hover shadow-sm'
                      : 'bg-hover text-light cursor-not-allowed'
                  )}
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Credential list */}
        {credsLoading ? (
          <div className="px-6 py-12 text-center">
            <Loader2 className="w-5 h-5 text-muted animate-spin mx-auto mb-2" />
            <p className="text-xs text-muted">Loading credentials...</p>
          </div>
        ) : credentials.length > 0 ? (
          <div className="divide-y divide-border-light">
            {credentials.map((cred) => (
              <CredentialRow
                key={cred.id}
                cred={cred}
                showSecrets={showCredSecrets}
                onDelete={deleteCred}
                onReveal={handleRevealCredential}
              />
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Shield className="w-8 h-8 text-light mx-auto mb-3" />
            <p className="text-sm text-muted">No credentials configured</p>
            <p className="text-xs text-light mt-1">Add API keys for Bitbucket, GitHub, or Anthropic to enable private repo scanning</p>
          </div>
        )}
      </div>

      </div>{/* end grid cols-2 */}

      {/* ── Knowledge Base Snapshots ─────────────────── */}
      <div className="bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden">
        <SectionHeader
          icon={Database}
          title="Knowledge Base Snapshots"
          subtitle="Export and import your Cortex knowledge base"
          action={
            <button
              onClick={handleExport}
              disabled={exporting}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shadow-sm',
                exporting
                  ? 'bg-hover text-light cursor-not-allowed'
                  : 'bg-success text-white hover:bg-success/90'
              )}
            >
              {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              {exporting ? 'Exporting...' : 'Export Snapshot'}
            </button>
          }
        />

        {/* Import zone */}
        <div className="px-6 py-5 border-b border-border-light">
          <label className={cn(
            'flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all',
            importing
              ? 'border-accent/40 bg-accent-light/30'
              : 'border-border-light hover:border-accent/30 hover:bg-hover/30'
          )}>
            {importing ? (
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-muted" />
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-text">
                {importing ? 'Importing...' : 'Import Snapshot'}
              </p>
              <p className="text-xs text-light mt-0.5">
                Drop a .json snapshot file or click to browse
              </p>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
          </label>

          {/* Import result */}
          {importResult && (
            <div className="mt-4 p-4 rounded-xl bg-success-light border border-success/20">
              <p className="text-sm font-semibold text-success mb-2">Import complete</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-text">{importResult.stats.projectsImported}</p>
                  <p className="text-[11px] text-muted">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-text">{importResult.stats.reposImported}</p>
                  <p className="text-[11px] text-muted">Repos</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-text">{importResult.stats.documentsIngested}</p>
                  <p className="text-[11px] text-muted">Documents</p>
                </div>
              </div>
              {importResult.stats.errors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-error/20">
                  <p className="text-xs font-semibold text-error mb-1">Errors:</p>
                  {importResult.stats.errors.map((err, i) => (
                    <p key={i} className="text-xs text-error/80">{err}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Snapshot history */}
        {snapshots.length > 0 ? (
          <div className="divide-y divide-border-light">
            <div className="grid grid-cols-4 gap-4 px-6 py-3 text-[11px] font-semibold text-light uppercase tracking-wider bg-hover/30">
              <span>Name</span>
              <span>Version</span>
              <span>Stats</span>
              <span>Date</span>
            </div>
            {snapshots.map((snap) => (
              <div key={snap.id} className="grid grid-cols-4 gap-4 px-6 py-3.5 hover:bg-hover/30 transition-colors">
                <span className="text-sm font-medium text-text truncate">{snap.name}</span>
                <span className="text-xs font-mono text-muted">{snap.version}</span>
                <span className="text-xs text-light">
                  {snap.metadata?.projects != null ? `${snap.metadata.projects} projects` : '--'}
                </span>
                <span className="text-xs text-light">
                  {new Date(snap.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Database className="w-8 h-8 text-light mx-auto mb-3" />
            <p className="text-sm text-muted">No snapshots yet</p>
            <p className="text-xs text-light mt-1">Export your knowledge base to create the first snapshot</p>
          </div>
        )}
      </div>

      {/* ── About ────────────────────────────────────── */}
      <div className="bg-card rounded-2xl border border-border-light shadow-sm overflow-hidden">
        <SectionHeader icon={Brain} title="About Cortex" subtitle="Knowledge Hub for Multi-Project AI Teams" />
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Version', value: '0.1.0', mono: true },
              { label: 'Architecture', value: 'Hybrid RAG' },
              { label: 'Code Extraction', value: 'Claude Haiku (CLI)' },
              { label: 'Embeddings', value: 'nomic-embed-text' },
              { label: 'LightRAG LLM', value: 'qwen2.5:7b (Ollama)' },
              { label: 'Chat LLM', value: 'qwen3.5:9b (Ollama)' },
              { label: 'Database', value: 'PostgreSQL 16 + pgvector' },
              { label: 'Graph RAG', value: 'LightRAG' },
              { label: 'MCP Protocol', value: '12 tools (stdio)' },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-border-light/50 last:border-0">
                <span className="text-xs text-light font-medium">{label}</span>
                <span className={cn('text-xs text-text font-semibold', mono && 'font-mono')}>{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-accent-light/50 border border-accent/10">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-text">Multi-User Support</p>
                <p className="text-xs text-muted mt-0.5">
                  Up to 5 concurrent users via API keys. Real-time sync through WebSocket + pg_notify.
                  Each MCP client connects via stdio and shares the same backend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function autoKeyFromLabel(label: string): string {
  return label.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
}
