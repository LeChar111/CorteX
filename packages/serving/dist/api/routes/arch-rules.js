import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, createArchRule, listArchRules, deleteArchRule, getGraphFull } from '@cortex/db';
export const archRulesRouter = new Hono();
const RuleSchema = z.object({
    projectId: z.string().uuid().optional(),
    name: z.string().min(1),
    rule: z.object({
        source: z.string(),
        target: z.string(),
        relation: z.string().default('*'),
        allow: z.boolean(),
    }),
    severity: z.enum(['error', 'warning', 'info']).default('warning'),
    description: z.string().optional(),
});
archRulesRouter.get('/arch-rules', async (c) => {
    const db = getDb();
    const projectId = c.req.query('projectId');
    return c.json(await listArchRules(db, projectId));
});
archRulesRouter.post('/arch-rules', async (c) => {
    const data = RuleSchema.parse(await c.req.json());
    const db = getDb();
    const rule = await createArchRule(db, data);
    return c.json(rule, 201);
});
archRulesRouter.delete('/arch-rules/:id', async (c) => {
    const db = getDb();
    const deleted = await deleteArchRule(db, c.req.param('id'));
    if (!deleted)
        return c.json({ error: 'Not found' }, 404);
    return new Response(null, { status: 204 });
});
// POST /arch-rules/check — run conformance check against graph
archRulesRouter.post('/arch-rules/check', async (c) => {
    const { projectId } = z.object({ projectId: z.string().uuid() }).parse(await c.req.json());
    const db = getDb();
    const rules = await listArchRules(db, projectId);
    if (rules.length === 0)
        return c.json({ violations: [], passed: 0, failed: 0, message: 'No rules defined' });
    const graph = await getGraphFull(db).catch(() => ({ nodes: [], edges: [] }));
    const edges = graph.edges;
    const violations = [];
    let passed = 0;
    for (const archRule of rules) {
        const r = archRule.rule;
        const sourcePattern = new RegExp(r.source, 'i');
        const targetPattern = new RegExp(r.target, 'i');
        const matchingEdges = edges.filter((e) => {
            const src = String(e.sourceNodeId ?? e.source_node_id ?? '');
            const tgt = String(e.targetNodeId ?? e.target_node_id ?? '');
            return sourcePattern.test(src) && targetPattern.test(tgt);
        });
        if (!r.allow && matchingEdges.length > 0) {
            for (const edge of matchingEdges) {
                violations.push({
                    rule: archRule.name,
                    severity: archRule.severity,
                    source: String(edge.sourceNodeId ?? edge.source_node_id ?? ''),
                    target: String(edge.targetNodeId ?? edge.target_node_id ?? ''),
                    relation: String(edge.relation ?? ''),
                });
            }
        }
        else {
            passed++;
        }
    }
    return c.json({ violations, passed, failed: violations.length });
});
//# sourceMappingURL=arch-rules.js.map