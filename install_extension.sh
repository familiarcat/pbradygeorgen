#!/bin/bash

# 🚀 CURSOR-CLAUDE UNIFIED EXTENSION INSTALLER
# Revolutionary AI collaboration extension for Cursor AI and VS Code

echo "🎉 CURSOR-CLAUDE UNIFIED EXTENSION INSTALLER"
echo "=============================================="
echo "Installing the world's first Claude-Cursor collaboration system!"
echo ""

  # Check if we're in the right directory
  if [ ! -f "cursor-claude-unified-2.0.0.vsix" ]; then
    echo "❌ Error: cursor-claude-unified-2.0.0.vsix not found!"
    echo "Please run this script from the cursor-claude-unified directory"
    exit 1
fi

# Detect OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macOS"
    CURSOR_EXTENSIONS="$HOME/.cursor/extensions"
    VSCODE_EXTENSIONS="$HOME/.vscode/extensions"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="Linux"
    CURSOR_EXTENSIONS="$HOME/.cursor/extensions"
    VSCODE_EXTENSIONS="$HOME/.vscode/extensions"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    OS="Windows"
    CURSOR_EXTENSIONS="$USERPROFILE/.cursor/extensions"
    VSCODE_EXTENSIONS="$USERPROFILE/.vscode/extensions"
else
    echo "❌ Unsupported operating system: $OSTYPE"
    exit 1
fi

echo "🖥️  Detected OS: $OS"
echo "📁 Cursor Extensions: $CURSOR_EXTENSIONS"
echo "📁 VS Code Extensions: $VSCODE_EXTENSIONS"
echo ""

# Function to install extension
install_extension() {
    local target_dir="$1"
    local extension_name="$2"
    
    if [ -d "$target_dir" ]; then
        echo "📦 Installing to: $target_dir"
        
        # Create extension directory
        mkdir -p "$target_dir/$extension_name"
        
        # Copy extension files
        cp -r * "$target_dir/$extension_name/"
        
        if [ $? -eq 0 ]; then
            echo "✅ Successfully installed to $target_dir/$extension_name"
            return 0
        else
            echo "❌ Failed to install to $target_dir"
            return 1
        fi
    else
        echo "⚠️  Directory not found: $target_dir"
        return 1
    fi
}

# Installation options
echo "🎯 Choose installation method:"
echo "1. Install to Cursor AI (Recommended)"
echo "2. Install to VS Code"
echo "3. Install to both"
echo "4. Manual installation instructions"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Installing to Cursor AI..."
        install_extension "$CURSOR_EXTENSIONS" "cursor-claude-unified"
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Installation successful! Please restart Cursor AI."
        fi
        ;;
    2)
        echo ""
        echo "🚀 Installing to VS Code..."
        install_extension "$VSCODE_EXTENSIONS" "cursor-claude-unified"
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Installation successful! Please restart VS Code."
        fi
        ;;
    3)
        echo ""
        echo "🚀 Installing to both Cursor AI and VS Code..."
        install_extension "$CURSOR_EXTENSIONS" "cursor-claude-unified"
        cursor_success=$?
        install_extension "$VSCODE_EXTENSIONS" "cursor-claude-unified"
        vscode_success=$?
        
        if [ $cursor_success -eq 0 ] && [ $vscode_success -eq 0 ]; then
            echo ""
            echo "🎉 Installation successful to both IDEs! Please restart them."
        else
            echo ""
            echo "⚠️  Some installations may have failed. Check the output above."
        fi
        ;;
    4)
        echo ""
        echo "📚 MANUAL INSTALLATION INSTRUCTIONS"
        echo "=================================="
        echo ""
        echo "🎯 Method 1: VSIX Installation (Recommended)"
        echo "1. Open Cursor AI or VS Code"
        echo "2. Command Palette: Ctrl+Shift+P (or Cmd+Shift+P on Mac)"
        echo "3. Type: 'Extensions: Install from VSIX'"
        echo "4. Browse to: $(pwd)"
        echo "5. Select: cursor-claude-unified-1.0.0.vsix"
        echo "6. Click Install"
        echo ""
        echo "🎯 Method 2: Development Mode"
        echo "1. Open Cursor AI or VS Code"
        echo "2. File → Open Folder"
        echo "3. Select: $(pwd)"
        echo "4. Press F5 to launch Extension Development Host"
        echo ""
        echo "🎯 Method 3: Direct File Copy"
        echo "1. Find extensions folder:"
        echo "   - Cursor: $CURSOR_EXTENSIONS"
        echo "   - VS Code: $VSCODE_EXTENSIONS"
        echo "2. Create: cursor-claude-unified directory"
        echo "3. Copy all files from: $(pwd)"
        echo "4. Restart your IDE"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🔧 POST-INSTALLATION SETUP"
echo "=========================="
echo "1. Restart your IDE (Cursor AI or VS Code)"
echo "2. Set API keys in environment variables:"
echo "   export CLAUDE_API_KEY='your_claude_api_key'"
echo "   export OPENROUTER_API_KEY='your_openrouter_api_key'"
echo "3. Open Command Palette: Ctrl+Shift+P"
echo "4. Search: 'Start Unified AI Chat'"
echo "5. Launch the revolutionary AI collaboration!"
echo ""
echo "🎉 Welcome to the future of AI collaboration!"
echo "🚀 Your Claude-Cursor unified extension is ready!"
