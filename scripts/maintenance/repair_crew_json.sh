#!/bin/bash

INPUT_FILE="alexai/crew/crew.json"
BACKUP_FILE="alexai/crew/crew.json.bak"
OUTPUT_FILE="alexai/crew/crew_repaired.json"

echo "📦 Backing up current crew.json..."
cp "$INPUT_FILE" "$BACKUP_FILE" || {
    echo "❌ Could not back up $INPUT_FILE"
    exit 1
}

echo "🔍 Scanning for valid crew members..."
VALID_CREW=()
while read -r line; do
    # Strip trailing commas and whitespace
    clean_line=$(echo "$line" | sed 's/[[:space:]]*,[[:space:]]*$//' | tr -d '\n')
    if [[ "$clean_line" == "{"* ]]; then
        echo "$clean_line" | jq . >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            name=$(echo "$clean_line" | jq -r '.name // empty')
            if [ -n "$name" ]; then
                VALID_CREW+=("$clean_line")
            fi
        fi
    fi
done <"$INPUT_FILE"

echo "✅ Found ${#VALID_CREW[@]} valid crew members"

echo "[" >"$OUTPUT_FILE"
for i in "${!VALID_CREW[@]}"; do
    if [ "$i" -lt $((${#VALID_CREW[@]} - 1)) ]; then
        echo "${VALID_CREW[$i]}," >>"$OUTPUT_FILE"
    else
        echo "${VALID_CREW[$i]}" >>"$OUTPUT_FILE"
    fi
done
echo "]" >>"$OUTPUT_FILE"

echo "🚀 Output written to $OUTPUT_FILE"
echo "🩺 Please copy it to overwrite crew.json if it looks correct:"
echo "    cp $OUTPUT_FILE $INPUT_FILE"
