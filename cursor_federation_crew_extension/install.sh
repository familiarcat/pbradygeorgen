#!/bin/bash

# 🏛️ Federation Crew - Cursor Extension Installer
# This script builds and installs the Federation Crew extension for Cursor

set -e

echo "🏛️ FEDERATION CREW - CURSOR EXTENSION INSTALLER"
echo "=================================================="

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the extension
echo "🔨 Building extension..."
npm run compile

if [ ! -f "out/extension.js" ]; then
    echo "❌ Build failed. Check for compilation errors."
    exit 1
fi

echo "✅ Extension built successfully"

# Create VSIX package
echo "📦 Creating VSIX package..."
if command -v vsce &> /dev/null; then
    vsce package
    echo "✅ VSIX package created"
else
    echo "⚠️  vsce not found. Install with: npm install -g vsce"
    echo "💡 You can still install the extension manually from the out/ directory"
fi

# Check for Cursor installation
echo "🔍 Looking for Cursor installation..."

CURSOR_PATHS=(
    "$HOME/Library/Application Support/Cursor/User/extensions"
    "$HOME/.config/Cursor/User/extensions"
    "$APPDATA/Cursor/User/extensions"
)

CURSOR_FOUND=false
for path in "${CURSOR_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo "✅ Found Cursor extensions directory: $path"
        CURSOR_FOUND=true
        break
    fi
done

if [ "$CURSOR_FOUND" = false ]; then
    echo "⚠️  Cursor extensions directory not found in standard locations"
    echo "💡 You may need to install the extension manually"
fi

# Installation instructions
echo ""
echo "🎉 INSTALLATION COMPLETED!"
echo "=================================================="
echo ""
echo "📋 NEXT STEPS:"
echo "1. Open Cursor"
echo "2. Go to Extensions (Ctrl+Shift+X)"
echo "3. Click '...' and select 'Install from VSIX...'"
echo "4. Navigate to this directory and select the .vsix file"
echo ""
echo "🔧 CONFIGURATION:"
echo "1. Set your environment variables:"
echo "   export N8N_API_KEY='your_n8n_api_key'"
echo "   export OPENROUTER_API_KEY='your_openrouter_api_key'"
echo ""
echo "2. Restart Cursor"
echo "3. The Federation Crew will activate automatically!"
echo ""
echo "🎮 USAGE:"
echo "- Type 'activate n8n' or 'all hands on deck' in any Cursor instance"
echo "- Use 'Cmd/Ctrl + Shift + P' → 'Federation Crew' commands"
echo "- Enjoy global Federation Crew access across all your projects!"
echo ""
echo "🏛️ Your Federation Crew is ready for duty, Admiral!"
echo "🖖 Live long and prosper!"
