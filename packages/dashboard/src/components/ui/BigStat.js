import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function BigStat({ icon: _Icon, value, label }) {
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-6xl font-black text-text tracking-tight", children: value }), _jsx("span", { className: "text-xl text-black self-end mb-1", children: label })] }));
}
