# 1. IMAGEN BASE DE NODE.JS 20
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias rápido
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copiar todo el código fuente
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3001

CMD ["pnpm", "dev", "-p", "3001"]
