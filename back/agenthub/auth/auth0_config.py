import os
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

# Configuración OAuth
config = Config()

oauth = OAuth()

# GitHub OAuth
oauth.register(
    name='github',
    client_id=os.getenv('GITHUB_CLIENT_ID'),
    client_secret=os.getenv('GITHUB_CLIENT_SECRET'),
    server_metadata_url='https://api.github.com/.well-known/oauth_authorization_server',
    client_kwargs={
        'scope': 'user:email'
    }
)

# Google OAuth
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)