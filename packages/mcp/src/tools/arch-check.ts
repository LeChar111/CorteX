import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';

export const archCheckTool = {
  name: 'architecture_check',
  description:
    'Check if a file or change violates architecture rules defined for the project. Returns matching rules and their severity.',
  inputSchema: {
    type: 'object' as const,
    properties: {
      filePath: { type: 'string', description: 'File path to check against architecture rules' },
      description: {
        type: 'string',
        description: 'Description of the proposed change (e.g. "adding a direct DB call from the controller layer")',
      },
    },
    required: ['filePath'],
  },
  async handler(
    args: Record<string, unknown>,
    client: CortexClient,
    detected: DetectedProject | null,
  ): Promise<string> {
    const filePath = args.filePath as string;
    const description = args.description as string | undefined;
    const projectRef = detected?.projectName ?? detected?.projectId;

    if (!projectRef) {
      return 'Could not detect current project. Architecture rules require a project context.';
    }

    // Get project context which includes arch rules
    const ctx = await client.getContext(projectRef) as {
      archRules?: Array<{ name?: string; severity?: string; description?: string }>;
      project?: { name?: string };
    };

    const rules = ctx.archRules ?? [];

    if (rules.length === 0) {
      return `No architecture rules defined for project "${ctx.project?.name ?? projectRef}". Use the dashboard to add rules.`;
    }

    const lines: string[] = ['# Architecture Check', ''];
    lines.push(`File: ${filePath}`);
    if (description) lines.push(`Change: ${description}`);
    lines.push('');

    // Match rules against the file path and description
    const violations: Array<{ name: string; severity: string; description: string; reason: string }> = [];
    const filePathLower = filePath.toLowerCase();
    const descLower = (description ?? '').toLowerCase();

    for (const rule of rules) {
      const ruleName = (rule.name ?? '').toLowerCase();
      const ruleDesc = (rule.description ?? '').toLowerCase();

      // Heuristic matching: check if the file or change description relates to the rule
      const relevantTerms = [...ruleName.split(/[\s_-]+/), ...ruleDesc.split(/[\s_-]+/)].filter(t => t.length > 2);
      const matches = relevantTerms.filter(term => filePathLower.includes(term) || descLower.includes(term));

      if (matches.length > 0) {
        violations.push({
          name: rule.name ?? 'unnamed',
          severity: rule.severity ?? 'warning',
          description: rule.description ?? '',
          reason: `Matched terms: ${matches.join(', ')}`,
        });
      }
    }

    if (violations.length === 0) {
      lines.push(`No rule violations detected among ${rules.length} rules.`);
    } else {
      lines.push(`## Potential Violations (${violations.length})`);
      for (const v of violations) {
        lines.push(`### [${v.severity.toUpperCase()}] ${v.name}`);
        lines.push(v.description);
        lines.push(`*${v.reason}*`);
        lines.push('');
      }
    }

    lines.push('', `## All Rules (${rules.length})`);
    for (const r of rules) {
      lines.push(`- [${r.severity}] **${r.name}**: ${r.description}`);
    }

    return lines.join('\n');
  },
};
