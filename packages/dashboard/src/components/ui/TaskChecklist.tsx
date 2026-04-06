import { cn } from '../../lib/utils.ts';

interface TaskItem {
  id: string;
  label: string;
  subtitle: string;
  done: boolean;
  icon: React.ElementType;
}

interface TaskChecklistProps {
  title: string;
  done: number;
  total: number;
  items: TaskItem[];
}

export function TaskChecklist({ title, done, total, items }: TaskChecklistProps) {
  return (
    <div className="bg-sidebar-active rounded-[var(--radius-lg)] p-5 text-white h-[200px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <span className="text-4xl font-bold">
          {done}<span className="text-white/40">/{total}</span>
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                item.done ? 'bg-white/15' : 'bg-white/8',
              )}>
                <Icon className="w-3.5 h-3.5 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.label}</p>
                <p className="text-[10px] text-white/40">{item.subtitle}</p>
              </div>
              <div className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                item.done
                  ? 'bg-green-400'
                  : 'border border-white/20',
              )}>
                {item.done && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
