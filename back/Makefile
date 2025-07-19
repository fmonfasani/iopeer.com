
# Makefile
.PHONY: help install test lint format run docker-build docker-run clean

help: ## Mostrar ayuda
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$' $(MAKEFILE_LIST) | sort | awk 'BEGIN { FS=":.*?## " }; { printf "\033[36m%-30s\033[0m %s\n", $1, $2 }'

setup:
	@python -m venv .venv
	@.venv/Scripts/activate && pip install pre-commit black flake8 isort mypy && pre-commit install

install: ## Instalar dependencias
	pip install -r requirements-dev.txt
	pre-commit install

test: ## Ejecutar tests
	pytest agenthub/tests/ -v --cov=agenthub

lint: ## Verificar código
	flake8 agenthub/
	mypy agenthub/

format: ## Formatear código
	black agenthub/
	isort agenthub/

run: ## Ejecutar servidor de desarrollo
	python -m agenthub.main

docker-build: ## Construir imagen Docker
	docker build -t agenthub:latest .

docker-run: ## Ejecutar con Docker Compose
	docker-compose up -d

clean: ## Limpiar archivos temporales
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage
