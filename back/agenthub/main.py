try:
    from ..main import app, run_server
except ImportError:  # pragma: no cover - fallback for direct execution
    from main import app, run_server

__all__ = ["app", "run_server"]

if __name__ == "__main__":
    run_server()
