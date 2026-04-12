/**
 * Normalized entity types used across the entire CorteX pipeline.
 * All extractors (static, LLM, config) MUST map to these types.
 */
export const ENTITY_TYPES = [
    // Code entities
    'function',
    'class',
    'interface',
    'type',
    'variable',
    'constant',
    'enum',
    'module',
    // Architecture entities
    'service',
    'endpoint',
    'model',
    // Infrastructure entities
    'dependency',
    'env_variable',
    'container',
    'port',
    'pipeline',
];
/**
 * Normalized relation types for edges in the knowledge graph.
 */
export const RELATION_TYPES = [
    'calls',
    'imports',
    'extends',
    'implements',
    'uses',
    'defines',
    'returns',
    'accepts',
    'depends_on',
    'exposes',
    'configures',
    'related_to',
];
/**
 * Build a consistent qualified name for an entity.
 * Format: project::repo::filePath::entityName
 * Omits empty segments.
 */
export function buildQualifiedName(parts) {
    const segments = [];
    if (parts.project)
        segments.push(parts.project);
    if (parts.repo)
        segments.push(parts.repo);
    segments.push(parts.filePath);
    if (parts.namespace)
        segments.push(parts.namespace);
    segments.push(parts.name);
    return segments.join('::');
}
/**
 * Map legacy/non-standard entity types to normalized types.
 */
const TYPE_ALIASES = {
    // Static extractor legacy types
    env_config: 'env_variable',
    container_config: 'container',
    service_topology: 'service',
    // Misc aliases
    method: 'function',
    struct: 'class',
    trait: 'interface',
    protocol: 'interface',
    namespace: 'module',
    package: 'module',
    route: 'endpoint',
    api: 'endpoint',
};
export function normalizeEntityType(raw) {
    const lower = raw.toLowerCase();
    if (ENTITY_TYPES.includes(lower)) {
        return lower;
    }
    return TYPE_ALIASES[lower] ?? 'variable';
}
//# sourceMappingURL=entity-types.js.map