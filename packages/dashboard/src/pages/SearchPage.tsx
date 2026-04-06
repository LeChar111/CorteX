import { useState, useRef, useCallback } from 'react';
import {
  Search,
  Clock,
  Zap,
  Network,
  FileText,
  Loader2,
  RotateCcw,
  FolderOpen,
  Link2,
} from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { ProjectSelect } from '../components/ProjectSelect.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { ErrorBanner } from '../components/ErrorBanner.tsx';
import { useAsyncData } from '../hooks/useAsyncData.ts';

type SearchMode = 'hybrid' | 'semantic' | 'fulltext' | 'graph';

interface SearchResult {
  query: string;
  mode: SearchMode;
  response: string;
  timestamp: Date;
}

interface RecentQuery {
  query: string;
  mode: SearchMode;
  timestamp: Date;
}

const MODES: { id: SearchMode; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'hybrid',   label: 'Hybrid',    icon: Zap,      description: 'Best of semantic + full-text' },
  { id: 'semantic', label: 'Semantic',  icon: Network,  description: 'Vector similarity search' },
  { id: 'fulltext', label: 'Full-text', icon: FileText, description: 'Exact keyword matching' },
  { id: 'graph',    label: 'Graph',     icon: Network,  description: 'Graph-traversal context' },
];

function formatResponse(text: string) {
  // Preserve newlines, handle inline code and code blocks simply
  return text.split('\n').map((line, i) => (
    <span key={i} className="block">
      {line || <br />}
    </span>
  ));
}

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>('hybrid');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentQueries, setRecentQueries] = useState<RecentQuery[]>([]);
  const { data: projects } = useAsyncData(() => api.listProjects(), []);
  const projectList = projects ?? [];
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [includeLinked, setIncludeLinked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const runSearch = useCallback(async (q: string, m: SearchMode, projId?: string, linked?: boolean) => {
    if (!q.trim()) return;
    setLoading(true);
    setError(null);

    // Track in recent
    setRecentQueries((prev) => {
      const filtered = prev.filter((r) => r.query !== q || r.mode !== m);
      return [{ query: q, mode: m, timestamp: new Date() }, ...filtered].slice(0, 20);
    });

    try {
      const data = await api.query(q, m, projId || undefined, linked) as { response: string };
      setResult({
        query: q,
        mode: m,
        response: data.response ?? JSON.stringify(data, null, 2),
        timestamp: new Date(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query, mode, selectedProjectId, includeLinked);
  };

  const handleRecentClick = (rq: RecentQuery) => {
    setQuery(rq.query);
    setMode(rq.mode);
    runSearch(rq.query, rq.mode);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-6xl font-bold text-text">Knowledge Search</h1>
        <p className="mt-0.5 text-xl text-muted">Query your codebase knowledge base using natural language</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Hero search bar */}
          <div className="bg-card p-6">
            {/* Project filter bar */}
            <div className="flex items-center gap-3 mb-12 max-w-2xl mx-auto ">
              <FolderOpen className="size-8 text-muted flex-shrink-0" />
              <ProjectSelect
                value={selectedProjectId}
                onChange={(v) => {
                  setSelectedProjectId(v);
                  if (!v) setIncludeLinked(false);
                }}
                projects={projectList}
                className="flex-1 rounded-xs bg-bg border border-border-light px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
              {selectedProjectId && (
                <label className="flex items-center gap-1.5 text-sm text-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeLinked}
                    onChange={(e) => setIncludeLinked(e.target.checked)}
                    className="rounded border-border-light text-accent focus:ring-accent/30"
                  />
                  <Link2 className="h-3.5 w-3.5" />
                  Include linked
                </label>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-5">
              <div className="relative w-full max-w-2xl mx-auto rounded-full mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-light " />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask anything about your codebase…"
                  className="w-full rounded-xs bg-bg border border-border-light pl-12 pr-4 py-3.5 text-lg text-text placeholder:text-light focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                />
              </div>

              {/* Mode tabs */}
              <div className="flex items-center gap-1 bg-bg border border-border-light rounded-full p-1 ">
                {MODES.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMode(id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 text-sm rounded-full font-medium transition-colors',
                      mode === id
                        ? 'bg-accent text-white shadow-sm'
                        : 'text-muted hover:text-text hover:bg-hover',
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="flex items-center gap-2 rounded-[--radius-sm] mt-12 bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                {loading ? 'Searching…' : 'Search'}
              </button>
            </form>

            {/* Mode description */}
            <p className="mt-3 text-center text-xs text-muted">
              {MODES.find((m2) => m2.id === mode)?.description}
            </p>
          </div>

          {/* Error */}
          {error && <ErrorBanner message={error} />}

          {/* Result */}
          {result && !loading && (
            <div className="bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
              {/* Metadata bar */}
              <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-b border-border-light bg-bg text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5" />
                  <span className="font-mono text-text">{result.query}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-light px-2.5 py-0.5 font-medium text-accent">
                  {result.mode}
                </span>
                <span className="ml-auto flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>

              {/* Response body */}
              <div className="p-5">
                <div className="prose prose-sm max-w-none text-text leading-relaxed font-[var(--font-sans)] whitespace-pre-wrap">
                  {formatResponse(result.response)}
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light mb-4">
                <Search className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-base font-semibold text-text">Start searching</h3>
              <p className="mt-1 text-sm text-muted max-w-xs">
                Type a question about your codebase and select a search mode to get started.
              </p>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && <LoadingSkeleton lines={4} />}
        </div>

        {/* Recent Queries sidebar */}
        <div className="w-64 flex-shrink-0 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border-light">
            <Clock className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold text-text">Recent Queries</h2>
          </div>

          {recentQueries.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-xs text-muted">No queries yet in this session</p>
            </div>
          ) : (
            <div className="divide-y divide-border-light max-h-[600px] overflow-y-auto">
              {recentQueries.map((rq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecentClick(rq)}
                  className="w-full text-left px-4 py-3 hover:bg-hover transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs text-text font-medium line-clamp-2 flex-1">{rq.query}</p>
                    <RotateCcw className="h-3 w-3 text-muted group-hover:text-accent flex-shrink-0 mt-0.5 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-full bg-accent-light px-1.5 py-0.5 text-[10px] font-medium text-accent">
                      {rq.mode}
                    </span>
                    <span className="text-[10px] text-muted">
                      {rq.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
