import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const crossProjectQueryTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            query: {
                type: string;
                description: string;
            };
            project: {
                type: string;
                description: string;
            };
            mode: {
                type: string;
                enum: string[];
                description: string;
            };
            entity: {
                type: string;
                description: string;
            };
            depth: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=cross-project-query.d.ts.map