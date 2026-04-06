import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { shouldIgnore, discoverFiles } from '../source-loader.js';

let tmpDir: string;

beforeAll(() => {
  tmpDir = join(tmpdir(), `cortex-source-loader-test-${Date.now()}`);
  mkdirSync(tmpDir, { recursive: true });

  // Create source files
  mkdirSync(join(tmpDir, 'src'), { recursive: true });
  writeFileSync(join(tmpDir, 'src', 'app.ts'), 'export const x = 1;');
  writeFileSync(join(tmpDir, 'src', 'utils.ts'), 'export const y = 2;');

  // Create a JS file
  writeFileSync(join(tmpDir, 'src', 'index.js'), 'console.log("hello");');

  // Create node_modules (should be ignored)
  mkdirSync(join(tmpDir, 'node_modules', 'some-pkg'), { recursive: true });
  writeFileSync(join(tmpDir, 'node_modules', 'some-pkg', 'index.js'), 'module.exports = {};');

  // Create .git (should be ignored)
  mkdirSync(join(tmpDir, '.git'), { recursive: true });
  writeFileSync(join(tmpDir, '.git', 'config'), '[core]');

  // Create a large file (should be skipped)
  const largeContent = 'x'.repeat(600 * 1024); // 600 KB > default 500 KB
  writeFileSync(join(tmpDir, 'src', 'large-file.ts'), largeContent);
});

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

describe('shouldIgnore', () => {
  it('ignores node_modules', () => {
    expect(shouldIgnore('node_modules/some-pkg/index.js', ['node_modules/**'])).toBe(true);
  });

  it('ignores .git directory', () => {
    expect(shouldIgnore('.git/config', ['.git/**'])).toBe(true);
  });

  it('does not ignore src/app.ts', () => {
    expect(shouldIgnore('src/app.ts', ['node_modules/**', '.git/**'])).toBe(false);
  });

  it('ignores dist directory', () => {
    expect(shouldIgnore('dist/index.js', ['dist/**'])).toBe(true);
  });

  it('does not ignore a path that only partially matches a pattern', () => {
    expect(shouldIgnore('src/distributed.ts', ['dist/**'])).toBe(false);
  });
});

describe('discoverFiles', () => {
  it('finds source files in the tmp directory', async () => {
    const files = await discoverFiles(tmpDir);
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths).toContain('src/app.ts');
    expect(relativePaths).toContain('src/utils.ts');
    expect(relativePaths).toContain('src/index.js');
  });

  it('ignores node_modules', async () => {
    const files = await discoverFiles(tmpDir);
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths.some((p) => p.startsWith('node_modules'))).toBe(false);
  });

  it('ignores .git directory', async () => {
    const files = await discoverFiles(tmpDir);
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths.some((p) => p.startsWith('.git'))).toBe(false);
  });

  it('respects maxFileSizeKb and skips large files', async () => {
    const files = await discoverFiles(tmpDir, { maxFileSizeKb: 500 });
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths).not.toContain('src/large-file.ts');
  });

  it('includes large files when limit is raised', async () => {
    const files = await discoverFiles(tmpDir, { maxFileSizeKb: 1024 });
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths).toContain('src/large-file.ts');
  });

  it('returns SourceFile objects with required fields', async () => {
    const files = await discoverFiles(tmpDir);
    const appFile = files.find((f) => f.relativePath === 'src/app.ts');

    expect(appFile).toBeDefined();
    expect(appFile!.absolutePath).toBe(join(tmpDir, 'src', 'app.ts'));
    expect(appFile!.content).toBe('export const x = 1;');
    expect(appFile!.hash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex
    expect(appFile!.size).toBeGreaterThan(0);
  });

  it('filters by custom extensions', async () => {
    const files = await discoverFiles(tmpDir, { extensions: ['.ts'] });
    const relativePaths = files.map((f) => f.relativePath);

    expect(relativePaths.some((p) => p.endsWith('.ts'))).toBe(true);
    expect(relativePaths.some((p) => p.endsWith('.js'))).toBe(false);
  });
});
