import os
from dotenv import load_dotenv
load_dotenv()

print("DEBUG Variables:")
print("GOOGLE_CLIENT_ID:", os.getenv('GOOGLE_CLIENT_ID', 'NOT_FOUND'))
print("GITHUB_CLIENT_ID:", os.getenv('GITHUB_CLIENT_ID', 'NOT_FOUND'))
print("JWT_SECRET:", os.getenv('JWT_SECRET', 'NOT_FOUND'))

# Test OAuth
google_ok = bool(os.getenv('GOOGLE_CLIENT_ID') and os.getenv('GOOGLE_CLIENT_SECRET'))
github_ok = bool(os.getenv('GITHUB_CLIENT_ID') and os.getenv('GITHUB_CLIENT_SECRET'))
jwt_ok = bool(os.getenv('JWT_SECRET'))

print("GOOGLE OK:", google_ok)
print("GITHUB OK:", github_ok) 
print("JWT OK:", jwt_ok)
print("OAUTH ENABLED:", all([google_ok, github_ok, jwt_ok]))
