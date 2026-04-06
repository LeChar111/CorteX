import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const scanTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            project: {
                type: string;
                description: string;
            };
            repo: {
                type: string;
                description: string;
            };
            branch: {
                type: string;
                description: string;
            };
            mode: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=scan.d.ts.map