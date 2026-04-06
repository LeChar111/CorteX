import type { CodeChunk } from './chunker.js';

const MIN_TOKENS = 50;
const MAX_LINES = 150;

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function splitLargeBlock(block: string, filePath: string, language: string): CodeChunk[] {
  const lines = block.split('\n');
  if (lines.length <= MAX_LINES) {
    const header = `// File: ${filePath}\n`;
    return [
      {
        content: header + block,
        filePath,
        language,
        lineStart: 0,
        lineEnd: lines.length - 1,
        type: 'other',
        parentContext: '',
      },
    ];
  }

  const chunks: CodeChunk[] = [];
  for (let start = 0; start < lines.length; start += MAX_LINES) {
    const end = Math.min(start + MAX_LINES, lines.length);
    const sliceLines = lines.slice(start, end);
    const header = `// File: ${filePath}\n`;
    chunks.push({
      content: header + sliceLines.join('\n'),
      filePath,
      language,
      lineStart: start,
      lineEnd: end - 1,
      type: 'other',
      parentContext: '',
    });
  }
  return chunks;
}

export function naiveChunk(
  source: string,
  filePath: string,
  language: string,
): CodeChunk[] {
  // Split on triple (or more) newlines
  const rawBlocks = source.split(/\n{3,}/);

  // Merge blocks smaller than MIN_TOKENS
  const mergedBlocks: string[] = [];
  let pending = '';

  for (const block of rawBlocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (pending) {
      const combined = pending + '\n\n' + trimmed;
      if (estimateTokens(combined) >= MIN_TOKENS) {
        mergedBlocks.push(combined);
        pending = '';
      } else {
        pending = combined;
      }
    } else {
      if (estimateTokens(trimmed) < MIN_TOKENS) {
        pending = trimmed;
      } else {
        mergedBlocks.push(trimmed);
      }
    }
  }

  // Flush remaining pending
  if (pending) {
    if (mergedBlocks.length > 0) {
      mergedBlocks[mergedBlocks.length - 1] += '\n\n' + pending;
    } else {
      mergedBlocks.push(pending);
    }
  }

  // Now split large blocks and build chunks
  const chunks: CodeChunk[] = [];
  for (const block of mergedBlocks) {
    const subChunks = splitLargeBlock(block, filePath, language);
    chunks.push(...subChunks);
  }

  return chunks;
}
