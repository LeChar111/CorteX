import { CheckCircle2, Loader2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface ScanStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { cls: string; icon: React.ReactNode }> = {
  completed: {
    cls: 'bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)] text-success',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  running: {
    cls: 'bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)] text-warning',
    icon: <Loader2 className="w-3 h-3 animate-spin" />,
  },
  queued: {
    cls: 'bg-[color-mix(in_srgb,var(--color-info)_12%,transparent)] text-info',
    icon: <Circle className="w-3 h-3" />,
  },
  failed: {
    cls: 'bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-error',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  superseded: {
    cls: 'bg-[var(--color-hover)] text-muted',
    icon: <AlertCircle className="w-3 h-3" />,
  },
};

const fallback = { cls: 'bg-[var(--color-hover)] text-muted', icon: null };

export function ScanStatusBadge({ status }: ScanStatusBadgeProps) {
  const c = statusConfig[status] ?? fallback;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold', c.cls)}>
      {c.icon}
      {status}
    </span>
  );
}
