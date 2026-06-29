#!/usr/bin/env bash
# Build the FastAPI image and export it as a tar for manual deployment.
# Usage: ./build/build_api_tar.sh [tag]
# Default tag: ivy-bridge-api-qa:latest
set -e

cd "$(dirname "$0")/.."  # run from project root

IMAGE="${1:-ivy-bridge-api-qa:latest}"
TARGETS_DIR="build/targets"

mkdir -p "$TARGETS_DIR"

echo "==> Building $IMAGE from ./backend..."
docker build -t "$IMAGE" ./backend

SAFE_NAME="${IMAGE//:/-}"
TAR="$TARGETS_DIR/$SAFE_NAME.tar"

echo "==> Saving image to $TAR..."
docker save "$IMAGE" > "$TAR"

echo ""
echo "Done."
echo "  Image : $IMAGE"
echo "  Tar   : $TAR ($(du -sh "$TAR" | cut -f1))"
echo ""
echo "To load on the target host:"
echo "  docker load < $TAR"
echo "  docker run -d --name api -p 8000:8000 \\"
echo "    -e POSTGRES_HOST=<rds-endpoint> \\"
echo "    -e POSTGRES_PORT=5432 \\"
echo "    -e POSTGRES_USER=<user> \\"
echo "    -e POSTGRES_PASSWORD=<password> \\"
echo "    -e POSTGRES_DB=logicaction \\"
echo "    -e SECRET_KEY=<key> \\"
echo "    -e ALLOWED_ORIGINS=<origins> \\"
echo "    -e ENVIRONMENT=qa \\"
echo "    $IMAGE"
