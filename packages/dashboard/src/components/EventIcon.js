import { jsx as _jsx } from "react/jsx-runtime";
import { ScanSearch, AlertCircle, FolderKanban, Zap } from 'lucide-react';
import { cn } from '../lib/utils.ts';
export function EventIcon({ type, className }) {
    const size = cn('w-3.5 h-3.5', className);
    if (type.includes('scan'))
        return _jsx(ScanSearch, { className: cn(size, 'text-accent') });
    if (type.includes('error') || type.includes('fail'))
        return _jsx(AlertCircle, { className: cn(size, 'text-error') });
    if (type.includes('project'))
        return _jsx(FolderKanban, { className: cn(size, 'text-info') });
    return _jsx(Zap, { className: cn(size, 'text-muted') });
}
