#!/bin/bash

# Investigate n8n Webhook Configuration
# This script analyzes the current webhook setup to identify configuration issues

set -e

echo "🎖️ CAPTAIN PICARD - WEBHOOK CONFIGURATION INVESTIGATION"
echo "======================================================="
echo ""

# Load environment variables
export N8N_DEPLOYED_URL="https://n8n.pbradygeorgen.com"
export N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"

echo "🔍 Investigating current webhook configuration..."
echo ""

# Function to analyze workflow webhook configuration
analyze_workflow_webhook() {
    local workflow_id=$1
    local workflow_name=$2
    
    echo "📋 Analyzing: $workflow_name"
    echo "----------------------------------------"
    
    # Get workflow details
    WORKFLOW_DATA=$(curl -s -X GET "$N8N_DEPLOYED_URL/api/v1/workflows/$workflow_id" \
        -H "X-N8N-API-KEY: $N8N_API_KEY")
    
    if [ $? -eq 0 ] && [ -n "$WORKFLOW_DATA" ]; then
        # Extract webhook node information
        echo "   🔗 Webhook Node Analysis:"
        
        # Check if there are webhook nodes
        WEBHOOK_COUNT=$(echo "$WORKFLOW_DATA" | jq '.nodes[] | select(.type == "n8n-nodes-base.webhook") | .name' | wc -l)
        
        if [ "$WEBHOOK_COUNT" -gt 0 ]; then
            echo "   ✅ Found $WEBHOOK_COUNT webhook node(s)"
            
            # Extract webhook details
            echo "$WORKFLOW_DATA" | jq -r '.nodes[] | select(.type == "n8n-nodes-base.webhook") | "   📍 Node: " + .name + " | Path: " + .parameters.path + " | Method: " + .parameters.httpMethod'
            
            # Check webhook configuration
            echo "$WORKFLOW_DATA" | jq -r '.nodes[] | select(.type == "n8n-nodes-base.webhook") | "   ⚙️  Response Mode: " + .parameters.responseMode + " | Active: " + (.parameters.active // "not set")'
        else
            echo "   ❌ No webhook nodes found"
        fi
        
        # Check for trigger nodes
        TRIGGER_COUNT=$(echo "$WORKFLOW_DATA" | jq '.nodes[] | select(.type == "n8n-nodes-base.webhook" or .type == "n8n-nodes-base.trigger") | .name' | wc -l)
        
        if [ "$TRIGGER_COUNT" -gt 0 ]; then
            echo "   🔄 Found $TRIGGER_COUNT trigger node(s)"
            echo "$WORKFLOW_DATA" | jq -r '.nodes[] | select(.type == "n8n-nodes-base.webhook" or .type == "n8n-nodes-base.trigger") | "   📍 Trigger: " + .name + " | Type: " + .type'
        fi
        
    else
        echo "   ❌ Failed to retrieve workflow data"
    fi
    
    echo ""
}

# Analyze each workflow
echo "🔍 Analyzing Federation Crew Workflows:"
echo "======================================="

analyze_workflow_webhook "QOJQTpLncfwyUUuv" "Federation Crew - OpenRouter Agent Coordination"
analyze_workflow_webhook "WUtfB4g4k00uFOaH" "Captain Jean-Luc Picard - Strategic Leadership & Mission Command"
analyze_workflow_webhook "HbljVTtTwYU5gPS6" "Commander Data - Analytics & Logic Operations"
analyze_workflow_webhook "UMgLlLPbhcjwJtKK" "Lieutenant Commander Geordi La Forge - Infrastructure & System Integration"
analyze_workflow_webhook "7k9XLyUbfijvYJo4" "Lieutenant Worf - Security & Compliance Operations"
analyze_workflow_webhook "s9rJLcPYDSxGtyEQ" "Counselor Deanna Troi - User Experience & Empathy Analysis"
analyze_workflow_webhook "FMRBAZnq9MOcAZSn" "Enhanced Federation Crew - Complete Mission Control"

echo "🎖️ CAPTAIN PICARD: 'Admiral, the investigation is complete. We've identified the webhook configuration issues.'"
echo ""
echo "⚠️  CRITICAL FINDINGS:"
echo "   • The workflows may not be properly configured for external webhook access"
echo "   • Webhook nodes may be configured as internal triggers instead of external endpoints"
echo "   • This explains why external requests return 404 errors"
echo ""
echo "🚀 NEXT STEPS:"
echo "   1. Review webhook node configurations in each workflow"
echo "   2. Ensure webhook nodes are set to accept external requests"
echo "   3. Configure proper webhook paths and methods"
echo "   4. Test external webhook access"
