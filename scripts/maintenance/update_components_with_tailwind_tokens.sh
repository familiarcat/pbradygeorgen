#!/bin/bash
set -e

echo "🛠️ Chief O'Brien: Updating LCARS components to Tailwind tokens..."

# Step 1: Ensure Tailwind is installed
if ! grep -q "tailwindcss" package.json; then
    echo "📦 Installing Tailwind CSS and dependencies..."
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
fi

# Step 2: Patch tailwind.config.ts with LCARS theme
TAILWIND_CONFIG="tailwind.config.ts"

if [ ! -f "$TAILWIND_CONFIG" ]; then
    echo "❌ Missing tailwind.config.ts. Please run 'npx tailwindcss init -p' manually."
    exit 1
fi

echo "🎨 Injecting LCARS theme into tailwind.config.ts..."

LCARS_TAILWIND_THEME=$(
    cat <<'EOF'
  theme: {
    extend: {
      colors: {
        'lcars-blue': '#0096ff',
        'lcars-orange': '#ff9900',
        'lcars-tan': '#ffcc99',
        'lcars-black': '#1c1c1c',
        'lcars-gray': '#888888',
        'lcars-red': '#ff3b30',
        'lcars-yellow': '#ffcc00',
        'lcars-green': '#4cd964'
      },
      fontFamily: {
        heading: ['"Eurostile"', '"Orbitron"', 'sans-serif'],
        body: ['"LCARS"', '"Helvetica Neue"', 'sans-serif']
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px'
      }
    }
  },
EOF
)

# Replace old theme block or append new one
if grep -q "theme: {" "$TAILWIND_CONFIG"; then
    sed -i.bak "/theme: {/,$!d" "$TAILWIND_CONFIG"
    echo "$LCARS_TAILWIND_THEME" >>"$TAILWIND_CONFIG"
else
    echo "module.exports = {" >"$TAILWIND_CONFIG"
    echo "$LCARS_TAILWIND_THEME" >>"$TAILWIND_CONFIG"
    echo "};" >>"$TAILWIND_CONFIG"
fi

# Step 3: Refactor LCARS components to use Tailwind
COMPONENT_DIR="./components/lcars"
echo "🔧 Updating LCARS components in $COMPONENT_DIR..."

find "$COMPONENT_DIR" -type f -name "*.tsx" | while read -r file; do
    echo "⚙️ Refactoring $file..."
    sed -i.bak \
        -e "s|backgroundColor:.*|className='bg-lcars-tan'|" \
        -e "s|padding:.*|className+=' p-md'|" \
        -e "s|fontFamily:.*|className+=' font-body'|" \
        -e "s|borderLeft:.*|className+=' border-l-8 border-lcars-blue'|" \
        "$file"
done

echo "✅ All LCARS components updated to use Tailwind tokens."
echo "🖖 Engage 'npm run build' to test warp readiness."
