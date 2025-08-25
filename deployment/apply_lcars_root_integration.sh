#!/bin/bash
set -e

echo "🧠 Starting LCARS Root Integration Patch..."

PROJECT_ROOT=$(pwd)
APP_DIR="$PROJECT_ROOT/app"
COMPONENTS_DIR="$PROJECT_ROOT/components"
PUBLIC_DIR="$PROJECT_ROOT/public"
STYLES_DIR="$PROJECT_ROOT/styles"
ALEXAI_DIR="$PROJECT_ROOT/alexai"
LCARS_ZIP="lcars_agile_sprint_ui.zip"

# Helper function to compare and copy files
copy_or_skip() {
  local src="$1"
  local dest="$2"

  mkdir -p "$(dirname "$dest")"

  if [ -f "$dest" ]; then
    if cmp -s "$src" "$dest"; then
      echo "⏭️ Skipping identical file: $dest"
    else
      echo "♻️ Overwriting: $dest"
      cp "$src" "$dest"
    fi
  else
    echo "📄 Copying new file: $dest"
    cp "$src" "$dest"
  fi
}

# Unzip contents
if [ ! -f "$LCARS_ZIP" ]; then
  echo "❌ Error: $LCARS_ZIP not found"
  exit 1
fi

echo "📦 Extracting LCARS UI ZIP..."
unzip -o "$LCARS_ZIP" -d "$PROJECT_ROOT"

echo "📁 Organizing extracted files..."

# === 1. LCARS ROOT Layout ===
mkdir -p "$APP_DIR/lcars-root"
for file in "$PROJECT_ROOT/lcars-root"/*; do
  filename=$(basename "$file")
  copy_or_skip "$file" "$APP_DIR/lcars-root/$filename"
done

# === 2. Dante Agile Components ===
mkdir -p "$COMPONENTS_DIR/dante-agile"
for file in "$PROJECT_ROOT/dante-agile"/*; do
  filename=$(basename "$file")
  copy_or_skip "$file" "$COMPONENTS_DIR/dante-agile/$filename"
done

# === 3. Assets ===
mkdir -p "$PUBLIC_DIR/assets/lcars"
for file in "$PROJECT_ROOT/assets/lcars"/*; do
  filename=$(basename "$file")
  copy_or_skip "$file" "$PUBLIC_DIR/assets/lcars/$filename"
done

# === 4. app/lcars ===
mkdir -p "$APP_DIR/lcars"
for file in "$PROJECT_ROOT/app/lcars"/*; do
  filename=$(basename "$file")
  copy_or_skip "$file" "$APP_DIR/lcars/$filename"
done

# === 5. components/lcars ===
mkdir -p "$COMPONENTS_DIR/lcars"
for file in "$PROJECT_ROOT/components/lcars"/*; do
  filename=$(basename "$file")
  copy_or_skip "$file" "$COMPONENTS_DIR/lcars/$filename"
done

# === 6. styles/lcars.css ===
copy_or_skip "$PROJECT_ROOT/styles/lcars.css" "$STYLES_DIR/lcars.css"

# === 7. alexai/katras/ ===
mkdir -p "$ALEXAI_DIR/katras"
for file in "$PROJECT_ROOT/alexai/katras"/*; do
  filename=$(basename "$file")
  copy_or_skip "$file" "$ALEXAI_DIR/katras/$filename"
done

# === 8. alexai.config.js ===
copy_or_skip "$PROJECT_ROOT/alexai.config.js" "$PROJECT_ROOT/alexai.config.js"

# === 9. Replace layout.tsx ===
if [ -f "$APP_DIR/layout.tsx" ]; then
  echo "🗂️ Backing up layout.tsx -> layout.tsx.bak"
  cp "$APP_DIR/layout.tsx" "$APP_DIR/layout.tsx.bak"
fi
copy_or_skip "$APP_DIR/lcars-root/layout.tsx" "$APP_DIR/layout.tsx"

# === 10. Ensure global theme import ===
GLOBAL_CSS="$STYLES_DIR/globals.css"
THEME_IMPORT="@import '../app/lcars-root/lcars-theme.css';"
if [ -f "$GLOBAL_CSS" ] && ! grep -q "$THEME_IMPORT" "$GLOBAL_CSS"; then
  echo "💅 Appending LCARS theme to globals.css..."
  echo -e "\n/* LCARS THEME */\n$THEME_IMPORT" >>"$GLOBAL_CSS"
else
  echo "✅ LCARS theme already included or globals.css missing"
fi

# === 11. Build Validation ===
echo "🧪 Running acceptance test (npm run build)..."
npm run build

echo "🚀 LCARS root integration complete. Ready for warp, Captain."
