---
name: cortex-sync
description: Liste les backups disponibles sur la branche "backup" et restaure la KB CorteX à partir d'un snapshot choisi (via POST /api/import).
trigger: /cortex-sync
---

# /cortex-sync

Contrepartie de `/cortex-backup`. Liste tous les snapshots de la branche `backup` (avec date, label, stats, fingerprint) et permet de **restaurer** la KB CorteX à partir d'un snapshot choisi via `POST /api/import`.

## Usage

```
/cortex-sync                        # liste les snapshots disponibles, demande lequel restaurer
/cortex-sync list                   # liste uniquement, ne restaure pas
/cortex-sync latest                 # restaure directement le plus récent
/cortex-sync <fingerprint>          # restaure le snapshot dont le fingerprint correspond
/cortex-sync <timestamp>            # restaure le snapshot horodaté (format: YYYY-MM-DDTHH-MM-SSZ)
/cortex-sync --dry-run              # analyse et affiche ce qui serait restauré, sans appeler /api/import
/cortex-sync --repo <path>          # override du repo cortex local
```

## Préconditions

- Repo cortex cloné localement, branche `backup` accessible (au moins sur origin).
- Stack CorteX lancé — API sur `http://localhost:3100` (sauf pour `list` / `--dry-run`).

## Étapes

1. **Paramètres**
   ```bash
   REPO="${REPO_OVERRIDE:-$HOME/Documents/PROJECTS/cortex}"
   BRANCH="backup"
   API="${CORTEX_API_URL:-http://localhost:3100}"
   KEY="${CORTEX_API_KEY:-dev-key-1}"
   ORIG_BRANCH=$(git -C "$REPO" rev-parse --abbrev-ref HEAD)
   ```

2. **Accéder à la branche `backup` sans la checkouter** (préserve le working tree)

   Plutôt que `git checkout backup`, on **lit directement les fichiers du tree** de la branche via `git show` — aucun switch, aucun risque sur le working tree courant.

   ```bash
   # Assure qu'on a les dernières refs
   git -C "$REPO" fetch origin "$BRANCH" 2>/dev/null || true

   # Résoudre la ref à lire (locale si elle existe, sinon remote)
   if git -C "$REPO" show-ref --verify --quiet "refs/heads/$BRANCH"; then
     REF="$BRANCH"
   elif git -C "$REPO" show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
     REF="origin/$BRANCH"
   else
     echo "✘ Aucune branche 'backup' trouvée. Lance d'abord /cortex-backup."
     exit 1
   fi
   ```

3. **Lister tous les snapshots disponibles** (via `git ls-tree` + lecture des sidecars `.meta.md`)

   ```bash
   # Tous les meta.md sur la branche backup
   SNAP_FILES=$(git -C "$REPO" ls-tree -r --name-only "$REF" -- backup/snapshots/ 2>/dev/null | grep '\.meta\.md$' | sort)

   if [ -z "$SNAP_FILES" ]; then
     echo "✘ Aucun snapshot sur la branche '$BRANCH'."
     exit 1
   fi

   # Parser chaque frontmatter YAML pour afficher la liste
   python3 - <<PY
   import subprocess
   files="""$SNAP_FILES""".strip().split("\n")
   rows=[]
   for f in files:
     content=subprocess.check_output(["git","-C","$REPO","show","$REF:"+f]).decode()
     fm={}
     lines=content.split("\n")
     if lines and lines[0].strip()=="---":
       for ln in lines[1:]:
         if ln.strip()=="---": break
         if ":" in ln:
           k,v=ln.split(":",1); fm[k.strip()]=v.strip()
     fm["_file"]=f
     rows.append(fm)
   # Plus récent d'abord
   rows.sort(key=lambda r: r.get("timestamp",""), reverse=True)
   print(f"\n{len(rows)} snapshot(s) sur origin/$BRANCH :\n")
   print(f"{'#':>3}  {'Date (UTC)':<20} {'Fingerprint':<14} {'Proj':>4} {'Nodes':>6} {'Edges':>6}  Label")
   print("-"*100)
   for i,r in enumerate(rows):
     ts=r.get("timestamp","?")[:19].replace("T"," ")
     print(f"{i+1:>3}  {ts:<20} {r.get('fingerprint','?'):<14} {r.get('projects','?'):>4} {r.get('nodes','?'):>6} {r.get('edges','?'):>6}  {r.get('label','')}")
   PY
   ```

4. **Brancher selon la commande** :

   ### `list` (ou pas d'arg → on demande)
   Afficher la liste (étape 3) puis **demander à l'utilisateur** lequel restaurer (ou annuler). Si simplement `list` → stop.

   ### `latest`
   Sélectionner la 1ère ligne (plus récent). Continuer à l'étape 5 avec ce snapshot.

   ### `<fingerprint>` ou `<timestamp>`
   Chercher dans la liste. Si match unique → aller étape 5. Si ambigu ou absent → message clair + liste.

5. **Extraire le snapshot JSON choisi** dans un fichier temporaire
   ```bash
   META_FILE="backup/snapshots/cortex-kb-<TS>.meta.md"   # selon la sélection
   JSON_FILE="${META_FILE%.meta.md}.json"
   TMP=$(mktemp /tmp/cortex-restore-XXXXXX.json)
   git -C "$REPO" show "$REF:$JSON_FILE" > "$TMP"
   echo "Snapshot extrait : $TMP ($(wc -c < "$TMP") octets)"
   ```

6. **Dry-run** (si `--dry-run`) : afficher les stats du JSON et **sortir sans importer**.
   ```bash
   python3 -c "
   import json
   d=json.load(open('$TMP'))
   p=d.get('cortex',{}).get('projects',[])
   g=d.get('graph',{})
   print(f'Projects: {len(p)}')
   for x in p: print(f'  - {x[\"name\"]} ({len(x.get(\"repos\",[]))} repos)')
   print(f'Nodes: {len(g.get(\"nodes\",[]))}, Edges: {len(g.get(\"edges\",[]))}')
   "
   rm -f "$TMP"
   ```

7. **Confirmer avant restauration** (destructif au sens fonctionnel : écrit dans la DB).

   Afficher :
   - Le label + date du snapshot cible.
   - L'état actuel de la KB (via `GET /api/projects` → nombre actuel).
   - Avertir que `POST /api/import` **crée** les projets/repos mais **n'écrase pas** ceux existants (les conflits sont skippés côté API).

   Attendre le "oui" explicite de l'utilisateur.

8. **Restaurer** via `POST /api/import`
   ```bash
   HTTP=$(curl -s -o /tmp/cortex-import.out -w "%{http_code}" \
     -X POST "$API/api/import" \
     -H "X-API-Key: $KEY" \
     -H "Content-Type: application/json" \
     --data-binary "@$TMP")
   cat /tmp/cortex-import.out
   rm -f "$TMP"
   [ "$HTTP" = "200" ] || { echo "✘ /api/import HTTP=$HTTP"; exit 1; }
   ```

9. **Résumé final**
   ```
   ✔ Snapshot restauré
     · date        : <timestamp>
     · label       : <label>
     · fingerprint : <fp>
   ✔ Import stats  : N projets · M repos · X nœuds · Y arêtes
   ↩ Branche courante inchangée : <ORIG_BRANCH>
   ```

## Règles

- **Pas de checkout de la branche `backup`** : on utilise `git show "$REF:path"` pour lire les fichiers — le working tree de l'utilisateur reste intact.
- **Confirmation obligatoire** avant `POST /api/import` — l'import modifie la DB (ajoute projets/repos). Jamais en mode silencieux.
- **L'import est additif** côté API (les doublons par `name` sont skippés). Pour un reset complet → l'utilisateur doit vider la DB manuellement avant (hors scope de cette skill).
- **Sélection** : si l'utilisateur passe un fingerprint partiel ambigu, lister les matches et redemander. Jamais deviner.
- Le JSON extrait est écrit dans `/tmp/` et supprimé après usage — pas de trace locale.
