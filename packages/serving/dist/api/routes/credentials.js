import { Hono } from 'hono';
import { z } from 'zod';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const CRED_FILE = resolve(process.env['CORTEX_ROOT'] || resolve(import.meta.dirname, '../../../../..'), '.cred.env');
/**
 * Parse .cred.env — format per entry:
 *   # label=My Label | provider=github
 *   MY_KEY=secret_value
 */
async function readCredFile() {
    let raw;
    try {
        raw = await readFile(CRED_FILE, 'utf-8');
    }
    catch {
        return [];
    }
    const entries = [];
    const lines = raw.split('\n');
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || (line.startsWith('#') && !line.startsWith('# label=')))
            continue;
        // Parse metadata comment
        if (line.startsWith('# label=')) {
            const meta = Object.fromEntries(line
                .slice(2)
                .split(' | ')
                .map((p) => {
                const eq = p.indexOf('=');
                return eq > 0 ? [p.slice(0, eq).trim(), p.slice(eq + 1).trim()] : [];
            })
                .filter((p) => p.length === 2));
            // Next non-empty, non-comment line is the key=value
            const nextLine = lines[++i]?.trim();
            if (nextLine && !nextLine.startsWith('#')) {
                const eq = nextLine.indexOf('=');
                if (eq > 0) {
                    const key = nextLine.slice(0, eq);
                    const value = nextLine.slice(eq + 1);
                    entries.push({
                        id: meta.id || key,
                        label: meta.label || key,
                        provider: meta.provider || 'custom',
                        key,
                        value,
                    });
                }
            }
        }
    }
    return entries;
}
async function writeCredFile(entries) {
    const lines = [
        '# Cortex credentials — managed by the dashboard',
        '# Do not edit manually unless you know what you are doing',
        '',
    ];
    for (const entry of entries) {
        lines.push(`# label=${entry.label} | provider=${entry.provider} | id=${entry.id}`);
        lines.push(`${entry.key}=${entry.value}`);
        lines.push('');
    }
    await writeFile(CRED_FILE, lines.join('\n'), 'utf-8');
}
const addCredSchema = z.object({
    label: z.string().min(1).max(255),
    provider: z.string().min(1).max(64),
    key: z.string().min(1).max(255).regex(/^[A-Z_][A-Z0-9_]*$/, 'Key must be UPPER_SNAKE_CASE'),
    value: z.string().min(1),
});
const updateCredSchema = z.object({
    label: z.string().min(1).max(255).optional(),
    provider: z.string().min(1).max(64).optional(),
    key: z.string().min(1).max(255).regex(/^[A-Z_][A-Z0-9_]*$/).optional(),
    value: z.string().min(1).optional(),
});
export const credentialsRouter = new Hono();
// GET /credentials — list all (values masked by default)
credentialsRouter.get('/credentials', async (c) => {
    const entries = await readCredFile();
    const reveal = c.req.query('reveal') === 'true';
    return c.json(entries.map((e) => ({
        ...e,
        value: reveal ? e.value : maskValue(e.value),
    })));
});
// GET /credentials/:id/reveal — get single entry with full value
credentialsRouter.get('/credentials/:id/reveal', async (c) => {
    const entries = await readCredFile();
    const entry = entries.find((e) => e.id === c.req.param('id'));
    if (!entry)
        return c.json({ error: 'Credential not found' }, 404);
    return c.json(entry);
});
// POST /credentials — add new
credentialsRouter.post('/credentials', async (c) => {
    const body = await c.req.json();
    const parsed = addCredSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
    }
    const entries = await readCredFile();
    // Check duplicate key
    if (entries.some((e) => e.key === parsed.data.key)) {
        return c.json({ error: `Key ${parsed.data.key} already exists` }, 409);
    }
    const newEntry = {
        id: crypto.randomUUID(),
        ...parsed.data,
    };
    entries.push(newEntry);
    await writeCredFile(entries);
    return c.json({ ...newEntry, value: maskValue(newEntry.value) }, 201);
});
// PUT /credentials/:id — update
credentialsRouter.put('/credentials/:id', async (c) => {
    const body = await c.req.json();
    const parsed = updateCredSchema.safeParse(body);
    if (!parsed.success) {
        return c.json({ error: 'Validation error', details: parsed.error.errors }, 400);
    }
    const entries = await readCredFile();
    const idx = entries.findIndex((e) => e.id === c.req.param('id'));
    if (idx === -1)
        return c.json({ error: 'Credential not found' }, 404);
    // Check duplicate key if changing key
    if (parsed.data.key && parsed.data.key !== entries[idx].key) {
        if (entries.some((e) => e.key === parsed.data.key)) {
            return c.json({ error: `Key ${parsed.data.key} already exists` }, 409);
        }
    }
    entries[idx] = { ...entries[idx], ...parsed.data };
    await writeCredFile(entries);
    return c.json({ ...entries[idx], value: maskValue(entries[idx].value) });
});
// DELETE /credentials/:id
credentialsRouter.delete('/credentials/:id', async (c) => {
    const entries = await readCredFile();
    const filtered = entries.filter((e) => e.id !== c.req.param('id'));
    if (filtered.length === entries.length) {
        return c.json({ error: 'Credential not found' }, 404);
    }
    await writeCredFile(filtered);
    return new Response(null, { status: 204 });
});
function maskValue(value) {
    if (value.length <= 8)
        return '••••••••';
    return value.slice(0, 4) + '••••••••' + value.slice(-4);
}
//# sourceMappingURL=credentials.js.map