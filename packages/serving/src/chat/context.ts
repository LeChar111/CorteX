import { LightRAGClient } from '../lightrag/client.js';
import { getDb, getProjectById } from '@cortex/db';

const lightragUrl = () => process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';

export async function buildContext(
  message: string,
  projectId?: string,
  mode: 'naive' | 'mix' = 'mix',
): Promise<{ context: string; sources: string[]; projectName?: string }> {
  const client = new LightRAGClient(lightragUrl());

  let enrichedQuery = message;
  let projectName: string | undefined;

  if (projectId) {
    const db = getDb();
    const project = await getProjectById(db, projectId);
    if (project) {
      projectName = project.name;
      enrichedQuery = `[Project: ${project.name}] ${message}`;
    }
  }

  try {
    const response = await client.query(enrichedQuery, mode, 15_000);
    return {
      context: response,
      sources: extractSources(response),
      projectName,
    };
  } catch {
    // LightRAG down or timeout — return empty context
    return { context: '', sources: [], projectName };
  }
}

function extractSources(text: string): string[] {
  const matches = text.match(/`[^`]+`/g) ?? [];
  return [...new Set(matches.map((m) => m.replace(/`/g, '')))].slice(0, 10);
}
