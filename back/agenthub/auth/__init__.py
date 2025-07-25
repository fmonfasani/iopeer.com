# backend/agenthub/auth/__init__.py - CORREGIDO
from fastapi import APIRouter
from .routes import router as auth_router
from .oauth_routes import router as oauth_router

# Router principal que combina todas las rutas de auth
router = APIRouter()

# Incluir rutas básicas de auth
router.include_router(auth_router, tags=["auth"])

# Incluir rutas OAuth
router.include_router(oauth_router, prefix="/oauth", tags=["oauth"])