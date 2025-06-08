#!/bin/bash

# 🧠 Multiship Katra Continuity Setup Script
# Ensures development and production use a shared ArangoDB instance as the single source of truth.

set -e

# Required environment variables
REQUIRED_VARS=("ARANGODB_USERNAME" "ARANGODB_PASSWORD" "ARANGODB_HOST")

for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "❌ Error: $var is not set in your environment."
    exit 1
  fi
done

# Normalize ARANGODB_HOST to include scheme and port
if [[ "$ARANGODB_HOST" != http* ]]; then
  export ARANGODB_HOST="http://${ARANGODB_HOST}:8529"
fi

echo "🔧 Using ArangoDB at: $ARANGODB_HOST"

# Test connection to ArangoDB
echo "🔍 Verifying connection to ArangoDB..."
curl -s -u "$ARANGODB_USERNAME:$ARANGODB_PASSWORD" "$ARANGODB_HOST/_api/version" > /dev/null

if [[ $? -ne 0 ]]; then
  echo "❌ Error: Failed to connect to ArangoDB at $ARANGODB_HOST"
  exit 1
else
  echo "✅ Connected to ArangoDB successfully."
fi

# Optional: migrate katra data, initialize collections, or sync bundle (placeholders below)
# echo "🚀 Running migration or data sync steps..."
# ./scripts/arango/migrate_katras.sh

echo "🧩 Multiship Katra Continuity verified and ready."

