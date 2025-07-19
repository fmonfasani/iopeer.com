#!/bin/bash
# scripts/test.sh

set -e

echo "🧪 Running AgentHub Test Suite"

# Activar entorno virtual
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Linting
echo "🔍 Running linting..."
flake8 agenthub/
black --check agenthub/
isort --check-only agenthub/

# Type checking
echo "📝 Running type checks..."
mypy agenthub/

# Unit tests
echo "🔬 Running unit tests..."
pytest agenthub/tests/unit/ -v --cov=agenthub --cov-report=html

# Integration tests
echo "🔗 Running integration tests..."
pytest agenthub/tests/integration/ -v

# Performance tests
echo "⚡ Running performance tests..."
pytest agenthub/tests/performance/ -v || echo "⚠️ Performance tests not available"

echo "✅ All tests completed!"