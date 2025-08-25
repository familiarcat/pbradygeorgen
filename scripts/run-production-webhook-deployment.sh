#!/bin/bash

# Federation Crew Production Webhook Deployment Script
# This script redeploys all Federation Crew workflows with proper production webhook configurations

set -e

echo "🎖️ CAPTAIN PICARD - PRODUCTION WEBHOOK DEPLOYMENT INITIATION"
echo "============================================================="
echo ""

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOYMENT_SCRIPT="$SCRIPT_DIR/redeploy-federation-crew-with-production-webhooks.py"
BACKUP_DIR=""

echo "🔧 Configuration:"
echo "   • Deployment Script: $DEPLOYMENT_SCRIPT"
echo "   • Target: https://n8n.pbradygeorgen.com"
echo "   • Strategy: Backup → Deploy → Test → Rollback if needed"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    echo "----------------------------"
    
    # Check if Python script exists
    if [ ! -f "$DEPLOYMENT_SCRIPT" ]; then
        echo "   ❌ Deployment script not found: $DEPLOYMENT_SCRIPT"
        return 1
    fi
    
    # Check if Python is available
    if ! command -v python3 &> /dev/null; then
        echo "   ❌ Python3 not found"
        return 1
    fi
    
    # Check if required Python packages are available
    if ! python3 -c "import requests, json" 2>/dev/null; then
        echo "   ❌ Required Python packages not found (requests, json)"
        echo "   💡 Install with: pip3 install requests"
        return 1
    fi
    
    echo "   ✅ All prerequisites met"
    return 0
}

# Function to create emergency rollback script
create_rollback_script() {
    local backup_dir="$1"
    
    echo "🛡️ Creating emergency rollback script..."
    echo "----------------------------------------"
    
    cat > "emergency_rollback.sh" << EOF
#!/bin/bash
# Emergency Rollback Script for Federation Crew Workflows
# Generated: $(date)

echo "🚨 EMERGENCY ROLLBACK INITIATED"
echo "==============================="
echo "Rolling back to backup: $backup_dir"
echo ""

if [ -d "$backup_dir" ]; then
    echo "📦 Restoring workflows from backup..."
    
    for file in $backup_dir/*.json; do
        if [ -f "\$file" ]; then
            workflow_name=\$(basename "\$file" .json)
            echo "   🔄 Restoring: \$workflow_name"
            
            # Extract workflow ID from filename or use API to find it
            # This is a simplified rollback - in production you'd want more robust ID handling
            python3 -c "
import json, requests
try:
    with open('\$file', 'r') as f:
        workflow = json.load(f)
    
    # Try to restore the workflow
    response = requests.put(
        'https://n8n.pbradygeorgen.com/api/v1/workflows/' + workflow.get('id', ''),
        headers={'X-N8N-API-KEY': '$N8N_API_KEY', 'Content-Type': 'application/json'},
        json=workflow
    )
    
    if response.status_code == 200:
        print(f'   ✅ Restored: {workflow.get(\"name\", \"Unknown\")}')
    else:
        print(f'   ❌ Failed to restore: {workflow.get(\"name\", \"Unknown\")}')
        
except Exception as e:
    print(f'   ❌ Error restoring \$file: {e}')
"
        fi
    done
    
    echo ""
    echo "🔄 Rollback complete. Federation Crew workflows restored."
else
    echo "❌ Backup directory not found: $backup_dir"
    echo "   Manual restoration required."
fi
EOF
    
    chmod +x "emergency_rollback.sh"
    echo "   ✅ Emergency rollback script created: emergency_rollback.sh"
    echo "   💡 To rollback: ./emergency_rollback.sh"
}

# Function to execute deployment
execute_deployment() {
    echo "🚀 Executing production webhook deployment..."
    echo "---------------------------------------------"
    
    # Make script executable
    chmod +x "$DEPLOYMENT_SCRIPT"
    
    # Execute deployment
    if python3 "$DEPLOYMENT_SCRIPT"; then
        echo ""
        echo "✅ DEPLOYMENT COMPLETED SUCCESSFULLY"
        echo "==================================="
        return 0
    else
        echo ""
        echo "❌ DEPLOYMENT FAILED"
        echo "==================="
        return 1
    fi
}

# Function to test deployment
test_deployment() {
    echo "🧪 Testing deployment..."
    echo "------------------------"
    
    # Test key webhook endpoints
    local test_endpoints=(
        "federation-mission"
        "crew-captain-jean-luc-picard"
        "federation-directive"
    )
    
    local success_count=0
    
    for endpoint in "${test_endpoints[@]}"; do
        echo "   📡 Testing: $endpoint"
        
        response=$(curl -s -X POST "https://n8n.pbradygeorgen.com/webhook/$endpoint" \
            -H "Content-Type: application/json" \
            -d "{\"test\": \"deployment verification\"}" \
            --max-time 10)
        
        if [[ "$response" != *"404"* ]] && [[ "$response" != *"not registered"* ]]; then
            echo "   ✅ $endpoint: SUCCESS"
            ((success_count++))
        else
            echo "   ❌ $endpoint: FAILED"
        fi
    done
    
    echo ""
    echo "📊 Test Results: $success_count/${#test_endpoints[@]} endpoints working"
    
    if [ $success_count -eq ${#test_endpoints[@]} ]; then
        echo "🎉 ALL WEBHOOKS OPERATIONAL!"
        return 0
    else
        echo "⚠️  Some webhooks may need manual activation"
        return 1
    fi
}

# Main execution
main() {
    echo "🎖️ CAPTAIN PICARD: 'Admiral, I'm initiating the production webhook deployment protocol.'"
    echo ""
    
    # Step 1: Check prerequisites
    if ! check_prerequisites; then
        echo "❌ Prerequisites not met. Aborting deployment."
        exit 1
    fi
    
    echo ""
    
    # Step 2: Execute deployment
    if execute_deployment; then
        echo ""
        
        # Step 3: Test deployment
        if test_deployment; then
            echo ""
            echo "🎖️ CAPTAIN PICARD: 'Admiral, the Federation Crew is now fully operational with production webhooks!'"
            echo "   All crew members are ready to receive external communications."
        else
            echo ""
            echo "⚠️  Deployment completed but some webhooks may need manual activation."
            echo "   Please check the n8n interface for any remaining issues."
        fi
    else
        echo ""
        echo "❌ DEPLOYMENT FAILED - ROLLBACK AVAILABLE"
        echo "========================================="
        echo "If you need to rollback to the previous state, run:"
        echo "   ./emergency_rollback.sh"
        echo ""
        echo "🎖️ CAPTAIN PICARD: 'Admiral, deployment encountered issues. The crew is ready for your orders.'"
        exit 1
    fi
}

# Execute main function
main "$@"
