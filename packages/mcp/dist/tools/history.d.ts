import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const historyTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            entityName: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                description: string;
            };
            project: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=history.d.ts.map