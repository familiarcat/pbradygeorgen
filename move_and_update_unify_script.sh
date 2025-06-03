#!/bin/bash

set -e

SRC="unify_katras_to_remote_arangodb.sh"
DEST="scripts/$SRC"
MAKEFILE="Makefile"

echo "🔄 Checking for script in root..."
if [ ! -f "$SRC" ]; then
    echo "❌ File '$SRC' not found in project root."
    exit 1
fi

echo "📦 Moving $SRC → $DEST"
mkdir -p scripts
mv "$SRC" "$DEST"

echo "✅ Script moved."

# Check if Makefile already has a target
if grep -q "unify-katras-to-remote" "$MAKEFILE"; then
    echo "📘 Makefile already contains 'unify-katras-to-remote'. Skipping insertion."
else
    echo "🛠️ Adding 'unify-katras-to-remote' target to Makefile..."
    cat <<EOL >>"$MAKEFILE"

# Run the katra unification to remote ArangoDB
unify-katras-to-remote:
\tbash $DEST
EOL
    echo "✅ Makefile updated."
fi
