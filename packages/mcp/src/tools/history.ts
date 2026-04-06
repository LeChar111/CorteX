import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const historyTool = {
  name: 'history',
  description:
    'Get the history of changes for the project: scans, entity updates, ingestions.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      entityName: { type: 'string', description: 'Filter history for a specific entity (optional)' },
      limit: { type: 'number', description: 'Maximum number of events to return (default: 20)' },
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
    const limit = (args.limit as number) || 20;
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

    const result = await client.getEvents({ projectId, limit }) as Array<{
      type?: string;
      createdAt?: string;
      payload?: Record<string, unknown>;
      [k: string]: unknown;
    }>;

    if (!result || result.length === 0) {
      return 'No history events found.';
    }

    const lines: string[] = [`# History (${result.length} events)`, ''];
    for (const event of result) {
      const date = event.createdAt ? new Date(event.createdAt).toLocaleString() : '?';
      const type = event.type ?? 'unknown';
      const detail = event.payload
        ? Object.entries(event.payload).map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`).join(', ')
        : '';
      lines.push(`- **${type}** ${date}${detail ? ' — ' + detail : ''}`);
    }

    return lines.join('\n');
  },
};
