#!/bin/bash

set -e

DRY_RUN=false
STAGE=false
TYPECHECK=false

# Parse arguments
for arg in "$@"; do
    case $arg in
    --dry-run)
        DRY_RUN=true
        shift
        ;;
    --stage)
        STAGE=true
        shift
        ;;
    --typecheck)
        TYPECHECK=true
        shift
        ;;
    *) ;;
    esac
done

echo "🔧 Starting Katra structure refactor..."
echo "Options: Dry-run=$DRY_RUN | Git-stage=$STAGE | Type-check=$TYPECHECK"

# Define moves
declare -A moves=(
    ["alexai/katras"]="src/katra/katras"
    ["alexai/prompts"]="src/katra/prompts"
    ["alexai/memory"]="src/katra/memory"
    ["alexai/crew.json"]="src/katra/crew.json"
    ["alexai/katras_seed.json"]="src/katra/katras_seed.json"
)

# Move files/directories
for src in "${!moves[@]}"; do
    dest=${moves[$src]}
    if [ -e "$src" ]; then
        echo "📦 Moving $src → $dest"
        if [ "$DRY_RUN" = false ]; then
            mkdir -p "$(dirname $dest)"
            mv "$src" "$dest"
        fi
    else
        echo "⚠️ Skipping $src – not found"
    fi
done

# Move scripts
if [ -d "alexai/scripts" ]; then
    echo "📦 Moving alexai/scripts → scripts/"
    if [ "$DRY_RUN" = false ]; then
        mkdir -p scripts
        mv alexai/scripts/* scripts/
    fi
fi

# Clean up
if [ -d "alexai" ]; then
    echo "🧹 Removing empty alexai/ folder"
    if [ "$DRY_RUN" = false ]; then
        rm -rf alexai
    fi
fi

# Fix imports
echo "🔁 Rewriting TypeScript import paths"
if [ "$DRY_RUN" = false ]; then
    find . -type f -name "*.ts*" -exec sed -i '' 's@from "alexai/@from "src/katra/@g' {} +
fi

# Git staging
if [ "$STAGE" = true ]; then
    echo "📥 Staging updated files for git"
    git add src/katra scripts
fi

# Type checking
if [ "$TYPECHECK" = true ]; then
    echo "🧠 Running TypeScript check"
    npx tsc --noEmit
fi

echo "✅ Katra refactor script complete."
