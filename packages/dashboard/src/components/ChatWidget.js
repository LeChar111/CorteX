import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Zap, Brain, Bot, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils.ts';
const MODE_LABELS = {
    auto: { label: 'Auto', icon: Bot, color: 'text-muted' },
    fast: { label: 'Rapide', icon: Zap, color: 'text-warning' },
    smart: { label: 'Précis', icon: Brain, color: 'text-info' },
    agent: { label: 'Agent', icon: Bot, color: 'text-success' },
};
const STORAGE_KEY = 'cortex-chat-messages';
const MAX_MESSAGES = 100;
const API_KEY = 'dev-key-1';
function loadMessages() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function saveMessages(messages) {
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}
export function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState(loadMessages);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState('auto');
    const [projectId, setProjectId] = useState('');
    const [projects, setProjects] = useState([]);
    const [streaming, setStreaming] = useState(false);
    const [streamContent, setStreamContent] = useState('');
    const [streamMeta, setStreamMeta] = useState({});
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    // Load projects on mount
    useEffect(() => {
        fetch('/api/projects', { headers: { 'X-API-Key': API_KEY } })
            .then((r) => r.json())
            .then((data) => setProjects(Array.isArray(data) ? data : []))
            .catch(() => { });
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
        if (open)
            inputRef.current?.focus();
    }, [open]);
    const sendMessage = useCallback(async () => {
        const text = input.trim();
        if (!text || streaming)
            return;
        const userMsg = {
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
            let meta = {};
            let sources = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
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
                            }
                            else if (data.text !== undefined) {
                                fullContent += data.text;
                                setStreamContent(fullContent);
                            }
                            else if (data.sources) {
                                sources = data.sources;
                            }
                        }
                        catch {
                            // skip
                        }
                    }
                }
            }
            const assistantMsg = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: fullContent,
                mode: meta.mode,
                model: meta.model,
                sources,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
        }
        catch (err) {
            const errorMsg = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: `Erreur: ${err instanceof Error ? err.message : 'Connection failed'}`,
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, errorMsg]);
        }
        finally {
            setStreaming(false);
            setStreamContent('');
        }
    }, [input, streaming, messages, projectId, mode]);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };
    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem(STORAGE_KEY);
    };
    return (_jsxs(_Fragment, { children: [!open && (_jsx("button", { onClick: () => setOpen(true), className: "fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sidebar-active text-white shadow-lg hover:scale-105 transition-all duration-200", children: _jsx(MessageCircle, { className: "h-5 w-5" }) })), open && (_jsxs("div", { className: "fixed bottom-5 right-5 z-50 flex w-[400px] flex-col rounded border border-border bg-card shadow-lg", style: { height: '520px' }, children: [_jsxs("div", { className: "flex items-center justify-between border-b border-border-light px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Brain, { className: "size-7 text-accent" }), _jsx("span", { className: "font-semibold text-text text-2xl", children: "Cortex Chat" })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: clearHistory, className: "rounded-lg px-2 py-1 text-xs text-muted hover:bg-bg-warm transition-colors", children: "Effacer" }), _jsx("button", { onClick: () => setOpen(false), className: "rounded-lg p-1 text-muted hover:bg-bg-warm transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] })] }), _jsxs("div", { className: "flex items-center gap-2 border-b border-border-light px-4 py-2", children: [_jsxs("select", { value: projectId, onChange: (e) => setProjectId(e.target.value), className: "flex-1 rounded-lg border border-border-light bg-bg px-2 py-1 text-xs text-text outline-none", children: [_jsx("option", { value: "", children: "Tous les projets" }), projects.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] }), _jsx("div", { className: "flex items-center rounded-lg border border-border-light bg-bg", children: ['auto', 'fast', 'smart', 'agent'].map((m) => {
                                    const { label, color } = MODE_LABELS[m];
                                    return (_jsx("button", { onClick: () => setMode(m), className: cn('px-2 py-1 text-xs font-medium transition-colors', mode === m ? `${color} bg-bg-warm` : 'text-muted hover:text-text', m === 'auto' && 'rounded-l-lg', m === 'agent' && 'rounded-r-lg'), children: label }, m));
                                }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-3", children: [messages.length === 0 && !streaming && (_jsx("div", { className: "flex h-full items-center justify-center text-sm text-muted", children: "Posez une question sur votre codebase" })), messages.map((msg) => (_jsx("div", { className: cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start'), children: _jsxs("div", { className: cn('max-w-[85%] rounded-xl px-3 py-2 text-sm', msg.role === 'user'
                                        ? 'bg-sidebar-active text-white'
                                        : 'bg-bg text-text'), children: [_jsx("p", { className: "whitespace-pre-wrap break-words", children: msg.content }), msg.mode && (_jsxs("div", { className: "mt-1 flex items-center gap-1 text-[10px] opacity-60", children: [msg.mode === 'fast' && _jsx(Zap, { className: "h-3 w-3" }), msg.mode === 'smart' && _jsx(Brain, { className: "h-3 w-3" }), msg.mode === 'agent' && _jsx(Bot, { className: "h-3 w-3" }), _jsxs("span", { children: [msg.mode, " \u00B7 ", msg.model] })] })), msg.sources && msg.sources.length > 0 && (_jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: msg.sources.slice(0, 5).map((s, i) => (_jsx("span", { className: "rounded bg-card px-1 py-0.5 text-[10px] text-muted font-mono", children: s }, i))) }))] }) }, msg.id))), streaming && streamContent && (_jsx("div", { className: "flex justify-start", children: _jsxs("div", { className: "max-w-[85%] rounded-xl bg-bg px-3 py-2 text-sm text-text", children: [_jsx("p", { className: "whitespace-pre-wrap break-words", children: streamContent }), streamMeta.mode && (_jsxs("div", { className: "mt-1 flex items-center gap-1 text-[10px] opacity-60", children: [_jsx(Loader2, { className: "h-3 w-3 animate-spin" }), _jsxs("span", { children: [streamMeta.mode, " \u00B7 ", streamMeta.model] })] }))] }) })), streaming && !streamContent && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "rounded-xl bg-bg px-3 py-2", children: _jsx(Loader2, { className: "h-4 w-4 animate-spin text-muted" }) }) })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "border-t border-border-light px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { ref: inputRef, type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: "Posez votre question...", disabled: streaming, className: "flex-1 rounded-lg border border-border-light bg-bg px-3 py-2 text-sm text-text placeholder-light outline-none focus:border-accent transition-colors" }), _jsx("button", { onClick: sendMessage, disabled: !input.trim() || streaming, className: cn('flex h-9 w-9 items-center justify-center rounded-lg transition-all', input.trim() && !streaming
                                        ? 'bg-sidebar-active text-white hover:scale-105'
                                        : 'bg-bg text-light cursor-not-allowed'), children: _jsx(Send, { className: "h-4 w-4" }) })] }) })] }))] }));
}
