import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { ProjectSelect } from '../components/ProjectSelect.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { ErrorBanner } from '../components/ErrorBanner.tsx';
import { EmptyState } from '../components/EmptyState.tsx';
import { useAsyncData } from '../hooks/useAsyncData.ts';
const TABS = [
    { id: 'impact', label: 'Impact Analysis' },
    { id: 'drift', label: 'Drift Detection' },
    { id: 'dead-code', label: 'Dead Code' },
    { id: 'health', label: 'Health Score' },
];
function ScoreCircle({ score }) {
    const color = score < 40 ? 'text-red-500' : score < 70 ? 'text-yellow-500' : 'text-green-500';
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (score / 100) * circumference;
    return (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsxs("div", { className: "relative w-36 h-36", children: [_jsxs("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 120 120", children: [_jsx("circle", { cx: "60", cy: "60", r: "54", fill: "none", stroke: "currentColor", strokeWidth: "8", className: "text-border-light" }), _jsx("circle", { cx: "60", cy: "60", r: "54", fill: "none", strokeWidth: "8", strokeLinecap: "round", stroke: "currentColor", className: color, strokeDasharray: circumference, strokeDashoffset: offset })] }), _jsx("div", { className: cn('absolute inset-0 flex items-center justify-center text-3xl font-bold', color), children: score })] }), _jsx("span", { className: cn('text-sm font-medium', color), children: score < 40 ? 'Poor' : score < 70 ? 'Fair' : 'Good' })] }));
}
function BreakdownBar({ label, value, max, inverted }) {
    const pct = Math.min((value / max) * 100, 100);
    const displayPct = inverted ? 100 - pct : pct;
    const barColor = displayPct < 40 ? 'bg-red-500' : displayPct < 70 ? 'bg-yellow-500' : 'bg-green-500';
    return (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted", children: label }), _jsx("span", { className: "font-medium text-text", children: typeof value === 'number' ? (max === 100 ? `${value.toFixed(1)}%` : value.toFixed(1)) : value })] }), _jsx("div", { className: "h-2 rounded-full bg-border-light overflow-hidden", children: _jsx("div", { className: cn('h-full rounded-full transition-all', barColor), style: { width: `${pct}%` } }) })] }));
}
// --- Tab Components ---
function ImpactTab({ projects }) {
    const [filePath, setFilePath] = useState('');
    const [projectId, setProjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [rawOpen, setRawOpen] = useState(false);
    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!filePath.trim())
            return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.analyzeImpact({ filePath: filePath.trim(), projectId: projectId || undefined });
            setResult(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("form", { onSubmit: handleAnalyze, className: "flex items-end gap-3", children: [_jsxs("div", { className: "flex-1 space-y-5 ", children: [_jsx("label", { className: "text-md font-medium text-muted", children: "File Path" }), _jsx("input", { type: "text", value: filePath, onChange: (e) => setFilePath(e.target.value), placeholder: "src/services/user.ts", className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text" })] }), _jsxs("div", { className: "w-48 space-y-1", children: [_jsx("label", { className: "text-md font-medium text-muted", children: "Project (optional)" }), _jsx(ProjectSelect, { value: projectId, onChange: setProjectId, projects: projects })] }), _jsx("button", { type: "submit", disabled: loading || !filePath.trim(), className: "px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : 'Analyze' })] }), error && _jsx(ErrorBanner, { message: error }), !result && !loading && !error && (_jsx(EmptyState, { message: "Enter a file path to analyze its impact" })), loading && _jsx(LoadingSkeleton, {}), result && !loading && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-light", children: [_jsx("h3", { className: "text-sm font-semibold text-text", children: "Direct Impact" }), _jsxs("span", { className: "text-xs text-muted", children: ["(", result.directImpact.length, ")"] })] }), result.directImpact.length === 0 ? (_jsx("div", { className: "px-5 py-4 text-sm text-muted", children: "No direct impact found" })) : (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border-light", children: [_jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Entity" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "File" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Project" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Type" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: result.directImpact.map((item, i) => (_jsxs("tr", { className: "hover:bg-hover transition-colors", children: [_jsx("td", { className: "px-5 py-2.5 font-mono text-text", children: item.entity }), _jsx("td", { className: "px-5 py-2.5 text-muted", children: item.file }), _jsx("td", { className: "px-5 py-2.5 text-muted", children: item.project }), _jsx("td", { className: "px-5 py-2.5", children: _jsx("span", { className: "inline-block rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent", children: item.type }) })] }, i))) })] }))] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-light", children: [_jsx("h3", { className: "text-sm font-semibold text-text", children: "Transitive Impact" }), _jsxs("span", { className: "text-xs text-muted", children: ["(", result.transitiveImpact.length, ")"] })] }), result.transitiveImpact.length === 0 ? (_jsx("div", { className: "px-5 py-4 text-sm text-muted", children: "No transitive impact found" })) : (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border-light", children: [_jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Entity" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "File" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Project" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Depth" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: result.transitiveImpact.map((item, i) => (_jsxs("tr", { className: "hover:bg-hover transition-colors", children: [_jsx("td", { className: "px-5 py-2.5 font-mono text-text", children: item.entity }), _jsx("td", { className: "px-5 py-2.5 text-muted", children: item.file }), _jsx("td", { className: "px-5 py-2.5 text-muted", children: item.project }), _jsx("td", { className: "px-5 py-2.5", children: _jsx("span", { className: "inline-block rounded-full bg-hover px-2 py-0.5 text-xs font-medium text-text", children: item.depth }) })] }, i))) })] }))] }), result.crossProjectImpact.length > 0 && (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-light", children: [_jsx("h3", { className: "text-sm font-semibold text-text", children: "Cross-Project Impact" }), _jsxs("span", { className: "text-xs text-muted", children: ["(", result.crossProjectImpact.length, ")"] })] }), _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border-light", children: [_jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Entity" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "File" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Project" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: result.crossProjectImpact.map((item, i) => (_jsxs("tr", { className: "hover:bg-hover transition-colors", children: [_jsx("td", { className: "px-5 py-2.5 font-mono text-text", children: item.entity }), _jsx("td", { className: "px-5 py-2.5 text-muted", children: item.file }), _jsx("td", { className: "px-5 py-2.5 text-muted", children: item.project })] }, i))) })] })] })), result.rawAnalysis && (_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("button", { onClick: () => setRawOpen(!rawOpen), className: "flex items-center gap-2 w-full px-5 py-4 text-left hover:bg-hover transition-colors", children: [rawOpen ? _jsx(ChevronDown, { className: "h-4 w-4 text-muted" }) : _jsx(ChevronRight, { className: "h-4 w-4 text-muted" }), _jsx("h3", { className: "text-sm font-semibold text-text", children: "Raw Analysis" })] }), rawOpen && (_jsx("div", { className: "px-5 pb-5 border-t border-border-light pt-4", children: _jsx("div", { className: "prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap", children: result.rawAnalysis }) }))] }))] }))] }));
}
function DriftTab({ projects }) {
    const [projectId, setProjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleDetect = async () => {
        if (!projectId)
            return;
        setLoading(true);
        setError(null);
        try {
            const data = await api.analyzeDrift(projectId);
            setResult(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Drift detection failed');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-end gap-3", children: [_jsx("div", { className: "w-64 space-y-1", children: _jsx(ProjectSelect, { value: projectId, onChange: setProjectId, projects: projects, required: true }) }), _jsx("button", { onClick: handleDetect, disabled: loading || !projectId, className: "px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : 'Detect Drift' })] }), error && _jsx(ErrorBanner, { message: error }), loading && _jsx(LoadingSkeleton, {}), result && !loading && (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-light", children: [_jsx("h3", { className: "text-sm font-semibold text-text", children: result.projectName }), _jsxs("span", { className: "inline-block rounded-full bg-accent-light px-2.5 py-0.5 text-xs font-medium text-accent", children: [result.currentState.entityCount, " entities"] })] }), _jsx("div", { className: "px-5 py-4 border-b border-border-light", children: _jsx("div", { className: "prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap", children: result.analysis }) }), result.currentState.entities.length > 0 && (_jsxs("div", { className: "px-5 py-4", children: [_jsx("p", { className: "text-xs font-medium text-muted mb-2", children: "Entities" }), _jsx("div", { className: "flex flex-wrap gap-1.5", children: result.currentState.entities.map((ent, i) => (_jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-hover px-2.5 py-1 text-xs text-text", children: [_jsx("span", { className: "font-medium", children: ent.name }), _jsxs("span", { className: "text-muted", children: ["(", ent.type, ")"] })] }, i))) })] }))] }) })), !result && !loading && !error && (_jsx(EmptyState, { message: "Select a project and click \"Detect Drift\" to analyze" }))] }));
}
function DeadCodeTab({ projects }) {
    const [projectId, setProjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!projectId) {
            setResult(null);
            return;
        }
        setLoading(true);
        setError(null);
        api.analyzeDeadCode(projectId)
            .then(setResult)
            .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dead code'))
            .finally(() => setLoading(false));
    }, [projectId]);
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-64 space-y-1", children: _jsx(ProjectSelect, { value: projectId, onChange: setProjectId, projects: projects, required: true }) }), result && (_jsxs("span", { className: "mt-5 inline-flex items-center gap-1 rounded-full bg-accent-light px-3 py-1 text-xs font-medium text-accent", children: [result.count, " unreferenced / ", result.totalEntities, " total"] }))] }), error && _jsx(ErrorBanner, { message: error }), loading && _jsx(LoadingSkeleton, {}), result && !loading && (_jsx("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: result.unreferencedEntities.length === 0 ? (_jsx("div", { className: "px-5 py-8 text-center text-sm text-muted", children: "No unreferenced entities found" })) : (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border-light", children: [_jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Name" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "Type" }), _jsx("th", { className: "text-left px-5 py-2 text-muted uppercase text-xs font-medium", children: "File" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: result.unreferencedEntities.map((item, i) => (_jsxs("tr", { className: "hover:bg-hover transition-colors", children: [_jsx("td", { className: "px-5 py-2.5 font-mono text-text", children: item.name }), _jsx("td", { className: "px-5 py-2.5", children: _jsx("span", { className: "inline-block rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent", children: item.type }) }), _jsx("td", { className: "px-5 py-2.5 text-muted", children: item.file })] }, i))) })] })) })), !projectId && !loading && !error && (_jsx(EmptyState, { message: "Select a project to detect dead code" }))] }));
}
function HealthTab({ projects }) {
    const [projectId, setProjectId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!projectId) {
            setResult(null);
            return;
        }
        setLoading(true);
        setError(null);
        api.getHealthScore(projectId)
            .then(setResult)
            .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load health score'))
            .finally(() => setLoading(false));
    }, [projectId]);
    return (_jsxs("div", { className: "space-y-5", children: [_jsx("div", { className: "w-64 space-y-1", children: _jsx(ProjectSelect, { value: projectId, onChange: setProjectId, projects: projects, required: true }) }), error && _jsx(ErrorBanner, { message: error }), loading && _jsx(LoadingSkeleton, {}), result && !loading && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-5", children: [_jsx("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-6 flex items-center justify-center", children: _jsx(ScoreCircle, { score: result.score }) }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsx("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-light", children: _jsx("h3", { className: "text-sm font-semibold text-text", children: "Breakdown" }) }), _jsxs("div", { className: "px-5 py-4 space-y-4", children: [_jsx(BreakdownBar, { label: "Graph Coverage", value: result.breakdown.graphCoverage, max: 100 }), _jsx(BreakdownBar, { label: "Orphan Ratio", value: result.breakdown.orphanRatio, max: 100, inverted: true }), _jsx(BreakdownBar, { label: "Complexity", value: result.breakdown.cyclomaticComplexity, max: 100 }), _jsx(BreakdownBar, { label: "Cross-Project Coupling", value: result.breakdown.crossProjectCoupling, max: 100 })] })] }), _jsxs("div", { className: "md:col-span-2 bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsx("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-light", children: _jsx("h3", { className: "text-sm font-semibold text-text", children: "Statistics" }) }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 divide-x divide-border-light", children: [
                                    { label: 'Total Entities', value: result.stats.totalEntities },
                                    { label: 'Total Relations', value: result.stats.totalRelations },
                                    { label: 'Orphan Entities', value: result.stats.orphanEntities },
                                    { label: 'External Relations', value: result.stats.externalRelations },
                                ].map((stat) => (_jsxs("div", { className: "px-5 py-4 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-text", children: stat.value }), _jsx("div", { className: "text-xs text-muted mt-1", children: stat.label })] }, stat.label))) })] })] })), !projectId && !loading && !error && (_jsx(EmptyState, { message: "Select a project to view its health score" }))] }));
}
// --- Main Page ---
export function AnalysisPage() {
    const [activeTab, setActiveTab] = useState('impact');
    const { data: projects } = useAsyncData(() => api.listProjects(), []);
    const projectList = projects ?? [];
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-6xl font-bold text-text", children: "Analysis" }), _jsxs("div", { className: "bg-card mt-10 overflow-hidden", children: [_jsx("div", { className: "flex border-b border-border-light", children: TABS.map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: cn('px-4 py-2 text-xl font-medium border-b-2 transition-colors', activeTab === tab.id
                                ? 'border-accent text-accent'
                                : 'border-transparent text-muted hover:text-text'), children: tab.label }, tab.id))) }), _jsxs("div", { className: "p-5", children: [activeTab === 'impact' && _jsx(ImpactTab, { projects: projectList }), activeTab === 'drift' && _jsx(DriftTab, { projects: projectList }), activeTab === 'dead-code' && _jsx(DeadCodeTab, { projects: projectList }), activeTab === 'health' && _jsx(HealthTab, { projects: projectList })] })] })] }));
}
