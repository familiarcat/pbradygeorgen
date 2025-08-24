#!/bin/bash
set -e

echo "🛠️ Chief O'Brien & Commander Data: Running LCARS 24.1 Style + Token Repair..."

# Source files
ULTRA_CLASSIC="styles/lcars/lcars-ultra-classic.css"
COLORS="styles/lcars/lcars-colors.css"

# Target merged file
MERGED="styles/lcars/lcars24.css"

# Ensure the source files exist
if [[ ! -f "$ULTRA_CLASSIC" ]]; then
    echo "❌ Missing file: $ULTRA_CLASSIC"
    exit 1
fi

if [[ ! -f "$COLORS" ]]; then
    echo "❌ Missing file: $COLORS"
    exit 1
fi

# Merge styles
echo "🔧 Merging LCARS style sheets..."
cat "$COLORS" "$ULTRA_CLASSIC" >"$MERGED"

echo "✅ Merged LCARS styles into $MERGED"

# Summary
echo "🧠 Suggest updating layout.tsx to import: './styles/lcars/lcars24.css'"
