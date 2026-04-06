import { describe, it, expect } from 'vitest';
import { chunkFile } from '../parsers/chunker.js';
import { parseSource } from '../parsers/tree-sitter.js';

// All top-level nodes must be >= 50 tokens to be included as chunks
const TS_SOURCE = `import { readFile } from 'fs/promises';
import type { PathLike } from 'fs';

function loadFile(path: PathLike): Promise<string> {
  // Load the file from disk, read it as UTF-8 and return the full content
  // This is a utility wrapper around the native fs/promises readFile function
  return readFile(path, { encoding: 'utf8' });
}

async function processFile(path: PathLike): Promise<string[]> {
  // Read the file contents, split into lines, and filter out empty strings
  const content = await loadFile(path);
  const lines = content.split('\n').filter(Boolean);
  return lines.map(line => line.trimEnd());
}

class FileProcessor {
  private readonly basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  async process(name: string): Promise<string[]> {
    return processFile(this.basePath + '/' + name);
  }
}

interface IFileProcessor {
  process(name: string, options?: Record<string, unknown>): Promise<string[]>;
  validate(input: unknown): boolean;
  getConfig(): Record<string, string>;
  reset(): void;
  readonly id: string;
}
`;

describe('chunkFile', () => {
  it('produces chunks from TypeScript source', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    expect(tree).not.toBeNull();
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);
    expect(chunks.length).toBeGreaterThan(0);
  });

  it('includes import context in chunk content', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);

    // All chunks should contain the imports as context
    for (const chunk of chunks) {
      expect(chunk.content).toContain("import { readFile } from 'fs/promises'");
    }
  });

  it('sets parentContext to import lines', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);

    for (const chunk of chunks) {
      expect(chunk.parentContext).toContain("import { readFile } from 'fs/promises'");
    }
  });

  it('sets correct lineStart and lineEnd for each chunk', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);

    for (const chunk of chunks) {
      expect(chunk.lineStart).toBeGreaterThanOrEqual(0);
      expect(chunk.lineEnd).toBeGreaterThanOrEqual(chunk.lineStart);
    }
  });

  it('assigns correct type for function declarations', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);

    const funcChunks = chunks.filter(c => c.type === 'function');
    expect(funcChunks.length).toBeGreaterThan(0);
  });

  it('assigns correct type for class declarations', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);

    const classChunks = chunks.filter(c => c.type === 'class');
    expect(classChunks.length).toBeGreaterThan(0);
  });

  it('assigns correct type for interface declarations', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);

    const ifaceChunks = chunks.filter(c => c.type === 'interface');
    expect(ifaceChunks.length).toBeGreaterThan(0);
  });

  it('sets filePath and language on each chunk', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);

    for (const chunk of chunks) {
      expect(chunk.filePath).toBe('src/file.ts');
      expect(chunk.language).toBe('typescript');
    }
  });

  it('does not create chunks for import statements themselves', () => {
    const tree = parseSource(TS_SOURCE, 'typescript');
    const chunks = chunkFile(TS_SOURCE, 'src/file.ts', 'typescript', tree!.rootNode);

    const importChunks = chunks.filter(c => c.type === 'import_block');
    expect(importChunks.length).toBe(0);
  });

  it('handles Python source correctly', () => {
    const pySrc = `import os
from typing import List


def process_items(items: List[str], max_count: int = 100) -> List[str]:
    """Process a list of string items, applying filters and transformations.

    Trims whitespace, filters empty strings, and limits output to max_count.
    """
    result = []
    for item in items:
        cleaned = item.strip()
        if cleaned:
            result.append(cleaned)
    return result[:max_count]


class DataProcessor:
    """A class for processing data with various transformation methods."""

    def __init__(self, config: dict) -> None:
        self.config = config
        self.data: List[str] = []

    def process(self, items: List[str]) -> List[str]:
        """Process a list of items and return filtered results."""
        return [item.strip() for item in items if item]
`;
    const tree = parseSource(pySrc, 'python');
    expect(tree).not.toBeNull();
    const chunks = chunkFile(pySrc, 'src/processor.py', 'python', tree!.rootNode);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some(c => c.type === 'function')).toBe(true);
    expect(chunks.some(c => c.type === 'class')).toBe(true);
  });

  it('handles Go source correctly', () => {
    const goSrc = `package main

import (
\t"fmt"
\t"strings"
)

func greetUser(name string, prefix string) string {
\t// Build a greeting message using the provided name and prefix values
\tformatted := strings.TrimSpace(name)
\tif formatted == "" {
\t\tformatted = "stranger"
\t}
\treturn fmt.Sprintf("%s, %s! Welcome to the application.", prefix, formatted)
}

type UserProcessor struct {
\tbasePath string
\tmaxItems int
}

func (u *UserProcessor) Process(names []string) []string {
\tresult := make([]string, 0, len(names))
\tfor _, name := range names {
\t\tresult = append(result, strings.TrimSpace(name))
\t}
\treturn result
}
`;
    const tree = parseSource(goSrc, 'go');
    expect(tree).not.toBeNull();
    const chunks = chunkFile(goSrc, 'main.go', 'go', tree!.rootNode);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.some(c => c.type === 'function')).toBe(true);
  });

  it('splits large nodes into sub-nodes when over 2000 tokens', () => {
    // Build a class with enough methods to exceed 2000 tokens
    const methods = Array.from({ length: 40 }, (_, i) => `
  method${i}(input: string): string {
    const result = input.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const processed = result.split('_').filter(Boolean).join('-');
    return \`prefix_\${processed}_suffix_index_${i}\`;
  }`).join('\n');

    const bigSrc = `import { helper } from './utils';

class BigClass {${methods}
}
`;
    const tree = parseSource(bigSrc, 'typescript');
    expect(tree).not.toBeNull();
    const chunks = chunkFile(bigSrc, 'src/big.ts', 'typescript', tree!.rootNode);
    // Should have multiple chunks (split by methods)
    expect(chunks.length).toBeGreaterThan(1);
  });
});
