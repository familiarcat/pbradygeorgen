#!/bin/bash

# 🚀 Cursor-Claude LLM Collaboration Extension Installer
# Installs the extension that converts your working Python system to VS Code

echo "🎉 CURSOR-CLAUDE LLM COLLABORATION EXTENSION INSTALLER"
echo "======================================================"
echo "Installing the extension that converts your working Python LLM system!"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the cursor-claude-llm-collaboration directory"
    exit 1
fi

# Build the extension
echo "🔨 Building the extension..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

echo "✅ Build successful!"

# Find the .vsix file
VSIX_FILE=$(find . -name "*.vsix" | head -1)

if [ -z "$VSIX_FILE" ]; then
    echo "❌ Error: .vsix file not found after build!"
    exit 1
fi

echo "📦 Found extension package: $VSIX_FILE"

# Detect OS and install
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    echo "🖥️  Detected OS: $OS"
    
    # Install to Cursor/VS Code
    echo "🚀 Installing extension..."
    code --install-extension "$VSIX_FILE"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Installation successful!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Restart Cursor/VS Code"
        echo "2. Press Cmd+Shift+P and type 'Start LLM Collaboration'"
        echo "3. The extension will integrate with your existing N8N system"
        echo ""
        echo "🔧 Configuration:"
        echo "Set your API keys in VS Code settings:"
        echo "- cursor-claude.n8nBaseUrl: Your N8N instance URL"
        echo "- cursor-claude.openRouterApiKey: Your OpenRouter API key"
        echo "- cursor-claude.claudeApiKey: Your Claude API key"
    else
        echo "❌ Installation failed!"
        exit 1
    fi
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    echo "🖥️  Detected OS: $OS"
    
    # Install to Cursor/VS Code
    echo "🚀 Installing extension..."
    code --install-extension "$VSIX_FILE"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Installation successful!"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Restart Cursor/VS Code"
        echo "2. Press Ctrl+Shift+P and type 'Start LLM Collaboration'"
        echo "3. The extension will integrate with your existing N8N system"
    else
        echo "❌ Installation failed!"
        exit 1
    fi
    
else
    echo "❌ Unsupported operating system: $OSTYPE"
    echo "Please install manually using: code --install-extension $VSIX_FILE"
    exit 1
fi

echo ""
echo "🚀 Your Python LLM collaboration system is now a VS Code extension!"
echo "The extension maintains all the functionality of your working Python system"
echo "while providing a beautiful, integrated interface in Cursor/VS Code."





