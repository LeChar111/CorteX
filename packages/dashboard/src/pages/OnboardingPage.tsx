import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Server, MessageSquare, Link2, Lightbulb, HeartPulse } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import type { Project, ProjectLink, Annotation, HealthScore } from '../types.ts';

const STEPS = [
  { id: 1, label: 'Main Services', icon: Server },
  { id: 2, label: 'Communication', icon: MessageSquare },
  { id: 3, label: 'Dependencies', icon: Link2 },
  { id: 4, label: 'Key Decisions', icon: Lightbulb },
  { id: 5, label: 'Health', icon: HeartPulse },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const isActive = step.id === current;
        const isDone = step.id < current;
        return (
          <div key={step.id} className="flex items-center gap-2">
            {i > 0 && (
              <div className={cn('h-px w-8', isDone ? 'bg-accent' : 'bg-border-light')} />
            )}
            <div
              className={cn(
                'flex items-center justify-center h-9 w-9 rounded-full border-2 transition-colors',
                isActive
                  ? 'border-accent bg-accent text-white'
                  : isDone
                    ? 'border-accent bg-accent-light text-accent'
                    : 'border-border-light bg-hover text-muted',
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LoadingBlock() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 w-2/3 rounded bg-border-light" />
      <div className="h-4 w-full rounded bg-border-light" />
      <div className="h-4 w-5/6 rounded bg-border-light" />
      <div className="h-4 w-3/4 rounded bg-border-light" />
    </div>
  );
}

function ScoreCircleMini({ score }: { score: number }) {
  const color = score < 40 ? 'text-red-500' : score < 70 ? 'text-yellow-500' : 'text-green-500';
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-border-light" />
          <circle
            cx="48" cy="48" r="42" fill="none" strokeWidth="6" strokeLinecap="round"
            stroke="currentColor"
            className={color}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className={cn('absolute inset-0 flex items-center justify-center text-2xl font-bold', color)}>
          {score}
        </div>
      </div>
      <span className={cn('text-sm font-medium', color)}>
        {score < 40 ? 'Poor' : score < 70 ? 'Fair' : 'Good'}
      </span>
    </div>
  );
}

// Step content components

function StepServices({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.query(`What are the main services in project ${projectName}?`, 'mix', projectId)
      .then((r) => setContent(r.response))
      .catch((err) => setError(err instanceof Error ? err.message : 'Query failed'))
      .finally(() => setLoading(false));
  }, [projectId, projectName]);

  if (loading) return <LoadingBlock />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  return (
    <div className="prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap">
      {content}
    </div>
  );
}

function StepCommunication({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.query(`How do services communicate in project ${projectName}? What protocols and patterns are used?`, 'mix', projectId)
      .then((r) => setContent(r.response))
      .catch((err) => setError(err instanceof Error ? err.message : 'Query failed'))
      .finally(() => setLoading(false));
  }, [projectId, projectName]);

  if (loading) return <LoadingBlock />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  return (
    <div className="prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap">
      {content}
    </div>
  );
}

function StepDependencies({ projectId, projects }: { projectId: string; projects: Project[] }) {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.listProjectLinks(projectId)
      .then(setLinks)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load links'))
      .finally(() => setLoading(false));
  }, [projectId]);

  const projectName = (id: string) => projects.find((p) => p.id === id)?.name ?? id;

  if (loading) return <LoadingBlock />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (links.length === 0) {
    return <div className="text-sm text-muted py-4">No cross-project dependencies defined yet.</div>;
  }
  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div key={link.id} className="flex items-center gap-3 p-3 rounded-[--radius-sm] bg-hover border border-border-light">
          <Link2 className="h-4 w-4 text-accent flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-text">
              {projectName(link.sourceProjectId)} &rarr; {projectName(link.targetProjectId)}
            </div>
            <div className="text-xs text-muted">
              {link.linkType}{link.description ? ` — ${link.description}` : ''}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StepDecisions({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(true);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.listAnnotations({ projectId })
      .then((all) => setAnnotations(all.filter((a) => a.type === 'decision')))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load annotations'))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <LoadingBlock />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (annotations.length === 0) {
    return <div className="text-sm text-muted py-4">No architectural decisions documented yet.</div>;
  }
  return (
    <div className="space-y-3">
      {annotations.map((ann) => (
        <div key={ann.id} className="p-4 rounded-[--radius-sm] bg-hover border border-border-light">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            <span className="text-sm font-semibold text-text">{ann.entityName}</span>
            {ann.author && <span className="text-xs text-muted">by {ann.author}</span>}
          </div>
          <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{ann.content}</p>
          <div className="text-xs text-muted mt-2">
            {new Date(ann.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepHealth({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getHealthScore(projectId)
      .then(setHealth)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load health score'))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) return <LoadingBlock />;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!health) return null;

  const breakdownItems = [
    { label: 'Graph Coverage', value: health.breakdown.graphCoverage },
    { label: 'Orphan Ratio', value: health.breakdown.orphanRatio, inverted: true },
    { label: 'Complexity', value: health.breakdown.cyclomaticComplexity },
    { label: 'Cross-Project Coupling', value: health.breakdown.crossProjectCoupling },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start gap-6">
      <ScoreCircleMini score={health.score} />
      <div className="flex-1 space-y-3 w-full">
        {breakdownItems.map((item) => {
          const pct = Math.min(item.value, 100);
          const displayPct = item.inverted ? 100 - pct : pct;
          const barColor = displayPct < 40 ? 'bg-red-500' : displayPct < 70 ? 'bg-yellow-500' : 'bg-green-500';
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{item.label}</span>
                <span className="font-medium text-text">{item.value.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-border-light overflow-hidden">
                <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Entities', value: health.stats.totalEntities },
            { label: 'Relations', value: health.stats.totalRelations },
            { label: 'Orphans', value: health.stats.orphanEntities },
            { label: 'External', value: health.stats.externalRelations },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-[--radius-sm] bg-hover">
              <div className="text-lg font-bold text-text">{stat.value}</div>
              <div className="text-xs text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main page

export function OnboardingPage() {
  const { projectId: paramProjectId } = useParams<{ projectId?: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState(paramProjectId ?? '');
  const [step, setStep] = useState(1);

  useEffect(() => {
    api.listProjects().then((list) => {
      setProjects(list);
      if (!projectId && list.length > 0) {
        setProjectId(list[0].id);
      }
    }).catch(console.error);
  }, []);

  const selectedProject = projects.find((p) => p.id === projectId);

  const handleProjectChange = useCallback((id: string) => {
    setProjectId(id);
    setStep(1);
    navigate(id ? `/onboarding/${id}` : '/onboarding', { replace: true });
  }, [navigate]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">Onboarding</h1>
        <div className="w-64">
          <select
            value={projectId}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text"
          >
            <option value="">Select a project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!projectId && (
        <div className="py-16 text-center text-muted text-sm">
          Select a project to start the onboarding tour
        </div>
      )}

      {projectId && selectedProject && (
        <>
          {/* Step indicator */}
          <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-4">
            <StepIndicator current={step} />
            <div className="text-center mt-3">
              <span className="text-sm font-medium text-text">
                Step {step}: {STEPS[step - 1].label}
              </span>
            </div>
          </div>

          {/* Step content */}
          <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-6 min-h-[300px]">
            {step === 1 && <StepServices projectId={projectId} projectName={selectedProject.name} />}
            {step === 2 && <StepCommunication projectId={projectId} projectName={selectedProject.name} />}
            {step === 3 && <StepDependencies projectId={projectId} projects={projects} />}
            {step === 4 && <StepDecisions projectId={projectId} />}
            {step === 5 && <StepHealth projectId={projectId} />}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm font-medium text-text hover:bg-border-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-sm text-muted">{step} of {STEPS.length}</span>
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={step === STEPS.length}
              className="flex items-center gap-2 px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
