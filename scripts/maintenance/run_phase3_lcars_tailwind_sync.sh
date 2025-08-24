#!/bin/bash

echo "🛠️ Chief O'Brien: Engaging Phase 3 — LCARS Tailwind Synchronization"

# Define backup directory
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="scripts/backups/lcars_phase3_$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

# 1. Ensure tailwind.config.ts exists
if [ ! -f "tailwind.config.ts" ]; then
  echo "❌ Missing tailwind.config.ts. Aborting Phase 3."
  exit 1
fi

# 2. Patch tailwind.config.ts with LCARS colors
echo "🔧 Patching tailwind.config.ts with LCARS colors..."
cp tailwind.config.ts "$BACKUP_DIR/tailwind.config.ts.bak"

node <<'EOF'
const fs = require('fs');
const path = './tailwind.config.ts';
let config = fs.readFileSync(path, 'utf-8');

// Avoid duplication
if (!config.includes('lcarsBeige')) {
  config = config.replace(/extend:\s*{/, `extend: {
      colors: {
        alertRed: '#ff4c4c',
        statusYellow: '#ffcc00',
        successGreen: '#4cff4c',
        lcarsBlue: '#3399ff',
        lcarsOrange: '#ff9933',
        lcarsTan: '#cc9966',
        lcarsBlack: '#000000',
        lcarsGray: '#999999',
        lcarsBeige: '#f5f5dc',
      },`);
  fs.writeFileSync(path, config);
  console.log("✅ Tailwind config patched.");
} else {
  console.log("ℹ️ Tailwind colors already include LCARS settings.");
}
EOF

# 3. Replace inline styles in LCARS components
echo "🧼 Updating component styles to Tailwind utility classes..."

COMPONENTS=$(find ./components -type f -name "*.tsx")

for file in $COMPONENTS; do
  cp "$file" "$BACKUP_DIR/$(basename "$file").bak"
  sed -i '' 's/style={{[^}]*lcarsTokens\.colors\.lcarsBeige[^}]*}}/className="bg-lcarsBeige"/g' "$file"
  sed -i '' 's/style={{[^}]*lcarsTokens\.colors\.lcarsBlue[^}]*}}/className="border-l-lcarsBlue"/g' "$file"
  sed -i '' 's/style={{[^}]*lcarsTokens\.spacing\.medium[^}]*}}/className="p-4"/g' "$file"
done

# 4. Confirm font in globals.css
echo "🔠 Checking globals.css for Antonio font..."

if grep -q "Antonio" app/globals.css; then
  echo "✅ Antonio font is already declared."
else
  echo "@import url('https://fonts.googleapis.com/css2?family=Antonio:wght@400;700&display=swap');" >> app/globals.css
  echo "body { font-family: 'Antonio', sans-serif; }" >> app/globals.css
  echo "✅ Font declaration added to globals.css."
fi

# 5. Confirm accessibility and animations (future extension point)
echo "🩺 Reminder: accessibility and animations should be audited via `Phase 4` diagnostics."

echo "🧾 Log saved in $BACKUP_DIR"
echo "✅ Phase 3 complete. Run 'npm run build' to verify."

exit 0
