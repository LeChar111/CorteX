import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const ingestTool = {
  name: 'ingest',
  description: 'Submit code or documentation for ingestion into the knowledge graph.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      content: { type: 'string', description: 'The code or documentation content to ingest' },
      filePath: { type: 'string', description: 'File path where the content originates from' },
      language: { type: 'string', description: 'Programming language of the content (optional)' },
      project: { type: 'string', description: 'Project name (auto-detected if omitted)' },
    },
    required: ['content', 'filePath'],
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    detected: DetectedProject | null,
  ): Promise<string> {
    const content = args.content as string;
    const filePath = args.filePath as string;
    const language = args.language as string | undefined;
    const project = (args.project as string) || detected?.projectName;
    await client.ingest({ content, filePath, language, project, type: 'code' });
    return `Ingested ${filePath} (${language ?? 'auto'}) into project "${project ?? 'unknown'}".`;
  },
};
