#!/bin/bash

# 🚀 Simple Deployment Script for Unified N8N Workflow
# This script directly deploys the enhanced unified AI workflow

set -e

echo "🚀 Starting simple deployment of Unified N8N Workflow..."

# Configuration
N8N_BASE_URL="https://n8n.pbradygeorgen.com"
WORKFLOW_FILE="enhanced_unified_workflow_clean.json"

# Check if required files exist
echo "📋 Checking required files..."
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo "❌ Error: $WORKFLOW_FILE not found!"
    exit 1
fi

echo "✅ All required files found"

# Check environment variables
echo "🔑 Checking environment variables..."
if [ -z "$N8N_API_KEY" ]; then
    echo "❌ Error: N8N_API_KEY not set"
    exit 1
fi

echo "✅ Environment variables configured"

# Deploy workflow directly
echo "🚀 Deploying unified workflow..."

# Read workflow data
WORKFLOW_DATA=$(cat "$WORKFLOW_FILE")

# Create new workflow
echo "🆕 Creating new workflow..."
CREATE_RESPONSE=$(curl -s -X POST \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$WORKFLOW_DATA" \
    "$N8N_BASE_URL/api/v1/workflows")

echo "📡 API Response received"

# Check if creation was successful
if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
    echo "✅ Workflow created successfully!"
    
    # Extract workflow ID
    WORKFLOW_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "📋 Workflow ID: $WORKFLOW_ID"
    
    # Activate workflow
    echo "🔌 Activating workflow..."
    ACTIVATE_RESPONSE=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"active": true}' \
        "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID/activate")
    
    if echo "$ACTIVATE_RESPONSE" | grep -q '"active"'; then
        echo "✅ Workflow activated successfully!"
    else
        echo "⚠️  Workflow activation may have failed"
    fi
    
    echo ""
    echo "🎉 Unified N8N Crew Deployment Complete!"
    echo "=================================================="
    echo "🌐 Workflow URL: $N8N_BASE_URL/workflow/$WORKFLOW_ID"
    echo "🔗 Webhook URL: $N8N_BASE_URL/webhook/enhanced-unified-ai"
    echo ""
    echo "🚀 Your unified AI crew is now online and ready for action!"
    echo "💡 Use the Cursor extension to send tasks to your crew"
    echo "💰 Cost optimization and intelligent routing are now active"
    
else
    echo "❌ Failed to create workflow"
    echo "Response: $CREATE_RESPONSE"
    exit 1
fi
