import { useState } from 'react';
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
// Types
// ---------------------------------------------------------------------------
interface RepoEntry {
  id: string;
  cloneUrl: string;
  name: string;
  slug: string;
  provider: string;
  techStack: string;
  defaultBranch: string;
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
          <input
            type="text"
            value={repo.defaultBranch}
            onChange={(e) => onChange({ ...repo, defaultBranch: e.target.value })}
            placeholder="main"
            className={cn(inputCls, 'font-mono text-xs')}
          />
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
