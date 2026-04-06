import { getDb } from '@cortex/db';
import {
  updateScanJob,
  updateRepo,
  insertEvent,
  upsertSource,
} from '@cortex/db';
import { discoverFiles, getHeadCommit, getChangedFiles } from './source-loader.js';
import { detectLanguage, parseSource } from './parsers/tree-sitter.js';
import { chunkFile } from './parsers/chunker.js';
import { naiveChunk } from './parsers/naive-chunker.js';
import { extractStatic } from './extractors/static-extractor.js';
import { extractConfig } from './extractors/config-extractor.js';
import { extractBatchParallel, RateLimitError } from './extractors/llm-extractor.js';
import type { ExtractWithLLMParams, ExtractionResult } from './extractors/llm-extractor.js';
import { formatForLightRAG } from './formatter.js';

export interface ScanOptions {
  projectId: string;
  projectName: string;
  repoId: string;
  repoName: string;
  branch: string;
  sourcePath: string;
  techStack: string[];
  scanJobId: string;
  lightragUrl: string;
  lastScannedCommit?: string;
}

export interface ScanResult {
  filesProcessed: number;
  chunksProcessed: number;
  entitiesExtracted: number;
  relationsExtracted: number;
  documentsIngested: number;
}

class LightRAGClient {
  constructor(private baseUrl: string) {}

  async ingest(text: string, metadata?: Record<string, string>): Promise<void> {
    const res = await fetch(`${this.baseUrl}/documents/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, metadata }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`LightRAG ingest failed (${res.status}): ${body}`);
    }
  }
}

export async function scanRepo(options: ScanOptions): Promise<ScanResult> {
  const {
    projectId,
    projectName,
    repoId,
    repoName,
    branch,
    sourcePath,
    techStack,
    scanJobId,
    lightragUrl,
  } = options;

  const db = getDb();
  const lightrag = new LightRAGClient(lightragUrl);

  // Step 1: Update scan job status to 'running'
  await updateScanJob(db, scanJobId, {
    status: 'running',
    startedAt: new Date(),
  });

  const result: ScanResult = {
    filesProcessed: 0,
    chunksProcessed: 0,
    entitiesExtracted: 0,
    relationsExtracted: 0,
    documentsIngested: 0,
  };

  try {
    // Step 2: Discover files
    const allFiles = await discoverFiles(sourcePath);

    // If we have a previous commit, only process changed files (diff mode)
    let files = allFiles;
    if (options.lastScannedCommit) {
      const changedPaths = await getChangedFiles(sourcePath, options.lastScannedCommit);
      if (changedPaths.length > 0) {
        const changedSet = new Set(changedPaths);
        files = allFiles.filter((f) => changedSet.has(f.relativePath));
      }
      // If no changed files detected, still scan all (fallback)
    }

    // Languages that skip LLM extraction (config/data/markup files)
    const SKIP_LLM_LANGUAGES = new Set([
      'json', 'yaml', 'yml', 'toml', 'markdown', 'md', 'text', 'env',
      'ini', 'cfg', 'config', 'xml', 'css', 'scss', 'html', 'sql',
      'dockerfile', 'makefile', 'cmake', 'bitbake', 'rst', 'graphql',
    ]);

    const BATCH_SIZE = 15;

    // ── Pass 1: Parse all files, collect chunks, do static extraction ──
    interface FileData {
      file: typeof files[0];
      language: string;
      chunks: ReturnType<typeof naiveChunk>;
      staticEntities: ReturnType<typeof extractStatic>;
      configEntities: ReturnType<typeof extractConfig>;
      skipLLM: boolean;
    }

    const allFileData: FileData[] = [];

    for (const file of files) {
      const language = detectLanguage(file.relativePath) ?? 'unknown';

      // Upsert source in DB
      await upsertSource(db, {
        repoId,
        branch,
        filePath: file.relativePath,
        fileHash: file.hash,
        language,
        lastScannedAt: new Date(),
        metadata: { size: file.size, techStack },
      });

      result.filesProcessed++;

      // Update stats periodically (every 5 files)
      if (result.filesProcessed % 5 === 0) {
        await updateScanJob(db, scanJobId, {
          stats: { ...result, totalFiles: files.length, phase: 'parsing' } as unknown as Record<string, unknown>,
        });
      }

      // Parse and chunk
      let chunks;
      let tree = null;

      if (language !== 'unknown') {
        tree = parseSource(file.content, language);
      }

      if (tree) {
        chunks = chunkFile(file.content, file.relativePath, language, tree.rootNode);
        if (chunks.length === 0) {
          chunks = naiveChunk(file.content, file.relativePath, language);
        }
      } else {
        chunks = naiveChunk(file.content, file.relativePath, language);
      }

      result.chunksProcessed += chunks.length;

      // Extract static entities from AST
      const staticEntities = tree
        ? extractStatic(tree.rootNode, file.content, file.relativePath, language)
        : [];

      result.entitiesExtracted += staticEntities.length;

      // Extract config entities from non-code files
      const configEntities = extractConfig(file.content, file.relativePath, language);
      result.entitiesExtracted += configEntities.length;

      const skipLLM = SKIP_LLM_LANGUAGES.has(language.toLowerCase());
      allFileData.push({ file, language, chunks, staticEntities, configEntities, skipLLM });
    }

    // ── Pass 2: Batch all LLM extractions in parallel ──
    // Collect all LLM extraction params with a reference back to the file index
    const llmParams: { fileIndex: number; params: ExtractWithLLMParams }[] = [];

    for (let fi = 0; fi < allFileData.length; fi++) {
      const fd = allFileData[fi]!;
      if (fd.skipLLM) continue;

      for (let i = 0; i < fd.chunks.length; i += BATCH_SIZE) {
        const batch = fd.chunks.slice(i, i + BATCH_SIZE);
        const batchContent = batch.map((c) => c.content).join('\n\n---\n\n');

        llmParams.push({
          fileIndex: fi,
          params: {
            project_name: projectName,
            repo_name: repoName,
            file_path: fd.file.relativePath,
            language: fd.language,
            tech_stack: techStack.join(', '),
            code_chunk: batchContent,
            existing_entities: fd.staticEntities.map((e) => e.qualifiedName).join('\n'),
          },
        });
      }
    }

    // Update stats before LLM extraction phase
    await updateScanJob(db, scanJobId, {
      stats: { ...result, totalFiles: files.length, phase: 'llm_extraction', llmBatches: llmParams.length } as unknown as Record<string, unknown>,
    });

    // Run all LLM extractions in parallel (concurrency=5)
    const llmResults = await extractBatchParallel(
      llmParams.map((lp) => lp.params),
      5,
    );

    // Merge LLM results back into per-file extractions
    const perFileExtractions: Map<number, ExtractionResult> = new Map();
    for (let i = 0; i < llmParams.length; i++) {
      const fileIndex = llmParams[i]!.fileIndex;
      const extraction = llmResults[i]!;
      let combined = perFileExtractions.get(fileIndex);
      if (!combined) {
        combined = { entities: [], relations: [] };
        perFileExtractions.set(fileIndex, combined);
      }
      combined.entities.push(...extraction.entities);
      combined.relations.push(...extraction.relations);
    }

    // Count LLM extraction results
    for (const ext of perFileExtractions.values()) {
      result.entitiesExtracted += ext.entities.length;
      result.relationsExtracted += ext.relations.length;
    }

    // ── Pass 3: Ingest all results to LightRAG in parallel (concurrency=5) ──
    const ingestTasks: (() => Promise<void>)[] = [];

    for (let fi = 0; fi < allFileData.length; fi++) {
      const fd = allFileData[fi]!;
      const combinedExtractions = perFileExtractions.get(fi) ?? { entities: [], relations: [] };

      // Add config entities
      for (const ce of (fd.configEntities ?? [])) {
        combinedExtractions.entities.push({
          type: ce.type,
          qualified_name: ce.name,
          name: ce.name,
          description: ce.description,
          metadata: ce.metadata,
        });
      }

      const doc = formatForLightRAG({
        filePath: fd.file.relativePath,
        projectName,
        repoName,
        language: fd.language,
        sourceCode: fd.file.content,
        extraction: combinedExtractions,
      });

      ingestTasks.push(async () => {
        await lightrag.ingest(doc, {
          projectId,
          repoId,
          branch,
          filePath: fd.file.relativePath,
          language: fd.language,
        });
        result.documentsIngested++;
      });
    }

    // Update stats before ingestion phase
    await updateScanJob(db, scanJobId, {
      stats: { ...result, totalFiles: files.length, phase: 'ingestion', totalDocuments: ingestTasks.length } as unknown as Record<string, unknown>,
    });

    // Execute ingestion with concurrency limit of 5
    for (let i = 0; i < ingestTasks.length; i += 5) {
      const batch = ingestTasks.slice(i, i + 5);
      await Promise.all(batch.map((fn) => fn()));

      // Update progress during ingestion
      await updateScanJob(db, scanJobId, {
        stats: { ...result, totalFiles: files.length, phase: 'ingestion', totalDocuments: ingestTasks.length } as unknown as Record<string, unknown>,
      });
    }

    // Step 4: Update repo lastScannedAt / lastScannedCommit
    let commitHash: string | null = null;
    try {
      commitHash = await getHeadCommit(sourcePath);
    } catch {
      // Non-fatal: proceed without commit hash
    }

    await updateRepo(db, repoId, {
      lastScannedAt: new Date(),
      ...(commitHash ? { lastScannedCommit: commitHash } : {}),
    });

    // Step 5: Update scan job to 'completed' with stats
    await updateScanJob(db, scanJobId, {
      status: 'completed',
      completedAt: new Date(),
      stats: result as unknown as Record<string, unknown>,
    });

    // Step 6: Insert scan.completed event
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

    if (err instanceof RateLimitError) {
      // Rate limited — pause the scan so it can be resumed later
      console.warn(`[pipeline] Rate limited — pausing scan ${scanJobId}: ${errorMessage}`);

      await updateScanJob(db, scanJobId, {
        status: 'paused' as any,
        error: errorMessage,
        // Save partial progress in stats so we know where to resume
        stats: { ...result, pausedAt: new Date().toISOString(), reason: 'rate_limit' } as unknown as Record<string, unknown>,
      });

      await insertEvent(db, {
        type: 'scan.paused',
        projectId,
        repoId,
        userId: null,
        payload: { reason: 'rate_limit', partialResult: result },
      });

      // Don't rethrow — the job is paused, not failed
      return result;
    }

    // Other errors — mark as failed
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
