#!/bin/bash

echo "🧭 Beginning AlexAI folder organization..."

ROOT_DIR="alexai"

# Create required directories if missing
mkdir -p "$ROOT_DIR/agents" "$ROOT_DIR/katras" "$ROOT_DIR/prompts" "$ROOT_DIR/memory" "$ROOT_DIR/crew"

# Move .ts files to agents
find "$ROOT_DIR" -maxdepth 2 -name "*.ts" ! -path "$ROOT_DIR/agents/*" -exec mv -v {} "$ROOT_DIR/agents/" \;

# Move .katra.json files to katras
find "$ROOT_DIR" -maxdepth 3 -name "*.katra.json" ! -path "$ROOT_DIR/katras/*" -exec mv -v {} "$ROOT_DIR/katras/" \;

# Move .prompt.md files to prompts
find "$ROOT_DIR" -maxdepth 3 -name "*.prompt.md" ! -path "$ROOT_DIR/prompts/*" -exec mv -v {} "$ROOT_DIR/prompts/" \;

# Move .memory.json files to memory
find "$ROOT_DIR" -maxdepth 3 -name "*.memory.json" ! -path "$ROOT_DIR/memory/*" -exec mv -v {} "$ROOT_DIR/memory/" \;

# Move crew.json into crew/
if [ -f "$ROOT_DIR/crew.json" ]; then
  mv -v "$ROOT_DIR/crew.json" "$ROOT_DIR/crew/"
fi

echo "✅ Folder reorganization complete."
tree "$ROOT_DIR"
