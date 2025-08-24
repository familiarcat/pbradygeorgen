#!/bin/bash

# Automated N8N Deployment Runner for AlexAI Optimized Crew
echo "🚀 ALEXAI OPTIMIZED CREW - AUTOMATED N8N DEPLOYMENT"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "n8n_workflows" ]; then
    echo "❌ Error: n8n_workflows directory not found"
    echo "Please run this script from the deployment directory"
    exit 1
fi

# Check if Python script exists
if [ ! -f "automated_n8n_deployment.py" ]; then
    echo "❌ Error: automated_n8n_deployment.py not found"
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

# Run the automated deployment
echo "🚀 Starting automated deployment..."
python3 automated_n8n_deployment.py

# Deactivation message
echo "🔧 Deactivating virtual environment..."
deactivate

echo ""
echo "🏁 Deployment process completed!"
echo "Check the output above for results."
