export interface ScanOptions {
    projectId: string;
    projectName: string;
    repoId: string;
    repoName: string;
    branch: string;
    sourcePath: string;
    techStack: string[];
    scanJobId: string;
}
export interface ScanResult {
    filesProcessed: number;
    nodesExtracted: number;
    edgesExtracted: number;
    communitiesDetected: number;
    nodesImported: number;
    edgesImported: number;
}
export declare function scanRepo(options: ScanOptions): Promise<ScanResult>;
//# sourceMappingURL=pipeline.d.ts.map