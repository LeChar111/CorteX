import type Parser from 'tree-sitter';

export interface StaticEntity {
  type: 'dependency' | 'function' | 'class' | 'env_variable';
  name: string;
  qualifiedName: string;
  filePath: string;
  lineStart: number;
  lineEnd: number;
  metadata: Record<string, string | number | boolean>;
}

type SyntaxNode = Parser.SyntaxNode;

function walkTree(node: SyntaxNode, visitor: (n: SyntaxNode) => void): void {
  visitor(node);
  for (const child of node.children) {
    walkTree(child, visitor);
  }
}

function getChildText(node: SyntaxNode, fieldName: string): string | null {
  const child = node.childForFieldName(fieldName);
  return child ? child.text : null;
}

function extractImportName(node: SyntaxNode, language: string): string | null {
  if (language === 'typescript' || language === 'javascript') {
    // import_statement: import X from 'source' or import { X } from 'source'
    const source = node.childForFieldName('source');
    if (source) {
      // Strip quotes
      return source.text.replace(/^['"`]|['"`]$/g, '');
    }
    // Fallback: find string child
    for (const child of node.children) {
      if (child.type === 'string') {
        return child.text.replace(/^['"`]|['"`]$/g, '');
      }
    }
  } else if (language === 'python') {
    // import_statement: import os, sys
    // import_from_statement: from os import path
    if (node.type === 'import_from_statement') {
      const moduleName = node.childForFieldName('module_name');
      if (moduleName) return moduleName.text;
    }
    // import_statement: import os
    const name = node.childForFieldName('name');
    if (name) return name.text;
    // Fallback: first dotted_name or identifier child
    for (const child of node.children) {
      if (child.type === 'dotted_name' || child.type === 'identifier') {
        return child.text;
      }
    }
  } else if (language === 'go') {
    // import_spec: "fmt" or alias "fmt"
    for (const child of node.children) {
      if (child.type === 'interpreted_string_literal' || child.type === 'raw_string_literal') {
        return child.text.replace(/^['"`]|['"`]$/g, '');
      }
    }
    if (node.text) {
      return node.text.replace(/^['"`]|['"`]$/g, '');
    }
  }
  return null;
}

function extractFunctionName(node: SyntaxNode, language: string): string | null {
  if (language === 'typescript' || language === 'javascript') {
    return getChildText(node, 'name');
  } else if (language === 'python') {
    return getChildText(node, 'name');
  } else if (language === 'go') {
    return getChildText(node, 'name');
  }
  return null;
}

function extractClassName(node: SyntaxNode, language: string): string | null {
  if (language === 'typescript' || language === 'javascript') {
    return getChildText(node, 'name');
  } else if (language === 'python') {
    return getChildText(node, 'name');
  }
  return null;
}

function extractEnvVarName(node: SyntaxNode, _source: string): string | null {
  // member_expression: process.env.X
  // node is the outer member_expression
  // structure: (member_expression object: (member_expression object: (identifier "process") property: (property_identifier "env")) property: (property_identifier "X"))
  const object = node.childForFieldName('object');
  const property = node.childForFieldName('property');
  if (!object || !property) return null;

  if (object.type === 'member_expression') {
    const innerObject = object.childForFieldName('object');
    const innerProperty = object.childForFieldName('property');
    if (
      innerObject?.type === 'identifier' &&
      innerObject.text === 'process' &&
      innerProperty?.text === 'env'
    ) {
      return property.text;
    }
  }
  return null;
}

export function extractStatic(
  root: SyntaxNode,
  _source: string,
  filePath: string,
  language: string,
): StaticEntity[] {
  const entities: StaticEntity[] = [];
  const seen = new Set<string>();

  const importNodeTypes = new Set<string>();
  const functionNodeTypes = new Set<string>();
  const classNodeTypes = new Set<string>();

  if (language === 'typescript' || language === 'javascript') {
    importNodeTypes.add('import_statement');
    functionNodeTypes.add('function_declaration');
    classNodeTypes.add('class_declaration');
  } else if (language === 'python') {
    importNodeTypes.add('import_statement');
    importNodeTypes.add('import_from_statement');
    functionNodeTypes.add('function_definition');
    classNodeTypes.add('class_definition');
  } else if (language === 'go') {
    importNodeTypes.add('import_spec');
    functionNodeTypes.add('function_declaration');
    functionNodeTypes.add('method_declaration');
  }

  walkTree(root, (node) => {
    const lineStart = node.startPosition.row + 1;
    const lineEnd = node.endPosition.row + 1;

    // Imports / dependencies
    if (importNodeTypes.has(node.type)) {
      const moduleName = extractImportName(node, language);
      if (moduleName) {
        const qualifiedName = `${filePath}::import::${moduleName}`;
        if (!seen.has(qualifiedName)) {
          seen.add(qualifiedName);
          entities.push({
            type: 'dependency',
            name: moduleName,
            qualifiedName,
            filePath,
            lineStart,
            lineEnd,
            metadata: { moduleName },
          });
        }
      }
    }

    // Functions
    if (functionNodeTypes.has(node.type)) {
      const name = extractFunctionName(node, language);
      if (name) {
        const qualifiedName = `${filePath}::${name}`;
        if (!seen.has(qualifiedName)) {
          seen.add(qualifiedName);
          entities.push({
            type: 'function',
            name,
            qualifiedName,
            filePath,
            lineStart,
            lineEnd,
            metadata: { nodeType: node.type },
          });
        }
      }
    }

    // Classes
    if (classNodeTypes.has(node.type)) {
      const name = extractClassName(node, language);
      if (name) {
        const qualifiedName = `${filePath}::${name}`;
        if (!seen.has(qualifiedName)) {
          seen.add(qualifiedName);
          entities.push({
            type: 'class',
            name,
            qualifiedName,
            filePath,
            lineStart,
            lineEnd,
            metadata: { nodeType: node.type },
          });
        }
      }
    }

    // Env variables (TS/JS only)
    if (
      (language === 'typescript' || language === 'javascript') &&
      node.type === 'member_expression'
    ) {
      const varName = extractEnvVarName(node, _source);
      if (varName) {
        const qualifiedName = `${filePath}::env::${varName}`;
        if (!seen.has(qualifiedName)) {
          seen.add(qualifiedName);
          entities.push({
            type: 'env_variable',
            name: varName,
            qualifiedName,
            filePath,
            lineStart,
            lineEnd,
            metadata: { varName },
          });
        }
      }
    }
  });

  return entities;
}
