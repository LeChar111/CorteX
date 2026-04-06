import { cn } from '../../lib/utils.ts';

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  variant?: 'accent' | 'muted';
}

export function StatBar({ label, value, max = 100, variant = 'muted' }: StatBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="flex-1 min-w-0">
      <p className="text-md font-medium text-muted mb-1.5">{label}</p>
      <div className="relative h-[34px] bg-bg-warm rounded-full overflow-hidden">
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-500',
            variant === 'accent'
              ? 'bg-accent text-white'
              : 'bg-border text-muted',
          )}
          style={{ width: `${Math.max(pct, 18)}%` }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}
