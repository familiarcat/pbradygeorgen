#!/bin/bash
set -e

echo "🛠️ Chief O'Brien: Rebuilding LCARS Unified Style Sheet..."

SOURCE_DIR="styles/lcars/original"
TARGET_DIR="styles/lcars"
VARS_FILE="$TARGET_DIR/lcars-vars.css"
FINAL_FILE="$TARGET_DIR/lcars24.css"

# Step 1: Rebuild lcars-vars.css
echo "🔍 Parsing variables from source styles..."
cat /dev/null >"$VARS_FILE"
for file in "$SOURCE_DIR"/*.css; do
    grep -E '^\s*--' "$file" >>"$VARS_FILE" || true
done

# Add :root wrapper
sed -i '' '1s/^/:root {\n/' "$VARS_FILE"
echo "}" >>"$VARS_FILE"

echo "✅ Generated $VARS_FILE"

# Step 2: Merge into lcars24.css
echo "🔧 Combining lcars-vars.css, lcars-colors.css, and lcars-ultra-classic.css into lcars24.css..."

cat "$VARS_FILE" \
    "$SOURCE_DIR/lcars-colors.css" \
    "$SOURCE_DIR/lcars-ultra-classic.css" >"$FINAL_FILE"

echo "✅ LCARS unified stylesheet written to $FINAL_FILE"

echo "🖖 Live long and style consistently."
