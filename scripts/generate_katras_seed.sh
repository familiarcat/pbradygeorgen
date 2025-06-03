#!/bin/bash

KATRA_DIR="./alexai/katras"
OUTPUT_FILE="./katras_seed.json"

echo "[GEN] 🧬 Generating katras_seed.json as JSON array from $KATRA_DIR"

# Check if directory exists
if [[ ! -d "$KATRA_DIR" ]]; then
    echo "[ERROR] ❌ Directory not found: $KATRA_DIR"
    exit 1
fi

# Collect files
FILES=("$KATRA_DIR"/*.katra.json)

# Check if any katra files exist
if [[ ! -e "${FILES[0]}" ]]; then
    echo "[ERROR] ❌ No .katra.json files found in $KATRA_DIR"
    exit 1
fi

# Combine into array
jq -s '.' "${FILES[@]}" >"$OUTPUT_FILE"

if [[ $? -eq 0 ]]; then
    echo "[DONE] ✅ katras_seed.json generated at $OUTPUT_FILE"
else
    echo "[ERROR] ❌ Failed to generate katras_seed.json"
fi
