import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils.ts';
export function CollapsibleSection({ title, defaultOpen = false, children }) {
    const [open, setOpen] = useState(defaultOpen);
    return (_jsxs("div", { className: "border-b border-border-light last:border-b-0", children: [_jsxs("button", { onClick: () => setOpen(!open), className: "flex items-center justify-between w-full py-3.5 text-3xl font-black text-text hover:text-accent transition-colors", children: [title, _jsx(ChevronDown, { className: cn('w-4 h-4 text-muted transition-transform duration-200', open && 'rotate-180') })] }), open && (_jsx("div", { className: "pb-3 animate-in slide-in-from-top-1 duration-200", children: children }))] }));
}
