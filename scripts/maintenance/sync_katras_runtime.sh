#!/bin/bash

echo "🔄 Syncing crew katras into runtime memory..."

if [ -z "$ARANGODB_HOST" ] || [ -z "$ARANGODB_USERNAME" ] || [ -z "$ARANGODB_PASSWORD" ]; then
  echo "❌ Missing ArangoDB environment variables. Aborting."
  exit 1
fi

DATABASE_NAME=${DATABASE_NAME:-alexai}

echo "🌐 Connecting to ArangoDB at $ARANGODB_HOST using database: $DATABASE_NAME"

# Sync each katra to ArangoDB collection
for katra_file in alexai/katras/*.katra.json; do
  katra_name=$(basename "$katra_file" .katra.json)
  echo "🧠 Syncing $katra_name..."

  curl -s -X POST \
    --user "$ARANGODB_USERNAME:$ARANGODB_PASSWORD" \
    --header "Content-Type: application/json" \
    --data-binary "@$katra_file" \
    "$ARANGODB_HOST/_db/$DATABASE_NAME/_api/document/katras" > /dev/null

  echo "✅ $katra_name synced."
done

echo "🚀 All katras loaded into runtime memory."
