# Project Doctrine

This document summarizes the purpose and guiding philosophy of the AgentHub project and provides a short checklist for new contributors.

## Goals

- **Streamline AI workflows**: Provide a modular platform to orchestrate AI agents for startups.
- **Observability and reliability**: Offer built‑in monitoring, logging and health checks.
- **Extensibility**: Allow teams to create new agents and workflows with minimal boilerplate.

## Core Principles

1. **Modular design** – Agents should have clear, single responsibilities.
2. **Configuration as code** – Workflows and settings live in version control.
3. **Deterministic orchestration** – Workflows should be predictable and reproducible.
4. **Open standards** – Interoperability with A2A, MCP and ACP protocols.
5. **Quality first** – Tests and linting are mandatory before merging.

## Contributor Guidelines

- Fork the repository and create feature branches for all changes.
- Follow the coding style enforced by `black`, `flake8` and `isort`.
- Add unit tests for new features and run `pytest` before submitting a pull request.
- Keep documentation up to date when behaviour or interfaces change.
- Be descriptive in commit messages and pull request descriptions.

Welcome to the community!
