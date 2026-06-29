#!/bin/bash
# Starts only db + api on their direct ports (no nginx, no Metabase).
# Use this when you want a lighter dev stack or need to debug the API directly.
# Frontend BACKEND_URL should point to http://localhost:8000 when using this.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="docker compose -f $ROOT/docker-compose.yml --env-file $ROOT/.env.local"

echo "Building and starting database..."
$COMPOSE up -d --build db

echo "Waiting for database to be healthy..."
$COMPOSE up -d --build --wait db
echo "Database ready."

echo "Starting API..."
$COMPOSE up -d --build api

echo ""
echo "All services up."
echo "  API direct: http://localhost:8000"
