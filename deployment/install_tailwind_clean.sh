#!/bin/bash

echo "🧹 Cleaning corrupted state..."

rm -rf node_modules package-lock.json .next .turbo 2>/dev/null
npm cache clean --force

echo "📦 Reinstalling TailwindCSS and its build pipeline..."
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

echo "🔍 Checking Tailwind binary..."
if [ -f "./node_modules/.bin/tailwindcss" ]; then
  echo "✅ Tailwind binary detected."

  echo "🛠️ Manually creating config files..."
  cat > tailwind.config.ts <<EOF
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
export default config
EOF

  cat > postcss.config.js <<EOF
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

  echo "✅ Tailwind successfully configured."
else
  echo "❌ Tailwind binary still not found. Something deeper is wrong."
  echo "👉 Please try deleting globally cached npm modules:"
  echo "   rm -rf ~/.npm/_npx ~/.npm/_cacache ~/.npm/_locks"
  echo "Then rerun this script."
  exit 1
fi
