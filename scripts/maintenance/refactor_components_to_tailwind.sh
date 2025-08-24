#!/bin/bash

echo "🛠️ Chief O'Brien: Launching Phase 2 - Refactoring UI Components to Tailwind..."

TARGET_DIR="components"
EXCLUDE_SUBDIR="layout"
LOG="refactor_components_to_tailwind.log"
>"$LOG"

declare -A COLOR_MAP=(
    ["lcarsBeige"]="bg-lcars-beige"
    ["lcarsBlue"]="bg-lcars-blue"
    ["lcarsOrange"]="bg-lcars-orange"
    ["lcarsTan"]="bg-lcars-tan"
    ["lcarsBlack"]="bg-lcars-black"
    ["lcarsGray"]="bg-lcars-gray"
    ["alertRed"]="bg-lcars-red"
    ["statusYellow"]="bg-lcars-yellow"
    ["successGreen"]="0"
)

update_component_file() {
    local file="$1"
    local modified=0

    # Replace color tokens with Tailwind classes
    for key in "${!COLOR_MAP[@]}"; do
        if grep -q "${key}" "$file"; then
            sed -i '' "s/${key}/${COLOR_MAP[$key]}/g" "$file"
            modified=1
        fi
    done

    # Replace inline style blocks with placeholder Tailwind class
    if grep -q "style={{" "$file"; then
        sed -i '' 's/style={{[^}]*}}//g' "$file"
        modified=1
    fi

    # Add LCARS base font if not present
    if ! grep -q "font-lcars" "$file"; then
        sed -i '' 's/className="/className="font-lcars /g' "$file"
        modified=1
    fi

    if [[ "$modified" == 1 ]]; then
        echo "🔧 Updated: $file" >>"$LOG"
    fi
}

echo "🔍 Scanning component files..."
while IFS= read -r -d '' file; do
    # Skip layout directory
    if [[ "$file" != *"$TARGET_DIR/$EXCLUDE_SUBDIR"* ]]; then
        update_component_file "$file"
    fi
done < <(find "$TARGET_DIR" -type f \( -name "*.tsx" -o -name "*.jsx" \) -print0)

echo "📄 Component refactor complete. Changes logged in $LOG"
echo "🖖 Phase 2 complete. Components prepared for LCARS class harmonization."
