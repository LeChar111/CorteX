# CorteX

Knowledge Hub for Multi-Project AI Teams.

CorteX scanne, indexe et connecte le code de vos repositories pour construire un **graphe de connaissances** interrogeable via une API REST, un dashboard web et le protocole MCP (Claude Code).

## Principe

```
Repositories  ──>  Tree-sitter + LLM  ──>  Knowledge Graph  ──>  Dashboard / API / MCP
     │                    │                        │
  Clone & scan      Parse AST +             LightRAG + pgvector
  (Git, GitHub)     Extract (Claude)        (PostgreSQL)
```

1. **Scan** — Clone vos repos, parse le code avec Tree-sitter, extrait les entités via Claude Haiku
2. **Index** — Injecte dans LightRAG (graphe) et PostgreSQL + pgvector (recherche sémantique)
3. **Query** — Interrogez en langage naturel, visualisez le graphe, analysez la conformité architecturale

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, Vite, Tailwind CSS |
| API | Hono, Node.js 22, WebSocket |
| Database | PostgreSQL 16 + pgvector (Drizzle ORM) |
| Queue | Redis + BullMQ |
| Parsing | Tree-sitter (TypeScript, JavaScript, Python, Go, C/C++) |
| Extraction | Claude Haiku (Anthropic SDK) |
| Graphe | LightRAG |
| Embeddings / LLM local | Ollama (nomic-embed-text, qwen2.5:7b) |
| MCP | Model Context Protocol SDK |

## Installation

### Prerequis

- Node.js 22+, pnpm
- Docker & Docker Compose
- Redis
- GPU NVIDIA recommande (fonctionne aussi en CPU)

> **Windows** : installez [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) d'abord (`wsl --install`), puis lancez les commandes depuis Ubuntu.

### Setup rapide

```bash
git clone <repo-url> && cd CorteX

# Installation complete (deps + Docker + migrations + modeles Ollama + MCP + skills Claude Code)
make install

# Lancer le stack de dev (foreground, UI colorée)
make dev

# OU en mode silencieux (détaché, terminal libre)
make cortex-bg
```

Le dashboard est sur `http://localhost:5173`, l'API sur `http://localhost:3100`.

Depuis Claude Code : `/cortex-install` pour finaliser + `/cortex .` pour enregistrer le repo courant.

### Setup alternatif (script interactif)

```bash
./setup.sh
```

Detecte automatiquement votre plateforme (Linux/macOS/WSL2), installe les dependances manquantes, configure Docker avec le bon profil GPU et pull les modeles Ollama.

Options : `--yes` (skip prompts), `--skip-models` (skip downloads), `--dev` (lance les serveurs apres setup).

### Commandes Make

| Commande | Description |
|----------|-------------|
| `make install` | Setup complet (deps + infra + migrations + seed + modèles + MCP Claude + skills) |
| `make dev` | Lancer API + Dashboard + Workers en **foreground** (UI colorée) |
| `make cortex-bg` | **Mode silencieux** — stack détaché, logs dans `logs/*.log`, rend la main |
| `make cortex-stop` | Arrête les serveurs Node lancés par `cortex-bg` |
| `make cortex-status` | État compact : PIDs background + Docker + health API |
| `make infra` | Docker uniquement (PostgreSQL, LightRAG, Ollama) |
| `make status` | Etat de tous les services |
| `make clean` | Stop Docker + supprime les builds |
| `make reset` | Stop Docker + supprime volumes + builds |
| `make uninstall` | Supprime tout (containers, volumes, images, node_modules, .env) |

### Mode silencieux (background)

Pour développer en gardant le terminal libre :

```bash
make cortex-bg        # Démarre tout en arrière-plan, attend que l'API soit healthy
make cortex-status    # Vérifie l'état
tail -f logs/api.log  # Suit les logs d'un service spécifique
make cortex-stop      # Arrête proprement (kill des PIDs trackés + children)
```

Les PIDs sont stockés dans `logs/{api,dashboard,workers}.pid`. Les logs sont ignorés par git.

## Setup depuis le Dashboard

Une fois `make dev` lance :

1. **Settings** (`/settings`) — Configurez vos credentials (cle API Anthropic, tokens GitHub) et verifiez l'etat des services

2. **New Project** (`/projects/new`) — Creez un projet avec un nom, une description et les URLs de vos repositories

3. **Infrastructure** (`/infra`) — Supervisez les services Docker, consultez les modeles Ollama charges, gerez les jobs de scan

4. **Pipeline** (`/pipeline`) — Lancez un scan sur vos repos et suivez la progression (parsing, extraction LLM, ingestion)

5. **Graph** (`/graph`) — Explorez le graphe de connaissances, naviguez entre entites et relations

6. **Search** (`/search`) — Interrogez votre codebase en langage naturel

## Structure

```
packages/
  dashboard/    Frontend React (Vite)
  serving/      API REST + WebSocket (Hono)
  ingestion/    Workers de scan et extraction
  db/           Schema et migrations (Drizzle + PostgreSQL)
  shared/       Types et utilitaires partages
  mcp/          Serveur MCP pour Claude Code
config/
  projects.json Configuration des projets a scanner
docker/
  lightrag/     Image Docker custom LightRAG
```

## Architecture

```
                +-----------------+
                |   Dashboard     |  React 19 + Vite + Tailwind
                |   :5173         |
                +--------+--------+
                         |
                +--------v--------+
                |   Serving API   |  Hono + WebSocket
                |     :3100       |
                +--+---------+----+
                   |         |
          +--------v--+  +---v-----------+
          | PostgreSQL |  |    Redis      |
          |  pgvector  |  |   BullMQ      |
          |   :5432    |  |   :6379       |
          +--------+---+  +---+-----------+
                   |          |
                +--v----------v---+
                | Ingestion Worker |  Tree-sitter + LLM extraction
                +---------+-------+
                          |
                +---------v-------+
                |    LightRAG     |  Graph RAG engine
                |     :9621       |
                +---------+-------+
                          |
                +---------v-------+
                |     Ollama      |  Local LLM + Embeddings
                |    :11434       |
                +-----------------+

                +-----------------+
                |    MCP Server   |  12 tools via stdio
                |  (Claude Code)  |
                +-----------------+
```

## MCP Integration

Le serveur MCP est **enregistré automatiquement** par `make install` (cible `install-cli`). Pour le réenregistrer manuellement :

```bash
make install-cli     # scope user → disponible dans tous les projets
make uninstall-cli   # désinscription
```

12 tools disponibles : `query`, `get-context`, `get-entity`, `get-graph`, `search`, `list_projects`, `scan`, `ingest`, `add-knowledge`, `link`, `sync-status`, `history`.

## Claude Code — Slash commands intégrées

`make install` installe aussi **4 skills globales** dans `~/.claude/skills/` (via `make install-skill`). Utilisables dans n'importe quel projet Claude Code :

| Commande | Description |
|----------|-------------|
| `/cortex-install` | Vérifie que tout est opérationnel (MCP, API, skills, CLAUDE.md), guide le premier scan |
| `/cortex [path]` | Détecte le repo courant, propose de l'ajouter à un projet existant ou d'en créer un, puis lance le scan |
| `/cortex-backup [label]` | Exporte toute la KB et pushe un snapshot horodaté sur la branche orpheline `backup` (append-only) |
| `/cortex-sync [list\|latest\|<fingerprint>]` | Liste les snapshots de la branche `backup` et restaure la KB depuis l'un d'entre eux |

### Workflow typique

```bash
# Sur chaque machine (une fois)
cd ~/Documents/PROJECTS/cortex && make install && make cortex-bg

# Dans Claude Code, depuis n'importe quel projet
/cortex-install                                       # vérification
/cortex .                                             # enregistre le repo courant + scan
/cortex-backup "après gros scan v2"                   # sauvegarde versionnée
/cortex-sync list                                     # voit l'historique
/cortex-sync <fingerprint>                            # restaure un snapshot précis
```

### Comment sont stockés les backups

La branche `backup` est **orpheline** (isolée de `main`, sans code). Elle contient uniquement :

```
backup/
├── README.md                              # tableau Markdown des snapshots
├── cortex-kb.json                         # pointeur "latest" (toujours à jour)
└── snapshots/
    ├── cortex-kb-<TS>.json                # archive JSON complète
    └── cortex-kb-<TS>.meta.md             # sidecar : YAML frontmatter
                                           #   (timestamp, label, fingerprint,
                                           #    projets, nœuds, arêtes, taille)
```

Chaque snapshot a un **fingerprint SHA-256** (12 hex) stable — identifiant canonique pour le restore. `/cortex-sync` lit la branche via `git show` (pas de checkout → working tree intact).

### Désinstallation

```bash
make uninstall-cli      # retire le serveur MCP
make uninstall-skill    # retire les 4 skills + nettoie ~/.claude/CLAUDE.md
```

## Licence

MIT <3
