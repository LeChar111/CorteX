import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../../lib/utils.ts';
export function TaskChecklist({ title, done, total, items }) {
    return (_jsxs("div", { className: "bg-sidebar-active rounded-[var(--radius-lg)] p-5 text-white h-[200px] flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-2xl font-semibold", children: title }), _jsxs("span", { className: "text-4xl font-bold", children: [done, _jsxs("span", { className: "text-white/40", children: ["/", total] })] })] }), _jsx("div", { className: "flex-1 space-y-3 overflow-y-auto", children: items.map((item) => {
                    const Icon = item.icon;
                    return (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', item.done ? 'bg-white/15' : 'bg-white/8'), children: _jsx(Icon, { className: "w-3.5 h-3.5 text-white/70" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-medium truncate", children: item.label }), _jsx("p", { className: "text-[10px] text-white/40", children: item.subtitle })] }), _jsx("div", { className: cn('w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0', item.done
                                    ? 'bg-green-400'
                                    : 'border border-white/20'), children: item.done && (_jsx("svg", { className: "w-3 h-3 text-white", viewBox: "0 0 12 12", fill: "none", children: _jsx("path", { d: "M2 6l3 3 5-5", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) })) })] }, item.id));
                }) })] }));
}
