import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useCallback } from 'react';
import { Search, Clock, Zap, Network, FileText, Loader2, RotateCcw, FolderOpen, Link2, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { ProjectSelect } from '../components/ProjectSelect.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { ErrorBanner } from '../components/ErrorBanner.tsx';
import { useAsyncData } from '../hooks/useAsyncData.ts';
const MODES = [
    { id: 'hybrid', label: 'Hybrid', icon: Zap, description: 'Best of semantic + full-text' },
    { id: 'semantic', label: 'Semantic', icon: Network, description: 'Vector similarity search' },
    { id: 'fulltext', label: 'Full-text', icon: FileText, description: 'Exact keyword matching' },
    { id: 'graph', label: 'Graph', icon: Network, description: 'Graph-traversal context' },
];
function formatResponse(text) {
    // Preserve newlines, handle inline code and code blocks simply
    return text.split('\n').map((line, i) => (_jsx("span", { className: "block", children: line || _jsx("br", {}) }, i)));
}
export function SearchPage() {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('hybrid');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [recentQueries, setRecentQueries] = useState([]);
    const { data: projects } = useAsyncData(() => api.listProjects(), []);
    const projectList = projects ?? [];
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [includeLinked, setIncludeLinked] = useState(false);
    const inputRef = useRef(null);
    const runSearch = useCallback(async (q, m, projId, linked) => {
        if (!q.trim())
            return;
        setLoading(true);
        setError(null);
        // Track in recent
        setRecentQueries((prev) => {
            const filtered = prev.filter((r) => r.query !== q || r.mode !== m);
            return [{ query: q, mode: m, timestamp: new Date() }, ...filtered].slice(0, 20);
        });
        try {
            const data = await api.query(q, m, projId || undefined, linked);
            setResult({
                query: q,
                mode: m,
                response: data.response ?? JSON.stringify(data, null, 2),
                timestamp: new Date(),
            });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Query failed');
        }
        finally {
            setLoading(false);
        }
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        runSearch(query, mode, selectedProjectId, includeLinked);
    };
    const handleRecentClick = (rq) => {
        setQuery(rq.query);
        setMode(rq.mode);
        runSearch(rq.query, rq.mode);
        inputRef.current?.focus();
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-6xl font-bold text-text", children: "Knowledge Search" }), _jsx("p", { className: "mt-0.5 text-xl text-muted", children: "Query your codebase knowledge base using natural language" })] }), _jsxs("div", { className: "flex gap-6 items-start", children: [_jsxs("div", { className: "flex-1 min-w-0 space-y-5", children: [_jsxs("div", { className: "bg-card p-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-12 max-w-2xl mx-auto ", children: [_jsx(FolderOpen, { className: "size-8 text-muted flex-shrink-0" }), _jsx(ProjectSelect, { value: selectedProjectId, onChange: (v) => {
                                                    setSelectedProjectId(v);
                                                    if (!v)
                                                        setIncludeLinked(false);
                                                }, projects: projectList, className: "flex-1 rounded-xs bg-bg border border-border-light px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" }), selectedProjectId && (_jsxs("label", { className: "flex items-center gap-1.5 text-sm text-muted cursor-pointer select-none", children: [_jsx("input", { type: "checkbox", checked: includeLinked, onChange: (e) => setIncludeLinked(e.target.checked), className: "rounded border-border-light text-accent focus:ring-accent/30" }), _jsx(Link2, { className: "h-3.5 w-3.5" }), "Include linked"] }))] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col items-center gap-4 mt-5", children: [_jsxs("div", { className: "relative w-full max-w-2xl mx-auto rounded-full mb-6", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-light " }), _jsx("input", { ref: inputRef, type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Ask anything about your codebase\u2026", className: "w-full rounded-xs bg-bg border border-border-light pl-12 pr-4 py-3.5 text-lg text-text placeholder:text-light focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" })] }), _jsx("div", { className: "flex items-center gap-1 bg-bg border border-border-light rounded-full p-1 ", children: MODES.map(({ id, label, icon: Icon }) => (_jsxs("button", { type: "button", onClick: () => setMode(id), className: cn('flex items-center gap-2 px-4 py-2 text-sm rounded-full font-medium transition-colors', mode === id
                                                        ? 'bg-accent text-white shadow-sm'
                                                        : 'text-muted hover:text-text hover:bg-hover'), children: [_jsx(Icon, { className: "h-3.5 w-3.5" }), label] }, id))) }), _jsxs("button", { type: "submit", disabled: loading || !query.trim(), className: "flex items-center gap-2 rounded-[--radius-sm] mt-12 bg-accent px-6 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm", children: [loading ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin" })) : (_jsx(Search, { className: "h-4 w-4" })), loading ? 'Searching…' : 'Search'] })] }), _jsx("p", { className: "mt-3 text-center text-xs text-muted", children: MODES.find((m2) => m2.id === mode)?.description })] }), error && _jsx(ErrorBanner, { message: error }), result && !loading && (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-4 px-5 py-3 border-b border-border-light bg-bg text-xs text-muted", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Search, { className: "h-3.5 w-3.5" }), _jsx("span", { className: "font-mono text-text", children: result.query })] }), _jsx("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-accent-light px-2.5 py-0.5 font-medium text-accent", children: result.mode }), _jsxs("span", { className: "ml-auto flex items-center gap-1", children: [_jsx(Clock, { className: "h-3.5 w-3.5" }), result.timestamp.toLocaleTimeString()] })] }), _jsx("div", { className: "p-5", children: _jsx("div", { className: "prose prose-sm max-w-none text-text leading-relaxed font-[var(--font-sans)] whitespace-pre-wrap", children: formatResponse(result.response) }) })] })), !result && !loading && !error && (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [_jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-full bg-accent-light mb-4", children: _jsx(Search, { className: "h-8 w-8 text-accent" }) }), _jsx("h3", { className: "text-base font-semibold text-text", children: "Start searching" }), _jsx("p", { className: "mt-1 text-sm text-muted max-w-xs", children: "Type a question about your codebase and select a search mode to get started." })] })), loading && _jsx(LoadingSkeleton, { lines: 4 })] }), _jsxs("div", { className: "w-64 flex-shrink-0 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-3 border-b border-border-light", children: [_jsx(Clock, { className: "h-4 w-4 text-accent" }), _jsx("h2", { className: "text-sm font-semibold text-text", children: "Recent Queries" })] }), recentQueries.length === 0 ? (_jsx("div", { className: "p-4 text-center", children: _jsx("p", { className: "text-xs text-muted", children: "No queries yet in this session" }) })) : (_jsx("div", { className: "divide-y divide-border-light max-h-[600px] overflow-y-auto", children: recentQueries.map((rq, idx) => (_jsxs("button", { onClick: () => handleRecentClick(rq), className: "w-full text-left px-4 py-3 hover:bg-hover transition-colors group", children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [_jsx("p", { className: "text-xs text-text font-medium line-clamp-2 flex-1", children: rq.query }), _jsx(RotateCcw, { className: "h-3 w-3 text-muted group-hover:text-accent flex-shrink-0 mt-0.5 transition-colors" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "inline-block rounded-full bg-accent-light px-1.5 py-0.5 text-[10px] font-medium text-accent", children: rq.mode }), _jsx("span", { className: "text-[10px] text-muted", children: rq.timestamp.toLocaleTimeString() })] })] }, idx))) }))] })] })] }));
}
