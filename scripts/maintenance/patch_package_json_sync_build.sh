#!/bin/bash

echo "🛠️ Patching package.json to include katra sync in build process..."

# Create a backup
cp package.json package.json.bak
echo "📦 Backup of package.json created at package.json.bak"

# Use jq to modify the build script safely
if command -v jq >/dev/null 2>&1; then
  tmpfile=$(mktemp)
  jq '.scripts.build = "bash ./scripts/runtime/pull_katras_runtime.sh && bash ./scripts/runtime/sync_katras_runtime.sh && next build"' package.json > "$tmpfile" && mv "$tmpfile" package.json
  echo "✅ package.json 'build' script updated successfully."
else
  echo "❌ Error: jq is not installed. Please install jq to run this script."
  exit 1
fi
