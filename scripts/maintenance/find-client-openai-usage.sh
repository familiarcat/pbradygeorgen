#!/bin/bash
echo "🧪 Scanning for improper OpenAI usage in client-side files..."

TARGET_DIRS=("app" "components")
OPENAI_REGEX='(import .*openai|new OpenAI\(|dangerouslyAllowBrowser)'

for DIR in "${TARGET_DIRS[@]}"; do
  echo "🔍 Searching in $DIR..."
  grep -rEl "$OPENAI_REGEX" "$DIR" | while read -r file; do
    if grep -q '"use client"' "$file"; then
      echo "❌ ERROR: OpenAI used in client file: $file"
    else
      echo "⚠️  Warning: Potential OpenAI usage in non-client file: $file"
    fi
  done
done

echo "✅ Scan complete. Please refactor any client-side OpenAI usage to server-only modules or API routes."
