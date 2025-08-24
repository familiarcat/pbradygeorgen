#!/bin/bash
set -e

echo "🛠️ Chief O'Brien: Deploying LCARS Token Map and Types..."

TOKENS_DIR="tokens"
TOKENS_FILE="$TOKENS_DIR/lcars-token-map.ts"
TYPES_FILE="$TOKENS_DIR/lcars-token-map.d.ts"

mkdir -p "$TOKENS_DIR"

# Generate token map
cat >"$TOKENS_FILE" <<EOF
// lcars-token-map.ts
export const lcarsTokens = {
  color: {
    primary: '#FF9B00',
    secondary: '#0099FF',
    alert: '#FF0000',
    success: '#00FF99',
    background: '#000000',
    panel: '#1C1C1C',
    text: '#FFFFFF',
  },
  statusColors: {
    new: '#FFFF99',
    groomed: '#66B2FF',
    planned: '#FFD700',
    inProgress: '#FFA500',
    complete: '#800080',
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px',
  },
  font: {
    heading: 'LCARS',
    body: 'LCARS, sans-serif',
  },
};
EOF

# Generate TypeScript declaration
cat >"$TYPES_FILE" <<EOF
// lcars-token-map.d.ts
export declare const lcarsTokens: {
  color: {
    primary: string;
    secondary: string;
    alert: string;
    success: string;
    background: string;
    panel: string;
    text: string;
  };
  statusColors: {
    new: string;
    groomed: string;
    planned: string;
    inProgress: string;
    complete: string;
  };
  spacing: {
    sm: string;
    md: string;
    lg: string;
  };
  font: {
    heading: string;
    body: string;
  };
};
EOF

echo "✅ LCARS token map and types deployed to $TOKENS_DIR/"
