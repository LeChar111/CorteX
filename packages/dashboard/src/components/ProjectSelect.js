import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Shared project selector dropdown used across Analysis, Conformance,
 * Changelog, and Search pages.
 */
export function ProjectSelect({ value, onChange, projects, required, className, }) {
    return (_jsxs("select", { value: value, onChange: (e) => onChange(e.target.value), className: className ??
            'flex-1 px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-xl text-text', required: required, children: [_jsx("option", { value: "", children: required ? 'Select a project' : 'All projects' }), projects.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] }));
}
