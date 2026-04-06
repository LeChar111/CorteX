import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { ProjectSelect } from '../components/ProjectSelect.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { ErrorBanner } from '../components/ErrorBanner.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { useAsyncData } from '../hooks/useAsyncData.ts';
import type { Project, ImpactResult, DriftResult, DeadCodeResult, HealthScore } from '../types.ts';

type Tab = 'impact' | 'drift' | 'dead-code' | 'health';

const TABS: { id: Tab; label: string }[] = [
  { id: 'impact', label: 'Impact Analysis' },
  { id: 'drift', label: 'Drift Detection' },
  { id: 'dead-code', label: 'Dead Code' },
  { id: 'health', label: 'Health Score' },
];

function ScoreCircle({ score }: { score: number }) {
  const color = score < 40 ? 'text-red-500' : score < 70 ? 'text-yellow-500' : 'text-green-500';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-border-light" />
          <circle
            cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round"
            stroke="currentColor"
            className={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={cn('absolute inset-0 flex items-center justify-center text-3xl font-bold', color)}>
          {score}
        </div>
      </div>
      <span className={cn('text-sm font-medium', color)}>
        {score < 40 ? 'Poor' : score < 70 ? 'Fair' : 'Good'}
      </span>
    </div>
  );
}

function BreakdownBar({ label, value, max, inverted }: { label: string; value: number; max: number; inverted?: boolean }) {
  const pct = Math.min((value / max) * 100, 100);
  const displayPct = inverted ? 100 - pct : pct;
  const barColor = displayPct < 40 ? 'bg-red-500' : displayPct < 70 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-text">{typeof value === 'number' ? (max === 100 ? `${value.toFixed(1)}%` : value.toFixed(1)) : value}</span>
      </div>
      <div className="h-2 rounded-full bg-border-light overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// --- Tab Components ---

function ImpactTab({ projects }: { projects: Project[] }) {
  const [filePath, setFilePath] = useState('');
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawOpen, setRawOpen] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filePath.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeImpact({ filePath: filePath.trim(), projectId: projectId || undefined });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleAnalyze} className="flex items-end gap-3">
        <div className="flex-1 space-y-5 ">
          <label className="text-md font-medium text-muted">File Path</label>
          <input
            type="text"
            value={filePath}
            onChange={(e) => setFilePath(e.target.value)}
            placeholder="src/services/user.ts"
            className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text"
          />
        </div>
        <div className="w-48 space-y-1">
          <label className="text-md font-medium text-muted">Project (optional)</label>
          <ProjectSelect value={projectId} onChange={setProjectId} projects={projects} />
        </div>
        <button
          type="submit"
          disabled={loading || !filePath.trim()}
          className="px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze'}
        </button>
      </form>

      {error && <ErrorBanner message={error} />}

      {!result && !loading && !error && (
        <EmptyState message="Enter a file path to analyze its impact" />
      )}

      {loading && <LoadingSkeleton />}

      {result && !loading && (
        <div className="space-y-4">
          {/* Direct Impact */}
          <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border-light">
              <h3 className="text-sm font-semibold text-text">Direct Impact</h3>
              <span className="text-xs text-muted">({result.directImpact.length})</span>
            </div>
            {result.directImpact.length === 0 ? (
              <div className="px-5 py-4 text-sm text-muted">No direct impact found</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Entity</th>
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">File</th>
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Project</th>
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {result.directImpact.map((item, i) => (
                    <tr key={i} className="hover:bg-hover transition-colors">
                      <td className="px-5 py-2.5 font-mono text-text">{item.entity}</td>
                      <td className="px-5 py-2.5 text-muted">{item.file}</td>
                      <td className="px-5 py-2.5 text-muted">{item.project}</td>
                      <td className="px-5 py-2.5">
                        <span className="inline-block rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">{item.type}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Transitive Impact */}
          <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border-light">
              <h3 className="text-sm font-semibold text-text">Transitive Impact</h3>
              <span className="text-xs text-muted">({result.transitiveImpact.length})</span>
            </div>
            {result.transitiveImpact.length === 0 ? (
              <div className="px-5 py-4 text-sm text-muted">No transitive impact found</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Entity</th>
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">File</th>
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Project</th>
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Depth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {result.transitiveImpact.map((item, i) => (
                    <tr key={i} className="hover:bg-hover transition-colors">
                      <td className="px-5 py-2.5 font-mono text-text">{item.entity}</td>
                      <td className="px-5 py-2.5 text-muted">{item.file}</td>
                      <td className="px-5 py-2.5 text-muted">{item.project}</td>
                      <td className="px-5 py-2.5">
                        <span className="inline-block rounded-full bg-hover px-2 py-0.5 text-xs font-medium text-text">{item.depth}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Cross-Project Impact */}
          {result.crossProjectImpact.length > 0 && (
            <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border-light">
                <h3 className="text-sm font-semibold text-text">Cross-Project Impact</h3>
                <span className="text-xs text-muted">({result.crossProjectImpact.length})</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Entity</th>
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">File</th>
                    <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Project</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {result.crossProjectImpact.map((item, i) => (
                    <tr key={i} className="hover:bg-hover transition-colors">
                      <td className="px-5 py-2.5 font-mono text-text">{item.entity}</td>
                      <td className="px-5 py-2.5 text-muted">{item.file}</td>
                      <td className="px-5 py-2.5 text-muted">{item.project}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Raw Analysis */}
          {result.rawAnalysis && (
            <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
              <button
                onClick={() => setRawOpen(!rawOpen)}
                className="flex items-center gap-2 w-full px-5 py-4 text-left hover:bg-hover transition-colors"
              >
                {rawOpen ? <ChevronDown className="h-4 w-4 text-muted" /> : <ChevronRight className="h-4 w-4 text-muted" />}
                <h3 className="text-sm font-semibold text-text">Raw Analysis</h3>
              </button>
              {rawOpen && (
                <div className="px-5 pb-5 border-t border-border-light pt-4">
                  <div className="prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap">
                    {result.rawAnalysis}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DriftTab({ projects }: { projects: Project[] }) {
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DriftResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDetect = async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeDrift(projectId);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Drift detection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end gap-3">
        <div className="w-64 space-y-1">
          {/* <label className="text-x font-medium text-muted">Project</label> */}
          <ProjectSelect value={projectId} onChange={setProjectId} projects={projects} required />
        </div>
        <button
          onClick={handleDetect}
          disabled={loading || !projectId}
          className="px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Detect Drift'}
        </button>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && <LoadingSkeleton />}

      {result && !loading && (
        <div className="space-y-4">
          <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border-light">
              <h3 className="text-sm font-semibold text-text">{result.projectName}</h3>
              <span className="inline-block rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent">
                {result.currentState.entityCount} entities
              </span>
            </div>

            {/* Analysis */}
            <div className="px-5 py-4 border-b border-border-light">
              <div className="prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap">
                {result.analysis}
              </div>
            </div>

            {/* Entity badges */}
            {result.currentState.entities.length > 0 && (
              <div className="px-5 py-4">
                <p className="text-xs font-medium text-muted mb-2">Entities</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.currentState.entities.map((ent, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-hover px-2.5 py-1 text-xs text-text">
                      <span className="font-medium">{ent.name}</span>
                      <span className="text-muted">({ent.type})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <EmptyState message="Select a project and click &quot;Detect Drift&quot; to analyze" />
      )}
    </div>
  );
}

function DeadCodeTab({ projects }: { projects: Project[] }) {
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeadCodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) { setResult(null); return; }
    setLoading(true);
    setError(null);
    api.analyzeDeadCode(projectId)
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dead code'))
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-64 space-y-1">
          {/* <label className="text-xs font-medium text-muted">Project</label> */}
          <ProjectSelect value={projectId} onChange={setProjectId} projects={projects} required />
        </div>
        {result && (
          <span className="mt-5 inline-flex items-center gap-1 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent">
            {result.count} unreferenced / {result.totalEntities} total
          </span>
        )}
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && <LoadingSkeleton />}

      {result && !loading && (
        <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
          {result.unreferencedEntities.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted">No unreferenced entities found</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Name</th>
                  <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">Type</th>
                  <th className="text-left px-5 py-2 text-muted uppercase text-xs font-medium">File</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {result.unreferencedEntities.map((item, i) => (
                  <tr key={i} className="hover:bg-hover transition-colors">
                    <td className="px-5 py-2.5 font-mono text-text">{item.name}</td>
                    <td className="px-5 py-2.5">
                      <span className="inline-block rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">{item.type}</span>
                    </td>
                    <td className="px-5 py-2.5 text-muted">{item.file}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {!projectId && !loading && !error && (
        <EmptyState message="Select a project to detect dead code" />
      )}
    </div>
  );
}

function HealthTab({ projects }: { projects: Project[] }) {
  const [projectId, setProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HealthScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) { setResult(null); return; }
    setLoading(true);
    setError(null);
    api.getHealthScore(projectId)
      .then(setResult)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load health score'))
      .finally(() => setLoading(false));
  }, [projectId]);

  return (
    <div className="space-y-5">
      <div className="w-64 space-y-1">
        {/* <label className="text-xs font-medium text-muted">Project</label> */}
        <ProjectSelect value={projectId} onChange={setProjectId} projects={projects} required />
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && <LoadingSkeleton />}

      {result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Score circle */}
          <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-6 flex items-center justify-center">
            <ScoreCircle score={result.score} />
          </div>

          {/* Breakdown */}
          <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border-light">
              <h3 className="text-sm font-semibold text-text">Breakdown</h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              <BreakdownBar label="Graph Coverage" value={result.breakdown.graphCoverage} max={100} />
              <BreakdownBar label="Orphan Ratio" value={result.breakdown.orphanRatio} max={100} inverted />
              <BreakdownBar label="Complexity" value={result.breakdown.cyclomaticComplexity} max={100} />
              <BreakdownBar label="Cross-Project Coupling" value={result.breakdown.crossProjectCoupling} max={100} />
            </div>
          </div>

          {/* Stats */}
          <div className="md:col-span-2 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border-light">
              <h3 className="text-sm font-semibold text-text">Statistics</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border-light">
              {[
                { label: 'Total Entities', value: result.stats.totalEntities },
                { label: 'Total Relations', value: result.stats.totalRelations },
                { label: 'Orphan Entities', value: result.stats.orphanEntities },
                { label: 'External Relations', value: result.stats.externalRelations },
              ].map((stat) => (
                <div key={stat.label} className="px-5 py-4 text-center">
                  <div className="text-2xl font-bold text-text">{stat.value}</div>
                  <div className="text-xs text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!projectId && !loading && !error && (
        <EmptyState message="Select a project to view its health score" />
      )}
    </div>
  );
}

// --- Main Page ---

export function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<Tab>('impact');
  const { data: projects } = useAsyncData(() => api.listProjects(), []);
  const projectList = projects ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-6xl font-bold text-text">Analysis</h1>

      {/* Tab navigation */}
      <div className="bg-card mt-10 overflow-hidden">
        <div className="flex border-b border-border-light">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-xl font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-text'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'impact' && <ImpactTab projects={projectList} />}
          {activeTab === 'drift' && <DriftTab projects={projectList} />}
          {activeTab === 'dead-code' && <DeadCodeTab projects={projectList} />}
          {activeTab === 'health' && <HealthTab projects={projectList} />}
        </div>
      </div>
    </div>
  );
}
