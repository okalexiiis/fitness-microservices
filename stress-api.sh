#!/usr/bin/env bash
# stress-api.sh
# Uso: ./stress-api.sh [options]
# Por defecto hace GET a http://localhost:4000/api/users
#
# Opciones:
#  -u URL               URL objetivo (default http://localhost:4000/api/users)
#  -c CONCURRENCY       concurrencia (jobs paralelos) (default 50)
#  -d DURATION          duración en segundos (si se setea, ignora -n) (default 10)
#  -n TOTAL_REQUESTS    realiza N requests totales (si no se usa -d)
#  -m METHOD            HTTP method (GET, POST, etc.) (default GET)
#  -H HEADER            header adicional, repetir para varios (ej: -H "Auth: x")
#  -b BODY_FILE         archivo con body para POST/PUT (si aplica)
#  -t TIMEOUT           curl timeout por request en segundos (default 10)
#  -q RATE              tasa aproximada por job en req/s (float) (opcional)
#  -o OUTFILE           guardar respuestas (default /dev/null)
#  -h                   mostrar ayuda
#
# Ejemplo:
#  ./stress-api.sh -u http://localhost:4000/api/users -c 100 -d 30 -H "Authorization: Bearer token"

set -euo pipefail

# Defaults
URL="http://localhost:4000/api/users"
CONCURRENCY=50
DURATION=10
TOTAL_REQUESTS=0
METHOD="GET"
TIMEOUT=10
OUTFILE="/dev/null"
BODY_FILE=""
declare -a HEADERS=()
RATE_PER_JOB=0

# Exportar variables que usarán los subshells
export URL METHOD TIMEOUT OUTFILE BODY_FILE

print_usage() {
  sed -n '1,120p' "$0"
}

while getopts "u:c:d:n:m:H:b:t:q:o:h" opt; do
  case $opt in
    u) URL="$OPTARG" ;;
    c) CONCURRENCY="$OPTARG" ;;
    d) DURATION="$OPTARG" ;;
    n) TOTAL_REQUESTS="$OPTARG" ;;
    m) METHOD="${OPTARG^^}" ;; # uppercase
    H) HEADERS+=("$OPTARG") ;;
    b) BODY_FILE="$OPTARG" ;;
    t) TIMEOUT="$OPTARG" ;;
    q) RATE_PER_JOB="$OPTARG" ;;
    o) OUTFILE="$OPTARG" ;;
    h) print_usage; exit 0 ;;
    *) print_usage; exit 1 ;;
  esac
done

# Validate numeric args
re_is_int='^[0-9]+$'
if ! [[ "$CONCURRENCY" =~ $re_is_int ]]; then echo "ERROR: concurrency debe ser entero"; exit 1; fi
if ! [[ "$DURATION" =~ $re_is_int ]]; then echo "ERROR: duration debe ser entero"; exit 1; fi
if ! [[ "$TOTAL_REQUESTS" =~ $re_is_int ]]; then echo "ERROR: total_requests debe ser entero"; exit 1; fi

# Prepare curl header args
CURL_HDRS=()
for h in "${HEADERS[@]}"; do
  CURL_HDRS+=(-H "$h")
done

# Convertir array a string para exportar (los subshells lo reconstruirán)
export CURL_HDRS_STR=""
for h in "${HEADERS[@]}"; do
  CURL_HDRS_STR+="__HEADER__${h}"
done

# If body provided, validate
if [[ -n "$BODY_FILE" && ! -f "$BODY_FILE" ]]; then
  echo "ERROR: body file no encontrado: $BODY_FILE"
  exit 1
fi

# Statistics counters (will be updated by background jobs; use temp files)
TMPDIR=$(mktemp -d)
export TMPDIR  # IMPORTANTE: exportar para que los subshells puedan acceder

# Crear el archivo de logs inmediatamente
touch "$TMPDIR/records.log"

# Semaphore (FIFO) for concurrency control
SEM="/tmp/.stress_sem_$$"
mkfifo "$SEM"
exec 9<> "$SEM"

# Trap solo para limpiar el FIFO, NO el TMPDIR (lo haremos al final)
trap 'exec 9>&- 9<&-; rm -f "$SEM"' EXIT

# fill the semaphore with tokens equal to concurrency
for ((i=0;i<CONCURRENCY;i++)); do
  printf '\n' >&9
done

echo "Iniciando stress test"
echo "URL: $URL"
echo "METHOD: $METHOD"
echo "CONCURRENCY: $CONCURRENCY"

# Determinar modo: si se especificó -n Y no se cambió -d del default, usar modo contador
USE_DURATION_MODE=true
if [[ "$TOTAL_REQUESTS" -gt 0 ]]; then
  # Si se especificó -n, verificar si -d fue explícitamente cambiado
  # (esto es una limitación, asumimos que si TOTAL_REQUESTS > 0 y DURATION == default, usar contador)
  USE_DURATION_MODE=false
  echo "TOTAL_REQUESTS: $TOTAL_REQUESTS"
else
  echo "DURATION: ${DURATION}s"
fi
echo "Timeout por request: ${TIMEOUT}s"
echo "Salida responses: $OUTFILE"
echo

# Helper: worker that performs a single request and writes status to file
# args: none (reads globals)
worker() {
  local startT endT status code size response
  
  # Reconstruir array de headers desde string
  local -a curl_headers=()
  if [[ -n "$CURL_HDRS_STR" ]]; then
    IFS='__HEADER__' read -ra hdrs <<< "$CURL_HDRS_STR"
    for h in "${hdrs[@]}"; do
      [[ -n "$h" ]] && curl_headers+=(-H "$h")
    done
  fi
  
  startT=$(date +%s.%N)
  # Build curl command
  if [[ -n "$BODY_FILE" ]]; then
    response=$(curl -sS -X "$METHOD" "${curl_headers[@]}" --data-binary @"$BODY_FILE" --max-time "$TIMEOUT" -w "%{http_code} %{size_download}" -o "$OUTFILE" "$URL" 2>&1) || true
  else
    response=$(curl -sS -X "$METHOD" "${curl_headers[@]}" --max-time "$TIMEOUT" -w "%{http_code} %{size_download}" -o "$OUTFILE" "$URL" 2>&1) || true
  fi
  # response format: "200 123"
  code=$(awk '{print $1}' <<<"$response" 2>/dev/null || echo "ERR")
  size=$(awk '{print $2}' <<<"$response" 2>/dev/null || echo "0")
  endT=$(date +%s.%N)
  # save one line: code start end size
  printf "%s %s %s\n" "$code" "$startT" "$endT" >> "$TMPDIR/records.log"
}

# Exportar la función para que esté disponible en subshells
export -f worker

# Runner: either time-limited or count-limited
start_time=$(date +%s.%N)
end_time=$start_time

if [[ "$USE_DURATION_MODE" == "false" ]]; then
  # Run until reach TOTAL_REQUESTS
  sent=0
  echo "Modo: Conteo de requests (${TOTAL_REQUESTS} total)"
  while (( sent < TOTAL_REQUESTS )); do
    # acquire token
    read -r -u 9 || true
    {
      worker
      # release token
      printf '\n' >&9
    } &  # background
    sent=$((sent+1))
    # optional rate limiting per job
    if (( $(awk -v r="$RATE_PER_JOB" 'BEGIN{print (r > 0)}') )); then
      # sleep small amount to approximate rate per job
      sleep_time=$(awk -v r="$RATE_PER_JOB" 'BEGIN{print 1.0/r}')
      sleep "$sleep_time"
    fi
  done
  echo "Esperando que completen todos los workers..."
  wait
else
  # Time-limited run
  echo "Modo: Duración (${DURATION}s)"
  stop_time=$(awk -v s="$(date +%s.%N)" -v d="$DURATION" 'BEGIN{print s + d}')
  while (( $(awk -v a="$(date +%s.%N)" -v b="$stop_time" 'BEGIN{print (a < b)}') )); do
    # acquire token
    read -r -u 9 || true
    {
      worker
      # release token
      printf '\n' >&9
    } &  # background
    # small scheduling yield
    sleep 0.001
  done
  echo "Esperando que completen todos los workers..."
  wait
fi

# All jobs finished; compute stats
end_time=$(date +%s.%N)
total_requests=$(wc -l < "$TMPDIR/records.log" 2>/dev/null || echo 0)
duration_real=$(awk -v s="$start_time" -v e="$end_time" 'BEGIN{print e - s}')
rps=$(awk -v t="$total_requests" -v d="$duration_real" 'BEGIN{ if (d>0) printf("%.2f", t/d); else print "0"}')

echo
echo "===== Resultados ====="
echo "Total requests: $total_requests"
echo "Duración real (s): $duration_real"
echo "Requests/sec (aprox): $rps"
echo

# Count per status code
if [[ -f "$TMPDIR/records.log" ]]; then
  echo "Estado HTTP - Conteo:"
  awk '{print $1}' "$TMPDIR/records.log" | sort | uniq -c | sort -rn | awk '{printf "%s -> %s\n", $2, $1}'
  
  # Latencias: compute percentiles (p50,p90,p99) from (end-start)
  awk '{lat = $3 - $2; printf("%.6f\n", lat)}' "$TMPDIR/records.log" | sort -n > "$TMPDIR/lats.sorted"
  if [[ -s "$TMPDIR/lats.sorted" ]]; then
    count=$(wc -l < "$TMPDIR/lats.sorted")
    p50_line=$(( (count*50+99)/100 ))
    p90_line=$(( (count*90+99)/100 ))
    p99_line=$(( (count*99+99)/100 ))
    p50=$(sed -n "${p50_line}p" "$TMPDIR/lats.sorted")
    p90=$(sed -n "${p90_line}p" "$TMPDIR/lats.sorted")
    p99=$(sed -n "${p99_line}p" "$TMPDIR/lats.sorted")
    echo
    echo "Latencias (segundos):"
    printf "p50: %s\np90: %s\np99: %s\n" "$p50" "$p90" "$p99"
  fi
else
  echo "No se generaron registros de requests."
fi

echo
echo "Logs temporales en: $TMPDIR/records.log"
echo "Fin."

# Limpiar TMPDIR al final
rm -rf "$TMPDIR"