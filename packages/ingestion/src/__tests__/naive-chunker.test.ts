import { describe, it, expect } from 'vitest';
import { naiveChunk } from '../parsers/naive-chunker.js';

// Helper to create a block with at least 50 tokens (~200 chars)
function makeBlock(name: string): string {
  return `function ${name}(input: string, options: Record<string, unknown>): string {
  const cleaned = input.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const result = cleaned.split('_').filter(Boolean).join('-');
  return \`${name}_\${result}\`;
}`;
}

describe('naiveChunk', () => {
  it('splits source by triple newlines', () => {
    const source = `${makeBlock('foo')}



${makeBlock('bar')}`;
    const chunks = naiveChunk(source, 'src/foo.ts', 'typescript');
    expect(chunks.length).toBe(2);
  });

  it('merges blocks smaller than 50 tokens with adjacent blocks', () => {
    // A tiny block (< 50 tokens) followed by a larger one separated by triple newline
    const tiny = 'const x = 1;'; // ~3 tokens
    const normal = makeBlock('doSomethingImportant');
    const source = `${tiny}\n\n\n${normal}`;
    const chunks = naiveChunk(source, 'src/foo.ts', 'typescript');
    // The tiny block should be merged into the normal block
    expect(chunks.length).toBe(1);
    expect(chunks[0]!.content).toContain(tiny);
    expect(chunks[0]!.content).toContain('doSomethingImportant');
  });

  it('splits blocks over 150 lines', () => {
    // Create a block with 200 lines
    const lines = Array.from({ length: 200 }, (_, i) => `const line${i} = ${i};`);
    const source = lines.join('\n');
    const chunks = naiveChunk(source, 'src/big.ts', 'typescript');
    // Should be split into at least 2 chunks
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    for (const chunk of chunks) {
      const chunkLines = chunk.content.split('\n');
      // Each chunk (excluding the header line) should be at most 150 lines
      const contentLines = chunkLines.filter(l => !l.startsWith('// File:'));
      expect(contentLines.length).toBeLessThanOrEqual(150);
    }
  });

  it('adds file path header to each chunk', () => {
    const source = `${makeBlock('alpha')}



${makeBlock('beta')}`;
    const chunks = naiveChunk(source, 'src/helpers.ts', 'typescript');
    for (const chunk of chunks) {
      expect(chunk.content).toContain('// File: src/helpers.ts');
    }
  });

  it('sets type to "other" and parentContext to empty string', () => {
    const source = makeBlock('hello');
    const chunks = naiveChunk(source, 'src/hello.ts', 'typescript');
    for (const chunk of chunks) {
      expect(chunk.type).toBe('other');
      expect(chunk.parentContext).toBe('');
    }
  });

  it('sets filePath and language on each chunk', () => {
    const source = makeBlock('testFunc');
    const chunks = naiveChunk(source, 'src/test.ts', 'typescript');
    for (const chunk of chunks) {
      expect(chunk.filePath).toBe('src/test.ts');
      expect(chunk.language).toBe('typescript');
    }
  });

  it('handles empty source gracefully', () => {
    const chunks = naiveChunk('', 'src/empty.ts', 'typescript');
    expect(chunks).toEqual([]);
  });

  it('handles source with only whitespace', () => {
    const chunks = naiveChunk('   \n\n\n   ', 'src/empty.ts', 'typescript');
    expect(chunks).toEqual([]);
  });

  it('handles Python files with correct language', () => {
    const source = `def function_alpha(x: int, y: int) -> int:
    """Compute something meaningful with x and y values provided."""
    result = x * y + x - y
    return result



def function_beta(items: list) -> list:
    """Process a list of items and return filtered non-None results."""
    return [item for item in items if item is not None]`;
    const chunks = naiveChunk(source, 'src/utils.py', 'python');
    expect(chunks.length).toBeGreaterThan(0);
    for (const chunk of chunks) {
      expect(chunk.language).toBe('python');
      expect(chunk.filePath).toBe('src/utils.py');
    }
  });

  it('returns correct lineStart and lineEnd for split blocks', () => {
    const lines = Array.from({ length: 200 }, (_, i) => `const val${i} = ${i};`);
    const source = lines.join('\n');
    const chunks = naiveChunk(source, 'src/big.ts', 'typescript');
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    // First chunk starts at 0
    expect(chunks[0]!.lineStart).toBe(0);
    // Second chunk starts after first
    expect(chunks[1]!.lineStart).toBe(150);
  });
});
