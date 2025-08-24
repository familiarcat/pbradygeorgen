#!/bin/bash

echo "🚀 Quick Deploy to N8N"
echo "======================="

# Load environment variables
source ~/.zshrc

# Test n8n connection
echo "🔍 Testing n8n connection..."
if curl -s -H "Authorization: Bearer $N8N_API_KEY" "$N8N_URL/api/v1/health" > /dev/null; then
    echo "✅ N8N connection successful"
else
    echo "❌ N8N connection failed"
    exit 1
fi

echo "📋 Available workflows:"
ls -la n8n_workflows/

echo ""
echo "🎯 To deploy workflows:"
echo "1. Copy this directory to your n8n server"
echo "2. Run: python3 deploy_workflows.py"
echo "3. Or manually import each .json file in n8n interface"
echo ""
echo "🔐 Environment variables loaded from ~/.zshrc"
echo "🌐 N8N URL: $N8N_URL"
echo "🔑 OpenRouter API Key: ${OPENROUTER_API_KEY:0:20}..."
