import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const communitiesTool: {
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
//# sourceMappingURL=communities.d.ts.map