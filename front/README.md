# Iopeer Frontend

Frontend escalable para la plataforma de agentes IA Iopeer.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm start

# Construir para producción
npm run build
```

## 🏗️ Arquitectura

### Estructura del Proyecto
```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes de UI reutilizables
│   ├── features/        # Componentes específicos de features
│   └── layout/          # Componentes de layout
├── hooks/               # Custom hooks
├── services/            # Servicios API
├── utils/               # Utilidades
├── types/               # Definiciones de tipos (futuro)
└── assets/              # Recursos estáticos
```

### Conexión con Backend

El frontend se conecta automáticamente con el backend de Iopeer en `http://localhost:8000`.

Variables de entorno configurables en `.env`:
- `REACT_APP_API_URL`: URL del backend
- `REACT_APP_AUTO_RECONNECT`: Reconexión automática
- `REACT_APP_POLLING_INTERVAL`: Intervalo de polling

## 🔧 Desarrollo

### Scripts Disponibles

- `npm start`: Servidor de desarrollo
- `npm run build`: Build para producción
- `npm run build:prod`: Build optimizado
- `npm test`: Ejecutar tests
- `npm run analyze`: Analizar bundle size

### Hooks Principales

#### `useIopeer()`
Hook principal para conexión con el backend:

```javascript
const { 
  connectionStatus, 
  agents, 
  systemHealth, 
  connect,
  sendMessage 
} = useIopeer();
```

#### `useAgents()`
Hook para gestión de agentes:

```javascript
const { 
  agents, 
  selectedAgent, 
  selectAgent,
  sendMessageToAgent 
} = useAgents();
```

## 🔌 API Integration

### IopeerAPI Service

Servicio centralizado para todas las llamadas al backend:

```javascript
import { iopeerAPI } from './services/iopeerAPI';

// Health check
const health = await iopeerAPI.getHealth();

// Obtener agentes
const agents = await iopeerAPI.getAgents();

// Enviar mensaje
const result = await iopeerAPI.sendMessage(agentId, action, data);
```

### Error Handling

Manejo robusto de errores con `IopeerAPIError`:

```javascript
try {
  const result = await iopeerAPI.sendMessage(agentId, action, data);
} catch (error) {
  if (error instanceof IopeerAPIError) {
    console.error('API Error:', error.status, error.message);
  }
}
```

## 🎨 Componentes UI

### ErrorBoundary
Captura errores de React y muestra interfaz de recuperación.

### LoadingSpinner
Indicador de carga reutilizable con diferentes tamaños.

### IopeerLayout
Layout principal con header, sidebar y área de contenido.

### AgentCard
Tarjeta para mostrar información de agentes con acciones.

### ConnectionStatus
Componente para mostrar el estado de conexión con el backend.

## 📱 Responsive Design

El frontend está optimizado para:
- Desktop (1024px+)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

## 🔒 Seguridad

- Validación de entrada en el frontend
- Sanitización de datos
- Timeout de requests automático
- Error boundaries para recuperación

## 📊 Performance

### Optimizaciones Implementadas

- Lazy loading de componentes
- Memoización con React.memo
- Debounce en búsquedas
- Bundle splitting automático

### Métricas Objetivo

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: < 500KB gzipped

## 🚀 Deploy

### Desarrollo
```bash
npm start
```

### Producción
```bash
npm run build:prod
npx serve -s build
```

### Docker
```bash
docker build -t iopeer-frontend .
docker run -p 3000:80 iopeer-frontend
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch
3. Commit cambios
4. Push a la branch
5. Crear Pull Request

## 📄 Licencia

MIT - ver [LICENSE](LICENSE) para detalles.
