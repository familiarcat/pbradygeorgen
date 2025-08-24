#!/bin/bash
set -e

echo "🖖 Observation Lounge: Applying Full Crew Consensus Patch..."

# Paths
TOKEN_DIR="tokens"
STYLES_DIR="styles/lcars"
LAYOUT_FILE="app/layout.tsx"
TOKEN_FILE="$TOKEN_DIR/lcars-token-map.ts"
GLOBAL_CSS_FILE="$STYLES_DIR/lcars24.css"

# 1. Ensure required directories exist
mkdir -p "$TOKEN_DIR"
mkdir -p "$STYLES_DIR"

# 2. Generate lcars-token-map.ts (by Data and O'Brien)
cat <<EOF >"$TOKEN_FILE"
// 🧬 LCARS Design Tokens (auto-generated)

export const lcarsTokens = {
  colors: {
    alertRed: '#ff3b30',
    statusYellow: '#ffcc00',
    successGreen: '#4cd964',
    lcarsBlue: '#0096ff',
    lcarsOrange: '#ff9900',
    lcarsTan: '#ffcc99',
    lcarsBlack: '#1c1c1c',
    lcarsGray: '#888888',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
  },
  fonts: {
    heading: '"Eurostile", "Orbitron", sans-serif',
    body: '"LCARS", "Helvetica Neue", sans-serif',
  },
};
EOF

echo "✅ Tokens written to $TOKEN_FILE"

# 3. Create lcars24.css if not already created
if [ ! -f "$GLOBAL_CSS_FILE" ]; then
    echo "/* 🛸 Auto-generated LCARS base styles */" >"$GLOBAL_CSS_FILE"
    echo "body { background-color: black; color: #ffcc99; font-family: 'LCARS', sans-serif; }" >>"$GLOBAL_CSS_FILE"
    echo "✅ Created $GLOBAL_CSS_FILE"
else
    echo "✅ Existing $GLOBAL_CSS_FILE found"
fi

# 4. Ensure layout.tsx references our global LCARS style
if grep -q "lcars24.css" "$LAYOUT_FILE"; then
    echo "✅ layout.tsx already links lcars24.css"
else
    sed -i '' "s|import './globals.css';|import './globals.css';\nimport './styles/lcars/lcars24.css';|" "$LAYOUT_FILE"
    echo "🔗 Linked lcars24.css in layout.tsx"
fi

echo "🧠 All systems synchronized. Your LCARS UI is now unified with tokens and styles!"
