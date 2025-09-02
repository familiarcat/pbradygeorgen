#!/bin/bash

# 🚀 Development Environment Setup
# Sets up the complete development environment for the extension

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Setting up Development Environment${NC}"
echo ""

# Function to log
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%H:%M:%S')] ❌ $1${NC}"
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -f "tsconfig.json" ]]; then
    error "Please run this script from the extension root directory"
    exit 1
fi

# Step 1: Check Node.js version
log "🔍 Checking Node.js version..."
NODE_VERSION=$(node --version)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | tr -d 'v')
if [[ $NODE_MAJOR -lt 18 ]]; then
    error "Node.js 18+ required. Current: $NODE_VERSION"
    exit 1
fi
success "Node.js version: $NODE_VERSION"

# Step 2: Check npm version
log "📦 Checking npm version..."
NPM_VERSION=$(npm --version)
success "npm version: $NPM_VERSION"

# Step 3: Install dependencies
log "📦 Installing dependencies..."
npm install
success "Dependencies installed"

# Step 4: Setup git hooks
log "🔗 Setting up git hooks..."
if [[ -d ".git" ]]; then
    # Create pre-commit hook
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "🧪 Running pre-commit checks..."
npm run compile
if [ $? -eq 0 ]; then
    echo "✅ Pre-commit checks passed"
    exit 0
else
    echo "❌ Pre-commit checks failed"
    exit 1
fi
EOF
    chmod +x .git/hooks/pre-commit
    success "Git hooks configured"
else
    warn "Not a git repository, skipping git hooks"
fi

# Step 5: Create development scripts
log "📝 Creating development scripts..."
chmod +x cicd-workflow.sh
chmod +x dev-workflow.sh
chmod +x auto-fix-and-load.sh
chmod +x auto-resolve-conflicts.sh
success "Development scripts made executable"

# Step 6: Initial build
log "⚙️  Initial build..."
npm run compile
success "Initial build completed"

# Step 7: Verify configuration
log "🔍 Verifying configuration..."
if [[ -f "~/.zshrc" ]]; then
    echo "📁 ~/.zshrc found, checking for required environment variables..."
    if grep -q "N8N_BASE_URL\|OPENROUTER_API_KEY\|CLAUDE_API_KEY" ~/.zshrc; then
        success "Environment variables found in ~/.zshrc"
    else
        warn "Some environment variables may be missing from ~/.zshrc"
    fi
else
    warn "~/.zshrc not found, please ensure environment variables are set"
fi

# Step 8: Setup VS Code settings
log "⚙️  Setting up VS Code settings..."
mkdir -p .vscode
cat > .vscode/settings.json << 'EOF'
{
    "typescript.preferences.includePackageJsonAutoImports": "on",
    "typescript.suggest.autoImports": true,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "explicit"
    }
}
EOF
success "VS Code settings configured"

# Step 9: Create .vscodeignore
log "📝 Creating .vscodeignore..."
cat > .vscodeignore << 'EOF'
node_modules/
.git/
.github/
*.vsix
*.log
.DS_Store
*.md
*.sh
EOF
success ".vscodeignore created"

echo ""
echo -e "${BLUE}🎉 Development Environment Setup Complete!${NC}"
echo ""
echo -e "${GREEN}Available commands:${NC}"
echo "  ./cicd-workflow.sh     - Full CI/CD workflow"
echo "  ./dev-workflow.sh      - Quick development iteration"
echo "  ./auto-fix-and-load.sh - Auto-fix and load extension"
echo "  npm run compile        - Compile TypeScript"
echo "  npm run package        - Package extension"
echo "  npm run build          - Build and package"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test the extension: ./dev-workflow.sh"
echo "2. Make changes to src/extension.ts"
echo "3. Use ./dev-workflow.sh for quick iterations"
echo "4. Use ./cicd-workflow.sh for full deployment"
echo ""
echo -e "${BLUE}🚀 Happy coding!${NC}"











