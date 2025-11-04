#!/bin/bash

# Ruta base del backend
BACKEND_ROUTE="./backend"

# Verifica si el directorio existe
if [ ! -d "$BACKEND_ROUTE" ]; then
  echo "❌ El directorio $BACKEND_ROUTE no existe."
  exit 1
fi

echo "📦 Instalando dependencias con bun en todos los servicios dentro de $BACKEND_ROUTE..."

# Recorre todos los subdirectorios directos dentro de backend
for dir in "$BACKEND_ROUTE"/*/; do
  # Verifica que sea un directorio
  if [ -d "$dir" ]; then
    echo "🚀 Ejecutando bun install en $dir"
    (cd "$dir" && bun install)
  fi
done

if [ ! -d "./client-web" ]; then
  echo "❌ El directorio del cliente web no existe"
  exit 1
fi

echo "📦 Instalando dependencias con pnpm para la web..."
echo "🚀 Ejecutando pnpm install en ./cliente-web"
(cd "./client-web" && pnpm install)

echo "✅ Instalación de dependencias completada."
