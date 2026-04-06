import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Bell, X, CheckCheck, AlertCircle, CheckCircle2, Pause, Upload } from 'lucide-react';
import { cn } from '../lib/utils.ts';
import { timeAgo } from '../lib/helpers.ts';
const NOTIFICATION_ICONS = {
    'scan.completed': CheckCircle2,
    'scan.failed': AlertCircle,
    'scan.paused': Pause,
    'snapshot.imported': Upload,
};
const NOTIFICATION_COLORS = {
    'scan.completed': 'text-success',
    'scan.failed': 'text-error',
    'scan.paused': 'text-warning',
    'snapshot.imported': 'text-accent',
};
export function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('cortex-notifications') ?? '[]');
        }
        catch {
            return [];
        }
    });
    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('cortex-notifications', JSON.stringify(notifications));
    }, [notifications]);
    const unreadCount = notifications.filter((n) => !n.read).length;
    const addNotification = useCallback((type, message) => {
        setNotifications((prev) => [
            { id: crypto.randomUUID(), type, message, timestamp: new Date().toISOString(), read: false },
            ...prev.slice(0, 49), // Keep max 50
        ]);
    }, []);
    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };
    const clearAll = () => {
        setNotifications([]);
    };
    // Listen for WebSocket events
    useEffect(() => {
        const wsUrl = `ws://${window.location.hostname}:${window.location.port || '3100'}/ws?key=dev-key-1`;
        let ws = null;
        const connect = () => {
            ws = new WebSocket(wsUrl);
            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'scan.completed') {
                        addNotification('scan.completed', `Scan completed for ${data.repoName ?? 'repo'}`);
                    }
                    else if (data.type === 'scan.failed') {
                        addNotification('scan.failed', `Scan failed: ${data.error ?? 'unknown error'}`);
                    }
                    else if (data.type === 'scan.paused') {
                        addNotification('scan.paused', `Scan paused (rate limit)`);
                    }
                    else if (data.type === 'snapshot.imported') {
                        addNotification('snapshot.imported', `Snapshot imported`);
                    }
                }
                catch { /* ignore */ }
            };
            ws.onclose = () => {
                // Reconnect after 5s
                setTimeout(connect, 5000);
            };
        };
        connect();
        return () => { ws?.close(); };
    }, [addNotification]);
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setOpen(!open), className: "relative flex h-9 w-9 items-center justify-center rounded-[--radius-sm] bg-bg border border-border-light hover:bg-hover transition-colors", children: [_jsx(Bell, { className: "h-4 w-4 text-muted" }), unreadCount > 0 && (_jsx("span", { className: "absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white", children: unreadCount > 9 ? '9+' : unreadCount }))] }), open && (_jsxs("div", { className: "absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-card border border-border-light rounded-[--radius-lg] shadow-lg z-50", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border-light", children: [_jsx("span", { className: "text-sm font-semibold text-text", children: "Notifications" }), _jsxs("div", { className: "flex items-center gap-2", children: [unreadCount > 0 && (_jsx("button", { onClick: markAllRead, className: "text-xs text-muted hover:text-accent transition-colors", title: "Mark all read", children: _jsx(CheckCheck, { className: "h-3.5 w-3.5" }) })), notifications.length > 0 && (_jsx("button", { onClick: clearAll, className: "text-xs text-muted hover:text-error transition-colors", title: "Clear all", children: _jsx(X, { className: "h-3.5 w-3.5" }) }))] })] }), notifications.length === 0 ? (_jsx("div", { className: "px-4 py-8 text-center text-xs text-muted", children: "No notifications" })) : (notifications.map((n) => {
                        const Icon = NOTIFICATION_ICONS[n.type] ?? Bell;
                        const color = NOTIFICATION_COLORS[n.type] ?? 'text-muted';
                        return (_jsxs("div", { className: cn('flex items-start gap-3 px-4 py-3 border-b border-border-light last:border-0 transition-colors', !n.read && 'bg-accent-light/20'), children: [_jsx(Icon, { className: cn('h-4 w-4 mt-0.5 flex-shrink-0', color) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-xs text-text", children: n.message }), _jsx("p", { className: "text-[10px] text-muted mt-0.5", children: timeAgo(n.timestamp) })] })] }, n.id));
                    }))] }))] }));
}
