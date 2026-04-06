import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function SectionHeader({ icon: Icon, title, subtitle, action }) {
    return (_jsxs("div", { className: "flex items-center justify-between px-6 py-5 border-b border-border-light", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "size-12 rounded-xl bg-accent-light flex items-center justify-center", children: _jsx(Icon, { className: "size-6 text-accent" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-semibold text-text", children: title }), subtitle && _jsx("p", { className: "text-md text-light mt-0.5", children: subtitle })] })] }), action] }));
}
