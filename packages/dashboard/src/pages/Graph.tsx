// Knowledge Graph page — visual parity with graphify's vis-network HTML output.
// Reproduces the same physics, node/edge styling, sidebar layout, search,
// info panel and community legend, but fed from Cortex's /api/graph/summary.
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Network, type Options } from 'vis-network';
import { DataSet } from 'vis-data';
import { Loader2 } from 'lucide-react';
import { api } from '../api.ts';
import { useAsyncData } from '../hooks/useAsyncData.ts';
import type { Project } from '../types.ts';

// Matches graphify's COMMUNITY_COLORS palette (20 hues).
const COMMUNITY_COLORS = [
  '#4E79A7', '#F28E2B', '#E15759', '#76B7B2', '#59A14F',
  '#EDC948', '#B07AA1', '#FF9DA7', '#9C755F', '#BAB0AC',
  '#86BCB6', '#F1CE63', '#499894', '#FABFD2', '#B6992D',
  '#D37295', '#79706E', '#D7B5A6', '#A0CBE8', '#FFBE7D',
];

const STORAGE_KEY = 'cortex:graph:projectId';

interface RawNode {
  id: string;
  label: string;
  type?: string;
  source_file?: string;
  project_id?: string;
  community?: string | number;
  community_size?: number;
  degree?: number;
}

interface RawEdge {
  source: string;
  target: string;
  relation?: string;
  confidence?: string;
  weight?: string;
}

interface CommunityEntry {
  cid: string;
  color: string;
  label: string;
  count: number;
}

function sanitize(label: string | undefined | null): string {
  if (!label) return '';
  return String(label).slice(0, 120);
}

export function Graph() {
  const { id: routeProjectId } = useParams<{ id: string }>();
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesDS = useRef(new DataSet<any>([]));
  const edgesDS = useRef(new DataSet<any>([]));

  const routeProject = routeProjectId && routeProjectId !== 'all' ? routeProjectId : '';
  const initialProject =
    routeProject || (typeof localStorage !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) ?? '') : '');

  const [selectedProject, setSelectedProject] = useState<string>(initialProject);
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<RawNode[]>([]);
  const [edges, setEdges] = useState<RawEdge[]>([]);
  const [stats, setStats] = useState<{ n: number; e: number; c: number }>({ n: 0, e: 0, c: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hiddenCommunities, setHiddenCommunities] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [stabilizing, setStabilizing] = useState(false);
  const [communityLabels, setCommunityLabels] = useState<Record<string, string>>({});

  const { data: projects } = useAsyncData(() => api.listProjects(), []);

  useEffect(() => {
    if (routeProject) setSelectedProject(routeProject);
  }, [routeProject]);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    if (selectedProject) localStorage.setItem(STORAGE_KEY, selectedProject);
  }, [selectedProject]);

  // Fetch top-hubs graph (nodes + internal edges). This is what graphify's
  // to_html() feeds to vis.js: a bounded, whole-graph snapshot.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      try {
        const data = await api.getGraphSummary({
          projectId: selectedProject || undefined,
          mode: 'hubs',
          limit: 500,
        });
        if (cancelled) return;
        setNodes((data.nodes ?? []) as RawNode[]);
        setEdges((data.edges ?? []) as RawEdge[]);
        setCommunityLabels((data as any).communityLabels ?? {});
      } catch (err) {
        console.error('Failed to load graph:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [selectedProject]);

  // Derive graphify-style per-node attributes (degree, color, size, label-visibility).
  const prepared = useMemo(() => {
    const degree: Record<string, number> = {};
    for (const e of edges) {
      degree[e.source] = (degree[e.source] ?? 0) + 1;
      degree[e.target] = (degree[e.target] ?? 0) + 1;
    }
    const maxDeg = Math.max(1, ...Object.values(degree));

    const nodeIndex: Record<string, RawNode & { deg: number; color: string; size: number; fontSize: number; cid: string }> = {};
    const communityCount: Record<string, number> = {};

    for (const n of nodes) {
      const deg = Number(n.degree ?? degree[n.id] ?? 0);
      const cid = String(n.community ?? 'none');
      const cidx = parseInt(cid, 10);
      const color = COMMUNITY_COLORS[(Number.isFinite(cidx) ? cidx : cid.charCodeAt(0)) % COMMUNITY_COLORS.length];
      // graphify: size = 10 + 30 * (deg / maxDeg)
      const size = Math.round((10 + 30 * (deg / maxDeg)) * 10) / 10;
      // Label visible for connected nodes; biggest hubs get noticeably larger text.
      const ratio = deg / maxDeg;
      const fontSize = ratio >= 0.15 ? Math.round(12 + 14 * ratio) : 0;
      nodeIndex[n.id] = { ...n, deg, color, size, fontSize, cid };
      communityCount[cid] = (communityCount[cid] ?? 0) + 1;
    }

    const legend: CommunityEntry[] = Object.entries(communityCount)
      .map(([cid, count]) => {
        const cidx = parseInt(cid, 10);
        const color = COMMUNITY_COLORS[(Number.isFinite(cidx) ? cidx : cid.charCodeAt(0)) % COMMUNITY_COLORS.length];
        const descriptiveName = communityLabels[cid];
        const label = cid === 'none' ? 'Unclustered' : (descriptiveName || `Community ${cid}`);
        return { cid, color, label, count };
      })
      .sort((a, b) => b.count - a.count);

    return { nodeIndex, legend, degree };
  }, [nodes, edges, communityLabels]);

  // Initialize vis.Network once.
  useEffect(() => {
    if (!containerRef.current || networkRef.current) return;

    // Physics & interaction settings copied verbatim from graphify's to_html().
    const options: Options = {
      physics: {
        enabled: true,
        solver: 'barnesHut',
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 1.2,
          springLength: 60,
          springConstant: 0.1,
          damping: 0.7,
          avoidOverlap: 0.3,
        },
        stabilization: { enabled: true, iterations: 150, fit: true },
        maxVelocity: 30,
        minVelocity: 3,
        timestep: 0.5,
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        hideEdgesOnDrag: true,
        hideEdgesOnZoom: true,
        navigationButtons: false,
        keyboard: false,
      },
      nodes: { shape: 'dot', borderWidth: 1.5 },
      edges: {
        smooth: false,
        selectionWidth: 3,
      },
    };

    const network = new Network(
      containerRef.current,
      { nodes: nodesDS.current as any, edges: edgesDS.current as any },
      options,
    );
    networkRef.current = network;

    network.once('stabilizationIterationsDone', () => {
      network.setOptions({ physics: { enabled: false } });
      setStabilizing(false);
    });

    // Safety timeout: if stabilization hasn't finished in 8s, force stop
    const stabilizationTimeout = setTimeout(() => {
      if (networkRef.current) {
        networkRef.current.stopSimulation();
        networkRef.current.setOptions({ physics: { enabled: false } });
        setStabilizing(false);
      }
    }, 8000);

    network.on('click', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        setSelectedId(String(params.nodes[0]));
      } else {
        setSelectedId(null);
      }
    });

    // Enlarge the hovered node's label and restore it on blur.
    // We stash the pre-hover font in a ref-keyed map so we restore exactly
    // the per-node font size chosen during the prepared-data pass.
    const hoverFontRestore: Record<string, any> = {};
    network.on('hoverNode', (params) => {
      const id = String(params.node);
      const current = nodesDS.current.get(id) as any;
      if (!current) return;
      hoverFontRestore[id] = current.font;
      nodesDS.current.update({
        id,
        font: { color: '#ffffff', size: 28, bold: true, strokeWidth: 4, strokeColor: '#0f0f1a' },
      });
      if (containerRef.current) containerRef.current.style.cursor = 'pointer';
    });
    network.on('blurNode', (params) => {
      const id = String(params.node);
      const restored = hoverFontRestore[id] ?? { color: '#ffffff', size: 0 };
      delete hoverFontRestore[id];
      nodesDS.current.update({ id, font: restored });
      if (containerRef.current) containerRef.current.style.cursor = 'default';
    });

    return () => {
      clearTimeout(stabilizationTimeout);
      network.destroy();
      networkRef.current = null;
    };
  }, []);

  // Push prepared data into vis DataSets whenever inputs change.
  useEffect(() => {
    const visNodes = nodes.map(n => {
      const p = prepared.nodeIndex[n.id];
      const color = p?.color ?? '#888';
      // Give big hubs much more physical "mass" so they repel each other
      // harder — avoids the tight orange cluster where 5+ huge nodes overlap.
      const size = p?.size ?? 10;
      const mass = 1 + Math.pow(size / 10, 2);
      return {
        id: n.id,
        label: sanitize(n.label || n.id),
        shape: 'dot',
        size,
        mass,
        color: {
          background: color,
          border: color,
          highlight: { background: '#ffffff', border: color },
        },
        font: { color: '#ffffff', size: p?.fontSize ?? 0 },
        title: `${sanitize(n.label || n.id)}\nType: ${n.type ?? '—'}\nCommunity: ${n.community ?? '—'}\nDegree: ${p?.deg ?? 0}`,
        hidden: hiddenCommunities.has(p?.cid ?? 'none'),
      };
    });

    const visEdges = edges.map((e, i) => {
      const confidence = e.confidence ?? 'EXTRACTED';
      const extracted = confidence === 'EXTRACTED';
      return {
        id: `e-${i}`,
        from: e.source,
        to: e.target,
        label: '',
        title: `${e.relation ?? 'related'} [${confidence}]`,
        dashes: !extracted,
        width: extracted ? 2 : 1,
        color: { color: '#888888', opacity: extracted ? 0.7 : 0.35 },
        arrows: { to: { enabled: true, scaleFactor: 0.5 } },
      };
    });

    nodesDS.current.clear();
    edgesDS.current.clear();
    nodesDS.current.add(visNodes);
    edgesDS.current.add(visEdges);

    setStats({ n: visNodes.length, e: visEdges.length, c: prepared.legend.length });

    if (networkRef.current && visNodes.length > 0) {
      networkRef.current.setOptions({ physics: { enabled: true } });
      setStabilizing(true);
    }
  }, [nodes, edges, prepared, hiddenCommunities]);

  // Selected-node derived data (neighbors, metadata) for the info panel.
  const selectedInfo = useMemo(() => {
    if (!selectedId) return null;
    const n = nodes.find(x => x.id === selectedId);
    if (!n) return null;
    const p = prepared.nodeIndex[n.id];
    const neighbors = new Set<string>();
    for (const e of edges) {
      if (e.source === selectedId) neighbors.add(e.target);
      else if (e.target === selectedId) neighbors.add(e.source);
    }
    const neighborList = Array.from(neighbors)
      .map(nid => {
        const nb = nodes.find(x => x.id === nid);
        const color = prepared.nodeIndex[nid]?.color ?? '#555';
        return { id: nid, label: nb?.label ?? nid, color };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
    return {
      node: n,
      color: p?.color,
      cid: p?.cid,
      deg: p?.deg ?? 0,
      neighbors: neighborList,
    };
  }, [selectedId, nodes, edges, prepared]);

  // Search results (label substring, top 20).
  const searchMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return nodes
      .filter(n => (n.label || '').toLowerCase().includes(q))
      .slice(0, 20);
  }, [search, nodes]);

  const focusNode = (id: string) => {
    networkRef.current?.focus(id, { scale: 1.4, animation: { duration: 400, easingFunction: 'easeInOutQuad' } });
    networkRef.current?.selectNodes([id]);
    setSelectedId(id);
  };

  const toggleCommunity = (cid: string) => {
    setHiddenCommunities(prev => {
      const next = new Set(prev);
      if (next.has(cid)) next.delete(cid);
      else next.add(cid);
      return next;
    });
  };

  return (
    // graphify layout: flex row, graph canvas left, 280px sidebar right.
    // Dark theme mirrors graphify's #0f0f1a / #1a1a2e palette.
    <div className="flex h-[calc(100vh-10rem)] min-h-[800px] rounded-xl overflow-hidden border border-[#2a2a4e]">
      {/* Graph canvas */}
      <div className="flex-1 relative bg-[#0f0f1a]">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#aaa] z-10">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-xs">Loading graph…</p>
          </div>
        )}
        {stabilizing && !loading && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-[#1a1a2e] border border-[#2a2a4e] rounded text-[11px] text-[#aaa] z-10">
            stabilizing…
          </div>
        )}
        {!loading && nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[#666] text-sm">
            No graph data. Select a project or run a scan.
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {/* Sidebar (graphify parity: search, info, legend, stats) */}
      <div className="w-[280px] bg-[#1a1a2e] border-l border-[#2a2a4e] flex flex-col text-[#e0e0e0]">
        {/* Project selector (Cortex-specific) */}
        <div className="p-3 border-b border-[#2a2a4e]">
          <select
            value={selectedProject}
            onChange={e => setSelectedProject(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-[#3a3a5e] text-[#e0e0e0] px-2.5 py-1.5 rounded text-[13px] outline-none focus:border-[#4E79A7]"
          >
            <option value="">All projects</option>
            {(projects ?? []).map((p: Project) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-[#2a2a4e] relative">
          <input
            type="text"
            placeholder="Search nodes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0f0f1a] border border-[#3a3a5e] text-[#e0e0e0] px-2.5 py-1.5 rounded text-[13px] outline-none focus:border-[#4E79A7]"
          />
          {searchMatches.length > 0 && (
            <div className="absolute left-3 right-3 top-full mt-1 max-h-[200px] overflow-y-auto bg-[#0f0f1a] border border-[#3a3a5e] rounded shadow-lg z-20">
              {searchMatches.map(m => {
                const p = prepared.nodeIndex[m.id];
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      focusNode(m.id);
                      setSearch('');
                    }}
                    className="w-full text-left px-2 py-1 text-[12px] truncate hover:bg-[#2a2a4e] border-l-[3px]"
                    style={{ borderLeftColor: p?.color ?? '#555' }}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="p-3.5 border-b border-[#2a2a4e] min-h-[140px]">
          <h3 className="text-[13px] text-[#aaa] uppercase tracking-wider mb-2">Node Info</h3>
          {selectedInfo ? (
            <div className="text-[13px] text-[#ccc] leading-relaxed">
              <div className="mb-1"><b className="text-[#e0e0e0]">{selectedInfo.node.label}</b></div>
              <div className="mb-1">Type: {selectedInfo.node.type ?? 'unknown'}</div>
              <div className="mb-1">Community: {selectedInfo.cid === 'none' ? 'Unclustered' : (communityLabels[selectedInfo.cid!] || selectedInfo.cid)}</div>
              <div className="mb-1 truncate" title={selectedInfo.node.source_file}>
                Source: {selectedInfo.node.source_file ?? '—'}
              </div>
              <div className="mb-1">Degree: {selectedInfo.deg}</div>
              {selectedInfo.neighbors.length > 0 && (
                <>
                  <div className="mt-2 text-[11px] text-[#aaa]">
                    Neighbors ({selectedInfo.neighbors.length})
                  </div>
                  <div className="mt-1 max-h-[160px] overflow-y-auto">
                    {selectedInfo.neighbors.map(nb => (
                      <button
                        key={nb.id}
                        onClick={() => focusNode(nb.id)}
                        className="block w-full text-left text-[12px] px-1.5 py-0.5 my-0.5 rounded truncate border-l-[3px] hover:bg-[#2a2a4e]"
                        style={{ borderLeftColor: nb.color }}
                        title={nb.label}
                      >
                        {nb.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <span className="text-[#555] italic text-[13px]">Click a node to inspect it</span>
          )}
        </div>

        {/* Legend */}
        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="text-[13px] text-[#aaa] uppercase tracking-wider mb-2.5">Communities</h3>
          {prepared.legend.map(c => {
            const dimmed = hiddenCommunities.has(c.cid);
            return (
              <button
                key={c.cid}
                onClick={() => toggleCommunity(c.cid)}
                className={`w-full flex items-center gap-2 px-1 py-1 text-[12px] rounded hover:bg-[#2a2a4e] transition-opacity ${
                  dimmed ? 'opacity-35' : ''
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: c.color }}
                />
                <span className="flex-1 text-left truncate">{c.label}</span>
                <span className="text-[11px] text-[#666]">{c.count}</span>
              </button>
            );
          })}
        </div>

        {/* Stats footer */}
        <div className="px-3.5 py-2.5 border-t border-[#2a2a4e] text-[11px] text-[#555]">
          {stats.n} nodes · {stats.e} edges · {stats.c} communities
        </div>
      </div>
    </div>
  );
}
