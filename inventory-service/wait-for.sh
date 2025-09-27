#!/bin/sh
# wait-for.sh
# Script para esperar a que un host:puerto esté disponible antes de continuar

set -e

HOST="$1"
PORT="$2"
shift 2
CMD="$@"

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  echo "Uso: $0 host puerto comando..."
  exit 1
fi

echo "Esperando a que $HOST:$PORT esté disponible..."

# Intentar conexión hasta que funcione
while ! nc -z "$HOST" "$PORT" >/dev/null 2>&1; do
  sleep 1
done

echo "$HOST:$PORT está disponible, ejecutando comando..."
exec $CMD