#!/bin/bash

# 🚀 Observation Lounge Deployment Script
# Deploys the crew coordination and decision-making system

set -e

echo "🚀 Starting Observation Lounge deployment..."

# Configuration
N8N_BASE_URL="https://n8n.pbradygeorgen.com"
WORKFLOW_FILE="observation_lounge_workflow.json"

# Check if required files exist
echo "📋 Checking required files..."
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo "❌ Error: $WORKFLOW_FILE not found!"
    exit 1
fi

if [ ! -f "crew_coordinator.py" ]; then
    echo "❌ Error: crew_coordinator.py not found!"
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

# Deploy Observation Lounge workflow
echo "🚀 Deploying Observation Lounge workflow..."

# Read workflow data
WORKFLOW_DATA=$(cat "$WORKFLOW_FILE")

# Create new workflow
echo "🆕 Creating Observation Lounge workflow..."
CREATE_RESPONSE=$(curl -s -X POST \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$WORKFLOW_DATA" \
    "$N8N_BASE_URL/api/v1/workflows")

echo "📡 API Response received"

# Check if creation was successful
if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
    echo "✅ Observation Lounge workflow created successfully!"
    
    # Extract workflow ID
    WORKFLOW_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "📋 Workflow ID: $WORKFLOW_ID"
    
    # Activate workflow
    echo "🔌 Activating Observation Lounge workflow..."
    ACTIVATE_RESPONSE=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"active": true}' \
        "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID/activate")
    
    if echo "$ACTIVATE_RESPONSE" | grep -q '"active"'; then
        echo "✅ Observation Lounge workflow activated successfully!"
    else
        echo "⚠️  Workflow activation may have failed"
    fi
    
    echo ""
    echo "🎉 Observation Lounge Deployment Complete!"
    echo "=================================================="
    echo "🌐 Workflow URL: $N8N_BASE_URL/workflow/$WORKFLOW_ID"
    echo "🔗 Webhook URL: $N8N_BASE_URL/webhook/observation-lounge"
    echo ""
    echo "🚀 Your Observation Lounge is now online!"
    echo "💡 Crew members can now convene for collaborative discussions"
    echo "🤝 Department-specific meetings and strategic planning enabled"
    echo "📊 Real-time crew coordination and decision-making active"
    
    # Test the Observation Lounge
    echo ""
    echo "🧪 Testing Observation Lounge functionality..."
    TEST_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{
            "topic": "Test Observation Lounge Session",
            "context": {
                "test": true,
                "purpose": "Verification of crew coordination system"
            },
            "discussion_type": "collaborative",
            "priority": "medium"
        }' \
        "$N8N_BASE_URL/webhook/observation-lounge")
    
    if echo "$TEST_RESPONSE" | grep -q '"success"'; then
        echo "✅ Observation Lounge test successful!"
        echo "📊 Test response received"
    else
        echo "⚠️  Observation Lounge test may have issues"
        echo "Response: $TEST_RESPONSE"
    fi
    
else
    echo "❌ Failed to create Observation Lounge workflow"
    echo "Response: $CREATE_RESPONSE"
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Test crew coordination with different discussion types"
echo "2. Verify department-specific routing"
echo "3. Check crew member insights and synthesis"
echo "4. Monitor real-time status updates"
echo ""
echo "🚀 The Observation Lounge is ready for crew coordination!"
