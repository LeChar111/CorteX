import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderKanban, Activity, Plus, Play, Pause, Server, Laptop, CheckCircle2, XCircle, Loader, Zap, ArrowUpRight, ChevronsRight, } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, } from 'recharts';
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
        if (typeof v === 'object' && v !== null)
            return v.status === 'ok';
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "flex flex-col lg:flex-row mx-auto justify-end items-end gap-6", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Link, { to: "/new-project", className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-md font-semibold bg-accent text-white hover:bg-accent-hover transition-colors shadow-sm", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), "New Project"] }), _jsxs("span", { className: cn('inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-md font-semibold', connected ? 'bg-success/10 text-success' : 'bg-error/10 text-error'), children: [_jsx("span", { className: cn('w-1.5 h-1.5 rounded-full', connected ? 'bg-success' : 'bg-error') }), connected ? 'Live' : 'Offline'] })] }) }), _jsx("div", { className: "p-5", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-6 mt-5 mb-5 lg:items-end", children: [_jsxs("div", { className: "flex flex-1 gap-4", children: [_jsx(StatBar, { label: "Completed", value: completedScans, max: totalScans, variant: "accent" }), _jsx(StatBar, { label: "Running", value: runningScans, max: totalScans, variant: "accent" }), _jsx(StatBar, { label: "Failed", value: failedScans, max: totalScans, variant: "muted" }), _jsx(StatBar, { label: "Queue", value: Math.max(totalScans - completedScans - runningScans - failedScans, 0), max: totalScans, variant: "muted" })] }), _jsxs("div", { className: "flex items-center gap-8 flex-shrink-0", children: [_jsx(BigStat, { icon: FolderKanban, value: projectList.length, label: "Projects" }), _jsx(BigStat, { icon: Activity, value: scanList.length, label: "Scans" }), _jsx(BigStat, { icon: Zap, value: eventList.length, label: "Events" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-sidebar-active rounded-[var(--radius-lg)] p-5 text-white relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#2D2D3F] to-[#1A1A2E]" }), _jsxs("div", { className: "relative z-10 flex flex-col h-full min-h-[200px]", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-6xl uppercase overflow-x-auto font-black mb-1", children: projectList[0]?.name ?? 'No Project' }), _jsx("p", { className: "text-md text-end mt-5 overflow-y-auto text-white/50", children: projectList[0]?.description ?? 'Create your first project to get started' })] }), _jsxs("div", { className: "flex items-center justify-between mt-4", children: [_jsx("span", { className: "text-xl text-white/40", children: projectList[0] ? timeAgo(projectList[0].createdAt) : '' }), _jsxs("span", { className: "inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-accent text-white text-xs font-bold", children: [projectList.length, " total"] })] })] })] }), _jsxs(CardWidget, { title: "Scan Activity", children: [_jsxs("div", { className: "flex items-baseline gap-2 mt-2 ", children: [_jsx("span", { className: "text-2xl font-bold text-text", children: scanList.length }), _jsx("span", { className: "text-xs text-muted", children: "Scans this week" })] }), _jsx(ResponsiveContainer, { width: "100%", height: 180, children: _jsxs(BarChart, { data: ACTIVITY_DATA, barSize: 24, barGap: 4, children: [_jsx(XAxis, { dataKey: "day", tick: { fontSize: 10, fill: '#A0A0B0' }, axisLine: false, tickLine: false }), _jsx(YAxis, { hide: true }), _jsx(Tooltip, { contentStyle: {
                                                background: '#2D2D3F',
                                                border: 'none',
                                                borderRadius: '10px',
                                                color: '#fff',
                                                fontSize: '11px',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                            }, itemStyle: { color: '#EDBE44' }, cursor: { fill: 'rgba(237,190,68,0.06)' } }), _jsx(Bar, { dataKey: "scans", radius: [6, 6, 0, 0], children: ACTIVITY_DATA.map((entry, i) => (_jsx(Cell, { fill: entry.isToday ? '#EDBE44' : '#EDE7DC', stroke: "none" }, i))) })] }) })] }), _jsx(CardWidget, { title: "System Health", children: _jsxs("div", { className: "flex flex-col items-center justify-center mt-8", children: [_jsxs(CircularProgress, { value: uptimePct, size: 130, strokeWidth: 8, children: [_jsxs("span", { className: "text-4xl font-bold text-text", children: [uptimePct, "%"] }), _jsx("span", { className: "text-[10px] text-muted", children: "Uptime" })] }), _jsxs("div", { className: "flex items-center gap-3 mt-3", children: [_jsx("button", { className: "w-8 h-8 rounded-full bg-bg border border-border-light flex items-center justify-center hover:bg-bg-warm transition-colors", children: _jsx(Play, { className: "w-3.5 h-3.5 text-muted ml-0.5" }) }), _jsx("button", { className: "w-8 h-8 rounded-full bg-bg border border-border-light flex items-center justify-center hover:bg-bg-warm transition-colors", children: _jsx(Pause, { className: "w-3.5 h-3.5 text-muted" }) })] })] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-4xl font-semibold text-text", children: "Pipeline" }), _jsxs("span", { className: "text-5xl font-black text-text", children: [totalScans > 0 ? Math.round((completedScans / totalScans) * 100) : 0, "%"] })] }), _jsxs("div", { className: "flex items-center gap-1 text-sm text-muted mb-2", children: [_jsxs("span", { children: [completedScans, " done"] }), _jsx("span", { className: "text-border", children: "|" }), _jsxs("span", { children: [runningScans, " running"] }), _jsx("span", { className: "text-border", children: "|" }), _jsxs("span", { children: [failedScans, " failed"] })] }), _jsx("div", { className: "flex items-center gap-2 mt-3", children: _jsxs("div", { className: "flex-1 flex items-center bg-bg-warm rounded-full p-0.5", children: [_jsx("span", { className: cn('flex-1 text-center text-[10px] font-medium py-1.5 rounded-full transition-colors', isHealthy ? 'bg-green-400 text-white' : 'text-muted'), children: "Healthy" }), _jsx("span", { className: cn('flex-1 text-center text-[10px] font-medium py-1.5 rounded-full transition-colors', !isHealthy ? 'bg-red-400 text-white' : 'text-muted'), children: "Issues" })] }) })] }), _jsx(TaskChecklist, { title: "Recent Scans", done: completedScans, total: totalScans, items: recentScanTasks })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light px-5", children: [_jsx(CollapsibleSection, { title: "Services", defaultOpen: true, children: _jsx("div", { className: "space-y-2", children: healthServices.length > 0 ? healthServices.map(([name, statusVal]) => {
                                        const statusStr = typeof statusVal === 'object' && statusVal !== null
                                            ? statusVal.status ?? 'unknown'
                                            : String(statusVal);
                                        return (_jsxs("div", { className: "flex items-center gap-3 py-1.5", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-bg flex items-center justify-center", children: _jsx(Server, { className: "w-4 h-4 text-muted" }) }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx("p", { className: "text-lg font-medium text-text capitalize", children: name }) }), _jsx("span", { className: cn('w-2 h-2 rounded-full', statusStr === 'ok' ? 'bg-success' : 'bg-warning') })] }, name));
                                    }) : (_jsx("p", { className: "text-xs text-muted py-2", children: "No services data" })) }) }), _jsx(CollapsibleSection, { title: "Connections", children: _jsxs("div", { className: "flex items-center gap-3 py-1.5", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-bg flex items-center justify-center", children: _jsx(Laptop, { className: "w-4 h-4 text-muted" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-md font-medium text-text", children: "WebSocket" }), _jsx("p", { className: "text-sm text-muted", children: connected ? 'Connected' : 'Disconnected' })] })] }) }), _jsx(CollapsibleSection, { title: "Quick Actions", children: _jsx("div", { className: "space-y-1.5", children: [
                                        { label: 'New Project', action: () => navigate('/new-project') },
                                        { label: 'View Graph', action: () => navigate('/graph') },
                                        { label: 'Run Analysis', action: () => navigate('/analysis') },
                                    ].map(({ label, action }) => (_jsxs("span", { className: 'flex rounded-xs border-2 items-center px-4 text-2xl font-medium text-accent hover:text-accent-hover py-1 transition-all ease-in-out duration-300 hover:scale-105', children: [_jsx("button", { onClick: action, className: "w-full text-left ", children: label }, label), _jsx(ChevronsRight, {})] }))) }) }), _jsx(CollapsibleSection, { title: "Infrastructure", children: _jsx("p", { className: "text-xl text-muted py-1", children: isHealthy ? 'All systems operational' : 'Some services may be down' }) })] }), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 pt-5", children: [_jsx("span", { className: "text-xs text-muted", children: "Previous" }), _jsx("h3", { className: "text-3xl font-semibold text-text", children: "Recent Events" }), _jsx("span", { className: "text-xs text-muted", children: "Next" })] }), _jsx("div", { className: "grid grid-cols-5 gap-0 px-5 py-3 text-center", children: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (_jsxs("div", { className: "flex flex-col items-center gap-1", children: [_jsx("span", { className: "text-[10px] text-muted", children: d }), _jsx("span", { className: cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold', i === 2 ? 'bg-accent text-white' : 'text-text'), children: new Date().getDate() - 2 + i })] }, d))) }), _jsx("div", { className: "border-t border-border-light", children: eventList.length === 0 ? (_jsx("div", { className: "px-5 py-8 text-center text-xs text-muted", children: "No events yet" })) : (_jsx("div", { className: "divide-y divide-border-light", children: eventList.slice(0, 5).map((event, i) => (_jsxs("div", { className: "px-5 py-3 flex items-center gap-3", children: [_jsx("span", { className: "text-[10px] text-muted w-14 flex-shrink-0", children: new Date(event.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) }), _jsxs("div", { className: cn('flex-1 rounded-[var(--radius-sm)] px-3 py-2', i === 0
                                                    ? 'bg-accent/15 border border-accent/20'
                                                    : 'bg-bg'), children: [_jsx("p", { className: "text-xs font-medium text-text truncate", children: event.type.replace(/\./g, ' ') }), _jsx("p", { className: "text-[10px] text-muted truncate", children: typeof event.payload?.message === 'string'
                                                            ? event.payload.message
                                                            : event.projectId
                                                                ? `Project ${event.projectId}`
                                                                : 'System event' })] })] }, event.id))) })) })] }), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-border-light overflow-hidden", children: [_jsxs("div", { className: "px-5 py-4 flex items-center justify-between border-b border-border-light", children: [_jsx("h3", { className: "text-5xl font-semibold text-text", children: "Projects" }), _jsxs("span", { className: "text-3xl items-center text-muted", children: [_jsx("span", { className: "font-black text-4xl", children: projectList.length }), " total"] })] }), projectList.length === 0 ? (_jsx("div", { className: "px-5 py-8 text-center text-xs text-muted", children: "No projects yet" })) : (_jsx("div", { className: "divide-y divide-border-light", children: projectList.slice(0, 6).map((p) => (_jsxs(Link, { to: `/projects/${p.id}`, className: "px-5 py-3 flex items-center gap-3 hover:bg-hover transition-colors group", children: [_jsx("div", { className: "w-9 h-9 rounded-[var(--radius-sm)] bg-accent/10 flex items-center justify-center flex-shrink-0", children: _jsx(FolderKanban, { className: "w-4 h-4 text-accent" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-semibold text-text truncate", children: p.name }), _jsx("p", { className: "text-[10px] text-muted", children: timeAgo(p.createdAt) })] }), _jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-light group-hover:text-accent transition-colors flex-shrink-0" })] }, p.id))) }))] })] })] }));
}
