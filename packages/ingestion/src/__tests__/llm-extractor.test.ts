import { describe, it, expect } from 'vitest';
import { parseExtractionResult } from '../extractors/llm-extractor.js';

describe('parseExtractionResult', () => {
  it('parses a valid JSON extraction result', () => {
    const input = JSON.stringify({
      entities: [
        {
          type: 'function',
          name: 'handleRequest',
          qualified_name: 'src/server.ts::handleRequest',
          description: 'Handles HTTP requests',
          metadata: {},
        },
      ],
      relations: [
        {
          source: 'src/server.ts::handleRequest',
          target: 'src/utils.ts::validateToken',
          type: 'calls',
          description: 'Calls token validation',
          confidence: 0.95,
        },
      ],
    });

    const result = parseExtractionResult(input);
    expect(result.entities).toHaveLength(1);
    expect(result.entities[0]!.name).toBe('handleRequest');
    expect(result.entities[0]!.type).toBe('function');
    expect(result.relations).toHaveLength(1);
    expect(result.relations[0]!.type).toBe('calls');
    expect(result.relations[0]!.confidence).toBe(0.95);
  });

  it('handles malformed JSON by returning empty arrays', () => {
    const result = parseExtractionResult('this is not json at all {{{');
    expect(result.entities).toEqual([]);
    expect(result.relations).toEqual([]);
  });

  it('handles empty string by returning empty arrays', () => {
    const result = parseExtractionResult('');
    expect(result.entities).toEqual([]);
    expect(result.relations).toEqual([]);
  });

  it('handles JSON wrapped in markdown code blocks (```json ... ```)', () => {
    const payload = {
      entities: [
        {
          type: 'class',
          name: 'UserService',
          qualified_name: 'src/service.ts::UserService',
          description: 'User management service',
          metadata: {},
        },
      ],
      relations: [],
    };
    const input = '```json\n' + JSON.stringify(payload) + '\n```';
    const result = parseExtractionResult(input);
    expect(result.entities).toHaveLength(1);
    expect(result.entities[0]!.name).toBe('UserService');
    expect(result.relations).toEqual([]);
  });

  it('handles JSON wrapped in plain markdown code blocks (``` ... ```)', () => {
    const payload = {
      entities: [],
      relations: [],
    };
    const input = '```\n' + JSON.stringify(payload) + '\n```';
    const result = parseExtractionResult(input);
    expect(result.entities).toEqual([]);
    expect(result.relations).toEqual([]);
  });

  it('returns empty arrays when JSON has unexpected structure', () => {
    // Not an object with entities/relations, but still valid JSON
    const result = parseExtractionResult('"just a string"');
    expect(result.entities).toEqual([]);
    expect(result.relations).toEqual([]);
  });

  it('handles partial results gracefully (only entities, no relations key)', () => {
    const input = JSON.stringify({
      entities: [
        {
          type: 'function',
          name: 'foo',
          qualified_name: 'src/foo.ts::foo',
          description: '',
          metadata: {},
        },
      ],
    });
    const result = parseExtractionResult(input);
    expect(result.entities).toHaveLength(1);
    expect(result.relations).toEqual([]);
  });

  it('fills in default values for optional fields', () => {
    const input = JSON.stringify({
      entities: [
        {
          type: 'function',
          name: 'bar',
          qualified_name: 'src/bar.ts::bar',
          // description and metadata omitted
        },
      ],
      relations: [
        {
          source: 'a',
          target: 'b',
          type: 'calls',
          // description and confidence omitted
        },
      ],
    });
    const result = parseExtractionResult(input);
    expect(result.entities[0]!.description).toBe('');
    expect(result.entities[0]!.metadata).toEqual({});
    expect(result.relations[0]!.description).toBe('');
    expect(result.relations[0]!.confidence).toBe(1);
  });
});
