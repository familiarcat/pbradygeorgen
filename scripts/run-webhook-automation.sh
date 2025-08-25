#!/bin/bash

# Automated Webhook Activation Script
# This script runs the Selenium automation to activate Federation Crew webhooks

set -e

echo "🎖️ CAPTAIN PICARD - AUTOMATED WEBHOOK ACTIVATION"
echo "================================================"
echo ""

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTOMATION_SCRIPT="$SCRIPT_DIR/automate-webhook-activation.py"

echo "🔧 Configuration:"
echo "   • Automation Script: $AUTOMATION_SCRIPT"
echo "   • Target: https://n8n.pbradygeorgen.com"
echo "   • Method: Selenium Browser Automation"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo "🔍 Checking prerequisites..."
    echo "----------------------------"
    
    # Check if Python script exists
    if [ ! -f "$AUTOMATION_SCRIPT" ]; then
        echo "   ❌ Automation script not found: $AUTOMATION_SCRIPT"
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
    
    # Check if Chrome is available
    if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
        echo "   ❌ Chrome/Chromium not found"
        echo "   💡 Install Chrome or Chromium browser"
        return 1
    fi
    
    # Check if ChromeDriver is available
    if ! command -v chromedriver &> /dev/null; then
        echo "   ⚠️  ChromeDriver not found"
        echo "   💡 Install ChromeDriver or it will be downloaded automatically"
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
    
    # Install webdriver-manager for automatic ChromeDriver management
    if ! python3 -c "import webdriver_manager" 2>/dev/null; then
        echo "   📥 Installing webdriver-manager..."
        pip3 install webdriver-manager
        echo "   ✅ webdriver-manager installed"
    fi
}

# Function to set up environment variables
setup_environment() {
    echo "🔧 Setting up environment..."
    echo "----------------------------"
    
    # Check if n8n credentials are available
    if [ -z "$N8N_USERNAME" ] || [ -z "$N8N_PASSWORD" ]; then
        echo "   ⚠️  N8N_USERNAME and N8N_PASSWORD not set"
        echo "   💡 Set them if n8n requires authentication:"
        echo "      export N8N_USERNAME='your_username'"
        echo "      export N8N_PASSWORD='your_password'"
        echo "   ℹ️  Proceeding without authentication (if n8n allows)"
    else
        echo "   ✅ n8n credentials configured"
    fi
}

# Function to run automation
run_automation() {
    echo "🚀 Running webhook automation..."
    echo "-------------------------------"
    
    # Make script executable
    chmod +x "$AUTOMATION_SCRIPT"
    
    # Run automation with headless option
    echo "   🎯 Starting browser automation..."
    
    if python3 "$AUTOMATION_SCRIPT" --headless; then
        echo ""
        echo "✅ AUTOMATION COMPLETED SUCCESSFULLY"
        echo "==================================="
        return 0
    else
        echo ""
        echo "❌ AUTOMATION FAILED"
        echo "==================="
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
            -d "{\"test\": \"automation verification\"}" \
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

# Main execution
main() {
    echo "🎖️ CAPTAIN PICARD: 'Admiral, I'm initiating automated webhook activation protocol.'"
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
    
    # Step 2: Setup environment
    setup_environment
    
    echo ""
    
    # Step 3: Run automation
    if run_automation; then
        echo ""
        
        # Step 4: Test webhooks
        if test_webhooks; then
            echo ""
            echo "🎖️ CAPTAIN PICARD: 'Admiral, the Federation Crew webhooks have been successfully activated!'"
            echo "   All crew members are now ready to receive external communications."
        else
            echo ""
            echo "⚠️  Automation completed but some webhooks may need manual verification."
            echo "   Please check the n8n interface for any remaining issues."
        fi
    else
        echo ""
        echo "❌ AUTOMATION FAILED - MANUAL ACTIVATION REQUIRED"
        echo "================================================="
        echo "The automated process encountered issues. Please use the manual guide:"
        echo "   docs/MANUAL_WEBHOOK_ACTIVATION_GUIDE.md"
        echo ""
        echo "🎖️ CAPTAIN PICARD: 'Admiral, automation encountered issues. Manual activation is required.'"
        exit 1
    fi
}

# Execute main function
main "$@"
