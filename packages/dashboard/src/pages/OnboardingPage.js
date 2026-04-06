import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Server, MessageSquare, Link2, Lightbulb, HeartPulse } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
const STEPS = [
    { id: 1, label: 'Main Services', icon: Server },
    { id: 2, label: 'Communication', icon: MessageSquare },
    { id: 3, label: 'Dependencies', icon: Link2 },
    { id: 4, label: 'Key Decisions', icon: Lightbulb },
    { id: 5, label: 'Health', icon: HeartPulse },
];
function StepIndicator({ current }) {
    return (_jsx("div", { className: "flex items-center justify-center gap-2", children: STEPS.map((step, i) => {
            const Icon = step.icon;
            const isActive = step.id === current;
            const isDone = step.id < current;
            return (_jsxs("div", { className: "flex items-center gap-2", children: [i > 0 && (_jsx("div", { className: cn('h-px w-8', isDone ? 'bg-accent' : 'bg-border-light') })), _jsx("div", { className: cn('flex items-center justify-center h-9 w-9 rounded-full border-2 transition-colors', isActive
                            ? 'border-accent bg-accent text-white'
                            : isDone
                                ? 'border-accent bg-accent-light text-accent'
                                : 'border-border-light bg-hover text-muted'), children: _jsx(Icon, { className: "h-4 w-4" }) })] }, step.id));
        }) }));
}
function LoadingBlock() {
    return (_jsxs("div", { className: "space-y-3 animate-pulse", children: [_jsx("div", { className: "h-4 w-2/3 rounded bg-border-light" }), _jsx("div", { className: "h-4 w-full rounded bg-border-light" }), _jsx("div", { className: "h-4 w-5/6 rounded bg-border-light" }), _jsx("div", { className: "h-4 w-3/4 rounded bg-border-light" })] }));
}
function ScoreCircleMini({ score }) {
    const color = score < 40 ? 'text-red-500' : score < 70 ? 'text-yellow-500' : 'text-green-500';
    const circumference = 2 * Math.PI * 42;
    const offset = circumference - (score / 100) * circumference;
    return (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsxs("div", { className: "relative w-24 h-24", children: [_jsxs("svg", { className: "w-full h-full -rotate-90", viewBox: "0 0 96 96", children: [_jsx("circle", { cx: "48", cy: "48", r: "42", fill: "none", stroke: "currentColor", strokeWidth: "6", className: "text-border-light" }), _jsx("circle", { cx: "48", cy: "48", r: "42", fill: "none", strokeWidth: "6", strokeLinecap: "round", stroke: "currentColor", className: color, strokeDasharray: circumference, strokeDashoffset: offset })] }), _jsx("div", { className: cn('absolute inset-0 flex items-center justify-center text-2xl font-bold', color), children: score })] }), _jsx("span", { className: cn('text-sm font-medium', color), children: score < 40 ? 'Poor' : score < 70 ? 'Fair' : 'Good' })] }));
}
// Step content components
function StepServices({ projectId, projectName }) {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        api.query(`What are the main services in project ${projectName}?`, 'mix', projectId)
            .then((r) => setContent(r.response))
            .catch((err) => setError(err instanceof Error ? err.message : 'Query failed'))
            .finally(() => setLoading(false));
    }, [projectId, projectName]);
    if (loading)
        return _jsx(LoadingBlock, {});
    if (error)
        return _jsx("div", { className: "text-sm text-red-500", children: error });
    return (_jsx("div", { className: "prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap", children: content }));
}
function StepCommunication({ projectId, projectName }) {
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        api.query(`How do services communicate in project ${projectName}? What protocols and patterns are used?`, 'mix', projectId)
            .then((r) => setContent(r.response))
            .catch((err) => setError(err instanceof Error ? err.message : 'Query failed'))
            .finally(() => setLoading(false));
    }, [projectId, projectName]);
    if (loading)
        return _jsx(LoadingBlock, {});
    if (error)
        return _jsx("div", { className: "text-sm text-red-500", children: error });
    return (_jsx("div", { className: "prose prose-sm max-w-none text-text leading-relaxed whitespace-pre-wrap", children: content }));
}
function StepDependencies({ projectId, projects }) {
    const [loading, setLoading] = useState(true);
    const [links, setLinks] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        api.listProjectLinks(projectId)
            .then(setLinks)
            .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load links'))
            .finally(() => setLoading(false));
    }, [projectId]);
    const projectName = (id) => projects.find((p) => p.id === id)?.name ?? id;
    if (loading)
        return _jsx(LoadingBlock, {});
    if (error)
        return _jsx("div", { className: "text-sm text-red-500", children: error });
    if (links.length === 0) {
        return _jsx("div", { className: "text-sm text-muted py-4", children: "No cross-project dependencies defined yet." });
    }
    return (_jsx("div", { className: "space-y-3", children: links.map((link) => (_jsxs("div", { className: "flex items-center gap-3 p-3 rounded-[--radius-sm] bg-hover border border-border-light", children: [_jsx(Link2, { className: "h-4 w-4 text-accent flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "text-sm font-medium text-text", children: [projectName(link.sourceProjectId), " \u2192 ", projectName(link.targetProjectId)] }), _jsxs("div", { className: "text-xs text-muted", children: [link.linkType, link.description ? ` — ${link.description}` : ''] })] })] }, link.id))) }));
}
function StepDecisions({ projectId }) {
    const [loading, setLoading] = useState(true);
    const [annotations, setAnnotations] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        api.listAnnotations({ projectId })
            .then((all) => setAnnotations(all.filter((a) => a.type === 'decision')))
            .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load annotations'))
            .finally(() => setLoading(false));
    }, [projectId]);
    if (loading)
        return _jsx(LoadingBlock, {});
    if (error)
        return _jsx("div", { className: "text-sm text-red-500", children: error });
    if (annotations.length === 0) {
        return _jsx("div", { className: "text-sm text-muted py-4", children: "No architectural decisions documented yet." });
    }
    return (_jsx("div", { className: "space-y-3", children: annotations.map((ann) => (_jsxs("div", { className: "p-4 rounded-[--radius-sm] bg-hover border border-border-light", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(Lightbulb, { className: "h-4 w-4 text-yellow-500 flex-shrink-0" }), _jsx("span", { className: "text-sm font-semibold text-text", children: ann.entityName }), ann.author && _jsxs("span", { className: "text-xs text-muted", children: ["by ", ann.author] })] }), _jsx("p", { className: "text-sm text-text leading-relaxed whitespace-pre-wrap", children: ann.content }), _jsx("div", { className: "text-xs text-muted mt-2", children: new Date(ann.createdAt).toLocaleDateString() })] }, ann.id))) }));
}
function StepHealth({ projectId }) {
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        api.getHealthScore(projectId)
            .then(setHealth)
            .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load health score'))
            .finally(() => setLoading(false));
    }, [projectId]);
    if (loading)
        return _jsx(LoadingBlock, {});
    if (error)
        return _jsx("div", { className: "text-sm text-red-500", children: error });
    if (!health)
        return null;
    const breakdownItems = [
        { label: 'Graph Coverage', value: health.breakdown.graphCoverage },
        { label: 'Orphan Ratio', value: health.breakdown.orphanRatio, inverted: true },
        { label: 'Complexity', value: health.breakdown.cyclomaticComplexity },
        { label: 'Cross-Project Coupling', value: health.breakdown.crossProjectCoupling },
    ];
    return (_jsxs("div", { className: "flex flex-col md:flex-row items-start gap-6", children: [_jsx(ScoreCircleMini, { score: health.score }), _jsxs("div", { className: "flex-1 space-y-3 w-full", children: [breakdownItems.map((item) => {
                        const pct = Math.min(item.value, 100);
                        const displayPct = item.inverted ? 100 - pct : pct;
                        const barColor = displayPct < 40 ? 'bg-red-500' : displayPct < 70 ? 'bg-yellow-500' : 'bg-green-500';
                        return (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted", children: item.label }), _jsxs("span", { className: "font-medium text-text", children: [item.value.toFixed(1), "%"] })] }), _jsx("div", { className: "h-2 rounded-full bg-border-light overflow-hidden", children: _jsx("div", { className: cn('h-full rounded-full transition-all', barColor), style: { width: `${pct}%` } }) })] }, item.label));
                    }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-4", children: [
                            { label: 'Entities', value: health.stats.totalEntities },
                            { label: 'Relations', value: health.stats.totalRelations },
                            { label: 'Orphans', value: health.stats.orphanEntities },
                            { label: 'External', value: health.stats.externalRelations },
                        ].map((stat) => (_jsxs("div", { className: "text-center p-2 rounded-[--radius-sm] bg-hover", children: [_jsx("div", { className: "text-lg font-bold text-text", children: stat.value }), _jsx("div", { className: "text-xs text-muted", children: stat.label })] }, stat.label))) })] })] }));
}
// Main page
export function OnboardingPage() {
    const { projectId: paramProjectId } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState(paramProjectId ?? '');
    const [step, setStep] = useState(1);
    useEffect(() => {
        api.listProjects().then((list) => {
            setProjects(list);
            if (!projectId && list.length > 0) {
                setProjectId(list[0].id);
            }
        }).catch(console.error);
    }, []);
    const selectedProject = projects.find((p) => p.id === projectId);
    const handleProjectChange = useCallback((id) => {
        setProjectId(id);
        setStep(1);
        navigate(id ? `/onboarding/${id}` : '/onboarding', { replace: true });
    }, [navigate]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold text-text", children: "Onboarding" }), _jsx("div", { className: "w-64", children: _jsxs("select", { value: projectId, onChange: (e) => handleProjectChange(e.target.value), className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text", children: [_jsx("option", { value: "", children: "Select a project" }), projects.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] }) })] }), !projectId && (_jsx("div", { className: "py-16 text-center text-muted text-sm", children: "Select a project to start the onboarding tour" })), projectId && selectedProject && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-4", children: [_jsx(StepIndicator, { current: step }), _jsx("div", { className: "text-center mt-3", children: _jsxs("span", { className: "text-sm font-medium text-text", children: ["Step ", step, ": ", STEPS[step - 1].label] }) })] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm p-6 min-h-[300px]", children: [step === 1 && _jsx(StepServices, { projectId: projectId, projectName: selectedProject.name }), step === 2 && _jsx(StepCommunication, { projectId: projectId, projectName: selectedProject.name }), step === 3 && _jsx(StepDependencies, { projectId: projectId, projects: projects }), step === 4 && _jsx(StepDecisions, { projectId: projectId }), step === 5 && _jsx(StepHealth, { projectId: projectId })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("button", { onClick: () => setStep((s) => Math.max(1, s - 1)), disabled: step === 1, className: "flex items-center gap-2 px-4 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm font-medium text-text hover:bg-border-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: [_jsx(ChevronLeft, { className: "h-4 w-4" }), "Previous"] }), _jsxs("span", { className: "text-sm text-muted", children: [step, " of ", STEPS.length] }), _jsxs("button", { onClick: () => setStep((s) => Math.min(STEPS.length, s + 1)), disabled: step === STEPS.length, className: "flex items-center gap-2 px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: ["Next", _jsx(ChevronRight, { className: "h-4 w-4" })] })] })] }))] }));
}
