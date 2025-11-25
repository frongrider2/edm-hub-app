.PHONY: help install dev build start migrate-up migrate-down migrate-status migrate-create clean

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

help: ## Show this help message
	@echo "$(BLUE)Available commands:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'

install: ## Install dependencies
	@echo "$(BLUE)Installing dependencies...$(RESET)"
	pnpm install

dev: ## Start development server
	@echo "$(BLUE)Starting development server...$(RESET)"
	pnpm run start:dev

build: ## Build the application
	@echo "$(BLUE)Building application...$(RESET)"
	pnpm run build

start: ## Start production server
	@echo "$(BLUE)Starting production server...$(RESET)"
	pnpm run start:prod

lint: ## Run linter
	@echo "$(BLUE)Running linter...$(RESET)"
	pnpm run lint

lint-fix: ## Fix linting errors
	@echo "$(BLUE)Fixing linting errors...$(RESET)"
	pnpm run lint:fix

test: ## Run tests
	@echo "$(BLUE)Running tests...$(RESET)"
	pnpm run test

test-watch: ## Run tests in watch mode
	@echo "$(BLUE)Running tests in watch mode...$(RESET)"
	pnpm run test:watch

test-cov: ## Run tests with coverage
	@echo "$(BLUE)Running tests with coverage...$(RESET)"
	pnpm run test:cov

# Database Migrations
migrate-up: ## Apply all pending migrations
	@echo "$(BLUE)Applying migrations...$(RESET)"
	npx migrate-mongo up
	@echo "$(GREEN)✓ Migrations applied successfully$(RESET)"

migrate-down: ## Rollback last migration
	@echo "$(YELLOW)Rolling back last migration...$(RESET)"
	npx migrate-mongo down
	@echo "$(GREEN)✓ Migration rolled back$(RESET)"

migrate-status: ## Check migration status
	@echo "$(BLUE)Checking migration status...$(RESET)"
	npx migrate-mongo status

migrate-create: ## Create new migration (usage: make migrate-create name=migration_name)
	@if [ -z "$(name)" ]; then \
		echo "$(RED)Error: Please provide migration name$(RESET)"; \
		echo "Usage: make migrate-create name=migration_name"; \
		exit 1; \
	fi
	@echo "$(BLUE)Creating migration: $(name)$(RESET)"
	npx migrate-mongo create $(name)
	@echo "$(GREEN)✓ Migration created$(RESET)"

# Database Operations
db-backup: ## Backup database
	@echo "$(BLUE)Backing up database...$(RESET)"
	@mkdir -p backups
	mongodump --uri="$${MONGO_URI:-mongodb://localhost:27017/edmhub}" --out=backups/backup-$$(date +%Y%m%d-%H%M%S)
	@echo "$(GREEN)✓ Database backed up$(RESET)"

db-restore: ## Restore database from backup (usage: make db-restore backup=backups/backup-20231124)
	@if [ -z "$(backup)" ]; then \
		echo "$(RED)Error: Please provide backup directory$(RESET)"; \
		echo "Usage: make db-restore backup=backups/backup-20231124"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Restoring database from $(backup)...$(RESET)"
	mongorestore --uri="$${MONGO_URI:-mongodb://localhost:27017/edmhub}" $(backup)
	@echo "$(GREEN)✓ Database restored$(RESET)"

db-seed: ## Seed database with sample data
	@echo "$(BLUE)Seeding database...$(RESET)"
	pnpm run seed
	@echo "$(GREEN)✓ Database seeded$(RESET)"

db-reset: ## Reset database (drop and recreate)
	@echo "$(RED)⚠ WARNING: This will delete all data!$(RESET)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(YELLOW)Resetting database...$(RESET)"; \
		mongo $${MONGO_URI:-mongodb://localhost:27017/edmhub} --eval "db.dropDatabase()"; \
		echo "$(GREEN)✓ Database reset$(RESET)"; \
	else \
		echo "$(BLUE)Cancelled$(RESET)"; \
	fi

# Utility Commands
clean: ## Clean build artifacts and dependencies
	@echo "$(BLUE)Cleaning...$(RESET)"
	rm -rf dist
	rm -rf node_modules
	@echo "$(GREEN)✓ Cleaned$(RESET)"

format: ## Format code
	@echo "$(BLUE)Formatting code...$(RESET)"
	pnpm run format

typecheck: ## Run TypeScript type checking
	@echo "$(BLUE)Type checking...$(RESET)"
	pnpm run typecheck || tsc --noEmit

logs: ## Show application logs (for Docker)
	@echo "$(BLUE)Showing logs...$(RESET)"
	docker-compose logs -f backend

docker-up: ## Start Docker containers
	@echo "$(BLUE)Starting Docker containers...$(RESET)"
	docker-compose up -d

docker-down: ## Stop Docker containers
	@echo "$(BLUE)Stopping Docker containers...$(RESET)"
	docker-compose down

docker-rebuild: ## Rebuild and restart Docker containers
	@echo "$(BLUE)Rebuilding Docker containers...$(RESET)"
	docker-compose up -d --build

# Development Helpers
watch: ## Watch for changes and rebuild
	@echo "$(BLUE)Watching for changes...$(RESET)"
	pnpm run start:dev

console: ## Open NestJS REPL console
	@echo "$(BLUE)Opening console...$(RESET)"
	pnpm run start:repl

debug: ## Start in debug mode
	@echo "$(BLUE)Starting in debug mode...$(RESET)"
	pnpm run start:debug

# Quick Commands
quick-setup: install migrate-up ## Quick setup (install + migrate)
	@echo "$(GREEN)✓ Setup complete!$(RESET)"

quick-reset: clean install migrate-up ## Clean, install, and migrate
	@echo "$(GREEN)✓ Reset complete!$(RESET)"

all: install build test ## Install, build, and test
	@echo "$(GREEN)✓ All tasks complete!$(RESET)"

