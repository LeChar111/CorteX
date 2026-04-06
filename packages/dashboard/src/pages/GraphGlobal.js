import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GitBranch, FolderKanban, Loader2, ArrowRight, Network, Link2, } from 'lucide-react';
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, } from 'd3-force';
import { api } from '../api.ts';
// ─── Full Knowledge Graph (Canvas-based) ────────────────────────────────────
const KB_NODE_COLORS = {
    service: '#6366f1', endpoint: '#22c55e', function: '#eab308', class: '#ef4444',
    table: '#06b6d4', component: '#f97316', config: '#8b5cf6', module: '#ec4899',
    variable: '#14b8a6', constant: '#0ea5e9', command: '#a855f7', data: '#64748b',
    concept: '#f43f5e', artifact: '#fb923c', method: '#facc15', content: '#84cc16',
    person: '#e879f9', other: '#9ca3af',
};
function normalizeType(raw) {
    const lower = (raw || '').toLowerCase();
    if (KB_NODE_COLORS[lower])
        return lower;
    if (lower === '' || lower === 'unknown')
        return 'other';
    return 'other';
}
function getNodeColor(type) {
    return KB_NODE_COLORS[type] ?? KB_NODE_COLORS.other;
}
function FullKnowledgeGraph() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [nodes, setNodes] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hovered, setHovered] = useState(null);
    const simRef = useRef(null);
    // Pan & zoom state
    const zoomRef = useRef(1);
    const offsetRef = useRef({ x: 0, y: 0 });
    const dragRef = useRef({
        node: null, panning: false, startX: 0, startY: 0,
    });
    useEffect(() => {
        api.getGraph().then((data) => {
            if (!data || typeof data !== 'object') {
                setLoading(false);
                return;
            }
            const gNodes = (data.nodes || []).map((n, i) => ({
                id: n.id || String(i),
                name: n.name || (Array.isArray(n.labels) ? n.labels[0] : n.label) || n.id || `Node ${i}`,
                type: normalizeType(n.type || n.entity_type || n.properties?.entity_type || ''),
            }));
            const nodeIds = new Set(gNodes.map((n) => n.id));
            const gLinks = (data.edges || data.links || [])
                .filter((e) => nodeIds.has(e.source || e.from) && nodeIds.has(e.target || e.to))
                .map((e) => ({ source: e.source || e.from, target: e.target || e.to }));
            setNodes(gNodes);
            setLinks(gLinks);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        const w = canvas.width;
        const h = canvas.height;
        const z = zoomRef.current;
        const o = offsetRef.current;
        // Dark background for contrast
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, w, h);
        ctx.save();
        ctx.translate(o.x, o.y);
        ctx.scale(z, z);
        // Draw edges
        ctx.strokeStyle = 'rgba(140,160,180,0.2)';
        ctx.lineWidth = 0.6;
        for (const link of links) {
            const s = link.source;
            const t = link.target;
            if (s.x == null || t.x == null)
                continue;
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(t.x, t.y);
            ctx.stroke();
        }
        // Draw nodes
        for (const node of nodes) {
            if (node.x == null)
                continue;
            const color = getNodeColor(node.type);
            const isHover = hovered?.id === node.id;
            const r = isHover ? 8 : 5;
            // Glow for hovered node
            if (isHover) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 14, 0, Math.PI * 2);
                ctx.fillStyle = color + '33';
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            // Subtle border
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }
        // Draw hovered label
        if (hovered && hovered.x != null) {
            const label = `${hovered.name} (${hovered.type})`;
            ctx.font = 'bold 12px system-ui, sans-serif';
            const textW = ctx.measureText(label).width;
            // Background pill
            ctx.fillStyle = 'rgba(13,17,23,0.9)';
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            const px = hovered.x + 12;
            const py = hovered.y - 16;
            ctx.fillRect(px - 4, py - 12, textW + 8, 18);
            // Text
            ctx.fillStyle = '#e6edf3';
            ctx.fillText(label, px, py);
        }
        ctx.restore();
    }, [nodes, links, hovered]);
    useEffect(() => { draw(); }, [draw]);
    // Resize canvas to match container
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container)
            return;
        const resize = () => {
            const w = container.clientWidth || 900;
            canvas.width = w;
            canvas.height = 600;
            draw();
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(container);
        return () => observer.disconnect();
    }, [draw]);
    // D3 simulation
    useEffect(() => {
        if (nodes.length === 0)
            return;
        const width = containerRef.current?.clientWidth ?? 900;
        const height = 600;
        const sim = forceSimulation(nodes)
            .force('link', forceLink(links).id((d) => d.id).distance(25).strength(0.5))
            .force('charge', forceManyBody().strength(-15).distanceMax(200))
            .force('center', forceCenter(width / 2, height / 2))
            .force('collide', forceCollide(6))
            .alphaDecay(0.03);
        simRef.current = sim;
        sim.on('tick', () => { draw(); });
        return () => { sim.stop(); };
    }, [nodes, links]);
    // Mouse interactions
    const findNodeAt = useCallback((cx, cy) => {
        const z = zoomRef.current;
        const o = offsetRef.current;
        const x = (cx - o.x) / z;
        const y = (cy - o.y) / z;
        for (const node of nodes) {
            if (node.x == null)
                continue;
            const dx = node.x - x;
            const dy = node.y - y;
            if (dx * dx + dy * dy < 64)
                return node; // radius ~8px
        }
        return null;
    }, [nodes]);
    const handleCanvasMouseDown = useCallback((e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect)
            return;
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const node = findNodeAt(cx, cy);
        if (node) {
            dragRef.current = { node, panning: false, startX: cx, startY: cy };
            node.fx = node.x;
            node.fy = node.y;
            simRef.current?.alphaTarget(0.3).restart();
        }
        else {
            dragRef.current = { node: null, panning: true, startX: cx, startY: cy };
        }
    }, [findNodeAt]);
    const handleCanvasMouseMove = useCallback((e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect)
            return;
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const d = dragRef.current;
        if (d.node) {
            const z = zoomRef.current;
            const o = offsetRef.current;
            d.node.fx = (cx - o.x) / z;
            d.node.fy = (cy - o.y) / z;
            return;
        }
        if (d.panning) {
            const dx = cx - d.startX;
            const dy = cy - d.startY;
            d.startX = cx;
            d.startY = cy;
            offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
            draw();
            return;
        }
        // Hover detection
        setHovered(findNodeAt(cx, cy));
    }, [findNodeAt, draw]);
    const handleCanvasMouseUp = useCallback(() => {
        const d = dragRef.current;
        if (d.node) {
            d.node.fx = null;
            d.node.fy = null;
            simRef.current?.alphaTarget(0);
        }
        dragRef.current = { node: null, panning: false, startX: 0, startY: 0 };
    }, []);
    // Attach wheel listener natively with { passive: false } so preventDefault works
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const onWheel = (e) => {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            const oldZoom = zoomRef.current;
            const factor = e.deltaY < 0 ? 1.1 : 0.9;
            const newZoom = Math.max(0.1, Math.min(5, oldZoom * factor));
            offsetRef.current = {
                x: cx - (cx - offsetRef.current.x) * (newZoom / oldZoom),
                y: cy - (cy - offsetRef.current.y) * (newZoom / oldZoom),
            };
            zoomRef.current = newZoom;
            draw();
        };
        canvas.addEventListener('wheel', onWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', onWheel);
    }, [draw]);
    // Collect type counts for legend
    const typeCounts = useMemo(() => {
        const counts = {};
        for (const n of nodes) {
            counts[n.type] = (counts[n.type] ?? 0) + 1;
        }
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [nodes]);
    if (loading) {
        return (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm flex items-center justify-center h-48", children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin text-muted" }), _jsx("span", { className: "ml-2 text-sm text-muted", children: "Loading knowledge graph..." })] }));
    }
    if (nodes.length === 0) {
        return (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm p-8 text-center", children: [_jsx(Network, { className: "w-8 h-8 text-muted mx-auto mb-2" }), _jsx("p", { className: "text-sm text-muted", children: "No graph data yet. Scan some projects first." })] }));
    }
    return (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-[var(--color-border-light)]", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Network, { className: "w-4 h-4 text-accent" }), _jsx("span", { className: "text-sm font-semibold text-text", children: "Full Knowledge Graph" })] }), _jsxs("span", { className: "text-xs text-muted", children: [nodes.length, " nodes \u00B7 ", links.length, " edges"] })] }), _jsx("div", { ref: containerRef, style: { position: 'relative' }, children: _jsx("canvas", { ref: canvasRef, width: 900, height: 600, style: { width: '100%', height: 600, cursor: 'grab', background: '#0d1117' }, onMouseDown: handleCanvasMouseDown, onMouseMove: handleCanvasMouseMove, onMouseUp: handleCanvasMouseUp, onMouseLeave: handleCanvasMouseUp }) }), _jsx("div", { className: "px-4 py-3 border-t border-[var(--color-border-light)] flex flex-wrap gap-3", children: typeCounts.slice(0, 12).map(([type, count]) => (_jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-muted", children: [_jsx("div", { className: "w-2.5 h-2.5 rounded-full", style: { backgroundColor: getNodeColor(type) } }), _jsx("span", { children: type }), _jsxs("span", { className: "text-[10px] opacity-60", children: ["(", count, ")"] })] }, type))) })] }));
}
const EDGE_COLORS = {
    depends_on: '#f97316',
    tests: '#3b82f6',
    extends: '#a855f7',
    deploys: '#22c55e',
    shares_lib: '#eab308',
    related: '#9ca3af',
};
export function GraphGlobal() {
    const [projects, setProjects] = useState([]);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const svgRef = useRef(null);
    const containerRef = useRef(null);
    const navigate = useNavigate();
    // Store simulation state in refs so React re-renders don't kill it
    const nodesRef = useRef([]);
    const edgesRef = useRef([]);
    const simulationRef = useRef(null);
    const [, forceRender] = useState(0);
    useEffect(() => {
        Promise.all([api.listProjects(), api.listProjectLinks()])
            .then(([p, l]) => {
            setProjects(p);
            setLinks(l);
        })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);
    // Build and run D3 simulation
    useEffect(() => {
        if (projects.length === 0)
            return;
        const projectIds = new Set(projects.map((p) => p.id));
        const nodes = projects.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
        }));
        const edges = links
            .filter((l) => projectIds.has(l.sourceProjectId) && projectIds.has(l.targetProjectId))
            .map((l) => ({
            id: l.id,
            source: l.sourceProjectId,
            target: l.targetProjectId,
            linkType: l.linkType,
        }));
        nodesRef.current = nodes;
        edgesRef.current = edges;
        const width = containerRef.current?.clientWidth ?? 800;
        const height = 500;
        const sim = forceSimulation(nodes)
            .force('link', forceLink(edges)
            .id((d) => d.id)
            .distance(160))
            .force('charge', forceManyBody().strength(-400))
            .force('center', forceCenter(width / 2, height / 2))
            .force('collide', forceCollide(50))
            .on('tick', () => {
            forceRender((n) => n + 1);
        });
        simulationRef.current = sim;
        return () => {
            sim.stop();
        };
    }, [projects, links]);
    // Pan + drag state
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const dragNode = useRef(null);
    const isPanning = useRef(false);
    const panStart = useRef({ x: 0, y: 0 });
    const handleNodeMouseDown = useCallback((e, node) => {
        e.preventDefault();
        e.stopPropagation();
        dragNode.current = node;
        node.fx = node.x;
        node.fy = node.y;
        simulationRef.current?.alphaTarget(0.3).restart();
    }, []);
    const handleSvgMouseDown = useCallback((e) => {
        // Only pan when clicking on SVG background (not on a node)
        if (dragNode.current)
            return;
        isPanning.current = true;
        panStart.current = { x: e.clientX, y: e.clientY };
    }, []);
    const handleMouseMove = useCallback((e) => {
        if (dragNode.current && svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            dragNode.current.fx = e.clientX - rect.left - panOffset.x;
            dragNode.current.fy = e.clientY - rect.top - panOffset.y;
            return;
        }
        if (isPanning.current) {
            const dx = e.clientX - panStart.current.x;
            const dy = e.clientY - panStart.current.y;
            panStart.current = { x: e.clientX, y: e.clientY };
            setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        }
    }, [panOffset]);
    const handleMouseUp = useCallback(() => {
        if (dragNode.current) {
            dragNode.current.fx = null;
            dragNode.current.fy = null;
            dragNode.current = null;
            simulationRef.current?.alphaTarget(0);
        }
        isPanning.current = false;
    }, []);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(Loader2, { className: "w-5 h-5 animate-spin text-muted" }) }));
    }
    const nodes = nodesRef.current;
    const edges = edgesRef.current;
    const hasLinks = links.length > 0;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-6xl font-bold text-text", children: "Knowledge Graph" }), _jsx("p", { className: "text-2xl text-muted mt-1", children: "Explore project knowledge graphs and inter-project dependencies" })] }), projects.length === 0 ? (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm p-12 text-center", children: [_jsx(FolderKanban, { className: "w-10 h-10 text-[var(--color-text-light)] mx-auto mb-3" }), _jsx("p", { className: "text-sm text-muted", children: "No projects yet. Create a project to get started." }), _jsx(Link, { to: "/new-project", className: "inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-[var(--radius-md)] bg-accent text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors", children: "Create Project" })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx("h2", { className: "text-sm font-semibold text-text mb-3", children: "Project Knowledge Graphs" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: projects.map((p) => (_jsxs(Link, { to: `/graph/${p.id}`, className: "group bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm p-5 hover:shadow-md hover:border-info/30 transition-all flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-[var(--radius-md)] bg-[color-mix(in_srgb,var(--color-info)_10%,transparent)] flex items-center justify-center flex-shrink-0 group-hover:bg-[color-mix(in_srgb,var(--color-info)_15%,transparent)] transition-colors", children: _jsx(GitBranch, { className: "w-5 h-5 text-info" }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-text group-hover:text-info transition-colors", children: p.name }), p.description && (_jsx("p", { className: "text-xs text-muted mt-0.5 line-clamp-1", children: p.description }))] })] }), _jsx(ArrowRight, { className: "w-4 h-4 text-[var(--color-text-light)] group-hover:text-info transition-colors" })] }, p.id))) })] }), _jsxs("div", { children: [_jsx("h2", { className: "text-sm font-semibold text-text mb-3", children: "Project Dependencies" }), _jsxs("div", { ref: containerRef, className: "bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm overflow-hidden relative", children: [!hasLinks && (_jsxs("div", { className: "absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-hover)] border border-[var(--color-border-light)] text-xs text-muted flex items-center gap-2", children: [_jsx(Link2, { className: "w-3.5 h-3.5" }), "Link projects to see dependencies"] })), _jsxs("svg", { ref: svgRef, width: "100%", height: 400, className: "cursor-grab active:cursor-grabbing", onMouseDown: handleSvgMouseDown, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp, onMouseLeave: handleMouseUp, children: [_jsx("defs", { children: Object.entries(EDGE_COLORS).map(([type, color]) => (_jsx("marker", { id: `arrow-${type}`, viewBox: "0 0 10 6", refX: 38, refY: 3, markerWidth: 8, markerHeight: 6, orient: "auto", children: _jsx("path", { d: "M0,0 L10,3 L0,6 Z", fill: color }) }, type))) }), _jsxs("g", { transform: `translate(${panOffset.x},${panOffset.y})`, children: [edges.map((edge) => {
                                                        const source = edge.source;
                                                        const target = edge.target;
                                                        if (source.x == null || target.x == null)
                                                            return null;
                                                        const color = EDGE_COLORS[edge.linkType] ?? EDGE_COLORS.related;
                                                        return (_jsx("line", { x1: source.x, y1: source.y, x2: target.x, y2: target.y, stroke: color, strokeWidth: 2, strokeOpacity: 0.6, markerEnd: `url(#arrow-${edge.linkType})` }, edge.id));
                                                    }), nodes.map((node) => {
                                                        if (node.x == null || node.y == null)
                                                            return null;
                                                        return (_jsxs("g", { transform: `translate(${node.x},${node.y})`, className: "cursor-pointer", onMouseDown: (e) => handleNodeMouseDown(e, node), onClick: (e) => {
                                                                if (!dragNode.current) {
                                                                    e.stopPropagation();
                                                                    navigate(`/projects/${node.id}`);
                                                                }
                                                            }, children: [_jsx("circle", { r: 28, fill: "var(--color-card)", stroke: "var(--color-accent)", strokeWidth: 2, className: "hover:stroke-[3px] transition-all" }), _jsx("text", { textAnchor: "middle", dy: 4, className: "text-xs font-semibold fill-[var(--color-text)] select-none pointer-events-none", style: { fontSize: '11px' }, children: node.name.length > 10 ? node.name.slice(0, 9) + '...' : node.name })] }, node.id));
                                                    })] })] }), hasLinks && (_jsx("div", { className: "px-4 py-3 border-t border-[var(--color-border-light)] flex flex-wrap gap-4", children: Object.entries(EDGE_COLORS).map(([type, color]) => (_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted", children: [_jsx("div", { className: "w-4 h-0.5 rounded", style: { backgroundColor: color } }), _jsx("span", { children: type })] }, type))) }))] })] })] })), projects.length > 0 && (_jsxs("div", { children: [_jsx("h2", { className: "text-sm font-semibold text-text mb-3", children: "Global Knowledge Graph" }), _jsx(FullKnowledgeGraph, {})] }))] }));
}
