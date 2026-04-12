/** Community entry from the scan result */
interface GraphifyCommunity {
    members: string[];
    size: number;
    cohesion: number;
}
/** God node entry from the scan result */
interface GraphifyGodNode {
    id: string;
    label: string;
    edges: number;
}
/** Surprising connection entry from the scan result */
interface GraphifySurprisingConnection {
    source: string;
    target: string;
    note?: string;
}
/** The full scan result JSON from cortex-scan CLI stdout */
export interface GraphifyResult {
    graph_path: string;
    stats: {
        total_files: number;
        nodes: number;
        edges: number;
        communities: number;
    };
    communities: Record<string, GraphifyCommunity>;
    god_nodes: GraphifyGodNode[];
    surprising_connections: GraphifySurprisingConnection[];
    metadata: {
        project_id: string;
        project_name: string;
        repo_id: string;
        repo_name: string;
    };
}
export declare function importGraphJSON(graphJsonPath: string, scanResult: GraphifyResult): Promise<{
    nodesImported: number;
    edgesImported: number;
    communitiesImported: number;
}>;
export {};
//# sourceMappingURL=graphify-importer.d.ts.map