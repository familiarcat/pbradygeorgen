#!/bin/bash

# Fully Automated N8N Deployment Runner for AlexAI Optimized Crew
echo "🚀 ALEXAI OPTIMIZED CREW - FULLY AUTOMATED N8N DEPLOYMENT"
echo "========================================================="

# Check if we're in the right directory
if [ ! -d "n8n_workflows" ]; then
    echo "❌ Error: n8n_workflows directory not found"
    echo "Please run this script from the deployment directory"
    exit 1
fi

# Check if Python script exists
if [ ! -f "fully_automated_n8n_deployment.py" ]; then
    echo "❌ Error: fully_automated_n8n_deployment.py not found"
    echo "Please ensure the deployment script is present"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/upgrade required packages
echo "📥 Installing required packages..."
pip install --upgrade pip
pip install requests python-dotenv

# Run the fully automated deployment
echo "🚀 Starting fully automated deployment..."
python3 fully_automated_n8n_deployment.py

# Deactivation message
echo "🔧 Deactivating virtual environment..."
deactivate

echo ""
echo "🏁 Fully automated deployment process completed!"
echo "Check the output above for results."
echo ""
echo "🎯 This deployment used:"
echo "  • Your existing API keys from ~/.zshrc"
echo "  • Your SSH access for secure deployment"
echo "  • Hybrid API + SSH approach for maximum success"
echo "  • Automatic OpenRouter credential setup"
echo "  • Complete workflow deployment and activation"
