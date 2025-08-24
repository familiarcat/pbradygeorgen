#!/bin/bash

set -e

echo "🛠️ Chief O'Brien: Beginning Tailwind integration protocol..."

PROJECT_ROOT=$(git rev-parse --show-toplevel)
cd "$PROJECT_ROOT"

echo "📦 Installing Tailwind CSS + PostCSS + Autoprefixer..."
npm install -D tailwindcss postcss autoprefixer

echo "🧬 Creating tailwind.config.js..."
cat >tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dynamic: {
          primary: "var(--dynamic-primary)",
          secondary: "var(--dynamic-secondary)",
          accent: "var(--dynamic-accent)",
          background: "var(--dynamic-background)",
          text: "var(--dynamic-text)",
          border: "var(--dynamic-border)",
        },
        cta: {
          primary: "var(--cta-primary)",
          secondary: "var(--cta-secondary)",
          tertiary: "var(--cta-tertiary)",
        },
      },
      fontFamily: {
        sans: "var(--font-sans)",
        heading: "var(--font-heading)",
        mono: "var(--font-mono)",
        serif: "var(--font-serif)",
      },
    },
  },
  plugins: [],
};
EOF

echo "🧪 Creating postcss.config.js..."
cat >postcss.config.js <<'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

GLOBAL_CSS_FILE="./app/global.css"
if grep -q '@tailwind' "$GLOBAL_CSS_FILE"; then
    echo "✅ Tailwind directives already present in global.css"
else
    echo "🔧 Inserting Tailwind directives into global.css..."
    sed -i.bak '1i\
@tailwind base;\
@tailwind components;\
@tailwind utilities;\
' "$GLOBAL_CSS_FILE"
fi

echo "✅ Tailwind config and styles injected. Ready for UI warp alignment."

echo "🚀 Run \`npm run dev\` or \`npm run build\` to verify theme token rendering."
