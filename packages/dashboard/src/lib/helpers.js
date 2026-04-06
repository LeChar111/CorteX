/**
 * Shared helper functions used across dashboard pages.
 * Extracted from Overview.tsx, Projects.tsx, Project.tsx, NewProject.tsx.
 */
/** Human-readable relative time (e.g. "5m ago", "2h ago", "3d ago"). */
export function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)
        return 'just now';
    if (mins < 60)
        return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24)
        return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}
/** Format a date string as "Mon DD, YYYY" or return em-dash for null. */
export function formatDate(dateStr) {
    if (!dateStr)
        return '\u2014';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
/** Human-readable duration between two timestamps (e.g. "418ms", "2.3s", "3m 46s"). */
export function formatDuration(start, end) {
    if (!start || !end)
        return '\u2014';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(1)}s`;
    const mins = Math.floor(ms / 60000);
    const secs = Math.round((ms % 60000) / 1000);
    if (mins < 60)
        return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return remainMins > 0 ? `${hours}h ${remainMins}m` : `${hours}h`;
}
/** Convert a string to a URL-safe slug. */
export function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
