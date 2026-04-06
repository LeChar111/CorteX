import { cn } from '../lib/utils.ts';

interface StatusDotProps {
  ok: boolean | null;
}

export function StatusDot({ ok }: StatusDotProps) {
  if (ok === null)
    return <span className="inline-block h-2.5 w-2.5 rounded-full bg-border-light animate-pulse" />;
  return (
    <span
      className={cn(
        'inline-block h-2.5 w-2.5 rounded-full',
        ok ? 'bg-success shadow-[0_0_6px_rgba(var(--success-rgb,34,197,94),0.7)]' : 'bg-error',
      )}
    />
  );
}
