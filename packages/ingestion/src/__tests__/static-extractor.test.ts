import { describe, it, expect } from 'vitest';
import { parseSource } from '../parsers/tree-sitter.js';
import { extractStatic } from '../extractors/static-extractor.js';

const TEST_FILE_PATH = 'src/test-file.ts';

const TEST_TS_CODE = `import express from 'express';
import { createServer } from 'http';
import path from 'path';

const PORT = process.env.PORT;
const SECRET = process.env.JWT_SECRET;

function handleRequest(req: any, res: any): void {
  res.send('hello');
}

function validateToken(token: string): boolean {
  return token.length > 0;
}

class UserService {
  constructor() {}
}
`;

describe('extractStatic - TypeScript', () => {
  it('extracts 3 imports from TypeScript code', () => {
    const tree = parseSource(TEST_TS_CODE, 'typescript');
    expect(tree).not.toBeNull();
    const entities = extractStatic(tree!.rootNode, TEST_TS_CODE, TEST_FILE_PATH, 'typescript');
    const imports = entities.filter((e) => e.type === 'dependency');
    expect(imports.length).toBe(3);
    const names = imports.map((e) => e.name);
    expect(names).toContain('express');
    expect(names).toContain('http');
    expect(names).toContain('path');
  });

  it('extracts env variables (PORT, JWT_SECRET)', () => {
    const tree = parseSource(TEST_TS_CODE, 'typescript');
    expect(tree).not.toBeNull();
    const entities = extractStatic(tree!.rootNode, TEST_TS_CODE, TEST_FILE_PATH, 'typescript');
    const envVars = entities.filter((e) => e.type === 'env_variable');
    expect(envVars.length).toBe(2);
    const names = envVars.map((e) => e.name);
    expect(names).toContain('PORT');
    expect(names).toContain('JWT_SECRET');
  });

  it('extracts 2 function declarations', () => {
    const tree = parseSource(TEST_TS_CODE, 'typescript');
    expect(tree).not.toBeNull();
    const entities = extractStatic(tree!.rootNode, TEST_TS_CODE, TEST_FILE_PATH, 'typescript');
    const functions = entities.filter((e) => e.type === 'function');
    expect(functions.length).toBe(2);
    const names = functions.map((e) => e.name);
    expect(names).toContain('handleRequest');
    expect(names).toContain('validateToken');
  });

  it('extracts 1 class declaration', () => {
    const tree = parseSource(TEST_TS_CODE, 'typescript');
    expect(tree).not.toBeNull();
    const entities = extractStatic(tree!.rootNode, TEST_TS_CODE, TEST_FILE_PATH, 'typescript');
    const classes = entities.filter((e) => e.type === 'class');
    expect(classes.length).toBe(1);
    expect(classes[0]!.name).toBe('UserService');
  });

  it('generates correct qualifiedName format', () => {
    const tree = parseSource(TEST_TS_CODE, 'typescript');
    expect(tree).not.toBeNull();
    const entities = extractStatic(tree!.rootNode, TEST_TS_CODE, TEST_FILE_PATH, 'typescript');
    const importEntity = entities.find((e) => e.type === 'dependency' && e.name === 'express');
    expect(importEntity?.qualifiedName).toBe(`${TEST_FILE_PATH}::import::express`);

    const funcEntity = entities.find((e) => e.type === 'function' && e.name === 'handleRequest');
    expect(funcEntity?.qualifiedName).toBe(`${TEST_FILE_PATH}::handleRequest`);

    const envEntity = entities.find((e) => e.type === 'env_variable' && e.name === 'PORT');
    expect(envEntity?.qualifiedName).toBe(`${TEST_FILE_PATH}::env::PORT`);
  });

  it('deduplicates entities by qualifiedName', () => {
    const duplicateCode = `import express from 'express';
import express from 'express';
`;
    const tree = parseSource(duplicateCode, 'typescript');
    expect(tree).not.toBeNull();
    const entities = extractStatic(tree!.rootNode, duplicateCode, TEST_FILE_PATH, 'typescript');
    const imports = entities.filter((e) => e.type === 'dependency' && e.name === 'express');
    expect(imports.length).toBe(1);
  });

  it('records correct line numbers', () => {
    const tree = parseSource(TEST_TS_CODE, 'typescript');
    expect(tree).not.toBeNull();
    const entities = extractStatic(tree!.rootNode, TEST_TS_CODE, TEST_FILE_PATH, 'typescript');
    const firstImport = entities.find((e) => e.type === 'dependency' && e.name === 'express');
    expect(firstImport?.lineStart).toBe(1);
  });
});
