# back/agenthub/auth/__init__.py - ARREGLADO
from fastapi import APIRouter
from .routes import router as auth_router

# Router principal de autenticación
router = APIRouter()

# Incluir rutas básicas de auth (signin, signup)
router.include_router(auth_router, tags=["auth"])

# OAuth routes - importar solo si existen
try:
    from .oauth_routes import router as oauth_router
    router.include_router(oauth_router, prefix="/oauth", tags=["oauth"])
    print("✅ OAuth routes cargadas correctamente")
except ImportError as e:
    print(f"⚠️ OAuth routes no disponibles: {e}")
    # Crear router vacío para OAuth si no existe
    oauth_router = APIRouter()
    
    @oauth_router.get("/github")
    async def github_placeholder():
        return {"message": "OAuth GitHub no configurado"}
        
    @oauth_router.get("/google") 
    async def google_placeholder():
        return {"message": "OAuth Google no configurado"}
    
    router.include_router(oauth_router, prefix="/oauth", tags=["oauth"])