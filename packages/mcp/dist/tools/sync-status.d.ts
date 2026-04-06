import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const syncStatusTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            project: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=sync-status.d.ts.map