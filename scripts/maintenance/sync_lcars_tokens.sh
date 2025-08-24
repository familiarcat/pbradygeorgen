#!/bin/bash
set -e

echo "🧬 Chief O'Brien: Syncing LCARS Tokens to TypeScript and JavaScript formats..."

TS_FILE="tokens/lcars-token-map.ts"
JS_FILE="tokens/lcars-token-map.js"

mkdir -p tokens

# TypeScript version
cat <<EOF >"$TS_FILE"
// 🧬 LCARS Design Tokens (TypeScript) - auto-synced

export const colors = {
  alertRed: '#ff3b30',
  statusYellow: '#ffcc00',
  successGreen: '#4cd964',
  lcarsBlue: '#0096ff',
  lcarsOrange: '#ff9900',
  lcarsTan: '#ffcc99',
  lcarsBlack: '#1c1c1c',
  lcarsGray: '#888888',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '40px',
};

export const fonts = {
  heading: '"Eurostile", "Orbitron", sans-serif',
  body: '"LCARS", "Helvetica Neue", sans-serif',
};
EOF

# JavaScript version (CommonJS)
cat <<EOF >"$JS_FILE"
// 🧬 LCARS Design Tokens (JavaScript) - CommonJS for Node

module.exports = {
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

echo "✅ Tokens synced: $TS_FILE & $JS_FILE"
