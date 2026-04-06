import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function CircularProgress({ value, max = 100, size = 140, strokeWidth = 8, children, }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const pct = Math.min(value / max, 1);
    const offset = circumference * (1 - pct);
    return (_jsxs("div", { className: "relative inline-flex items-center justify-center", style: { width: size, height: size }, children: [_jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [_jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "var(--color-border-light)", strokeWidth: strokeWidth }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "var(--color-border)", strokeWidth: strokeWidth, strokeDasharray: "4 6", opacity: 0.3 }), _jsx("circle", { cx: size / 2, cy: size / 2, r: radius, fill: "none", stroke: "var(--color-accent)", strokeWidth: strokeWidth, strokeLinecap: "round", strokeDasharray: circumference, strokeDashoffset: offset, className: "transition-all duration-700 ease-out" })] }), _jsx("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: children })] }));
}
