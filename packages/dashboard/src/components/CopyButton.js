import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils.ts';
export function CopyButton({ text, className }) {
    const [copied, setCopied] = useState(false);
    return (_jsx("button", { onClick: () => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }, className: cn('p-1.5 rounded-lg hover:bg-hover transition-all active:scale-95', className), title: "Copy to clipboard", children: copied
            ? _jsx(Check, { className: "w-3.5 h-3.5 text-success" })
            : _jsx(Copy, { className: "w-3.5 h-3.5 text-light hover:text-muted transition-colors" }) }));
}
