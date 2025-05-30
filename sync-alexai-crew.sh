#!/bin/bash

echo "🖖 Starting AlexAI Crew Sync..."

AGENTS_DIR="./alexai/agents"
KATRAS_DIR="./alexai/katras"
MANIFEST_FILE="./alexai/crew.manifest.json"

mkdir -p $AGENTS_DIR
mkdir -p $KATRAS_DIR

echo "[" >$MANIFEST_FILE

for agent_path in $AGENTS_DIR/*.ts; do
    agent_file=$(basename "$agent_path")
    agent_name="${agent_file%.ts}"
    katra_file="$KATRAS_DIR/${agent_name}.katra.json"

    echo "🔍 Checking agent: $agent_name"

    if [ ! -f "$katra_file" ]; then
        echo "⚠️ Missing Katra for $agent_name. Generating..."
        cat <<EOF >"$katra_file"
{
  "identity": "$agent_name",
  "focus": "To be defined",
  "role": "Unknown",
  "traits": [],
  "memory": [],
  "version": "0.1"
}
EOF
    fi

    echo "  {\"name\": \"$agent_name\", \"agentFile\": \"agents/$agent_file\", \"katraFile\": \"katras/${agent_name}.katra.json\"}," >>$MANIFEST_FILE
done

# Remove last comma and close the JSON array
sed -i '' -e '$ s/,$//' $MANIFEST_FILE
echo "]" >>$MANIFEST_FILE

echo "✅ Crew manifest and Katras are synchronized."
