#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="docker compose -f $ROOT/docker-compose.yml -f $ROOT/docker-compose.nginx-test.yml --env-file $ROOT/.env.local"

echo "Building and starting database..."
$COMPOSE up -d --build db

echo "Waiting for database to be healthy..."
$COMPOSE up -d --build --wait db
echo "Database ready."

echo "Starting API..."
$COMPOSE up -d --build api

echo "Starting nginx and Metabase..."
$COMPOSE up -d nginx metabase

echo ""
echo "All services up."
echo "  API via nginx : http://localhost:9080"
echo "  API direct    : http://localhost:8000"
echo "  Metabase      : http://localhost:9081  (takes ~60s to boot)"
