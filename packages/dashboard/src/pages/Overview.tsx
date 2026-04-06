import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Activity,
  Plus,
  Play,
  Pause,
  Server,
  Laptop,
  CheckCircle2,
  XCircle,
  Loader,
  Zap,
  ArrowUpRight,
  ChevronsRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { api } from '../api.ts';
import { useWebSocket } from '../hooks/useWebSocket.ts';
import { useAsyncData } from '../hooks/useAsyncData.ts';
import { cn } from '../lib/utils.ts';
import { timeAgo } from '../lib/helpers.ts';
import { StatBar } from '../components/ui/StatBar.tsx';
import { BigStat } from '../components/ui/BigStat.tsx';
import { CircularProgress } from '../components/ui/CircularProgress.tsx';
import { CardWidget } from '../components/ui/CardWidget.tsx';
import { TaskChecklist } from '../components/ui/TaskChecklist.tsx';
import { CollapsibleSection } from '../components/ui/CollapsibleSection.tsx';

// Activity data for bar chart (like Crextio's daily progress)
function generateActivityData() {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return days.map((day, i) => ({
    day,
    scans: Math.floor(Math.random() * 12) + 2,
    isToday: i === 3,
  }));
}

const ACTIVITY_DATA = generateActivityData();

export function Overview() {
  const navigate = useNavigate();
  const { data: projects } = useAsyncData(() => api.listProjects(), []);
  const { data: scans, refetch: refetchScans } = useAsyncData(() => api.getScanStatus(), []);
  const { data: health } = useAsyncData(() => api.health(), []);
  const { data: events, refetch: refetchEvents } = useAsyncData(() => api.getEvents({ limit: 8 }), []);
  const { connected, lastMessage } = useWebSocket(`ws://${window.location.host}/ws?key=dev-key-1`);

  useEffect(() => {
    if (lastMessage?.type === 'scan.completed' || lastMessage?.type === 'scan.failed') {
      refetchScans();
      refetchEvents();
    }
  }, [lastMessage, refetchScans, refetchEvents]);

  const scanList = scans ?? [];
  const projectList = projects ?? [];
  const eventList = events ?? [];

  const completedScans = scanList.filter((s) => s.status === 'completed').length;
  const runningScans = scanList.filter((s) => s.status === 'running').length;
  const failedScans = scanList.filter((s) => s.status === 'failed').length;
  const totalScans = scanList.length || 1;

  const isHealthy = health?.status === 'ok';
  const healthServices = health?.services ? Object.entries(health.services) : [];
  const healthyCount = healthServices.filter(([, v]) => {
    if (typeof v === 'object' && v !== null) return (v as Record<string, unknown>).status === 'ok';
    return v === 'ok';
  }).length;

  // Map recent scans to task checklist items
  const recentScanTasks = scanList.slice(0, 5).map((scan) => ({
    id: scan.id,
    label: scan.branch || 'main',
    subtitle: `${scan.mode} — ${timeAgo(scan.createdAt)}`,
    done: scan.status === 'completed',
    icon: scan.status === 'completed' ? CheckCircle2 : scan.status === 'failed' ? XCircle : Loader,
  }));

  // Uptime percentage based on health
  const uptimePct = isHealthy ? 99 : healthyCount > 0 ? Math.round((healthyCount / healthServices.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ═══ Row 1: Welcome + Stats ═══ */}
      <div className="flex flex-col lg:flex-row mx-auto justify-end items-end gap-6">
        {/* Welcome */}
        {/* <div className="flex-1">
          <h1 className="text-3xl font-bold text-text tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted mt-1">Here's what's happening with your projects.</p>
        </div> */}
        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/new-project"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-md font-semibold bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            New Project
          </Link>
          <span className={cn(
            'inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-md font-semibold',
            connected ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', connected ? 'bg-success' : 'bg-error')} />
            {connected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* ═══ Row 2: Stat bars + Big numbers (Crextio style) ═══ */}
      <div className="p-5">
        <div className="flex flex-col lg:flex-row gap-6 mt-5 mb-5 lg:items-end">
          {/* Stat progress bars */}
          <div className="flex flex-1 gap-4">
            <StatBar label="Completed" value={completedScans} max={totalScans} variant="accent" />
            <StatBar label="Running" value={runningScans} max={totalScans} variant="accent" />
            <StatBar label="Failed" value={failedScans} max={totalScans} variant="muted" />
            <StatBar label="Queue" value={Math.max(totalScans - completedScans - runningScans - failedScans, 0)} max={totalScans} variant="muted" />
          </div>
          {/* Big stats */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <BigStat icon={FolderKanban} value={projectList.length} label="Projects" />
            <BigStat icon={Activity} value={scanList.length} label="Scans" />
            <BigStat icon={Zap} value={eventList.length} label="Events" />
          </div>
        </div>
      </div>

      {/* ═══ Row 3: Main widget grid (4 columns like Crextio) ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Project highlight (like Crextio profile card) */}
        <div className="bg-sidebar-active rounded-[var(--radius-lg)] p-5 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2D2D3F] to-[#1A1A2E]" />
          <div className="relative z-10 flex flex-col h-full min-h-[200px]">
            <div className="flex-1">
              
              <h3 className="text-6xl uppercase overflow-x-auto font-black mb-1">
                {projectList[0]?.name ?? 'No Project'}
              </h3>
              <p className="text-md text-end mt-5 overflow-y-auto text-white/50">
                {projectList[0]?.description ?? 'Create your first project to get started'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xl text-white/40">
                {projectList[0] ? timeAgo(projectList[0].createdAt) : ''}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold">
                {projectList.length} total
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Progress / Scan Activity bar chart (like Crextio progress) */}
        <CardWidget title="Scan Activity">
          <div className="flex items-baseline gap-2 mt-2 ">
            <span className="text-2xl font-bold text-text">{scanList.length}</span>
            <span className="text-xs text-muted">Scans this week</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={ACTIVITY_DATA} barSize={24} barGap={4}>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#A0A0B0' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: '#2D2D3F',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '11px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                }}
                itemStyle={{ color: '#EDBE44' }}
                cursor={{ fill: 'rgba(237,190,68,0.06)' }}
              />
              <Bar dataKey="scans" radius={[6, 6, 0, 0]}>
                {ACTIVITY_DATA.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isToday ? '#EDBE44' : '#EDE7DC'}
                    stroke="none"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardWidget>

        {/* Card 3: Health / Uptime (like Crextio time tracker) */}
        <CardWidget title="System Health">
          <div className="flex flex-col items-center justify-center mt-8">
            <CircularProgress value={uptimePct} size={130} strokeWidth={8}>
              <span className="text-4xl font-bold text-text">{uptimePct}%</span>
              <span className="text-[10px] text-muted">Uptime</span>
            </CircularProgress>
            <div className="flex items-center gap-3 mt-3">
              <button className="w-8 h-8 rounded-full bg-bg border border-border-light flex items-center justify-center hover:bg-bg-warm transition-colors">
                <Play className="w-3.5 h-3.5 text-muted ml-0.5" />
              </button>
              <button className="w-8 h-8 rounded-full bg-bg border border-border-light flex items-center justify-center hover:bg-bg-warm transition-colors">
                <Pause className="w-3.5 h-3.5 text-muted" />
              </button>
            </div>
          </div>
        </CardWidget>

        {/* Card 4: Pipeline status (like Crextio onboarding %) */}
        <div className="space-y-4">
          {/* Percentage header */}
          <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-4xl font-semibold text-text">Pipeline</h3>
              <span className="text-5xl font-black text-text">
                {totalScans > 0 ? Math.round((completedScans / totalScans) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted mb-2">
              <span>{completedScans} done</span>
              <span className="text-border">|</span>
              <span>{runningScans} running</span>
              <span className="text-border">|</span>
              <span>{failedScans} failed</span>
            </div>
            {/* Toggle-style pills like Crextio */}
            <div className="flex items-center gap-2 mt-3">
              {/* <span className="text-xs text-muted">Status</span> */}
              <div className="flex-1 flex items-center bg-bg-warm rounded-full p-0.5">
                <span className={cn(
                  'flex-1 text-center text-[10px] font-medium py-1.5 rounded-full transition-colors',
                  isHealthy ? 'bg-green-400 text-white' : 'text-muted',
                )}>
                  Healthy
                </span>
                <span className={cn(
                  'flex-1 text-center text-[10px] font-medium py-1.5 rounded-full transition-colors',
                  !isHealthy ? 'bg-red-400 text-white' : 'text-muted',
                )}>
                  Issues
                </span>
              </div>
            </div>
          </div>

          {/* Scan task list (like Crextio onboarding task) */}
          <TaskChecklist
            title="Recent Scans"
            done={completedScans}
            total={totalScans}
            items={recentScanTasks}
          />
        </div>
      </div>

      {/* ═══ Row 4: Bottom grid (3 columns like Crextio) ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Collapsible sections (like Crextio pension/devices) */}
        <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light px-5">
          <CollapsibleSection title="Services" defaultOpen>
            <div className="space-y-2">
              {healthServices.length > 0 ? healthServices.map(([name, statusVal]) => {
                const statusStr = typeof statusVal === 'object' && statusVal !== null
                  ? (statusVal as Record<string, unknown>).status as string ?? 'unknown'
                  : String(statusVal);
                return (
                  <div key={name} className="flex items-center gap-3 py-1.5">
                    <div className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center">
                      <Server className="w-4 h-4 text-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-medium text-text capitalize">{name}</p>
                      {/* <p className="text-sm text-muted">{statusStr}</p> */}
                    </div>
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      statusStr === 'ok' ? 'bg-success' : 'bg-warning',
                    )} />
                  </div>
                );
              }) : (
                <p className="text-xs text-muted py-2">No services data</p>
              )}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Connections">
            <div className="flex items-center gap-3 py-1.5">
              <div className="w-8 h-8 rounded-lg bg-bg flex items-center justify-center">
                <Laptop className="w-4 h-4 text-muted" />
              </div>
              <div className="flex-1">
                <p className="text-md font-medium text-text">WebSocket</p>
                <p className="text-sm text-muted">{connected ? 'Connected' : 'Disconnected'}</p>
              </div>
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Quick Actions">
            <div className="space-y-1.5">
              {[
                { label: 'New Project', action: () => navigate('/new-project') },
                { label: 'View Graph', action: () => navigate('/graph') },
                { label: 'Run Analysis', action: () => navigate('/analysis') },
              ].map(({ label, action }) => (
                <span className='flex rounded-xs border-2 items-center px-4 text-2xl font-medium text-accent hover:text-accent-hover py-1 transition-all ease-in-out duration-300 hover:scale-105'>
                <button
                  key={label}
                  onClick={action}
                  className="w-full text-left "
                >
                  {label} 
                </button>
                <ChevronsRight></ChevronsRight>
                </span>
              ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="Infrastructure">
            <p className="text-xl text-muted py-1">
              {isHealthy ? 'All systems operational' : 'Some services may be down'}
            </p>
          </CollapsibleSection>
        </div>

        {/* Center: Events timeline (like Crextio calendar) */}
        <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light overflow-hidden">
          {/* Month header like Crextio */}
          <div className="flex items-center justify-between px-5 pt-5">
            <span className="text-xs text-muted">Previous</span>
            <h3 className="text-3xl font-semibold text-text">Recent Events</h3>
            <span className="text-xs text-muted">Next</span>
          </div>

          {/* Day columns like Crextio week view */}
          <div className="grid grid-cols-5 gap-0 px-5 py-3 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted">{d}</span>
                <span className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold',
                  i === 2 ? 'bg-accent text-white' : 'text-text',
                )}>
                  {new Date().getDate() - 2 + i}
                </span>
              </div>
            ))}
          </div>

          {/* Events list like Crextio calendar entries */}
          <div className="border-t border-border-light">
            {eventList.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-muted">No events yet</div>
            ) : (
              <div className="divide-y divide-border-light">
                {eventList.slice(0, 5).map((event, i) => (
                  <div key={event.id} className="px-5 py-3 flex items-center gap-3">
                    <span className="text-[10px] text-muted w-14 flex-shrink-0">
                      {new Date(event.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                    <div className={cn(
                      'flex-1 rounded-[var(--radius-sm)] px-3 py-2',
                      i === 0
                        ? 'bg-accent/15 border border-accent/20'
                        : 'bg-bg',
                    )}>
                      <p className="text-xs font-medium text-text truncate">{event.type.replace(/\./g, ' ')}</p>
                      <p className="text-[10px] text-muted truncate">
                        {typeof event.payload?.message === 'string'
                          ? event.payload.message
                          : event.projectId
                            ? `Project ${event.projectId}`
                            : 'System event'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Projects list (extended from 4th column) */}
        <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-border-light">
            <h3 className="text-5xl font-semibold text-text">Projects</h3>
            <span className="text-3xl items-center text-muted"><span className="font-black text-4xl">{projectList.length}</span> total</span>
          </div>
          {projectList.length === 0 ? (
            <div className="px-5 py-8 text-center text-xs text-muted">No projects yet</div>
          ) : (
            <div className="divide-y divide-border-light">
              {projectList.slice(0, 6).map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="px-5 py-3 flex items-center gap-3 hover:bg-hover transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl uppercase font-semibold text-text truncate">{p.name}</p>
                    <p className="text-sm text-muted">{timeAgo(p.createdAt)}</p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-light group-hover:text-accent transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
