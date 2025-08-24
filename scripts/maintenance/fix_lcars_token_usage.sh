#!/bin/bash
set -e

echo "🛠️ Chief O'Brien: Refactoring token usage in LCARS components..."

TARGET_DIR="./components/lcars"
TOKEN_IMPORT="import { lcarsTokens } from '@/tokens/lcars-token-map';"

# Step 1: Ensure the token import is present
find "$TARGET_DIR" -type f -name "*.tsx" | while read -r file; do
  if ! grep -q "lcarsTokens" "$file"; then
    echo "📦 Injecting lcarsTokens import in $file"
    sed -i '' "1s;^;$TOKEN_IMPORT\n;" "$file"
  fi
done

# Step 2: Replace all old token usages
find "$TARGET_DIR" -type f -name "*.tsx" | while read -r file; do
  sed -i '' 's/colors\.\([a-zA-Z0-9]*\)/lcarsTokens.colors.\1/g' "$file"
  sed -i '' 's/fonts\.\([a-zA-Z0-9]*\)/lcarsTokens.fonts.\1/g' "$file"
  sed -i '' 's/spacing\.\([a-zA-Z0-9]*\)/lcarsTokens.spacing.\1/g' "$file"
  echo "✅ Updated token usage in $file"
done

echo "🖖 All LCARS components now use lcarsTokens properly."
