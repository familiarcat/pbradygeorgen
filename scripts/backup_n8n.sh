#!/bin/bash

# N8N Workflow Backup Script Wrapper
# This script creates a backup of all currently deployed workflows

echo "💾 N8N Workflow Backup"
echo "======================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    exit 1
fi

# Check if virtual environment exists and activate it
if [ -d "venv" ]; then
    echo "🐍 Activating virtual environment..."
    source venv/bin/activate
else
    echo "⚠️  Virtual environment not found, creating one..."
    python3 -m venv venv
    source venv/bin/activate
fi

# Check if requests module is available
if ! python3 -c "import requests" &> /dev/null; then
    echo "📦 Installing required Python packages..."
    pip install requests
fi

# Check environment variables
if [ -z "$N8N_API_KEY" ]; then
    echo "❌ N8N_API_KEY environment variable not set"
    echo ""
    echo "📝 Setup Instructions:"
    echo "1. Add your n8n API key to ~/.zshrc:"
    echo "   export N8N_API_KEY='your-api-key-here'"
    echo "2. Reload your shell: source ~/.zshrc"
    echo "3. Run this script again"
    exit 1
fi

if [ -z "$N8N_BASE_URL" ]; then
    echo "⚠️  N8N_BASE_URL not set, using default: https://n8n.pbradygeorgen.com"
    export N8N_BASE_URL="https://n8n.pbradygeorgen.com"
fi

echo "🔗 N8N Base URL: $N8N_BASE_URL"
echo "🔑 API Key: ${N8N_API_KEY:0:8}..."

# Run the Python backup script
echo ""
python3 scripts/backup_n8n_workflows.py

echo ""
echo "💾 Backup script completed!"
