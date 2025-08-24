#!/bin/bash
set -e

echo "🛠️ Chief O'Brien: LCARS Styled Components Repair Utility Initializing..."

# 1. Ensure styled-components is installed
if ! grep -q '"styled-components"' package.json; then
    echo "📦 Installing styled-components..."
    npm install styled-components
fi

# 2. Ensure @types/styled-components is installed
if ! grep -q '"@types/styled-components"' package.json; then
    echo "📦 Installing @types/styled-components..."
    npm install -D @types/styled-components
fi

# 3. Patch invalid backticks in animation files
echo "🧹 Scanning ./animations for invalid \` backtick usage..."

find ./animations -name '*.ts' -o -name '*.tsx' | while read -r file; do
    if grep -q 'keyframes\\`' "$file"; then
        echo "🔧 Patching $file"
        cp "$file" "$file.bak"
        sed -i '' 's/keyframes\\`/keyframes`/g' "$file"
    fi
done

# 4. Validate css blocks for syntax (basic heuristic)
echo "🔍 Validating styled-components usage in ./animations..."
find ./animations -name '*.ts' -o -name '*.tsx' | while read -r file; do
    if grep -q 'css\\`' "$file"; then
        echo "🔧 Patching css tag in $file"
        cp "$file" "$file.bak-css"
        sed -i '' 's/css\\`/css`/g' "$file"
    fi
done

echo "✅ All repairs completed."
echo "🖖 Styled-components are now LCARS-compliant."
