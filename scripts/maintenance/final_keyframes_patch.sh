#!/bin/bash
echo "🧼 Fixing final \` escape anomalies in lcars-animations.ts..."

file="./animations/lcars-animations.ts"

if [ -f "$file" ]; then
    cp "$file" "${file}.bak-final"
    sed -i '' 's/keyframes\\`/keyframes`/g' "$file"
    sed -i '' 's/\\`;/`;/g' "$file"
    echo "✅ lcars-animations.ts cleaned up."
else
    echo "❌ File not found: $file"
fi
