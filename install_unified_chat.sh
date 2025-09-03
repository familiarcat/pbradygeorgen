#!/bin/bash

# 🚀 Unified Cursor AI Chat Installation Script
# Installs the enhanced chat extension with multi-LLM capabilities

set -e

echo "🚀 Installing Unified Cursor AI Chat Extension"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "cursor-claude-unified" ]; then
    print_error "cursor-claude-unified directory not found!"
    print_error "Please run this script from the workspace root directory."
    exit 1
fi

# Check if VSIX file exists
VSIX_FILE="cursor-claude-unified/cursor-ai-supercharger-3.0.0.vsix"
if [ ! -f "$VSIX_FILE" ]; then
    print_error "VSIX file not found: $VSIX_FILE"
    exit 1
fi

print_status "Found VSIX package: $VSIX_FILE"
print_status "Package size: $(ls -lh "$VSIX_FILE" | awk '{print $5}')"

echo ""
print_status "🎯 Extension Features:"
echo "  ✅ Enhanced traditional chat interface"
echo "  ✅ Multi-LLM selection and optimization"
echo "  ✅ Cost optimization dashboard"
echo "  ✅ N8N workflow integration"
echo "  ✅ 14 new commands for advanced functionality"
echo "  ✅ Seamless integration with existing Cursor chat"

echo ""
print_status "📋 Installation Instructions:"
echo ""
echo "1. Open Cursor IDE"
echo "2. Press Ctrl+Shift+X (or Cmd+Shift+X on Mac) to open Extensions"
echo "3. Click the '...' (three dots) in the Extensions panel"
echo "4. Select 'Install from VSIX...'"
echo "5. Browse to: $(pwd)/$VSIX_FILE"
echo "6. Click 'Install'"
echo ""

print_status "🧪 After Installation - Test Commands:"
echo ""
echo "1. Open Command Palette: Ctrl+Shift+P (or Cmd+Shift+P)"
echo "2. Type 'Cursor AI' to see all enhanced commands"
echo "3. Try 'Activate Cursor AI Supercharger' to enable features"
echo "4. Use 'Auto-Enhance Current Chat Session' in any chat"
echo ""

print_status "🎨 Expected Experience:"
echo ""
echo "✅ Traditional chat interface (familiar and unchanged)"
echo "✅ Better responses (automatic multi-LLM optimization)"
echo "✅ New commands (14 additional capabilities)"
echo "✅ Cost optimization (intelligent LLM selection)"
echo "✅ Enhanced context (better code understanding)"
echo ""

# Check if Cursor is running
if pgrep -f "Cursor" > /dev/null; then
    print_success "Cursor IDE is running - ready for installation!"
else
    print_warning "Cursor IDE is not running - please start it first"
fi

echo ""
print_success "🚀 Ready to install unified Cursor AI chat!"
print_status "Follow the instructions above to complete installation."
echo ""
print_status "After installation, your chat will be enhanced with:"
echo "  🧠 Multi-LLM intelligence"
echo "  💰 Cost optimization"
echo "  🔄 N8N integration"
echo "  ✨ Enhanced context understanding"
echo ""
print_success "Enjoy your enhanced AI chat experience! 🎉"




