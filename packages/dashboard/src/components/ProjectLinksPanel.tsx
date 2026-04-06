import { useEffect, useState } from 'react';
import { Link2, Plus, X, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../api.ts';
import { cn } from '../lib/utils.ts';
import type { Project, ProjectLink } from '../types.ts';

interface ProjectLinksPanelProps {
  projectId: string;
}

const LINK_TYPES = ['depends_on', 'tests', 'extends', 'deploys', 'shares_lib', 'related'] as const;

const LINK_TYPE_COLORS: Record<string, string> = {
  depends_on: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  tests: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  extends: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  deploys: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  shares_lib: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  related: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400',
};

export function ProjectLinksPanel({ projectId }: ProjectLinksPanelProps) {
  const [links, setLinks] = useState<ProjectLink[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ targetProjectId: '', linkType: 'depends_on', description: '' });

  useEffect(() => {
    Promise.all([
      api.listProjectLinks(projectId),
      api.listProjects(),
    ])
      .then(([linksData, projectsData]) => {
        setLinks(linksData);
        setProjects(projectsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId]);

  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.targetProjectId || !form.linkType) return;
    setSaving(true);
    try {
      const link = await api.createProjectLink({
        sourceProjectId: projectId,
        targetProjectId: form.targetProjectId,
        linkType: form.linkType,
        description: form.description.trim() || undefined,
      });
      setLinks((prev) => [...prev, link]);
      setForm({ targetProjectId: '', linkType: 'depends_on', description: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Failed to create link:', err);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProjectLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error('Failed to delete link:', err);
    }
  };

  const otherProjects = projects.filter((p) => p.id !== projectId);

  const inputCls =
    'w-full px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-text placeholder:text-[var(--color-text-light)] focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors';

  if (loading) {
    return (
      <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] p-6">
        <div className="flex items-center gap-2 text-muted">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading links...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border-light)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-muted" />
          <h2 className="text-sm font-semibold text-text">Related Projects</h2>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Link
        </button>
      </div>

      {/* Add link form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="px-6 py-4 border-b border-[var(--color-border-light)] bg-[var(--color-bg)] space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted">Target Project</span>
              <select
                required
                value={form.targetProjectId}
                onChange={(e) => setForm((f) => ({ ...f, targetProjectId: e.target.value }))}
                className={inputCls}
              >
                <option value="">Select project...</option>
                {otherProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-medium text-muted">Link Type</span>
              <select
                value={form.linkType}
                onChange={(e) => setForm((f) => ({ ...f, linkType: e.target.value }))}
                className={inputCls}
              >
                {LINK_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-muted">Description <span className="font-normal text-[var(--color-text-light)]">(optional)</span></span>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="e.g. shared authentication module"
              className={inputCls}
            />
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-medium border border-[var(--color-border)] text-text hover:bg-[var(--color-hover)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold transition-colors',
                saving
                  ? 'bg-[var(--color-hover)] text-muted cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-[var(--color-accent-hover)]',
              )}
            >
              {saving && <Loader2 className="w-3 h-3 animate-spin" />}
              {saving ? 'Adding...' : 'Add Link'}
            </button>
          </div>
        </form>
      )}

      {/* Links list */}
      {links.length === 0 ? (
        <div className="px-6 py-8 text-center text-sm text-muted">
          No project links yet. Add links to track dependencies between projects.
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border-light)]">
          {links.map((link) => {
            const isOutgoing = link.sourceProjectId === projectId;
            const otherProjectId = isOutgoing ? link.targetProjectId : link.sourceProjectId;
            const otherProject = projectMap.get(otherProjectId);

            return (
              <div
                key={link.id}
                className="group px-6 py-3 flex items-center gap-3 hover:bg-[var(--color-hover)] transition-colors"
              >
                {/* Direction arrow */}
                {isOutgoing ? (
                  <ArrowRight className="w-4 h-4 text-muted flex-shrink-0" />
                ) : (
                  <ArrowLeft className="w-4 h-4 text-muted flex-shrink-0" />
                )}

                {/* Project name */}
                <span className="text-sm font-medium text-text truncate">
                  {otherProject?.name ?? otherProjectId}
                </span>

                {/* Link type badge */}
                <span
                  className={cn(
                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium flex-shrink-0',
                    LINK_TYPE_COLORS[link.linkType] ?? LINK_TYPE_COLORS.related,
                  )}
                >
                  {link.linkType}
                </span>

                {/* Description */}
                {link.description && (
                  <span className="text-xs text-muted truncate">{link.description}</span>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(link.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[color-mix(in_srgb,var(--color-error)_10%,transparent)] text-muted hover:text-error transition-all flex-shrink-0"
                  title="Remove link"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
