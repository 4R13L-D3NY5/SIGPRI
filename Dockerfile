# 1. ETAPA DE CONSTRUCCIÓN Y EJECUCIÓN DEL FRONTEND NEXT.JS
FROM node:20-alpine AS base

# Instalar pnpm globalmente
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install --frozen-lockfile || pnpm install

# Copiar todo el código fuente
COPY . .

# Deshabilitar telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Exponer el puerto 3001 para Next.js dev/start
EXPOSE 3001

# Comando por defecto para desarrollo con recarga rápida
CMD ["pnpm", "dev", "-p", "3001"]
