#!/bin/bash
set -e

echo "🧵 Chief O'Brien + Data: Patching Tailwind config with Antonio font..."

TAILWIND_CONFIG="tailwind.config.ts"

# Step 1: Inject Antonio into Tailwind config
if grep -q "fontFamily" "$TAILWIND_CONFIG"; then
    echo "🔎 Checking existing fontFamily..."
    if ! grep -q "antonio" "$TAILWIND_CONFIG"; then
        echo "🔧 Adding antonio to fontFamily..."
        sed -i '' '/fontFamily:/a\
      antonio: ["Antonio", "sans-serif"],
    ' "$TAILWIND_CONFIG"
    else
        echo "✅ Antonio font already configured."
    fi
else
    echo "❌ Could not find fontFamily in $TAILWIND_CONFIG. Please add it manually."
    exit 1
fi

# Step 2: Search for headings without className manually (without lookbehinds)
echo "📁 Scanning components/ and app/ for raw h1–h4 headings..."

find components/ app/ -type f -name '*.tsx' | while read -r file; do
    grep -Hn "<h[1-4][ >]" "$file" | grep -v "className=" || true
done

echo "💡 Tip: Add className='font-antonio' to ensure consistent LCARS typography."

echo "✅ Patch complete. Restart your dev server to apply Tailwind changes."
