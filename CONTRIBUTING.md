# Contributing

This project uses a simple workflow for submitting pull requests. The following sections describe how to set up your environment, adhere to the coding style, run tests, and open a pull request.

## Environment setup

1. Clone the repository and change into the project directory.
2. Run `./scripts/dev.sh`. This script creates a virtual environment, installs development dependencies and configures pre-commit hooks.

## Coding style

- Code is formatted with [Black](https://black.readthedocs.io/en/stable/) and imports are organized with [isort](https://pycqa.github.io/isort/).
- Pre-commit hooks are used to automatically run Black, isort and other checks. You can run them manually with:
  ```bash
  pre-commit run --all-files
  ```
- Ensure your changes conform to these checks before pushing commits.

## Running tests

The project includes helper scripts under `scripts/`.

- `./scripts/test.sh` runs linting, type checking and the full test suite.
- You can also run tests directly with `pytest` if needed.

## Pull request workflow

1. Create a feature branch from `main`.
2. Run `pre-commit` and `./scripts/test.sh` locally until both succeed.
3. Push your branch and open a pull request describing your changes.
4. Make sure CI passes before requesting review.

