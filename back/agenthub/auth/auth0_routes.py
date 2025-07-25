# backend/agenthub/auth/oauth_routes.py (REEMPLAZAR auth0_routes.py)
import json
import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from .oauth_config import oauth  # CORREGIDO: import correcto
from .utils import create_access_token
from ..database.connection import get_db
from ..models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

@router.get("/github")
async def github_login(request: Request):
    """Iniciar login con GitHub"""
    try:
        redirect_uri = request.url_for('github_callback')
        return await oauth.github.authorize_redirect(request, redirect_uri)
    except Exception as e:
        logger.error(f"Error en GitHub login: {e}")
        raise HTTPException(status_code=500, detail="Error al iniciar login con GitHub")

@router.get("/github/callback")
async def github_callback(request: Request, db: Session = Depends(get_db)):
    """Callback de GitHub OAuth"""
    try:
        # Obtener token de GitHub
        token = await oauth.github.authorize_access_token(request)
        
        # Obtener información del usuario de GitHub
        user_info = await oauth.github.parse_id_token(request, token)
        
        # Si no tenemos user_info del token, hacer request manual
        if not user_info:
            resp = await oauth.github.get('user', token=token)
            user_info = resp.json()
            
            # Obtener email si no está en la respuesta principal
            if not user_info.get('email'):
                emails_resp = await oauth.github.get('user/emails', token=token)
                emails = emails_resp.json()
                primary_email = next((email['email'] for email in emails if email['primary']), None)
                user_info['email'] = primary_email

        if not user_info or not user_info.get('email'):
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=no_email",
                status_code=302
            )

        # Buscar o crear usuario
        user = get_or_create_oauth_user(
            db=db,
            email=user_info['email'],
            provider='github',
            provider_id=str(user_info['id']),
            user_data={
                'full_name': user_info.get('name', ''),
                'avatar_url': user_info.get('avatar_url', ''),
                'login': user_info.get('login', ''),
                'raw_data': user_info
            }
        )

        # Crear token JWT
        access_token = create_access_token({"sub": user.email, "user_id": user.id})
        
        # Redirigir al frontend con el token
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth/callback?token={access_token}&provider=github",
            status_code=302
        )
        
    except Exception as e:
        logger.error(f"Error en GitHub callback: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=github_error",
            status_code=302
        )

@router.get("/google")
async def google_login(request: Request):
    """Iniciar login con Google"""
    try:
        redirect_uri = request.url_for('google_callback')
        return await oauth.google.authorize_redirect(request, redirect_uri)
    except Exception as e:
        logger.error(f"Error en Google login: {e}")
        raise HTTPException(status_code=500, detail="Error al iniciar login con Google")

@router.get("/google/callback")
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """Callback de Google OAuth"""
    try:
        # Obtener token de Google
        token = await oauth.google.authorize_access_token(request)
        user_info = await oauth.google.parse_id_token(request, token)

        if not user_info or not user_info.get('email'):
            return RedirectResponse(
                url=f"{FRONTEND_URL}/login?error=no_email",
                status_code=302
            )

        # Buscar o crear usuario
        user = get_or_create_oauth_user(
            db=db,
            email=user_info['email'],
            provider='google',
            provider_id=user_info['sub'],
            user_data={
                'full_name': user_info.get('name', ''),
                'avatar_url': user_info.get('picture', ''),
                'raw_data': user_info
            }
        )

        # Crear token JWT
        access_token = create_access_token({"sub": user.email, "user_id": user.id})
        
        # Redirigir al frontend con el token
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth/callback?token={access_token}&provider=google",
            status_code=302
        )
        
    except Exception as e:
        logger.error(f"Error en Google callback: {e}")
        return RedirectResponse(
            url=f"{FRONTEND_URL}/login?error=google_error",
            status_code=302
        )

def get_or_create_oauth_user(
    db: Session, 
    email: str, 
    provider: str, 
    provider_id: str, 
    user_data: dict
) -> User:
    """Buscar o crear usuario OAuth - CORREGIDO: función síncrona"""
    
    # Buscar usuario existente por email o provider_id
    user = db.query(User).filter(
        (User.email == email) | 
        ((User.provider == provider) & (User.provider_id == provider_id))
    ).first()
    
    if user:
        # Actualizar datos si el usuario existe
        user.full_name = user_data.get('full_name') or user.full_name
        user.avatar_url = user_data.get('avatar_url') or user.avatar_url
        user.provider_data = json.dumps(user_data.get('raw_data', {}))
        
        # Si el usuario existía con email pero sin provider, actualizar
        if user.provider == 'local' and not user.provider_id:
            user.provider = provider
            user.provider_id = provider_id
            
        db.commit()
        db.refresh(user)
        
    else:
        # Crear nuevo usuario
        user = User(
            email=email,
            full_name=user_data.get('full_name', ''),
            avatar_url=user_data.get('avatar_url', ''),
            provider=provider,
            provider_id=provider_id,
            provider_data=json.dumps(user_data.get('raw_data', {})),
            is_active=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
    return user