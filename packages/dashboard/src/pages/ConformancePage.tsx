import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, ShieldCheck, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { ProjectSelect } from '../components/ProjectSelect.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { ErrorBanner } from '../components/ErrorBanner.tsx';
import { useAsyncData } from '../hooks/useAsyncData.ts';
import type { ArchRule, ConformanceResult } from '../types.ts';

const SEVERITY_STYLES: Record<string, string> = {
  error: 'bg-error-light text-error',
  warning: 'bg-warning/10 text-warning',
  info: 'bg-accent-light text-accent',
};

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className={cn('inline-block rounded-full px-2 py-0.5 text-xs font-medium', SEVERITY_STYLES[severity] || SEVERITY_STYLES.info)}>
      {severity}
    </span>
  );
}

function RuleCard({ rule, onDelete }: { rule: ArchRule; onDelete: () => void }) {
  return (
    <div className="group flex items-start gap-3 px-5 py-4 hover:bg-hover transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-text">{rule.name}</span>
          <SeverityBadge severity={rule.severity} />
        </div>
        <p className="text-xs font-mono text-muted">
          {rule.rule.source} &rarr; {rule.rule.target} ({rule.rule.relation || '*'}): {rule.rule.allow ? 'ALLOWED' : 'BLOCKED'}
        </p>
        {rule.description && (
          <p className="text-xs text-muted mt-1">{rule.description}</p>
        )}
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-[--radius-sm] text-muted hover:text-error hover:bg-error-light transition-all"
        title="Delete rule"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function AddRuleForm({ projectId, onCreated }: { projectId: string; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [relation, setRelation] = useState('*');
  const [allow, setAllow] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !source.trim() || !target.trim()) return;
    setLoading(true);
    try {
      await api.createArchRule({
        projectId: projectId || undefined,
        name: name.trim(),
        rule: { source: source.trim(), target: target.trim(), relation: relation.trim() || '*', allow },
        severity,
        description: description.trim() || undefined,
      });
      setName(''); setSource(''); setTarget(''); setRelation('*'); setAllow(false); setSeverity('error'); setDescription('');
      setOpen(false);
      onCreated();
    } catch (err) {
      console.error('Failed to create rule:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-border-light">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full px-5 py-3 text-left hover:bg-hover transition-colors"
      >
        {open ? <ChevronDown className="h-4 w-4 text-muted" /> : <ChevronRight className="h-4 w-4 text-muted" />}
        <Plus className="h-3.5 w-3.5 text-accent" />
        <span className="text-sm font-medium text-accent">Add Rule</span>
      </button>
      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="No direct DB access from frontend"
                className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text"
              >
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted">Source pattern</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="frontend/.*"
                className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted">Target pattern</label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder=".*database.*"
                className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text font-mono"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted">Relation type</label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="*"
                className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text font-mono"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={allow}
                onChange={(e) => setAllow(e.target.checked)}
                className="rounded border-border-light"
              />
              <span className="text-xs font-medium text-text">Allow (uncheck = block)</span>
            </label>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this rule exists..."
              rows={2}
              className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim() || !source.trim() || !target.trim()}
            className="px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Rule'}
          </button>
        </form>
      )}
    </div>
  );
}

export function ConformancePage() {
  const { data: projects } = useAsyncData(() => api.listProjects(), []);
  const projectList = projects ?? [];
  const [projectId, setProjectId] = useState('');
  const [rules, setRules] = useState<ArchRule[]>([]);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<ConformanceResult | null>(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const loadRules = () => {
    setRulesLoading(true);
    api.listArchRules(projectId || undefined)
      .then(setRules)
      .catch(console.error)
      .finally(() => setRulesLoading(false));
  };

  useEffect(() => {
    loadRules();
    setCheckResult(null);
    setCheckError(null);
  }, [projectId]);

  const handleDelete = async (id: string) => {
    try {
      await api.deleteArchRule(id);
      loadRules();
    } catch (err) {
      console.error('Failed to delete rule:', err);
    }
  };

  const handleCheck = async () => {
    if (!projectId) return;
    setCheckLoading(true);
    setCheckError(null);
    try {
      const result = await api.checkConformance(projectId);
      setCheckResult(result);
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : 'Conformance check failed');
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShieldCheck className="size-13 text-accent" />
        <h1 className="text-6xl font-bold text-text">Conformance</h1>
      </div>

      {/* Project selector */}
      <div className="w-64 space-y-5">
        <ProjectSelect
          value={projectId}
          onChange={setProjectId}
          projects={projectList}
          className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text"
        />
      </div>

      {/* Section 1: Architecture Rules */}
      <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border-light">
          <h2 className="text-sm font-semibold text-text">Architecture Rules</h2>
          <span className="text-xs text-muted">({rules.length})</span>
        </div>

        {rulesLoading ? (
          <div className="p-5"><LoadingSkeleton lines={2} /></div>
        ) : rules.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted">
            No architecture rules defined yet
          </div>
        ) : (
          <div className="divide-y divide-border-light">
            {rules.map((rule) => (
              <RuleCard key={rule.id} rule={rule} onDelete={() => handleDelete(rule.id)} />
            ))}
          </div>
        )}

        <AddRuleForm projectId={projectId} onCreated={loadRules} />
      </div>

      {/* Section 2: Conformance Check */}
      <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
          <h2 className="text-sm font-semibold text-text">Conformance Check</h2>
          <button
            onClick={handleCheck}
            disabled={checkLoading || !projectId || rules.length === 0}
            className="px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Run Check'}
          </button>
        </div>

        {checkError && (
          <div className="mx-5 my-4"><ErrorBanner message={checkError} /></div>
        )}

        {checkLoading && (
          <div className="p-5"><LoadingSkeleton /></div>
        )}

        {checkResult && !checkLoading && (
          <div className="p-5 space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-900/20 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {checkResult.passed} passed
              </span>
              {checkResult.failed > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-error-light px-3 py-1 text-xs font-medium text-error">
                  {checkResult.failed} violations
                </span>
              )}
            </div>

            {/* Violations table */}
            {checkResult.violations.length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left px-3 py-2 text-muted uppercase text-xs font-medium">Rule</th>
                    <th className="text-left px-3 py-2 text-muted uppercase text-xs font-medium">Severity</th>
                    <th className="text-left px-3 py-2 text-muted uppercase text-xs font-medium">Source</th>
                    <th className="text-left px-3 py-2 text-muted uppercase text-xs font-medium">Target</th>
                    <th className="text-left px-3 py-2 text-muted uppercase text-xs font-medium">Relation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {checkResult.violations.map((v, i) => (
                    <tr key={i} className="hover:bg-hover transition-colors">
                      <td className="px-3 py-2.5 font-medium text-text">{v.rule}</td>
                      <td className="px-3 py-2.5"><SeverityBadge severity={v.severity} /></td>
                      <td className="px-3 py-2.5 font-mono text-muted text-xs">{v.source}</td>
                      <td className="px-3 py-2.5 font-mono text-muted text-xs">{v.target}</td>
                      <td className="px-3 py-2.5 text-muted">{v.relation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center gap-2 rounded-[--radius-sm] border border-green-300 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                All rules passed! No violations detected.
              </div>
            )}
          </div>
        )}

        {!checkResult && !checkLoading && !checkError && (
          <div className="px-5 py-8 text-center text-sm text-muted">
            {!projectId
              ? 'Select a project to run conformance checks'
              : rules.length === 0
                ? 'Add architecture rules first, then run a check'
                : 'Click "Run Check" to validate architecture rules'}
          </div>
        )}
      </div>
    </div>
  );
}
