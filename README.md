# AgentHub

AgentHub is a lightweight framework for coordinating AI agents. It exposes a REST API powered by FastAPI, a CLI for common operations and an orchestrator that runs configurable workflows.

## Setup

1. Clone the repository and enter the project directory
   ```bash
   git clone <repo-url>
   cd agenthub
   ```
2. Create a Python 3.11 virtual environment and install the dependencies
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements-dev.txt
   ```
   You can also run `make install` if you have `make` available.

## Running the server

Start the development server with
```bash
agenthub-server
```
or
```bash
python -m agenthub.main
```
The interactive API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

## CLI examples

List registered agents:
```bash
agenthub agents
```
Send a message to an agent:
```bash
agenthub send backend_agent analyze_requirements --data '{"requirements": "Simple API"}'
```
Run a workflow:
```bash
agenthub run api_development --data '{"requirements": "Simple API"}'
```

## API examples

Health check:
```bash
curl http://localhost:8000/health
```
Send a message via HTTP:
```bash
curl -X POST http://localhost:8000/message/send \
  -H "Content-Type: application/json" \
  -d '{"agent_id":"backend_agent","action":"analyze_requirements","data":{"requirements":"Simple API"}}'
```

## Development commands

Use the supplied `Makefile` for common tasks:
```bash
make test    # run tests
make lint    # run linters
make format  # format code
make run     # start the server
```

## Documentation

- Interactive API documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
- Explore the `agents/` and `workflows/` directories for implementation details.
