import { useEffect, useState } from 'react';
import { MessageCircle, X, Zap, Brain, Bot } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { CortexRuntimeProvider, type ChatMode } from '../chat/runtime.tsx';
import { Thread } from '../chat/Thread.tsx';

const API_KEY = 'dev-key-1';
const API_BASE =
  typeof window !== 'undefined' && window.location.port === '5173'
    ? `${window.location.protocol}//${window.location.hostname}:3100`
    : '';

const MODE_LABELS: Record<ChatMode, { label: string; icon: typeof Zap; color: string }> = {
  auto: { label: 'Auto', icon: Bot, color: 'text-muted' },
  fast: { label: 'Rapide', icon: Zap, color: 'text-warning' },
  smart: { label: 'Précis', icon: Brain, color: 'text-info' },
  agent: { label: 'Agent', icon: Bot, color: 'text-success' },
};

interface Project {
  id: string;
  name: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('auto');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [meta, setMeta] = useState<{ mode?: string; model?: string }>({});
  const [error, setError] = useState<string | null>(null);
  // Incrementing this key remounts the runtime provider → clears history.
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    fetch(`${API_BASE}/api/projects`, { headers: { 'X-API-Key': API_KEY } })
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const clearHistory = () => {
    setResetKey((k) => k + 1);
    setMeta({});
    setError(null);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sidebar-active text-white shadow-lg hover:scale-105 transition-all duration-200"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}

      {open && (
        <div
          className="fixed bottom-5 right-5 z-50 flex w-[400px] flex-col rounded border border-border bg-card shadow-lg"
          style={{ height: '520px' }}
        >
          <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
            <div className="flex items-center gap-2">
              <Brain className="size-7 text-accent" />
              <span className="font-semibold text-text text-2xl">Cortex Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                className="rounded-lg px-2 py-1 text-xs text-muted hover:bg-bg-warm transition-colors"
              >
                Effacer
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-muted hover:bg-bg-warm transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-border-light px-4 py-2">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="flex-1 rounded-lg border border-border-light bg-bg px-2 py-1 text-xs text-text outline-none"
            >
              <option value="">Tous les projets</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="flex items-center rounded-lg border border-border-light bg-bg">
              {(['auto', 'fast', 'smart', 'agent'] as const).map((m) => {
                const { label, color } = MODE_LABELS[m];
                return (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      'px-2 py-1 text-xs font-medium transition-colors',
                      mode === m ? `${color} bg-bg-warm` : 'text-muted hover:text-text',
                      m === 'auto' && 'rounded-l-lg',
                      m === 'agent' && 'rounded-r-lg',
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {meta.model && (
            <div className="border-b border-border-light px-4 py-1 text-[10px] text-muted">
              {meta.mode} · {meta.model}
            </div>
          )}

          {error && (
            <div className="border-b border-border-light bg-red-50 px-4 py-2 text-xs text-red-700">
              ❌ {error}
            </div>
          )}

          <div className="flex-1 overflow-hidden">
            <CortexRuntimeProvider
              key={resetKey}
              projectId={projectId}
              mode={mode}
              onMeta={setMeta}
              onError={setError}
            >
              <Thread />
            </CortexRuntimeProvider>
          </div>
        </div>
      )}
    </>
  );
}
