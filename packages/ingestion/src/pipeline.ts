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
    // Keep only non-progress stderr lines for error messages so the failure
    // payload doesn't get drowned in hundreds of "{progress: ...}" entries.
    const stderrTail: string[] = [];
    const STDERR_TAIL_MAX = 30;

    proc.stdout.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: Buffer) => {
      const line = data.toString().trim();
      try {
        const parsed = JSON.parse(line);
        if (parsed.progress && args.onProgress) {
          args.onProgress(parsed.progress);
          return;
        }
      } catch {
        // not JSON — fall through
      }
      if (line) {
        console.log(`[graphify] ${line}`);
        stderrTail.push(line);
        if (stderrTail.length > STDERR_TAIL_MAX) stderrTail.shift();
      }
    });

    proc.on('close', (code, signal) => {
      if (code !== 0 || signal) {
        const reason = signal
          ? `killed by signal ${signal}`
          : `exited with code ${code}`;
        const tail = stderrTail.join('\n').slice(-1500);
        reject(new Error(`graphify bridge ${reason}${tail ? `: ${tail}` : ''}`));
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
      stats: {
        phase: 'parsing',
        filesProcessed: 0,
        entitiesExtracted: 0,
        documentsIngested: 0,
        chunksProcessed: 0,
      } as unknown as Record<string, unknown>,
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
        // Map graphify phases to dashboard-expected phases
        const p = progress as Record<string, unknown>;
        const gPhase = p.phase as string;
        let dashPhase = 'parsing';
        if (gPhase === 'enrichment' || gPhase === 'semantic_analysis' || gPhase === 'final_cluster') {
          dashPhase = 'llm_extraction';
        } else if (gPhase === 'export') {
          dashPhase = 'ingestion';
        }

        // During AST/build/enrichment phases, p has files/nodes/edges from
        // graphify. Take the latest values (edges may DECREASE after dedup
        // between extract → build, so don't apply a high-water mark to
        // anything except filesProcessed).
        // During semantic_analysis, p.total is the LLM batch count, NOT files,
        // so we don't touch filesProcessed/nodes/edges from it.
        const isParsingPhase =
          gPhase === 'extract' || gPhase === 'build' || gPhase === 'enrichment';

        if (isParsingPhase) {
          if (typeof p.files === 'number' && p.files > result.filesProcessed) {
            result.filesProcessed = p.files;
          }
          if (typeof p.nodes === 'number') result.nodesExtracted = p.nodes;
          if (typeof p.edges === 'number') result.edgesExtracted = p.edges;
        }

        // Build stats payload — semantic phase exposes llm batch progress
        const stats: Record<string, unknown> = {
          ...result,
          phase: dashPhase,
          totalFiles: result.filesProcessed,
          filesProcessed: result.filesProcessed,
          entitiesExtracted: result.nodesExtracted + result.edgesExtracted,
        };

        if (dashPhase === 'llm_extraction') {
          // p.total = number of LLM batches/communities being processed
          // p.community = how many have completed so far (string or number)
          const llmTotal = Number(p.total ?? 0) || 0;
          const llmDone = Number(p.community ?? 0) || 0;
          stats.llmBatches = llmTotal;
          stats.llmBatchesDone = llmDone;
          stats.chunksProcessed = llmDone;
          stats.total = llmTotal;
        } else if (dashPhase === 'parsing') {
          stats.total = result.filesProcessed;
          stats.chunksProcessed = 0;
        } else {
          stats.total = result.filesProcessed;
        }

        await updateScanJob(db, scanJobId, {
          stats: stats as Record<string, unknown>,
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
      stats: {
        ...result,
        phase: 'ingestion',
        filesProcessed: result.filesProcessed,
        entitiesExtracted: result.nodesExtracted + result.edgesExtracted,
        chunksProcessed: result.communitiesDetected,
        documentsIngested: 0,
        total: result.nodesExtracted,
      } as unknown as Record<string, unknown>,
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
      stats: {
        ...result,
        phase: 'completed',
        filesProcessed: result.filesProcessed,
        entitiesExtracted: result.nodesExtracted + result.edgesExtracted,
        chunksProcessed: result.communitiesDetected,
        documentsIngested: result.nodesImported,
        total: result.filesProcessed,
      } as unknown as Record<string, unknown>,
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
