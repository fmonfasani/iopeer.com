#!/bin/bash
# scripts/dev.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 AgentHub Development Setup${NC}"

# Verificar Python
if ! command -v python3.11 &> /dev/null; then
    echo -e "${RED}❌ Python 3.11+ required${NC}"
    exit 1
fi

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
    python3.11 -m venv venv
fi

# Activar entorno virtual
echo -e "${YELLOW}🔧 Activating virtual environment...${NC}"
source venv/bin/activate

# Instalar dependencias
echo -e "${YELLOW}📚 Installing dependencies...${NC}"
pip install -r requirements.txt -r requirements-dev.txt

# Configurar pre-commit
echo -e "${YELLOW}🎣 Setting up pre-commit hooks...${NC}"
pre-commit install

# Crear archivos de configuración si no existen
if [ ! -f "config.yaml" ]; then
    echo -e "${YELLOW}⚙️ Creating config.yaml...${NC}"
    cp config.yaml.example config.yaml 2>/dev/null || echo "debug: true" > config.yaml
fi

if [ ! -f "registry.json" ]; then
    echo -e "${YELLOW}📝 Creating registry.json...${NC}"
    cat > registry.json << 'EOF'
[
  {
    "id": "backend_agent",
    "class": "BackendAgent",
    "config": {}
  },
  {
    "id": "qa_agent",
    "class": "QAAgent", 
    "config": {}
  }
]
EOF
fi

# Ejecutar tests
echo -e "${YELLOW}🧪 Running tests...${NC}"
pytest agenthub/tests/ -v

# Iniciar servidor de desarrollo
echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${YELLOW}🌐 Starting development server...${NC}"
echo -e "${YELLOW}📚 API Documentation: http://localhost:8000/docs${NC}"
echo -e "${YELLOW}🏥 Health Check: http://localhost:8000/health${NC}"

python -m agenthub.main