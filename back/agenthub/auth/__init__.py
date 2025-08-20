# ============================================
# back/agenthub/auth/__init__.py - CORREGIDO
# ============================================

from fastapi import APIRouter
import logging

logger = logging.getLogger(__name__)

# Router principal de autenticación
router = APIRouter()

# ============================================
# INCLUIR RUTAS BÁSICAS DE AUTH
# ============================================

try:
    from .routes import router as auth_router, get_current_user
    router.include_router(auth_router, tags=["auth"])
    router.get_current_user = get_current_user
    logger.info("✅ Auth routes loaded successfully")
except ImportError as e:
    logger.error(f"❌ Failed to load auth routes: {e}")
    raise

# ============================================
# INCLUIR RUTAS OAuth
# ============================================

try:
    from .oauth_routes import router as oauth_router
    router.include_router(oauth_router, prefix="/oauth", tags=["oauth"])
    logger.info("✅ OAuth routes loaded successfully")
except ImportError as e:
    logger.warning(f"⚠️ OAuth routes not available: {e}")

    # Crear router placeholder si oauth_routes no existe
    oauth_router = APIRouter()

    @oauth_router.get("/status")
    async def oauth_status_fallback():
        return {
            "oauth_enabled": False,
            "message": "OAuth system not configured",
            "providers": {
                "github": {"enabled": False, "configured": False},
                "google": {"enabled": False, "configured": False}
            }
        }

    @oauth_router.get("/github")
    async def github_placeholder():
        return {"message": "OAuth GitHub no configurado"}

    @oauth_router.get("/google")
    async def google_placeholder():
        return {"message": "OAuth Google no configurado"}

    router.include_router(oauth_router, prefix="/oauth", tags=["oauth"])
    logger.info("✅ OAuth placeholder routes loaded")

# ============================================
# TESTING ENDPOINT
# ============================================

@router.get("/test")
async def auth_test():
    """Test endpoint para verificar que auth funciona"""
    return {
        "message": "Auth system working",
        "version": "1.0.0",
        "endpoints": [
            "/auth/signin",
            "/auth/signup",
            "/auth/oauth/status",
            "/auth/oauth/github",
            "/auth/oauth/google"
        ]
    }
