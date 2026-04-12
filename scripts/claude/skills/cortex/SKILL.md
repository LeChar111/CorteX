---
name: cortex
description: Analyse le dossier courant avec CorteX — détecte s'il est tracked, sinon propose de l'ajouter à un projet existant ou d'en créer un nouveau, puis déclenche le scan.
trigger: /cortex
---

# /cortex

Point d'entrée pour CorteX depuis Claude Code. Gère le cycle complet : détection → enregistrement (projet + repo) → scan.

## Usage

```
/cortex           # analyse le dossier courant (cwd)
/cortex .         # idem
/cortex <path>    # analyse un dossier spécifique
```

## Préconditions

- Stack CorteX lancé (`make dev` dans ~/Documents/PROJECTS/cortex) — API sur `http://localhost:3100`.
- Variables d'env disponibles : `CORTEX_API_URL` (défaut `http://localhost:3100`) et `CORTEX_API_KEY` (fallback `dev-key-1`).
- Le dossier cible doit être un repo git (avec `origin`).

## Étapes à exécuter

1. **Résoudre le chemin cible**
   - Si pas d'argument ou `.` → `pwd`
   - Sinon → chemin fourni (résolu en absolu)
   - Vérifier que c'est un repo git : `git -C <path> remote get-url origin`. Si KO, s'arrêter et signaler.

2. **Lire l'URL remote et la branche courante**
   ```bash
   REMOTE=$(git -C <path> remote get-url origin)
   BRANCH=$(git -C <path> rev-parse --abbrev-ref HEAD)
   # Portable BSD/GNU: strip trailing .git then take final path segment
   NAME_NO_GIT="${REMOTE%.git}"
   REPO_NAME="${NAME_NO_GIT##*/}"
   ```

3. **Vérifier si le repo est déjà tracked** via l'outil MCP `mcp__cortex__list_projects`. Normaliser les URLs (retirer `git@`, `https://`, `.git`, remplacer `:` par `/`) et comparer avec chaque repo listé.

4. **Brancher sur un des 3 cas :**

   ### A. Déjà tracked
   Afficher le projet/repo détecté puis demander à l'utilisateur :
   - Lancer un scan maintenant ? (mode `full` ou `diff`)

   Si oui → `mcp__cortex__scan` avec `project`, `repo`, `branch`, `mode`.

   ### B. Non tracked, projets existants
   Lister les projets et proposer :
   1. Ajouter ce repo à un projet existant (nom au choix)
   2. Créer un nouveau projet
   3. Annuler

   **Ajout à un projet existant** — `POST /api/repos` avec :
   ```json
   {
     "projectId": "<uuid>",
     "name": "<REPO_NAME>",
     "slug": "<repo-name-kebab>",
     "cloneUrl": "<REMOTE>",
     "provider": "github|gitlab|bitbucket|local",
     "defaultBranch": "<BRANCH>",
     "techStack": []
   }
   ```
   Le provider se déduit de l'URL (`github.com` → `github`, `gitlab.*` → `gitlab`, `bitbucket.*` → `bitbucket`, sinon `local`).

   **Création d'un nouveau projet** — demander le nom + description optionnelle, puis :
   1. `POST /api/projects` avec `{ "name": "...", "description": "..." }` → récupère `id`
   2. Enchaîne avec `POST /api/repos` (voir au-dessus) en utilisant le `projectId` retourné

   ### C. Non tracked, aucun projet existant
   Proposer directement la création d'un nouveau projet (cas B.3).

5. **Après enregistrement** — déclencher un scan `full` avec `mcp__cortex__scan` sur le projet/repo fraîchement créé, en passant la branche courante.

6. **Observer la progression** — utiliser `mcp__cortex__sync_status` avec le `projectId` pour suivre le job. Donner à l'utilisateur le lien du dashboard : `http://localhost:5173/projects/<projectId>`.

## Appels curl (création projet/repo)

Utiliser `CORTEX_API_KEY` (ou `dev-key-1` en fallback) dans le header `X-API-Key`.

```bash
API=${CORTEX_API_URL:-http://localhost:3100}
KEY=${CORTEX_API_KEY:-dev-key-1}

# Créer un projet
curl -s -X POST "$API/api/projects" \
  -H "X-API-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"name":"<name>","description":"<desc>"}'

# Ajouter un repo
curl -s -X POST "$API/api/repos" \
  -H "X-API-Key: $KEY" -H "Content-Type: application/json" \
  -d '{"projectId":"<uuid>","name":"<name>","slug":"<slug>","cloneUrl":"<url>","provider":"github","defaultBranch":"<branch>"}'
```

## Règles

- **Toujours confirmer** avant de créer un projet ou d'ajouter un repo (actions persistantes côté DB).
- Pour le scan qui suit immédiatement l'enregistrement, pas besoin de reconfirmer — c'est l'intention implicite.
- En cas d'erreur API (`409` conflit, `401` auth), diagnostiquer et remonter le message.
- Si le stack n'est pas lancé (`curl` échoue), suggérer `make dev` dans `~/Documents/PROJECTS/cortex`.
- Normaliser les slugs : minuscules, tirets, pas d'espaces.
