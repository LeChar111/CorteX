import type ParserType from 'tree-sitter';

export interface CodeChunk {
  content: string;
  filePath: string;
  language: string;
  lineStart: number;
  lineEnd: number;
  type: 'function' | 'class' | 'interface' | 'route_group' | 'config' | 'import_block' | 'other';
  parentContext: string;
}

const CHUNKABLE_TYPES: Record<string, Set<string>> = {
  typescript: new Set([
    'function_declaration',
    'class_declaration',
    'interface_declaration',
    'export_statement',
    'lexical_declaration',
    'type_alias_declaration',
  ]),
  tsx: new Set([
    'function_declaration',
    'class_declaration',
    'interface_declaration',
    'export_statement',
    'lexical_declaration',
    'type_alias_declaration',
  ]),
  javascript: new Set([
    'function_declaration',
    'class_declaration',
    'interface_declaration',
    'export_statement',
    'lexical_declaration',
    'type_alias_declaration',
  ]),
  python: new Set([
    'function_definition',
    'class_definition',
    'decorated_definition',
  ]),
  go: new Set([
    'function_declaration',
    'method_declaration',
    'type_declaration',
  ]),
};

const IMPORT_TYPES = new Set([
  'import_statement',
  'import_from_statement',
  'import_declaration',
]);

function nodeToChunkType(nodeType: string): CodeChunk['type'] {
  if (nodeType.includes('function') || nodeType.includes('method')) return 'function';
  if (nodeType.includes('class')) return 'class';
  if (nodeType.includes('interface')) return 'interface';
  if (nodeType.includes('import')) return 'import_block';
  return 'other';
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function getSubNodes(node: ParserType.SyntaxNode): ParserType.SyntaxNode[] {
  const subs: ParserType.SyntaxNode[] = [];
  // Walk through children to find body/block nodes and their method children
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (!child) continue;
    const ct = child.type;
    if (
      ct === 'class_body' ||
      ct === 'block' ||
      ct === 'statement_block' ||
      ct === 'suite'
    ) {
      for (let j = 0; j < child.childCount; j++) {
        const grandchild = child.child(j);
        if (!grandchild) continue;
        const gt = grandchild.type;
        if (
          gt === 'method_definition' ||
          gt === 'function_declaration' ||
          gt === 'function_definition' ||
          gt === 'method_declaration' ||
          gt === 'decorated_definition'
        ) {
          subs.push(grandchild);
        }
      }
    }
  }
  return subs;
}

function extractImportContext(
  rootNode: ParserType.SyntaxNode,
  lines: string[],
): string {
  const importLines: string[] = [];
  for (let i = 0; i < rootNode.childCount; i++) {
    const child = rootNode.child(i);
    if (!child) continue;
    if (IMPORT_TYPES.has(child.type)) {
      const start = child.startPosition.row;
      const end = child.endPosition.row;
      for (let l = start; l <= end; l++) {
        if (lines[l] !== undefined) importLines.push(lines[l]);
      }
    }
  }
  return importLines.join('\n');
}

function nodeToChunk(
  node: ParserType.SyntaxNode,
  lines: string[],
  filePath: string,
  language: string,
  importContext: string,
): CodeChunk {
  const lineStart = node.startPosition.row;
  const lineEnd = node.endPosition.row;
  const nodeLines = lines.slice(lineStart, lineEnd + 1);
  const nodeText = nodeLines.join('\n');
  const content = importContext ? `${importContext}\n\n${nodeText}` : nodeText;

  return {
    content,
    filePath,
    language,
    lineStart,
    lineEnd,
    type: nodeToChunkType(node.type),
    parentContext: importContext,
  };
}

export function chunkFile(
  source: string,
  filePath: string,
  language: string,
  rootNode: ParserType.SyntaxNode,
): CodeChunk[] {
  const lines = source.split('\n');
  const chunkableTypes = CHUNKABLE_TYPES[language] ?? new Set<string>();
  const importContext = extractImportContext(rootNode, lines);
  const chunks: CodeChunk[] = [];

  for (let i = 0; i < rootNode.childCount; i++) {
    const child = rootNode.child(i);
    if (!child) continue;

    // Skip import nodes
    if (IMPORT_TYPES.has(child.type)) continue;

    if (!chunkableTypes.has(child.type)) continue;

    const tokenCount = estimateTokens(child.text);

    if (tokenCount > 2000) {
      // Split into sub-nodes (methods)
      const subNodes = getSubNodes(child);
      if (subNodes.length > 0) {
        for (const sub of subNodes) {
          const subTokens = estimateTokens(sub.text);
          if (subTokens >= 50) {
            chunks.push(nodeToChunk(sub, lines, filePath, language, importContext));
          }
        }
        continue;
      }
    }

    if (tokenCount >= 50) {
      chunks.push(nodeToChunk(child, lines, filePath, language, importContext));
    }
  }

  return chunks;
}
