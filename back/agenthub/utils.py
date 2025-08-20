"""Utility helpers used across AgentHub."""

from __future__ import annotations

import logging
import logging.handlers
from pathlib import Path

from agenthub.config import config

# ---------------------------------------------------------------------------
# Common constants
# ---------------------------------------------------------------------------

SECRET_KEY = config["secret_key"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ---------------------------------------------------------------------------
# Logging utilities
# ---------------------------------------------------------------------------

def setup_logging() -> None:
    """Configure application-wide logging."""

    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    formatter = logging.Formatter(
        fmt=config.get("logging", {}).get(
            "format", "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        ),
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, config.get("log_level", "INFO")))

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    file_handler = logging.handlers.RotatingFileHandler(
        log_dir / "agenthub.log", maxBytes=10 * 1024 * 1024, backupCount=5
    )
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)

    error_handler = logging.handlers.RotatingFileHandler(
        log_dir / "errors.log", maxBytes=10 * 1024 * 1024, backupCount=3
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    root_logger.addHandler(error_handler)

    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.INFO)


__all__ = [
    "setup_logging",
    "SECRET_KEY",
    "ALGORITHM",
    "ACCESS_TOKEN_EXPIRE_MINUTES",
]
