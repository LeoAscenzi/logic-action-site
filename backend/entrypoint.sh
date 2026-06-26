#!/bin/bash
set -e

echo "Running migrations..."
uv run alembic upgrade head

echo "Starting server..."
if [ "${ENVIRONMENT:-dev}" = "production" ]; then
    exec uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
else
    exec uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
fi
