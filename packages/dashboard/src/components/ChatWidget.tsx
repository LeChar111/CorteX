import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Zap, Brain, Bot, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils.ts';

type ChatMode = 'auto' | 'fast' | 'smart' | 'agent';
type ResolvedMode = 'fast' | 'smart' | 'agent';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: ResolvedMode;
  model?: string;
  sources?: string[];
  timestamp: number;
}

interface Project {
  id: string;
  name: string;
}

const MODE_LABELS: Record<ChatMode, { label: string; icon: typeof Zap; color: string }> = {
  auto: { label: 'Auto', icon: Bot, color: 'text-muted' },
  fast: { label: 'Rapide', icon: Zap, color: 'text-warning' },
  smart: { label: 'Précis', icon: Brain, color: 'text-info' },
  agent: { label: 'Agent', icon: Bot, color: 'text-success' },
};

const STORAGE_KEY = 'cortex-chat-messages';
const MAX_MESSAGES = 100;
const API_KEY = 'dev-key-1';

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMessages(messages: Message[]) {
  const trimmed = messages.slice(-MAX_MESSAGES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('auto');
  const [projectId, setProjectId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [streamMeta, setStreamMeta] = useState<{ mode?: ResolvedMode; model?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load projects on mount
  useEffect(() => {
    fetch('/api/projects', { headers: { 'X-API-Key': API_KEY } })
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Persist messages
  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamContent]);

  // Focus input when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setStreaming(true);
    setStreamContent('');
    setStreamMeta({});

    try {
      const history = messages.slice(-10).map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'X-API-Key': API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          projectId: projectId || undefined,
          mode,
          history,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`API error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let meta: { mode?: ResolvedMode; model?: string } = {};
      let sources: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            continue;
          }
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);
              if (data.mode && data.model) {
                meta = data;
                setStreamMeta(data);
              } else if (data.text !== undefined) {
                fullContent += data.text;
                setStreamContent(fullContent);
              } else if (data.sources) {
                sources = data.sources;
              }
            } catch {
              // skip
            }
          }
        }
      }

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullContent,
        mode: meta.mode,
        model: meta.model,
        sources,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Erreur: ${err instanceof Error ? err.message : 'Connection failed'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setStreaming(false);
      setStreamContent('');
    }
  }, [input, streaming, messages, projectId, mode]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sidebar-active text-white shadow-lg hover:scale-105 transition-all duration-200"
        >
          <MessageCircle className="h-5 w-5" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex w-[400px] flex-col rounded border border-border bg-card shadow-lg"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
            <div className="flex items-center gap-2">
              <Brain className="size-7 text-accent" />
              <span className="font-semibold text-text text-2xl">Cortex Chat</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearHistory} className="rounded-lg px-2 py-1 text-xs text-muted hover:bg-bg-warm transition-colors">
                Effacer
              </button>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-muted hover:bg-bg-warm transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Project selector + mode */}
          <div className="flex items-center gap-2 border-b border-border-light px-4 py-2">
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="flex-1 rounded-lg border border-border-light bg-bg px-2 py-1 text-xs text-text outline-none"
            >
              <option value="">Tous les projets</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && !streaming && (
              <div className="flex h-full items-center justify-center text-sm text-muted">
                Posez une question sur votre codebase
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] rounded-xl px-3 py-2 text-sm',
                    msg.role === 'user'
                      ? 'bg-sidebar-active text-white'
                      : 'bg-bg text-text',
                  )}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  {msg.mode && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] opacity-60">
                      {msg.mode === 'fast' && <Zap className="h-3 w-3" />}
                      {msg.mode === 'smart' && <Brain className="h-3 w-3" />}
                      {msg.mode === 'agent' && <Bot className="h-3 w-3" />}
                      <span>{msg.mode} · {msg.model}</span>
                    </div>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {msg.sources.slice(0, 5).map((s, i) => (
                        <span key={i} className="rounded bg-card px-1 py-0.5 text-[10px] text-muted font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {streaming && streamContent && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl bg-bg px-3 py-2 text-sm text-text">
                  <p className="whitespace-pre-wrap break-words">{streamContent}</p>
                  {streamMeta.mode && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] opacity-60">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>{streamMeta.mode} · {streamMeta.model}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {streaming && !streamContent && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-bg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border-light px-4 py-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                disabled={streaming}
                className="flex-1 rounded-lg border border-border-light bg-bg px-3 py-2 text-sm text-text placeholder-light outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || streaming}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                  input.trim() && !streaming
                    ? 'bg-sidebar-active text-white hover:scale-105'
                    : 'bg-bg text-light cursor-not-allowed',
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
