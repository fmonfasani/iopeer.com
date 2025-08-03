.PHONY: help setup install test lint format run docker-build docker-run docker-down bash-back bash-front logs-back logs-front clean

# ======================
# 🆘 Ayuda
# ======================
help: ## Mostrar ayuda de comandos
	@echo "Comandos disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS=":.*?## "}; {printf "\033[36m%-25s\033[0m %s\n", $$1, $$2}'

# ======================
# ⚙️  Configuración inicial
# ======================
setup: ## Crear entorno virtual e instalar pre-commit
	@python -m venv .venv
	@. .venv/Scripts/activate && pip install pre-commit black flake8 isort mypy && pre-commit install

install: ## Instalar dependencias del backend
	@pip install -r requirements-dev.txt
	@pre-commit install

# ======================
# 🧪 Backend - Tests y Linter
# ======================
test: ## Ejecutar tests del backend
	@PYTHONPATH=back pytest back/tests -v

lint: ## Verificar código del backend
	@flake8 back/agenthub
	@mypy back/agenthub

format: ## Formatear código del backend
	@black back/agenthub
	@isort back/agenthub

# ======================
# 🚀 Backend - Dev
# ======================
run: ## Ejecutar servidor de desarrollo backend sin Docker
	@PYTHONPATH=back python -m agenthub.main

#=============
# Frontend run
#=============	
run-front: ## Ejecutar frontend en modo desarrollo
	cd front && npm start

# ======================
# 🐳 Docker Compose (backend + frontend)
# ======================
docker-build: ## Construir imágenes Docker
	@docker-compose build

docker-run: ## Levantar servicios backend + frontend
	@docker-compose up

docker-down: ## Bajar servicios
	@docker-compose down

# ======================
# 🐍 Terminales
# ======================
bash-back: ## Acceder a shell del backend
	docker-compose exec backend bash

bash-front: ## Acceder a shell del frontend
	docker-compose exec frontend sh

logs-back: ## Ver logs del backend
	docker-compose logs -f backend

logs-front: ## Ver logs del frontend
	docker-compose logs -f frontend

# ======================
# 🧹 Limpieza
# ======================
clean: ## Limpiar archivos temporales y cachés
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name "__pycache__" -delete
	@rm -rf .pytest_cache/ htmlcov/ .coverage
