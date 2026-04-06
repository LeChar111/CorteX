const AGENT_PATTERNS = /\b(comment|pourquoi|why|how|impact|compare|compar|analyse|analyze|explain|expliqu|différence|difference|architecture|refactor|debug)\b/i;
const FAST_PATTERNS = /\b(list|liste|qu'est-ce|what is|define|définition|definition|version|nom|name|show|affiche|montre)\b/i;
export function routeQuery(message, hasProjectId) {
    const wordCount = message.trim().split(/\s+/).length;
    // Short simple questions without project scope → fast
    if (wordCount <= 12 && !hasProjectId && FAST_PATTERNS.test(message)) {
        return 'fast';
    }
    // Investigation keywords → agent
    if (AGENT_PATTERNS.test(message) && wordCount > 8) {
        return 'agent';
    }
    // Default → smart (best balance)
    return 'smart';
}
//# sourceMappingURL=router.js.map