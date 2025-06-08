#!/bin/bash

set -e

echo "🔧 [O'Brien] Ensuring OPENAI_API_KEY environment configuration is secure and consistent..."

ENV_FILE=".env.local"
NEXT_CONFIG="next.config.js"
GITIGNORE=".gitignore"

# 1. Create or update .env.local
if [ ! -f "$ENV_FILE" ]; then
    echo "🌱 Creating $ENV_FILE..."
    echo "OPENAI_API_KEY=sk-your-api-key-here" >"$ENV_FILE"
    echo "✅ .env.local created with placeholder."
else
    if ! grep -q "OPENAI_API_KEY" "$ENV_FILE"; then
        echo "OPENAI_API_KEY=sk-your-api-key-here" >>"$ENV_FILE"
        echo "✅ OPENAI_API_KEY added to existing $ENV_FILE."
    else
        echo "✅ .env.local already contains OPENAI_API_KEY."
    fi
fi

# 2. Add dotenv loader to next.config.js
if [ -f "$NEXT_CONFIG" ]; then
    if ! grep -q "dotenv.config()" "$NEXT_CONFIG"; then
        echo "💡 Patching dotenv support into $NEXT_CONFIG..."

        # Add dotenv at the top
        cp "$NEXT_CONFIG" "${NEXT_CONFIG}.bak"
        echo 'require("dotenv").config();' | cat - "$NEXT_CONFIG" >temp && mv temp "$NEXT_CONFIG"

        # Add env object
        awk '/module\.exports *= *{/{print; print "  env: {\n    OPENAI_API_KEY: process.env.OPENAI_API_KEY,\n  },"; next}1' "$NEXT_CONFIG" >temp && mv temp "$NEXT_CONFIG"

        echo "✅ next.config.js updated to expose OPENAI_API_KEY."
    else
        echo "✅ next.config.js already loads dotenv and exposes OPENAI_API_KEY."
    fi
else
    echo "🚨 next.config.js not found. Please create or adjust manually."
fi

# 3. Add .env.local to .gitignore
if [ -f "$GITIGNORE" ]; then
    if ! grep -q ".env.local" "$GITIGNORE"; then
        echo ".env.local" >>"$GITIGNORE"
        echo "✅ .env.local added to .gitignore."
    else
        echo "✅ .gitignore already excludes .env.local."
    fi
else
    echo "🌱 Creating .gitignore with .env.local..."
    echo ".env.local" >"$GITIGNORE"
fi

# 4. Ensure dotenv is installed
if ! npm list dotenv &>/dev/null; then
    echo "📦 Installing dotenv..."
    npm install dotenv
else
    echo "✅ dotenv is already installed."
fi

# 5. Summary
echo ""
echo "🧪 Run the following to verify:"
echo "  cat .env.local"
echo "  npm run dev"
echo ""
echo "🧰 Maintenance complete. OPENAI_API_KEY structure ready for secure operation."
