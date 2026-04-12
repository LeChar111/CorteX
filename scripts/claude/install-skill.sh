#!/usr/bin/env bash
# Install /cortex, /cortex-install, /cortex-backup, /cortex-sync Claude Code skills globally.
# Idempotent: safe to rerun.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_SRC="$SCRIPT_DIR/skills"

CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
SKILLS_DEST="$CLAUDE_HOME/skills"
CLAUDE_MD="$CLAUDE_HOME/CLAUDE.md"

mkdir -p "$SKILLS_DEST"
mkdir -p "$CLAUDE_HOME"
touch "$CLAUDE_MD"

for skill in cortex cortex-install cortex-backup cortex-sync; do
  src="$SKILLS_SRC/$skill/SKILL.md"
  dest_dir="$SKILLS_DEST/$skill"
  if [ ! -f "$src" ]; then
    echo "✘  Source skill missing: $src" >&2
    exit 1
  fi
  mkdir -p "$dest_dir"
  cp "$src" "$dest_dir/SKILL.md"
  echo "✔  Skill installed: $dest_dir/SKILL.md"
done

# Patch global CLAUDE.md between markers (idempotent)
BEGIN_MARKER="<!-- cortex-skill:start -->"
END_MARKER="<!-- cortex-skill:end -->"

BLOCK=$(cat <<EOF
$BEGIN_MARKER
# cortex
- **cortex** (\`~/.claude/skills/cortex/SKILL.md\`) — analyse le dossier courant avec CorteX (détection + ajout à un projet ou création + scan). Trigger: \`/cortex\`
- **cortex-install** (\`~/.claude/skills/cortex-install/SKILL.md\`) — finalise l'installation CorteX côté Claude Code (vérifie MCP, API, skill). Trigger: \`/cortex-install\`
- **cortex-backup** (\`~/.claude/skills/cortex-backup/SKILL.md\`) — exporte la KB et commit/pushe un snapshot horodaté sur la branche \`backup\` (append-only). Trigger: \`/cortex-backup\`
- **cortex-sync** (\`~/.claude/skills/cortex-sync/SKILL.md\`) — liste les snapshots de la branche \`backup\` et restaure la KB à partir d'un snapshot choisi. Trigger: \`/cortex-sync\`

When the user types \`/cortex\` (with or without a path, e.g. \`/cortex .\`), invoke the Skill tool with \`skill: "cortex"\` before doing anything else.
When the user types \`/cortex-install\`, invoke the Skill tool with \`skill: "cortex-install"\` before doing anything else.
When the user types \`/cortex-backup\` (with optional label/flags), invoke the Skill tool with \`skill: "cortex-backup"\` before doing anything else.
When the user types \`/cortex-sync\` (with optional arg like \`list\`, \`latest\`, or a fingerprint/timestamp), invoke the Skill tool with \`skill: "cortex-sync"\` before doing anything else.
$END_MARKER
EOF
)

if grep -qF "$BEGIN_MARKER" "$CLAUDE_MD"; then
  # Portable: strip existing block, then append fresh one.
  # Avoids multi-line -v awk assignment (flaky on BSD awk / macOS).
  awk -v b="$BEGIN_MARKER" -v e="$END_MARKER" '
    BEGIN { inblk=0 }
    {
      if ($0 == b) { inblk=1; next }
      if (inblk && $0 == e) { inblk=0; next }
      if (!inblk) print
    }
  ' "$CLAUDE_MD" > "$CLAUDE_MD.tmp" && mv "$CLAUDE_MD.tmp" "$CLAUDE_MD"
  printf "\n%s\n" "$BLOCK" >> "$CLAUDE_MD"
  echo "✔  CLAUDE.md cortex block updated"
else
  printf "\n%s\n" "$BLOCK" >> "$CLAUDE_MD"
  echo "✔  CLAUDE.md cortex block appended"
fi
