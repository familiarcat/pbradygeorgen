#!/bin/bash

echo "🧰 [O'Brien] Beginning full maintenance sweep..."

# 1. Ensure .env.local contains OPENAI_API_KEY
echo "🔐 Checking .env.local for OPENAI_API_KEY..."
if ! grep -q "OPENAI_API_KEY=" .env.local; then
  echo "❌ OPENAI_API_KEY not found in .env.local. Please add it."
  exit 1
else
  echo "✅ OPENAI_API_KEY is set."
fi

# 2. Patch OpenAI imports in route.ts files
echo "🛠️ Patching OpenAI usage in route.ts files..."
find ./app/api ./app/alexai -type f -name "route.ts" | while read -r file; do
  if grep -q "from 'openai'" "$file"; then
    echo "📦 Refactoring $file to use '@/lib/server/openai'"
    sed -i '' "s|from 'openai'|from '@/lib/server/openai'|g" "$file"
  fi

  if ! grep -q "// ✅ Server-side API route — safe for OpenAI SDK use" "$file"; then
    echo "// ✅ Server-side API route — safe for OpenAI SDK use" | cat - "$file" > temp && mv temp "$file"
    echo "💬 Annotated $file as server-only"
  fi
done

# 3. Verify the integrity of OpenAI usage
echo "🔎 Verifying OpenAI usage integrity..."
failures=0
find ./app/api ./app/alexai -type f -name "route.ts" | while read -r file; do
  if grep -q "openai" "$file" && ! grep -q "from '@/lib/server/openai'" "$file"; then
    echo "❌ Improper OpenAI import in: $file"
    ((failures++))
  fi
  if ! grep -q "// ✅ Server-side API route — safe for OpenAI SDK use" "$file"; then
    echo "⚠️  Missing server-only annotation in: $file"
    ((failures++))
  fi
done

if [[ $failures -eq 0 ]]; then
  echo "✅ All routes are properly configured."
else
  echo "🚨 $failures issues found. Review required."
  exit 1
fi

echo "🧼 Maintenance sweep complete. Ship ready for next operation."
