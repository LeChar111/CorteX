import { Worker, type Job } from 'bullmq';
import IORedis from 'ioredis';
import { simpleGit } from 'simple-git';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

import { detectLanguage, parseSource } from '../src/parsers/tree-sitter.js';
import { chunkFile } from '../src/parsers/chunker.js';
import { naiveChunk } from '../src/parsers/naive-chunker.js';
import { extractStatic } from '../src/extractors/static-extractor.js';
import { extractWithLLM } from '../src/extractors/llm-extractor.js';
import type { ExtractionResult } from '../src/extractors/llm-extractor.js';
import { formatForLightRAG } from '../src/formatter.js';

import {
  getDb,
  getRepoById,
  getProjectById,
  updateRepo,
  createScanJob,
  updateScanJob,
  insertEvent,
  upsertSource,
} from '@cortex/db';

interface DiffJobData {
  projectId: string;
  repoId: string;
  branch: string;
}

interface DiffStats {
  filesAdded: number;
  filesModified: number;
  filesDeleted: number;
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

export function createDiffWorker(redisUrl: string, lightragUrl: string) {
  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

  const worker = new Worker<DiffJobData>(
    'cortex-diff',
    async (job: Job<DiffJobData>) => {
      const { projectId, repoId, branch } = job.data;
      const db = getDb();

      const project = await getProjectById(db, projectId);
      if (!project) throw new Error(`Project not found: ${projectId}`);

      const repo = await getRepoById(db, repoId);
      if (!repo) throw new Error(`Repo not found: ${repoId}`);

      const scanJob = await createScanJob(db, { projectId, repoId, branch, mode: 'diff' });
      await updateScanJob(db, scanJob.id, { status: 'running', startedAt: new Date() });

      const isLocal = repo.provider === 'local';
      const repoPath = isLocal ? repo.cloneUrl : join(tmpdir(), 'cortex-repos', repo.slug);
      const lightrag = new LightRAGClient(lightragUrl);

      try {
        // Pull latest changes (skip for local repos)
        const git = simpleGit(repoPath);
        if (!isLocal) {
          await git.checkout(branch);
          await git.pull('origin', branch);
        }

        const lastCommit = repo.lastScannedCommit;
        const headCommit = (await git.log({ maxCount: 1 })).latest?.hash ?? '';

        if (!lastCommit || lastCommit === headCommit) {
          const noChangeStats = { message: 'No changes since last scan', headCommit };
          await updateScanJob(db, scanJob.id, {
            status: 'completed',
            completedAt: new Date(),
            stats: noChangeStats,
          });
          return { changed: 0 };
        }

        // Get list of changed files between last scanned commit and HEAD
        const diff = await git.diffSummary([`${lastCommit}..${headCommit}`]);

        const stats: DiffStats = {
          filesAdded: 0,
          filesModified: 0,
          filesDeleted: 0,
          chunksProcessed: 0,
          entitiesExtracted: 0,
          relationsExtracted: 0,
          documentsIngested: 0,
        };

        for (const file of diff.files) {
          const filePath = file.file;

          // Skip binary files
          if (file.binary) continue;

          // Detect deleted files: simple-git marks them with before/after status
          const fileStatus = (file as unknown as { status?: string }).status;
          if (fileStatus === 'D') {
            stats.filesDeleted++;
            // LightRAG does not support deletion by file path; we skip re-ingesting
            continue;
          }

          // Classify as added or modified
          if (fileStatus === 'A' || file.insertions > 0 && file.deletions === 0) {
            stats.filesAdded++;
          } else {
            stats.filesModified++;
          }

          const absPath = join(repoPath, filePath);
          let content: string;
          try {
            content = await readFile(absPath, 'utf-8');
          } catch {
            // File may have been removed between diff and read (race); skip it
            continue;
          }

          const hash = createHash('sha256').update(content).digest('hex');
          const language = detectLanguage(filePath) ?? 'unknown';

          // Track source in DB
          await upsertSource(db, {
            repoId,
            branch,
            filePath,
            fileHash: hash,
            language,
            lastScannedAt: new Date(),
          });

          // Parse with tree-sitter when possible, fall back to naive chunker
          let chunks;
          let tree = null;

          if (language !== 'unknown') {
            tree = parseSource(content, language);
          }

          if (tree) {
            chunks = chunkFile(content, filePath, language, tree.rootNode);
            if (chunks.length === 0) {
              chunks = naiveChunk(content, filePath, language);
            }
          } else {
            chunks = naiveChunk(content, filePath, language);
          }

          stats.chunksProcessed += chunks.length;

          // Static entity extraction from AST
          const staticEntities = tree
            ? extractStatic(tree.rootNode, content, filePath, language)
            : [];

          stats.entitiesExtracted += staticEntities.length;

          // LLM extraction in batches of 5 chunks
          const BATCH_SIZE = 5;
          const combinedExtractions: ExtractionResult = { entities: [], relations: [] };

          for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
            const batch = chunks.slice(i, i + BATCH_SIZE);
            const batchContent = batch.map((c) => c.content).join('\n\n---\n\n');

            let extraction: ExtractionResult = { entities: [], relations: [] };
            try {
              extraction = await extractWithLLM({
                project_name: project.name,
                repo_name: repo.name,
                file_path: filePath,
                language,
                tech_stack: Array.isArray(repo.techStack)
                  ? (repo.techStack as string[]).join(', ')
                  : '',
                code_chunk: batchContent,
                existing_entities: staticEntities.map((e) => e.qualifiedName).join('\n'),
              });
            } catch (err) {
              console.warn(`LLM extraction failed for ${filePath}:`, err);
            }

            combinedExtractions.entities.push(...extraction.entities);
            combinedExtractions.relations.push(...extraction.relations);
          }

          stats.entitiesExtracted += combinedExtractions.entities.length;
          stats.relationsExtracted += combinedExtractions.relations.length;

          // Format and ingest into LightRAG
          const doc = formatForLightRAG({
            filePath,
            projectName: project.name,
            repoName: repo.name,
            language,
            sourceCode: content,
            extraction: combinedExtractions,
          });

          try {
            await lightrag.ingest(doc, {
              projectId,
              repoId,
              branch,
              filePath,
              language,
            });
            stats.documentsIngested++;
          } catch (err) {
            console.warn(`LightRAG ingest failed for ${filePath}:`, err);
          }
        }

        // Update repo with latest scanned commit
        await updateRepo(db, repoId, {
          lastScannedAt: new Date(),
          lastScannedCommit: headCommit,
        });

        await updateScanJob(db, scanJob.id, {
          status: 'completed',
          completedAt: new Date(),
          stats: stats as unknown as Record<string, unknown>,
        });

        await insertEvent(db, {
          type: 'scan.completed',
          projectId,
          repoId,
          userId: null,
          payload: { mode: 'diff', ...(stats as unknown as Record<string, unknown>) },
        });

        return stats;
      } catch (err) {
        await updateScanJob(db, scanJob.id, {
          status: 'failed',
          completedAt: new Date(),
          error: err instanceof Error ? err.message : String(err),
        });

        await insertEvent(db, {
          type: 'scan.failed',
          projectId,
          repoId,
          userId: null,
          payload: {
            mode: 'diff',
            error: err instanceof Error ? err.message : String(err),
          },
        });

        throw err;
      }
    },
    {
      connection,
      concurrency: 2,
      removeOnComplete: { count: 50 },
      removeOnFail: { count: 20 },
    },
  );

  worker.on('completed', (job) => {
    console.log(`Diff scan completed: ${job.id}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Diff scan failed: ${job?.id}`, err.message);
  });

  return worker;
}
