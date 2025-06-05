#!/bin/bash

# reset_arangodb_container_with_password.sh
# Stops, removes, and redeploys the ArangoDB container with correct password

CONTAINER_NAME="arangodb"
IMAGE_NAME="arangodb/arangodb:latest"
EXPOSED_PORT="8529"
ARANGO_PASSWORD="alexai2025"

echo "[⚙️  INIT] Resetting ArangoDB Docker container..."

# Check if container is running
RUNNING=$(docker ps -q -f name=$CONTAINER_NAME)

# Stop the container if it's running
if [ -n "$RUNNING" ]; then
    echo "[🛑 STOP] Stopping existing container..."
    docker stop $CONTAINER_NAME
fi

# Remove the container if it exists
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
    echo "[🗑️ REMOVE] Removing old container..."
    docker rm $CONTAINER_NAME
fi

# Start new container with proper root password
echo "[🚀 START] Starting new ArangoDB container with updated password..."
docker run -d \
    --name $CONTAINER_NAME \
    -e ARANGO_ROOT_PASSWORD="$ARANGO_PASSWORD" \
    -p $EXPOSED_PORT:8529 \
    $IMAGE_NAME

if [ $? -ne 0 ]; then
    echo "[❌ ERROR] Failed to start new ArangoDB container."
    exit 1
fi

echo "[✅ DONE] ArangoDB is now running with root password '$ARANGO_PASSWORD'"
echo "🌐 You can now access the UI at: http://localhost:8529"
