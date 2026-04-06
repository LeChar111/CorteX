import { describe, it, expect } from 'vitest';
import { formatForLightRAG } from '../formatter.js';
import type { ExtractionResult } from '../extractors/llm-extractor.js';

const BASE_INPUT = {
  filePath: 'src/server.ts',
  projectName: 'cortex',
  repoName: 'cortex-api',
  language: 'typescript',
  sourceCode: 'const x = 1;',
};

describe('formatForLightRAG', () => {
  it('formats entities and relations into a structured document containing all fields', () => {
    const extraction: ExtractionResult = {
      entities: [
        {
          type: 'function',
          name: 'handleRequest',
          qualified_name: 'src/server.ts::handleRequest',
          description: 'Handles incoming HTTP requests',
          metadata: {},
        },
        {
          type: 'class',
          name: 'UserService',
          qualified_name: 'src/server.ts::UserService',
          description: 'Manages user operations',
          metadata: {},
        },
      ],
      relations: [
        {
          source: 'src/server.ts::handleRequest',
          target: 'src/server.ts::UserService',
          type: 'uses',
          description: 'Delegates to user service',
          confidence: 0.9,
        },
      ],
    };

    const doc = formatForLightRAG({ ...BASE_INPUT, extraction });

    // Header
    expect(doc).toContain('# File: src/server.ts');
    expect(doc).toContain('Project: cortex');
    expect(doc).toContain('Repo: cortex-api');
    expect(doc).toContain('Language: typescript');

    // Entities section
    expect(doc).toContain('## Entities');
    expect(doc).toContain('### function: handleRequest');
    expect(doc).toContain('Qualified name: src/server.ts::handleRequest');
    expect(doc).toContain('Description: Handles incoming HTTP requests');
    expect(doc).toContain('### class: UserService');
    expect(doc).toContain('Qualified name: src/server.ts::UserService');

    // Relations section
    expect(doc).toContain('## Relations');
    expect(doc).toContain('src/server.ts::handleRequest --[uses]--> src/server.ts::UserService');
    expect(doc).toContain('Delegates to user service');
    expect(doc).toContain('[confidence: 0.9]');

    // Source code section
    expect(doc).toContain('## Source Code');
    expect(doc).toContain('```typescript');
    expect(doc).toContain('const x = 1;');
    expect(doc).toContain('```');
  });

  it('handles empty entities gracefully', () => {
    const extraction: ExtractionResult = {
      entities: [],
      relations: [],
    };

    const doc = formatForLightRAG({ ...BASE_INPUT, extraction });

    expect(doc).toContain('# File: src/server.ts');
    expect(doc).toContain('## Entities');
    expect(doc).toContain('## Relations');
    expect(doc).toContain('## Source Code');
    // Should not throw; should just have empty entity/relation sections
    expect(doc).not.toContain('### function:');
    expect(doc).not.toContain('--[');
  });

  it('truncates source code longer than 3000 characters', () => {
    const longCode = 'x'.repeat(4000);
    const extraction: ExtractionResult = { entities: [], relations: [] };
    const doc = formatForLightRAG({ ...BASE_INPUT, sourceCode: longCode, extraction });
    expect(doc).toContain('... (truncated)');
    // The code block should not contain more than ~3020 chars of x
    const codeStart = doc.indexOf('```typescript\n') + '```typescript\n'.length;
    const codeEnd = doc.indexOf('\n```', codeStart);
    const codeSection = doc.slice(codeStart, codeEnd);
    expect(codeSection.length).toBeLessThan(3100);
  });

  it('does not truncate source code under 3000 characters', () => {
    const shortCode = 'const y = 42;\n'.repeat(10);
    const extraction: ExtractionResult = { entities: [], relations: [] };
    const doc = formatForLightRAG({ ...BASE_INPUT, sourceCode: shortCode, extraction });
    expect(doc).not.toContain('... (truncated)');
    expect(doc).toContain(shortCode.trim());
  });

  it('uses the correct language in code fence', () => {
    const extraction: ExtractionResult = { entities: [], relations: [] };
    const doc = formatForLightRAG({ ...BASE_INPUT, language: 'python', extraction });
    expect(doc).toContain('```python');
  });
});
