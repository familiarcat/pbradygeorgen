#!/bin/bash

echo "🛠️ Chief O'Brien: Beginning Phase 1 - Tailwind Layout Refactor..."

TARGET_DIRS=("app" "components/layout")
LOG="refactor_layouts_to_tailwind.log"
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

update_file() {
    local file="$1"
    local modified=0

    for key in "${!COLOR_MAP[@]}"; do
        if grep -q "${key}" "$file"; then
            sed -i '' "s/${key}/${COLOR_MAP[$key]}/g" "$file"
            modified=1
        fi
    done

    if grep -q "style={{" "$file"; then
        sed -i '' 's/style={{[^}]*}}//g' "$file"
        modified=1
    fi

    if [[ "$modified" == 1 ]]; then
        echo "✅ Refactored: $file" >>"$LOG"
    fi
}

echo "🔍 Scanning layout files..."
for dir in "${TARGET_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        while IFS= read -r -d '' file; do
            update_file "$file"
        done < <(find "$dir" -type f \( -name "*.tsx" -o -name "*.jsx" \) -print0)
    fi
done

echo "📄 Refactor complete. See changes in $LOG"
echo "🖖 Layouts now ready for visual inspection and future component refactors."
