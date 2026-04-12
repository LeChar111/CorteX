import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const detectLinksTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            sourceProjectId: {
                type: string;
                description: string;
            };
            targetProjectId: {
                type: string;
                description: string;
            };
            autoLink: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, _detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=detect-links.d.ts.map