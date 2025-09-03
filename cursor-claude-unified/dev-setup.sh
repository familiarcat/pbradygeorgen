#!/bin/bash

# 🚀 CURSOR-CLAUDE UNIFIED - LOCAL DEVELOPMENT SETUP
# This script sets up the extension for local development in your workspace

echo "🎉 Setting up Cursor-Claude Unified for local development..."

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: Please run this script from the cursor-claude-unified directory"
    exit 1
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf out/
rm -f *.vsix

# Compile the extension
echo "🔨 Compiling extension..."
npm run compile

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful!"
else
    echo "❌ Compilation failed!"
    exit 1
fi

# Create development symlink for local testing
echo "🔗 Setting up development symlink..."
DEV_EXTENSION_DIR="$HOME/.vscode/extensions/cursor-claude-unified-dev"

# Remove existing dev symlink
rm -rf "$DEV_EXTENSION_DIR"

# Create new dev symlink
ln -sf "$(pwd)" "$DEV_EXTENSION_DIR"

echo "✅ Development symlink created at: $DEV_EXTENSION_DIR"
echo ""
echo "🚀 Local Development Setup Complete!"
echo ""
echo "To test the extension locally:"
echo "1. Restart Cursor/VS Code"
echo "2. The extension should appear in your extensions list"
echo "3. Use Command Palette: 'Cursor-Claude: Start Unified Chat'"
echo ""
echo "To rebuild after changes:"
echo "  npm run compile"
echo ""
echo "To package for distribution:"
echo "  npm run package"












































