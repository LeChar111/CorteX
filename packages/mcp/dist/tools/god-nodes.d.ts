import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const godNodesTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            projectId: {
                type: string;
                description: string;
            };
        };
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=god-nodes.d.ts.map