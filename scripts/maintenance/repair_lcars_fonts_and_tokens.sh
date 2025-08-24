#!/bin/bash
set -e

echo "🛠️ Chief O'Brien & Commander Data: Running LCARS Font + Token Unification Patch..."

# Define target paths
LCARS_CSS_DIR="styles/lcars"
FONTS_CSS="$LCARS_CSS_DIR/lcars-fonts.css"
VARS_CSS="$LCARS_CSS/lcars-vars.css"
COMBINED_CSS="$LCARS_CSS/lcars24.css"

mkdir -p "$LCARS_CSS_DIR"

# A. Generate lcars-fonts.css with sample @font-face (extend with actual font files if available)
cat <<EOF > "$FONTS_CSS"
/* 🪶 LCARS Fonts */
@font-face {
  font-family: "LCARS";
  src: local("LCARS"), url("/fonts/lcars.woff2") format("woff2");
  font-weight: normal;
  font-style: normal;
}
:root {
  --font-heading: "Eurostile", "Orbitron", sans-serif;
  --font-body: "LCARS", "Helvetica Neue", sans-serif;
}
.font-heading { font-family: var(--font-heading); }
.font-body { font-family: var(--font-body); }
EOF

# B. Generate lcars-vars.css with CSS variables from token map
cat <<EOF > "$VARS_CSS"
/* 🌈 LCARS Color & Spacing Variables */
:root {
  --alert-red: #ff3b30;
  --status-yellow: #ffcc00;
  --success-green: #4cd964;
  --lcars-blue: #0096ff;
  --lcars-orange: #ff9900;
  --lcars-tan: #ffcc99;
  --lcars-black: #1c1c1c;
  --lcars-gray: #888888;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 40px;
}
.bg-orange { background-color: var(--lcars-orange); }
.text-blue { color: var(--lcars-blue); }
.p-md { padding: var(--spacing-md); }
EOF

# C. Combine into lcars24.css
cat "$FONTS_CSS" "$VARS_CSS" > "$COMBINED_CSS"

echo "✅ LCARS Unified Styling Complete:"
echo " - Fonts: $FONTS_CSS"
echo " - Variables: $VARS_CSS"
echo " - Combined: $COMBINED_CSS"
