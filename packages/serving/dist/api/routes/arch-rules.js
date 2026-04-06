import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, createArchRule, listArchRules, deleteArchRule } from '@cortex/db';
import { LightRAGClient } from '../../lightrag/client.js';
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
    const lightragUrl = process.env['LIGHTRAG_URL'] ?? 'http://localhost:9621';
    const client = new LightRAGClient(lightragUrl);
    const graph = await client.getGraphFull().catch(() => ({ nodes: [], edges: [] }));
    const edges = graph.edges;
    const violations = [];
    let passed = 0;
    for (const archRule of rules) {
        const r = archRule.rule;
        const sourcePattern = new RegExp(r.source, 'i');
        const targetPattern = new RegExp(r.target, 'i');
        const matchingEdges = edges.filter((e) => {
            const src = String(e.source ?? '');
            const tgt = String(e.target ?? '');
            return sourcePattern.test(src) && targetPattern.test(tgt);
        });
        if (!r.allow && matchingEdges.length > 0) {
            for (const edge of matchingEdges) {
                violations.push({
                    rule: archRule.name,
                    severity: archRule.severity,
                    source: String(edge.source ?? ''),
                    target: String(edge.target ?? ''),
                    relation: String(edge.description ?? edge.keywords ?? ''),
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