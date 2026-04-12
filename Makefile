# ─────────────────────────────────────────────────────────────────────────────
#  CorteX — Makefile
#
#  make cortex   → start everything (one command)
#  make help     → list all targets
# ─────────────────────────────────────────────────────────────────────────────

# Load .env if it exists (- prefix = never fail if missing)
-include .env
export

# ── Platform detection ────────────────────────────────────────────────────────

OS         := $(shell uname -s)
ARCH       := $(shell uname -m)
IS_WSL     := $(shell grep -qiE microsoft /proc/version 2>/dev/null && echo true || echo false)
HAS_NVIDIA := $(shell command -v nvidia-smi >/dev/null 2>&1 && nvidia-smi -L >/dev/null 2>&1 && echo true || echo false)
HAS_AMD    := $(shell command -v rocm-smi >/dev/null 2>&1 && echo true || echo false)

# Docker compose profile: empty = default (macOS), nvidia or linux on Linux
ifeq ($(OS),Darwin)
  PROFILE :=
else ifeq ($(HAS_NVIDIA),true)
  PROFILE := --profile nvidia
else
  PROFILE := --profile linux
endif

COMPOSE := docker compose $(PROFILE)

# ── Colors ────────────────────────────────────────────────────────────────────

B  := \033[1m
C  := \033[0;36m
G  := \033[0;32m
Y  := \033[1;33m
NC := \033[0m

# ─────────────────────────────────────────────────────────────────────────────

.DEFAULT_GOAL := help
.PHONY: cortex cortex-bg cortex-stop cortex-status check-env check-deps repair-deps ollama ollama-models \
        infra infra-down infra-build infra-logs infra-ps \
        migrate migrate-generate seed seed-force \
        dev dev-api dev-dashboard dev-workers install deps build \
        setup-graphify test-graphify \
        install-cli uninstall-cli install-skill uninstall-skill \
        status logs clean reset uninstall setup help

# ─────────────────────────────────────────────────────────────────────────────
#  ★  MAIN ENTRY POINT
# ─────────────────────────────────────────────────────────────────────────────

cortex: check-env check-deps ollama infra migrate seed setup-graphify ## ★  Start the full CorteX stack (Docker + Ollama + API + Dashboard + Workers)
	@pnpm --filter @cortex/db --filter @cortex/shared run build
	bash scripts/dev.sh

cortex-bg: check-env check-deps ollama infra migrate seed setup-graphify ## ★  Silent mode — start everything detached, logs in logs/*.log, returns immediately
	@pnpm --filter @cortex/db --filter @cortex/shared run build >/dev/null
	@mkdir -p logs
	@# Kill any previous background dev servers (by PID file)
	@for svc in api dashboard workers; do \
		if [ -f "logs/$$svc.pid" ] && kill -0 "$$(cat logs/$$svc.pid)" 2>/dev/null; then \
			kill "$$(cat logs/$$svc.pid)" 2>/dev/null || true; \
		fi; \
		rm -f "logs/$$svc.pid"; \
	done
	@printf "$(C)ℹ$(NC)  Starting API in background...\n"
	@nohup pnpm --filter @cortex/serving run dev > logs/api.log 2>&1 & echo $$! > logs/api.pid
	@printf "$(C)ℹ$(NC)  Starting Dashboard in background...\n"
	@nohup pnpm --filter @cortex/dashboard run dev > logs/dashboard.log 2>&1 & echo $$! > logs/dashboard.pid
	@printf "$(C)ℹ$(NC)  Starting Workers in background...\n"
	@nohup pnpm --filter @cortex/ingestion run dev > logs/workers.log 2>&1 & echo $$! > logs/workers.pid
	@printf "$(C)ℹ$(NC)  Waiting for API on :$${PORT:-3100}..."
	@for i in $$(seq 1 60); do \
		if curl -sf http://localhost:$${PORT:-3100}/api/health >/dev/null 2>&1; then \
			printf " $(G)ready$(NC)\n"; break; \
		fi; \
		printf "."; sleep 1; \
		if [ $$i -eq 60 ]; then \
			printf " $(Y)timeout$(NC) — voir logs/api.log\n"; \
			tail -20 logs/api.log; exit 1; \
		fi; \
	done
	@printf "\n$(G)✔$(NC)  $(B)CorteX running in background.$(NC)\n"
	@printf "   API         : $(C)http://localhost:$${PORT:-3100}$(NC)\n"
	@printf "   Dashboard   : $(C)http://localhost:$${VITE_PORT:-5173}$(NC)\n"
	@printf "   Logs        : $(C)tail -f logs/{api,dashboard,workers}.log$(NC)\n"
	@printf "   Stop        : $(C)make cortex-stop$(NC)\n"
	@printf "   Status      : $(C)make cortex-status$(NC)\n"

cortex-stop: ## Stop background dev servers (API, Dashboard, Workers) started by cortex-bg
	@for svc in api dashboard workers; do \
		if [ -f "logs/$$svc.pid" ]; then \
			PID=$$(cat logs/$$svc.pid); \
			if kill -0 "$$PID" 2>/dev/null; then \
				pkill -P "$$PID" 2>/dev/null || true; \
				kill "$$PID" 2>/dev/null || true; \
				printf "$(G)✔$(NC)  $$svc stopped (pid $$PID)\n"; \
			else \
				printf "$(C)ℹ$(NC)  $$svc not running (stale pid file)\n"; \
			fi; \
			rm -f "logs/$$svc.pid"; \
		else \
			printf "$(C)ℹ$(NC)  $$svc — no pid file\n"; \
		fi; \
	done

cortex-status: ## Show status of background dev servers + Docker services
	@printf "$(B)Background dev servers$(NC)\n"
	@for svc in api dashboard workers; do \
		if [ -f "logs/$$svc.pid" ] && kill -0 "$$(cat logs/$$svc.pid)" 2>/dev/null; then \
			printf "  $(G)●$(NC) $$svc  (pid $$(cat logs/$$svc.pid))\n"; \
		else \
			printf "  $(R)○$(NC) $$svc  (stopped)\n"; \
		fi; \
	done
	@printf "\n$(B)Docker services$(NC)\n"
	@$(COMPOSE) ps --format "  {{.Service}}  {{.State}}" 2>/dev/null || printf "  (docker not running)\n"
	@printf "\n$(B)API health$(NC)\n"
	@if curl -sf http://localhost:$${PORT:-3100}/api/health >/dev/null 2>&1; then \
		printf "  $(G)●$(NC) http://localhost:$${PORT:-3100} (healthy)\n"; \
	else \
		printf "  $(R)○$(NC) http://localhost:$${PORT:-3100} (unreachable)\n"; \
	fi

# ─────────────────────────────────────────────────────────────────────────────
#  ENVIRONMENT
# ─────────────────────────────────────────────────────────────────────────────

check-env: ## Ensure .env exists (copies .env.example if missing) and .cred.env exists
	@if [ ! -f .env ]; then \
		if [ -f .env.example ]; then \
			printf "$(Y)⚠$(NC)  .env not found — copying .env.example\n"; \
			cp .env.example .env; \
			printf "$(G)✔$(NC)  .env created\n"; \
		else \
			printf "$(Y)✘$(NC)  .env not found and .env.example is missing.\n"; \
			printf "    Create .env manually (see README) then rerun.\n"; \
			exit 1; \
		fi; \
	fi
	@if [ ! -f .cred.env ]; then \
		printf "$(C)ℹ$(NC)  Creating empty .cred.env (add tokens to enable authenticated git clones)\n"; \
		printf "# Cortex credentials — managed by the dashboard\n# Add provider tokens here or use the dashboard Settings > Credentials page.\n#\n# GITHUB_TOKEN=ghp_xxx\n# GITLAB_TOKEN=glpat-xxx\n# BITBUCKET_USERNAME=user\n# BITBUCKET_APP_PASSWORD=xxx\n" > .cred.env; \
	fi

# Critical packages whose absence/corruption makes the stack fail to boot.
# We verify package.json exists inside each — empty pnpm dirs have bitten us
# before (interrupted installs leave the folder without its package.json).
CRITICAL_DEPS := \
	packages/serving/node_modules/hono/package.json \
	packages/serving/node_modules/@hono/node-server/package.json \
	packages/serving/node_modules/drizzle-orm/package.json \
	packages/ingestion/node_modules/bullmq/package.json \
	packages/ingestion/node_modules/ioredis/package.json \
	packages/dashboard/node_modules/vite/package.json \
	packages/dashboard/node_modules/react/package.json \
	packages/mcp/node_modules/@modelcontextprotocol/sdk/package.json

check-deps: ## Verify critical deps are intact; auto-repair if corrupted (missing package.json in pnpm store)
	@missing=""; \
	for f in $(CRITICAL_DEPS); do \
		[ -f "$$f" ] || missing="$$missing $$f"; \
	done; \
	if [ -n "$$missing" ]; then \
		printf "$(Y)⚠$(NC)  Corrupted pnpm store detected (missing package.json in critical deps).\n"; \
		printf "$(C)ℹ$(NC)  Auto-repairing: nuking node_modules and reinstalling...\n"; \
		$(MAKE) repair-deps; \
	else \
		printf "$(G)✔$(NC)  Deps OK\n"; \
	fi

repair-deps: ## Wipe all node_modules trees and reinstall from pnpm CAS (fast, idempotent)
	@printf "$(C)ℹ$(NC)  Removing node_modules trees...\n"
	@rm -rf node_modules packages/*/node_modules services/*/node_modules 2>/dev/null || true
	@printf "$(C)ℹ$(NC)  Reinstalling via pnpm...\n"
	@pnpm install
	@printf "$(G)✔$(NC)  Deps repaired\n"

# ─────────────────────────────────────────────────────────────────────────────
#  OLLAMA
# ─────────────────────────────────────────────────────────────────────────────

ollama: ## Start Ollama (native on macOS/WSL2, Docker on Linux)
ifeq ($(OS),Darwin)
	@if ! curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; then \
		printf "$(C)ℹ$(NC)  Starting Ollama (Metal GPU)...\n"; \
		ollama serve >/dev/null 2>&1 & \
		until curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; do sleep 1; done; \
	fi
	@printf "$(G)✔$(NC)  Ollama ready\n"
else ifeq ($(IS_WSL),true)
	@if ! curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; then \
		printf "$(C)ℹ$(NC)  Starting Ollama (WSL2)...\n"; \
		ollama serve >/dev/null 2>&1 & \
		until curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; do sleep 1; done; \
	fi
	@printf "$(G)✔$(NC)  Ollama ready\n"
else
	@printf "$(C)ℹ$(NC)  Ollama will start via Docker\n"
endif

ollama-models: ollama ## Pull all required Ollama models
	bash scripts/init-ollama.sh

# ─────────────────────────────────────────────────────────────────────────────
#  INFRASTRUCTURE (Docker)
# ─────────────────────────────────────────────────────────────────────────────

infra: ## Start Docker services (postgres + redis [+ ollama on Linux])
	@printf "$(C)ℹ$(NC)  Stopping existing containers...\n"
	@docker compose --profile nvidia --profile linux down --remove-orphans 2>/dev/null || true
	@printf "$(C)ℹ$(NC)  Starting Docker services$(if $(PROFILE), [$(PROFILE)])...\n"
	@$(COMPOSE) up -d --build
	@printf "$(C)ℹ$(NC)  Waiting for PostgreSQL..."
	@until $(COMPOSE) exec -T postgres pg_isready -U cortex -d cortex >/dev/null 2>&1; \
		do printf "."; sleep 1; done
	@printf " $(G)ready$(NC)\n"
	@if [ "$(OS)" != "Darwin" ] && [ "$(IS_WSL)" != "true" ]; then \
		printf "$(C)ℹ$(NC)  Waiting for Ollama container..."; \
		until curl -sf http://localhost:11434/api/tags >/dev/null 2>&1; do printf "."; sleep 1; done; \
		printf " $(G)ready$(NC)\n"; \
	fi
	@printf "$(G)✔$(NC)  Infrastructure ready.\n"

infra-down: ## Stop all Docker services
	$(COMPOSE) down

infra-build: ## Rebuild Docker images
	$(COMPOSE) build

infra-logs: ## Tail all Docker logs (use s=<service> to filter)
	$(COMPOSE) logs -f $(s)

infra-ps: ## Show Docker container status
	$(COMPOSE) ps

# ─────────────────────────────────────────────────────────────────────────────
#  DATABASE
# ─────────────────────────────────────────────────────────────────────────────

migrate: ## Run database migrations
	pnpm -w run migrate

migrate-generate: ## Generate a new migration from schema changes
	pnpm --filter @cortex/db run generate

seed: ## Seed database from config/projects.json (skips if data exists)
	pnpm -w run seed

seed-force: ## Force re-seed (truncates and recreates all data)
	pnpm -w run seed -- --force

# ─────────────────────────────────────────────────────────────────────────────
#  DEVELOPMENT
# ─────────────────────────────────────────────────────────────────────────────

dev: ## Start all dev servers in parallel (API + Dashboard + Workers) with UI
	bash scripts/dev.sh

dev-api: ## API server only (:3100)
	pnpm --filter @cortex/serving run dev

dev-dashboard: ## Dashboard only (:5173)
	pnpm --filter @cortex/dashboard run dev

dev-workers: ## Ingestion workers only
	pnpm --filter @cortex/ingestion run dev

install: check-env ## Full setup: deps + infra + migrations + seed + graphify + Ollama + CLI
	@printf "$(B)$(C)CorteX$(NC) — Full Install\n\n"
	@printf "$(C)ℹ$(NC)  Installing Node.js dependencies...\n"
	@pnpm install
	@$(MAKE) infra
	@$(MAKE) migrate
	@$(MAKE) seed
	@$(MAKE) setup-graphify
	@pnpm --filter @cortex/db --filter @cortex/shared run build
	@$(MAKE) ollama-models
	@$(MAKE) install-cli
	@$(MAKE) install-skill
	@printf "\n$(G)✔$(NC)  $(B)CorteX installed!$(NC)\n"
	@printf "   1. Start the stack:  $(C)make dev$(NC)\n"
	@printf "   2. Open Claude Code in any repo and run:  $(C)/cortex-install$(NC)\n"
	@printf "      (vérifie MCP + API + skill, puis guide le premier scan)\n"

# ─────────────────────────────────────────────────────────────────────────────
#  CLAUDE CLI — Register the Cortex MCP server globally (user scope)
# ─────────────────────────────────────────────────────────────────────────────

install-cli: ## Register Cortex MCP server in Claude Code (user scope, available in every project)
	@printf "$(C)ℹ$(NC)  Building @cortex/mcp...\n"
	@pnpm --filter @cortex/shared --filter @cortex/mcp run build
	@if ! command -v claude >/dev/null 2>&1; then \
		printf "$(Y)⚠$(NC)  Claude Code CLI not found in PATH. Skipping MCP registration.\n"; \
		printf "    Install Claude Code then rerun: $(C)make install-cli$(NC)\n"; \
		exit 0; \
	fi
	@CORTEX_MCP_ENTRY="$(CURDIR)/packages/mcp/dist/index.js"; \
	if [ ! -f "$$CORTEX_MCP_ENTRY" ]; then \
		printf "$(Y)✘$(NC)  Build artifact missing: $$CORTEX_MCP_ENTRY\n"; exit 1; \
	fi; \
	printf "$(C)ℹ$(NC)  Registering 'cortex' MCP server (user scope)...\n"; \
	claude mcp remove cortex -s user >/dev/null 2>&1 || true; \
	CORTEX_MCP_JSON=$$(printf '{"type":"stdio","command":"node","args":["%s"],"env":{"CORTEX_API_URL":"%s","CORTEX_API_KEY":"%s"}}' \
		"$$CORTEX_MCP_ENTRY" \
		"$${CORTEX_API_URL:-http://localhost:3100}" \
		"$${CORTEX_API_KEY:-dev-key-1}"); \
	claude mcp add-json --scope user cortex "$$CORTEX_MCP_JSON"
	@printf "$(G)✔$(NC)  Cortex MCP registered globally. Usable from any project via $(C)mcp__cortex__*$(NC) tools.\n"

uninstall-cli: ## Remove Cortex MCP server from Claude Code (user scope)
	@if command -v claude >/dev/null 2>&1; then \
		claude mcp remove cortex -s user >/dev/null 2>&1 && \
			printf "$(G)✔$(NC)  Cortex MCP removed from Claude Code.\n" || \
			printf "$(C)ℹ$(NC)  Cortex MCP was not registered.\n"; \
	fi

install-skill: ## Install all cortex skills (/cortex, -install, -backup, -sync) globally (~/.claude/skills/)
	@printf "$(C)ℹ$(NC)  Installing cortex skills into $${CLAUDE_HOME:-$$HOME/.claude}...\n"
	@bash $(CURDIR)/scripts/claude/install-skill.sh
	@printf "$(G)✔$(NC)  cortex skills available globally. Triggers: $(C)/cortex$(NC), $(C)/cortex-install$(NC), $(C)/cortex-backup$(NC), $(C)/cortex-sync$(NC).\n"

uninstall-skill: ## Remove all cortex skills (/cortex, -install, -backup, -sync) from ~/.claude
	@CLAUDE_HOME=$${CLAUDE_HOME:-$$HOME/.claude}; \
	rm -rf "$$CLAUDE_HOME/skills/cortex" "$$CLAUDE_HOME/skills/cortex-install" \
	       "$$CLAUDE_HOME/skills/cortex-backup" "$$CLAUDE_HOME/skills/cortex-sync" && \
		printf "$(G)✔$(NC)  cortex skills removed.\n" || true; \
	if [ -f "$$CLAUDE_HOME/CLAUDE.md" ]; then \
		awk '/<!-- cortex-skill:start -->/{f=1;next} /<!-- cortex-skill:end -->/{f=0;next} !f' "$$CLAUDE_HOME/CLAUDE.md" > "$$CLAUDE_HOME/CLAUDE.md.tmp" && \
		mv "$$CLAUDE_HOME/CLAUDE.md.tmp" "$$CLAUDE_HOME/CLAUDE.md" && \
		printf "$(G)✔$(NC)  CLAUDE.md cortex block removed.\n"; \
	fi

deps: ## Install Node.js dependencies only
	pnpm install

build: ## Build all packages for production
	pnpm -w run build

# ─────────────────────────────────────────────────────────────────────────────
#  STATUS & UTILITIES
# ─────────────────────────────────────────────────────────────────────────────

status: ## Show status of all services + Ollama models
	@printf "\n$(B)Services:$(NC)\n"
	@$(COMPOSE) exec -T postgres pg_isready -U cortex -d cortex >/dev/null 2>&1 \
		&& printf "  $(G)✔$(NC)  PostgreSQL   :5432\n" \
		|| printf "  $(Y)✘$(NC)  PostgreSQL   :5432  (down)\n"
	@redis-cli ping >/dev/null 2>&1 \
		&& printf "  $(G)✔$(NC)  Redis        :6379\n" \
		|| printf "  $(Y)✘$(NC)  Redis        :6379  (down)\n"
	@curl -sf http://localhost:11434/api/tags >/dev/null 2>&1 \
		&& printf "  $(G)✔$(NC)  Ollama       :11434\n" \
		|| printf "  $(Y)✘$(NC)  Ollama       :11434 (down)\n"
	@curl -sf http://localhost:3100/api/health >/dev/null 2>&1 \
		&& printf "  $(G)✔$(NC)  Serving API  :3100\n" \
		|| printf "  $(Y)✘$(NC)  Serving API  :3100  (down)\n"
	@printf "\n$(B)Ollama models:$(NC)\n"
	@curl -sf http://localhost:11434/api/tags 2>/dev/null \
		| python3 -c "import json,sys; [print('  -', m['name']) for m in json.load(sys.stdin)['models']]" \
		2>/dev/null || printf "  (ollama not running)\n"
	@printf "\n$(B)Containers:$(NC)\n"
	@$(COMPOSE) ps 2>/dev/null || true
	@printf "\n"

logs: ## Tail Docker logs (use s=<service> to filter)
	$(COMPOSE) logs -f $(s)

clean: ## Stop Docker + remove build artifacts (keeps data volumes)
	$(COMPOSE) down
	pnpm -w run clean

reset: ## ⚠ Full reset: stop Docker, delete volumes, clean builds
	@printf "$(Y)⚠$(NC)  Deletes ALL data (volumes + builds). Continue? [y/N] "; \
	read ans; [ "$${ans}" = "y" ] || (printf "Cancelled.\n" && exit 1)
	$(COMPOSE) down -v
	pnpm -w run clean

uninstall: ## ⚠ Remove everything: containers, volumes, images, node_modules, .env
	@printf "$(Y)⚠$(NC)  This will remove ALL CorteX data, containers, images, and dependencies.\n"
	@printf "$(Y)⚠$(NC)  Continue? [y/N] "; \
	read ans; [ "$${ans}" = "y" ] || (printf "Cancelled.\n" && exit 1)
	@printf "\n$(C)ℹ$(NC)  Removing Cortex MCP from Claude Code...\n"
	@$(MAKE) uninstall-cli 2>/dev/null || true
	@printf "$(C)ℹ$(NC)  Stopping and removing containers...\n"
	@docker compose --profile nvidia --profile linux down -v --remove-orphans 2>/dev/null || true
	@containers=$$(docker ps -aq --filter "name=cortex-"); [ -n "$$containers" ] && docker rm -f $$containers 2>/dev/null || true
	@printf "$(C)ℹ$(NC)  Removing Docker images...\n"
	@docker rmi cortex-ingestion 2>/dev/null || true
	@printf "$(C)ℹ$(NC)  Removing node_modules...\n"
	@rm -rf node_modules packages/*/node_modules 2>/dev/null || true
	@printf "$(C)ℹ$(NC)  Removing graphify bridge venv...\n"
	@rm -rf services/graphify-bridge/.venv 2>/dev/null || true
	@printf "$(C)ℹ$(NC)  Removing build artifacts...\n"
	@pnpm -w run clean 2>/dev/null || true
	@rm -f .env
	@printf "\n$(G)✔$(NC)  $(B)CorteX uninstalled.$(NC) Run $(C)make install$(NC) to reinstall.\n"

setup: ## First-time setup (install tools, pull models, migrate DB)
	bash setup.sh


# ── Graphify Bridge (Python) ────────────────────────────────────────────────

setup-graphify: ## Install graphify Python bridge (required for scanning)
	@printf "$(C)ℹ$(NC)  Setting up graphify bridge...\n"
	@cd services/graphify-bridge && \
		python3 -m venv .venv && \
		.venv/bin/pip install --quiet -e . && \
		printf "$(G)✔$(NC)  Graphify bridge installed\n"

test-graphify: setup-graphify ## Test graphify bridge scanner
	@cd services/graphify-bridge && \
		.venv/bin/python -c "from cortex_bridge.scanner import scan_directory; print('Bridge OK')"


# ─────────────────────────────────────────────────────────────────────────────
#  HELP
# ─────────────────────────────────────────────────────────────────────────────

help: ## Show this help
	@printf "\n$(B)$(C)CorteX$(NC) — Knowledge Hub for AI Teams\n"
	@printf "$(B)Platform:$(NC) $(OS)/$(ARCH)"
	@[ "$(IS_WSL)"     = "true" ] && printf " · WSL2"      || true
	@[ "$(HAS_NVIDIA)" = "true" ] && printf " · NVIDIA GPU" || true
	@[ "$(HAS_AMD)"    = "true" ] && printf " · AMD ROCm"   || true
	@printf "\n\n"
	@printf "$(B)Usage:$(NC)\n"
	@printf "  make $(C)cortex$(NC)    Start the full stack\n\n"
	@printf "$(B)Targets:$(NC)\n"
	@grep -E '^[a-zA-Z_-]+:.*## ' Makefile \
		| sort \
		| awk 'BEGIN {FS = ":.*## "}; {printf "  \033[0;36m%-20s\033[0m %s\n", $$1, $$2}'
	@printf "\n"
