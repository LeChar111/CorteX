import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, ShieldCheck, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import { ProjectSelect } from '../components/ProjectSelect.tsx';
import { LoadingSkeleton } from '../components/LoadingSkeleton.tsx';
import { ErrorBanner } from '../components/ErrorBanner.tsx';
import { useAsyncData } from '../hooks/useAsyncData.ts';
const SEVERITY_STYLES = {
    error: 'bg-error-light text-error',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-accent-light text-accent',
};
function SeverityBadge({ severity }) {
    return (_jsx("span", { className: cn('inline-block rounded-full px-2 py-0.5 text-xs font-medium', SEVERITY_STYLES[severity] || SEVERITY_STYLES.info), children: severity }));
}
function RuleCard({ rule, onDelete }) {
    return (_jsxs("div", { className: "group flex items-start gap-3 px-5 py-4 hover:bg-hover transition-colors", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-sm font-semibold text-text", children: rule.name }), _jsx(SeverityBadge, { severity: rule.severity })] }), _jsxs("p", { className: "text-xs font-mono text-muted", children: [rule.rule.source, " \u2192 ", rule.rule.target, " (", rule.rule.relation || '*', "): ", rule.rule.allow ? 'ALLOWED' : 'BLOCKED'] }), rule.description && (_jsx("p", { className: "text-xs text-muted mt-1", children: rule.description }))] }), _jsx("button", { onClick: onDelete, className: "opacity-0 group-hover:opacity-100 p-1.5 rounded-[--radius-sm] text-muted hover:text-error hover:bg-error-light transition-all", title: "Delete rule", children: _jsx(Trash2, { className: "w-3.5 h-3.5" }) })] }));
}
function AddRuleForm({ projectId, onCreated }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [relation, setRelation] = useState('*');
    const [allow, setAllow] = useState(false);
    const [severity, setSeverity] = useState('error');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !source.trim() || !target.trim())
            return;
        setLoading(true);
        try {
            await api.createArchRule({
                projectId: projectId || undefined,
                name: name.trim(),
                rule: { source: source.trim(), target: target.trim(), relation: relation.trim() || '*', allow },
                severity,
                description: description.trim() || undefined,
            });
            setName('');
            setSource('');
            setTarget('');
            setRelation('*');
            setAllow(false);
            setSeverity('error');
            setDescription('');
            setOpen(false);
            onCreated();
        }
        catch (err) {
            console.error('Failed to create rule:', err);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "border-t border-border-light", children: [_jsxs("button", { onClick: () => setOpen(!open), className: "flex items-center gap-2 w-full px-5 py-3 text-left hover:bg-hover transition-colors", children: [open ? _jsx(ChevronDown, { className: "h-4 w-4 text-muted" }) : _jsx(ChevronRight, { className: "h-4 w-4 text-muted" }), _jsx(Plus, { className: "h-3.5 w-3.5 text-accent" }), _jsx("span", { className: "text-sm font-medium text-accent", children: "Add Rule" })] }), open && (_jsxs("form", { onSubmit: handleSubmit, className: "px-5 pb-5 space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-medium text-muted", children: "Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), placeholder: "No direct DB access from frontend", className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text", required: true })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-medium text-muted", children: "Severity" }), _jsxs("select", { value: severity, onChange: (e) => setSeverity(e.target.value), className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text", children: [_jsx("option", { value: "error", children: "Error" }), _jsx("option", { value: "warning", children: "Warning" }), _jsx("option", { value: "info", children: "Info" })] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-medium text-muted", children: "Source pattern" }), _jsx("input", { type: "text", value: source, onChange: (e) => setSource(e.target.value), placeholder: "frontend/.*", className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text font-mono", required: true })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-medium text-muted", children: "Target pattern" }), _jsx("input", { type: "text", value: target, onChange: (e) => setTarget(e.target.value), placeholder: ".*database.*", className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text font-mono", required: true })] }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-medium text-muted", children: "Relation type" }), _jsx("input", { type: "text", value: relation, onChange: (e) => setRelation(e.target.value), placeholder: "*", className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text font-mono" })] })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: allow, onChange: (e) => setAllow(e.target.checked), className: "rounded border-border-light" }), _jsx("span", { className: "text-xs font-medium text-text", children: "Allow (uncheck = block)" })] }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("label", { className: "text-xs font-medium text-muted", children: "Description (optional)" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Why this rule exists...", rows: 2, className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text resize-none" })] }), _jsx("button", { type: "submit", disabled: loading || !name.trim() || !source.trim() || !target.trim(), className: "px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : 'Create Rule' })] }))] }));
}
export function ConformancePage() {
    const { data: projects } = useAsyncData(() => api.listProjects(), []);
    const projectList = projects ?? [];
    const [projectId, setProjectId] = useState('');
    const [rules, setRules] = useState([]);
    const [rulesLoading, setRulesLoading] = useState(false);
    const [checkResult, setCheckResult] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false);
    const [checkError, setCheckError] = useState(null);
    const loadRules = () => {
        setRulesLoading(true);
        api.listArchRules(projectId || undefined)
            .then(setRules)
            .catch(console.error)
            .finally(() => setRulesLoading(false));
    };
    useEffect(() => {
        loadRules();
        setCheckResult(null);
        setCheckError(null);
    }, [projectId]);
    const handleDelete = async (id) => {
        try {
            await api.deleteArchRule(id);
            loadRules();
        }
        catch (err) {
            console.error('Failed to delete rule:', err);
        }
    };
    const handleCheck = async () => {
        if (!projectId)
            return;
        setCheckLoading(true);
        setCheckError(null);
        try {
            const result = await api.checkConformance(projectId);
            setCheckResult(result);
        }
        catch (err) {
            setCheckError(err instanceof Error ? err.message : 'Conformance check failed');
        }
        finally {
            setCheckLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(ShieldCheck, { className: "size-13 text-accent" }), _jsx("h1", { className: "text-6xl font-bold text-text", children: "Conformance" })] }), _jsx("div", { className: "w-64 space-y-5", children: _jsx(ProjectSelect, { value: projectId, onChange: setProjectId, projects: projectList, className: "w-full px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-sm text-text" }) }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border-light", children: [_jsx("h2", { className: "text-sm font-semibold text-text", children: "Architecture Rules" }), _jsxs("span", { className: "text-xs text-muted", children: ["(", rules.length, ")"] })] }), rulesLoading ? (_jsx("div", { className: "p-5", children: _jsx(LoadingSkeleton, { lines: 2 }) })) : rules.length === 0 ? (_jsx("div", { className: "px-5 py-8 text-center text-sm text-muted", children: "No architecture rules defined yet" })) : (_jsx("div", { className: "divide-y divide-border-light", children: rules.map((rule) => (_jsx(RuleCard, { rule: rule, onDelete: () => handleDelete(rule.id) }, rule.id))) })), _jsx(AddRuleForm, { projectId: projectId, onCreated: loadRules })] }), _jsxs("div", { className: "bg-card rounded-[--radius-lg] border border-border-light shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border-light", children: [_jsx("h2", { className: "text-sm font-semibold text-text", children: "Conformance Check" }), _jsx("button", { onClick: handleCheck, disabled: checkLoading || !projectId || rules.length === 0, className: "px-4 py-2 rounded-[--radius-sm] bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed", children: checkLoading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : 'Run Check' })] }), checkError && (_jsx("div", { className: "mx-5 my-4", children: _jsx(ErrorBanner, { message: checkError }) })), checkLoading && (_jsx("div", { className: "p-5", children: _jsx(LoadingSkeleton, {}) })), checkResult && !checkLoading && (_jsxs("div", { className: "p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-green-50 dark:bg-green-900/20 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400", children: [_jsx(CheckCircle2, { className: "w-3.5 h-3.5" }), checkResult.passed, " passed"] }), checkResult.failed > 0 && (_jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-error-light px-3 py-1 text-xs font-medium text-error", children: [checkResult.failed, " violations"] }))] }), checkResult.violations.length > 0 ? (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border-light", children: [_jsx("th", { className: "text-left px-3 py-2 text-muted uppercase text-xs font-medium", children: "Rule" }), _jsx("th", { className: "text-left px-3 py-2 text-muted uppercase text-xs font-medium", children: "Severity" }), _jsx("th", { className: "text-left px-3 py-2 text-muted uppercase text-xs font-medium", children: "Source" }), _jsx("th", { className: "text-left px-3 py-2 text-muted uppercase text-xs font-medium", children: "Target" }), _jsx("th", { className: "text-left px-3 py-2 text-muted uppercase text-xs font-medium", children: "Relation" })] }) }), _jsx("tbody", { className: "divide-y divide-border-light", children: checkResult.violations.map((v, i) => (_jsxs("tr", { className: "hover:bg-hover transition-colors", children: [_jsx("td", { className: "px-3 py-2.5 font-medium text-text", children: v.rule }), _jsx("td", { className: "px-3 py-2.5", children: _jsx(SeverityBadge, { severity: v.severity }) }), _jsx("td", { className: "px-3 py-2.5 font-mono text-muted text-xs", children: v.source }), _jsx("td", { className: "px-3 py-2.5 font-mono text-muted text-xs", children: v.target }), _jsx("td", { className: "px-3 py-2.5 text-muted", children: v.relation })] }, i))) })] })) : (_jsxs("div", { className: "flex items-center gap-2 rounded-[--radius-sm] border border-green-300 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 dark:text-green-400", children: [_jsx(CheckCircle2, { className: "w-4 h-4" }), "All rules passed! No violations detected."] }))] })), !checkResult && !checkLoading && !checkError && (_jsx("div", { className: "px-5 py-8 text-center text-sm text-muted", children: !projectId
                            ? 'Select a project to run conformance checks'
                            : rules.length === 0
                                ? 'Add architecture rules first, then run a check'
                                : 'Click "Run Check" to validate architecture rules' }))] })] }));
}
