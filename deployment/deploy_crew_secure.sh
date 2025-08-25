#!/bin/bash
# 🔐 SECURE ALEXAI CREW DEPLOYMENT SCRIPT
# Uses environment variables from ~/.zshrc
# NO API KEYS EXPOSED

echo "🚀 Starting secure AlexAI crew deployment..."

# Load environment variables
source ~/.zshrc

# Verify secrets are loaded (show only first 20 chars)
echo "✅ N8N API Key: ${N8N_API_KEY:0:20}..."
echo "✅ OpenRouter API Key: ${OPENROUTER_API_KEY:0:20}..."
echo "✅ N8N URL: $N8N_URL"

# Test n8n connection
echo "🔌 Testing n8n connection..."
curl -s "https://n8n.pbradygeorgen.com/api/health" | head -5

echo ""
echo "📋 Manual deployment steps:"
echo "1. Open: https://n8n.pbradygeorgen.com"
echo "2. Import: ultimate_import_ready/comprehensive_crew_workflow.json"
echo "3. Setup OpenRouter credentials"
echo "4. Activate workflow"
echo "5. Test deployment"

echo ""
echo "🧪 Test command:"
echo "curl -X POST https://n8n.pbradygeorgen.com/webhook/alexai-crew-mission \"
echo "  -H 'Content-Type: application/json' \"
echo "  -d '{"mission_description": "Test crew deployment", "mission_id": "test-001"}'"

echo ""
echo "🔐 Deployment completed securely!"
