#!/bin/bash
set -e

echo "🛠️ LCARS CSS Refactor Patch Script (Non-invasive) Initiated..."

PROJECT_ROOT=$(pwd)
TMP_DIR="$PROJECT_ROOT/.tmp_lcars24"
ZIP_FILE="$PROJECT_ROOT/styles/lcars/lcars24.css_refactor_patch.zip"
TARGET_STYLES_DIR="$PROJECT_ROOT/styles/lcars"

# Step 1: Create temp folder and extract zip
mkdir -p "$TMP_DIR"
unzip -o "$ZIP_FILE" -d "$TMP_DIR"

# Step 2: Create destination folder if needed
mkdir -p "$TARGET_STYLES_DIR"

# Step 3: Move CSS files to styles/lcars/
echo "🔍 Deploying modular CSS to $TARGET_STYLES_DIR..."
mv -f "$TMP_DIR/styles/lcars/"*.css "$TARGET_STYLES_DIR/"

# Step 4: Optionally patch styles/lcars/lcars24.css if present
LCARS_CSS="$PROJECT_ROOT/styles/styles/lcars/lcars24.css"
if [[ -f "$LCARS_CSS" ]]; then
  echo "📎 Patching styles/lcars/lcars24.css with new @imports..."
  echo '@import "./lcars/lcars.grid.css";' >> "$LCARS_CSS"
  echo '@import "./lcars/lcars.animations.css";' >> "$LCARS_CSS"
  echo '@import "./lcars/lcars.typography.css";' >> "$LCARS_CSS"
fi

# Step 5: Clean up
rm -rf "$TMP_DIR"
echo "🖖 LCARS CSS Patch Complete. Engage build when ready."
