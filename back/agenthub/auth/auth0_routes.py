# back/agenthub/auth/oauth_routes.py - CREAR ARCHIVO (SIMPLIFICADO)
import os
import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

logger = logging.getLogger(__name__)
router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

@router.get("/github")
async def github_login():
    """Iniciar login con GitHub - PLACEHOLDER"""
    try:
        # Por ahora, redirigir con mensaje de que OAuth no está configurado
        logger.info("GitHub OAuth solicitado - no configurado aún")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=oauth_not_configured",
            status_code=302
        )
    except Exception as e:
        logger.error(f"Error en GitHub login: {e}")
        raise HTTPException(status_code=500, detail="Error al iniciar login con GitHub")

@router.get("/github/callback")
async def github_callback():
    """Callback de GitHub OAuth - PLACEHOLDER"""
    try:
        logger.info("GitHub callback recibido - no configurado aún")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=oauth_not_configured",
            status_code=302
        )
    except Exception as e:
        logger.error(f"Error en GitHub callback: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=github_error",
            status_code=302
        )

@router.get("/google")
async def google_login():
    """Iniciar login con Google - PLACEHOLDER"""
    try:
        logger.info("Google OAuth solicitado - no configurado aún")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=oauth_not_configured",
            status_code=302
        )
    except Exception as e:
        logger.error(f"Error en Google login: {e}")
        raise HTTPException(status_code=500, detail="Error al iniciar login con Google")

@router.get("/google/callback")
async def google_callback():
    """Callback de Google OAuth - PLACEHOLDER"""
    try:
        logger.info("Google callback recibido - no configurado aún")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=oauth_not_configured",
            status_code=302
        )
    except Exception as e:
        logger.error(f"Error en Google callback: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=google_error",
            status_code=302
        )

# Endpoint de información sobre OAuth
@router.get("/status")
async def oauth_status():
    """Status de configuración OAuth"""
    github_configured = bool(os.getenv('GITHUB_CLIENT_ID'))
    google_configured = bool(os.getenv('GOOGLE_CLIENT_ID'))
    
    return {
        "oauth_enabled": False,  # Por ahora deshabilitado
        "providers": {
            "github": {
                "enabled": False,
                "configured": github_configured
            },
            "google": {
                "enabled": False,
                "configured": google_configured
            }
        },
        "message": "OAuth placeholders instalados - configuración pendiente"
    }