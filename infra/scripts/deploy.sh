#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")"/.. && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yml"
ENV_FILE="$ROOT_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[deploy] Missing $ENV_FILE. Copy infra/env.example to infra/.env and fill secrets." >&2
  exit 1
fi

export DOCKER_BUILDKIT=1

echo "[deploy] Building images..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build

echo "[deploy] Starting stack..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d

echo "[deploy] Current service status:"
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
