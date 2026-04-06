import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Shared empty state component with optional icon.
 */
export function EmptyState({ icon: Icon, message }) {
    return (_jsxs("div", { className: "py-16 text-center text-muted text-sm", children: [Icon && _jsx(Icon, { className: "w-10 h-10 text-muted mx-auto mb-3 opacity-40" }), _jsx("p", { children: message })] }));
}
