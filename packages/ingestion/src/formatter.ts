import type { ExtractionResult } from './extractors/llm-extractor.js';

export interface FormatForLightRAGInput {
  filePath: string;
  projectName: string;
  repoName: string;
  language: string;
  sourceCode: string;
  extraction: ExtractionResult;
}

const MAX_CODE_LENGTH = 3000;

export function formatForLightRAG(input: FormatForLightRAGInput): string {
  const { filePath, projectName, repoName, language, sourceCode, extraction } = input;

  const lines: string[] = [];

  // Header
  lines.push(`# File: ${filePath}`);
  lines.push(`Project: ${projectName} | Repo: ${repoName} | Language: ${language}`);
  lines.push('');

  // Entities section
  lines.push('## Entities');
  lines.push('');

  if (extraction.entities.length === 0) {
    lines.push('_No entities extracted._');
    lines.push('');
  } else {
    for (const entity of extraction.entities) {
      lines.push(`### ${entity.type}: ${entity.name}`);
      lines.push(`- Qualified name: ${entity.qualified_name}`);
      if (entity.description) {
        lines.push(`- Description: ${entity.description}`);
      }
      lines.push('');
    }
  }

  // Relations section
  lines.push('## Relations');
  lines.push('');

  if (extraction.relations.length === 0) {
    lines.push('_No relations extracted._');
    lines.push('');
  } else {
    for (const relation of extraction.relations) {
      lines.push(
        `- ${relation.source} --[${relation.type}]--> ${relation.target} (${relation.description}) [confidence: ${relation.confidence}]`,
      );
    }
    lines.push('');
  }

  // Source code section
  lines.push('## Source Code');
  lines.push('');

  const truncated =
    sourceCode.length > MAX_CODE_LENGTH
      ? sourceCode.slice(0, MAX_CODE_LENGTH) + '\n... (truncated)'
      : sourceCode;

  lines.push(`\`\`\`${language}`);
  lines.push(truncated);
  lines.push('```');

  return lines.join('\n');
}
