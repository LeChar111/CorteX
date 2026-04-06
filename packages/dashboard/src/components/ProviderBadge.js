import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GitMerge } from 'lucide-react';
import { cn } from '../lib/utils.ts';
export function ProviderBadge({ provider }) {
    const lower = provider.toLowerCase();
    const cls = lower.includes('github')
        ? 'bg-gray-100 text-gray-700'
        : lower.includes('gitlab')
            ? 'bg-orange-50 text-orange-700'
            : lower.includes('bitbucket')
                ? 'bg-blue-50 text-blue-700'
                : 'bg-[var(--color-hover)] text-muted';
    return (_jsxs("span", { className: cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium', cls), children: [_jsx(GitMerge, { className: "w-3 h-3" }), provider] }));
}
