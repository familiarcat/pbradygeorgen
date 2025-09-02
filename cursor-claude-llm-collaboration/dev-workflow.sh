#!/bin/bash

# 🚀 Quick Development Workflow
# For rapid iteration during development

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Quick Dev Workflow - Rapid Iteration${NC}"
echo ""

# Function to log
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

# Quick compile and package
log "⚡ Quick compile..."
npm run compile

log "📦 Quick package..."
npm run package

# Find the .vsix file
VSIX_FILE=$(ls -t *.vsix 2>/dev/null | head -1)
if [[ -n "$VSIX_FILE" ]]; then
    log "📁 Generated: $VSIX_FILE"
    
    # Install
    log "🚀 Installing..."
    cursor --install-extension "$VSIX_FILE"
    
    # Cleanup
    rm -f *.vsix
    
    echo ""
    echo -e "${YELLOW}⚡ Quick dev cycle complete!${NC}"
    echo -e "${YELLOW}Restart Cursor to test changes${NC}"
else
    echo -e "${YELLOW}No .vsix file generated${NC}"
fi
























