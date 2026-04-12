/**
 * Normalized entity types used across the entire CorteX pipeline.
 * All extractors (static, LLM, config) MUST map to these types.
 */
export declare const ENTITY_TYPES: readonly ["function", "class", "interface", "type", "variable", "constant", "enum", "module", "service", "endpoint", "model", "dependency", "env_variable", "container", "port", "pipeline"];
export type EntityType = (typeof ENTITY_TYPES)[number];
/**
 * Normalized relation types for edges in the knowledge graph.
 */
export declare const RELATION_TYPES: readonly ["calls", "imports", "extends", "implements", "uses", "defines", "returns", "accepts", "depends_on", "exposes", "configures", "related_to"];
export type RelationType = (typeof RELATION_TYPES)[number];
/**
 * Build a consistent qualified name for an entity.
 * Format: project::repo::filePath::entityName
 * Omits empty segments.
 */
export declare function buildQualifiedName(parts: {
    project?: string;
    repo?: string;
    filePath: string;
    name: string;
    namespace?: string;
}): string;
export declare function normalizeEntityType(raw: string): EntityType;
//# sourceMappingURL=entity-types.d.ts.map