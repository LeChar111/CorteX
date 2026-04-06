export interface DetectedProject {
    projectId: string;
    repoId: string;
    projectName: string;
    repoName: string;
}
export declare function normalizeGitUrl(url: string): string;
export declare function detectProject(cwd: string, apiBaseUrl: string, apiKey: string): Promise<DetectedProject | null>;
//# sourceMappingURL=detector.d.ts.map