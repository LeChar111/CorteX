import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../lib/utils.ts';
export function StatusDot({ ok }) {
    if (ok === null)
        return _jsx("span", { className: "inline-block h-2.5 w-2.5 rounded-full bg-border-light animate-pulse" });
    return (_jsx("span", { className: cn('inline-block h-2.5 w-2.5 rounded-full', ok ? 'bg-success shadow-[0_0_6px_rgba(var(--success-rgb,34,197,94),0.7)]' : 'bg-error') }));
}
