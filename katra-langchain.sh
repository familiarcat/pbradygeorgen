#!/bin/bash
# katra-langchain.sh — updated with bottom-up introspective indexing
# Timestamp: 20250529-015420

echo "🧠 [KATRA] Starting bottom-up memory indexing phase..."

# Ensure universal-ctags is installed
if ! command -v ctags &>/dev/null; then
    echo "📦 Installing universal-ctags via Homebrew..."
    brew install universal-ctags
else
    echo "✅ universal-ctags already installed."
fi

# Step 1: Generate ctags
echo "🔍 Generating code index tags..."
ctags -R --languages=TypeScript,JavaScript --fields=+n --extras=+q -f .ctags.tags

# Step 2: Convert tags to Mermaid-compatible format
if [ -f "./scripts/convert-tags-to-mermaid.js" ]; then
    echo "🎨 Building dependency mermaid graph..."
    node ./scripts/convert-tags-to-mermaid.js >docs/kgraph.mmd
else
    echo "⚠️ Missing parser script: ./scripts/convert-tags-to-mermaid.js"
    echo "❌ Mermaid graph not generated."
fi

# Step 3: Commit graph for introspective visual memory
echo "📝 Committing introspective memory files to version control..."
git add .ctags.tags docs/kgraph.mmd
git commit -m '🤖 Auto-generated self-referential dependency graph [Katra Indexing Update]'

echo "✅ [KATRA] Indexing phase complete. Introspective memory committed."
