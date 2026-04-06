import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitCompareArrows, TrendingUp, TrendingDown, Minus, Database, FileText, Share2, Circle, } from 'lucide-react';
import { api } from '../api.ts';
function metaNum(snapshot, key) {
    const val = snapshot.metadata?.[key];
    return typeof val === 'number' ? val : 0;
}
function DeltaBadge({ value }) {
    if (value === 0)
        return _jsxs("span", { className: "text-xs text-muted flex items-center gap-0.5", children: [_jsx(Minus, { className: "w-3 h-3" }), " 0"] });
    if (value > 0)
        return _jsxs("span", { className: "text-xs text-green-500 flex items-center gap-0.5", children: [_jsx(TrendingUp, { className: "w-3 h-3" }), "+", value] });
    return _jsxs("span", { className: "text-xs text-red-500 flex items-center gap-0.5", children: [_jsx(TrendingDown, { className: "w-3 h-3" }), value] });
}
function StatRow({ label, icon, valueA, valueB }) {
    const delta = valueB - valueA;
    return (_jsxs("div", { className: "flex items-center gap-3 py-2 border-b border-[var(--color-border-light)] last:border-b-0", children: [_jsx("span", { className: "text-muted", children: icon }), _jsx("span", { className: "text-xs text-text font-medium flex-1", children: label }), _jsx("span", { className: "text-xs text-muted font-mono w-14 text-right", children: valueA }), _jsx("span", { className: "text-xs text-muted mx-1", children: "\u2192" }), _jsx("span", { className: "text-xs text-text font-mono w-14 text-right", children: valueB }), _jsx("div", { className: "w-16 text-right", children: _jsx(DeltaBadge, { value: delta }) })] }));
}
function SnapshotCard({ snapshot, label, accent }) {
    return (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("div", { className: "w-2.5 h-2.5 rounded-full", style: { background: accent } }), _jsx("span", { className: "text-[10px] uppercase tracking-wider font-semibold text-muted", children: label })] }), _jsx("h3", { className: "text-sm font-bold text-text mb-1 truncate", children: snapshot.name }), _jsxs("p", { className: "text-xs text-muted mb-3", children: ["v", snapshot.version, " \u00B7 ", new Date(snapshot.createdAt).toLocaleString()] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { className: "bg-[var(--color-bg)] rounded-[var(--radius-md)] p-2.5 text-center", children: [_jsx("p", { className: "text-lg font-bold text-text", children: metaNum(snapshot, 'projectCount') }), _jsx("p", { className: "text-[10px] text-muted", children: "Projects" })] }), _jsxs("div", { className: "bg-[var(--color-bg)] rounded-[var(--radius-md)] p-2.5 text-center", children: [_jsx("p", { className: "text-lg font-bold text-text", children: metaNum(snapshot, 'documentCount') }), _jsx("p", { className: "text-[10px] text-muted", children: "Documents" })] }), _jsxs("div", { className: "bg-[var(--color-bg)] rounded-[var(--radius-md)] p-2.5 text-center", children: [_jsx("p", { className: "text-lg font-bold text-text", children: metaNum(snapshot, 'graphNodeCount') }), _jsx("p", { className: "text-[10px] text-muted", children: "Nodes" })] }), _jsxs("div", { className: "bg-[var(--color-bg)] rounded-[var(--radius-md)] p-2.5 text-center", children: [_jsx("p", { className: "text-lg font-bold text-text", children: metaNum(snapshot, 'graphEdgeCount') }), _jsx("p", { className: "text-[10px] text-muted", children: "Edges" })] })] })] }));
}
export function GraphDiff() {
    const [snapshots, setSnapshots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [idA, setIdA] = useState('');
    const [idB, setIdB] = useState('');
    useEffect(() => {
        api.listSnapshots()
            .then((list) => {
            setSnapshots(list);
            if (list.length >= 2) {
                setIdA(list[list.length - 1].id);
                setIdB(list[0].id);
            }
            else if (list.length === 1) {
                setIdA(list[0].id);
            }
        })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    const snapA = snapshots.find((s) => s.id === idA);
    const snapB = snapshots.find((s) => s.id === idB);
    const canCompare = snapA && snapB && idA !== idB;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { to: "/graph", className: "inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Graph"] }), _jsxs("h1", { className: "text-xl font-bold text-text flex items-center gap-2", children: [_jsx(GitCompareArrows, { className: "w-5 h-5 text-accent" }), "Snapshot Comparison"] })] }), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5", children: [_jsx("p", { className: "text-xs font-semibold text-muted uppercase tracking-wider mb-3", children: "Select Snapshots" }), _jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [_jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsx("label", { className: "text-xs text-muted mb-1 block", children: "Baseline (A)" }), _jsxs("select", { value: idA, onChange: (e) => setIdA(e.target.value), className: "w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-text focus:outline-none focus:border-accent", children: [_jsx("option", { value: "", children: "-- Select --" }), snapshots.map((s) => (_jsxs("option", { value: s.id, children: [s.name, " (v", s.version, ") \u2014 ", new Date(s.createdAt).toLocaleDateString()] }, s.id)))] })] }), _jsx("div", { className: "flex items-center justify-center pt-4", children: _jsx(GitCompareArrows, { className: "w-5 h-5 text-muted" }) }), _jsxs("div", { className: "flex-1 min-w-[200px]", children: [_jsx("label", { className: "text-xs text-muted mb-1 block", children: "Compare (B)" }), _jsxs("select", { value: idB, onChange: (e) => setIdB(e.target.value), className: "w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-text focus:outline-none focus:border-accent", children: [_jsx("option", { value: "", children: "-- Select --" }), snapshots.map((s) => (_jsxs("option", { value: s.id, children: [s.name, " (v", s.version, ") \u2014 ", new Date(s.createdAt).toLocaleDateString()] }, s.id)))] })] })] }), loading && _jsx("p", { className: "text-xs text-muted mt-3", children: "Loading snapshots..." }), !loading && snapshots.length === 0 && (_jsx("p", { className: "text-xs text-muted mt-3", children: "No snapshots available. Export a snapshot first from Settings." })), idA && idB && idA === idB && (_jsx("p", { className: "text-xs text-amber-500 mt-3", children: "Select two different snapshots to compare." }))] }), canCompare && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex gap-4", children: [_jsx(SnapshotCard, { snapshot: snapA, label: "Baseline (A)", accent: "#3b82f6" }), _jsx(SnapshotCard, { snapshot: snapB, label: "Compare (B)", accent: "#8b5cf6" })] }), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5", children: [_jsx("p", { className: "text-xs font-semibold text-muted uppercase tracking-wider mb-3", children: "Delta Summary" }), _jsx(StatRow, { label: "Projects", icon: _jsx(Database, { className: "w-3.5 h-3.5" }), valueA: metaNum(snapA, 'projectCount'), valueB: metaNum(snapB, 'projectCount') }), _jsx(StatRow, { label: "Documents", icon: _jsx(FileText, { className: "w-3.5 h-3.5" }), valueA: metaNum(snapA, 'documentCount'), valueB: metaNum(snapB, 'documentCount') }), _jsx(StatRow, { label: "Graph Nodes", icon: _jsx(Circle, { className: "w-3.5 h-3.5" }), valueA: metaNum(snapA, 'graphNodeCount'), valueB: metaNum(snapB, 'graphNodeCount') }), _jsx(StatRow, { label: "Graph Edges", icon: _jsx(Share2, { className: "w-3.5 h-3.5" }), valueA: metaNum(snapA, 'graphEdgeCount'), valueB: metaNum(snapB, 'graphEdgeCount') })] }), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5 text-center", children: [_jsx("p", { className: "text-sm text-muted", children: "Historical graph reconstruction is not available from snapshot metadata." }), _jsxs(Link, { to: "/graph", className: "inline-flex items-center gap-1.5 mt-2 text-sm text-accent hover:underline", children: ["View current graph state", _jsx(Share2, { className: "w-3.5 h-3.5" })] })] })] }))] }));
}
