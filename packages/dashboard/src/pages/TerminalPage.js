import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, ChevronRight, Trash2, Activity, Search, FolderOpen, Scan, HelpCircle, Zap, List, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
const QUICK_COMMANDS = [
    { label: 'health', command: 'health', icon: Activity, description: 'Check all services health' },
    { label: 'status', command: 'status', icon: Zap, description: 'Scan job status' },
    { label: 'projects', command: 'projects', icon: FolderOpen, description: 'List all projects' },
    { label: 'events', command: 'events 20', icon: List, description: 'Recent events (limit 20)' },
    { label: 'query', command: 'query ', icon: Search, description: 'Query knowledge base' },
    { label: 'scan', command: 'scan ', icon: Scan, description: 'scan <projectId> <repoId>' },
    { label: 'help', command: 'help', icon: HelpCircle, description: 'Show all commands' },
    { label: 'clear', command: 'clear', icon: Trash2, description: 'Clear terminal' },
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
function mkLine(type, text) {
    return { id: lineCounter++, type, text };
}
function formatJson(data) {
    try {
        return JSON.stringify(data, null, 2);
    }
    catch {
        return String(data);
    }
}
export function TerminalPage() {
    const [lines, setLines] = useState([
        mkLine('info', 'Cortex Terminal — type "help" to get started'),
        mkLine('separator', ''),
    ]);
    const [input, setInput] = useState('');
    const [busy, setBusy] = useState(false);
    const [history, setHistory] = useState([]);
    const historyIdxRef = useRef(-1);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const pushLine = useCallback((line) => {
        setLines((prev) => [...prev, line]);
    }, []);
    const pushLines = useCallback((...newLines) => {
        setLines((prev) => [...prev, ...newLines]);
    }, []);
    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);
    const runCommand = useCallback(async (raw) => {
        const cmd = raw.trim();
        if (!cmd)
            return;
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
                const svcLines = Object.entries(data.services ?? {}).map(([name, svc]) => {
                    const s = svc;
                    return mkLine('output', `  ${name.padEnd(12)} ${s.status}${s.latency !== undefined ? `  (${s.latency}ms)` : ''}`);
                });
                pushLines(mkLine('output', `status: ${data.status}`), ...svcLines);
            }
            else if (verb === 'status') {
                const data = await api.getScanStatus();
                const scans = Array.isArray(data) ? data : [data];
                if (scans.length === 0) {
                    pushLine(mkLine('output', 'No active scan jobs'));
                }
                else {
                    scans.forEach((s) => {
                        pushLine(mkLine('output', `  [${s.id}] ${s.status}  branch=${s.branch ?? '—'}  mode=${s.mode ?? '—'}`));
                    });
                }
            }
            else if (verb === 'projects') {
                const projects = await api.listProjects();
                if (!projects.length) {
                    pushLine(mkLine('output', 'No projects found'));
                }
                else {
                    projects.forEach((p) => {
                        pushLine(mkLine('output', `  ${p.id}  ${p.name}${p.description ? `  — ${p.description}` : ''}`));
                    });
                }
            }
            else if (verb === 'events') {
                const limit = args[0] ? parseInt(args[0], 10) : 10;
                const events = await api.getEvents({ limit });
                const arr = Array.isArray(events) ? events : [];
                if (!arr.length) {
                    pushLine(mkLine('output', 'No events found'));
                }
                else {
                    arr.forEach((ev) => {
                        const ts = new Date(ev.createdAt).toLocaleString();
                        pushLine(mkLine('output', `  [${ts}] ${ev.type}  id=${ev.id}`));
                    });
                }
            }
            else if (verb === 'scan') {
                if (!args[0] || !args[1]) {
                    pushLine(mkLine('error', 'Usage: scan <projectId> <repoId> [branch] [mode]'));
                }
                else {
                    const result = await api.triggerScan({ projectId: args[0], repoId: args[1], branch: args[2], mode: args[3] });
                    pushLine(mkLine('output', formatJson(result)));
                }
            }
            else if (verb === 'query') {
                const text = args.join(' ');
                if (!text) {
                    pushLine(mkLine('error', 'Usage: query <text>'));
                }
                else {
                    pushLine(mkLine('info', `Querying: "${text}" …`));
                    const data = await api.query(text, 'hybrid');
                    const answer = data.response ?? formatJson(data);
                    answer.split('\n').forEach((l) => pushLine(mkLine('output', l)));
                }
            }
            else {
                pushLine(mkLine('error', `Unknown command: "${verb}". Type "help" for available commands.`));
            }
        }
        catch (err) {
            pushLine(mkLine('error', err instanceof Error ? err.message : String(err)));
        }
        finally {
            setBusy(false);
            pushLine(mkLine('separator', ''));
        }
    }, [pushLine, pushLines]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || busy)
            return;
        const cmd = input.trim();
        setHistory((prev) => [cmd, ...prev.filter((h) => h !== cmd)].slice(0, 100));
        historyIdxRef.current = -1;
        setInput('');
        runCommand(cmd);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const next = Math.min(historyIdxRef.current + 1, history.length - 1);
            historyIdxRef.current = next;
            if (history[next] !== undefined)
                setInput(history[next]);
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = Math.max(historyIdxRef.current - 1, -1);
            historyIdxRef.current = next;
            setInput(next === -1 ? '' : history[next] ?? '');
        }
    };
    const fillCommand = (command) => {
        setInput(command);
        inputRef.current?.focus();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-6xl font-bold text-text", children: "Terminal" }), _jsx("p", { className: "mt-0.5 text-xl text-muted", children: "Run Cortex CLI commands interactively" })] }), _jsxs("button", { onClick: () => setLines([mkLine('info', 'Terminal cleared'), mkLine('separator', '')]), className: "flex items-center gap-2 rounded-full border-2 border-border-light bg-card px-3 py-2 text-sm font-medium text-text hover:bg-hover transition-colors", children: [_jsx(Trash2, { className: "h-4 w-4 text-muted" }), "Clear"] })] }), _jsxs("div", { className: "flex gap-5 items-start", children: [_jsxs("div", { className: "flex-1 min-w-0 flex flex-col bg-sidebar rounded-[--radius-lg] border border-white/10 shadow-lg overflow-hidden", style: { minHeight: '500px', maxHeight: '75vh' }, onClick: () => inputRef.current?.focus(), children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/60", children: [_jsxs("div", { className: "flex gap-1.5", children: [_jsx("span", { className: "h-3 w-3 rounded-full bg-error/70" }), _jsx("span", { className: "h-3 w-3 rounded-full bg-warning/70" }), _jsx("span", { className: "h-3 w-3 rounded-full bg-success/70" })] }), _jsx("div", { className: "flex-1 flex justify-center", children: _jsxs("span", { className: "flex items-center gap-1.5 text-xs text-white/60 font-mono", children: [_jsx(Terminal, { className: "h-3.5 w-3.5" }), "cortex-terminal"] }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-0.5 font-mono text-sm bg-black/80", children: [lines.map((line) => {
                                        if (line.type === 'separator') {
                                            return _jsx("div", { className: "h-2" }, line.id);
                                        }
                                        return (_jsxs("div", { className: cn('leading-relaxed whitespace-pre-wrap break-all', line.type === 'command' && 'text-accent font-semibold', line.type === 'output' && 'text-white/80', line.type === 'error' && 'text-error', line.type === 'info' && 'text-white/40 italic'), children: [line.type === 'command' && (_jsx("span", { className: "text-white/40 mr-2 select-none", children: "cortex>" })), line.text] }, line.id));
                                    }), busy && (_jsxs("div", { className: "flex items-center gap-2 text-white/40 text-sm", children: [_jsx("span", { className: "inline-block h-2 w-2 rounded-full bg-accent animate-pulse" }), "Running\u2026"] })), _jsx("div", { ref: bottomRef })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex items-center gap-2 border-t border-white/40 bg-black/60 px-4 py-3", children: [_jsx(ChevronRight, { className: "h-4 w-4 text-accent flex-shrink-0" }), _jsx("span", { className: "text-white/40 font-mono text-sm select-none mr-1", children: "cortex>" }), _jsx("input", { ref: inputRef, type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, disabled: busy, autoFocus: true, placeholder: busy ? 'Running…' : 'Type a command…', className: "flex-1 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-50" })] })] }), _jsxs("div", { className: "w-56 flex-shrink-0 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-border-light", children: [_jsx(Zap, { className: "h-4 w-4 text-accent" }), _jsx("h2", { className: "text-sm font-semibold text-text", children: "Quick Commands" })] }), _jsx("div", { className: "p-2 space-y-1", children: QUICK_COMMANDS.map(({ label, command, icon: Icon, description }) => (_jsxs("button", { onClick: () => fillCommand(command), title: description, className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-[--radius-sm] text-sm text-text hover:bg-hover hover:text-accent transition-colors group text-left", children: [_jsx(Icon, { className: "h-4 w-4 text-muted group-hover:text-accent flex-shrink-0 transition-colors" }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-medium font-mono text-xs", children: label }), _jsx("p", { className: "text-[11px] text-muted truncate", children: description })] })] }, label))) }), history.length > 0 && (_jsxs(_Fragment, { children: [_jsx("div", { className: "mx-4 border-t border-border-light my-1" }), _jsxs("div", { className: "px-4 py-2", children: [_jsx("p", { className: "text-xs font-medium text-muted mb-1.5 uppercase tracking-wide", children: "History" }), _jsx("div", { className: "space-y-0.5 max-h-40 overflow-y-auto", children: history.slice(0, 10).map((h, i) => (_jsx("button", { onClick: () => fillCommand(h), className: "w-full text-left px-2 py-1 rounded text-xs font-mono text-muted hover:text-text hover:bg-hover transition-colors truncate block", title: h, children: h }, i))) })] })] }))] })] })] }));
}
