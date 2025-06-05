#!/bin/bash
# Chief O'Brien Maintenance Log: Patch crew-comission type errors

echo "🛠️ Running maintenance patch: Fixing TypeScript type errors in crew-comission route..."

TARGET_FILE="./app/alexai/crew-comission/route.ts"

# Check if the file exists
if [ ! -f "$TARGET_FILE" ]; then
  echo "❌ Error: $TARGET_FILE not found."
  exit 1
fi

# Backup the original file
cp "$TARGET_FILE" "$TARGET_FILE.bak"
echo "📦 Backup created at $TARGET_FILE.bak"

# Apply patch using sed to add types
sed -i '' '1s;^;type CrewMember = {\n  name: string;\n  title: string;\n  role: string;\n  ai_integration: string;\n  katra_file: string;\n  prompt_file: string;\n  memory_file: string;\n};\n\n;' "$TARGET_FILE"
sed -i '' 's/const crew = JSON.parse(.*/const crew: CrewMember[] = JSON.parse().crew;/' "$TARGET_FILE"

echo "✅ TypeScript patch applied to $TARGET_FILE"
