# backend/agenthub/auth/oauth_config.py (REEMPLAZAR auth0_config.py)
import os
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

load_dotenv()

# Configuración OAuth
config = Config('.env')

oauth = OAuth(config)

# GitHub OAuth
oauth.register(
    name='github',
    client_id=os.getenv('GITHUB_CLIENT_ID', 'your-github-client-id'),
    client_secret=os.getenv('GITHUB_CLIENT_SECRET', 'your-github-client-secret'),
    server_metadata_url='https://api.github.com/.well-known/oauth_authorization_server',
    client_kwargs={
        'scope': 'user:email'
    }
)

# Google OAuth  
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID', 'your-google-client-id'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET', 'your-google-client-secret'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)