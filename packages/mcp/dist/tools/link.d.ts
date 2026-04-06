import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const linkTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            source: {
                type: string;
                description: string;
            };
            target: {
                type: string;
                description: string;
            };
            type: {
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
    handler(args: Record<string, unknown>, client: CortexClient, _detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=link.d.ts.map