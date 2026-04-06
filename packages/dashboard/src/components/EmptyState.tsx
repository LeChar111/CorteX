import type { ElementType } from 'react';

interface EmptyStateProps {
  icon?: ElementType;
  message: string;
}

/**
 * Shared empty state component with optional icon.
 */
export function EmptyState({ icon: Icon, message }: EmptyStateProps) {
  return (
    <div className="py-16 text-center text-muted text-sm">
      {Icon && <Icon className="w-10 h-10 text-muted mx-auto mb-3 opacity-40" />}
      <p>{message}</p>
    </div>
  );
}
