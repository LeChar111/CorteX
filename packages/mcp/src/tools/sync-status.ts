import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const syncStatusTool = {
  name: 'sync_status',
  description:
    'Get the synchronization status: last scan, running jobs, entity/relation counts.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      project: { type: 'string', description: 'Project name (auto-detected if omitted)' },
    },
    required: [],
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    detected: DetectedProject | null,
  ): Promise<string> {
    const projectName = args.project as string | undefined;
    let projectId: string | undefined;

    if (projectName) {
      // Resolve project name to projectId
      const projects = await client.listProjects() as Array<{ id: string; name: string }>;
      const project = projects.find(
        p => p.name.toLowerCase() === projectName.toLowerCase(),
      );
      if (!project) {
        throw new Error(`Project "${projectName}" not found`);
      }
      projectId = project.id;
    } else if (detected) {
      projectId = detected.projectId;
    }

    const result = await client.getScanStatus(projectId) as {
      running?: Array<{ repoId?: string; branch?: string; mode?: string; startedAt?: string }>;
      lastCompleted?: { completedAt?: string; stats?: Record<string, unknown> };
      entityCount?: number;
      relationCount?: number;
      [k: string]: unknown;
    };

    const lines: string[] = ['# Sync Status', ''];

    if (result.entityCount !== undefined || result.relationCount !== undefined) {
      lines.push(`**Entities:** ${result.entityCount ?? 0} | **Relations:** ${result.relationCount ?? 0}`);
      lines.push('');
    }

    if (result.running && result.running.length > 0) {
      lines.push('## Running Jobs');
      for (const j of result.running) {
        lines.push(`- ${j.branch ?? 'unknown'} (${j.mode ?? 'full'}) started ${j.startedAt ?? '?'}`);
      }
      lines.push('');
    } else {
      lines.push('No running jobs.');
      lines.push('');
    }

    if (result.lastCompleted) {
      lines.push(`**Last completed:** ${result.lastCompleted.completedAt ?? 'unknown'}`);
    }

    // Include any extra fields as fallback
    const knownKeys = new Set(['running', 'lastCompleted', 'entityCount', 'relationCount']);
    const extraKeys = Object.keys(result).filter(k => !knownKeys.has(k));
    if (extraKeys.length > 0) {
      lines.push('', '## Details');
      for (const k of extraKeys) {
        lines.push(`- **${k}:** ${JSON.stringify(result[k])}`);
      }
    }

    return lines.join('\n');
  },
};
