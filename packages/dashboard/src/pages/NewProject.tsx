import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  GitBranch,
  FolderKanban,
  Check,
  AlertCircle,
  Loader2,
  Lock,
  Key,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';

// ---------------------------------------------------------------------------
// URL parsing helper
// ---------------------------------------------------------------------------
function parseGitUrl(url: string): { name: string; slug: string; provider: string } | null {
  const sshMatch = url.match(/git@([^:]+):([^/]+)\/([^.]+)(\.git)?$/);
  const httpsMatch = url.match(/https?:\/\/([^/]+)\/([^/]+)\/([^/.]+)(\.git)?$/);
  const match = sshMatch || httpsMatch;
  if (!match) return null;

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

// ---------------------------------------------------------------------------
// Protocol detection
// ---------------------------------------------------------------------------
type RepoProtocol = 'ssh' | 'https' | 'local' | 'unknown';

function detectProtocol(url: string): RepoProtocol {
  if (!url.trim()) return 'unknown';
  if (url.startsWith('/') || url.startsWith('~')) return 'local';
  if (/^git@|^ssh:\/\//.test(url)) return 'ssh';
  if (/^https?:\/\//.test(url)) return 'https';
  return 'unknown';
}

function protocolLabel(protocol: RepoProtocol): string {
  switch (protocol) {
    case 'ssh': return 'SSH';
    case 'https': return 'HTTPS';
    case 'local': return 'Local';
    default: return '';
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface RepoCredentials {
  saved: boolean;
  saving: boolean;
  error: string | null;
  // SSH
  sshKeyPath: string;
  // HTTPS
  token: string;
}

function emptyCredentials(): RepoCredentials {
  return { saved: false, saving: false, error: null, sshKeyPath: '~/.ssh/id_ed25519', token: '' };
}

interface RepoEntry {
  id: string;
  cloneUrl: string;
  name: string;
  slug: string;
  provider: string;
  techStack: string;
  defaultBranch: string;
  credentials: RepoCredentials;
  branches: string[];
}

function emptyRepo(): RepoEntry {
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

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors',
                  done
                    ? 'bg-accent border-accent text-white'
                    : active
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-[var(--color-border)] text-muted bg-card',
                )}
              >
                {done ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-xs font-medium whitespace-nowrap',
                  active ? 'text-accent' : done ? 'text-text' : 'text-muted',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'w-16 h-0.5 mx-1 mb-5 transition-colors',
                  done ? 'bg-accent' : 'bg-[var(--color-border)]',
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Input / Textarea shared classes
// ---------------------------------------------------------------------------
const inputCls =
  'w-full border border-[var(--color-border)] rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-text bg-card placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors';

// ---------------------------------------------------------------------------
// Step 1 – Project Info
// ---------------------------------------------------------------------------
function StepProjectInfo({
  name,
  description,
  context,
  onName,
  onDescription,
  onContext,
}: {
  name: string;
  description: string;
  context: string;
  onName: (v: string) => void;
  onDescription: (v: string) => void;
  onContext: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] p-6 space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-accent/10 flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text">Project Details</h2>
            <p className="text-xs text-muted">Basic information about your project</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text mb-1.5">
            Project Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder="e.g. Cortex Platform"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text mb-1.5">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => onDescription(e.target.value)}
            placeholder="A short description of what this project does…"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text mb-1.5">Context / Notes</label>
          <p className="text-xs text-muted mb-2">
            Describe your project's purpose, architecture, key decisions — this helps Cortex understand
            where to place this project in the knowledge graph before scanning.
          </p>
          <textarea
            rows={5}
            value={context}
            onChange={(e) => onContext(e.target.value)}
            placeholder="e.g. This is a monorepo using Turborepo. The API is built with Fastify and talks to a PostgreSQL database via Drizzle ORM. Key decision: we use event sourcing for the scan pipeline…"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Credentials section per repo
// ---------------------------------------------------------------------------

/** Keys that match a given protocol+provider for filtering existing credentials */
function matchingCredKeys(protocol: RepoProtocol, provider: string): string[] {
  if (protocol === 'ssh') return ['SSH_KEY_PATH', 'SSH_PRIVATE_KEY'];
  if (provider === 'github') return ['GITHUB_TOKEN', 'GITHUB_PAT'];
  if (provider === 'gitlab') return ['GITLAB_TOKEN', 'GITLAB_PAT'];
  if (provider === 'bitbucket') return ['BITBUCKET_APP_PASSWORD', 'BITBUCKET_API_TOKEN', 'BITBUCKET_TOKEN'];
  return [`${provider.toUpperCase()}_TOKEN`];
}

function RepoCredentialsSection({
  cloneUrl,
  provider,
  credentials,
  onChange,
  onBranchesLoaded,
}: {
  cloneUrl: string;
  provider: string;
  credentials: RepoCredentials;
  onChange: (creds: RepoCredentials) => void;
  onBranchesLoaded: (branches: string[], defaultBranch: string) => void;
}) {
  const [showValue, setShowValue] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [testError, setTestError] = useState<string | null>(null);
  const [existingCreds, setExistingCreds] = useState<{ id: string; key: string; label: string; value: string }[]>([]);
  const [sshKeys, setSshKeys] = useState<{ name: string; path: string; type: 'private' | 'public' }[]>([]);
  const [mode, setMode] = useState<'select' | 'new'>('select');
  const protocol = provider === 'local' ? 'local' : detectProtocol(cloneUrl);
  const effectiveProtocol = provider === 'local' ? 'local' : (protocol === 'unknown' ? 'https' : protocol);

  // Load existing credentials + SSH keys
  useEffect(() => {
    if (provider === 'local') return;
    const ep = protocol === 'unknown' ? 'https' : protocol;
    api.listCredentials(true).then((all) => {
      const keys = matchingCredKeys(ep, provider);
      const matching = all.filter((c) => keys.some((k) => c.key.startsWith(k) || c.key === k));
      setExistingCreds(matching);
      if (matching.length === 0 && ep !== 'ssh') setMode('new');
    }).catch(() => setMode('new'));
    if (ep === 'ssh') {
      api.listSshKeys().then((keys) => {
        setSshKeys(keys.filter((k) => k.type === 'private'));
        if (keys.filter((k) => k.type === 'private').length > 0) setMode('select');
      }).catch(() => {});
    }
  }, [provider, protocol]);

  if (effectiveProtocol === 'local') return null;

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
      } else {
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
      }).catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save credential';
      if (msg.includes('already exists')) {
        onChange({ ...credentials, saving: false, saved: true, error: null });
      } else {
        onChange({ ...credentials, saving: false, error: msg });
      }
    }
  };

  const handleSelectExisting = (credId: string) => {
    const cred = existingCreds.find((c) => c.id === credId);
    if (!cred) return;
    if (effectiveProtocol === 'ssh') {
      onChange({ ...credentials, sshKeyPath: cred.value, saved: true, error: null });
    } else {
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
      } else {
        setTestStatus('error');
        setTestError(res.error ?? 'Connection failed');
      }
    } catch (err) {
      setTestStatus('error');
      setTestError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  const tokenLabel = provider === 'bitbucket' ? 'App Password' : 'Personal Access Token';
  const tokenPlaceholder =
    provider === 'github' ? 'ghp_xxxxxxxxxxxxxxxxxxxx'
    : provider === 'gitlab' ? 'glpat-xxxxxxxxxxxxxxxxxxxx'
    : provider === 'bitbucket' ? 'ATBBxxxxxxxxxxxxxxxxxxxx'
    : 'token';
  const tokenHint =
    provider === 'github' ? 'A GitHub Personal Access Token (classic or fine-grained) with repo read access.'
    : provider === 'gitlab' ? 'A GitLab Personal Access Token with read_repository scope.'
    : provider === 'bitbucket' ? 'A Bitbucket App Password with repository read permission.'
    : 'An access token with repository read access.';

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border-light)] bg-[var(--color-bg)] p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-muted" />
          <span className="text-xs font-semibold text-text">Authentication</span>
          <span className={cn(
            'text-[10px] font-mono px-1.5 py-0.5 rounded',
            effectiveProtocol === 'ssh' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
          )}>
            {protocolLabel(effectiveProtocol)}
          </span>
        </div>
        {credentials.saved && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success">
            <ShieldCheck className="w-3 h-3" />
            Credential selected
          </span>
        )}
      </div>

      {/* Mode toggle — only for HTTPS when existing creds exist */}
      {effectiveProtocol !== 'ssh' && existingCreds.length > 0 && (
        <div className="flex items-center bg-[var(--color-hover)] rounded-full p-0.5 w-fit">
          <button
            type="button"
            onClick={() => setMode('select')}
            className={cn(
              'px-3 py-1 rounded-full text-[11px] font-medium transition-colors',
              mode === 'select' ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text',
            )}
          >
            Use existing
          </button>
          <button
            type="button"
            onClick={() => setMode('new')}
            className={cn(
              'px-3 py-1 rounded-full text-[11px] font-medium transition-colors',
              mode === 'new' ? 'bg-card text-text shadow-sm' : 'text-muted hover:text-text',
            )}
          >
            Add new
          </button>
        </div>
      )}

      {/* Select existing credential */}
      {mode === 'select' && effectiveProtocol !== 'ssh' && existingCreds.length > 0 && (
        <div className="space-y-2">
          {existingCreds.map((cred) => {
            const isSelected = credentials.saved && credentials.token === cred.value;
            return (
              <button
                key={cred.id}
                type="button"
                onClick={() => handleSelectExisting(cred.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] border text-left transition-colors',
                  isSelected
                    ? 'border-success/40 bg-success/5'
                    : 'border-[var(--color-border-light)] hover:border-accent/30 hover:bg-[var(--color-hover)]',
                )}
              >
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
                  isSelected ? 'bg-success/15' : 'bg-[var(--color-hover)]',
                )}>
                  {isSelected ? <Check className="w-3.5 h-3.5 text-success" /> : <Key className="w-3.5 h-3.5 text-muted" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text truncate">{cred.label}</p>
                  <p className="text-[10px] text-muted font-mono">{cred.key}</p>
                </div>
                {isSelected && (
                  <span className="text-[10px] font-medium text-success flex-shrink-0">Selected</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* SSH key selector — from ~/.ssh + saved credentials */}
      {effectiveProtocol === 'ssh' && (mode === 'select' || mode === 'new') && (
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">
            <Key className="w-3 h-3 inline mr-1" />
            SSH Private Key
          </label>
          {(sshKeys.length > 0 || existingCreds.length > 0) ? (
            <>
              <select
                value={credentials.sshKeyPath}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '__custom__') {
                    onChange({ ...credentials, sshKeyPath: '', saved: false });
                    setMode('new');
                  } else {
                    onChange({ ...credentials, sshKeyPath: val, saved: true });
                  }
                }}
                className={cn(inputCls, 'font-mono text-xs')}
              >
                <option value="" disabled>Select an SSH key…</option>
                {sshKeys.length > 0 && (
                  <optgroup label="~/.ssh">
                    {sshKeys.map((k) => (
                      <option key={k.path} value={k.path}>{k.path}</option>
                    ))}
                  </optgroup>
                )}
                {existingCreds.length > 0 && (
                  <optgroup label="Saved credentials">
                    {existingCreds.map((c) => (
                      <option key={c.id} value={c.value}>{c.label} ({c.value})</option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Other">
                  <option value="__custom__">Enter custom path…</option>
                </optgroup>
              </select>
              {credentials.sshKeyPath && credentials.sshKeyPath !== '__custom__' && (
                <p className="text-[10px] text-success mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Key selected: {credentials.sshKeyPath}
                </p>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={credentials.sshKeyPath}
                onChange={(e) => onChange({ ...credentials, sshKeyPath: e.target.value, saved: false })}
                placeholder="~/.ssh/id_ed25519"
                className={cn(inputCls, 'font-mono text-xs flex-1')}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={credentials.saving || credentials.saved}
                className={cn(
                  'px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors flex-shrink-0 inline-flex items-center gap-1.5',
                  credentials.saved
                    ? 'bg-success/10 text-success border border-success/20'
                    : credentials.saving
                      ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                      : 'bg-accent text-white hover:bg-accent/90',
                )}
              >
                {credentials.saving ? <Loader2 className="w-3 h-3 animate-spin" /> : credentials.saved ? <Check className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {credentials.saving ? 'Saving...' : credentials.saved ? 'Saved' : 'Save'}
              </button>
            </div>
          )}
          <p className="text-[10px] text-muted mt-1">
            Private key used to authenticate with this repository.
          </p>
        </div>
      )}

      {/* New credential form — HTTPS only (SSH handled above) */}
      {mode === 'new' && effectiveProtocol !== 'ssh' && (
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">
            <Key className="w-3 h-3 inline mr-1" />
            {tokenLabel}
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showValue ? 'text' : 'password'}
                value={credentials.token}
                onChange={(e) => onChange({ ...credentials, token: e.target.value, saved: false })}
                placeholder={tokenPlaceholder}
                className={cn(inputCls, 'font-mono text-xs pr-9')}
              />
              <button
                type="button"
                onClick={() => setShowValue(!showValue)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
              >
                {showValue ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={credentials.saving || credentials.saved || !credentials.token.trim()}
              className={cn(
                'px-3 py-2 rounded-[var(--radius-md)] text-xs font-medium transition-colors flex-shrink-0 inline-flex items-center gap-1.5',
                credentials.saved
                  ? 'bg-success/10 text-success border border-success/20'
                  : credentials.saving || !credentials.token.trim()
                    ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                    : 'bg-accent text-white hover:bg-accent/90',
              )}
            >
              {credentials.saving ? <Loader2 className="w-3 h-3 animate-spin" /> : credentials.saved ? <Check className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
              {credentials.saving ? 'Saving...' : credentials.saved ? 'Saved' : 'Save'}
            </button>
          </div>
          <p className="text-[10px] text-muted mt-1">{tokenHint}</p>
        </div>
      )}

      {credentials.error && (
        <div className="flex items-center gap-1.5 text-[10px] text-error">
          <ShieldAlert className="w-3 h-3 flex-shrink-0" />
          {credentials.error}
        </div>
      )}

      {/* Test Connection */}
      <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-border-light)]">
        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testStatus === 'testing' || !cloneUrl.trim()}
          className={cn(
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium transition-colors',
            testStatus === 'ok'
              ? 'bg-success/10 text-success border border-success/20'
              : testStatus === 'error'
                ? 'bg-error/10 text-error border border-error/20'
                : testStatus === 'testing'
                  ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                  : 'border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)]',
          )}
        >
          {testStatus === 'testing' ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : testStatus === 'ok' ? (
            <ShieldCheck className="w-3 h-3" />
          ) : testStatus === 'error' ? (
            <ShieldAlert className="w-3 h-3" />
          ) : (
            <Lock className="w-3 h-3" />
          )}
          {testStatus === 'testing' ? 'Testing...' : testStatus === 'ok' ? 'Connected!' : testStatus === 'error' ? 'Failed' : 'Test Connection'}
        </button>
        {testStatus === 'ok' && (
          <span className="text-[10px] text-success">Repository accessible</span>
        )}
        {testError && (
          <span className="text-[10px] text-error">{testError}</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Repo row
// ---------------------------------------------------------------------------
function RepoRow({
  repo,
  index,
  onChange,
  onRemove,
  canRemove,
}: {
  repo: RepoEntry;
  index: number;
  onChange: (updated: RepoEntry) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  function handleUrlChange(url: string) {
    const parsed = parseGitUrl(url);
    onChange({
      ...repo,
      cloneUrl: url,
      ...(parsed
        ? { name: parsed.name, slug: parsed.slug, provider: parsed.provider }
        : {}),
    });
  }

  const providerColors: Record<string, string> = {
    github: 'text-text',
    gitlab: 'text-warning',
    bitbucket: 'text-info',
  };

  return (
    <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <GitBranch className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-xs font-semibold text-text">Repository {index + 1}</span>
          {repo.provider && (
            <span
              className={cn(
                'text-xs font-mono px-1.5 py-0.5 rounded bg-[var(--color-hover)]',
                providerColors[repo.provider] ?? 'text-muted',
              )}
            >
              {repo.provider}
            </span>
          )}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-error hover:bg-error/10 transition-colors"
            aria-label="Remove repository"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Provider + Clone URL / Local Path */}
      <div className="grid grid-cols-[140px_1fr] gap-3">
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">Provider</label>
          <select
            value={repo.provider}
            onChange={(e) => onChange({ ...repo, provider: e.target.value })}
            className={inputCls}
          >
            <option value="bitbucket">bitbucket</option>
            <option value="github">github</option>
            <option value="gitlab">gitlab</option>
            <option value="local">local</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">
            {repo.provider === 'local' ? 'Local Path' : 'Clone URL'}
          </label>
          <input
            type="text"
            value={repo.cloneUrl}
            onChange={(e) => repo.provider === 'local' ? onChange({ ...repo, cloneUrl: e.target.value }) : handleUrlChange(e.target.value)}
            placeholder={repo.provider === 'local' ? '/home/user/projects/my-repo' : 'git@github.com:org/repo.git or https://github.com/org/repo.git'}
            className={inputCls}
          />
          {repo.provider === 'local' && (
            <p className="text-[10px] text-muted mt-0.5">Absolute path to the local git repository</p>
          )}
        </div>
      </div>

      {/* Credentials section — shown when URL is entered */}
      <RepoCredentialsSection
        cloneUrl={repo.cloneUrl}
        provider={repo.provider}
        credentials={repo.credentials}
        onChange={(creds) => onChange({ ...repo, credentials: creds })}
        onBranchesLoaded={(branches, defaultBranch) =>
          onChange({ ...repo, branches, defaultBranch })
        }
      />

      <div className="grid grid-cols-2 gap-3">
        {/* Name (auto-detected) */}
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">Name</label>
          <input
            type="text"
            value={repo.name}
            onChange={(e) =>
              onChange({
                ...repo,
                name: e.target.value,
                slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
              })
            }
            placeholder="my-repo"
            className={inputCls}
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">Slug</label>
          <input
            type="text"
            value={repo.slug}
            onChange={(e) => onChange({ ...repo, slug: e.target.value })}
            placeholder="my-repo"
            className={cn(inputCls, 'font-mono text-xs')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Tech stack */}
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">Tech Stack</label>
          <input
            type="text"
            value={repo.techStack}
            onChange={(e) => onChange({ ...repo, techStack: e.target.value })}
            placeholder="typescript, react, node"
            className={inputCls}
          />
          <p className="text-xs text-muted mt-1">Comma-separated tags</p>
        </div>

        {/* Default branch */}
        <div>
          <label className="block text-xs font-medium text-text mb-1.5">Default Branch</label>
          {repo.branches.length > 0 ? (
            <select
              value={repo.defaultBranch}
              onChange={(e) => onChange({ ...repo, defaultBranch: e.target.value })}
              className={cn(inputCls, 'font-mono text-xs')}
            >
              {repo.branches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={repo.defaultBranch}
              onChange={(e) => onChange({ ...repo, defaultBranch: e.target.value })}
              placeholder="main"
              className={cn(inputCls, 'font-mono text-xs')}
            />
          )}
          {repo.branches.length > 0 && (
            <p className="text-[10px] text-success mt-1">{repo.branches.length} branches found</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 – Repositories
// ---------------------------------------------------------------------------
function StepRepos({
  repos,
  onChange,
}: {
  repos: RepoEntry[];
  onChange: (repos: RepoEntry[]) => void;
}) {
  function updateRepo(id: string, updated: RepoEntry) {
    onChange(repos.map((r) => (r.id === id ? updated : r)));
  }

  function removeRepo(id: string) {
    onChange(repos.filter((r) => r.id !== id));
  }

  function addRepo() {
    onChange([...repos, emptyRepo()]);
  }

  return (
    <div className="space-y-4">
      {repos.map((repo, i) => (
        <RepoRow
          key={repo.id}
          repo={repo}
          index={i}
          onChange={(updated) => updateRepo(repo.id, updated)}
          onRemove={() => removeRepo(repo.id)}
          canRemove={repos.length > 1}
        />
      ))}

      <button
        type="button"
        onClick={addRepo}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] text-muted hover:border-accent hover:text-accent transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add another repo
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 – Review & Create
// ---------------------------------------------------------------------------
function StepReview({
  name,
  description,
  context,
  repos,
  onSubmit,
  submitting,
  error,
}: {
  name: string;
  description: string;
  context: string;
  repos: RepoEntry[];
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const validRepos = repos.filter((r) => r.cloneUrl.trim() || r.name.trim());

  return (
    <div className="space-y-4">
      {/* Project summary */}
      <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] p-6">
        <div className="flex items-center gap-2 mb-4">
          <FolderKanban className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-text">Project</h2>
        </div>
        <p className="text-base font-bold text-text">{name || '—'}</p>
        {description && <p className="text-sm text-muted mt-1">{description}</p>}
        {context && (
          <p className="text-xs text-muted mt-3 whitespace-pre-wrap line-clamp-4 bg-[var(--color-hover)] rounded-[var(--radius-md)] px-3 py-2">
            {context}
          </p>
        )}
      </div>

      {/* Repos summary */}
      {validRepos.length > 0 && (
        <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-md)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold text-text">
              {validRepos.length} Repositor{validRepos.length === 1 ? 'y' : 'ies'}
            </h2>
          </div>
          <div className="space-y-3">
            {validRepos.map((repo, i) => (
              <div
                key={repo.id}
                className="flex items-start gap-3 py-2 border-b border-[var(--color-border-light)] last:border-0"
              >
                <span className="text-xs font-mono text-muted w-4 pt-0.5">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-text">{repo.name || repo.slug || '(unnamed)'}</span>
                    <span className="text-xs font-mono text-muted bg-[var(--color-hover)] px-1.5 py-0.5 rounded">
                      {repo.provider}
                    </span>
                    <span className="text-xs font-mono text-muted bg-[var(--color-hover)] px-1.5 py-0.5 rounded">
                      {repo.defaultBranch}
                    </span>
                    {detectProtocol(repo.cloneUrl) !== 'unknown' && (
                      <span className={cn(
                        'text-[10px] font-mono px-1.5 py-0.5 rounded',
                        detectProtocol(repo.cloneUrl) === 'ssh'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-blue-100 text-blue-700',
                      )}>
                        {protocolLabel(detectProtocol(repo.cloneUrl))}
                      </span>
                    )}
                    {repo.credentials.saved && (
                      <span className="text-[10px] text-success inline-flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Creds
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5 truncate font-mono">{repo.cloneUrl}</p>
                  {repo.techStack && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {repo.techStack.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-4 rounded-[var(--radius-md)] bg-error/10 border border-error/20">
          <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting || !name.trim()}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-md)] text-sm font-semibold transition-colors',
          submitting || !name.trim()
            ? 'bg-accent/40 text-white cursor-not-allowed'
            : 'bg-accent text-white hover:bg-accent/90',
        )}
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating…
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Create Project
          </>
        )}
      </button>
    </div>
  );
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
  const [repos, setRepos] = useState<RepoEntry[]>([emptyRepo()]);

  // Step 3 state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validation per step
  function canNext() {
    if (step === 0) return name.trim().length > 0;
    return true;
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      // Build metadata from context notes
      const metadata: Record<string, unknown> = {};
      if (context.trim()) metadata.context = context.trim();

      const project = await api.createProject({
        name: name.trim(),
        description: description.trim() || undefined,
        metadata,
      });

      // Create repos
      const validRepos = repos.filter((r) => r.cloneUrl.trim() || r.name.trim());
      const repoErrors: string[] = [];

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
        } catch (e) {
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
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text">New Project</h1>
        <p className="text-sm text-muted mt-0.5">
          Set up a new project and connect your repositories.
        </p>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Step content */}
      {step === 0 && (
        <StepProjectInfo
          name={name}
          description={description}
          context={context}
          onName={setName}
          onDescription={setDescription}
          onContext={setContext}
        />
      )}
      {step === 1 && <StepRepos repos={repos} onChange={setRepos} />}
      {step === 2 && (
        <StepReview
          name={name}
          description={description}
          context={context}
          repos={repos}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={error}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 0}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium transition-colors',
            step === 0
              ? 'text-muted cursor-not-allowed'
              : 'text-text hover:bg-[var(--color-hover)]',
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={handleNext}
            disabled={!canNext()}
            className={cn(
              'flex items-center gap-1.5 px-5 py-2 rounded-[var(--radius-md)] text-sm font-semibold transition-colors',
              canNext()
                ? 'bg-accent text-white hover:bg-accent/90'
                : 'bg-accent/40 text-white cursor-not-allowed',
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
