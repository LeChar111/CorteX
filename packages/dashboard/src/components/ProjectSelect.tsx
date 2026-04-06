import type { Project } from '../types.ts';

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  projects: Project[];
  required?: boolean;
  className?: string;
}

/**
 * Shared project selector dropdown used across Analysis, Conformance,
 * Changelog, and Search pages.
 */
export function ProjectSelect({
  value,
  onChange,
  projects,
  required,
  className,
}: ProjectSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ??
        'flex-1 px-3 py-2 rounded-[--radius-sm] bg-hover border border-border-light text-xl text-text'
      }
      required={required}
    >
      <option value="">{required ? 'Select a project' : 'All projects'}</option>
      {projects.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
