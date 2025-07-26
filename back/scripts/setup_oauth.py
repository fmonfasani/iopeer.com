# scripts/setup_oauth.py - Script para verificar configuración OAuth
import os
import asyncio
import httpx
from pathlib import Path

def check_env_vars():
    """Verificar variables de entorno necesarias"""
    required_vars = [
        "GOOGLE_CLIENT_ID",
        "GOOGLE_CLIENT_SECRET", 
        "GITHUB_CLIENT_ID",
        "GITHUB_CLIENT_SECRET",
        "JWT_SECRET"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Variables de entorno faltantes:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n💡 Agrégalas al archivo .env")
        return False
    
    print("✅ Todas las variables de entorno están configuradas")
    return True

async def test_oauth_endpoints():
    """Probar endpoints OAuth"""
    base_url = "http://localhost:8000"
    
    try:
        async with httpx.AsyncClient() as client:
            # Test status endpoint
            response = await client.get(f"{base_url}/auth/oauth/status")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ OAuth Status: {data}")
                
                if data.get("oauth_enabled"):
                    print("✅ OAuth está habilitado")
                else:
                    print("❌ OAuth no está habilitado")
                    
            else:
                print(f"❌ Error obteniendo status: {response.status_code}")
                
    except Exception as e:
        print(f"❌ Error conectando con backend: {e}")
        print("💡 Asegúrate de que el backend esté ejecutándose en http://localhost:8000")

def print_setup_instructions():
    """Mostrar instrucciones de configuración"""
    print("\n" + "="*60)
    print("🔧 INSTRUCCIONES DE CONFIGURACIÓN OAUTH")
    print("="*60)
    
    print("\n📱 GOOGLE OAUTH:")
    print("1. Ve a https://console.cloud.google.com/")
    print("2. Crear/seleccionar proyecto")
    print("3. Habilitar Google+ API")
    print("4. Credentials → Create Credentials → OAuth 2.0 Client ID")
    print("5. Web application")
    print("6. Authorized redirect URIs:")
    print("   http://localhost:8000/auth/oauth/google/callback")
    
    print("\n🐙 GITHUB OAUTH:")
    print("1. Ve a https://github.com/settings/developers")
    print("2. New OAuth App")
    print("3. Authorization callback URL:")
    print("   http://localhost:8000/auth/oauth/github/callback")
    
    print("\n📝 VARIABLES DE ENTORNO (.env):")
    print("GOOGLE_CLIENT_ID=tu_google_client_id")
    print("GOOGLE_CLIENT_SECRET=tu_google_client_secret")
    print("GITHUB_CLIENT_ID=tu_github_client_id")
    print("GITHUB_CLIENT_SECRET=tu_github_client_secret")
    print("JWT_SECRET=tu_jwt_secret_super_secreto")
    print("FRONTEND_URL=http://localhost:3000")
    print("BACKEND_URL=http://localhost:8000")

async def main():
    print("🔍 Verificando configuración OAuth...")
    
    # Check environment variables
    env_ok = check_env_vars()
    
    if env_ok:
        print("\n🌐 Probando endpoints OAuth...")
        await test_oauth_endpoints()
    
    # Always show setup instructions
    print_setup_instructions()
    
    print("\n" + "="*60)
    print("✅ PRÓXIMOS PASOS:")
    print("1. Configura las aplicaciones OAuth (Google/GitHub)")
    print("2. Agrega las variables al archivo .env")
    print("3. Reinicia el backend: make run")
    print("4. Prueba login en: http://localhost:3000/login")
    print("="*60)

if __name__ == "__main__":
    asyncio.run(main())