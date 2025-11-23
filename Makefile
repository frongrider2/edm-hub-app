.PHONY: db-up

db-up:
	docker-compose -f docker-compose-db.yml up -d mongodb redis

db-down:
	docker-compose -f docker-compose-db.yml down

# 
tunnel-fe:
	@export $(shell grep -v '^#' .env | xargs); \
	if [ -z "$$TUNNEL_TOKEN_FE" ]; then \
		echo "TUNNELTUNNEL_TOKEN_FE_TOKEN environment variable is not set in .env"; \
		exit 1; \
	fi; \
	cloudflared tunnel run --token $$TUNNEL_TOKEN_FE

tunnel-be:
	@export $(shell grep -v '^#' .env | xargs); \
	if [ -z "$$TUNNEL_TOKEN_BE" ]; then \
		echo "TUNNEL_TOKEN_BE environment variable is not set in .env"; \
		exit 1; \
	fi; \
	cloudflared tunnel run --token $$TUNNEL_TOKEN_BE --url http://localhost:3000