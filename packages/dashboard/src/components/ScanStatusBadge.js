import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, Loader2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils.ts';
const statusConfig = {
    completed: {
        cls: 'bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-success',
        icon: _jsx(CheckCircle2, { className: "w-3 h-3" }),
    },
    running: {
        cls: 'bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] text-warning',
        icon: _jsx(Loader2, { className: "w-3 h-3 animate-spin" }),
    },
    queued: {
        cls: 'bg-[color-mix(in_srgb,var(--color-info)_12%,transparent)] text-info',
        icon: _jsx(Circle, { className: "w-3 h-3" }),
    },
    failed: {
        cls: 'bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-error',
        icon: _jsx(AlertCircle, { className: "w-3 h-3" }),
    },
    superseded: {
        cls: 'bg-[var(--color-hover)] text-muted',
        icon: _jsx(AlertCircle, { className: "w-3 h-3" }),
    },
};
const fallback = { cls: 'bg-[var(--color-hover)] text-muted', icon: null };
export function ScanStatusBadge({ status }) {
    const c = statusConfig[status] ?? fallback;
    return (_jsxs("span", { className: cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', c.cls), children: [c.icon, status] }));
}
