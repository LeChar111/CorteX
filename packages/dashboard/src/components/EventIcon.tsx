import { ScanSearch, AlertCircle, FolderKanban, Zap } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface EventIconProps {
  type: string;
  className?: string;
}

export function EventIcon({ type, className }: EventIconProps) {
  const size = cn('w-3.5 h-3.5', className);
  if (type.includes('scan')) return <ScanSearch className={cn(size, 'text-accent')} />;
  if (type.includes('error') || type.includes('fail')) return <AlertCircle className={cn(size, 'text-error')} />;
  if (type.includes('project')) return <FolderKanban className={cn(size, 'text-info')} />;
  return <Zap className={cn(size, 'text-muted')} />;
}
