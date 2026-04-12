import { getDb } from '@cortex/db';
import { updateScanJob, updateRepo, insertEvent } from '@cortex/db';
import { getHeadCommit } from './source-loader.js';
import { importGraphJSON } from './graphify-importer.js';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Resolve the cortex-scan Python CLI path.
 * Checks: 1) CORTEX_SCAN_BIN env, 2) local venv, 3) PATH fallback.
 */
function resolveCortexScan(): string {
  // Explicit override
  if (process.env['CORTEX_SCAN_BIN']) return process.env['CORTEX_SCAN_BIN'];

  // Local venv (relative to project root)
  const thisDir = dirname(fileURLToPath(import.meta.url));
  const localVenv = resolve(thisDir, '../../../services/graphify-bridge/.venv/bin/cortex-scan');
  if (existsSync(localVenv)) return localVenv;

  // Fallback: hope it's in PATH
  return 'cortex-scan';
}

export interface ScanOptions {
  projectId: string;
  projectName: string;
  repoId: string;
  repoName: string;
  branch: string;
  sourcePath: string;
  techStack: string[];
  scanJobId: string;
}

export interface ScanResult {
  filesProcessed: number;
  nodesExtracted: number;
  edgesExtracted: number;
  communitiesDetected: number;
  nodesImported: number;
  edgesImported: number;
}

function runGraphifyBridge(args: {
  sourcePath: string;
  outputPath: string;
  projectId: string;
  projectName: string;
  repoId: string;
  repoName: string;
  onProgress?: (progress: Record<string, unknown>) => void;
}): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const cortexScanBin = resolveCortexScan();
    const proc = spawn(cortexScanBin, [
      '--source', args.sourcePath,
      '--output', args.outputPath,
      '--project-id', args.projectId,
      '--project-name', args.projectName,
      '--repo-id', args.repoId,
      '--repo-name', args.repoName,
    ], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: Buffer) => {
      const line = data.toString().trim();
      stderr += line + '\n';
      try {
        const parsed = JSON.parse(line);
        if (parsed.progress && args.onProgress) {
          args.onProgress(parsed.progress);
        }
      } catch {
        if (line) console.log(`[graphify] ${line}`);
      }
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`graphify bridge exited with code ${code}: ${stderr}`));
        return;
      }
      try {
        // graphify may print progress lines to stdout before the JSON result.
        // Extract the last JSON object from stdout.
        const lines = stdout.trim().split('\n');
        let jsonStr = '';
        for (let i = lines.length - 1; i >= 0; i--) {
          const line = lines[i]!.trim();
          if (line.startsWith('{')) {
            jsonStr = lines.slice(i).join('\n');
            break;
          }
        }
        if (!jsonStr) jsonStr = stdout;

        const result = JSON.parse(jsonStr);
        if (result.error) {
          reject(new Error(`graphify bridge error: ${result.error}`));
          return;
        }
        resolve(result);
      } catch {
        reject(new Error(`Failed to parse graphify output: ${stdout.slice(-500)}`));
      }
    });

    proc.on('error', (err) => {
      reject(new Error(`Failed to spawn graphify bridge: ${err.message}`));
    });
  });
}

export async function scanRepo(options: ScanOptions): Promise<ScanResult> {
  const {
    projectId, projectName, repoId, repoName,
    branch: _branch, sourcePath, scanJobId,
  } = options;

  const db = getDb();
  const result: ScanResult = {
    filesProcessed: 0,
    nodesExtracted: 0,
    edgesExtracted: 0,
    communitiesDetected: 0,
    nodesImported: 0,
    edgesImported: 0,
  };

  try {
    // Phase 1: Run graphify bridge
    await updateScanJob(db, scanJobId, {
      stats: { phase: 'graphify_extraction' } as unknown as Record<string, unknown>,
    });

    const outputPath = join(tmpdir(), `cortex-graph-${randomUUID()}.json`);

    const graphifyResult = await runGraphifyBridge({
      sourcePath,
      outputPath,
      projectId,
      projectName,
      repoId,
      repoName,
      onProgress: async (progress) => {
        await updateScanJob(db, scanJobId, {
          stats: { ...result, ...progress, phase: 'graphify_extraction' } as unknown as Record<string, unknown>,
        }).catch(() => {});
      },
    }) as {
      graph_path: string;
      stats: { total_files: number; nodes: number; edges: number; communities: number };
      communities: Record<string, { members: string[]; size: number; cohesion: number }>;
      god_nodes: Array<{ id: string; label: string; edges: number }>;
      surprising_connections: Array<{ source: string; target: string; note?: string }>;
      metadata: { project_id: string; project_name: string; repo_id: string; repo_name: string };
    };

    result.filesProcessed = graphifyResult.stats.total_files;
    result.nodesExtracted = graphifyResult.stats.nodes;
    result.edgesExtracted = graphifyResult.stats.edges;
    result.communitiesDetected = graphifyResult.stats.communities;

    // Phase 2: Import into PostgreSQL
    await updateScanJob(db, scanJobId, {
      stats: { ...result, phase: 'pg_import' } as unknown as Record<string, unknown>,
    });

    const importResult = await importGraphJSON(outputPath, graphifyResult);
    result.nodesImported = importResult.nodesImported;
    result.edgesImported = importResult.edgesImported;

    // Phase 3: Update repo metadata
    let commitHash: string | null = null;
    try {
      commitHash = await getHeadCommit(sourcePath);
    } catch {
      // Non-fatal
    }

    await updateRepo(db, repoId, {
      lastScannedAt: new Date(),
      ...(commitHash ? { lastScannedCommit: commitHash } : {}),
    });

    // Phase 4: Finalize
    await updateScanJob(db, scanJobId, {
      status: 'completed',
      completedAt: new Date(),
      stats: result as unknown as Record<string, unknown>,
    });

    await insertEvent(db, {
      type: 'scan.completed',
      projectId,
      repoId,
      userId: null,
      payload: result as unknown as Record<string, unknown>,
    });

    return result;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);

    await updateScanJob(db, scanJobId, {
      status: 'failed',
      completedAt: new Date(),
      error: errorMessage,
    });

    await insertEvent(db, {
      type: 'scan.failed',
      projectId,
      repoId,
      userId: null,
      payload: { error: errorMessage },
    });

    throw err;
  }
}
