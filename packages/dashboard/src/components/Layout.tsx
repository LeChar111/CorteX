import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  GitBranch,
  Search,
  Activity,
  Server,
  Terminal,
  Settings,
  Brain,
  ShieldCheck,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { ChatWidget } from './ChatWidget.tsx';

interface NavItem {
  label: string;
  to: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

type NavEntry = NavItem | NavGroup;

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry;
}

const navEntries: NavEntry[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Graph', to: '/graph' },
  { label: 'Pipeline', to: '/pipeline' },
  {
    label: 'Quality',
    items: [
      { label: 'Analysis', to: '/analysis' },
      { label: 'Conformance', to: '/conformance' },
    ],
  },
  { label: 'Infra', to: '/infrastructure' },
  { label: 'Terminal', to: '/terminal' },
];

function NavDropdown({ group, isActive }: { group: NavGroup; isActive: (to: string) => boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const groupActive = group.items.some((item) => isActive(item.to));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
          groupActive
            ? 'bg-sidebar-active text-white shadow-md'
            : 'text-muted hover:text-text hover:bg-bg-warm hover:scale-110 hover:font-black',
        )}
      >
        {group.label}
        <ChevronDown className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[140px] p-2 rounded-sm border border-border-light bg-card shadow-lg py-1 z-50">
          {group.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                'block px-2 py-2 text-sm font-medium rounded-sm transition-colors',
                isActive(item.to)
                  ? 'bg-sidebar-active/10 text-text font-semibold'
                  : 'text-muted hover:text-text hover:bg-bg-warm',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Layout() {
  const location = useLocation();

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ═══ Top Navigation Bar (Crextio-style) ═══ */}
      <header className="sticky top-2 z-40  backdrop-blur-md ">
        <div className="max-w-[1400px] mx-auto flex items-center h-16 px-6 gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="flex size-12 items-center justify-center rounded-full bg-accent shadow-sm">
              <Brain className="size-8 text-white" />
            </div>
            <span className="text-4xl font-black text-text tracking-tight">Cortex</span>
          </Link>

          {/* Center Navigation Pills */}
          <nav className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-1 bg-bg/60 rounded-full p-1">
              {navEntries.map((entry) =>
                isGroup(entry) ? (
                  <NavDropdown key={entry.label} group={entry} isActive={isActive} />
                ) : (
                  <Link
                    key={entry.to}
                    to={entry.to}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                      isActive(entry.to)
                        ? 'bg-sidebar-active text-white shadow-md'
                        : 'text-muted hover:text-text hover:bg-bg-warm hover:scale-110 hover:font-black',
                    )}
                  >
                    {entry.label}
                  </Link>
                ),
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/settings"
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200',
                isActive('/settings')
                  ? 'bg-sidebar-active text-white'
                  : 'text-muted hover:text-text hover:scale-105 hover:bg-bg-warm',
              )}
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">Setting</span>
            </Link>
            {/* <NotificationCenter /> */}
            <Link
              to="/search"
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-bg-warm transition-colors"
            >
              <Search className="h-4.5 w-4.5 text-muted" />
            </Link>
          </div>
        </div>
      </header>

      {/* ═══ Page Content (full width) ═══ */}
      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <Outlet />
      </main>

      {/* ═══ Bottom-left Settings gear (like Crextio) ═══ */}
      <Link
        to="/settings"
        className="fixed bottom-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border-light shadow-md hover:shadow-lg hover:bg-bg-warm transition-all duration-200"
      >
        <Settings className="h-4.5 w-4.5 text-muted" />
      </Link>
      <ChatWidget />
    </div>
  );
}
