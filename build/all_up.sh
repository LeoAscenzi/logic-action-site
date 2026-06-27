#!/bin/bash
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

echo "All services up."
