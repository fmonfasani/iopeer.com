# back/agenthub/auth/oauth_config.py - CREAR ARCHIVO
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración OAuth simple (sin authlib por ahora para evitar problemas)
OAUTH_CONFIG = {
    'github': {
        'client_id': os.getenv('GITHUB_CLIENT_ID', 'not-configured'),
        'client_secret': os.getenv('GITHUB_CLIENT_SECRET', 'not-configured'),
        'authorize_url': 'https://github.com/login/oauth/authorize',
        'token_url': 'https://github.com/login/oauth/access_token',
        'scope': 'user:email'
    },
    'google': {
        'client_id': os.getenv('GOOGLE_CLIENT_ID', 'not-configured'),
        'client_secret': os.getenv('GOOGLE_CLIENT_SECRET', 'not-configured'),
        'authorize_url': 'https://accounts.google.com/o/oauth2/v2/auth',
        'token_url': 'https://oauth2.googleapis.com/token',
        'scope': 'openid email profile'
    }
}

def get_oauth_config(provider):
    """Obtiene configuración OAuth para un provider"""
    return OAUTH_CONFIG.get(provider)