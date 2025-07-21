# Multi-stage build para AgentHub Frontend
FROM node:18-alpine AS builder

# Metadata
LABEL maintainer="AgentHub Team"
LABEL description="AgentHub Frontend - Marketplace de Agentes IA"

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build para producción
RUN npm run build

# Etapa de producción con Nginx
FROM nginx:alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Copiar configuración nginx personalizada
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar aplicación construida
COPY --from=builder /app/build /usr/share/nginx/html

# Crear directorio para logs
RUN mkdir -p /var/log/nginx

# Variables de entorno
ENV REACT_APP_API_URL=http://localhost:8000
ENV REACT_APP_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
