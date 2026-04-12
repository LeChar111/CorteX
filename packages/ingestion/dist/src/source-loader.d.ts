export interface SourceFile {
    relativePath: string;
    absolutePath: string;
    content: string;
    hash: string;
    size: number;
}
export interface DiscoverOptions {
    ignorePatterns?: string[];
    maxFileSizeKb?: number;
    extensions?: string[];
}
/**
 * Check if a filePath should be ignored based on the given patterns.
 * Patterns like "node_modules/**" are stripped to "node_modules" and used as prefixes.
 */
export declare function shouldIgnore(filePath: string, patterns: string[]): boolean;
/**
 * Recursively discover source files under rootPath.
 */
export declare function discoverFiles(rootPath: string, options?: DiscoverOptions): Promise<SourceFile[]>;
/**
 * Build an authenticated clone URL by injecting credentials from .cred.env.
 *
 * Provider credential mapping:
 *   bitbucket  → BITBUCKET_APP_PASSWORD + BITBUCKET_USERNAME (Basic auth)
 *                Falls back to SSH if only ATATT-style API tokens are available
 *   github     → GITHUB_TOKEN                              (token@ auth)
 *   gitlab     → GITLAB_TOKEN                              (oauth2:token@ auth)
 *   local      → returns cloneUrl as-is (it's a local path)
 *
 * If no credentials are found, falls back to SSH for known providers.
 */
export declare function buildAuthenticatedUrl(cloneUrl: string, provider: string): Promise<string>;
/**
 * Clone a repo or pull the latest changes if already cloned.
 */
export declare function cloneOrPull(cloneUrl: string, targetPath: string, branch?: string): Promise<void>;
/**
 * Clone or pull a repo using a persistent cache at /tmp/cortex-repos/<slug>.
 * Returns the path to the cached repo directory.
 */
export declare function cloneOrPullCached(cloneUrl: string, repoSlug: string, branch: string): Promise<string>;
/**
 * Get files changed since a given commit using git diff.
 */
export declare function getChangedFiles(repoPath: string, sinceCommit: string): Promise<string[]>;
/**
 * Get the HEAD commit hash for a repository.
 */
export declare function getHeadCommit(repoPath: string): Promise<string>;
//# sourceMappingURL=source-loader.d.ts.map