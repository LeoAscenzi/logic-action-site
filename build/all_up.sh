#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="docker compose -f $ROOT/docker-compose.yml"

echo "Building and starting database..."
$COMPOSE up -d --build db

echo "Waiting for database to be healthy..."
until $COMPOSE exec -T db pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done
echo "Database ready."

echo "Starting API..."
$COMPOSE up -d --build api

echo "All services up."
