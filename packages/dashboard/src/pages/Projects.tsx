import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Clock,
  GitMerge,
  Search,
  Loader2,
} from 'lucide-react';
import { api } from '../api.ts';
import { timeAgo } from '../lib/helpers.ts';
import type { Repo, ProjectWithRepos } from '../types.ts';

export function Projects() {
  const [projects, setProjects] = useState<ProjectWithRepos[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const list = await api.listProjects();
        const withRepos = await Promise.all(
          list.map(async (p) => {
            const repos = await api.getRepos(p.id).catch(() => [] as Repo[]);
            return { ...p, repos };
          })
        );
        setProjects(withRepos);
      } catch (err) {
        console.error('Failed to load projects:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = search
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-5 h-5 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-6xl font-bold text-text">Projects</h1>
          <p className="text-xl text-muted mt-1"><span className="font-black text-2xl">{projects.length}</span> project{projects.length !== 1 ? 's' : ''} configured</p>
        </div>
        <Link
          to="/new-project"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] border border-border bg-card text-sm text-text placeholder:text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors"
        />
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="bg-card rounded-[var(--radius-lg)] border border-border-light shadow-sm p-12 text-center">
          <FolderKanban className="w-10 h-10 text-light mx-auto mb-3" />
          <p className="text-sm text-muted">
            {search ? 'No projects match your search' : 'No projects yet'}
          </p>
          {!search && (
            <Link
              to="/new-project"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-[var(--radius-md)] bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="group bg-card rounded-[var(--radius-lg)] border border-border-light shadow-sm p-5 hover:shadow-md hover:border-accent/30 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-accent-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 transition-colors">
                  <FolderKanban className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-text truncate group-hover:text-accent transition-colors">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">{p.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1">
                  <GitMerge className="w-3 h-3" />
                  {p.repos.length} repo{p.repos.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeAgo(p.updatedAt)}
                </span>
              </div>

              {/* Tech stack tags from repos */}
              {p.repos.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {[...new Set(p.repos.flatMap((r) => r.techStack))].slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-hover text-muted font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
