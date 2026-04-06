import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const listProjectsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
    handler(_args: Record<string, unknown>, client: CortexClient, _detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=list-projects.d.ts.map