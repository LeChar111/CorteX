import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils.ts';
export function CardWidget({ title, action, className, children, noPadding }) {
    return (_jsxs("div", { className: cn('bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light overflow-hidden', className), children: [title && (_jsxs("div", { className: "flex items-center justify-between px-5 pt-5 pb-0", children: [_jsx("h3", { className: "text-5xl font-black text-text", children: title }), action ?? (_jsx("button", { className: "w-7 h-7 rounded-lg bg-bg flex items-center justify-center hover:bg-bg-warm transition-colors", children: _jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-muted" }) }))] })), _jsx("div", { className: cn(!noPadding && 'p-5', title && !noPadding && 'pt-3'), children: children })] }));
}
