import { readFile } from 'node:fs/promises';
import { getDb } from '@cortex/db';
import type { NewGraphNode, NewGraphEdge, NewGraphCommunity } from '@cortex/db';
import {
  upsertGraphNodes,
  insertGraphEdges,
  upsertGraphCommunities,
  deleteGraphDataForRepo,
} from '@cortex/db';

// ─── Graphify JSON interfaces ───────────────────────────────────────────────

/** A node in the NetworkX node-link JSON format produced by graphify */
interface GraphifyNode {
  id: string;
  label: string;
  type: string;
  file_type?: string;
  source_file?: string;
  source_location?: string;
  community?: number;
  project_id?: string;
  repo_id?: string;
  project_name?: string;
  repo_name?: string;
  [key: string]: unknown;
}

/** A link (edge) in the NetworkX node-link JSON format */
interface GraphifyLink {
  source: string;
  target: string;
  _src?: string;
  _tgt?: string;
  relation: string;
  confidence?: string;
  confidence_score?: string | null;
  weight?: number | string | null;
  source_file?: string;
  [key: string]: unknown;
}

/** The top-level structure of graph.json */
interface GraphifyGraphJSON {
  nodes: GraphifyNode[];
  links: GraphifyLink[];
}

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

// ─── Helpers ────────────────────────────────────────────────────────────────

const STANDARD_NODE_FIELDS = new Set([
  'id',
  'label',
  'type',
  'file_type',
  'source_file',
  'source_location',
  'community',
  'project_id',
  'repo_id',
  'project_name',
  'repo_name',
]);

const STANDARD_LINK_FIELDS = new Set([
  'source',
  'target',
  '_src',
  '_tgt',
  'relation',
  'confidence',
  'confidence_score',
  'weight',
  'source_file',
]);

/**
 * Infer node type from label, file extension, and relations.
 * graphify's extract() doesn't emit a "type" field — it only outputs
 * id, label, file_type, source_file, source_location. We infer the type
 * from naming conventions.
 */
function inferNodeType(node: GraphifyNode): string {
  // If graphify already set a type, use it
  if (node.type && node.type !== 'unknown') return node.type;

  const label = node.label || '';
  const sf = node.source_file || '';

  // File-level node (label ends with file extension)
  if (/\.(ts|tsx|js|jsx|py|java|go|rb|rs|c|cpp|cs|kt|scala|php|swift|lua)$/i.test(label)) {
    return 'file';
  }

  // Function/method (label ends with "()")
  if (label.endsWith('()')) {
    // Heuristic: if label starts with uppercase, it's likely a constructor
    const name = label.slice(0, -2);
    if (/^[A-Z]/.test(name) && !name.includes('.')) return 'class';
    return 'function';
  }

  // Class/Interface (PascalCase, no parens, not a file)
  if (/^[A-Z][a-zA-Z0-9]+$/.test(label) && !label.includes('.')) {
    return 'class';
  }

  // Interface naming patterns
  if (/^I[A-Z]/.test(label) || label.endsWith('Interface') || label.endsWith('Type')) {
    return 'interface';
  }

  // Hook (React hook pattern)
  if (/^use[A-Z]/.test(label)) {
    return 'function';
  }

  // Module-level identifier (camelCase)
  if (/^[a-z][a-zA-Z0-9]+$/.test(label)) {
    return 'variable';
  }

  // Fallback from source file extension
  if (sf) {
    if (/\.(test|spec)\.(ts|tsx|js|jsx)$/i.test(sf)) return 'test';
    if (/\.(md|mdx|txt|rst)$/i.test(sf)) return 'document';
    if (/\.(json|yaml|yml|toml|ini|env)$/i.test(sf)) return 'config';
  }

  return 'unknown';
}

/** Extract non-standard fields from a node as properties jsonb */
function extractProperties(node: GraphifyNode): Record<string, unknown> | undefined {
  const props: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node)) {
    if (!STANDARD_NODE_FIELDS.has(key)) {
      props[key] = value;
    }
  }
  return Object.keys(props).length > 0 ? props : undefined;
}

/** Extract non-standard fields from a link as properties jsonb */
function extractLinkProperties(link: GraphifyLink): Record<string, unknown> | undefined {
  const props: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(link)) {
    if (!STANDARD_LINK_FIELDS.has(key)) {
      props[key] = value;
    }
  }
  return Object.keys(props).length > 0 ? props : undefined;
}

// ─── Main importer ──────────────────────────────────────────────────────────

export async function importGraphJSON(
  graphJsonPath: string,
  scanResult: GraphifyResult,
): Promise<{ nodesImported: number; edgesImported: number; communitiesImported: number }> {
  const db = getDb();

  // 1. Read graph.json from disk
  const raw = await readFile(graphJsonPath, 'utf-8');
  const graphData: GraphifyGraphJSON = JSON.parse(raw);

  const { metadata } = scanResult;
  const projectId = metadata.project_id;
  const repoId = metadata.repo_id;

  // 2. Delete existing graph data for the repo (clean re-import)
  await deleteGraphDataForRepo(db, repoId);

  // 3. Map graphify nodes to DB rows
  const nodeIds = new Set<string>();
  const dbNodes: NewGraphNode[] = graphData.nodes.map((node) => {
    nodeIds.add(node.id);
    return {
      id: node.id,
      label: node.label,
      type: inferNodeType(node),
      fileType: node.file_type ?? null,
      sourceFile: node.source_file ?? null,
      sourceLocation: node.source_location ?? null,
      projectId: node.project_id ?? projectId,
      repoId: node.repo_id ?? repoId,
      communityId: node.community != null ? String(node.community) : null,
      properties: extractProperties(node) ?? null,
    };
  });

  // 4. Batch upsert all nodes
  if (dbNodes.length > 0) {
    await upsertGraphNodes(db, dbNodes);
  }

  // 5. Filter edges to only those where BOTH source and target exist in the node set
  const validLinks = graphData.links.filter(
    (link) => nodeIds.has(link.source) && nodeIds.has(link.target),
  );

  // 6. Batch insert edges
  const dbEdges: NewGraphEdge[] = validLinks.map((link) => ({
    sourceNodeId: link.source,
    targetNodeId: link.target,
    relation: link.relation,
    confidence: link.confidence ?? 'EXTRACTED',
    confidenceScore: link.confidence_score != null ? String(link.confidence_score) : null,
    weight: link.weight != null ? String(link.weight) : '1.0',
    sourceFile: link.source_file ?? null,
    properties: extractLinkProperties(link) ?? null,
    projectId,
  }));

  if (dbEdges.length > 0) {
    await insertGraphEdges(db, dbEdges);
  }

  // 7. Map community data to DB rows
  const communities = scanResult.communities ?? {};
  const godNodes = scanResult.god_nodes ?? [];
  const surprisingConnections = scanResult.surprising_connections ?? [];

  const dbCommunities: NewGraphCommunity[] = Object.entries(communities).map(
    ([communityIndex, community]) => ({
      id: `${projectId}:${communityIndex}`,
      communityIndex,
      projectId,
      memberCount: String(community.size),
      cohesionScore: community.cohesion != null ? String(community.cohesion) : null,
      godNodes: godNodes.filter((gn) =>
        community.members.includes(gn.id),
      ) as unknown,
      surprisingConnections: surprisingConnections.filter(
        (sc) =>
          community.members.includes(sc.source) || community.members.includes(sc.target),
      ) as unknown,
      metadata: { members: community.members } as unknown,
    }),
  );

  // 8. Upsert communities
  if (dbCommunities.length > 0) {
    await upsertGraphCommunities(db, dbCommunities);
  }

  // 9. Return counts
  return {
    nodesImported: dbNodes.length,
    edgesImported: dbEdges.length,
    communitiesImported: dbCommunities.length,
  };
}
