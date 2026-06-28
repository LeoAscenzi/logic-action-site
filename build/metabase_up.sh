#!/bin/bash
set -euo pipefail

CONTAINER_NAME="logic-action-metabase"
NETWORK="logic-action-site_default"
VOLUME="metabase_data"

# Warn if the compose network isn't up yet
if ! docker network inspect "$NETWORK" > /dev/null 2>&1; then
  echo "Warning: network '$NETWORK' not found — run ./all_up.sh first so Metabase can reach the db container."
  echo "Starting anyway (you can reconnect later with: docker network connect $NETWORK $CONTAINER_NAME)"
fi

# If already running, nothing to do
if docker ps -q -f name="^${CONTAINER_NAME}$" | grep -q .; then
  echo "Metabase is already running → http://localhost:8001"
  exit 0
fi

# If stopped (container exists but isn't running), just start it
if docker ps -aq -f name="^${CONTAINER_NAME}$" | grep -q .; then
  echo "Restarting existing Metabase container..."
  docker start "$CONTAINER_NAME"
else
  # First run — create the container with a persistent volume
  echo "Creating Metabase container..."
  docker run -d \
    --name "$CONTAINER_NAME" \
    --restart unless-stopped \
    --network "$NETWORK" \
    -p 8001:3000 \
    -v "${VOLUME}:/metabase-data" \
    -e MB_DB_FILE=/metabase-data/metabase.db \
    -e MB_ANALYTICS_TRACKING=false \
    -e MB_SITE_NAME="Logic Action" \
    metabase/metabase:latest
fi

echo "Waiting for Metabase to start..."
until curl --output /dev/null --silent --head --fail http://localhost:8001; do
  printf '.'
  sleep 3
done

echo -e "\nMetabase is ready → http://localhost:8001"
