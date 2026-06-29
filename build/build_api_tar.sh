#!/usr/bin/env bash
# Build the FastAPI image and export it as a tar for manual deployment.
# Usage:
#   ./build/build_api_tar.sh            → ivy-bridge-api:latest  (prod)
#   ./build/build_api_tar.sh qa         → ivy-bridge-api-qa:latest
#   ./build/build_api_tar.sh my-tag:v2  → my-tag:v2
set -e

cd "$(dirname "$0")/.."  # run from project root

ARG="${1:-}"
if [[ "$ARG" == "qa" ]]; then
    IMAGE="ivy-bridge-api-qa:latest"
elif [[ -n "$ARG" ]]; then
    IMAGE="$ARG"
else
    IMAGE="ivy-bridge-api:latest"
fi

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
echo "To deploy:"
echo "  scp -i ~/.ssh/<key>.pem $TAR ec2-user@<ip>:~/"
echo "  # then on EC2:"
echo "  docker load < ~/$SAFE_NAME.tar"
echo "  docker compose -f ~/docker-compose.prod.yml up -d --no-deps api"
