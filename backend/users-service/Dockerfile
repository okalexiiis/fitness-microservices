FROM oven/bun:1-alpine

WORKDIR /app

# Copia solo package.json primero (para cache de dependencias)
COPY package.json bun.lockb* ./

# Instala dependencias
RUN bun install

# El código se montará como volumen, no lo copies aquí
# COPY . . ❌ NO HAGAS ESTO en desarrollo

EXPOSE 4001

ENV NODE_ENV=development

# Hot reload funcionará porque el código viene del volumen
CMD ["bun", "run", "dev"]