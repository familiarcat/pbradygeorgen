#!/bin/bash

# 🧹 Claude-Cursor Extension Cleanup Script
# Helps remove old extensions and prepare for clean installation

set -e

echo "🧹 Claude-Cursor Extension Cleanup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

echo "🚨 PROBLEM IDENTIFIED:"
echo "  Old Claude-Cursor extension still installed in Cursor IDE"
echo "  Command palette shows conflicting commands"
echo "  Need complete cleanup for unified experience"
echo ""

print_status "🎯 CLEANUP GOAL:"
echo "  Remove ALL old Claude-Cursor extensions"
echo "  Install ONLY new cursor-ai-supercharger"
echo "  Achieve clean, unified command palette"
echo ""

print_status "📋 MANUAL CLEANUP STEPS REQUIRED:"
echo ""
echo "1. 🗑️  UNINSTALL OLD EXTENSIONS:"
echo "   - Open Cursor IDE Extensions panel (Ctrl+Shift+X)"
echo "   - Find any 'Claude-Cursor' or 'LLM Collaboration' extensions"
echo "   - Click gear icon (⚙️) → 'Uninstall'"
echo "   - Click 'Reload' when prompted"
echo ""

echo "2. 🧹 VERIFY CLEAN COMMAND PALETTE:"
echo "   - Open Command Palette (Ctrl+Shift+P)"
echo "   - Search for 'Claude-Cursor' → Should show NO results"
echo "   - Search for 'LLM Collaboration' → Should show NO results"
echo ""

echo "3. 🚀 INSTALL NEW UNIFIED EXTENSION:"
echo "   - Extensions panel → '...' (three dots) → 'Install from VSIX...'"
echo "   - Browse to: $(pwd)/cursor-claude-unified/cursor-ai-supercharger-3.0.0.vsix"
echo "   - Click 'Install'"
echo ""

echo "4. ✅ VERIFY NEW EXTENSION:"
echo "   - Should see '🚀 Cursor AI Supercharger' in Extensions list"
echo "   - Status should be 'Installed' and 'Enabled'"
echo ""

print_status "🧪 AFTER CLEANUP - TEST COMMANDS:"
echo ""
echo "1. Open Command Palette: Ctrl+Shift+P"
echo "2. Type 'Cursor AI' → Should see 14 new commands"
echo "3. Try '🚀 Activate Cursor AI Supercharger'"
echo "4. Verify NO old Claude-Cursor commands appear"
echo ""

print_status "🎨 EXPECTED RESULT:"
echo ""
echo "✅ Clean command palette with NO conflicts"
echo "✅ 14 new enhanced commands from cursor-ai-supercharger"
echo "✅ Traditional chat interface preserved"
echo "✅ Multi-LLM capabilities seamlessly integrated"
echo "✅ Unified, professional experience"
echo ""

# Check if Cursor is running
if pgrep -f "Cursor" > /dev/null; then
    print_success "Cursor IDE is running - ready for cleanup!"
else
    print_warning "Cursor IDE is not running - please start it first"
fi

echo ""
print_warning "⚠️  IMPORTANT: This cleanup requires MANUAL steps in Cursor IDE"
print_status "📋 Follow the steps above to achieve clean, unified experience"
echo ""
print_success "🎯 Result: Professional, conflict-free command palette with enhanced AI capabilities!"



