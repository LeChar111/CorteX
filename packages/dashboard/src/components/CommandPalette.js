import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ScanLine, GitBranch, Server, Database, X } from 'lucide-react';
import { cn } from '../lib/utils.ts';
function useCommandPalette() {
    const navigate = useNavigate();
    const commands = [
        {
            id: 'scan-project',
            label: 'Scan project',
            description: 'Trigger a new project scan',
            icon: ScanLine,
            action: () => navigate('/projects'),
        },
        {
            id: 'open-graph',
            label: 'Open graph',
            description: 'View the knowledge graph',
            icon: GitBranch,
            action: () => navigate('/graph'),
        },
        {
            id: 'view-containers',
            label: 'View containers',
            description: 'Inspect infrastructure containers',
            icon: Server,
            action: () => navigate('/infrastructure'),
        },
        {
            id: 'query-kb',
            label: 'Query knowledge base',
            description: 'Search the knowledge graph',
            icon: Database,
            action: () => navigate('/search'),
        },
    ];
    return commands;
}
function CommandPaletteModal({ open, onClose }) {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef(null);
    const allCommands = useCommandPalette();
    const filtered = query.trim()
        ? allCommands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.description?.toLowerCase().includes(query.toLowerCase()))
        : allCommands;
    useEffect(() => {
        if (open) {
            setQuery('');
            setActiveIndex(0);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [open]);
    useEffect(() => {
        setActiveIndex(0);
    }, [query]);
    const execute = (cmd) => {
        cmd.action();
        onClose();
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
        else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        }
        else if (e.key === 'Enter' && filtered[activeIndex]) {
            execute(filtered[activeIndex]);
        }
    };
    if (!open)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-start justify-center pt-[20vh]", onMouseDown: (e) => {
            if (e.target === e.currentTarget)
                onClose();
        }, children: [_jsx("div", { className: "absolute inset-0 bg-text/30 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative z-10 w-full max-w-lg rounded-[--radius-xl] bg-card shadow-lg border border-border overflow-hidden", onKeyDown: handleKeyDown, children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3.5 border-b border-border-light", children: [_jsx(Search, { className: "h-4 w-4 text-light flex-shrink-0" }), _jsx("input", { ref: inputRef, type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search commands\u2026", className: "flex-1 bg-transparent text-sm text-text placeholder:text-light focus:outline-none" }), query && (_jsx("button", { onClick: () => setQuery(''), className: "text-light hover:text-muted transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })), _jsx("kbd", { className: "hidden sm:flex items-center gap-0.5 rounded border border-border-light px-1.5 py-0.5 text-[10px] font-medium text-light bg-bg", children: "Esc" })] }), _jsx("ul", { className: "max-h-72 overflow-y-auto py-2", children: filtered.length === 0 ? (_jsxs("li", { className: "px-4 py-8 text-center text-sm text-muted", children: ["No commands found for \u201C", query, "\u201D"] })) : (filtered.map((cmd, i) => {
                            const Icon = cmd.icon;
                            return (_jsx("li", { children: _jsxs("button", { className: cn('flex w-full items-center gap-3 px-4 py-3 text-left transition-colors', i === activeIndex
                                        ? 'bg-accent-light text-accent'
                                        : 'text-text hover:bg-hover'), onMouseEnter: () => setActiveIndex(i), onClick: () => execute(cmd), children: [_jsx("div", { className: cn('flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[--radius-sm]', i === activeIndex ? 'bg-accent text-white' : 'bg-bg text-muted'), children: _jsx(Icon, { className: "h-4 w-4" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: cmd.label }), cmd.description && (_jsx("p", { className: cn('text-xs', i === activeIndex ? 'text-accent/70' : 'text-muted'), children: cmd.description }))] }), i === activeIndex && (_jsx("kbd", { className: "ml-auto flex items-center gap-0.5 rounded border border-accent/30 px-1.5 py-0.5 text-[10px] font-medium text-accent/70 bg-accent-light", children: "Enter" }))] }) }, cmd.id));
                        })) })] })] }));
}
export function CommandPalette() {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const handler = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);
    return _jsx(CommandPaletteModal, { open: open, onClose: () => setOpen(false) });
}
