# ============================================
# back/agenthub/auth/oauth_routes.py - CORREGIDO
# ============================================

import os
import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

logger = logging.getLogger(__name__)
router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# ============================================
# OAuth STATUS ENDPOINT
# ============================================

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
                "configured": github_configured,
                "client_id": os.getenv('GITHUB_CLIENT_ID', 'not-configured')[:10] + "..." if github_configured else "not-configured"
            },
            "google": {
                "enabled": False,
                "configured": google_configured,
                "client_id": os.getenv('GOOGLE_CLIENT_ID', 'not-configured')[:10] + "..." if google_configured else "not-configured"
            }
        },
        "message": "OAuth placeholders instalados - configuración pendiente",
        "frontend_url": FRONTEND_URL,
        "status": "ready_for_configuration"
    }

# ============================================
# GITHUB OAuth ENDPOINTS
# ============================================

@router.get("/github")
async def github_login():
    """Iniciar login con GitHub - PLACEHOLDER"""
    try:
        # Por ahora, redirigir con mensaje de que OAuth no está configurado
        logger.info("GitHub OAuth solicitado - no configurado aún")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=oauth_not_configured&provider=github",
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
            url=f"{FRONTEND_URL}/login?error=oauth_not_configured&provider=github",
            status_code=302
        )
    except Exception as e:
        logger.error(f"Error en GitHub callback: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=github_error",
            status_code=302
        )

# ============================================
# GOOGLE OAuth ENDPOINTS  
# ============================================

@router.get("/google")
async def google_login():
    """Iniciar login con Google - PLACEHOLDER"""
    try:
        logger.info("Google OAuth solicitado - no configurado aún")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=oauth_not_configured&provider=google",
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
            url=f"{FRONTEND_URL}/login?error=oauth_not_configured&provider=google",
            status_code=302
        )
    except Exception as e:
        logger.error(f"Error en Google callback: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=google_error",
            status_code=302
        )

# ============================================
# CONFIGURACIÓN OAuth (Para el futuro)
# ============================================

@router.get("/config")
async def oauth_config():
    """Configuración OAuth para desarrollo"""
    return {
        "github": {
            "auth_url": "https://github.com/login/oauth/authorize",
            "token_url": "https://github.com/login/oauth/access_token",
            "user_url": "https://api.github.com/user",
            "scope": "user:email"
        },
        "google": {
            "auth_url": "https://accounts.google.com/o/oauth2/v2/auth",
            "token_url": "https://oauth2.googleapis.com/token",
            "user_url": "https://www.googleapis.com/oauth2/v2/userinfo",
            "scope": "openid email profile"
        },
        "redirect_uris": {
            "github": f"{FRONTEND_URL}/auth/callback?provider=github",
            "google": f"{FRONTEND_URL}/auth/callback?provider=google"
        }
    }
