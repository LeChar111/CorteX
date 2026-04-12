---
name: cortex-backup
description: Exporte la base de connaissance CorteX (projets, repos, graphe) et commit/pushe un snapshot horodaté sur la branche "backup" (append-only, jamais de code).
trigger: /cortex-backup
---

# /cortex-backup

Sauvegarde versionnée **append-only** de la base de connaissance CorteX. Appelle `GET /api/export` (snapshot JSON : projects, repos, graph nodes, graph edges), écrit sur la branche **`backup`** du repo cortex et push. Chaque exécution ajoute un nouveau snapshot horodaté à l'historique, **accompagné d'un sidecar `.meta.md`** décrivant son contenu.

**Contenu sauvegardé** : uniquement la KB (graphes, entités, projets, repos). **Pas de code source**. La branche `backup` est orpheline, isolée de `main`.

## Usage

```
/cortex-backup                              # branche par défaut: backup, description auto
/cortex-backup "after big refactor scan"    # description custom (affichée par /cortex-sync)
/cortex-backup --no-push                    # commit local, pas de push
/cortex-backup --branch <name>              # branche custom (rarement utile)
/cortex-backup --repo <path>                # override du repo cible
```

## Préconditions

- Stack CorteX lancé — API sur `http://localhost:3100`.
- Repo cortex accessible (défaut `~/Documents/PROJECTS/cortex`).
- `git push` possible (remote `origin` + credentials).

## Étapes

1. **Paramètres**
   ```bash
   REPO="${REPO_OVERRIDE:-$HOME/Documents/PROJECTS/cortex}"
   BRANCH="${BRANCH_ARG:-backup}"
   API="${CORTEX_API_URL:-http://localhost:3100}"
   KEY="${CORTEX_API_KEY:-dev-key-1}"
   TS=$(date -u +"%Y-%m-%dT%H-%M-%SZ")
   LABEL="${USER_LABEL:-}"   # description optionnelle passée en argument
   ```

2. **Prérequis**
   - `test -d "$REPO/.git"` sinon stop.
   - Working tree clean — sinon demander à l'utilisateur (jamais de stash silencieux).
   - API joignable (`/api/health` → 200), sinon suggérer `make dev`.

3. **Mémoriser la branche courante** : `ORIG_BRANCH=$(git -C "$REPO" rev-parse --abbrev-ref HEAD)`.

4. **Fetch + checkout branche `backup`**
   ```bash
   git -C "$REPO" fetch origin "$BRANCH" 2>/dev/null || true
   if git -C "$REPO" show-ref --verify --quiet "refs/heads/$BRANCH"; then
     git -C "$REPO" checkout "$BRANCH"
     git -C "$REPO" pull --ff-only origin "$BRANCH" 2>/dev/null || true
   elif git -C "$REPO" show-ref --verify --quiet "refs/remotes/origin/$BRANCH"; then
     git -C "$REPO" checkout -b "$BRANCH" "origin/$BRANCH"
   else
     # 1ère fois → branche orpheline, isolée du code
     git -C "$REPO" checkout --orphan "$BRANCH"
     git -C "$REPO" rm -rf . >/dev/null 2>&1 || true
   fi
   ```
   > En cas d'erreur ultérieure, **toujours** revenir sur `$ORIG_BRANCH` avant de remonter.

5. **Fetch snapshot**
   ```bash
   mkdir -p "$REPO/backup/snapshots"
   OUT="$REPO/backup/cortex-kb.json"
   SNAP="$REPO/backup/snapshots/cortex-kb-$TS.json"
   META="$REPO/backup/snapshots/cortex-kb-$TS.meta.md"

   HTTP=$(curl -s -o "$OUT.tmp" -w "%{http_code}" -H "X-API-Key: $KEY" "$API/api/export")
   if [ "$HTTP" != "200" ]; then
     rm -f "$OUT.tmp"
     echo "✘ /api/export HTTP=$HTTP"
     git -C "$REPO" checkout "$ORIG_BRANCH"
     exit 1
   fi
   mv "$OUT.tmp" "$OUT"
   cp "$OUT" "$SNAP"
   ```

6. **Générer les métadonnées sidecar** (`.meta.md` par snapshot + README.md global)

   Le `.meta.md` est **la description courte** qui permet à `/cortex-sync` d'identifier chaque backup sans parser le JSON complet.

   ```bash
   python3 - <<PY
   import json, os, hashlib
   d=json.load(open("$OUT"))
   projs=d.get("cortex",{}).get("projects",[])
   nodes=d.get("graph",{}).get("nodes",[])
   edges=d.get("graph",{}).get("edges",[])
   size=os.path.getsize("$OUT")
   # fingerprint stable: hash du json normalisé
   fp=hashlib.sha256(json.dumps(d, sort_keys=True, separators=(",",":")).encode()).hexdigest()[:12]
   label = os.environ.get("LABEL","").strip() or "snapshot automatique"

   # Sidecar par snapshot
   meta_lines=[
     "---",
     f"snapshot: cortex-kb-$TS",
     f"timestamp: {d.get('exportedAt')}",
     f"label: {label}",
     f"fingerprint: {fp}",
     f"projects: {len(projs)}",
     f"nodes: {len(nodes)}",
     f"edges: {len(edges)}",
     f"size_bytes: {size}",
     "---","",
     f"# Snapshot {TS[:10]} — {label}",
     "",
     f"- **Projets** : {len(projs)} ({', '.join(p['name'] for p in projs) or '—'})",
     f"- **Nœuds / Arêtes** : {len(nodes)} / {len(edges)}",
     f"- **Taille JSON** : {size/1024:.1f} KiB",
     f"- **Fingerprint** : \`{fp}\`",
     "","## Projets","",
   ]
   for p in projs:
     desc=(p.get('description') or '')[:140]
     meta_lines.append(f"- **{p['name']}** ({len(p.get('repos',[]))} repos) — {desc}")
   open("$META","w").write("\n".join(meta_lines)+"\n")

   # README global mis à jour (liste de tous les snapshots existants scannée plus bas par bash)
   print(fp)
   PY
   ```

   Puis on régénère `backup/README.md` en listant tous les snapshots + meta :
   ```bash
   python3 - <<'PY'
   import os, re, json
   root=os.path.expanduser("$REPO")+"/backup"
   snaps_dir=os.path.join(root,"snapshots")
   entries=[]
   for f in sorted(os.listdir(snaps_dir)):
     if not f.endswith(".meta.md"): continue
     path=os.path.join(snaps_dir,f)
     fm={}
     with open(path) as fp:
       lines=fp.readlines()
     if lines and lines[0].strip()=="---":
       for ln in lines[1:]:
         if ln.strip()=="---": break
         if ":" in ln:
           k,v=ln.split(":",1); fm[k.strip()]=v.strip()
     entries.append(fm)
   out=["# CorteX KB Backups (branche `backup`)","",
        "Branche orpheline append-only. Contient uniquement la KB (projets, repos, graphe).",
        "Générée par `/cortex-backup`, restaurée par `/cortex-sync`.","",
        f"**{len(entries)} snapshot(s)** disponibles :","",
        "| Date | Label | Projets | Nœuds | Arêtes | Fingerprint |",
        "|------|-------|---------|-------|--------|-------------|"]
   for e in reversed(entries):  # plus récent d'abord
     out.append(f"| {e.get('timestamp','?')} | {e.get('label','?')} | {e.get('projects','?')} | {e.get('nodes','?')} | {e.get('edges','?')} | `{e.get('fingerprint','?')}` |")
   out += ["","## Fichiers","",
           "- `cortex-kb.json` — pointeur \"latest\" (écrasé à chaque sync)",
           "- `snapshots/cortex-kb-<TS>.json` — archive JSON complète",
           "- `snapshots/cortex-kb-<TS>.meta.md` — sidecar : date, label, stats, fingerprint"]
   open(os.path.join(root,"README.md"),"w").write("\n".join(out)+"\n")
   PY
   ```

7. **Commit** (stage uniquement `backup/`)
   ```bash
   git -C "$REPO" add backup/
   if git -C "$REPO" diff --cached --quiet; then
     echo "ℹ Snapshot identique au précédent — pas de commit."
   else
     MSG="chore(kb): snapshot @ $TS"
     [ -n "$LABEL" ] && MSG="$MSG — $LABEL"
     git -C "$REPO" commit -m "$MSG"
   fi
   ```

8. **Push** (sauf `--no-push`)
   ```bash
   if ! git -C "$REPO" push -u origin "$BRANCH"; then
     echo "✘ push rejeté — diagnostic : git -C $REPO pull --ff-only origin $BRANCH"
     git -C "$REPO" checkout "$ORIG_BRANCH"
     exit 1
   fi
   ```

9. **Retour sur branche d'origine** : `git -C "$REPO" checkout "$ORIG_BRANCH"` (toujours, succès ou échec).

10. **Résumé final**
    ```
    ✔ Snapshot       → backup/snapshots/cortex-kb-<TS>.json
    ✔ Description    → "<label>" (fingerprint: <fp>)
    ✔ Projets/Nœuds  → <N>/<M>
    ✔ Commit + push  → origin/backup
    ↩ Retour branche → <ORIG_BRANCH>
    ```

## Règles

- **Append-only** : pas de `--force`, `rebase`, `reset --hard`. Push rejeté → `pull --ff-only` puis retry, jamais d'écrasement.
- **KB only** : seul `backup/` est versionné. Branche orpheline → aucun fichier de code.
- **Stash interdit sans consentement** : si working tree sale, demander à l'utilisateur.
- **Rollback garanti** : toute erreur après checkout → retour `$ORIG_BRANCH` avant de remonter.
- **Label visible** : la description (si fournie) est stockée dans le sidecar `.meta.md` ET dans le message de commit — `/cortex-sync` la retrouve.
- **Idempotent** : snapshot inchangé → pas de commit vide.
