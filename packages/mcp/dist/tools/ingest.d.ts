import type { CortexClient } from '../client.js';
import type { DetectedProject } from '../detector.js';
export declare const ingestTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            content: {
                type: string;
                description: string;
            };
            filePath: {
                type: string;
                description: string;
            };
            language: {
                type: string;
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
//# sourceMappingURL=ingest.d.ts.map