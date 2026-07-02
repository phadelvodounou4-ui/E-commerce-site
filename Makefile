.PHONY: help install dev build test seed clean deploy

help:
	@echo "ShopHub E-Commerce Platform"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install:
	cd backend && npm install
	cd frontend && npm install

dev:
	docker-compose up -d postgres redis
	sleep 5
	cd backend && npm run dev &
	cd frontend && npm run dev &

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

seed:
	docker-compose exec backend node src/database/seed.js

migrate:
	docker-compose exec backend node src/database/migrate.js

test:
	cd backend && npm test
	cd frontend && npm test
	cd frontend && npx playwright test

test-backend:
	cd backend && npm test

test-e2e:
	cd frontend && npx playwright test --headed

lint:
	cd backend && npm run lint
	cd frontend && npm run lint

clean:
	docker-compose down -v
	docker system prune -f

deploy:
	@echo "Deploy to production..."
