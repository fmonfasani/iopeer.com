# agenthub/config.py
import os
import logging
from pathlib import Path
from typing import Any, Dict

import yaml

logger = logging.getLogger(__name__)


BASE_DIR = Path(__file__).resolve().parent.parent


class Config:
    """Gestión centralizada de configuración"""

    def __init__(self):
        self.config_path = os.getenv("AGENTHUB_CONFIG", "config.yaml")
        self.settings = self._load_config()
        self._apply_defaults()

    def _load_config(self) -> Dict[str, Any]:
        """Carga configuración desde archivo YAML"""
        if not Path(self.config_path).exists():
            return {}

        try:
            with open(self.config_path, "r", encoding="utf-8") as f:
                return yaml.safe_load(f) or {}
        except Exception as e:
            logger.error("Error loading config file %s: %s", self.config_path, e)
            return {}

    def _apply_defaults(self):
        """Aplica valores por defecto"""
        defaults = {
            "env": "development",
            "host": "0.0.0.0",
            "port": 8000,
            "debug": False,
            "use_redis": False,
            "redis_url": "redis://localhost:6379",
            "log_level": "INFO",
            "max_workers": 4,
            "timeout": 30,
            "registry_file": str(BASE_DIR / "registry.json"),
        }

        for key, value in defaults.items():
            self.settings.setdefault(key, value)

        # Override con variables de entorno
        env_overrides = {
            "AGENTHUB_HOST": "host",
            "AGENTHUB_PORT": "port",
            "AGENTHUB_DEBUG": "debug",
            "REDIS_URL": "redis_url",
            "LOG_LEVEL": "log_level",
        }

        for env_var, config_key in env_overrides.items():
            if env_value := os.getenv(env_var):
                if config_key in ["port", "max_workers", "timeout"]:
                    self.settings[config_key] = int(env_value)
                elif config_key in ["debug", "use_redis"]:
                    self.settings[config_key] = env_value.lower() in (
                        "true",
                        "1",
                        "yes",
                    )
                else:
                    self.settings[config_key] = env_value

    def get(self, key: str, default=None):
        """Obtiene valor de configuración"""
        return self.settings.get(key, default)

    def __getitem__(self, key: str):
        return self.settings[key]


# Instancia global
config = Config()
