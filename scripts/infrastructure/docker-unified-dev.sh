#!/bin/bash

# Unified Docker Development Script
# This script handles both local Next.js development and deployed n8n integration

set -e

echo "🎖️ CAPTAIN PICARD - UNIFIED DOCKER DEVELOPMENT INITIATION" 
echo "=================================================="

# Load environment variables
source ~/.zshrc

# Configuration
N8N_DEPLOYED_URL="https://n8n.pbradygeorgen.com"
LOCAL_PORT=3000
N8N_PORT=5678

echo "🔧 Configuration:"
echo "   • Deployed n8n: $N8N_DEPLOYED_URL"
echo "   • Local Next.js: http://localhost:$LOCAL_PORT"
echo "   • Environment: $NODE_ENV"

# Check if n8n deployed instance is accessible
echo "🔍 Checking deployed n8n instance..."
if curl -s --max-time 10 "$N8N_DEPLOYED_URL/healthz" > /dev/null; then
    echo "✅ Deployed n8n instance is accessible"
    USE_DEPLOYED_N8N=true
else
    echo "⚠️  Deployed n8n instance not accessible, checking local..."
    if curl -s --max-time 5 "http://localhost:$N8N_PORT/healthz" > /dev/null; then
        echo "✅ Local n8n instance is accessible"
        USE_DEPLOYED_N8N=false
        N8N_DEPLOYED_URL="http://localhost:$N8N_PORT"
    else
        echo "❌ No n8n instance accessible"
        echo "   Starting local n8n container..."
        docker run -d --name n8n-local -p $N8N_PORT:5678 n8nio/n8n:latest
        sleep 10
        USE_DEPLOYED_N8N=false
        N8N_DEPLOYED_URL="http://localhost:$N8N_PORT"
    fi
fi

# Set environment variables
export N8N_BASE_URL="$N8N_DEPLOYED_URL"
export NODE_ENV=development

echo "🚀 Starting unified development environment..."
echo "   • Using n8n: $N8N_BASE_URL"
echo "   • Next.js will be available at: http://localhost:$LOCAL_PORT"

# Start Next.js development server
if [ "$USE_DEPLOYED_N8N" = true ]; then
    echo "🎯 Using deployed n8n instance - no local Docker needed"
    npm run dev
else
    echo "🐳 Using local n8n instance with Docker Compose"
    docker-compose -f docker-compose.dev.yml up --build
fi
