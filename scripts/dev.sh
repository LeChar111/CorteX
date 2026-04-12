#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  CorteX — Dev launcher
#  Header permanent en haut (scroll region ANSI), logs colorés par service
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# ── Lire .env ────────────────────────────────────────────────────────────────

if [ -f .env ]; then
  while IFS='=' read -r key val; do
    key="${key%$'\r'}"
    val="${val%$'\r'}"
    [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
    export "$key"="$val"
  done < .env
fi

DASHBOARD_PORT="${VITE_PORT:-5173}"
API_PORT="${PORT:-3100}"

# ── Terminal ──────────────────────────────────────────────────────────────────

COLS=$(tput cols 2>/dev/null || echo 80)
ROWS=$(tput lines 2>/dev/null || echo 24)
HEADER_H=13  # lignes réservées pour le header

# Couleurs
R='\033[0;31m'
G='\033[0;32m'
Y='\033[1;33m'
B='\033[0;34m'
M='\033[0;35m'
C='\033[0;36m'
W='\033[0;37m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# Couleurs par service
COL_DASH="$C"    # cyan   — Dashboard
COL_API="$G"     # vert   — API
COL_WORK="$Y"    # jaune  — Workers / analyse

# ── ANSI helpers ──────────────────────────────────────────────────────────────

move()   { printf '\033[%s;%sH' "$1" "$2"; }          # move cursor row col (1-based)
save()   { printf '\033[s'; }
restore(){ printf '\033[u'; }
clear_line() { printf '\033[2K'; }
set_scroll_region() { printf '\033[%s;%sr' "$1" "$2"; }
reset_scroll()      { printf '\033[r'; }
hide_cursor()       { printf '\033[?25l'; }
show_cursor()       { printf '\033[?25h'; }
clear_screen()      { printf '\033[2J'; }

# ── Boîte utilitaire ─────────────────────────────────────────────────────────

box_line() {
  # Ligne horizontale de largeur $COLS
  local char="${1:-─}"
  printf '%s' "$(printf '%*s' "$COLS" '' | tr ' ' "$char")"
}

center() {
  local text="$1" width="${2:-$COLS}"
  # Longueur visible sans codes ANSI
  local visible
  visible=$(echo -e "$text" | sed 's/\x1b\[[0-9;]*m//g')
  local len=${#visible}
  local pad=$(( (width - len) / 2 ))
  printf '%*s%b%*s' "$pad" '' "$text" "$((width - len - pad))" ''
}

pad_right() {
  # $1 = texte, $2 = largeur cible (visible)
  local text="$1" width="$2"
  local visible
  visible=$(echo -e "$text" | sed 's/\x1b\[[0-9;]*m//g')
  local len=${#visible}
  printf '%b%*s' "$text" "$((width - len))" ''
}

# ── Dessin du header ─────────────────────────────────────────────────────────

draw_header() {
  local w=$COLS

  # ── Ligne 1 : bordure haut ────────────────────────────────────────────────
  move 1 1; clear_line
  printf "${DIM}${C}┌$(box_line '─')┐${NC}"

  # ── Ligne 2 : ASCII art CORTEX ───────────────────────────────────────────
  move 2 1; clear_line
  printf "${DIM}${C}│${NC}"
  center "${BOLD}${C} ██████╗ ██████╗ ██████╗ ████████╗███████╗██╗  ██╗${NC}" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 3 ───────────────────────────────────────────────────────────────
  move 3 1; clear_line
  printf "${DIM}${C}│${NC}"
  center "${C}██╔════╝██╔═══██╗██╔══██╗╚══██╔══╝██╔════╝╚██╗██╔╝${NC}" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 4 ───────────────────────────────────────────────────────────────
  move 4 1; clear_line
  printf "${DIM}${C}│${NC}"
  center "${C}██║     ██║   ██║██████╔╝   ██║   █████╗   ╚███╔╝ ${NC}" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 5 ───────────────────────────────────────────────────────────────
  move 5 1; clear_line
  printf "${DIM}${C}│${NC}"
  center "${C}██║     ██║   ██║██╔══██╗   ██║   ██╔══╝   ██╔██╗ ${NC}" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 6 ───────────────────────────────────────────────────────────────
  move 6 1; clear_line
  printf "${DIM}${C}│${NC}"
  center "${C}╚██████╗╚██████╔╝██║  ██║   ██║   ███████╗██╔╝ ██╗${NC}" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 7 ───────────────────────────────────────────────────────────────
  move 7 1; clear_line
  printf "${DIM}${C}│${NC}"
  center "${C} ╚═════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝${NC}" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 8 : séparateur ─────────────────────────────────────────────────
  move 8 1; clear_line
  printf "${DIM}${C}├$(box_line '─')┤${NC}"

  # ── Ligne 9 : sous-titre + URLs ──────────────────────────────────────────
  local subtitle="${DIM}Knowledge Hub for Multi-Project AI Teams${NC}"
  local dashboard_label="${BOLD}Dashboard${NC}  ${C}http://localhost:${DASHBOARD_PORT}${NC}"
  local api_label="${BOLD}API${NC}        ${C}http://localhost:${API_PORT}${NC}"

  move 9 1; clear_line
  printf "${DIM}${C}│${NC}"
  center "$subtitle" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 10 : URLs ──────────────────────────────────────────────────────
  move 10 1; clear_line
  local urls="  ${BOLD}${G}●${NC} $dashboard_label   ${BOLD}${G}●${NC} $api_label"
  printf "${DIM}${C}│${NC}"
  center "$urls" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 11 : légende des logs ──────────────────────────────────────────
  move 11 1; clear_line
  local legend="  ${COL_DASH}■ DASHBOARD${NC}  ${COL_API}■ API${NC}  ${COL_WORK}■ WORKERS${NC}"
  printf "${DIM}${C}│${NC}"
  center "$legend" $((w-0))
  printf "${DIM}${C}│${NC}"

  # ── Ligne 12 : séparateur bas ────────────────────────────────────────────
  move 12 1; clear_line
  printf "${DIM}${C}└$(box_line '─')┘${NC}"

  # ── Ligne 13 : label section logs ────────────────────────────────────────
  move 13 1; clear_line
  printf "${DIM}  Logs ↓  (Ctrl+C pour arrêter)${NC}"
}

# ── Cleanup ───────────────────────────────────────────────────────────────────

PIDS=()

cleanup() {
  trap - EXIT INT TERM
  # Tuer récursivement tous les descendants du script (pnpm, vite, tsx, esbuild, pipe_service…)
  # Les PIDs stockés dans PIDS ne couvrent que pipe_service (dernier maillon du pipeline),
  # donc on cible tout l'arbre depuis $$.
  kill_tree() {
    local parent=$1
    local child
    for child in $(pgrep -P "$parent" 2>/dev/null); do
      kill_tree "$child"
    done
    kill -TERM "$parent" 2>/dev/null || true
  }
  local pid
  for pid in $(pgrep -P $$ 2>/dev/null); do
    kill_tree "$pid"
  done
  # Grace period, puis SIGKILL sur les récalcitrants
  sleep 1
  for pid in $(pgrep -P $$ 2>/dev/null); do
    kill_tree "$pid"
    kill -KILL "$pid" 2>/dev/null || true
  done
  # Restaurer le terminal
  reset_scroll
  show_cursor
  move $ROWS 1
  printf "\n${DIM}CorteX arrêté.${NC}\n"
}

trap cleanup EXIT INT TERM

# ── Pipe logger ───────────────────────────────────────────────────────────────
# Préfixe chaque ligne avec le label coloré du service
# S'assure que le curseur reste dans la zone de scroll

pipe_service() {
  local label="$1"
  local color="$2"
  local width=9  # largeur du label

  while IFS= read -r line; do
    # Ignorer les séquences de clear screen émises par Vite etc.
    line=$(printf '%s' "$line" | sed 's/\x1b\[2J//g; s/\x1b\[H//g; s/\x1b\[1;1H//g')
    [ -z "$line" ] && continue
    printf "${color}${BOLD}[%-${width}s]${NC} %s\n" "$label" "$line"
  done
}

# ── Lancement ────────────────────────────────────────────────────────────────

main() {
  # 1. Plein écran propre
  clear_screen
  hide_cursor

  # 2. Dessiner le header fixe
  draw_header

  # 3. Définir la zone de scroll = lignes HEADER_H+1 → ROWS
  set_scroll_region $((HEADER_H + 1)) "$ROWS"

  # 4. Positionner le curseur au début de la zone de scroll
  move $((HEADER_H + 1)) 1

  # 5. Démarrer les 3 services en parallèle
  pnpm --filter @cortex/dashboard run dev 2>&1 \
    | pipe_service "DASHBOARD" "$COL_DASH" &
  PIDS+=($!)

  pnpm --filter @cortex/serving run dev 2>&1 \
    | pipe_service "API" "$COL_API" &
  PIDS+=($!)

  pnpm --filter @cortex/ingestion run dev 2>&1 \
    | pipe_service "WORKERS" "$COL_WORK" &
  PIDS+=($!)

  # 6. Attendre tous les processus
  wait
}

main
