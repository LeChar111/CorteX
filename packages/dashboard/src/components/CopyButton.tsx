import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={cn('p-1.5 rounded-lg hover:bg-hover transition-all active:scale-95', className)}
      title="Copy to clipboard"
    >
      {copied
        ? <Check className="w-3.5 h-3.5 text-success" />
        : <Copy className="w-3.5 h-3.5 text-light hover:text-muted transition-colors" />
      }
    </button>
  );
}
