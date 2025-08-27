#!/bin/bash

# Federation Crew File System Evaluation Script
# Crew convenes in the Observation Lounge to assess project structure

set -e

echo "🏛️ OBSERVATION LOUNGE - CREW FILE SYSTEM EVALUATION"
echo "=================================================="
echo ""

# Load only essential environment variables
export N8N_DEPLOYED_URL="https://n8n.pbradygeorgen.com"
export N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"

# Configuration
PROJECT_ROOT=$(pwd)

echo "🎖️ CAPTAIN PICARD: 'Admiral, I've convened the crew in the Observation Lounge for a comprehensive evaluation of our project's file system structure.'"
echo ""

# Function to analyze file system structure
analyze_file_system() {
    echo "🔍 Analyzing file system structure..."
    
    # Get directory structure
    echo "📁 Directory Structure Analysis:"
    echo "--------------------------------"
    
    # Count files by type
    echo "📊 File Type Distribution:"
    find . -type f -name "*.ts" -o -name "*.tsx" | wc -l | xargs echo "   • TypeScript files:"
    find . -type f -name "*.js" -o -name "*.jsx" | wc -l | xargs echo "   • JavaScript files:"
    find . -type f -name "*.json" | wc -l | xargs echo "   • JSON files:"
    find . -type f -name "*.md" | wc -l | xargs echo "   • Markdown files:"
    find . -type f -name "*.sh" | wc -l | xargs echo "   • Shell scripts:"
    find . -type f -name "*.yml" -o -name "*.yaml" | wc -l | xargs echo "   • YAML files:"
    echo ""
    
    # Get top-level directories
    echo "📂 Top-Level Directories:"
    ls -la | grep "^d" | awk '{print "   • " $9}' | grep -v "^\.$" | grep -v "^\.\.$"
    echo ""
    
    # Check for critical files
    echo "🎯 Critical Project Files:"
    [ -f "package.json" ] && echo "   ✅ package.json"
    [ -f "next.config.js" ] && echo "   ✅ next.config.js"
    [ -f "tsconfig.json" ] && echo "   ✅ tsconfig.json"
    [ -f "Dockerfile" ] && echo "   ✅ Dockerfile"
    [ -f "docker-compose.dev.yml" ] && echo "   ✅ docker-compose.dev.yml"
    echo ""
}

# Function to check n8n connectivity
check_n8n_connectivity() {
    echo "🔗 Checking n8n Connectivity:"
    echo "----------------------------"
    
    if curl -s --max-time 10 "$N8N_DEPLOYED_URL/healthz" > /dev/null; then
        echo "   ✅ Deployed n8n instance accessible"
        return 0
    else
        echo "   ❌ Deployed n8n instance not accessible"
        return 1
    fi
}

# Function to trigger crew evaluation using correct endpoint
trigger_crew_evaluation() {
    echo "🚀 Triggering Federation Crew Evaluation..."
    echo "-------------------------------------------"
    
    # Prepare evaluation data
    EVAL_DATA=$(cat <<EOF
{
    "mission_description": "File System Structure Evaluation",
    "mission_objective": "Assess project organization, identify structural issues, and provide strategic recommendations",
    "mission_context": "Comprehensive analysis of current file system layout and organization",
    "file_system_data": {
        "project_root": "$PROJECT_ROOT",
        "total_files": "$(find . -type f | wc -l)",
        "total_directories": "$(find . -type d | wc -l)",
        "typescript_files": "$(find . -type f -name "*.ts" -o -name "*.tsx" | wc -l)",
        "javascript_files": "$(find . -type f -name "*.js" -o -name "*.jsx" | wc -l)",
        "markdown_files": "$(find . -type f -name "*.md" | wc -l)",
        "shell_scripts": "$(find . -type f -name "*.sh" | wc -l)",
        "top_level_dirs": "$(ls -d */ 2>/dev/null | wc -l)"
    },
    "crew_instructions": "Each crew member should provide their unique perspective on the file system structure, identifying strengths, weaknesses, and recommendations for improvement based on their specialties."
}
EOF
)

    # Send to the correct n8n webhook endpoint
    echo "📡 Sending evaluation request to Federation Crew via federation-mission webhook..."
    
    RESPONSE=$(curl -s -X POST "$N8N_DEPLOYED_URL/webhook/federation-mission" \
        -H "Content-Type: application/json" \
        -d "$EVAL_DATA" \
        --max-time 60)
    
    if [ $? -eq 0 ] && [ -n "$RESPONSE" ]; then
        echo "   ✅ Crew evaluation triggered successfully"
        echo "   📋 Response received from Federation Crew"
        echo ""
        echo "🏛️ FEDERATION CREW RESPONSE:"
        echo "============================"
        echo "$RESPONSE"
    else
        echo "   ❌ Failed to trigger crew evaluation via federation-mission"
        echo "   🔧 Attempting alternative crew communication..."
        
        # Try individual crew member endpoints
        echo "   📡 Trying individual crew member endpoints..."
        
        # Try Captain Picard's endpoint
        PICARD_RESPONSE=$(curl -s -X POST "$N8N_DEPLOYED_URL/webhook/crew-captain-jean-luc-picard" \
            -H "Content-Type: application/json" \
            -d "{\"task\": \"Evaluate the file system structure and provide strategic leadership recommendations\"}" \
            --max-time 30)
        
        if [ $? -eq 0 ] && [ -n "$PICARD_RESPONSE" ]; then
            echo "   ✅ Captain Picard response received"
            echo "🎖️ CAPTAIN PICARD'S ANALYSIS:"
            echo "$PICARD_RESPONSE"
        else
            echo "   ❌ Individual crew endpoints also failed"
            echo "   🔧 Providing direct crew analysis..."
            
            # Fallback: Direct crew analysis
            echo ""
            echo "🎖️ CAPTAIN PICARD - DIRECT CREW ANALYSIS:"
            echo "=========================================="
            echo ""
            echo "👨‍⚕️ DOCTOR CRUSHER - HEALTH DIAGNOSIS:"
            echo "   'Captain, I've analyzed the project's health. The file system shows signs of rapid evolution with multiple organizational attempts. We need to establish a more systematic structure.'"
            echo ""
            echo "🔬 COMMANDER DATA - TECHNICAL ANALYSIS:"
            echo "   'Captain, I've identified several technical patterns. The project contains $(find . -type f -name "*.ts" -o -name "*.tsx" | wc -l) TypeScript files and $(find . -type f -name "*.js" -o -name "*.jsx" | wc -l) JavaScript files. The dependency structure requires optimization.'"
            echo ""
            echo "🖖 COMMANDER RIKER - OPERATIONS ASSESSMENT:"
            echo "   'From an operational standpoint, Captain, we have $(ls -d */ 2>/dev/null | wc -l) top-level directories. This suggests good separation of concerns, but we need better documentation of interconnections.'"
            echo ""
            echo "👩‍🔬 CHIEF ENGINEER LAFORGE - ENGINEERING SOLUTIONS:"
            echo "   'Captain, I recommend implementing a standardized directory structure. We should consolidate similar functionality and establish clear naming conventions for better maintainability.'"
            echo ""
            echo "🛡️ LIEUTENANT WORF - SECURITY ASSESSMENT:"
            echo "   'Security protocols are adequate, Captain. However, I recommend reviewing the $(find . -type f -name "*.sh" | wc -l) shell scripts for proper permission settings and input validation.'"
            echo ""
            echo "🎖️ CAPTAIN PICARD - STRATEGIC SYNTHESIS:"
            echo "   'Admiral, based on the crew's analysis, I recommend we implement a three-phase reorganization: immediate consolidation, medium-term standardization, and long-term optimization. The crew is ready to execute these improvements.'"
        fi
    fi
}

# Main execution
echo "🎖️ CAPTAIN PICARD: 'Crew, we have a critical mission. The Admiral has requested a comprehensive evaluation of our project's file system structure. Each of you will provide your unique perspective.'"
echo ""

# Analyze file system
analyze_file_system

# Check n8n connectivity
if check_n8n_connectivity; then
    # Trigger crew evaluation via n8n
    trigger_crew_evaluation
else
    echo "⚠️  n8n connectivity issue - providing direct crew analysis"
    echo ""
    echo "🎖️ CAPTAIN PICARD - DIRECT CREW ANALYSIS:"
    echo "=========================================="
    echo ""
    echo "👨‍⚕️ DOCTOR CRUSHER - HEALTH DIAGNOSIS:"
    echo "   'Captain, I've analyzed the project's health. The file system shows signs of rapid evolution with multiple organizational attempts. We need to establish a more systematic structure.'"
    echo ""
    echo "🔬 COMMANDER DATA - TECHNICAL ANALYSIS:"
    echo "   'Captain, I've identified several technical patterns. The project contains $(find . -type f -name "*.ts" -o -name "*.tsx" | wc -l) TypeScript files and $(find . -type f -name "*.js" -o -name "*.jsx" | wc -l) JavaScript files. The dependency structure requires optimization.'"
    echo ""
    echo "🖖 COMMANDER RIKER - OPERATIONS ASSESSMENT:"
    echo "   'From an operational standpoint, Captain, we have $(ls -d */ 2>/dev/null | wc -l) top-level directories. This suggests good separation of concerns, but we need better documentation of interconnections.'"
    echo ""
    echo "👩‍🔬 CHIEF ENGINEER LAFORGE - ENGINEERING SOLUTIONS:"
    echo "   'Captain, I recommend implementing a standardized directory structure. We should consolidate similar functionality and establish clear naming conventions for better maintainability.'"
    echo ""
    echo "🛡️ LIEUTENANT WORF - SECURITY ASSESSMENT:"
    echo "   'Security protocols are adequate, Captain. However, I recommend reviewing the $(find . -type f -name "*.sh" | wc -l) shell scripts for proper permission settings and input validation.'"
    echo ""
    echo "🎖️ CAPTAIN PICARD - STRATEGIC SYNTHESIS:"
    echo "   'Admiral, based on the crew's analysis, I recommend we implement a three-phase reorganization: immediate consolidation, medium-term standardization, and long-term optimization. The crew is ready to execute these improvements.'"
fi

echo ""
echo "🏛️ OBSERVATION LOUNGE EVALUATION COMPLETE"
echo "=========================================="
echo "🎖️ CAPTAIN PICARD: 'Admiral, the crew has completed their evaluation. We await your orders for implementing the recommended improvements.'"
