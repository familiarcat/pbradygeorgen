#!/bin/bash

# ┌──────────────────────────────────────────────────────────────┐
# │ Multiship Katra Continuity & Shared Knowledge Core Setup     │
# └──────────────────────────────────────────────────────────────┘

set -euo pipefail

echo "🛸 Initializing Multiship Katra Continuity Strategy..."

# CONFIGURATION
SHARED_DB_NAME="AlexAI_Knowledge_Core"
SHIP_REGISTRY_FILE="alexai/ship_registry.json"
KATRA_BUNDLE_PATH="alexai/katra_bundle.md"
ARANGO_HOST="${ARANGODB_HOST:-http://localhost:8529}"
ARANGO_USER="${ARANGODB_USERNAME:-root}"
ARANGO_PASS="${ARANGODB_PASSWORD:-}"

# FUNCTION: Ensure DB exists
ensure_db_exists() {
  echo "🔍 Checking if shared ArangoDB '$SHARED_DB_NAME' exists..."

  if ! curl -s -u "$ARANGO_USER:$ARANGO_PASS" "$ARANGO_HOST/_db/_system/_api/database" | grep -q "$SHARED_DB_NAME"; then
    echo "🧱 Creating shared ArangoDB database: $SHARED_DB_NAME"
    curl -s -u "$ARANGO_USER:$ARANGO_PASS" -X POST "$ARANGO_HOST/_api/database" \
      -H 'Content-Type: application/json' \
      -d '{"name":"'"$SHARED_DB_NAME"'","users":[{"username":"'"$ARANGO_USER"'"}]}'
  else
    echo "✅ Shared DB '$SHARED_DB_NAME' already exists."
  fi
}

# FUNCTION: Load katras
load_katras() {
  echo "📥 Importing katras from $KATRA_BUNDLE_PATH into $SHARED_DB_NAME..."

  if [ ! -f "$KATRA_BUNDLE_PATH" ]; then
    echo "❌ Katra bundle not found at $KATRA_BUNDLE_PATH"
    exit 1
  fi

  node scripts/arango/import_katra_bundle.js "$KATRA_BUNDLE_PATH" "$ARANGO_HOST" "$SHARED_DB_NAME" "$ARANGO_USER" "$ARANGO_PASS"
}

# FUNCTION: Register ships
register_ships() {
  echo "🛳️ Registering ships from $SHIP_REGISTRY_FILE..."

  if [ ! -f "$SHIP_REGISTRY_FILE" ]; then
    echo "⚠️ Ship registry not found, skipping registration."
    return
  fi

  node scripts/arango/register_ships.js "$SHIP_REGISTRY_FILE" "$ARANGO_HOST" "$SHARED_DB_NAME" "$ARANGO_USER" "$ARANGO_PASS"
}

# MAIN
ensure_db_exists
load_katras
register_ships

echo "🧠 Multiship Katra Continuity established successfully."
