# agenthub/logging_config.py
import logging
import logging.handlers
from pathlib import Path

from .config import config


def setup_logging():
    """Configura el sistema de logging"""

    # Crear directorio de logs
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    # Configuración de formato
    formatter = logging.Formatter(
        fmt=config.get("logging", {}).get(
            "format", "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        ),
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Logger raíz
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, config.get("log_level", "INFO")))

    # Handler para consola
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)

    # Handler para archivo
    file_handler = logging.handlers.RotatingFileHandler(
        log_dir / "agenthub.log", maxBytes=10 * 1024 * 1024, backupCount=5  # 10MB
    )
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)

    # Handler para errores
    error_handler = logging.handlers.RotatingFileHandler(
        log_dir / "errors.log", maxBytes=10 * 1024 * 1024, backupCount=3
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)
    root_logger.addHandler(error_handler)

    # Configurar loggers específicos
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("fastapi").setLevel(logging.INFO)
