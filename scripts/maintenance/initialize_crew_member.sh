#!/bin/bash

# === Interactive Crew Member Commissioning Script ===
# Author: Chief Miles O'Brien
# Purpose: Dynamically add a new crew member via interactive shell prompts.

CREW_JSON="alexai/crew.json"
KATRAS_DIR="alexai/katras"

# Ensure crew.json exists
if [ ! -f "$CREW_JSON" ]; then
    echo "❌ crew.json not found at $CREW_JSON. Please initialize crew manifest first."
    exit 1
fi

# Prompt for crew member details
echo "🖖 Welcome to the LCARS Commissioning Console"
echo "------------------------------------------"
read -p "👤 Enter Crew Member Name: " name
read -p "🧠 Enter Specialization: " specialization
read -p "🪪 Enter Persona/Role (e.g., 'Communications Officer'): " role

# Normalize name to lowercase underscore for file naming
safe_name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')
kfile="$KATRAS_DIR/${safe_name}.katra.json"

# Confirm
echo "\n🔍 Confirming Details..."
echo "Name: $name"
echo "Specialization: $specialization"
echo "Role: $role"
echo "Katra Path: $kfile"
read -p "Proceed with commissioning? (y/n): " confirm
if [[ "$confirm" != "y" ]]; then
    echo "🛑 Commissioning cancelled."
    exit 0
fi

# Generate katra
mkdir -p "$KATRAS_DIR"
cat >"$kfile" <<EOF
{
  "name": "$name",
  "specialization": "$specialization",
  "role": "$role",
  "status": "active",
  "memory": []
}
EOF

# Append to crew.json
tmpfile=$(mktemp)
jq ".crew += [{\"name\": \"$name\", \"katra\": \"$safe_name.katra.json\"}]" "$CREW_JSON" >"$tmpfile" && mv "$tmpfile" "$CREW_JSON"

# Output success message
echo "✅ $name commissioned successfully and added to crew.json."
echo "📁 Katra file created at $kfile"
