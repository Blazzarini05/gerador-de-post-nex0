#!/usr/bin/env bash
set -euo pipefail

if [ "${1-}" = "" ]; then
  echo "Uso: ./convert-instagram-video.sh caminho/do/arquivo.webm"
  exit 1
fi

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg nao encontrado no sistema."
  exit 1
fi

INPUT="$1"
if [ ! -f "$INPUT" ]; then
  echo "Arquivo nao encontrado: $INPUT"
  exit 1
fi

BASENAME="${INPUT%.*}"
OUTPUT="${BASENAME}-instagram.mp4"

ffmpeg -y \
  -i "$INPUT" \
  -vf "scale='min(1080,iw)':-2" \
  -r 30 \
  -c:v libx264 \
  -pix_fmt yuv420p \
  -preset medium \
  -profile:v high \
  -level 4.0 \
  -movflags +faststart \
  -an \
  "$OUTPUT"

echo "Arquivo gerado: $OUTPUT"
