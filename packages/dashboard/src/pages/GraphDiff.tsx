import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  GitCompareArrows,
  TrendingUp,
  TrendingDown,
  Minus,
  Database,
  FileText,
  Share2,
  Circle,
} from 'lucide-react';
import { api } from '../api.ts';
import type { Snapshot } from '../types.ts';

function metaNum(snapshot: Snapshot, key: string): number {
  const val = snapshot.metadata?.[key];
  return typeof val === 'number' ? val : 0;
}

function DeltaBadge({ value }: { value: number }) {
  if (value === 0) return <span className="text-xs text-muted flex items-center gap-0.5"><Minus className="w-3 h-3" /> 0</span>;
  if (value > 0) return <span className="text-xs text-green-500 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{value}</span>;
  return <span className="text-xs text-red-500 flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{value}</span>;
}

interface StatRowProps {
  label: string;
  icon: React.ReactNode;
  valueA: number;
  valueB: number;
}

function StatRow({ label, icon, valueA, valueB }: StatRowProps) {
  const delta = valueB - valueA;
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--color-border-light)] last:border-b-0">
      <span className="text-muted">{icon}</span>
      <span className="text-xs text-text font-medium flex-1">{label}</span>
      <span className="text-xs text-muted font-mono w-14 text-right">{valueA}</span>
      <span className="text-xs text-muted mx-1">&rarr;</span>
      <span className="text-xs text-text font-mono w-14 text-right">{valueB}</span>
      <div className="w-16 text-right">
        <DeltaBadge value={delta} />
      </div>
    </div>
  );
}

function SnapshotCard({ snapshot, label, accent }: { snapshot: Snapshot; label: string; accent: string }) {
  return (
    <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5 flex-1">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
        <span className="text-[10px] uppercase tracking-wider font-semibold text-muted">{label}</span>
      </div>
      <h3 className="text-sm font-bold text-text mb-1 truncate">{snapshot.name}</h3>
      <p className="text-xs text-muted mb-3">v{snapshot.version} &middot; {new Date(snapshot.createdAt).toLocaleString()}</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[var(--color-bg)] rounded-[var(--radius-md)] p-2.5 text-center">
          <p className="text-lg font-bold text-text">{metaNum(snapshot, 'projectCount')}</p>
          <p className="text-[10px] text-muted">Projects</p>
        </div>
        <div className="bg-[var(--color-bg)] rounded-[var(--radius-md)] p-2.5 text-center">
          <p className="text-lg font-bold text-text">{metaNum(snapshot, 'documentCount')}</p>
          <p className="text-[10px] text-muted">Documents</p>
        </div>
        <div className="bg-[var(--color-bg)] rounded-[var(--radius-md)] p-2.5 text-center">
          <p className="text-lg font-bold text-text">{metaNum(snapshot, 'graphNodeCount')}</p>
          <p className="text-[10px] text-muted">Nodes</p>
        </div>
        <div className="bg-[var(--color-bg)] rounded-[var(--radius-md)] p-2.5 text-center">
          <p className="text-lg font-bold text-text">{metaNum(snapshot, 'graphEdgeCount')}</p>
          <p className="text-[10px] text-muted">Edges</p>
        </div>
      </div>
    </div>
  );
}

export function GraphDiff() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
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
        } else if (list.length === 1) {
          setIdA(list[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const snapA = snapshots.find((s) => s.id === idA);
  const snapB = snapshots.find((s) => s.id === idB);
  const canCompare = snapA && snapB && idA !== idB;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/graph" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Graph
        </Link>
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <GitCompareArrows className="w-5 h-5 text-accent" />
          Snapshot Comparison
        </h1>
      </div>

      {/* Selectors */}
      <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Select Snapshots</p>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted mb-1 block">Baseline (A)</label>
            <select
              value={idA}
              onChange={(e) => setIdA(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-text focus:outline-none focus:border-accent"
            >
              <option value="">-- Select --</option>
              {snapshots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (v{s.version}) &mdash; {new Date(s.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center pt-4">
            <GitCompareArrows className="w-5 h-5 text-muted" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted mb-1 block">Compare (B)</label>
            <select
              value={idB}
              onChange={(e) => setIdB(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-text focus:outline-none focus:border-accent"
            >
              <option value="">-- Select --</option>
              {snapshots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} (v{s.version}) &mdash; {new Date(s.createdAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="text-xs text-muted mt-3">Loading snapshots...</p>}
        {!loading && snapshots.length === 0 && (
          <p className="text-xs text-muted mt-3">No snapshots available. Export a snapshot first from Settings.</p>
        )}
        {idA && idB && idA === idB && (
          <p className="text-xs text-amber-500 mt-3">Select two different snapshots to compare.</p>
        )}
      </div>

      {/* Comparison */}
      {canCompare && (
        <>
          {/* Side-by-side cards */}
          <div className="flex gap-4">
            <SnapshotCard snapshot={snapA} label="Baseline (A)" accent="#3b82f6" />
            <SnapshotCard snapshot={snapB} label="Compare (B)" accent="#8b5cf6" />
          </div>

          {/* Delta summary */}
          <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Delta Summary</p>
            <StatRow
              label="Projects"
              icon={<Database className="w-3.5 h-3.5" />}
              valueA={metaNum(snapA, 'projectCount')}
              valueB={metaNum(snapB, 'projectCount')}
            />
            <StatRow
              label="Documents"
              icon={<FileText className="w-3.5 h-3.5" />}
              valueA={metaNum(snapA, 'documentCount')}
              valueB={metaNum(snapB, 'documentCount')}
            />
            <StatRow
              label="Graph Nodes"
              icon={<Circle className="w-3.5 h-3.5" />}
              valueA={metaNum(snapA, 'graphNodeCount')}
              valueB={metaNum(snapB, 'graphNodeCount')}
            />
            <StatRow
              label="Graph Edges"
              icon={<Share2 className="w-3.5 h-3.5" />}
              valueA={metaNum(snapA, 'graphEdgeCount')}
              valueB={metaNum(snapB, 'graphEdgeCount')}
            />
          </div>

          {/* Current graph note */}
          <div className="bg-card rounded-[var(--radius-lg)] border border-[var(--color-border-light)] shadow-[var(--shadow-sm)] p-5 text-center">
            <p className="text-sm text-muted">
              Historical graph reconstruction is not available from snapshot metadata.
            </p>
            <Link
              to="/graph"
              className="inline-flex items-center gap-1.5 mt-2 text-sm text-accent hover:underline"
            >
              View current graph state
              <Share2 className="w-3.5 h-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
