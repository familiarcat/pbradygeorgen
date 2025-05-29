#!/bin/bash

set -e

echo "🧠 Katra LangChain Setup: Initializing..."

# Define log and markdown paths
LOG_FILE="logs/build.log"
MD_FILE="docs/katra-langchange.md"

mkdir -p logs docs

# Create a milestone git branch
DATE=$(date +%Y%m%d-%H%M%S)
BRANCH="milestone/katra-langchainfix-$DATE"
echo "📍 Creating git branch: $BRANCH"
git checkout -b "$BRANCH"

# Install required LangChain OpenAI submodule
echo "📦 Ensuring @langchain/openai is installed..."
npm install @langchain/openai

# Patch invalid import paths in your project
echo "🔍 Patching LangChain OpenAI imports..."
find . -type f -name "*.ts" -o -name "*.tsx" | while read -r file; do
    sed -i '' 's|from ["'\'']langchain/embeddings/openai["'\'']|from "@langchain/openai"|g' "$file"
done

# Document the applied patch and architecture
echo "📝 Writing markdown changelog to $MD_FILE"
cat >"$MD_FILE" <<EOF
# LangChain Integration Fix: Katra AI Setup

Date: $(date)
Branch: \`$BRANCH\`

This patch ensures compatibility with the latest LangChain module structure.

## 🧩 Patch Summary

- ✅ Replaced invalid \`langchain/embeddings/openai\` import with \`@langchain/openai\`
- ✅ Installed missing \`@langchain/openai\` dependency
- ✅ Triggered build to validate SSR vector memory and endpoints
- ✅ Appended Markdown+Mermaid doc for documentation and graphing

## 🧠 Graph: Memory Vector API

\`\`\`mermaid
graph TD
  AlexAI[AlexAI Memory Context]
  ResumeText[Resume Text]
  UserInfo[User Info JSON]
  ColorTheory[Color Theory]
  FontTheory[Font Theory]
  GraphView[/api/vector-map/graph]
  SSRMemory[SSR Memory Context]

  ResumeText --> AlexAI
  UserInfo --> AlexAI
  ColorTheory --> AlexAI
  FontTheory --> AlexAI
  AlexAI --> SSRMemory
  AlexAI --> GraphView
\`\`\`

## 📂 Affected Files

- \`app/api/vector-map/route.ts\`
- \`lib/katra-memory.ts\`
- \`scripts/katra-langchain.sh\`
- \`package.json\`

## ✅ Next Steps

1. Confirm \`npm run build\` passes
2. Verify \`/api/vector-map/graph\` returns valid memory structure
3. Merge into main or continue developing on milestone branch
EOF

# Build project and log results
echo "🏗️ Running build..."
{
    npm run build
} &>"$LOG_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed. Check logs in $LOG_FILE"
    exit 1
fi

# Git commit and push
git add .
git commit -m "🔧 Patch: Fix LangChain OpenAI import and document vector memory API"
echo "🚀 Changes committed to $BRANCH"

#!/bin/bash
# 🧠 Katra-Langchain Enhancement Script
# 📅 Last Updated: 2025-05-29 01:31:02
# 🔒 Secures OpenAI API usage by enforcing server-side access only
# 🌐 Updates the vector-map route and centralizes OpenAI logic

echo "🔄 Appending OpenAI server-only integration enhancements..."

# 1. Create the centralized server-side OpenAI helper
mkdir -p lib/server
cat <<'EOF' >lib/server/openai.ts
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
EOF

echo "✅ Created lib/server/openai.ts"

# 2. Patch the vector-map API route
VECTOR_ROUTE="app/api/vector-map/route.ts"

if grep -q "new OpenAI(" "$VECTOR_ROUTE"; then
    sed -i '' '/new OpenAI(/d' "$VECTOR_ROUTE"
    sed -i '' '/apiKey:/d' "$VECTOR_ROUTE"
    echo "🔁 Removed direct OpenAI instantiation from $VECTOR_ROUTE"
fi

# Ensure import is present
if ! grep -q "from '@/lib/server/openai'" "$VECTOR_ROUTE"; then
    sed -i '' '1s;^;import { openai } from '"'@/lib/server/openai'"';\n;' "$VECTOR_ROUTE"
    echo "✅ Injected openai import into $VECTOR_ROUTE"
fi

# 3. Reminder for .env.local
if ! grep -q "OPENAI_API_KEY" ".env.local"; then
    echo "OPENAI_API_KEY=your-key-here" >>.env.local
    echo "📝 Added placeholder to .env.local"
fi

# 4. Git checkpoint
git add lib/server/openai.ts "$VECTOR_ROUTE" .env.local
git commit -m "🔒 Secure OpenAI integration via server-only helper [katra-langchain.sh patch]"
echo "📦 Committed OpenAI server-only security update"

echo "🎉 Update complete. You may now run: curl -X GET 'http://localhost:3000/api/vector-map/search?q=healthcare'"
