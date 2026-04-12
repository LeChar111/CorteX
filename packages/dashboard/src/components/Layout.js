import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Search, Settings, Brain, ChevronDown, } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { ChatWidget } from './ChatWidget.tsx';
function isGroup(entry) {
    return 'items' in entry;
}
const navEntries = [
    { label: 'Dashboard', to: '/' },
    { label: 'Projects', to: '/projects' },
    { label: 'Graph', to: '/graph' },
    { label: 'Pipeline', to: '/pipeline' },
    {
        label: 'Quality',
        items: [
            { label: 'Analysis', to: '/analysis' },
            { label: 'Conformance', to: '/conformance' },
        ],
    },
    { label: 'Infra', to: '/infrastructure' },
];
function NavDropdown({ group, isActive }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const groupActive = group.items.some((item) => isActive(item.to));
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);
    return (_jsxs("div", { ref: ref, className: "relative", children: [_jsxs("button", { onClick: () => setOpen(!open), className: cn('flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap', groupActive
                    ? 'bg-sidebar-active text-white shadow-md'
                    : 'text-muted hover:text-text hover:bg-bg-warm hover:scale-110 hover:font-black'), children: [group.label, _jsx(ChevronDown, { className: cn('h-3 w-3 transition-transform', open && 'rotate-180') })] }), open && (_jsx("div", { className: "absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[140px] p-2 rounded-sm border border-border-light bg-card shadow-lg py-1 z-50", children: group.items.map((item) => (_jsx(Link, { to: item.to, onClick: () => setOpen(false), className: cn('block px-2 py-2 text-sm font-medium rounded-sm transition-colors', isActive(item.to)
                        ? 'bg-sidebar-active/10 text-text font-semibold'
                        : 'text-muted hover:text-text hover:bg-bg-warm'), children: item.label }, item.to))) }))] }));
}
export function Layout() {
    const location = useLocation();
    const isActive = (to) => {
        if (to === '/')
            return location.pathname === '/';
        return location.pathname.startsWith(to);
    };
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsx("header", { className: "sticky top-2 z-40  backdrop-blur-md ", children: _jsxs("div", { className: "max-w-[1400px] mx-auto flex items-center h-16 px-6 gap-6", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2.5 flex-shrink-0", children: [_jsx("div", { className: "flex size-12 items-center justify-center rounded-full bg-accent shadow-sm", children: _jsx(Brain, { className: "size-8 text-white" }) }), _jsx("span", { className: "text-4xl font-black text-text tracking-tight", children: "Cortex" })] }), _jsx("nav", { className: "flex-1 flex items-center justify-center", children: _jsx("div", { className: "flex items-center gap-1 bg-bg/60 rounded-full p-1", children: navEntries.map((entry) => isGroup(entry) ? (_jsx(NavDropdown, { group: entry, isActive: isActive }, entry.label)) : (_jsx(Link, { to: entry.to, className: cn('px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap', isActive(entry.to)
                                        ? 'bg-sidebar-active text-white shadow-md'
                                        : 'text-muted hover:text-text hover:bg-bg-warm hover:scale-110 hover:font-black'), children: entry.label }, entry.to))) }) }), _jsxs("div", { className: "flex items-center gap-3 flex-shrink-0", children: [_jsxs(Link, { to: "/settings", className: cn('flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200', isActive('/settings')
                                        ? 'bg-sidebar-active text-white'
                                        : 'text-muted hover:text-text hover:scale-105 hover:bg-bg-warm'), children: [_jsx(Settings, { className: "h-4 w-4" }), _jsx("span", { className: "hidden lg:inline", children: "Setting" })] }), _jsx(Link, { to: "/search", className: "flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-warm transition-colors", children: _jsx(Search, { className: "h-4.5 w-4.5 text-muted" }) })] })] }) }), _jsx("main", { className: "max-w-[1400px] mx-auto px-6 py-10", children: _jsx(Outlet, {}) }), _jsx(Link, { to: "/settings", className: "fixed bottom-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border-light shadow-md hover:shadow-lg hover:bg-bg-warm transition-all duration-200", children: _jsx(Settings, { className: "h-4.5 w-4.5 text-muted" }) }), _jsx(ChatWidget, {})] }));
}
