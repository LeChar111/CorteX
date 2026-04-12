import { Hono } from 'hono';
import { z } from 'zod';
import { getDb, getProjectById, getGraphForProject, projectLinks, } from '@cortex/db';
export const crossProjectDetectRoutes = new Hono();
const DetectSchema = z.object({
    sourceProjectId: z.string().uuid(),
    targetProjectId: z.string().uuid(),
});
crossProjectDetectRoutes.post('/analysis/detect-links', async (c) => {
    const data = DetectSchema.parse(await c.req.json());
    const db = getDb();
    const srcProject = await getProjectById(db, data.sourceProjectId);
    const tgtProject = await getProjectById(db, data.targetProjectId);
    if (!srcProject || !tgtProject) {
        return c.json({ error: 'Project not found' }, 404);
    }
    // Get both graphs
    const srcGraph = await getGraphForProject(db, data.sourceProjectId);
    const tgtGraph = await getGraphForProject(db, data.targetProjectId);
    // Strategy 1: Find shared entity names (same label in both projects)
    const srcLabels = new Map();
    for (const node of srcGraph.nodes) {
        const clean = node.label.toLowerCase().replace(/[()]/g, '').trim();
        if (clean.length > 3) {
            srcLabels.set(clean, node);
        }
    }
    const sharedEntities = [];
    for (const tgtNode of tgtGraph.nodes) {
        const clean = tgtNode.label.toLowerCase().replace(/[()]/g, '').trim();
        const srcNode = srcLabels.get(clean);
        if (srcNode && clean.length > 3) {
            sharedEntities.push({
                name: clean,
                sourceNode: { id: srcNode.id, label: srcNode.label, type: srcNode.type, file: srcNode.sourceFile },
                targetNode: { id: tgtNode.id, label: tgtNode.label, type: tgtNode.type, file: tgtNode.sourceFile },
                matchType: srcNode.type === tgtNode.type ? 'exact' : 'name_only',
            });
        }
    }
    // Strategy 2: Find shared imports (if project A imports package X and project B also imports X)
    const getImportNames = (nodes) => {
        const imports = new Set();
        for (const n of nodes) {
            if (n.type === 'import' || n.type === 'module') {
                imports.add(n.label.toLowerCase());
            }
        }
        return imports;
    };
    const srcImports = getImportNames(srcGraph.nodes);
    const tgtImports = getImportNames(tgtGraph.nodes);
    const sharedImports = [...srcImports].filter(i => tgtImports.has(i));
    // Suggest link type based on overlap
    let suggestedLinkType = 'related';
    const overlapRatio = sharedEntities.length / Math.min(srcGraph.nodes.length, tgtGraph.nodes.length, 1);
    if (overlapRatio > 0.3)
        suggestedLinkType = 'shares_lib';
    else if (sharedImports.length > 5)
        suggestedLinkType = 'depends_on';
    return c.json({
        sourceProject: { id: srcProject.id, name: srcProject.name, nodeCount: srcGraph.nodes.length },
        targetProject: { id: tgtProject.id, name: tgtProject.name, nodeCount: tgtGraph.nodes.length },
        analysis: {
            sharedEntities: sharedEntities.slice(0, 100),
            sharedEntityCount: sharedEntities.length,
            sharedImports: sharedImports.slice(0, 50),
            sharedImportCount: sharedImports.length,
            overlapRatio: Math.round(overlapRatio * 100),
            suggestedLinkType,
        },
        recommendation: sharedEntities.length > 0 || sharedImports.length > 3
            ? `These projects share ${sharedEntities.length} entities and ${sharedImports.length} imports. Suggested link type: '${suggestedLinkType}'.`
            : 'No significant overlap detected between these projects.',
    });
});
// Auto-create project link based on detection
const AutoLinkSchema = z.object({
    sourceProjectId: z.string().uuid(),
    targetProjectId: z.string().uuid(),
    linkType: z.string().default('related'),
});
crossProjectDetectRoutes.post('/analysis/auto-link', async (c) => {
    const data = AutoLinkSchema.parse(await c.req.json());
    const db = getDb();
    // Create the project link
    await db.insert(projectLinks).values({
        sourceProjectId: data.sourceProjectId,
        targetProjectId: data.targetProjectId,
        linkType: data.linkType,
        description: 'Auto-detected by cross-project analysis',
        metadata: { autoDetected: true, detectedAt: new Date().toISOString() },
    }).onConflictDoNothing();
    return c.json({ status: 'linked', linkType: data.linkType });
});
//# sourceMappingURL=cross-project-detect.js.map