# back/agenthub/auth/oauth_routes.py - IMPLEMENTACIÓN OAUTH REAL
import os
import logging
import httpx
import jwt
from datetime import datetime, timedelta
from urllib.parse import urlencode
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)
router = APIRouter()

# Environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")  
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")

# Check if OAuth is configured
def get_oauth_config():
    """Get OAuth configuration with lazy loading"""
    google_id = os.getenv("GOOGLE_CLIENT_ID")
    google_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    github_id = os.getenv("GITHUB_CLIENT_ID")
    github_secret = os.getenv("GITHUB_CLIENT_SECRET")
        
    oauth_enabled = all([google_id, google_secret, github_id, github_secret])
        
    return {
        "oauth_enabled": oauth_enabled,
        "google_configured": bool(google_id and google_secret),
        "github_configured": bool(github_id and github_secret),
        "google_id": google_id,
        "google_secret": google_secret,
        "github_id": github_id,
        "github_secret": github_secret
    }


class OAuthUser(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: str = None
    provider: str

def generate_jwt_token(user_data: dict) -> str:
    """Generar JWT token para el usuario"""
    payload = {
        "sub": user_data["email"],
        "user_id": user_data["id"],
        "name": user_data["name"],
        "provider": user_data["provider"],
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=7)  # Token válido por 7 días
    }
    
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

@router.get("/status")
async def oauth_status():
    """Status de configuración OAuth"""
    config = get_oauth_config()
    return {
        "oauth_enabled": config["oauth_enabled"],
        "google_configured": config["google_configured"], 
        "github_configured": config["github_configured"],
        "providers": ["google", "github"] if config["oauth_enabled"] else []
    }

#============================================
def get_oauth_config():
    """Get OAuth configuration with lazy loading"""
    google_id = os.getenv("GOOGLE_CLIENT_ID")
    google_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    github_id = os.getenv("GITHUB_CLIENT_ID")
    github_secret = os.getenv("GITHUB_CLIENT_SECRET")
    
    oauth_enabled = all([google_id, google_secret, github_id, github_secret])
    
    if oauth_enabled:
        logger.info("✅ OAuth configurado correctamente")
    else:
        logger.warning("⚠️ OAuth no está completamente configurado")
    
    return {
        "oauth_enabled": oauth_enabled,
        "google_configured": bool(google_id and google_secret),
        "github_configured": bool(github_id and github_secret),
        "google_id": google_id,
        "google_secret": google_secret,
        "github_id": github_id,
        "github_secret": github_secret
    }


# ============================================
# GOOGLE OAUTH
# ============================================

@router.get("/google")
async def google_login():
    config = get_oauth_config()
    if not config["google_configured"]:
        logger.error("Google OAuth no configurado")
        return RedirectResponse(...)
    
    try:
        # Construir URL de autorización de Google
        google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
        
        params = {
           "client_id": config["google_id"],
            "redirect_uri": f"{BACKEND_URL}/auth/oauth/google/callback",
            "scope": "openid email profile",
            "response_type": "code",
            "access_type": "offline",
            "prompt": "select_account"
        }
        
        auth_url = f"{google_auth_url}?{urlencode(params)}"
        
        logger.info(f"Redirecting to Google OAuth: {auth_url}")
        return RedirectResponse(url=auth_url, status_code=302)
        
    except Exception as e:
        logger.error(f"Error initiating Google login: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=google_error",
            status_code=302
        )

@router.get("/google/callback")
async def google_callback(request: Request):
    """Callback de Google OAuth"""
    try:
        code = request.query_params.get("code")
        error = request.query_params.get("error")
        
        if error:
            logger.error(f"Google OAuth error: {error}")
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=google_denied",
                status_code=302
            )
        
        if not code:
            logger.error("No authorization code from Google")
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=no_google_code",
                status_code=302
            )
        
        # Intercambiar código por token
        token_data = await exchange_google_code_for_token(code)
        if not token_data:
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=google_token_failed",
                status_code=302
            )
        
        # Obtener información del usuario
        user_info = await get_google_user_info(token_data["access_token"])
        if not user_info:
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=google_user_failed",
                status_code=302
            )
        
        # Crear usuario y generar JWT
        user_data = {
            "id": user_info["id"],
            "email": user_info["email"],
            "name": user_info["name"],
            "avatar_url": user_info.get("picture"),
            "provider": "google"
        }
        
        jwt_token = generate_jwt_token(user_data)
        
        # Redirigir al frontend con el token
        redirect_url = f"{FRONTEND_URL}/auth/callback?token={jwt_token}&provider=google"
        
        logger.info(f"Google login successful for {user_info['email']}")
        return RedirectResponse(url=redirect_url, status_code=302)
        
    except Exception as e:
        logger.error(f"Google callback error: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=google_callback_error",
            status_code=302
        )

async def exchange_google_code_for_token(code: str):
    """Intercambiar código de Google por token"""
    try:
        token_url = "https://oauth2.googleapis.com/token"
        
        data = {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": f"{BACKEND_URL}/auth/oauth/google/callback"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Google token exchange failed: {response.text}")
                return None
                
    except Exception as e:
        logger.error(f"Error exchanging Google code: {e}")
        return None

async def get_google_user_info(access_token: str):
    """Obtener información del usuario de Google"""
    try:
        user_url = f"https://www.googleapis.com/oauth2/v2/userinfo?access_token={access_token}"
        
        async with httpx.AsyncClient() as client:
            response = await client.get(user_url)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get Google user info: {response.text}")
                return None
                
    except Exception as e:
        logger.error(f"Error getting Google user info: {e}")
        return None

# ============================================
# GITHUB OAUTH
# ============================================

@router.get("/github")
async def github_login():
    config = get_oauth_config()
    if not config["github_configured"]:
        logger.error("GitHub OAuth no configurado")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=github_not_configured",
            status_code=302
        )
    
    try:
        # Construir URL de autorización de GitHub
        github_auth_url = "https://github.com/login/oauth/authorize"
        
        params = {
            "client_id": config["github_id"],
            "redirect_uri": f"{BACKEND_URL}/auth/oauth/github/callback",
            "scope": "user:email",
            "state": "github_oauth"  # Para seguridad adicional
        }
        
        auth_url = f"{github_auth_url}?{urlencode(params)}"
        
        logger.info(f"Redirecting to GitHub OAuth: {auth_url}")
        return RedirectResponse(url=auth_url, status_code=302)
        
    except Exception as e:
        logger.error(f"Error initiating GitHub login: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=github_error",
            status_code=302
        )

@router.get("/github/callback")
async def github_callback(request: Request):
    """Callback de GitHub OAuth"""
    try:
        code = request.query_params.get("code")
        error = request.query_params.get("error")
        
        if error:
            logger.error(f"GitHub OAuth error: {error}")
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=github_denied",
                status_code=302
            )
        
        if not code:
            logger.error("No authorization code from GitHub")
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=no_github_code",
                status_code=302
            )
        
        # Intercambiar código por token
        token_data = await exchange_github_code_for_token(code)
        if not token_data:
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=github_token_failed",
                status_code=302
            )
        
        # Obtener información del usuario
        user_info = await get_github_user_info(token_data["access_token"])
        if not user_info:
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=github_user_failed",
                status_code=302
            )
        
        # Obtener email si no está público
        if not user_info.get("email"):
            email_info = await get_github_user_email(token_data["access_token"])
            user_info["email"] = email_info
        
        if not user_info.get("email"):
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=no_github_email",
                status_code=302
            )
        
        # Crear usuario y generar JWT
        user_data = {
            "id": str(user_info["id"]),
            "email": user_info["email"],
            "name": user_info["name"] or user_info["login"],
            "avatar_url": user_info.get("avatar_url"),
            "provider": "github"
        }
        
        jwt_token = generate_jwt_token(user_data)
        
        # Redirigir al frontend con el token
        redirect_url = f"{FRONTEND_URL}/auth/callback?token={jwt_token}&provider=github"
        
        logger.info(f"GitHub login successful for {user_info['email']}")
        return RedirectResponse(url=redirect_url, status_code=302)
        
    except Exception as e:
        logger.error(f"GitHub callback error: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=github_callback_error",
            status_code=302
        )

async def exchange_github_code_for_token(code: str):
    """Intercambiar código de GitHub por token"""
    try:
        token_url = "https://github.com/login/oauth/access_token"
        
        data = {
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code
        }
        
        headers = {
            "Accept": "application/json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"GitHub token exchange failed: {response.text}")
                return None
                
    except Exception as e:
        logger.error(f"Error exchanging GitHub code: {e}")
        return None

async def get_github_user_info(access_token: str):
    """Obtener información del usuario de GitHub"""
    try:
        user_url = "https://api.github.com/user"
        
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(user_url, headers=headers)
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Failed to get GitHub user info: {response.text}")
                return None
                
    except Exception as e:
        logger.error(f"Error getting GitHub user info: {e}")
        return None

async def get_github_user_email(access_token: str):
    """Obtener email del usuario de GitHub"""
    try:
        email_url = "https://api.github.com/user/emails"
        
        headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(email_url, headers=headers)
            
            if response.status_code == 200:
                emails = response.json()
                # Buscar email primario y verificado
                for email in emails:
                    if email.get("primary") and email.get("verified"):
                        return email["email"]
                # Si no hay primario, tomar el primero verificado
                for email in emails:
                    if email.get("verified"):
                        return email["email"]
                return None
            else:
                logger.error(f"Failed to get GitHub user emails: {response.text}")
                return None
                
    except Exception as e:
        logger.error(f"Error getting GitHub user emails: {e}")
        return None

# ============================================
# UTILIDADES
# ============================================

@router.get("/test")
async def test_oauth():
    """Endpoint de prueba"""
    return {
        "message": "OAuth endpoints working",
        "oauth_enabled": OAUTH_ENABLED,
        "providers": {
            "google": bool(GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET),
            "github": bool(GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET)
        }
    }