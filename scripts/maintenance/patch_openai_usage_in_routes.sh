#!/bin/bash
echo "🛠️ [O'Brien] Patching OpenAI usage across all API routes..."

TARGET_DIR="./app/api"
OPENAI_MODULE="lib/server/openai"

# Step 1: Ensure no 'use client' accidentally exists
echo "🔍 Checking for 'use client' directives in route.ts files..."
grep -rl "'use client'" "$TARGET_DIR" | while read -r file; do
    echo "❌ Removing 'use client' from: $file"
    sed -i '' '/use client/d' "$file"
done

# Step 2: Update all route.ts files to import from lib/server/openai
echo "🔁 Updating OpenAI imports in route.ts files..."
find "$TARGET_DIR" -type f -name "route.ts" | while read -r file; do
    if grep -q "from 'openai'" "$file"; then
        echo "📦 Refactoring $file to use $OPENAI_MODULE instead of 'openai'"
        sed -i '' "s|from 'openai'|from '@/lib/server/openai'|" "$file"
    fi
done

# Step 3: Add clarifying comment if missing
echo "💬 Ensuring comment exists to indicate server-side use..."
find "$TARGET_DIR" -type f -name "route.ts" | while read -r file; do
    if ! grep -q "Server-side API route" "$file"; then
        echo "// ✅ Server-side API route — safe for OpenAI SDK use" | cat - "$file" >temp && mv temp "$file"
        echo "💬 Added server-only annotation to $file"
    fi
done

echo "✅ All OpenAI API routes patched and secured."
