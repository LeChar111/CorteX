import { describe, it, expect } from 'vitest';
import { detectLanguage, parseSource } from '../parsers/tree-sitter.js';

describe('detectLanguage', () => {
  it('maps .ts to typescript', () => {
    expect(detectLanguage('foo.ts')).toBe('typescript');
  });

  it('maps .tsx to tsx', () => {
    expect(detectLanguage('foo.tsx')).toBe('tsx');
  });

  it('maps .js to javascript', () => {
    expect(detectLanguage('foo.js')).toBe('javascript');
  });

  it('maps .jsx to javascript', () => {
    expect(detectLanguage('foo.jsx')).toBe('javascript');
  });

  it('maps .mjs to javascript', () => {
    expect(detectLanguage('foo.mjs')).toBe('javascript');
  });

  it('maps .cjs to javascript', () => {
    expect(detectLanguage('foo.cjs')).toBe('javascript');
  });

  it('maps .py to python', () => {
    expect(detectLanguage('foo.py')).toBe('python');
  });

  it('maps .go to go', () => {
    expect(detectLanguage('foo.go')).toBe('go');
  });

  it('returns null for .rs', () => {
    expect(detectLanguage('foo.rs')).toBeNull();
  });

  it('returns null for files with no extension', () => {
    expect(detectLanguage('Makefile')).toBeNull();
  });

  it('handles nested paths', () => {
    expect(detectLanguage('src/utils/helpers.ts')).toBe('typescript');
  });
});

describe('parseSource', () => {
  it('parses TypeScript and returns rootNode.type = program', () => {
    const tree = parseSource('const x: number = 1;', 'typescript');
    expect(tree).not.toBeNull();
    expect(tree!.rootNode.type).toBe('program');
  });

  it('parses TSX and returns rootNode.type = program', () => {
    const tree = parseSource('const el = <div />;', 'tsx');
    expect(tree).not.toBeNull();
    expect(tree!.rootNode.type).toBe('program');
  });

  it('parses JavaScript and returns rootNode.type = program', () => {
    const tree = parseSource('const x = 1;', 'javascript');
    expect(tree).not.toBeNull();
    expect(tree!.rootNode.type).toBe('program');
  });

  it('parses Python and returns rootNode.type = module', () => {
    const tree = parseSource('def foo():\n  pass', 'python');
    expect(tree).not.toBeNull();
    expect(tree!.rootNode.type).toBe('module');
  });

  it('parses Go and returns rootNode.type = source_file', () => {
    const tree = parseSource('package main\nfunc main() {}', 'go');
    expect(tree).not.toBeNull();
    expect(tree!.rootNode.type).toBe('source_file');
  });

  it('returns null for unsupported language', () => {
    const tree = parseSource('fn main() {}', 'rust');
    expect(tree).toBeNull();
  });
});
