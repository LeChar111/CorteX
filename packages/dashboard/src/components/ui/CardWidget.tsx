import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils.ts';

interface CardWidgetProps {
  title?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  noPadding?: boolean;
}

export function CardWidget({ title, action, className, children, noPadding }: CardWidgetProps) {
  return (
    <div className={cn(
      'bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light overflow-hidden',
      className,
    )}>
      {title && (
        <div className="flex items-center justify-between px-5 pt-5 pb-0">
          <h3 className="text-5xl font-black text-text">{title}</h3>
          {action ?? (
            <button className="w-7 h-7 rounded-lg bg-bg flex items-center justify-center hover:bg-bg-warm transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5 text-muted" />
            </button>
          )}
        </div>
      )}
      <div className={cn(!noPadding && 'p-5', title && !noPadding && 'pt-3')}>
        {children}
      </div>
    </div>
  );
}
