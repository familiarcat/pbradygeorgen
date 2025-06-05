#!/bin/bash
echo "🛠️ Running maintenance patch: Fixing ArangoDB useDatabase type error..."

TARGET_FILE="./app/api/crew/route.ts"
BACKUP_FILE="${TARGET_FILE}.bak"

# Backup the original file
cp "$TARGET_FILE" "$BACKUP_FILE"
echo "📦 Backup created at $BACKUP_FILE"

# Replace old useDatabase call with correct initialization
sed -i '' 's/db.useDatabase([^)]*)/\/\/ useDatabase removed: now configured in constructor/' "$TARGET_FILE"
sed -i '' 's/const db = new Database({ url: ARANGODB_HOST })/const db = new Database({ url: ARANGODB_HOST, databaseName: "_system" })/' "$TARGET_FILE"

echo "✅ Patch applied successfully to $TARGET_FILE"
