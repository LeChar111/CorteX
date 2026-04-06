import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Search, SlidersHorizontal, X, Circle, Maximize2, Plus, Trash2, MessageSquare, Loader2, Flame, } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import * as d3Force from 'd3-force';
const NODE_COLORS = {
    service: '#6366f1',
    endpoint: '#22c55e',
    function: '#eab308',
    class: '#ef4444',
    table: '#06b6d4',
    component: '#f97316',
    config: '#8b5cf6',
    module: '#ec4899',
    variable: '#14b8a6',
    constant: '#0ea5e9',
    command: '#a855f7',
    data: '#64748b',
    concept: '#f43f5e',
    artifact: '#fb923c',
    method: '#facc15',
    content: '#84cc16',
    person: '#e879f9',
    other: '#9ca3af',
};
/** Map LightRAG entity types to our display types */
function normalizeType(raw) {
    const lower = raw.toLowerCase();
    if (NODE_COLORS[lower])
        return lower;
    // Map similar types
    if (lower === 'unknown' || lower === '')
        return 'other';
    if (lower === 'relationship' || lower === 'event')
        return 'concept';
    if (lower === 'organization' || lower === 'location')
        return 'person';
    if (lower === 'message' || lower === 'category')
        return 'data';
    if (lower === 'file' || lower === 'path' || lower === 'language')
        return 'module';
    if (lower === 'model')
        return 'data';
    return 'other';
}
/** Get color for a type, with deterministic fallback for unknown types */
function getColor(type) {
    if (NODE_COLORS[type])
        return NODE_COLORS[type];
    // Generate a stable color from the type name
    let hash = 0;
    for (let i = 0; i < type.length; i++)
        hash = type.charCodeAt(i) + ((hash << 5) - hash);
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 60%, 55%)`;
}
const ANNOTATION_TYPE_STYLES = {
    note: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    decision: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    warning: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    todo: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};
function NodeAnnotations({ entityName }) {
    const [annotations, setAnnotations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formType, setFormType] = useState('note');
    const [formContent, setFormContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const load = () => {
        setLoading(true);
        api.listAnnotations({ entity: entityName })
            .then(setAnnotations)
            .catch(console.error)
            .finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, [entityName]);
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formContent.trim())
            return;
        setSubmitting(true);
        try {
            await api.createAnnotation({ entityName, type: formType, content: formContent.trim() });
            setFormContent('');
            setShowForm(false);
            load();
        }
        catch (err) {
            console.error('Failed to create annotation:', err);
        }
        finally {
            setSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        try {
            await api.deleteAnnotation(id);
            load();
        }
        catch (err) {
            console.error('Failed to delete annotation:', err);
        }
    };
    return (_jsxs("div", { className: "mt-4 pt-3 border-t border-[var(--color-border-light)]", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("p", { className: "text-xs font-medium text-text flex items-center gap-1.5", children: [_jsx(MessageSquare, { className: "w-3 h-3 text-accent" }), "Notes"] }), _jsx("button", { onClick: () => setShowForm(!showForm), className: "p-1 rounded-[var(--radius-sm)] text-muted hover:text-accent hover:bg-[var(--color-hover)] transition-colors", title: "Add note", children: _jsx(Plus, { className: "w-3 h-3" }) })] }), loading && _jsx(Loader2, { className: "w-3 h-3 animate-spin text-muted mx-auto" }), _jsx("div", { className: "space-y-2", children: annotations.map((a) => (_jsxs("div", { className: "group relative rounded-[var(--radius-sm)] border border-[var(--color-border-light)] p-2 bg-[var(--color-bg)]", children: [_jsxs("div", { className: "flex items-center gap-1.5 mb-1", children: [_jsx("span", { className: cn('inline-block rounded-full px-1.5 py-0 text-[10px] font-medium', ANNOTATION_TYPE_STYLES[a.type] || ANNOTATION_TYPE_STYLES.note), children: a.type }), _jsx("button", { onClick: () => handleDelete(a.id), className: "opacity-0 group-hover:opacity-100 ml-auto p-0.5 text-muted hover:text-red-500 transition-all", title: "Delete", children: _jsx(Trash2, { className: "w-2.5 h-2.5" }) })] }), _jsx("p", { className: "text-[11px] text-text leading-relaxed", children: a.content }), _jsxs("p", { className: "text-[10px] text-muted mt-1", children: [a.author && _jsxs("span", { children: [a.author, " \u00B7 "] }), new Date(a.createdAt).toLocaleDateString()] })] }, a.id))) }), showForm && (_jsxs("form", { onSubmit: handleCreate, className: "mt-2 space-y-2", children: [_jsxs("select", { value: formType, onChange: (e) => setFormType(e.target.value), className: "w-full px-2 py-1 text-[11px] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] text-text", children: [_jsx("option", { value: "note", children: "Note" }), _jsx("option", { value: "decision", children: "Decision" }), _jsx("option", { value: "warning", children: "Warning" }), _jsx("option", { value: "todo", children: "Todo" })] }), _jsx("textarea", { value: formContent, onChange: (e) => setFormContent(e.target.value), placeholder: "Add a note...", rows: 3, className: "w-full px-2 py-1.5 text-[11px] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] text-text resize-none placeholder:text-muted", required: true }), _jsx("button", { type: "submit", disabled: submitting || !formContent.trim(), className: "w-full px-2 py-1 rounded-[var(--radius-sm)] bg-accent text-white text-[11px] font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed", children: submitting ? 'Saving...' : 'Save' })] })), !loading && annotations.length === 0 && !showForm && (_jsx("p", { className: "text-[10px] text-muted text-center py-1", children: "No notes yet" }))] }));
}
const NODE_RADII = 14;
const GLOW_RADIUS = 28;
export function Graph() {
    const { id } = useParams();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [selected, setSelected] = useState(null);
    const hoveredRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [activeTypes, setActiveTypes] = useState(new Set());
    const [showControls, setShowControls] = useState(true);
    const [heatmapMode, setHeatmapMode] = useState(false);
    const simulationRef = useRef(null);
    const zoomRef = useRef(zoom);
    const offsetRef = useRef(offset);
    useEffect(() => { zoomRef.current = zoom; }, [zoom]);
    useEffect(() => { offsetRef.current = offset; }, [offset]);
    useEffect(() => {
        api.getGraph().then((data) => {
            if (data && typeof data === 'object') {
                const graphNodes = (data.nodes || []).map((n, i) => ({
                    id: n.id || String(i),
                    name: n.name || (Array.isArray(n.labels) ? n.labels[0] : n.label) || n.id || `Node ${i}`,
                    type: normalizeType(n.type || n.properties?.entity_type || n.entity_type || ''),
                }));
                const nodeIds = new Set(graphNodes.map((n) => n.id));
                const graphLinks = (data.edges || data.links || [])
                    .filter((e) => {
                    const src = e.source || e.from;
                    const tgt = e.target || e.to;
                    return nodeIds.has(src) && nodeIds.has(tgt);
                })
                    .map((e) => ({
                    source: e.source || e.from,
                    target: e.target || e.to,
                    type: e.properties?.keywords || e.type || e.relation || 'related_to',
                }));
                setNodes(graphNodes);
                setLinks(graphLinks);
                // Init filters from actual types in data
                const typesInData = new Set(graphNodes.map((n) => n.type));
                setActiveTypes(typesInData);
            }
        }).catch((err) => {
            console.error('Failed to load graph:', err);
            setNodes([]);
            setLinks([]);
        });
    }, [id]);
    const draw = useCallback((ctx, width, height, nodeList, linkList, currentZoom, currentOffset, currentSelected, currentSearch, currentActiveTypes, currentHeatmap, degreeMap) => {
        // Dark background
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, width, height);
        ctx.save();
        ctx.translate(currentOffset.x, currentOffset.y);
        ctx.scale(currentZoom, currentZoom);
        const visibleNodes = nodeList.filter((n) => currentActiveTypes.has(n.type));
        const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
        // Draw links
        for (const link of linkList) {
            const source = link.source;
            const target = link.target;
            if (!visibleNodeIds.has(source.id) || !visibleNodeIds.has(target.id))
                continue;
            if (source.x == null || source.y == null || target.x == null || target.y == null)
                continue;
            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = 'rgba(140,160,180,0.35)';
            ctx.lineWidth = 1.5 / currentZoom;
            ctx.stroke();
        }
        // Draw nodes
        for (const node of visibleNodes) {
            if (node.x == null || node.y == null)
                continue;
            const degree = degreeMap?.get(node.id) ?? 0;
            const color = currentHeatmap
                ? (degree > 10 ? '#ef4444' : degree > 5 ? '#f97316' : degree > 2 ? '#eab308' : degree > 0 ? '#3b82f6' : '#6b7280')
                : getColor(node.type);
            const isSelected = currentSelected?.id === node.id;
            const isSearchMatch = currentSearch.length > 1
                && node.name.toLowerCase().includes(currentSearch.toLowerCase());
            // Glow for selected / search match
            if (isSelected || isSearchMatch) {
                const grad = ctx.createRadialGradient(node.x, node.y, NODE_RADII * 0.5, node.x, node.y, GLOW_RADIUS);
                grad.addColorStop(0, `${color}44`);
                grad.addColorStop(1, `${color}00`);
                ctx.beginPath();
                ctx.arc(node.x, node.y, GLOW_RADIUS, 0, 2 * Math.PI);
                ctx.fillStyle = grad;
                ctx.fill();
            }
            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, NODE_RADII, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            // White ring
            ctx.strokeStyle = isSelected ? '#fff' : 'rgba(255,255,255,0.6)';
            ctx.lineWidth = isSelected ? 2.5 / currentZoom : 1.5 / currentZoom;
            ctx.stroke();
            // Label — progressive disclosure based on degree and zoom
            const isHovered = hoveredRef.current?.id === node.id;
            // Each node needs a minimum zoom level to show its label, based on its degree
            // Only the very top nodes (degree 10+) show at low zoom, rest require progressively more zoom
            const minZoomForLabel = degree >= 10 ? 0.05
                : degree >= 6 ? 0.3
                    : degree >= 4 ? 0.8
                        : degree >= 2 ? 1.5
                            : degree >= 1 ? 2.5
                                : 4.0;
            const showLabel = isSelected || isSearchMatch || isHovered || currentZoom >= minZoomForLabel;
            if (showLabel) {
                // Scale font inversely to zoom so labels stay readable at any zoom level
                // Clamp to reasonable range to avoid absurd sizes
                const fontSize = Math.min(200 / currentZoom, Math.max(10, 14 / currentZoom));
                ctx.font = `${isSelected || isHovered ? 600 : 400} ${fontSize}px Inter, sans-serif`;
                const label = node.name;
                const textW = ctx.measureText(label).width;
                const labelGap = NODE_RADII + fontSize * 0.4;
                // Background pill for hover/selection
                if (isHovered || isSelected) {
                    ctx.fillStyle = 'rgba(13,17,23,0.85)';
                    ctx.fillRect(node.x - textW / 2 - 4, node.y - labelGap - fontSize * 0.8, textW + 8, fontSize * 1.1);
                }
                // Opacity: fade in as zoom passes the threshold
                const fadeRatio = isHovered || isSelected ? 1 : Math.min(1, (currentZoom - minZoomForLabel) / minZoomForLabel);
                const alpha = Math.round(Math.max(0.5, fadeRatio) * 255).toString(16).padStart(2, '0');
                ctx.fillStyle = isSelected || isHovered ? '#ffffff' : `#c9d1d9${alpha}`;
                ctx.textAlign = 'center';
                ctx.fillText(label, node.x, node.y - labelGap);
            }
        }
        ctx.restore();
    }, []);
    // Compute degree map for heatmap mode
    const degreeMap = useMemo(() => {
        const map = new Map();
        for (const n of nodes)
            map.set(n.id, 0);
        for (const l of links) {
            const srcId = typeof l.source === 'string' ? l.source : l.source.id;
            const tgtId = typeof l.target === 'string' ? l.target : l.target.id;
            map.set(srcId, (map.get(srcId) || 0) + 1);
            map.set(tgtId, (map.get(tgtId) || 0) + 1);
        }
        return map;
    }, [nodes, links]);
    useEffect(() => {
        if (nodes.length === 0)
            return;
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const container = containerRef.current;
        const width = canvas.width = container?.clientWidth || 900;
        const height = canvas.height = 560;
        const simulation = d3Force.forceSimulation(nodes)
            .force('link', d3Force.forceLink(links).id((d) => d.id).distance(120))
            .force('charge', d3Force.forceManyBody().strength(-300))
            .force('center', d3Force.forceCenter(width / 2, height / 2))
            .force('collision', d3Force.forceCollide().radius(32));
        simulationRef.current = simulation;
        const redraw = () => {
            draw(ctx, width, height, nodes, links, zoomRef.current, offsetRef.current, selected, searchQuery, activeTypes, heatmapMode, degreeMap);
        };
        simulation.on('tick', redraw);
        // Click detection
        canvas.onclick = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = (e.clientX - rect.left - offsetRef.current.x) / zoomRef.current;
            const my = (e.clientY - rect.top - offsetRef.current.y) / zoomRef.current;
            const clicked = nodes.find((n) => n.x && n.y && Math.hypot(n.x - mx, n.y - my) < NODE_RADII + 4);
            setSelected(clicked || null);
        };
        // Drag nodes + pan canvas
        let dragNode = null;
        let isPanning = false;
        let panStart = { x: 0, y: 0 };
        canvas.onmousedown = (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = (e.clientX - rect.left - offsetRef.current.x) / zoomRef.current;
            const my = (e.clientY - rect.top - offsetRef.current.y) / zoomRef.current;
            dragNode = nodes.find((n) => n.x && n.y && Math.hypot(n.x - mx, n.y - my) < NODE_RADII + 4) || null;
            if (dragNode) {
                dragNode.fx = dragNode.x;
                dragNode.fy = dragNode.y;
                simulation.alphaTarget(0.3).restart();
                canvas.style.cursor = 'grabbing';
            }
            else {
                // Pan mode — drag the whole canvas
                isPanning = true;
                panStart = { x: e.clientX - offsetRef.current.x, y: e.clientY - offsetRef.current.y };
                canvas.style.cursor = 'grabbing';
            }
        };
        canvas.onmousemove = (e) => {
            if (dragNode) {
                const rect = canvas.getBoundingClientRect();
                dragNode.fx = (e.clientX - rect.left - offsetRef.current.x) / zoomRef.current;
                dragNode.fy = (e.clientY - rect.top - offsetRef.current.y) / zoomRef.current;
            }
            else if (isPanning) {
                const newOffset = { x: e.clientX - panStart.x, y: e.clientY - panStart.y };
                offsetRef.current = newOffset;
                setOffset(newOffset);
            }
            else {
                // Hover detection
                const rect = canvas.getBoundingClientRect();
                const mx = (e.clientX - rect.left - offsetRef.current.x) / zoomRef.current;
                const my = (e.clientY - rect.top - offsetRef.current.y) / zoomRef.current;
                const found = nodes.find((n) => n.x && n.y && Math.hypot(n.x - mx, n.y - my) < NODE_RADII + 4) || null;
                if (found?.id !== hoveredRef.current?.id) {
                    hoveredRef.current = found;
                    canvas.style.cursor = found ? 'pointer' : 'grab';
                    redraw();
                }
            }
        };
        canvas.onmouseup = () => {
            if (dragNode) {
                dragNode.fx = null;
                dragNode.fy = null;
                simulation.alphaTarget(0);
            }
            dragNode = null;
            isPanning = false;
            canvas.style.cursor = 'grab';
        };
        canvas.onmouseleave = () => {
            if (dragNode) {
                dragNode.fx = null;
                dragNode.fy = null;
                simulation.alphaTarget(0);
            }
            dragNode = null;
            hoveredRef.current = null;
            isPanning = false;
            canvas.style.cursor = 'grab';
        };
        // Wheel zoom — centered on mouse position
        const onWheel = (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const oldZoom = zoomRef.current;
            const newZoom = Math.min(10, Math.max(0.001, oldZoom * delta));
            const scale = newZoom / oldZoom;
            // Adjust offset so the point under the mouse stays fixed
            const newOffset = {
                x: mouseX - scale * (mouseX - offsetRef.current.x),
                y: mouseY - scale * (mouseY - offsetRef.current.y),
            };
            offsetRef.current = newOffset;
            setOffset(newOffset);
            setZoom(newZoom);
        };
        canvas.addEventListener('wheel', onWheel, { passive: false });
        return () => {
            simulation.stop();
            canvas.removeEventListener('wheel', onWheel);
        };
    }, [nodes, links, draw]);
    // Redraw when selection / zoom / offset / search / activeTypes change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        draw(ctx, canvas.width, canvas.height, nodes, links, zoom, offset, selected, searchQuery, activeTypes, heatmapMode, degreeMap);
    }, [selected, zoom, offset, searchQuery, activeTypes, heatmapMode, nodes, links, draw, degreeMap]);
    const handleZoomIn = () => setZoom((z) => Math.min(10, z * 1.2));
    const handleZoomOut = () => setZoom((z) => Math.max(0.01, z / 1.2));
    const handleReset = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };
    const toggleType = (type) => {
        setActiveTypes((prev) => {
            const next = new Set(prev);
            if (next.has(type))
                next.delete(type);
            else
                next.add(type);
            return next;
        });
    };
    // Derive filter types from actual nodes, sorted by count descending
    const entityTypes = (() => {
        const counts = {};
        for (const n of nodes) {
            counts[n.type] = (counts[n.type] || 0) + 1;
        }
        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .map(([type]) => type);
    })();
    // Search highlight: find first match and center it
    const searchMatch = searchQuery.length > 1
        ? nodes.find((n) => n.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : null;
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { to: "/", className: "inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Back"] }), _jsx("h1", { className: "text-6xl font-bold text-text", children: "Knowledge Graph" }), nodes.length > 0 && (_jsxs("span", { className: "text-xs text-muted bg-[var(--color-hover)] px-2 py-1 rounded-full", children: [nodes.length, " nodes \u00B7 ", links.length, " edges"] }))] }), _jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b border-[var(--color-border-light)] flex items-center gap-3 flex-wrap", children: [_jsxs("div", { className: "relative flex-1 min-w-[180px] max-w-xs", children: [_jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" }), _jsx("input", { type: "text", placeholder: "Search entity...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-8 pr-8 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-text placeholder:text-muted focus:outline-none focus:border-accent transition-colors" }), searchQuery && (_jsx("button", { onClick: () => setSearchQuery(''), className: "absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-text", children: _jsx(X, { className: "w-3 h-3" }) }))] }), searchMatch && (_jsxs("span", { className: "text-xs text-success font-medium", children: ["Found: ", searchMatch.name] })), _jsx("div", { className: "flex-1" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: handleZoomOut, className: "w-7 h-7 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-hover)] transition-colors text-muted", children: _jsx(ZoomOut, { className: "w-3.5 h-3.5" }) }), _jsxs("span", { className: "text-xs text-muted w-12 text-center font-mono", children: [Math.round(zoom * 100), "%"] }), _jsx("button", { onClick: handleZoomIn, className: "w-7 h-7 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-hover)] transition-colors text-muted", children: _jsx(ZoomIn, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: handleReset, className: "w-7 h-7 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-hover)] transition-colors text-muted ml-1", children: _jsx(RotateCcw, { className: "w-3.5 h-3.5" }) })] }), _jsx("button", { onClick: () => setHeatmapMode((v) => !v), title: "Toggle activity heatmap", className: cn('w-7 h-7 rounded-[var(--radius-sm)] border flex items-center justify-center transition-colors', heatmapMode
                                    ? 'border-accent bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] text-accent'
                                    : 'border-[var(--color-border)] hover:bg-[var(--color-hover)] text-muted'), children: _jsx(Flame, { className: "w-3.5 h-3.5" }) }), _jsx("button", { onClick: () => setShowControls((v) => !v), className: cn('w-7 h-7 rounded-[var(--radius-sm)] border flex items-center justify-center transition-colors', showControls
                                    ? 'border-accent bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] text-accent'
                                    : 'border-[var(--color-border)] hover:bg-[var(--color-hover)] text-muted'), children: _jsx(SlidersHorizontal, { className: "w-3.5 h-3.5" }) })] }), _jsxs("div", { className: "flex", style: { height: 560 }, children: [_jsxs("div", { ref: containerRef, className: "flex-1 relative overflow-hidden bg-[var(--color-bg)]", children: [_jsx("canvas", { ref: canvasRef, style: { width: '100%', height: '100%', cursor: 'grab', display: 'block' } }), nodes.length === 0 && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-muted", children: "No graph data yet" }), _jsx("p", { className: "text-xs text-light mt-1", children: "Scan repositories to populate the knowledge graph" })] }) }))] }), showControls && (_jsxs("div", { className: "w-52 border-l border-[var(--color-border-light)] p-4 bg-card flex flex-col gap-4 overflow-y-auto flex-shrink-0", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-xs font-semibold text-text mb-2 flex items-center gap-1.5", children: [_jsx(SlidersHorizontal, { className: "w-3.5 h-3.5 text-accent" }), "Filter by Type"] }), _jsx("div", { className: "space-y-1.5", children: entityTypes.map((type) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer group", children: [_jsx("input", { type: "checkbox", checked: activeTypes.has(type), onChange: () => toggleType(type), className: "sr-only" }), _jsx("div", { className: cn('w-4 h-4 rounded flex items-center justify-center border transition-colors', activeTypes.has(type)
                                                                ? 'border-transparent'
                                                                : 'border-[var(--color-border)] bg-white'), style: activeTypes.has(type) ? { background: getColor(type) } : {}, children: activeTypes.has(type) && (_jsx("svg", { className: "w-2.5 h-2.5 text-white", fill: "none", viewBox: "0 0 10 10", children: _jsx("path", { d: "M2 5l2.5 2.5L8 3", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }) })) }), _jsxs("span", { className: "flex items-center gap-1.5 text-xs text-text group-hover:text-accent transition-colors", children: [_jsx(Circle, { className: "w-2 h-2", style: { color: getColor(type), fill: getColor(type) } }), type, _jsx("span", { className: "text-[10px] text-muted font-mono", children: nodes.filter((n) => n.type === type).length })] })] }, type))) })] }), _jsx("div", { className: "pt-3 border-t border-[var(--color-border-light)]", children: _jsxs("button", { onClick: handleReset, className: "w-full flex items-center justify-center gap-1.5 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-xs text-muted hover:bg-[var(--color-hover)] transition-colors", children: [_jsx(RotateCcw, { className: "w-3 h-3" }), "Reset View"] }) })] })), selected && (_jsxs("div", { className: "w-60 border-l border-[var(--color-border-light)] p-4 bg-card overflow-y-auto flex-shrink-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("p", { className: "text-xs font-semibold text-text", children: "Node Details" }), _jsx("button", { onClick: () => setSelected(null), className: "text-muted hover:text-text transition-colors", children: _jsx(X, { className: "w-3.5 h-3.5" }) })] }), _jsx("div", { className: "w-10 h-10 rounded-full mb-3 flex items-center justify-center shadow-[var(--shadow-sm)]", style: { background: getColor(selected.type) }, children: _jsx(Maximize2, { className: "w-4 h-4 text-white" }) }), _jsx("h3", { className: "text-sm font-semibold text-text break-words", children: selected.name }), _jsxs("div", { className: "mt-3 space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted", children: "Type" }), _jsx("span", { className: "text-xs font-semibold px-2 py-0.5 rounded-full text-white", style: { background: getColor(selected.type) }, children: selected.type })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted", children: "ID" }), _jsx("span", { className: "text-xs font-mono text-text", children: selected.id })] }), selected.x != null && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted", children: "Position" }), _jsxs("span", { className: "text-xs font-mono text-muted", children: [Math.round(selected.x), ", ", Math.round(selected.y ?? 0)] })] }))] }), _jsxs("div", { className: "mt-4 pt-3 border-t border-[var(--color-border-light)]", children: [_jsx("p", { className: "text-xs font-medium text-text mb-2", children: "Connected to" }), _jsx("div", { className: "space-y-1", children: links
                                                    .filter((l) => {
                                                    const src = l.source.id ?? l.source;
                                                    const tgt = l.target.id ?? l.target;
                                                    return src === selected.id || tgt === selected.id;
                                                })
                                                    .slice(0, 6)
                                                    .map((l, i) => {
                                                    const src = l.source;
                                                    const tgt = l.target;
                                                    const other = (src.id ?? src) === selected.id ? tgt : src;
                                                    const otherName = typeof other === 'string' ? other : other.name;
                                                    const otherType = typeof other === 'string' ? 'default' : other.type;
                                                    return (_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted", children: [_jsx(Circle, { className: "w-2 h-2 flex-shrink-0", style: { color: getColor(otherType), fill: getColor(otherType) } }), _jsx("span", { className: "truncate", children: otherName }), _jsxs("span", { className: "text-light text-xs flex-shrink-0", children: ["\u00B7 ", l.type] })] }, i));
                                                }) })] }), _jsx(NodeAnnotations, { entityName: selected.name })] }))] })] }), _jsx("div", { className: "bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border-light)] px-5 py-3", children: heatmapMode ? (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-xs font-semibold text-muted uppercase tracking-wide", children: "Activity Heatmap" }), _jsx("span", { className: "text-xs text-muted", children: "Low connections" }), _jsx("div", { className: "h-3 flex-1 max-w-xs rounded-full", style: { background: 'linear-gradient(to right, #6b7280, #3b82f6, #eab308, #f97316, #ef4444)' } }), _jsx("span", { className: "text-xs text-muted", children: "High connections" }), _jsxs("div", { className: "flex items-center gap-3 ml-4 text-[10px] text-muted", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full inline-block", style: { background: '#6b7280' } }), "0"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full inline-block", style: { background: '#3b82f6' } }), "1-2"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full inline-block", style: { background: '#eab308' } }), "3-5"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full inline-block", style: { background: '#f97316' } }), "6-10"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full inline-block", style: { background: '#ef4444' } }), "11+"] })] })] })) : (_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-xs font-semibold text-muted uppercase tracking-wide mr-2", children: "Legend" }), entityTypes.map((type) => (_jsxs("button", { onClick: () => toggleType(type), className: cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all', activeTypes.has(type)
                                ? 'opacity-100'
                                : 'opacity-30'), style: {
                                background: `${getColor(type)}18`,
                                color: getColor(type),
                                border: `1px solid ${getColor(type)}44`,
                            }, children: [_jsx("span", { className: "w-2 h-2 rounded-full", style: { background: getColor(type) } }), type] }, type)))] })) })] }));
}
