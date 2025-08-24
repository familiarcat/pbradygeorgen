#!/bin/bash
set -e

echo "🛠️ Chief O'Brien: Verifying lcars-token-map export integrity..."

TOKEN_PATH="tokens/lcars-token-map.ts"
EXPECTED_EXPORTS=("colors" "spacing" "fonts")

if [[ ! -f "$TOKEN_PATH" ]]; then
    echo "❌ $TOKEN_PATH not found."
    exit 1
fi

for export in "${EXPECTED_EXPORTS[@]}"; do
    if ! grep -q "export const $export" "$TOKEN_PATH"; then
        echo "❌ Missing export: $export"
        exit 1
    fi
done

echo "✅ All expected exports found in $TOKEN_PATH"

# Check if tsconfig paths are set up correctly
if ! grep -q '"@/*": \["./*"\]' tsconfig.json; then
    echo "⚠️ Warning: @ path alias not found in tsconfig.json"
else
    echo "✅ Path alias '@/*' found in tsconfig.json"
fi

echo "🧹 Clearing build cache..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf tsconfig.tsbuildinfo

echo "♻️ Reinstalling dependencies (if needed)..."
npm install

echo "🧪 Running TypeScript type check..."
npx tsc --noEmit

echo "✅ Verification complete. Please try building again with: npm run build"
