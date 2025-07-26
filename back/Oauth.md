# 🔐 Configuración OAuth - Google y GitHub

Esta guía te ayudará a configurar autenticación OAuth con Google y GitHub en IOPeer.

## 📋 Requisitos Previos

- Cuenta de Google (para Google Cloud Console)
- Cuenta de GitHub (para GitHub Developer Settings)
- Backend y frontend ejecutándose localmente

## 🚀 Configuración Paso a Paso

### **1. Configurar Google OAuth**

#### 1.1 Crear proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API**:
   - API & Services → Library → buscar "Google+ API" → Enable

#### 1.2 Crear OAuth 2.0 Client ID
1. Ve a **API & Services → Credentials**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Configurar:
   - **Application type**: Web application
   - **Name**: IOPeer
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:8000/auth/oauth/google/callback`

#### 1.3 Obtener credenciales
1. Copia el **Client ID** y **Client Secret**
2. Guárdalos para el paso de variables de entorno

### **2. Configurar GitHub OAuth**

#### 2.1 Crear OAuth App
1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Configurar:
   - **Application name**: IOPeer
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:8000/auth/oauth/github/callback`

#### 2.2 Obtener credenciales
1. Copia el **Client ID**
2. Genera y copia el **Client Secret**

### **3. Configurar Variables de Entorno**

#### 3.1 Crear archivo .env en la raíz del proyecto
```bash
# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# GitHub OAuth  
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# JWT Secret (genera uno seguro)
JWT_SECRET=tu_jwt_secret_super_secreto_cambiame_en_produccion
```

#### 3.2 Crear front/.env para el frontend
```bash
REACT_APP_API_URL=http://localhost:8000
```

### **4. Instalar Dependencias**

#### 4.1 Backend
```bash
cd back
pip install -r requirements.txt
```

#### 4.2 Frontend (si es necesario)
```bash
cd front
npm install
```

### **5. Ejecutar y Probar**

#### 5.1 Ejecutar Backend
```bash
# Opción 1: Con Make
make run

# Opción 2: Directamente
cd back
python -m agenthub.main
```

#### 5.2 Ejecutar Frontend
```bash
# Opción 1: Con Make
make run-front

# Opción 2: Directamente
cd front
npm start
```

#### 5.3 Probar OAuth
1. Ve a `http://localhost:3000/login`
2. Click en los botones de Google o GitHub
3. Deberías ser redirigido y autenticado

### **6. Verificar Configuración**

#### 6.1 Usar script de verificación
```bash
cd scripts
python setup_oauth.py
```

#### 6.2 Usar componente de debug
1. Ve a `http://localhost:3000/debug/oauth` (si está configurado)
2. Verifica que los estados sean ✅

## 🐛 Troubleshooting

### Error: "oauth_not_configured"
- Verifica que todas las variables de entorno estén configuradas
- Ejecuta `python scripts/setup_oauth.py` para verificar

### Error: "redirect_uri_mismatch"
- Verifica que las URLs de callback coincidan exactamente:
  - Google: `http://localhost:8000/auth/oauth/google/callback`
  - GitHub: `http://localhost:8000/auth/oauth/github/callback`

### Error: "invalid_client"
- Verifica que Client ID y Client Secret sean correctos
- Asegúrate de no haber copiado espacios extras

### Error: "no_email"
- En GitHub, verifica que tu email sea público o que la app tenga permisos de email
- En Google, verifica que el scope incluya "email"

### Backend no responde
- Verifica que esté ejecutándose en puerto 8000
- Ejecuta `curl http://localhost:8000/health` para verificar

## 🔒 Seguridad

### Para Producción:
1. **Cambiar JWT_SECRET**: Usa un secret criptográficamente seguro
2. **HTTPS**: Configurar certificados SSL
3. **Dominios**: Actualizar redirect URIs a tu dominio real
4. **Variables**: Usar variables de entorno seguras (no en código)

### URLs de Producción:
```bash
# Ejemplo para dominio real
FRONTEND_URL=https://tu-dominio.com
BACKEND_URL=https://api.tu-dominio.com

# Google/GitHub redirect URIs:
https://api.tu-dominio.com/auth/oauth/google/callback
https://api.tu-dominio.com/auth/oauth/github/callback
```

## 📚 Endpoints OAuth

### Backend Endpoints:
- `GET /auth/oauth/status` - Estado de configuración
- `GET /auth/oauth/google` - Iniciar login Google
- `GET /auth/oauth/github` - Iniciar login GitHub  
- `GET /auth/oauth/google/callback` - Callback Google
- `GET /auth/oauth/github/callback` - Callback GitHub

### Frontend Flow:
1. Usuario click en botón OAuth → `loginWithGoogle()` / `loginWithGitHub()`
2. Redirect a backend OAuth URL
3. Redirect a proveedor (Google/GitHub)
4. Usuario autoriza en proveedor
5. Callback a backend con código
6. Backend intercambia código por token
7. Backend obtiene info del usuario
8. Backend genera JWT propio
9. Redirect a frontend con JWT
10. Frontend guarda token y actualiza estado

## ✅ Checklist Final

- [ ] Google OAuth App configurada
- [ ] GitHub OAuth App configurada  
- [ ] Variables .env configuradas
- [ ] Backend ejecutándose en puerto 8000
- [ ] Frontend ejecutándose en puerto 3000
- [ ] Endpoints `/auth/oauth/status` responden
- [ ] Login con Google funciona
- [ ] Login con GitHub funciona
- [ ] Tokens JWT se generan correctamente
- [ ] Usuario se guarda en localStorage
- [ ] Redirect post-login funciona

¡Listo! Tu OAuth debería estar funcionando. 🎉