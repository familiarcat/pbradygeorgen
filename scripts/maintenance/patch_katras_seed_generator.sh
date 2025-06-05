#!/bin/bash

echo "[INFO] 🔧 Generating katras_seed.json from alexai/katras..."

KATRA_DIR="./alexai/katras"
OUTPUT_FILE="./katras_seed.json"

# 🔐 Dr. Crusher preflight check
if [ ! -d "$KATRA_DIR" ]; then
    echo "[ERROR] ❌ $KATRA_DIR does not exist."
    exit 1
fi

# 👷 Chief O'Brien: generate a clean, compact JSON array
{
    echo -n "["

    FIRST=1
    for file in "$KATRA_DIR"/*.json; do
        [ $FIRST -eq 0 ] && echo -n ","
        jq -c . "$file" || {
            echo "[ERROR] ❌ Invalid JSON in $file"
            exit 1
        }
        FIRST=0
    done

    echo "]"
} >"$OUTPUT_FILE"

# 🧪 Dr. Crusher's health validation
echo "[SCAN] 🧪 Validating JSON health before upload..."
if ! jq empty "$OUTPUT_FILE" 2>/dev/null; then
    echo "[FAIL] ❌ JSON is malformed. Upload aborted by Dr. Crusher."
    exit 1
fi

echo "✅ Katra seed file created and verified: $OUTPUT_FILE"
