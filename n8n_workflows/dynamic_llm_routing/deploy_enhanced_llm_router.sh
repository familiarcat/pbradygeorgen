#!/bin/bash

# 🚀 Enhanced Multi-Provider LLM Router Deployment Script
# Deploys the cost-optimized LLM routing system using all available API keys

set -e

echo "🚀 Starting Enhanced Multi-Provider LLM Router deployment..."

# Configuration
N8N_BASE_URL="https://n8n.pbradygeorgen.com"
WORKFLOW_FILE="enhanced_multi_provider_workflow.json"

# Check if required files exist
echo "📋 Checking required files..."
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo "❌ Error: $WORKFLOW_FILE not found!"
    exit 1
fi

if [ ! -f "enhanced_llm_router.py" ]; then
    echo "❌ Error: enhanced_llm_router.py not found!"
    exit 1
fi

echo "✅ All required files found"

# Check environment variables
echo "🔑 Checking environment variables..."
if [ -z "$N8N_API_KEY" ]; then
    echo "❌ Error: N8N_API_KEY not set"
    exit 1
fi

# Check for available API keys
echo "🔑 Checking available API keys..."
AVAILABLE_KEYS=0

if [ ! -z "$ANTHROPIC_API_KEY" ] || [ ! -z "$CLAUDE_API_KEY" ]; then
    echo "✅ Anthropic/Claude API key available"
    AVAILABLE_KEYS=$((AVAILABLE_KEYS + 1))
fi

if [ ! -z "$OPENAI_API_KEY" ]; then
    echo "✅ OpenAI API key available"
    AVAILABLE_KEYS=$((AVAILABLE_KEYS + 1))
fi

if [ ! -z "$GEMINI_API_KEY" ]; then
    echo "✅ Google Gemini API key available"
    AVAILABLE_KEYS=$((AVAILABLE_KEYS + 1))
fi

if [ ! -z "$OPENROUTER_API_KEY" ]; then
    echo "✅ OpenRouter API key available"
    AVAILABLE_KEYS=$((AVAILABLE_KEYS + 1))
fi

if [ ! -z "$CONTINUE_API_KEY" ]; then
    echo "✅ Continue API key available"
    AVAILABLE_KEYS=$((AVAILABLE_KEYS + 1))
fi

if [ ! -z "$BITO_API_KEY" ]; then
    echo "✅ Bito API key available"
    AVAILABLE_KEYS=$((AVAILABLE_KEYS + 1))
fi

echo "🔑 Total available API keys: $AVAILABLE_KEYS"

if [ $AVAILABLE_KEYS -eq 0 ]; then
    echo "⚠️  Warning: No API keys found. The system will work but with limited functionality."
fi

echo "✅ Environment variables configured"

# Deploy Enhanced LLM Router workflow
echo "🚀 Deploying Enhanced Multi-Provider LLM Router workflow..."

# Read workflow data
WORKFLOW_DATA=$(cat "$WORKFLOW_FILE")

# Create new workflow
echo "🆕 Creating Enhanced LLM Router workflow..."
CREATE_RESPONSE=$(curl -s -X POST \
    -H "X-N8N-API-KEY: $N8N_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$WORKFLOW_DATA" \
    "$N8N_BASE_URL/api/v1/workflows")

echo "📡 API Response received"

# Check if creation was successful
if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
    echo "✅ Enhanced LLM Router workflow created successfully!"
    
    # Extract workflow ID
    WORKFLOW_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "📋 Workflow ID: $WORKFLOW_ID"
    
    # Activate workflow
    echo "🔌 Activating Enhanced LLM Router workflow..."
    ACTIVATE_RESPONSE=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"active": true}' \
        "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID/activate")
    
    if echo "$ACTIVATE_RESPONSE" | grep -q '"active"'; then
        echo "✅ Enhanced LLM Router workflow activated successfully!"
    else
        echo "⚠️  Workflow activation may have failed"
    fi
    
    echo ""
    echo "🎉 Enhanced Multi-Provider LLM Router Deployment Complete!"
    echo "=================================================="
    echo "🌐 Workflow URL: $N8N_BASE_URL/workflow/$WORKFLOW_ID"
    echo "🔗 Webhook URL: $N8N_BASE_URL/webhook/enhanced-llm-router"
    echo ""
    echo "🚀 Your enhanced LLM router is now online!"
    echo "💰 Cost optimization enabled with $AVAILABLE_KEYS API keys"
    echo "🤖 Multi-provider routing: Anthropic, OpenAI, Gemini, OpenRouter"
    echo "📊 Intelligent model selection based on task and budget"
    echo "🔄 Automatic fallback routing for reliability"
    
    # Test the Enhanced LLM Router
    echo ""
    echo "🧪 Testing Enhanced LLM Router functionality..."
    
    # Test 1: Cost-optimized routing
    echo "📋 Test 1: Cost-optimized routing..."
    COST_TEST_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{
            "task_description": "Write a simple Python function to calculate fibonacci numbers",
            "context": {
                "task_type": "coding",
                "complexity": "simple"
            },
            "budget_constraints": {
                "max_cost": 0.01,
                "priority": "cost"
            },
            "routing_preferences": {
                "preferred_providers": ["gemini", "openai"],
                "min_reliability": "medium"
            }
        }' \
        "$N8N_BASE_URL/webhook/enhanced-llm-router")
    
    if echo "$COST_TEST_RESPONSE" | grep -q '"success"'; then
        echo "✅ Cost-optimized routing test successful!"
        
        # Extract and display cost optimization results
        SELECTED_MODEL=$(echo "$COST_TEST_RESPONSE" | grep -o '"selected_model":"[^"]*"' | cut -d'"' -f4)
        PROVIDER=$(echo "$COST_TEST_RESPONSE" | grep -o '"provider":"[^"]*"' | cut -d'"' -f4)
        ESTIMATED_COST=$(echo "$COST_TEST_RESPONSE" | grep -o '"estimated_cost":[^,]*' | cut -d':' -f2)
        
        echo "   Selected Model: $SELECTED_MODEL"
        echo "   Provider: $PROVIDER"
        echo "   Estimated Cost: $${ESTIMATED_COST}"
    else
        echo "⚠️  Cost-optimized routing test may have issues"
        echo "Response: $COST_TEST_RESPONSE"
    fi
    
    # Test 2: Quality-optimized routing
    echo ""
    echo "📋 Test 2: Quality-optimized routing..."
    QUALITY_TEST_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{
            "task_description": "Analyze the ethical implications of artificial intelligence in healthcare",
            "context": {
                "task_type": "analysis",
                "complexity": "complex"
            },
            "budget_constraints": {
                "max_cost": 0.05,
                "priority": "quality"
            },
            "routing_preferences": {
                "preferred_providers": ["anthropic", "openai"],
                "min_reliability": "high"
            }
        }' \
        "$N8N_BASE_URL/webhook/enhanced-llm-router")
    
    if echo "$QUALITY_TEST_RESPONSE" | grep -q '"success"'; then
        echo "✅ Quality-optimized routing test successful!"
        
        # Extract and display quality optimization results
        SELECTED_MODEL=$(echo "$QUALITY_TEST_RESPONSE" | grep -o '"selected_model":"[^"]*"' | cut -d'"' -f4)
        PROVIDER=$(echo "$QUALITY_TEST_RESPONSE" | grep -o '"provider":"[^"]*"' | cut -d'"' -f4)
        RELIABILITY=$(echo "$QUALITY_TEST_RESPONSE" | grep -o '"reliability":"[^"]*"' | cut -d'"' -f4)
        
        echo "   Selected Model: $SELECTED_MODEL"
        echo "   Provider: $PROVIDER"
        echo "   Reliability: $RELIABILITY"
    else
        echo "⚠️  Quality-optimized routing test may have issues"
        echo "Response: $QUALITY_TEST_RESPONSE"
    fi
    
    # Test 3: Speed-optimized routing
    echo ""
    echo "📋 Test 3: Speed-optimized routing..."
    SPEED_TEST_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{
            "task_description": "Quick summary of machine learning basics",
            "context": {
                "task_type": "quick",
                "complexity": "low"
            },
            "budget_constraints": {
                "max_cost": 0.02,
                "priority": "speed"
            },
            "routing_preferences": {
                "preferred_providers": ["gemini", "openai"],
                "max_response_time": 10000
            }
        }' \
        "$N8N_BASE_URL/webhook/enhanced-llm-router")
    
    if echo "$SPEED_TEST_RESPONSE" | grep -q '"success"'; then
        echo "✅ Speed-optimized routing test successful!"
        
        # Extract and display speed optimization results
        SELECTED_MODEL=$(echo "$SPEED_TEST_RESPONSE" | grep -o '"selected_model":"[^"]*"' | cut -d'"' -f4)
        PROVIDER=$(echo "$SPEED_TEST_RESPONSE" | grep -o '"provider":"[^"]*"' | cut -d'"' -f4)
        SPEED=$(echo "$SPEED_TEST_RESPONSE" | grep -o '"speed":"[^"]*"' | cut -d'"' -f4)
        
        echo "   Selected Model: $SELECTED_MODEL"
        echo "   Provider: $PROVIDER"
        echo "   Speed: $SPEED"
    else
        echo "⚠️  Speed-optimized routing test may have issues"
        echo "Response: $SPEED_TEST_RESPONSE"
    fi
    
else
    echo "❌ Failed to create Enhanced LLM Router workflow"
    echo "Response: $CREATE_RESPONSE"
    exit 1
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Test different routing strategies (cost, speed, quality, balanced)"
echo "2. Monitor cost optimization and savings"
echo "3. Verify provider selection and fallback routing"
echo "4. Check performance metrics and reliability scores"
echo ""
echo "🚀 The Enhanced Multi-Provider LLM Router is ready for optimal AI routing!"
echo "💰 Cost optimization enabled with $AVAILABLE_KEYS API keys"
echo "🤖 Intelligent model selection based on task requirements and budget constraints"
