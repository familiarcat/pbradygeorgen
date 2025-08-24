#!/bin/bash
set -e

echo "🧠 Chief O'Brien: Verifying global CSS import strategy..."

LAYOUT_FILE="app/layout.tsx"
GLOBAL_CSS="styles/globals.css"
LCARS_DIR="styles/lcars"

# Ensure globals.css includes LCARS CSS files
echo "🔍 Checking if globals.css includes all LCARS files..."
for css_file in lcars24.css lcars-fonts.css lcars-ultra-classic.css lcars-colors.css; do
  if ! grep -q "$css_file" "$GLOBAL_CSS"; then
    echo "➕ Importing $css_file into $GLOBAL_CSS"
    echo "@import './lcars/$css_file';" >> "$GLOBAL_CSS"
  else
    echo "✅ $css_file already imported"
  fi
done

# Remove direct CSS imports from layout.tsx
echo "🧼 Cleaning direct CSS imports from $LAYOUT_FILE..."
sed -i '' '/lcars.*\.css/d' "$LAYOUT_FILE"

# Check for raw CSS errors in LCARS files
echo "🔍 Scanning LCARS CSS for top-level declarations..."
for file in "$LCARS_DIR"/*.css; do
  if grep -E '^(div|body|h[1-6])\s*\{' "$file"; then
    echo "⚠️ Warning: $file has top-level global styles. Ensure they are safe in global context."
  fi
done

echo "✅ CSS verification complete. Restart your dev server or rerun build."
