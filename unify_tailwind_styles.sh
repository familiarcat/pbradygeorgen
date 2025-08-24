#!/bin/bash

echo "🛠️ Chief O'Brien: Beginning global LCARS Tailwind unification..."

COMPONENT_DIR="./components"
TAILWIND_CONFIG="tailwind.config.ts"

if [ ! -f "$TAILWIND_CONFIG" ]; then
  echo "❌ Missing tailwind.config.ts. Please ensure Tailwind is initialized properly."
  exit 1
fi

echo "🔍 Scanning for legacy lcarsTokens in $COMPONENT_DIR..."

# List of known replacements (can be expanded)
declare -A COLORS
COLORS=(
  ["lcarsBlue"]="bg-lcars-blue"
  ["lcarsOrange"]="bg-lcars-orange"
  ["lcarsTan"]="bg-lcars-tan"
  ["lcarsBlack"]="bg-lcars-black"
  ["lcarsGray"]="bg-lcars-gray"
  ["lcarsBeige"]="bg-lcars-tan"  # fallback mapping
)

declare -A SPACING
SPACING=(
  ["medium"]="p-4"
  ["small"]="p-2"
  ["large"]="p-6"
)

FONT_REPLACE="font-antonio"

# Make a backup of affected files
mkdir -p scripts/backup/components
cp -r $COMPONENT_DIR/* scripts/backup/components/

# Apply replacements
for file in $(find "$COMPONENT_DIR" -name "*.tsx"); do
  for color in "${!COLORS[@]}"; do
    sed -i '' "s/lcarsTokens\.colors\.${color}/${COLORS[$color]}/g" "$file"
  done

  for space in "${!SPACING[@]}"; do
    sed -i '' "s/lcarsTokens\.spacing\.${space}/${SPACING[$space]}/g" "$file"
  done

  sed -i '' "s/lcarsTokens\.fonts\.primary/${FONT_REPLACE}/g" "$file"
done

echo "✅ Replacement complete. Legacy styles updated."
echo "🧪 Next step: Run 'npm run build' to verify visual integrity."
