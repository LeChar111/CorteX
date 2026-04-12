import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const diffReviewTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            files: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            diff: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=diff-review.d.ts.map