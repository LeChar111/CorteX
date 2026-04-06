import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Shared loading skeleton component.
 * Replaces the duplicated animate-pulse pattern across all pages.
 */
export function LoadingSkeleton({ lines = 3 }) {
    const widths = ['w-2/3', 'w-full', 'w-5/6', 'w-3/4', 'w-4/5'];
    return (_jsx("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-5 space-y-3 animate-pulse", children: Array.from({ length: lines }, (_, i) => (_jsx("div", { className: `h-4 rounded bg-border-light ${widths[i % widths.length]}` }, i))) }));
}
