import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ScanLine, GitBranch, Server, Database, X } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
}

function useCommandPalette() {
  const navigate = useNavigate();

  const commands: Command[] = [
    {
      id: 'scan-project',
      label: 'Scan project',
      description: 'Trigger a new project scan',
      icon: ScanLine,
      action: () => navigate('/projects'),
    },
    {
      id: 'open-graph',
      label: 'Open graph',
      description: 'View the knowledge graph',
      icon: GitBranch,
      action: () => navigate('/graph'),
    },
    {
      id: 'view-containers',
      label: 'View containers',
      description: 'Inspect infrastructure containers',
      icon: Server,
      action: () => navigate('/infrastructure'),
    },
    {
      id: 'query-kb',
      label: 'Query knowledge base',
      description: 'Search the knowledge graph',
      icon: Database,
      action: () => navigate('/search'),
    },
  ];

  return commands;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

function CommandPaletteModal({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const allCommands = useCommandPalette();

  const filtered = query.trim()
    ? allCommands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands;

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const execute = (cmd: Command) => {
    cmd.action();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      execute(filtered[activeIndex]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-text/30 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-lg rounded-[--radius-xl] bg-card shadow-lg border border-border overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-light">
          <Search className="h-4 w-4 text-light flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands…"
            className="flex-1 bg-transparent text-sm text-text placeholder:text-light focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-light hover:text-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-border-light px-1.5 py-0.5 text-[10px] font-medium text-light bg-bg">
            Esc
          </kbd>
        </div>

        {/* Commands list */}
        <ul className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-muted">
              No commands found for &ldquo;{query}&rdquo;
            </li>
          ) : (
            filtered.map((cmd, i) => {
              const Icon = cmd.icon;
              return (
                <li key={cmd.id}>
                  <button
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                      i === activeIndex
                        ? 'bg-accent-light text-accent'
                        : 'text-text hover:bg-hover'
                    )}
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => execute(cmd)}
                  >
                    <div className={cn(
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[--radius-sm]',
                      i === activeIndex ? 'bg-accent text-white' : 'bg-bg text-muted'
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{cmd.label}</p>
                      {cmd.description && (
                        <p className={cn(
                          'text-xs',
                          i === activeIndex ? 'text-accent/70' : 'text-muted'
                        )}>
                          {cmd.description}
                        </p>
                      )}
                    </div>
                    {i === activeIndex && (
                      <kbd className="ml-auto flex items-center gap-0.5 rounded border border-accent/30 px-1.5 py-0.5 text-[10px] font-medium text-accent/70 bg-accent-light">
                        Enter
                      </kbd>
                    )}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return <CommandPaletteModal open={open} onClose={() => setOpen(false)} />;
}
