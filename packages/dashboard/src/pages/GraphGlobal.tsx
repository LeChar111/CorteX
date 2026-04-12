import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GitBranch,
  FolderKanban,
  Loader2,
  ArrowRight,
  Network,
  Link2,
} from 'lucide-react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  type SimulationNodeDatum,
  type SimulationLinkDatum,
} from 'd3-force';
import { api } from '../api.ts';
import type { Project, ProjectLink } from '../types.ts';

interface GraphNode extends SimulationNodeDatum {
  id: string;
  name: string;
  description: string | null;
}

interface GraphEdge extends SimulationLinkDatum<GraphNode> {
  id: string;
  linkType: string;
}

const EDGE_COLORS: Record<string, string> = {
  depends_on: '#f97316',
  tests: '#3b82f6',
  extends: '#a855f7',
  deploys: '#22c55e',
  shares_lib: '#eab308',
  related: '#9ca3af',
};

export function GraphGlobal() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [loading, setLoading] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Store simulation state in refs so React re-renders don't kill it
  const nodesRef = useRef<GraphNode[]>([]);
  const edgesRef = useRef<GraphEdge[]>([]);
  const simulationRef = useRef<ReturnType<typeof forceSimulation<GraphNode>> | null>(null);
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
    if (projects.length === 0) return;

    const projectIds = new Set(projects.map((p) => p.id));

    const nodes: GraphNode[] = projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
    }));

    const edges: GraphEdge[] = links
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

    const sim = forceSimulation<GraphNode>(nodes)
      .force(
        'link',
        forceLink<GraphNode, GraphEdge>(edges)
          .id((d) => d.id)
          .distance(160),
      )
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
  const dragNode = useRef<GraphNode | null>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  const handleNodeMouseDown = useCallback(
    (e: React.MouseEvent, node: GraphNode) => {
      e.preventDefault();
      e.stopPropagation();
      dragNode.current = node;
      node.fx = node.x;
      node.fy = node.y;
      simulationRef.current?.alphaTarget(0.3).restart();
    },
    [],
  );

  const handleSvgMouseDown = useCallback((e: React.MouseEvent) => {
    if (dragNode.current) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
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
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted" />
      </div>
    );
  }

  const nodes = nodesRef.current;
  const edges = edgesRef.current;
  const hasLinks = links.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-6xl font-bold text-text">Knowledge Graph</h1>
        <p className="text-2xl text-muted mt-1">
          Explore project knowledge graphs and inter-project dependencies
        </p>
      </div>

      {/* Per-project knowledge graph links */}
      {projects.length === 0 ? (
        <div className="bg-card rounded border border-[var(--color-border-light)] shadow-sm p-12 text-center">
          <FolderKanban className="w-10 h-10 text-[var(--color-text-light)] mx-auto mb-3" />
          <p className="text-sm text-muted">No projects yet. Create a project to get started.</p>
          <Link
            to="/new-project"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-[var(--radius-md)] bg-accent text-white text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-4xl font-semibold text-text mb-3">Project Knowledge Graphs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  to={`/graph/${p.id}`}
                  className="group bg-card border border-[var(--color-border-light)] shadow-sm p-5 hover:shadow-md hover:border-info/30 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full ring-2 ring-[var(--color-info)] bg-[color-mix(in_srgb,var(--color-info)_10%,transparent)] flex items-center justify-center flex-shrink-0 group-hover:bg-[color-mix(in_srgb,var(--color-info)_15%,transparent)] transition-colors">
                      <GitBranch className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-text group-hover:text-info transition-colors">
                        {p.name}
                      </h3>
                      {p.description && (
                        <p className="text-md text-muted mt-0.5 line-clamp-2">{p.description}</p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--color-text-light)] group-hover:text-info transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Project dependency graph */}
          <div>
            <h2 className="text-4xl mt-5 font-semibold text-text mb-3">Project Dependencies</h2>
            <div
              ref={containerRef}
              className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-sm overflow-hidden relative"
            >
              {!hasLinks && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-hover)] border border-[var(--color-border-light)] text-xs text-muted flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5" />
                  Link projects to see dependencies
                </div>
              )}
              <svg
                ref={svgRef}
                width="100%"
                height={500}
                className="cursor-grab active:cursor-grabbing"
                onMouseDown={handleSvgMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Arrow marker definitions */}
                <defs>
                  {Object.entries(EDGE_COLORS).map(([type, color]) => (
                    <marker
                      key={type}
                      id={`arrow-${type}`}
                      viewBox="0 0 10 6"
                      refX={38}
                      refY={3}
                      markerWidth={8}
                      markerHeight={6}
                      orient="auto"
                    >
                      <path d="M0,0 L10,3 L0,6 Z" fill={color} />
                    </marker>
                  ))}
                </defs>

                <g transform={`translate(${panOffset.x},${panOffset.y})`}>
                {/* Edges */}
                {edges.map((edge) => {
                  const source = edge.source as GraphNode;
                  const target = edge.target as GraphNode;
                  if (source.x == null || target.x == null) return null;
                  const color = EDGE_COLORS[edge.linkType] ?? EDGE_COLORS.related;
                  return (
                    <line
                      key={edge.id}
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={color}
                      strokeWidth={2}
                      strokeOpacity={0.3}
                      markerEnd={`url(#arrow-${edge.linkType})`}
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => {
                  if (node.x == null || node.y == null) return null;
                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x},${node.y})`}
                      className="cursor-pointer"
                      onMouseDown={(e) => handleNodeMouseDown(e, node)}
                      onClick={(e) => {
                        if (!dragNode.current) {
                          e.stopPropagation();
                          navigate(`/projects/${node.id}`);
                        }
                      }}
                    >
                      <circle
                        r={28}
                        fill="var(--color-card)"
                        stroke="var(--color-accent)"
                        strokeWidth={2}
                        className="hover:stroke-[3px] transition-all"
                      />
                      <text
                        textAnchor="middle"
                        dy={4}
                        className="text-xs font-semibold fill-[var(--color-text)] select-none pointer-events-none"
                        style={{ fontSize: '11px' }}
                      >
                        {node.name.length > 10 ? node.name.slice(0, 9) + '...' : node.name}
                      </text>
                    </g>
                  );
                })}
                </g>
              </svg>

              {/* Legend */}
              {hasLinks && (
                <div className="px-4 py-3 border-t border-[var(--color-border-light)] flex flex-wrap gap-4">
                  {Object.entries(EDGE_COLORS).map(([type, color]) => (
                    <div key={type} className="flex items-center gap-1.5 text-xs text-muted">
                      <div className="w-4 h-0.5 rounded" style={{ backgroundColor: color }} />
                      <span>{type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Global Knowledge Graph link */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-4xl mt-15 font-semibold text-text mb-3">Global Knowledge Graph</h2>
          <Link
            to="/graph/all"
            className="group bg-card border border-[var(--color-border-light)] shadow-sm p-6 flex items-center justify-between hover:shadow-md hover:border-accent/30 transition-all rounded-[var(--radius-lg)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full ring-2 ring-accent bg-[color-mix(in_srgb,var(--color-accent)_10%,transparent)] flex items-center justify-center">
                <Network className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-text group-hover:text-accent transition-colors">
                  Explore Full Knowledge Graph
                </h3>
                <p className="text-md text-muted mt-0.5">
                  Interactive vis.js visualization of all entities and relationships across projects
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--color-text-light)] group-hover:text-accent transition-colors" />
          </Link>
        </div>
      )}
    </div>
  );
}
