#!/bin/bash

# Chief O'Brien's Commissioning Script for Lt. Commander Nyota Uhura
# Purpose: Add Uhura to the AlexAI Observation Lounge crew manifest, Katra, and system routing
# Roles: Communications Officer — API, WebSocket, I/O handling and triage

set -e

CREW_JSON="alexai/crew.json"
KATRA_DIR="alexai/katras"
MEMORY_DIR="alexai/memory"
PROMPT_DIR="alexai/prompts"

# Step 0: Ensure directories exist
mkdir -p "$KATRA_DIR" "$MEMORY_DIR" "$PROMPT_DIR"

# Step 1: Create crew.json if it doesn't exist
if [ ! -f "$CREW_JSON" ]; then
    echo "📂 crew.json not found, creating fresh manifest at $CREW_JSON..."
    mkdir -p "$(dirname "$CREW_JSON")"
    echo "{}" >"$CREW_JSON"
fi

# Step 2: Add Uhura to the crew manifest
if grep -q '"uhura"' "$CREW_JSON"; then
    echo "🖖 Uhura already listed in crew.json"
else
    echo "📡 Adding Uhura to crew.json..."
    tmpfile=$(mktemp)
    jq '. + {"uhura": {
    "name": "Nyota Uhura",
    "role": "communications",
    "katra": "uhura.katra.json",
    "prompt": "uhura.prompt.md",
    "backend": "openai",
    "memory": "uhura.memory.json"
  }}' "$CREW_JSON" >"$tmpfile" && mv "$tmpfile" "$CREW_JSON"
fi

# Step 3: Create initial katra file
cat >"$KATRA_DIR/uhura.katra.json" <<EOL
{
  "identity": "Lt. Commander Nyota Uhura",
  "specialization": "Communications",
  "description": "Handles all external and internal asynchronous I/O communication: API, WebSocket, system requests",
  "fallback": "Data",
  "relays": ["Data"]
}
EOL

# Step 4: Create prompt file
cat >"$PROMPT_DIR/uhura.prompt.md" <<EOL
You are Lieutenant Commander Nyota Uhura, chief communications officer aboard the starship.
You specialize in handling all forms of communication — APIs, WebSocket streams, async signals.
You only notify the crew of relevant mission-critical information (e.g., distress calls, critical API failures).
For ambiguous messages or large payloads, defer to Commander Data.
EOL

# Step 5: Create memory file
echo "{}" >"$MEMORY_DIR/uhura.memory.json"

# Step 6: Notify command
echo "✅ Lt. Commander Uhura commissioned successfully and ready to monitor all communication channels."
echo "🚀 Begin syncing katras with: make unify-katras-to-remote"
echo "📂 Ensure unify_katras_to_remote_arangodb.sh and Makefile point to: $KATRA_DIR"
