import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const annotateTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            entityName: {
                type: string;
                description: string;
            };
            type: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                description: string;
            };
            projectId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=annotate.d.ts.map