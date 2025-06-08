#!/bin/bash

# 🖖 load_katras_from_bundle.sh
# Date generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Purpose: Load katras from katra_bundle.md and update ArangoDB or local crew state

set -euo pipefail

KATRA_BUNDLE_PATH="${KATRA_BUNDLE_PATH:-alexai/katra_bundle.md}"
CREW_DIR="alexai/katras"
TEMP_JSON="tmp_katra_extract.json"

echo "🧠 Reading katra bundle: $KATRA_BUNDLE_PATH"

# Check that the bundle exists
if [[ ! -f "$KATRA_BUNDLE_PATH" ]]; then
  echo "❌ Error: Katra bundle not found at $KATRA_BUNDLE_PATH"
  exit 1
fi

# Extract katra JSON blocks from the bundle (delimited by ```json and ```)
mkdir -p "$CREW_DIR"
awk '/```json/,/```/' "$KATRA_BUNDLE_PATH" | sed '/```/d' > "$TEMP_JSON"

# Split multiple JSON objects (if present) into individual files
INDEX=0
jq -c '.[]' "$TEMP_JSON" | while read -r katra; do
  NAME=$(echo "$katra" | jq -r '.name // .identity // ("katra_" + ($INDEX | tostring))')
  NAME_LOWER=$(echo "$NAME" | tr '[:upper:]' '[:lower:]' | tr -d ' ')
  FILENAME="$CREW_DIR/${NAME_LOWER}.katra.json"
  echo "$katra" | jq '.' > "$FILENAME"
  echo "✅ Saved katra: $FILENAME"
  INDEX=$((INDEX + 1))
done

# Cleanup
rm -f "$TEMP_JSON"

echo "🖖 All katras successfully loaded and saved to $CREW_DIR"
