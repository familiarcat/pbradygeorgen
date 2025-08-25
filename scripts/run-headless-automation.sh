#!/bin/bash

# Headless Webhook Activation Script
# This script runs the headless Chrome automation to activate Federation Crew webhooks

set -e

echo "🎖️ CAPTAIN PICARD - HEADLESS WEBHOOK ACTIVATION"
echo "================================================"
echo ""

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEADLESS_SCRIPT="$SCRIPT_DIR/headless-webhook-activation.py"

echo "🔧 Configuration:"
echo "   • Headless Script: $HEADLESS_SCRIPT"
echo "   • Target: https://n8n.pbradygeorgen.com"
echo "   • Method: Headless Chrome + API Automation"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    echo "----------------------------"
    
    # Check if Python script exists
    if [ ! -f "$HEADLESS_SCRIPT" ]; then
        echo "   ❌ Headless script not found: $HEADLESS_SCRIPT"
        return 1
    fi
    
    # Check if Python is available
    if ! command -v python3 &> /dev/null; then
        echo "   ❌ Python3 not found"
        return 1
    fi
    
    # Check if Selenium is installed
    if ! python3 -c "import selenium" 2>/dev/null; then
        echo "   ❌ Selenium not found"
        echo "   💡 Install with: pip3 install selenium"
        return 1
    fi
    
    # Check if webdriver-manager is installed
    if ! python3 -c "import webdriver_manager" 2>/dev/null; then
        echo "   ❌ webdriver-manager not found"
        echo "   💡 Install with: pip3 install webdriver-manager"
        return 1
    fi
    
    # Check if requests is installed
    if ! python3 -c "import requests" 2>/dev/null; then
        echo "   ❌ requests not found"
        echo "   💡 Install with: pip3 install requests"
        return 1
    fi
    
    echo "   ✅ All prerequisites met"
    return 0
}

# Function to install missing dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    echo "----------------------------"
    
    # Install Selenium if not present
    if ! python3 -c "import selenium" 2>/dev/null; then
        echo "   📥 Installing Selenium..."
        pip3 install selenium
        echo "   ✅ Selenium installed"
    fi
    
    # Install webdriver-manager if not present
    if ! python3 -c "import webdriver_manager" 2>/dev/null; then
        echo "   📥 Installing webdriver-manager..."
        pip3 install webdriver-manager
        echo "   ✅ webdriver-manager installed"
    fi
    
    # Install requests if not present
    if ! python3 -c "import requests" 2>/dev/null; then
        echo "   📥 Installing requests..."
        pip3 install requests
        echo "   ✅ requests installed"
    fi
}

# Function to run headless automation
run_headless_automation() {
    echo "🚀 Running headless webhook automation..."
    echo "----------------------------------------"
    
    # Make script executable
    chmod +x "$HEADLESS_SCRIPT"
    
    # Run headless automation
    echo "   🎯 Starting headless Chrome automation..."
    
    if python3 "$HEADLESS_SCRIPT"; then
        echo ""
        echo "✅ HEADLESS AUTOMATION COMPLETED SUCCESSFULLY"
        echo "============================================="
        return 0
    else
        echo ""
        echo "❌ HEADLESS AUTOMATION FAILED"
        echo "============================"
        return 1
    fi
}

# Function to test webhooks after automation
test_webhooks() {
    echo "🧪 Testing webhook endpoints..."
    echo "------------------------------"
    
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
            -d "{\"test\": \"headless automation verification\"}" \
            --max-time 10)
        
        if [[ "$response" != *"404"* ]] && [[ "$response" != *"not registered"* ]]; then
            echo "   ✅ $endpoint: SUCCESS"
            success_count=$((success_count + 1))
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

# Function to provide manual activation instructions
provide_manual_instructions() {
    echo ""
    echo "📋 MANUAL ACTIVATION INSTRUCTIONS"
    echo "================================="
    echo "Since automated activation may have limitations, here's how to manually activate:"
    echo ""
    echo "1. Open your browser and go to: https://n8n.pbradygeorgen.com"
    echo "2. Navigate to each Federation Crew workflow"
    echo "3. Click on the webhook node (first node on the left)"
    echo "4. In the right panel, click 'Production URL' instead of 'Test URL'"
    echo "5. Save the workflow"
    echo "6. Repeat for all 7 workflows"
    echo ""
    echo "📖 Detailed guide: docs/MANUAL_WEBHOOK_ACTIVATION_GUIDE.md"
    echo ""
}

# Main execution
main() {
    echo "🎖️ CAPTAIN PICARD: 'Admiral, I'm initiating headless webhook activation protocol.'"
    echo ""
    
    # Step 1: Check prerequisites
    if ! check_prerequisites; then
        echo "❌ Prerequisites not met. Attempting to install dependencies..."
        install_dependencies
        
        # Check again after installation
        if ! check_prerequisites; then
            echo "❌ Prerequisites still not met. Aborting automation."
            exit 1
        fi
    fi
    
    echo ""
    
    # Step 2: Run headless automation
    if run_headless_automation; then
        echo ""
        
        # Step 3: Test webhooks
        if test_webhooks; then
            echo ""
            echo "🎖️ CAPTAIN PICARD: 'Admiral, the Federation Crew webhooks have been successfully activated!'"
            echo "   All crew members are now ready to receive external communications."
        else
            echo ""
            echo "⚠️  Headless automation completed but some webhooks may need manual verification."
            provide_manual_instructions
        fi
    else
        echo ""
        echo "❌ HEADLESS AUTOMATION FAILED - MANUAL ACTIVATION REQUIRED"
        echo "========================================================="
        echo "The headless automation encountered issues. Manual activation is required."
        provide_manual_instructions
        echo "🎖️ CAPTAIN PICARD: 'Admiral, headless automation encountered issues. Manual activation is required.'"
        exit 1
    fi
}

# Execute main function
main "$@"
