#!/bin/bash

echo "[INFO] Normalizing Katra data models in: ./alexai/katras"
echo "[INFO] Using schema version: 2.0"

KATRA_DIR="../alexai/katras"

for file in "$KATRA_DIR"/*.katra.json; do
    if [[ ! -f "$file" ]]; then
        echo "⚠️  No katra files found in $KATRA_DIR"
        exit 1
    fi

    filename=$(basename -- "$file")
    raw_identity="${filename%%.*}"
    # Capitalize first letter for pattern match
    identity="$(tr '[:lower:]' '[:upper:]' <<<"${raw_identity:0:1}")${raw_identity:1}"

    echo "[PROCESSING] $filename → identity: $identity"

    # Determine species
    case "$identity" in
    Spock) species="Vulcan" ;;
    Picard) species="Human" ;;
    Crusher) species="Human" ;;
    Riker) species="Human" ;;
    Troi) species="Half-Betazoid" ;;
    Geordi) species="Human" ;;
    OBrien | "O'Brien") species="Human" ;;
    Worf) species="Klingon" ;;
    Data) species="Android" ;;
    Quark) species="Ferengi" ;;
    *) species="Unknown" ;;
    esac

    # Update JSON
    tmp_file="$file.tmp"
    jq --arg identity "$identity" \
        --arg species "$species" \
        --arg version "2.0" \
        '
     {
       schemaVersion: $version,
       identity: $identity,
       species: $species,
       coreMemory: .coreMemory
     }
     ' "$file" >"$tmp_file" && mv "$tmp_file" "$file"

    echo "✅ Updated $filename → species: $species"
done
