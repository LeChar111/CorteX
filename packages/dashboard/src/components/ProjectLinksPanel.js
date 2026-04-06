import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link2, Plus, X, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
const LINK_TYPES = ['depends_on', 'tests', 'extends', 'deploys', 'shares_lib', 'related'];
const LINK_TYPE_COLORS = {
    depends_on: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    tests: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    extends: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    deploys: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    shares_lib: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    related: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
};
export function ProjectLinksPanel({ projectId }) {
    const [links, setLinks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ targetProjectId: '', linkType: 'depends_on', description: '' });
    useEffect(() => {
        Promise.all([
            api.listProjectLinks(projectId),
            api.listProjects(),
        ])
            .then(([linksData, projectsData]) => {
            setLinks(linksData);
            setProjects(projectsData);
        })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [projectId]);
    const projectMap = new Map(projects.map((p) => [p.id, p]));
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.targetProjectId || !form.linkType)
            return;
        setSaving(true);
        try {
            const link = await api.createProjectLink({
                sourceProjectId: projectId,
                targetProjectId: form.targetProjectId,
                linkType: form.linkType,
                description: form.description.trim() || undefined,
            });
            setLinks((prev) => [...prev, link]);
            setForm({ targetProjectId: '', linkType: 'depends_on', description: '' });
            setShowForm(false);
        }
        catch (err) {
            console.error('Failed to create link:', err);
        }
        setSaving(false);
    };
    const handleDelete = async (id) => {
        try {
            await api.deleteProjectLink(id);
            setLinks((prev) => prev.filter((l) => l.id !== id));
        }
        catch (err) {
            console.error('Failed to delete link:', err);
        }
    };
    const otherProjects = projects.filter((p) => p.id !== projectId);
    const inputCls = 'w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-text placeholder:text-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors';
    if (loading) {
        return (_jsx("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] p-6", children: _jsxs("div", { className: "flex items-center gap-2 text-muted", children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), _jsx("span", { className: "text-sm", children: "Loading links..." })] }) }));
    }
    return (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Link2, { className: "w-4 h-4 text-muted" }), _jsx("h2", { className: "text-sm font-semibold text-text", children: "Related Projects" })] }), _jsxs("button", { onClick: () => setShowForm((v) => !v), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors", children: [_jsx(Plus, { className: "w-3.5 h-3.5" }), "Add Link"] })] }), showForm && (_jsxs("form", { onSubmit: handleSubmit, className: "px-6 py-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg)] space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("label", { className: "space-y-1", children: [_jsx("span", { className: "text-xs font-medium text-muted", children: "Target Project" }), _jsxs("select", { required: true, value: form.targetProjectId, onChange: (e) => setForm((f) => ({ ...f, targetProjectId: e.target.value })), className: inputCls, children: [_jsx("option", { value: "", children: "Select project..." }), otherProjects.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] })] }), _jsxs("label", { className: "space-y-1", children: [_jsx("span", { className: "text-xs font-medium text-muted", children: "Link Type" }), _jsx("select", { value: form.linkType, onChange: (e) => setForm((f) => ({ ...f, linkType: e.target.value })), className: inputCls, children: LINK_TYPES.map((t) => (_jsx("option", { value: t, children: t }, t))) })] })] }), _jsxs("label", { className: "block space-y-1", children: [_jsxs("span", { className: "text-xs font-medium text-muted", children: ["Description ", _jsx("span", { className: "font-normal text-[var(--color-text-light)]", children: "(optional)" })] }), _jsx("input", { value: form.description, onChange: (e) => setForm((f) => ({ ...f, description: e.target.value })), placeholder: "e.g. shared authentication module", className: inputCls })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { type: "button", onClick: () => setShowForm(false), className: "px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors", children: "Cancel" }), _jsxs("button", { type: "submit", disabled: saving, className: cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold transition-colors', saving
                                    ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                                    : 'bg-accent text-white hover:bg-[var(--color-accent-hover)]'), children: [saving && _jsx(Loader2, { className: "w-3 h-3 animate-spin" }), saving ? 'Adding...' : 'Add Link'] })] })] })), links.length === 0 ? (_jsx("div", { className: "px-6 py-8 text-center text-sm text-muted", children: "No project links yet. Add links to track dependencies between projects." })) : (_jsx("div", { className: "divide-y divide-[var(--color-border-light)]", children: links.map((link) => {
                    const isOutgoing = link.sourceProjectId === projectId;
                    const otherProjectId = isOutgoing ? link.targetProjectId : link.sourceProjectId;
                    const otherProject = projectMap.get(otherProjectId);
                    return (_jsxs("div", { className: "group px-6 py-3 flex items-center gap-3 hover:bg-[var(--color-hover)] transition-colors", children: [isOutgoing ? (_jsx(ArrowRight, { className: "w-4 h-4 text-muted flex-shrink-0" })) : (_jsx(ArrowLeft, { className: "w-4 h-4 text-muted flex-shrink-0" })), _jsx("span", { className: "text-sm font-medium text-text truncate", children: otherProject?.name ?? otherProjectId }), _jsx("span", { className: cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0', LINK_TYPE_COLORS[link.linkType] ?? LINK_TYPE_COLORS.related), children: link.linkType }), link.description && (_jsx("span", { className: "text-xs text-muted truncate", children: link.description })), _jsx("div", { className: "flex-1" }), _jsx("button", { onClick: () => handleDelete(link.id), className: "opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-muted hover:text-error transition-all flex-shrink-0", title: "Remove link", children: _jsx(X, { className: "w-3.5 h-3.5" }) })] }, link.id));
                }) }))] }));
}
