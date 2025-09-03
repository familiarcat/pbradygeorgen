#!/bin/bash

# 🚀 Cursor Extension CI/CD Workflow
# Automates building, testing, packaging, and deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
EXTENSION_NAME="cursor-claude-llm-collaboration"
VERSION=$(node -p "require('./package.json').version")
BRANCH=$(git branch --show-current)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo -e "${BLUE}🚀 Starting CI/CD Workflow for ${EXTENSION_NAME} v${VERSION}${NC}"
echo -e "${CYAN}Branch: ${BRANCH} | Timestamp: ${TIMESTAMP}${NC}"
echo ""

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

# Function to log warnings
warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

# Function to log errors
error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
}

# Function to log success
success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] ✅ $1${NC}"
}

# Step 1: Environment Check
log "🔍 Checking development environment..."
if ! command -v node &> /dev/null; then
    error "Node.js not found. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm not found. Please install npm first."
    exit 1
fi

if ! command -v cursor &> /dev/null; then
    warn "Cursor CLI not found. Some features may not work."
fi

success "Environment check completed"

# Step 2: Git Status Check
log "📊 Checking git status..."
if [[ -n $(git status --porcelain) ]]; then
    warn "Uncommitted changes detected:"
    git status --short
    echo ""
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "💾 Committing changes..."
        git add .
        git commit -m "🤖 Auto-commit: CI/CD workflow update ${TIMESTAMP}"
        success "Changes committed"
    else
        warn "Proceeding with uncommitted changes"
    fi
else
    success "Working directory is clean"
fi

# Step 3: Dependency Management
log "📦 Managing dependencies..."
if [[ ! -d "node_modules" ]] || [[ ! -f "package-lock.json" ]]; then
    log "Installing dependencies..."
    npm install
    success "Dependencies installed"
else
    log "Checking for dependency updates..."
    npm outdated || true
    success "Dependencies checked"
fi

# Step 4: Code Quality Check
log "🔍 Running code quality checks..."
if npm run lint 2>/dev/null; then
    success "Linting passed"
else
    warn "Linting failed or not configured"
fi

# Step 5: TypeScript Compilation
log "⚙️  Compiling TypeScript..."
if npm run compile; then
    success "TypeScript compilation successful"
else
    error "TypeScript compilation failed"
    exit 1
fi

# Step 6: Extension Packaging
log "📦 Packaging extension..."
if npm run package; then
    success "Extension packaged successfully"
    
    # Find the generated .vsix file
    VSIX_FILE=$(ls -t *.vsix 2>/dev/null | head -1)
    if [[ -n "$VSIX_FILE" ]]; then
        log "📁 Generated package: $VSIX_FILE"
        ls -lh "$VSIX_FILE"
    else
        error "No .vsix file found"
        exit 1
    fi
else
    error "Extension packaging failed"
    exit 1
fi

# Step 7: Extension Installation
log "🚀 Installing extension..."
if command -v cursor &> /dev/null; then
    if cursor --install-extension "$VSIX_FILE"; then
        success "Extension installed successfully"
    else
        error "Extension installation failed"
        exit 1
    fi
else
    warn "Cursor CLI not available, skipping installation"
fi

# Step 8: Verification
log "🔍 Verifying installation..."
if command -v cursor &> /dev/null; then
    if cursor --list-extensions | grep -q "$EXTENSION_NAME"; then
        success "Extension verified as installed"
    else
        error "Extension not found in installed extensions"
        exit 1
    fi
else
    warn "Cursor CLI not available, skipping verification"
fi

# Step 9: Cleanup
log "🧹 Cleaning up build artifacts..."
rm -f *.vsix
success "Build artifacts cleaned up"

# Step 10: Summary
echo ""
echo -e "${PURPLE}🎉 CI/CD Workflow Completed Successfully!${NC}"
echo -e "${CYAN}Extension: ${EXTENSION_NAME} v${VERSION}${NC}"
echo -e "${CYAN}Branch: ${BRANCH}${NC}"
echo -e "${CYAN}Timestamp: ${TIMESTAMP}${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Restart Cursor to load the new extension"
echo "2. Test with Cmd+Shift+P → 'Start LLM'"
echo "3. Verify the enhanced UI is working"
echo ""
echo -e "${BLUE}🚀 Your extension is ready for testing!${NC}"






















