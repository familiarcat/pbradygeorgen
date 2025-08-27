#!/bin/bash

# Activate n8n Workflows for Production Webhook Access
# This script activates workflows to enable production webhook endpoints

set -e

echo "🎖️ CAPTAIN PICARD - N8N WORKFLOW ACTIVATION"
echo "==========================================="
echo ""

# Load environment variables
export N8N_DEPLOYED_URL="https://n8n.pbradygeorgen.com"
export N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"

echo "🔧 Activating n8n workflows for production webhook access..."
echo ""

# Function to activate a workflow
activate_workflow() {
    local workflow_id=$1
    local workflow_name=$2
    
    echo "🔄 Activating workflow: $workflow_name (ID: $workflow_id)"
    
    # Activate the workflow
    RESPONSE=$(curl -s -X PATCH "$N8N_DEPLOYED_URL/api/v1/workflows/$workflow_id" \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"active": true}' \
        --max-time 30)
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Successfully activated $workflow_name"
    else
        echo "   ❌ Failed to activate $workflow_name"
        echo "   Response: $RESPONSE"
    fi
    echo ""
}

# List of workflows to activate (from the API response)
echo "📋 Activating Federation Crew Workflows:"
echo "----------------------------------------"

# Activate each workflow
activate_workflow "QOJQTpLncfwyUUuv" "Federation Crew - OpenRouter Agent Coordination"
activate_workflow "WUtfB4g4k00uFOaH" "Captain Jean-Luc Picard - Strategic Leadership & Mission Command"
activate_workflow "HbljVTtTwYU5gPS6" "Commander Data - Analytics & Logic Operations"
activate_workflow "UMgLlLPbhcjwJtKK" "Lieutenant Commander Geordi La Forge - Infrastructure & System Integration"
activate_workflow "7k9XLyUbfijvYJo4" "Lieutenant Worf - Security & Compliance Operations"
activate_workflow "s9rJLcPYDSxGtyEQ" "Counselor Deanna Troi - User Experience & Empathy Analysis"
activate_workflow "FMRBAZnq9MOcAZSn" "Enhanced Federation Crew - Complete Mission Control"

echo "🔍 Verifying workflow activation..."
echo ""

# Test webhook endpoints
echo "🧪 Testing webhook endpoints:"
echo "-----------------------------"

# Test Captain Picard's endpoint
echo "📡 Testing Captain Picard webhook..."
PICARD_TEST=$(curl -s -X POST "$N8N_DEPLOYED_URL/webhook/crew-captain-jean-luc-picard" \
    -H "Content-Type: application/json" \
    -d '{"task": "Test webhook activation"}' \
    --max-time 10)

if [[ "$PICARD_TEST" != *"404"* ]]; then
    echo "   ✅ Captain Picard webhook is now accessible"
else
    echo "   ❌ Captain Picard webhook still not accessible"
fi

# Test Federation Mission endpoint
echo "📡 Testing Federation Mission webhook..."
MISSION_TEST=$(curl -s -X POST "$N8N_DEPLOYED_URL/webhook/federation-mission" \
    -H "Content-Type: application/json" \
    -d '{"mission_description": "Test mission"}' \
    --max-time 10)

if [[ "$MISSION_TEST" != *"404"* ]]; then
    echo "   ✅ Federation Mission webhook is now accessible"
else
    echo "   ❌ Federation Mission webhook still not accessible"
fi

echo ""
echo "🎖️ CAPTAIN PICARD: 'Admiral, I've attempted to activate the workflows for production webhook access. The Federation Crew should now be ready for deployment.'"
echo ""
echo "⚠️  NOTE: If webhooks are still not accessible, the workflows may need to be manually activated in the n8n interface."
echo "   Please check the n8n dashboard and ensure the toggle switches are in the 'ON' position for each workflow."
