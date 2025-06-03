#!/bin/bash

# === Move and Update unify_katras_to_remote_arangodb.sh ===
# This script moves the unify_katras_to_remote_arangodb.sh script into the ./scripts folder
# and updates the Makefile to reference the new path

echo "[MOVE] 📁 Moving unify_katras_to_remote_arangodb.sh to ./scripts..."
mv unify_katras_to_remote_arangodb.sh ./scripts/unify_katras_to_remote_arangodb.sh

echo "[CHMOD] 🔐 Making the script executable..."
chmod +x ./scripts/unify_katras_to_remote_arangodb.sh

echo "[UPDATE] 🛠️ Updating Makefile to reflect new script location..."

if grep -q "unify_katras_to_remote_arangodb.sh" Makefile; then
    sed -i '' 's|./unify_katras_to_remote_arangodb.sh|./scripts/unify_katras_to_remote_arangodb.sh|' Makefile
    echo "[SUCCESS] ✅ Makefile updated."
else
    echo "[INFO] ℹ️ No matching entry found in Makefile. Please verify manually."
fi

echo "[DONE] 🖖 Script move and Makefile update complete."
