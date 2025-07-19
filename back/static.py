# agenthub/static_files.py
import os

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles


def setup_frontend(app: FastAPI):
    """Configura servir archivos estáticos del frontend"""

    # Servir archivos estáticos
    if os.path.exists("frontend/build"):
        app.mount(
            "/static", StaticFiles(directory="frontend/build/static"), name="static"
        )

        @app.get("/", include_in_schema=False)
        async def serve_frontend():
            return FileResponse("frontend/build/index.html")

    # Fallback para desarrollo
    else:

        @app.get("/", include_in_schema=False)
        async def frontend_dev():
            return {
                "message": "Frontend en desarrollo",
                "docs": "/docs",
                "api": "/agents",
            }
