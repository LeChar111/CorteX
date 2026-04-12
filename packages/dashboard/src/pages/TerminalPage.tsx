import { useState, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import {
  Terminal,
  ChevronRight,
  Trash2,
  Activity,
  Search,
  FolderOpen,
  Scan,
  HelpCircle,
  Zap,
  List,
} from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';

interface TerminalLine {
  id: number;
  type: 'command' | 'output' | 'error' | 'info' | 'separator';
  text: string;
}

interface QuickCommand {
  label: string;
  command: string;
  icon: React.ElementType;
  description: string;
}

const QUICK_COMMANDS: QuickCommand[] = [
  { label: 'health',    command: 'health',         icon: Activity,   description: 'Check all services health' },
  { label: 'status',    command: 'status',          icon: Zap,        description: 'Scan job status' },
  { label: 'projects',  command: 'projects',        icon: FolderOpen, description: 'List all projects' },
  { label: 'events',    command: 'events 20',       icon: List,       description: 'Recent events (limit 20)' },
  { label: 'query',     command: 'query ',          icon: Search,     description: 'Query knowledge base' },
  { label: 'scan',      command: 'scan ',            icon: Scan,       description: 'scan <projectId> <repoId>' },
  { label: 'help',      command: 'help',             icon: HelpCircle, description: 'Show all commands' },
  { label: 'clear',     command: 'clear',            icon: Trash2,     description: 'Clear terminal' },
];

const HELP_TEXT = `
Available commands:
  health                  Check infrastructure health status
  status                  Show current scan job status
  projects                List all projects
  events [limit]          Show recent events (default: 10)
  scan <projectId> <repoId> [branch] [mode]   Trigger a scan
  query <text>            Query the knowledge base (hybrid mode)
  help                    Show this help message
  clear                   Clear the terminal

Use ↑ / ↓ arrows to navigate command history.
`.trim();

let lineCounter = 0;
function mkLine(type: TerminalLine['type'], text: string): TerminalLine {
  return { id: lineCounter++, type, text };
}

function formatJson(data: unknown): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

interface TerminalPageProps {
  hideHeader?: boolean;
}

export function TerminalPage({ hideHeader = false }: TerminalPageProps) {
  const [lines, setLines] = useState<TerminalLine[]>([
    mkLine('info', 'Cortex Terminal — type "help" to get started'),
    mkLine('separator', ''),
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const historyIdxRef = useRef<number>(-1);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pushLine = useCallback((line: TerminalLine) => {
    setLines((prev) => [...prev, line]);
  }, []);

  const pushLines = useCallback((...newLines: TerminalLine[]) => {
    setLines((prev) => [...prev, ...newLines]);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const runCommand = useCallback(async (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;

    pushLine(mkLine('command', cmd));

    const parts = cmd.split(/\s+/);
    const verb = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (verb === 'clear') {
      setLines([mkLine('info', 'Terminal cleared'), mkLine('separator', '')]);
      return;
    }

    if (verb === 'help') {
      HELP_TEXT.split('\n').forEach((l) => pushLine(mkLine('output', l)));
      return;
    }

    setBusy(true);
    try {
      if (verb === 'health') {
        const data = await api.health();
        const svcLines = Object.entries(data.services ?? {}).map(
          ([name, svc]: [string, unknown]) => {
            const s = svc as { status: string; latency?: number };
            return mkLine('output', `  ${name.padEnd(12)} ${s.status}${s.latency !== undefined ? `  (${s.latency}ms)` : ''}`);
          },
        );
        pushLines(
          mkLine('output', `status: ${data.status}`),
          ...svcLines,
        );
      } else if (verb === 'status') {
        const data = await api.getScanStatus();
        const scans = Array.isArray(data) ? data : [data];
        if (scans.length === 0) {
          pushLine(mkLine('output', 'No active scan jobs'));
        } else {
          scans.forEach((s: { id: string; status: string; branch?: string; mode?: string }) => {
            pushLine(mkLine('output', `  [${s.id}] ${s.status}  branch=${s.branch ?? '—'}  mode=${s.mode ?? '—'}`));
          });
        }
      } else if (verb === 'projects') {
        const projects = await api.listProjects();
        if (!projects.length) {
          pushLine(mkLine('output', 'No projects found'));
        } else {
          projects.forEach((p: { id: string; name: string; description: string | null }) => {
            pushLine(mkLine('output', `  ${p.id}  ${p.name}${p.description ? `  — ${p.description}` : ''}`));
          });
        }
      } else if (verb === 'events') {
        const limit = args[0] ? parseInt(args[0], 10) : 10;
        const events = await api.getEvents({ limit });
        const arr = Array.isArray(events) ? events : [];
        if (!arr.length) {
          pushLine(mkLine('output', 'No events found'));
        } else {
          arr.forEach((ev: { id: string; type: string; createdAt: string }) => {
            const ts = new Date(ev.createdAt).toLocaleString();
            pushLine(mkLine('output', `  [${ts}] ${ev.type}  id=${ev.id}`));
          });
        }
      } else if (verb === 'scan') {
        if (!args[0] || !args[1]) {
          pushLine(mkLine('error', 'Usage: scan <projectId> <repoId> [branch] [mode]'));
        } else {
          const result = await api.triggerScan({ projectId: args[0], repoId: args[1], branch: args[2], mode: args[3] });
          pushLine(mkLine('output', formatJson(result)));
        }
      } else if (verb === 'query') {
        const text = args.join(' ');
        if (!text) {
          pushLine(mkLine('error', 'Usage: query <text>'));
        } else {
          pushLine(mkLine('info', `Querying: "${text}" …`));
          const data = await api.query(text, 'hybrid');
          const answer = data.response ?? formatJson(data);
          answer.split('\n').forEach((l: string) => pushLine(mkLine('output', l)));
        }
      } else {
        pushLine(mkLine('error', `Unknown command: "${verb}". Type "help" for available commands.`));
      }
    } catch (err) {
      pushLine(mkLine('error', err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
      pushLine(mkLine('separator', ''));
    }
  }, [pushLine, pushLines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;
    const cmd = input.trim();
    setHistory((prev) => [cmd, ...prev.filter((h) => h !== cmd)].slice(0, 100));
    historyIdxRef.current = -1;
    setInput('');
    runCommand(cmd);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdxRef.current + 1, history.length - 1);
      historyIdxRef.current = next;
      if (history[next] !== undefined) setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdxRef.current - 1, -1);
      historyIdxRef.current = next;
      setInput(next === -1 ? '' : history[next] ?? '');
    }
  };

  const fillCommand = (command: string) => {
    setInput(command);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-bold text-text">Terminal</h1>
            <p className="mt-0.5 text-xl text-muted">Run Cortex CLI commands interactively</p>
          </div>
          <button
            onClick={() => setLines([mkLine('info', 'Terminal cleared'), mkLine('separator', '')])}
            className="flex items-center gap-2 rounded-full border-2 border-border-light bg-card px-3 py-2 text-sm font-medium text-text hover:bg-hover transition-colors"
          >
            <Trash2 className="h-4 w-4 text-muted" />
            Clear
          </button>
        </div>
      )}

      <div className="flex gap-5 items-start">
        {/* Terminal card */}
        <div
          className="flex-1 min-w-0 flex flex-col bg-sidebar rounded-[--radius-lg] border border-white/10 shadow-lg overflow-hidden"
          style={{ minHeight: '500px', maxHeight: '75vh' }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/60">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-error/70" />
              <span className="h-3 w-3 rounded-full bg-warning/70" />
              <span className="h-3 w-3 rounded-full bg-success/70" />
            </div>
            <div className="flex-1 flex justify-center">
              <span className="flex items-center gap-1.5 text-xs text-white/60 font-mono">
                <Terminal className="h-3.5 w-3.5" />
                cortex-terminal
              </span>
            </div>
          </div>

          {/* Output area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-0.5 font-mono text-sm bg-black/80">
            {lines.map((line) => {
              if (line.type === 'separator') {
                return <div key={line.id} className="h-2" />;
              }
              return (
                <div
                  key={line.id}
                  className={cn(
                    'leading-relaxed whitespace-pre-wrap break-all',
                    line.type === 'command' && 'text-accent font-semibold',
                    line.type === 'output'  && 'text-white/80',
                    line.type === 'error'   && 'text-error',
                    line.type === 'info'    && 'text-white/40 italic',
                  )}
                >
                  {line.type === 'command' && (
                    <span className="text-white/40 mr-2 select-none">cortex&gt;</span>
                  )}
                  {line.text}
                </div>
              );
            })}

            {busy && (
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
                Running…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input line */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-white/40 bg-black/60 px-4 py-3"
          >
            <ChevronRight className="h-4 w-4 text-accent flex-shrink-0" />
            <span className="text-white/40 font-mono text-sm select-none mr-1">cortex&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={busy}
              autoFocus
              placeholder={busy ? 'Running…' : 'Type a command…'}
              className="flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-50"
            />
          </form>
        </div>

        {/* Quick Commands sidebar */}
        <div className="w-56 flex-shrink-0 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border-light">
            <Zap className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold text-text">Quick Commands</h2>
          </div>

          <div className="p-2 space-y-1">
            {QUICK_COMMANDS.map(({ label, command, icon: Icon, description }) => (
              <button
                key={label}
                onClick={() => fillCommand(command)}
                title={description}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[--radius-sm] text-sm text-text hover:bg-hover hover:text-accent transition-colors group text-left"
              >
                <Icon className="h-4 w-4 text-muted group-hover:text-accent flex-shrink-0 transition-colors" />
                <div className="min-w-0">
                  <p className="font-medium font-mono text-xs">{label}</p>
                  <p className="text-[11px] text-muted truncate">{description}</p>
                </div>
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <>
              <div className="mx-4 border-t border-border-light my-1" />
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-muted mb-1.5 uppercase tracking-wide">History</p>
                <div className="space-y-0.5 max-h-40 overflow-y-auto">
                  {history.slice(0, 10).map((h, i) => (
                    <button
                      key={i}
                      onClick={() => fillCommand(h)}
                      className="w-full text-left px-2 py-1 rounded text-xs font-mono text-muted hover:text-text hover:bg-hover transition-colors truncate block"
                      title={h}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
