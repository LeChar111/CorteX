include .env
export

.PHONY: help up down infra dev build migrate seed logs status clean init-ollama

# Default
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

# --- Infrastructure ---

infra: ## Start infra services (postgres, ollama, lightrag)
	docker compose up -d
	@echo "Waiting for postgres to be healthy..."
	@until docker compose exec -T postgres pg_isready -U cortex -d cortex >/dev/null 2>&1; do sleep 1; done
	@echo "Infrastructure ready."

down: ## Stop all infra services
	docker compose down

# --- Application ---

install: ## Install pnpm dependencies
	pnpm install

build: ## Build all packages
	pnpm run build

migrate: ## Run database migrations
	pnpm run migrate

seed: ## Seed the database
	pnpm run seed

dev: ## Start all packages in dev mode (serving + dashboard + ingestion)
	pnpm run dev

# --- Full stack ---

up: infra install migrate dev ## Start everything: infra + install + migrate + dev

init-ollama: ## Pull required Ollama models
	bash scripts/init-ollama.sh

# --- Utilities ---

logs: ## Tail docker compose logs
	docker compose logs -f

status: ## Show status of all services
	@echo "=== Docker ===" && docker compose ps
	@echo ""
	@echo "=== Redis ===" && redis-cli ping 2>/dev/null || echo "not running"

clean: ## Stop infra + clean build artifacts
	docker compose down
	pnpm run clean
