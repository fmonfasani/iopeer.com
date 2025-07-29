# 🚀 AgentHub - Marketplace de Agentes IA

<div align="center">

![AgentHub Logo](https://via.placeholder.com/200x80/059669/FFFFFF?text=AgentHub)

**El marketplace líder de agentes IA en Latinoamérica**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com/)

[Demo en Vivo](http://localhost:3000) • [Documentación](http://localhost:8000/docs) • [API](http://localhost:8000) • [Contribuir](#contribuir)

</div>

## ✨ Características

### 🎨 Frontend Moderno
- **React 18** con hooks y contexto
- **Tailwind CSS** para estilos utilitarios
- **Lucide Icons** para iconografía
- **Diseño responsive** móvil-primero
- **Modo oscuro** elegante

### 🤖 Marketplace Completo
- **5,000+ agentes especializados** en 6 categorías
- **Búsqueda inteligente** con filtros avanzados
- **Sistema de ratings** y reseñas
- **Vista grid y lista** adaptable
- **Agentes premium y gratuitos**

### ⚡ Funcionalidades Avanzadas
- **Modal de detalles** completo para cada agente
- **Panel de administración** integrado
- **Estadísticas en tiempo real** animadas
- **Sistema de notificaciones** moderno
- **Integración backend** con Iopeer

### 🏢 Características Enterprise
- **Docker** listo para producción
- **Nginx** optimizado con compresión
- **Health checks** automáticos
- **CI/CD** con GitHub Actions
- **Monitoreo** y logging

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 16+
- npm o yarn
- Docker (opcional)
- Python 3.11+ (para backend)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/agenthub.git
cd agenthub

# Navegar al frontend
cd iopeer/front

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

### 🐳 Con Docker

```bash
# Construir y ejecutar con Docker Compose
docker-compose up --build

# Solo frontend
docker build -t agenthub-frontend .
docker run -p 3000:80 agenthub-frontend
```

## 📖 Scripts Disponibles

### Desarrollo
```bash
# Modo desarrollo con hot reload
npm start

# Con Docker Compose
npm run docker:compose
```

### Producción
```bash
# Build optimizado
npm run build

# Servidor de producción con Docker
npm run docker:compose
```

### Testing
```bash
# Ejecutar tests unitarios
npm test

# Coverage
npm test -- --coverage
```

## 🏗️ Arquitectura

```
agenthub/
├── 🎨 iopeer/front/          # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── features/     # Componentes de funcionalidades
│   │   │   ├── layout/       # Componentes de layout
│   │   │   └── ui/           # Componentes UI base
│   │   ├── hooks/            # Custom hooks
│   │   ├── services/         # Servicios API
│   │   ├── data/             # Datos y constantes
│   │   └── utils/            # Utilidades
│   ├── public/               # Assets públicos
│   └── build/                # Build de producción
├── 🔧 iopeer/back/           # Backend Iopeer
└── 📁 back/scripts/         # Scripts de utilidad
```

### Componentes Principales

#### 🎯 Core Components
- **App.js** - Aplicación principal
- **Header** - Navegación y búsqueda
- **Footer** - Footer empresarial
- **AgentCard** - Tarjeta de agente
- **AgentDetail** - Modal de detalles

#### ⚡ Feature Components
- **SearchFilters** - Filtros avanzados
- **QuickActions** - Acciones rápidas
- **StatsWidget** - Estadísticas animadas
- **ConnectionStatus** - Estado de conexión

#### 🎨 UI Components
- **LoadingStates** - Estados de carga
- **Notifications** - Sistema de notificaciones

## 📡 API Integration

### Iopeer Backend
```javascript
import { useIopeer } from './hooks/useIopeer';

const {
  connectionStatus,
  agents,
  installAgent,
  sendMessage
} = useIopeer();
```

### Endpoints Principales
- `GET /health` - Estado del sistema
- `GET /agents` - Lista de agentes
- `POST /message/send` - Enviar mensaje a agente
- `POST /marketplace/install` - Instalar agente

## 🎨 Personalización

### Temas y Estilos
```css
/* Variables CSS personalizadas */
:root {
  --primary-color: #059669;
  --secondary-color: #06b6d4;
  --background: #0f172a;
  --surface: #1e293b;
}
```

### Configuración
```javascript
// src/config/app.js
export const APP_CONFIG = {
  name: 'AgentHub',
  api: 'http://localhost:8000',
  features: {
    darkMode: true,
    notifications: true,
    analytics: true
  }
};
```

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Componentes y hooks
- **Integration Tests**: Flujos completos
- **E2E Tests**: Scenarios de usuario
- **Performance Tests**: Bundle size y loading

### Ejecutar Tests
```bash
# All tests
npm test

# Specific component
npm test -- AgentCard

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## 📊 Performance

### Métricas Objetivo
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped
- **Lighthouse Score**: > 90

### Optimizaciones
- Code splitting automático
- Lazy loading de componentes
- Compresión gzip/brotli
- Tree shaking
- Image optimization

## 🚀 Deployment

### Variables de Entorno

Las siguientes variables controlan la configuración del frontend. Al menos
`REACT_APP_API_URL` es necesaria para que la aplicación conozca la URL base de la
API.

| Variable            | Descripción                                   |
|---------------------|-----------------------------------------------|
| `REACT_APP_API_URL` | URL base del backend utilizado por el frontend |

#### Desarrollo
```bash
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:8000
REACT_APP_DEBUG=true
```

#### Producción
```bash
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.agenthub.com
REACT_APP_DEBUG=false
```

### Deploy con Docker
```yaml
# docker-compose.production.yml
version: '3.8'
services:
  agenthub:
    image: agenthub-frontend:latest
    ports:
      - "80:80"
    environment:
      - REACT_APP_ENV=production
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas!

### Proceso
1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Desarrollo Local
```bash
# Setup inicial
git clone https://github.com/tuusuario/agenthub.git
cd agenthub/iopeer/front

# Instalar y ejecutar
npm install
npm start
```

### Guidelines
- Seguir convenciones de ESLint
- Escribir tests para nuevas features
- Documentar componentes complejos
- Mantener bundle size optimizado

## 📝 Changelog

### v1.0.0 (2024-01-20)
- ✨ Marketplace completo con 6 categorías
- 🎨 UI moderna con Tailwind CSS
- ⚡ Integración con backend Iopeer
- 🔍 Búsqueda y filtros avanzados
- 📱 Diseño responsive completo
- 🐳 Docker y CI/CD ready

## 📄 Licencia

Este proyecto está bajo la licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Framework frontend
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Iconos
- [Iopeer](../back/) - Backend de agentes IA

---

<div align="center">

**[🏠 Inicio](http://localhost:3000) • [📚 Docs](http://localhost:8000/docs) • [🐛 Issues](https://github.com/tuusuario/agenthub/issues) • [💬 Discussions](https://github.com/tuusuario/agenthub/discussions)**

Hecho con ❤️ para la comunidad de IA en Latinoamérica

</div>
