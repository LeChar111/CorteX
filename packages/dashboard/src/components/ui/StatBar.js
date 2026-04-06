import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils.ts';
export function StatBar({ label, value, max = 100, variant = 'muted' }) {
    const pct = Math.min(Math.round((value / max) * 100), 100);
    return (_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-md font-medium text-muted mb-1.5", children: label }), _jsx("div", { className: "relative h-[34px] bg-bg-warm rounded-full overflow-hidden", children: _jsxs("div", { className: cn('absolute inset-y-0 left-0 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-500', variant === 'accent'
                        ? 'bg-accent text-white'
                        : 'bg-border text-muted'), style: { width: `${Math.max(pct, 18)}%` }, children: [pct, "%"] }) })] }));
}
