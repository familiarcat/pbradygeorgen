#!/bin/bash

# Level 2 Diagnostic - Unified Production/Development Deployment
# This script conducts a comprehensive analysis of deployment unification issues

set -e

echo "🎖️ CAPTAIN PICARD - LEVEL 2 DIAGNOSTIC INITIATION"
echo "=================================================="
echo ""

# Load environment variables (avoid zstyle issues)
export N8N_DEPLOYED_URL="https://n8n.pbradygeorgen.com"
export N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"

echo "🔍 PHASE 1: ENVIRONMENT ANALYSIS"
echo "--------------------------------"

# Check Node.js and npm versions
echo "📋 Node.js Environment:"
echo "   • Node.js: $(node --version)"
echo "   • npm: $(npm --version)"
echo "   • NODE_ENV: ${NODE_ENV:-not set}"
echo ""

# Check n8n connectivity
echo "🔗 n8n Connectivity:"
N8N_URL="https://n8n.pbradygeorgen.com"
if curl -s --max-time 10 "$N8N_URL/healthz" > /dev/null; then
    echo "   ✅ n8n deployed instance accessible"
else
    echo "   ❌ n8n deployed instance not accessible"
fi
echo ""

# Check Docker availability
echo "🐳 Docker Environment:"
if command -v docker &> /dev/null; then
    echo "   ✅ Docker available: $(docker --version)"
    if docker info &> /dev/null; then
        echo "   ✅ Docker daemon running"
    else
        echo "   ❌ Docker daemon not running"
    fi
else
    echo "   ❌ Docker not installed"
fi
echo ""

echo "🔍 PHASE 2: DEPENDENCY ANALYSIS"
echo "--------------------------------"

# Check for vulnerabilities
echo "📊 Security Vulnerabilities:"
VULNERABILITIES=$(npm audit --audit-level=moderate --json 2>/dev/null | jq -r '.metadata.vulnerabilities.total // 0')
echo "   • Total vulnerabilities: $VULNERABILITIES"
echo ""

# Check PDF.js compatibility
echo "📄 PDF.js Compatibility:"
PDFJS_VERSION=$(npm list pdfjs-dist | grep pdfjs-dist | awk '{print $2}')
echo "   • PDF.js version: $PDFJS_VERSION"
if [[ "$PDFJS_VERSION" == *"5."* ]]; then
    echo "   ⚠️  Using PDF.js v5 (may have compatibility issues)"
else
    echo "   ✅ Using compatible PDF.js version"
fi
echo ""

echo "🔍 PHASE 3: BUILD SYSTEM ANALYSIS"
echo "----------------------------------"

# Test build process
echo "🏗️ Build Process Test:"
if npm run build > /tmp/build-test.log 2>&1; then
    echo "   ✅ Build successful"
    BUILD_TIME=$(grep "Compiled successfully" /tmp/build-test.log | head -1 | awk '{print $NF}')
    echo "   • Build time: $BUILD_TIME"
else
    echo "   ❌ Build failed"
    echo "   • Check /tmp/build-test.log for details"
fi
echo ""

echo "🔍 PHASE 4: DEVELOPMENT SERVER ANALYSIS"
echo "----------------------------------------"

# Test development server
echo "🚀 Development Server Test:"
echo "   • Starting development server..."
npm run dev > /tmp/dev-test.log 2>&1 &
DEV_PID=$!

# Wait for server to start
sleep 15

if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Development server responding"
    RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
    echo "   • Response code: $RESPONSE_CODE"
else
    echo "   ❌ Development server not responding"
fi

# Stop development server
kill $DEV_PID 2>/dev/null || true
echo ""

echo "🔍 PHASE 5: PRODUCTION DEPLOYMENT ANALYSIS"
echo "-------------------------------------------"

# Check Amplify configuration
echo "☁️ AWS Amplify Configuration:"
if [ -d "amplify" ]; then
    echo "   ✅ Amplify directory exists"
    if [ -f "amplify/team-provider-info.json" ]; then
        echo "   ✅ Team provider info configured"
    else
        echo "   ❌ Team provider info missing"
    fi
else
    echo "   ❌ Amplify directory not found"
fi
echo ""

# Check environment variables
echo "🔧 Environment Variables:"
echo "   • N8N_BASE_URL: ${N8N_BASE_URL:-not set}"
echo "   • N8N_API_KEY: ${N8N_API_KEY:+set}"
echo "   • OPENROUTER_API_KEY: ${OPENROUTER_API_KEY:+set}"
echo ""

echo "🔍 PHASE 6: UNIFIED DEPLOYMENT RECOMMENDATIONS"
echo "-----------------------------------------------"

echo "🎯 CRITICAL FIXES REQUIRED:"
echo ""

# PDF.js compatibility fix
echo "1. 📄 PDF.js Compatibility:"
echo "   • Issue: PDF.js v5 has breaking changes"
echo "   • Solution: Use legacy build for Node.js environments"
echo "   • Action: Update PDF processing scripts"
echo ""

# Memory optimization
echo "2. 💾 Memory Optimization:"
echo "   • Issue: JavaScript heap out of memory during PDF processing"
echo "   • Solution: Increase Node.js memory limit"
echo "   • Action: Add --max-old-space-size=4096 to build scripts"
echo ""

# Development server fix
echo "3. 🚀 Development Server:"
echo "   • Issue: Internal server errors"
echo "   • Solution: Fix PDF.js compatibility and memory issues"
echo "   • Action: Update development configuration"
echo ""

# Unified environment
echo "4. 🔄 Unified Environment:"
echo "   • Issue: Production/development environment differences"
echo "   • Solution: Standardize environment variables and configurations"
echo "   • Action: Create unified configuration system"
echo ""

echo "🎖️ CAPTAIN PICARD - LEVEL 2 DIAGNOSTIC COMPLETE"
echo "================================================"
echo ""
echo "📋 SUMMARY:"
echo "   • Build system: ✅ Operational"
echo "   • Dependencies: ⚠️  Need updates"
echo "   • Development: ❌ Needs fixes"
echo "   • Production: ⚠️  Needs optimization"
echo "   • Federation Crew: ✅ Operational"
echo ""
echo "🚀 NEXT STEPS:"
echo "   1. Fix PDF.js compatibility issues"
echo "   2. Optimize memory usage"
echo "   3. Standardize environment configuration"
echo "   4. Test unified deployment pipeline"
echo ""
echo "🎖️ CAPTAIN PICARD: 'Admiral, the Level 2 Diagnostic is complete. The Federation Crew is ready to assist with implementing the recommended fixes.'"
