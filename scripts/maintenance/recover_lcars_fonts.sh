#!/bin/bash
set -e

echo "🛠️ Chief O'Brien: Downloading pre-converted LCARS-compatible Antonio fonts..."

FONT_DIR="public/fonts"
mkdir -p "$FONT_DIR"

# Download Antonio-Regular
curl -L -o "$FONT_DIR/Antonio-Regular.woff2" "https://cdn.jsdelivr.net/npm/@fontsource/antonio/files/antonio-latin-400-normal.woff2"
curl -L -o "$FONT_DIR/Antonio-Regular.woff" "https://cdn.jsdelivr.net/npm/@fontsource/antonio/files/antonio-latin-400-normal.woff"

# Download Antonio-Bold
curl -L -o "$FONT_DIR/Antonio-Bold.woff2" "https://cdn.jsdelivr.net/npm/@fontsource/antonio/files/antonio-latin-700-normal.woff2"
curl -L -o "$FONT_DIR/Antonio-Bold.woff" "https://cdn.jsdelivr.net/npm/@fontsource/antonio/files/antonio-latin-700-normal.woff"

echo "✅ Fonts recovered in $FONT_DIR"

echo "📄 Suggested content for styles/lcars/lcars-fonts.css:"
cat <<EOF

@font-face {
  font-family: 'Antonio';
  src: url('/fonts/Antonio-Regular.woff2') format('woff2'),
       url('/fonts/Antonio-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Antonio';
  src: url('/fonts/Antonio-Bold.woff2') format('woff2'),
       url('/fonts/Antonio-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
}
EOF

echo "💡 Update your 'styles/lcars/lcars-fonts.css' with the above and re-run your build."
