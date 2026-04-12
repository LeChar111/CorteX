import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const getContextTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            cwd: {
                type: string;
                description: string;
            };
            focus: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=get-context.d.ts.map