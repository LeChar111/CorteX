import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Plus, Clock, GitMerge, Search, Loader2, X, } from 'lucide-react';
import { api } from '../api.ts';
import { timeAgo } from '../lib/helpers.ts';
export function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingProjectId, setDeletingProjectId] = useState(null);
    const handleDeleteProject = async (projectId) => {
        const project = projects.find((p) => p.id === projectId);
        if (!project)
            return;
        if (!window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) {
            return;
        }
        try {
            setDeletingProjectId(projectId);
            await api.deleteProject(projectId);
            setProjects((prev) => prev.filter((p) => p.id !== projectId));
        }
        catch (err) {
            console.error('Failed to delete project:', err);
            window.alert('Unable to delete project. Please try again.');
        }
        finally {
            setDeletingProjectId(null);
        }
    };
    useEffect(() => {
        async function load() {
            try {
                const list = await api.listProjects();
                const withRepos = await Promise.all(list.map(async (p) => {
                    const repos = await api.getRepos(p.id).catch(() => []);
                    return { ...p, repos };
                }));
                setProjects(withRepos);
            }
            catch (err) {
                console.error('Failed to load projects:', err);
            }
            setLoading(false);
        }
        load();
    }, []);
    const filtered = search
        ? projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase()))
        : projects;
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsx(Loader2, { className: "w-5 h-5 animate-spin text-muted" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-6xl font-bold text-text", children: "Projects" }), _jsxs("p", { className: "text-xl text-muted mt-1", children: [_jsx("span", { className: "font-black text-2xl", children: projects.length }), " project", projects.length !== 1 ? 's' : '', " configured"] })] }), _jsxs(Link, { to: "/new-project", className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors shadow-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), "New Project"] })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" }), _jsx("input", { type: "text", placeholder: "Search projects...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-10 pr-4 py-2.5 rounded-[var(--radius-md)] border border-border bg-card text-sm text-text placeholder:text-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors" })] }), filtered.length === 0 ? (_jsxs("div", { className: "bg-card rounded-[var(--radius-lg)] border border-border-light shadow-sm p-12 text-center", children: [_jsx(FolderKanban, { className: "w-10 h-10 text-light mx-auto mb-3" }), _jsx("p", { className: "text-sm text-muted", children: search ? 'No projects match your search' : 'No projects yet' }), !search && (_jsxs(Link, { to: "/new-project", className: "inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-[var(--radius-md)] bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "Create your first project"] }))] })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((p) => (_jsxs("div", { className: "group relative bg-card rounded-[var(--radius-lg)] border border-border-light shadow-sm p-5 hover:shadow-md hover:border-accent/30 transition-all", children: [_jsx("button", { type: "button", onClick: (event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                handleDeleteProject(p.id);
                            }, disabled: deletingProjectId === p.id, className: "absolute p-1 cursor-pointer top-3 right-3 inline-flex items-center justify-center rounded-full border border-border-light bg-bg text-muted transition hover:bg-hover hover:text-text disabled:cursor-not-allowed disabled:opacity-50", children: _jsx(X, { className: "w-3.5 h-3.5" }) }), _jsxs(Link, { to: `/projects/${p.id}`, className: "block h-full", children: [_jsxs("div", { className: "flex items-start gap-3 mb-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0 group-hover:bg-accent/15 transition-colors", children: _jsx(FolderKanban, { className: "w-5 h-5 text-accent" }) }), _jsxs("div", { className: "min-w-0 -mt-3", children: [_jsx("h3", { className: "text-2xl font-semibold text-text truncate group-hover:text-accent transition-colors", children: p.name }), p.description && (_jsx("p", { className: "text-md text-muted mt-0.5 line-clamp-2", children: p.description }))] })] }), _jsxs("div", { className: "flex items-center gap-4 text-md text-muted", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(GitMerge, { className: "w-3 h-3" }), p.repos.length, " repo", p.repos.length !== 1 ? 's' : ''] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-3 h-3" }), timeAgo(p.updatedAt)] })] }), p.repos.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-3", children: [...new Set(p.repos.flatMap((r) => r.techStack))].slice(0, 5).map((tech) => (_jsx("span", { className: "px-3 py-1 rounded-full text-sm bg-hover text-muted font-medium", children: tech }, tech))) }))] })] }, p.id))) }))] }));
}
