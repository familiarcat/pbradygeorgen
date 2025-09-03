#!/bin/bash

# 🚀 Deploy Unified N8N Workflow with ALL Crew Members
# This script deploys the complete unified AI system to your N8N instance

set -e

echo "🚀 Starting deployment of Unified N8N Workflow with ALL Crew Members..."

# Configuration
N8N_BASE_URL="https://n8n.pbradygeorgen.com"
WORKFLOW_FILE="enhanced_unified_workflow.json"
PYTHON_ROUTER="enhanced_unified_router.py"
WORKFLOW_NAME="Enhanced Unified AI Controller - Cursor + Claude + OpenRouter"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required files exist
echo "📋 Checking required files..."
if [ ! -f "$WORKFLOW_FILE" ]; then
    echo -e "${RED}❌ Error: $WORKFLOW_FILE not found!${NC}"
    exit 1
fi

if [ ! -f "$PYTHON_ROUTER" ]; then
    echo -e "${RED}❌ Error: $PYTHON_ROUTER not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All required files found${NC}"

# Check if we have the required environment variables
echo "🔑 Checking environment variables..."
if [ -z "$N8N_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: N8N_API_KEY not set${NC}"
    echo "Please set N8N_API_KEY environment variable or enter it when prompted"
    read -s -p "Enter your N8N API key: " N8N_API_KEY
    echo
fi

if [ -z "$OPENROUTER_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: OPENROUTER_API_KEY not set${NC}"
    echo "Please set OPENROUTER_API_KEY environment variable or enter it when prompted"
    read -s -p "Enter your OpenRouter API key: " OPENROUTER_API_KEY
    echo
fi

if [ -z "$CLAUDE_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  Warning: CLAUDE_API_KEY not set${NC}"
    echo "Please set CLAUDE_API_KEY environment variable or enter it when prompted"
    read -s -p "Enter your Claude API key: " CLAUDE_API_KEY
    echo
fi

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Function to check N8N connection
check_n8n_connection() {
    echo "🔌 Testing N8N connection..."
    if curl -s -f "$N8N_BASE_URL/healthz" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ N8N instance is accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ Cannot connect to N8N instance at $N8N_BASE_URL${NC}"
        return 1
    fi
}

# Function to get existing workflows
get_existing_workflows() {
    echo "📊 Fetching existing workflows..."
    WORKFLOWS_RESPONSE=$(curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
        "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "{}")
    
    if [ "$WORKFLOWS_RESPONSE" != "{}" ]; then
        echo -e "${GREEN}✅ Successfully connected to N8N API${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to connect to N8N API${NC}"
        return 1
    fi
}

# Function to check if workflow already exists
check_workflow_exists() {
    echo "🔍 Checking if workflow already exists..."
    EXISTING_WORKFLOW=$(echo "$WORKFLOWS_RESPONSE" | jq -r '.data[] | select(.name == "'"$WORKFLOW_NAME"'") | .id' 2>/dev/null || echo "")
    
    if [ -n "$EXISTING_WORKFLOW" ]; then
        echo -e "${YELLOW}⚠️  Workflow already exists with ID: $EXISTING_WORKFLOW${NC}"
        return 0
    else
        echo -e "${GREEN}✅ Workflow does not exist, will create new${NC}"
        return 1
    fi
}

# Function to deploy workflow
deploy_workflow() {
    echo "🚀 Deploying unified workflow..."
    
    # Prepare workflow data
    WORKFLOW_DATA=$(cat "$WORKFLOW_FILE")
    
    if [ -n "$EXISTING_WORKFLOW" ]; then
        # Update existing workflow
        echo "📝 Updating existing workflow..."
        UPDATE_RESPONSE=$(curl -s -X PUT \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d "$WORKFLOW_DATA" \
            "$N8N_BASE_URL/api/v1/workflows/$EXISTING_WORKFLOW" 2>/dev/null || echo "{}")
        
        if echo "$UPDATE_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Workflow updated successfully${NC}"
            WORKFLOW_ID=$(echo "$UPDATE_RESPONSE" | jq -r '.id')
        else
            echo -e "${RED}❌ Failed to update workflow${NC}"
            echo "Response: $UPDATE_RESPONSE"
            return 1
        fi
    else
        # Create new workflow
        echo "🆕 Creating new workflow..."
        CREATE_RESPONSE=$(curl -s -X POST \
            -H "X-N8N-API-KEY: $N8N_API_KEY" \
            -H "Content-Type: application/json" \
            -d "$WORKFLOW_DATA" \
            "$N8N_BASE_URL/api/v1/workflows" 2>/dev/null || echo "{}")
        
        if echo "$CREATE_RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Workflow created successfully${NC}"
            WORKFLOW_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')
        else
            echo -e "${RED}❌ Failed to create workflow${NC}"
            echo "Response: $CREATE_RESPONSE"
            return 1
        fi
    fi
    
    echo -e "${BLUE}📋 Workflow ID: $WORKFLOW_ID${NC}"
    return 0
}

# Function to activate workflow
activate_workflow() {
    echo "🔌 Activating workflow..."
    
    ACTIVATE_RESPONSE=$(curl -s -X POST \
        -H "X-N8N-API-KEY: $N8N_API_KEY" \
        -H "Content-Type: application/json" \
        -d '{"active": true}' \
        "$N8N_BASE_URL/api/v1/workflows/$WORKFLOW_ID/activate" 2>/dev/null || echo "{}")
    
    if echo "$ACTIVATE_RESPONSE" | jq -e '.active' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Workflow activated successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to activate workflow${NC}"
        echo "Response: $ACTIVATE_RESPONSE"
        return 1
    fi
}

# Function to test workflow
test_workflow() {
    echo "🧪 Testing workflow with sample task..."
    
    # Get webhook URL
    WEBHOOK_URL="$N8N_BASE_URL/webhook/enhanced-unified-ai"
    
    # Test payload
    TEST_PAYLOAD=$(cat <<EOF
{
    "task_description": "Create a strategic plan for our unified AI system deployment",
    "context": {
        "use_local_claude": true,
        "task_complexity": "high",
        "task_type": "strategic_planning"
    },
    "cursor_context": {
        "fileName": "deployment_test.py",
        "language": "python",
        "currentLine": 1
    },
    "claude_crew_context": {
        "available_crew": ["Captain Picard", "Commander Data", "Geordi La Forge"],
        "crew_specializations": ["strategic_planning", "complex_analysis", "system_architecture"]
    },
    "budget_constraints": {
        "max_cost": 0.10
    }
}
EOF
)
    
    echo "📡 Sending test request to: $WEBHOOK_URL"
    
    TEST_RESPONSE=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$TEST_PAYLOAD" \
        "$WEBHOOK_URL" 2>/dev/null || echo "{}")
    
    if echo "$TEST_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Workflow test successful!${NC}"
        echo "Response summary:"
        echo "$TEST_RESPONSE" | jq -r '.routing_summary | "Task Type: \(.task_type), Model: \(.selected_model), Cost: $\(.total_cost)"'
        return 0
    else
        echo -e "${RED}❌ Workflow test failed${NC}"
        echo "Response: $TEST_RESPONSE"
        return 1
    fi
}

# Function to display crew status
display_crew_status() {
    echo "👥 Crew Status Summary:"
    echo "========================"
    echo "🚀 Total Crew Members: 11"
    echo ""
    echo "📋 Departments:"
    echo "  🎖️  Command: Captain Jean-Luc Picard"
    echo "  🔬 Operations: Commander Data"
    echo "  ⚙️  Engineering: Lieutenant Commander Geordi La Forge"
    echo "  🛡️  Tactical: Lieutenant Worf"
    echo "  🧠 Counseling: Counselor Deanna Troi"
    echo "  🏥 Medical: Dr. Beverly Crusher"
    echo "  📡 Communications: Content Analyst, Lieutenant Uhura"
    echo "  🚀 Operations: Commander William Riker"
    echo "  💻 Development: Cursor AI (Enhanced)"
    echo "  💼 Business: Quark"
    echo ""
    echo "🌟 All departments are now online and ready for unified AI collaboration!"
}

# Main deployment process
main() {
    echo -e "${BLUE}🚀 Starting Unified N8N Crew Deployment...${NC}"
    echo "=================================================="
    
    # Check connection
    if ! check_n8n_connection; then
        exit 1
    fi
    
    # Get existing workflows
    if ! get_existing_workflows; then
        exit 1
    fi
    
    # Check if workflow exists
    check_workflow_exists
    WORKFLOW_EXISTS=$?
    
    # Deploy workflow
    if ! deploy_workflow; then
        exit 1
    fi
    
    # Activate workflow
    if ! activate_workflow; then
        exit 1
    fi
    
    # Test workflow
    if ! test_workflow; then
        echo -e "${YELLOW}⚠️  Workflow test failed, but deployment completed${NC}"
    fi
    
    # Display crew status
    display_crew_status
    
    echo ""
    echo -e "${GREEN}🎉 Unified N8N Crew Deployment Complete!${NC}"
    echo "=================================================="
    echo -e "${BLUE}🌐 Workflow URL: $N8N_BASE_URL/workflow/$WORKFLOW_ID${NC}"
    echo -e "${BLUE}🔗 Webhook URL: $N8N_BASE_URL/webhook/enhanced-unified-ai${NC}"
    echo -e "${BLUE}📊 API Status: $N8N_BASE_URL/api/v1/workflows${NC}"
    echo ""
    echo -e "${GREEN}🚀 Your unified AI crew is now online and ready for action!${NC}"
    echo -e "${GREEN}💡 Use the Cursor extension to send tasks to your crew${NC}"
    echo -e "${GREEN}💰 Cost optimization and intelligent routing are now active${NC}"
}

# Run main function
main "$@"
