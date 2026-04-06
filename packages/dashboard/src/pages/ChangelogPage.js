import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Loader2, Download, Calendar, FileText, BarChart3 } from 'lucide-react';
import { api } from '../api.ts';
import { ProjectSelect } from '../components/ProjectSelect.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { ErrorBanner } from '../components/ErrorBanner.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { useAsyncData } from '../hooks/useAsyncData.ts';
export function ChangelogPage() {
    const { data: projects } = useAsyncData(() => api.listProjects(), []);
    const projectList = projects ?? [];
    const [projectId, setProjectId] = useState('');
    const [since, setSince] = useState(() => {
        const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return d.toISOString().split('T')[0];
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleGenerate = async () => {
        if (!projectId)
            return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.getChangelog(projectId, since || undefined);
            setResult(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate changelog');
        }
        finally {
            setLoading(false);
        }
    };
    const exportMarkdown = () => {
        if (!result)
            return;
        const lines = [
            `# Changelog: ${result.projectName}`,
            ``,
            `**Since:** ${new Date(result.since).toLocaleDateString()}`,
            `**Scans:** ${result.scanCount}`,
            ``,
            `## Timeline`,
            ``,
        ];
        for (const entry of result.entries) {
            lines.push(`### ${new Date(entry.date).toLocaleString()}`);
            lines.push(`- ${entry.description}`);
            if (Object.keys(entry.stats).length > 0) {
                for (const [k, v] of Object.entries(entry.stats)) {
                    lines.push(`  - ${k}: ${v}`);
                }
            }
            lines.push('');
        }
        if (result.analysis) {
            lines.push(`## Architecture Analysis`, ``, result.analysis, ``);
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `changelog-${result.projectName}-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };
    // Compute summary stats
    const totalFiles = result?.entries.reduce((sum, e) => sum + (e.stats.filesProcessed ?? 0), 0) ?? 0;
    const totalEntities = result?.entries.reduce((sum, e) => sum + (e.stats.entitiesExtracted ?? 0), 0) ?? 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold text-text", children: "Changelog" }), result && (_jsxs("button", { onClick: exportMarkdown, className: "flex items-center gap-2 px-4 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm font-medium text-text hover:bg-border-light transition-colors", children: [_jsx(Download, { className: "h-4 w-4" }), "Export as Markdown"] }))] }), _jsx("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-5", children: _jsxs("div", { className: "flex items-end gap-4", children: [_jsxs("div", { className: "flex-1 space-y-1", children: [_jsx("label", { className: "text-xs font-medium text-muted", children: "Project" }), _jsx(ProjectSelect, { value: projectId, onChange: setProjectId, projects: projectList, required: true, className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text" })] }), _jsxs("div", { className: "w-48 space-y-1", children: [_jsx("label", { className: "text-xs font-medium text-muted", children: "Since" }), _jsx("input", { type: "date", value: since, onChange: (e) => setSince(e.target.value), className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text" })] }), _jsx("button", { onClick: handleGenerate, disabled: loading || !projectId, className: "px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : 'Generate Changelog' })] }) }), error && _jsx(ErrorBanner, { message: error }), loading && _jsx(LoadingSkeleton, {}), result && !loading && (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                            { label: 'Total Scans', value: result.scanCount, icon: Calendar },
                            { label: 'Files Processed', value: totalFiles, icon: FileText },
                            { label: 'Entities Extracted', value: totalEntities, icon: BarChart3 },
                        ].map(({ label, value, icon: Icon }) => (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-5 flex items-center gap-4", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-[--radius-sm] bg-accent-light", children: _jsx(Icon, { className: "h-5 w-5 text-accent" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-2xl font-bold text-text", children: value }), _jsx("div", { className: "text-xs text-muted", children: label })] })] }, label))) }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 border-b border-border-light", children: _jsx("h3", { className: "text-sm font-semibold text-text", children: "Timeline" }) }), result.entries.length === 0 ? (_jsx("div", { className: "px-5 py-8 text-center text-sm text-muted", children: "No scan entries in this period" })) : (_jsx("div", { className: "divide-y divide-border-light", children: result.entries.map((entry, i) => (_jsxs("div", { className: "px-5 py-4 flex items-start gap-4 hover:bg-hover transition-colors", children: [_jsx("div", { className: "flex-shrink-0 mt-0.5", children: _jsx("div", { className: "h-2.5 w-2.5 rounded-full bg-accent" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-sm font-medium text-text", children: new Date(entry.date).toLocaleString() }), _jsx("span", { className: "inline-block rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent", children: entry.type })] }), _jsx("p", { className: "text-sm text-muted", children: entry.description }), Object.keys(entry.stats).length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: Object.entries(entry.stats).map(([key, val]) => (_jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-hover px-2.5 py-1 text-xs text-text", children: [_jsxs("span", { className: "text-muted", children: [key, ":"] }), " ", val] }, key))) }))] })] }, i))) }))] }), result.analysis && (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 border-b border-border-light", children: _jsx("h3", { className: "text-sm font-semibold text-text", children: "Architecture Analysis" }) }), _jsx("div", { className: "px-5 py-4", children: _jsx("div", { className: "prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap", children: result.analysis }) })] }))] })), !result && !loading && !error && (_jsx(EmptyState, { message: "Select a project and generate a changelog to see scan history and architecture analysis" }))] }));
}
