"""CLI entry point for the cortex-graphify bridge.

Called by Node.js scan worker as subprocess:
    cortex-scan --source /path/to/repo --output /tmp/graph.json ...

Outputs JSON result to stdout. Progress messages go to stderr.
"""

import argparse
import json
import os
import sys

from cortex_bridge.scanner import scan_directory


def main():
    parser = argparse.ArgumentParser(description="Cortex graphify bridge scanner")
    parser.add_argument("--source", required=True, help="Path to repository to scan")
    parser.add_argument("--output", required=True, help="Path for output graph.json")
    parser.add_argument("--project-id", default="", help="Cortex project UUID")
    parser.add_argument("--project-name", default="", help="Cortex project name")
    parser.add_argument("--repo-id", default="", help="Cortex repo UUID")
    parser.add_argument("--repo-name", default="", help="Cortex repo name")
    parser.add_argument("--no-semantic", action="store_true",
                        help="Disable Claude CLI semantic analysis")

    args = parser.parse_args()

    if args.no_semantic:
        os.environ["CORTEX_SEMANTIC_ANALYSIS"] = "false"

    try:
        # Redirect stdout to stderr during scanning so graphify's
        # progress messages don't pollute the JSON output on stdout.
        real_stdout = sys.stdout
        sys.stdout = sys.stderr

        result = scan_directory(
            source_path=args.source,
            output_path=args.output,
            project_id=args.project_id,
            project_name=args.project_name,
            repo_id=args.repo_id,
            repo_name=args.repo_name,
        )

        # Restore stdout for the JSON result
        sys.stdout = real_stdout
        print(json.dumps(result))
        sys.exit(0)
    except Exception as e:
        sys.stdout = sys.__stdout__
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
