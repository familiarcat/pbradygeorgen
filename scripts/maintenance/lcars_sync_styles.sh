#!/bin/bash
# 🧠 Chief O'Brien's LCARS Style Sync Protocol
# Normalizes all LCARS CSS imports across the application

set -e

echo "🛠️ Executing LCARS Style Sync Protocol..."

# Paths to search
SEARCH_PATHS=("app" "components" "scripts" "hooks")

# Patterns to replace
OLD_PATTERNS=("styles/lcars/lcars24.css" "styles/lcars/lcars24.css" "styles/lcars/lcars24.css")
NEW_PATTERN="styles/lcars/lcars24.css"

for pattern in "${OLD_PATTERNS[@]}"; do
  echo "🔄 Updating references from $pattern to $NEW_PATTERN"
  grep -rl "$pattern" "${SEARCH_PATHS[@]}" | xargs sed -i '' "s|$pattern|$NEW_PATTERN|g"
done

echo "✅ All LCARS CSS references have been unified."
