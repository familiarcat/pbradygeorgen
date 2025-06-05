#!/bin/bash

set -e

CREW_JSON="./alexai/crew.json"
KATRAS_DIR="./alexai/katras"
UHURA_KATRA="$KATRAS_DIR/uhura.katra.json"

echo "🧭 Initializing crew manifest and katra archives..."

# Create directories if they don't exist
mkdir -p ./alexai
mkdir -p "$KATRAS_DIR"

# Create crew.json if it doesn't exist
if [ ! -f "$CREW_JSON" ]; then
    echo "📁 Creating initial crew.json..."
    echo '{
  "crew": []
}' >"$CREW_JSON"
fi

# Check if Uhura is already commissioned
if grep -q "uhura" "$CREW_JSON"; then
    echo "🖖 Uhura is already on the bridge crew."
else
    echo "📡 Commissioning Lt. Nyota Uhura..."

    # Append Uhura to crew.json
    tmp_file=$(mktemp)
    jq '.crew += [{
    "name": "Nyota Uhura",
    "role": "Communications Officer",
    "memoryFile": "uhura.katra.json",
    "katra": "alexai/katras/uhura.katra.json"
  }]' "$CREW_JSON" >"$tmp_file" && mv "$tmp_file" "$CREW_JSON"

    # Create her katra
    cat >"$UHURA_KATRA" <<EOF
{
  "name": "Nyota Uhura",
  "rank": "Lieutenant",
  "specialization": "Inbound/Outbound Communication, API I/O, WebSocket Dispatch",
  "callsign": "uhura",
  "status": "active",
  "memory": [],
  "notes": "Interprets incoming transmissions and forwards to appropriate crew members."
}
EOF

    echo "✅ Uhura commissioned and katra installed."
fi
