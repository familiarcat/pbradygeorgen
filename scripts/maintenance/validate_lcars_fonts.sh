#!/bin/bash
set -e

echo "🛠️ Chief O'Brien: Validating LCARS Fonts and CSS Integration..."

# Font file paths
FONT_DIR="public/fonts"
CSS_PATH="styles/lcars/lcars-fonts.css"
LAYOUT_PATH="app/layout.tsx"

mkdir -p "$FONT_DIR"
mkdir -p "$(dirname "$CSS_PATH")"

# Expected fonts
FONTS=("Antonio-Regular.woff2" "Antonio-Bold.woff2" "Antonio-Regular.woff" "Antonio-Bold.woff")
MISSING=()

# Check font files
for font in "${FONTS[@]}"; do
    if [[ ! -f "$FONT_DIR/$font" ]]; then
        echo "❌ Missing: $font"
        MISSING+=("$font")
    else
        echo "✅ Found: $font"
    fi
done

if [[ ${#MISSING[@]} -gt 0 ]]; then
    echo "⚠️ Warning: Missing fonts. Please manually download or recover:"
    printf '%s\n' "${MISSING[@]}"
fi

# Write lcars-fonts.css
cat <<EOF >"$CSS_PATH"
/* 🔤 LCARS Antonio Font Declarations */
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

echo "✅ Antonio font-face declarations written to $CSS_PATH"

# Patch layout.tsx if missing link tag
if ! grep -q "lcars-fonts.css" "$LAYOUT_PATH"; then
    echo "🔗 Injecting <link> into $LAYOUT_PATH..."
    sed -i '' '/<head>/a\
    <link rel="stylesheet" href="/styles/lcars/lcars-fonts.css" />
  ' "$LAYOUT_PATH"
    echo "✅ Link tag injected."
else
    echo "🔗 Link tag already present in layout.tsx"
fi

echo "🖖 Font validation and propagation complete."
