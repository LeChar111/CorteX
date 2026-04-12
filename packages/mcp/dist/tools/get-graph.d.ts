import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const getGraphTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            entityName: {
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
    handler(args: Record<string, unknown>, client: CortexClient, _detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=get-graph.d.ts.map