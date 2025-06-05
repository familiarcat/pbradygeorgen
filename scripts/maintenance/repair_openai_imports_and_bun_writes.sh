#!/bin/bash

# Engineering Team: Chief O'Brien, Commander Data, Commander La Forge
# Purpose: Replace Bun.write with Node's fs.writeFile and fix incorrect OpenAI imports
# Usage: bash scripts/maintenance/repair_openai_imports_and_bun_writes.sh [--stage] [--typecheck]

set -e

STAGE=false
TYPECHECK=false

# Parse optional arguments
for arg in "$@"; do
    case $arg in
    --stage)
        STAGE=true
        shift
        ;;
    --typecheck)
        TYPECHECK=true
        shift
        ;;
    esac
done

echo "🔍 Engineering diagnostic starting..."
echo " - Repairing OpenAI imports..."
echo " - Converting Bun.write → fs/promises.writeFile..."

MODIFIED_FILES=()

# 🔧 1. Replace `import openai from` with named import
FILES_WITH_OPENAI=$(grep -rlE '^import openai from .*openai' --include \*.ts*)

for file in $FILES_WITH_OPENAI; do
    echo "🧠 Fixing OpenAI import in $file"
    sed -i '' 's|^import openai from .*openai"|import { openai } from "@/lib/server/openai"|g' "$file"
    MODIFIED_FILES+=("$file")
done

# 🔧 2. Replace Bun.write with fs.promises.writeFile
FILES_WITH_BUN=$(grep -rl 'Bun.write' --include \*.ts*)

for file in $FILES_WITH_BUN; do
    echo "🛠 Replacing Bun.write in $file"
    sed -i '' 's/Bun.write/writeFile/g' "$file"

    # Inject import if it doesn't already exist
    if ! grep -q 'fs/promises' "$file"; then
        sed -i '' '1s|^|import { writeFile } from "fs/promises";\n|' "$file"
    fi

    MODIFIED_FILES+=("$file")
done

# 🧹 Remove duplicates
UNIQUE_FILES=($(printf "%s\n" "${MODIFIED_FILES[@]}" | sort -u))

# 🧾 Git stage if requested
if [ "$STAGE" = true ]; then
    echo "📥 Staging updated files..."
    git add "${UNIQUE_FILES[@]}"
fi

# 🧪 Typecheck if requested
if [ "$TYPECHECK" = true ]; then
    echo "🔎 Running full TypeScript diagnostics..."
    npx tsc --noEmit
fi

echo "✅ Repair complete. Files modified:"
for f in "${UNIQUE_FILES[@]}"; do
    echo "   - $f"
done

exit 0
