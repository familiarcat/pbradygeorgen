#!/bin/bash

set -e

BRANCH_NAME="katra-langchain-2025-05-28-232708"

echo "🔁 Checking dependencies..."

if ! npm ls pdf-lib > /dev/null 2>&1; then
  echo "📦 Installing missing dependency: pdf-lib"
  npm install pdf-lib
fi

if ! npm ls langchain > /dev/null 2>&1; then
  echo "📦 Installing missing dependency: langchain"
  npm install langchain
fi

echo "🌿 Creating a new Git branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

echo "🛡️ Verifying and adding import guards where necessary..."

TARGET_FILE="./scripts/extract-pdf-colors.js"
GUARD_LINE="try { require.resolve('pdf-lib') } catch (e) { throw new Error('pdf-lib not found') }"

if ! grep -q "require.resolve('pdf-lib')" "$TARGET_FILE"; then
  echo "🛡️ Adding import guard to $TARGET_FILE"
  sed -i.bak "1i\\
$GUARD_LINE
" "$TARGET_FILE"
fi

VECTOR_FILE="./langchain/vector.ts"
IMPORT_LINE="import { MemoryVectorStore } from 'langchain/vectorstores/memory';"
if ! grep -q "$IMPORT_LINE" "$VECTOR_FILE"; then
  echo "⚠️ Ensure the langchain/vectorstores/memory import path is valid"
fi

echo "📝 Staging changes..."
git add .

echo "✅ Committing changes..."
git commit -m "💾 Milestone: Added LangChain vector store, pdf-lib guard, and auto-dependency handling"

echo "🚀 Script complete. You're on branch $BRANCH_NAME"

echo "💡 Remember to push your changes when ready: git push origin $BRANCH_NAME"