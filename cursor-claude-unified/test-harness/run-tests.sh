#!/bin/bash

# 🚀 Cursor AI Supercharger - Test Harness Runner
# Simple script to run the automated testing suite

echo "🚀 Cursor AI Supercharger - Test Harness Runner"
echo "=================================================="

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed"
    echo "Please install Python 3 and try again"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the extension root directory"
    echo "Current directory: $(pwd)"
    echo "Expected files: package.json, src/extension.ts"
    exit 1
fi

# Create test-harness directory if it doesn't exist
if [ ! -d "test-harness" ]; then
    echo "📁 Creating test-harness directory..."
    mkdir -p test-harness
fi

# Check if the test suite exists
if [ ! -f "test-harness/extension-test-suite.py" ]; then
    echo "❌ Test suite not found: test-harness/extension-test-suite.py"
    echo "Please ensure the test suite is properly created"
    exit 1
fi

# Make the test suite executable
chmod +x test-harness/extension-test-suite.py

echo "🧪 Running automated test suite..."
echo "=================================================="

# Run the test suite
python3 test-harness/extension-test-suite.py

# Check the exit code
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Test suite completed successfully!"
    echo "📊 Check the generated test report for detailed results"
else
    echo ""
    echo "❌ Test suite completed with failures or errors"
    echo "📊 Check the generated test report for details"
    echo "🔧 Review the recommendations and fix issues before deployment"
fi

echo ""
echo "📁 Test reports are saved in the current directory"
echo "📋 Look for files named: test_report_YYYYMMDD_HHMMSS.json"
