---
name: cortex-install
description: Finalise l'installation globale de CorteX côté Claude Code — vérifie le serveur MCP, l'API, la skill /cortex, puis propose d'enregistrer le repo courant.
trigger: /cortex-install
---

# /cortex-install

Commande à lancer **après** `make install` (dans le repo cortex). Elle vérifie que tout est opérationnel côté Claude Code et guide l'utilisateur pour le premier scan.

## Usage

```
/cortex-install
```

## Checklist à exécuter (dans l'ordre)

1. **Skill `/cortex` présente ?**
   ```bash
   test -f ~/.claude/skills/cortex/SKILL.md && echo OK || echo MISSING
   ```
   Si manquante → dire à l'utilisateur de relancer `make install-skill` depuis le repo cortex.

2. **Marqueurs dans `~/.claude/CLAUDE.md` ?**
   ```bash
   grep -c "cortex-skill:start" ~/.claude/CLAUDE.md
   ```
   Doit être ≥ 1.

3. **Serveur MCP `cortex` enregistré ?**
   ```bash
   claude mcp list 2>/dev/null | grep -i cortex
   ```
   Si absent → relancer `make install-cli` dans le repo cortex.

4. **API CorteX joignable ?**
   ```bash
   API=${CORTEX_API_URL:-http://localhost:3100}
   KEY=${CORTEX_API_KEY:-dev-key-1}
   curl -s -o /dev/null -w "%{http_code}" -H "X-API-Key: $KEY" "$API/api/health"
   ```
   Attendu : `200`. Sinon → suggérer `make dev` dans `~/Documents/PROJECTS/cortex`.

5. **Liste des projets existants** via l'outil `mcp__cortex__list_projects`. Afficher un résumé (nombre projets + repos).

6. **Proposer la suite**
   - Si le cwd est un repo git : proposer de lancer immédiatement `/cortex .`
   - Sinon : afficher le message "Va dans un repo git et lance `/cortex`"

## Sortie attendue

Format compact (checkmarks ✔/✘), en français :

```
✔ Skill /cortex installée
✔ CLAUDE.md patché
✔ MCP cortex enregistré
✔ API joignable (200)
✔ N projet(s) · M repo(s) tracked

→ Prêt. Dans n'importe quel repo git, tape /cortex pour l'ajouter et le scanner.
```

En cas d'échec, indiquer précisément la commande corrective.
