#!/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

docker compose \
  -f "$ROOT/docker-compose.yml" \
  -f "$ROOT/docker-compose.nginx-test.yml" \
  down --remove-orphans
