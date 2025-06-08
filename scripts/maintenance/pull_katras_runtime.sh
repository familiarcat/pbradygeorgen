#!/bin/bash

echo "🔄 Pulling katras from remote ArangoDB..."

# Load environment variables
ARANGODB_HOST="${ARANGODB_HOST:-http://localhost:8529}"
ARANGODB_USERNAME="${ARANGODB_USERNAME:-root}"
ARANGODB_PASSWORD="${ARANGODB_PASSWORD:-password}"
DATABASE_NAME="${DATABASE_NAME:-alexai}"
COLLECTION_NAME="${COLLECTION_NAME:-katras}"

BACKUP_DIR="./alexai/katras"

mkdir -p "$BACKUP_DIR"

echo "📥 Fetching documents from ArangoDB..."

curl -s -u "$ARANGODB_USERNAME:$ARANGODB_PASSWORD" \
  "$ARANGODB_HOST/_db/$DATABASE_NAME/_api/document/$COLLECTION_NAME" \
  | jq -c '.[]' \
  | while read -r doc; do
      name=$(echo "$doc" | jq -r '.name' | sed 's/ /_/g')
      echo "$doc" > "$BACKUP_DIR/$name.katra.json"
      echo "✅ Saved: $name.katra.json"
  done

echo "🚀 All katras pulled into $BACKUP_DIR"
