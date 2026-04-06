import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const addKnowledgeTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            name: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            type: {
                type: string;
                description: string;
            };
            relatedTo: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            project: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    handler(args: Record<string, unknown>, client: CortexClient, detected: DetectedProject | null): Promise<string>;
};
//# sourceMappingURL=add-knowledge.d.ts.map