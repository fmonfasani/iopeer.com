# scripts/deploy.sh
#!/bin/bash

set -e

echo "🚀 Deploying AgentHub..."

# Verificar requisitos
command -v docker >/dev/null 2>&1 || { echo "Docker is required" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "Docker Compose is required" >&2; exit 1; }

# Crear directorios necesarios
mkdir -p logs ssl

# Construir imágenes
echo "📦 Building images..."
docker-compose build

# Ejecutar tests
echo "🧪 Running tests..."
docker-compose run --rm agenthub pytest

# Iniciar servicios
echo "🎯 Starting services..."
docker-compose up -d

# Verificar salud
echo "🏥 Checking health..."
sleep 10
curl -f http://localhost:8000/health || { echo "Health check failed" >&2; exit 1; }

echo "✅ AgentHub deployed successfully!"
echo "🌐 API available at: http://localhost:8000"
echo "📊 Health check: http://localhost:8000/health"
echo "📚 API docs: http://localhost:8000/docs"
