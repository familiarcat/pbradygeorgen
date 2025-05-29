#!/bin/bash

# katra-langchain.sh
# Master initialization script for AlexAI vector-indexed architecture
# Created: 2025-05-29T02:40:54.520149

set -e

echo "🧠 [KATRA] Starting Katra LangChain Initialization Flow..."

# Step 1: Create milestone Git branch
echo "🌿 [GIT] Creating milestone branch..."
BRANCH_NAME="milestone/katra-integration-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BRANCH_NAME"

# Step 2: Inject OpenAI Key from .env.local into system for SSR-only
if [ -f .env.local ]; then
  echo "🔐 [ENV] Exporting secrets from .env.local"
  export $(grep -v '^#' .env.local | xargs)
else
  echo "⚠️  [ENV] .env.local file not found. Skipping env export."
fi

# Step 3: Patch OpenAI calls to use server-only instantiation
echo "🛠️  [PATCH] Refactoring OpenAI instantiation to be SSR-only..."
find ./app -type f -name "*.ts" -o -name "*.tsx" | while read -r file; do
  if grep -q "new OpenAI(" "$file"; then
    sed -i '' 's/new OpenAI({ apiKey: .* })/new OpenAI({ apiKey: process.env.OPENAI_API_KEY })/g' "$file"
    echo "✅ Patched: $file"
  fi
done

# Step 4: Run local build
echo "🏗️  [BUILD] Running local build to verify..."
npm run build

# Step 5: Commit the updates
echo "💾 [GIT] Committing changes to $BRANCH_NAME..."
git add .
git commit -m "Integrate AlexAI SSR secret strategy + build validation"

# Step 6: Index project file system excluding node_modules, etc.
echo "📦 [INDEX] Indexing file structure and extracting content types..."
IGNORE="node_modules|.git|.next|dist|build|coverage"
INDEX_FILE="public/extracted/code_index.json"
TEMP_TREE="public/extracted/file_tree.txt"

mkdir -p public/extracted
npx tree -I "$IGNORE" -L 10 >"$TEMP_TREE"

echo "[" >"$INDEX_FILE"
find . -type f | grep -Ev "$IGNORE" | while read -r file; do
  EXT=$(basename "$file" | awk -F. '{print $NF}')
  TYPE=$(file -b --mime-type "$file")
  echo "{\"path\": \"$file\", \"type\": \"$TYPE\", \"ext\": \"$EXT\"}," >>"$INDEX_FILE"
done
sed -i '' '$ s/,$//' "$INDEX_FILE"
echo "]" >>"$INDEX_FILE"
rm "$TEMP_TREE"

# Step 7: Log complete
echo "✅ [KATRA] Initialization complete. Branch: $BRANCH_NAME"
echo "👉 Push to remote with: git push -u origin $BRANCH_NAME"
