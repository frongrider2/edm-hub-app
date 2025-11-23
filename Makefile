.PHONY: db-up

db-up:
	docker-compose -f docker-compose-db.yml up -d mongodb redis

db-down:
	docker-compose -f docker-compose-db.yml down
