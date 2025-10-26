# Usa la última versión de Bun (Alpine para menor tamaño)
FROM oven/bun:1-alpine AS base

# Stage 1: Dependencies
FROM base AS deps
WORKDIR /app

# Copia archivos de dependencias
COPY package.json bun.lockb* ./

# Instala dependencias (producción y desarrollo)
RUN bun install --frozen-lockfile

# Stage 2: Development
FROM base AS dev
WORKDIR /app

# Copia dependencias del stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copia el código fuente
COPY . .

# Expone el puerto
EXPOSE 4003

# Variables de entorno para mejor logging
ENV NODE_ENV=development
ENV LOG_LEVEL=debug

# Comando para desarrollo con hot-reload
CMD ["bun", "run", "--hot", "src/index.ts"]