import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const archCheckTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            filePath: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=arch-check.d.ts.map