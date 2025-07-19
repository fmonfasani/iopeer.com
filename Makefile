
.PHONY: install test lint format run docker-build docker-run clean

install:
pip install -r requirements-dev.txt
pre-commit install

test:
pytest tests -v --cov=agenthub

lint:
flake8 agents orchestrator.py main.py cli.py
mypy agents orchestrator.py main.py cli.py

format:
black agents orchestrator.py main.py cli.py
isort agents orchestrator.py main.py cli.py

run:
python -m agenthub.main

docker-build:
docker build -t agenthub:latest .

docker-run:
docker-compose up -d

clean:
find . -type f -name "*.pyc" -delete
find . -type d -name "__pycache__" -delete
rm -rf .pytest_cache htmlcov .coverage
