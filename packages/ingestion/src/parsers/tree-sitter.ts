import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const Parser = require('tree-sitter') as typeof import('tree-sitter');
const TypeScript = require('tree-sitter-typescript') as { typescript: unknown; tsx: unknown };
const JavaScript = require('tree-sitter-javascript') as unknown;
const Python = require('tree-sitter-python') as unknown;
const Go = require('tree-sitter-go') as unknown;

import type ParserType from 'tree-sitter';

const LANGUAGE_MAP: Record<string, unknown> = {
  typescript: TypeScript.typescript,
  tsx: TypeScript.tsx,
  javascript: JavaScript,
  python: Python,
  go: Go,
};

const EXTENSION_MAP: Record<string, string> = {
  // Web / JS ecosystem
  '.ts': 'typescript',
  '.tsx': 'tsx',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  // Python
  '.py': 'python',
  // Go
  '.go': 'go',
  // Shell
  '.sh': 'bash',
  '.bash': 'bash',
  // C / C++
  '.c': 'c',
  '.h': 'c',
  '.cpp': 'cpp',
  '.hpp': 'cpp',
  '.cc': 'cpp',
  '.hh': 'cpp',
  // Java / Kotlin
  '.java': 'java',
  '.kt': 'kotlin',
  // Rust
  '.rs': 'rust',
  // Ruby
  '.rb': 'ruby',
  // PHP
  '.php': 'php',
  // Config / Data
  '.json': 'json',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.toml': 'toml',
  '.xml': 'xml',
  '.ini': 'ini',
  '.cfg': 'ini',
  '.conf': 'config',
  // Docs
  '.md': 'markdown',
  '.rst': 'rst',
  '.txt': 'text',
  // SQL
  '.sql': 'sql',
  // Protobuf
  '.proto': 'protobuf',
  // Docker
  '.dockerfile': 'dockerfile',
  // Build systems
  '.cmake': 'cmake',
  '.mk': 'makefile',
  '.makefile': 'makefile',
  '.bb': 'bitbake',
  '.bbappend': 'bitbake',
  '.bbclass': 'bitbake',
  // Misc
  '.env.example': 'env',
  '.graphql': 'graphql',
  '.gql': 'graphql',
  '.css': 'css',
  '.scss': 'scss',
  '.html': 'html',
  '.svelte': 'svelte',
  '.vue': 'vue',
};

export function detectLanguage(filePath: string): string | null {
  const dotIndex = filePath.lastIndexOf('.');
  if (dotIndex === -1) return null;
  const ext = filePath.slice(dotIndex);
  return EXTENSION_MAP[ext] ?? null;
}

export function parseSource(source: string, language: string): ParserType.Tree | null {
  const lang = LANGUAGE_MAP[language];
  if (!lang) return null;
  const parser = new Parser();
  parser.setLanguage(lang);
  return parser.parse(source);
}
