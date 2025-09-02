#!/bin/bash

# 🚀 CURSOR EXTENSION CLEAN DEPLOYMENT
# This script removes old versions and cleanly deploys the new extension

set -e  # Exit on any error

echo "🎉 CURSOR EXTENSION CLEAN DEPLOYMENT"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the main workspace root"
    exit 1
fi

# Configuration
EXTENSION_NAME="cursor-claude-unified"
EXTENSION_DIR="cursor-claude-unified"
CURSOR_EXTENSIONS="$HOME/.cursor/extensions"
VSCODE_EXTENSIONS="$HOME/.vscode/extensions"
DEV_EXTENSION_DIR="$HOME/.vscode/extensions/${EXTENSION_NAME}-dev"

print_status "Starting clean deployment of $EXTENSION_NAME..."

# Step 1: Stop Cursor/VS Code processes
print_status "Step 1: Stopping Cursor/VS Code processes..."
pkill -f "Cursor" 2>/dev/null || true
pkill -f "Code" 2>/dev/null || true
sleep 2

# Step 2: Remove old extension versions
print_status "Step 2: Removing old extension versions..."

# Remove from Cursor extensions
if [ -d "$CURSOR_EXTENSIONS" ]; then
    print_status "Cleaning Cursor extensions directory..."
    find "$CURSOR_EXTENSIONS" -maxdepth 1 -name "*${EXTENSION_NAME}*" -type d -exec rm -rf {} + 2>/dev/null || true
    find "$CURSOR_EXTENSIONS" -maxdepth 1 -name "*${EXTENSION_NAME}*" -name "*.vsix" -delete 2>/dev/null || true
fi

# Remove from VS Code extensions
if [ -d "$VSCODE_EXTENSIONS" ]; then
    print_status "Cleaning VS Code extensions directory..."
    find "$VSCODE_EXTENSIONS" -maxdepth 1 -name "*${EXTENSION_NAME}*" -type d -exec rm -rf {} + 2>/dev/null || true
    find "$VSCODE_EXTENSIONS" -maxdepth 1 -name "*${EXTENSION_NAME}*" -name "*.vsix" -delete 2>/dev/null || true
fi

# Remove development symlink
if [ -L "$DEV_EXTENSION_DIR" ] || [ -d "$DEV_EXTENSION_DIR" ]; then
    print_status "Removing development symlink..."
    rm -rf "$DEV_EXTENSION_DIR"
fi

print_success "Old extension versions removed"

# Step 3: Clean extension build artifacts
print_status "Step 3: Cleaning extension build artifacts..."
cd "$EXTENSION_DIR"

if [ ! -f "package.json" ]; then
    print_error "Extension directory not found: $EXTENSION_DIR"
    exit 1
fi

# Remove build artifacts
rm -rf out/
rm -f *.vsix
rm -rf node_modules/

print_success "Build artifacts cleaned"

# Step 4: Fresh install and build
print_status "Step 4: Fresh install and build..."

# Install dependencies
print_status "Installing dependencies..."
npm install

# Compile extension
print_status "Compiling extension..."
npm run compile

if [ $? -eq 0 ]; then
    print_success "Extension compiled successfully"
else
    print_error "Extension compilation failed"
    exit 1
fi

# Step 5: Package extension
print_status "Step 5: Packaging extension..."
npm run package

if [ $? -eq 0 ]; then
    print_success "Extension packaged successfully"
else
    print_error "Extension packaging failed"
    exit 1
fi

# Get the generated VSIX file
VSIX_FILE=$(ls -t *.vsix | head -1)
if [ -z "$VSIX_FILE" ]; then
    print_error "No VSIX file generated"
    exit 1
fi

print_success "Extension packaged: $VSIX_FILE"

# Step 6: Create development symlink
print_status "Step 6: Creating development symlink..."
DEV_EXTENSION_DIR="$HOME/.vscode/extensions/${EXTENSION_NAME}-dev"

# Create VS Code extensions directory if it doesn't exist
mkdir -p "$HOME/.vscode/extensions"

# Create development symlink
ln -sf "$(pwd)" "$DEV_EXTENSION_DIR"

print_success "Development symlink created at: $DEV_EXTENSION_DIR"

# Step 7: Install extension in Cursor
print_status "Step 7: Installing extension in Cursor..."

# Create Cursor extensions directory if it doesn't exist
mkdir -p "$CURSOR_EXTENSIONS"

# Copy VSIX to Cursor extensions
cp "$VSIX_FILE" "$CURSOR_EXTENSIONS/"

print_success "Extension installed in Cursor extensions"

# Return to main workspace
cd ..

# Step 8: Verification
print_status "Step 8: Verifying installation..."

# Check if extension files exist
if [ -d "$DEV_EXTENSION_DIR" ] && [ -f "$DEV_EXTENSION_DIR/out/extension.js" ]; then
    print_success "Development symlink verified"
else
    print_warning "Development symlink verification failed"
fi

if [ -f "$CURSOR_EXTENSIONS/$VSIX_FILE" ]; then
    print_success "Cursor extension installation verified"
else
    print_warning "Cursor extension installation verification failed"
fi

# Step 9: Final instructions
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="
echo ""
print_success "Extension deployed successfully"
echo ""
echo "🚀 Next Steps:"
echo "1. Restart Cursor/VS Code completely"
echo "2. Check Extensions panel for 'Cursor-Claude Unified Chat'"
echo "3. Use Command Palette: 'Cursor-Claude: Start Unified Chat'"
echo ""
echo "🔄 Development Commands:"
echo "  cd cursor-claude-unified && npm run compile    # Rebuild after changes"
echo "  cd cursor-claude-unified && npm run watch     # Watch mode for development"
echo "  cd cursor-claude-unified && npm run package   # Package for distribution"
echo ""
echo "📁 Extension Locations:"
echo "  Development: $DEV_EXTENSION_DIR"
echo "  Cursor: $CURSOR_EXTENSIONS/$VSIX_FILE"
echo ""
echo "🧹 To clean deploy again, run this script again"




































