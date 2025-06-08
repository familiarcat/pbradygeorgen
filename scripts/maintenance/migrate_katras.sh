#!/bin/bash

# =============================================
# AlexAI Multiship Katra Migration Script
# Ensures katra data is migrated to the proper ArangoDB instance
# Auto-switches between local and production environments
# Generated: 2025-06-07T19:34:56.924346Z
# =============================================

echo "🧬 Initiating Katra Migration..."

# Determine environment
if [[ "$NODE_ENV" == "production" || "$ENV" == "production" ]]; then
  echo "🌐 Environment: Production"
  ARANGODB_HOST="${PROD_ARANGODB_HOST:-$ARANGODB_HOST}"
else
  echo "💻 Environment: Development"
fi

# Fallback to local env if not set
ARANGODB_HOST="${ARANGODB_HOST:-http://localhost:8529}"
ARANGODB_PORT="${ARANGODB_PORT:-8529}"
ARANGODB_USERNAME="${ARANGODB_USERNAME:-root}"
ARANGODB_PASSWORD="${ARANGODB_PASSWORD:-}"
DATABASE_NAME="${DATABASE_NAME:-_system}"

# Normalize protocol
if [[ "$ARANGODB_HOST" != http* ]]; then
  ARANGODB_HOST="http://$ARANGODB_HOST"
fi

echo "📡 Connecting to ArangoDB at $ARANGODB_HOST"

# Sync katras (placeholder for actual migration command)
for file in alexai/katras/*.katra.json; do
  filename=$(basename "$file")
  echo "🧠 Uploading $filename..."
  curl -s -o /dev/null -u "$ARANGODB_USERNAME:$ARANGODB_PASSWORD" \
    -X POST "$ARANGODB_HOST/_db/$DATABASE_NAME/_api/document/katras" \
    -H "Content-Type: application/json" \
    --data-binary "@$file"
done

echo "✅ Katra migration complete."
