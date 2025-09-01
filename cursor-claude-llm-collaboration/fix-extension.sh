#!/bin/bash

echo "🔧 FIXING EXTENSION - CLEAN REBUILD PROCESS"
echo "============================================"
echo ""

# Step 1: Clean everything
echo "🧹 STEP 1: Cleaning previous build artifacts..."
echo "-----------------------------------------------"
rm -rf out/ node_modules/ *.vsix
echo "✅ Cleaned: out/, node_modules/, *.vsix"

# Step 2: Fresh install dependencies
echo ""
echo "📦 STEP 2: Installing dependencies..."
echo "-------------------------------------"
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi
echo "✅ Dependencies installed"

# Step 3: Compile TypeScript
echo ""
echo "⚙️  STEP 3: Compiling TypeScript..."
echo "------------------------------------"
npm run compile
if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed!"
    exit 1
fi
echo "✅ TypeScript compiled"

# Step 4: Verify extension.js file type
echo ""
echo "🔍 STEP 4: Verifying extension.js file..."
echo "------------------------------------------"
if [ -f "out/extension.js" ]; then
    echo "📄 extension.js file exists"
    echo "🔍 File type:"
    file out/extension.js
    
    # Check if it contains JavaScript code (look for key patterns)
if grep -q "use strict" out/extension.js && grep -q "exports.activate" out/extension.js; then
    echo "✅ extension.js contains valid JavaScript code"
else
    echo "❌ extension.js appears to be corrupted"
    exit 1
fi
else
    echo "❌ extension.js file not found!"
    exit 1
fi

# Step 5: Package the extension
echo ""
echo "📦 STEP 5: Packaging extension..."
echo "----------------------------------"
npm run package
if [ $? -ne 0 ]; then
    echo "❌ Packaging failed!"
    exit 1
fi
echo "✅ Extension packaged"

# Step 6: Install in Cursor
echo ""
echo "🚀 STEP 6: Installing in Cursor..."
echo "-----------------------------------"
if ls *.vsix 1> /dev/null 2>&1; then
    echo "📦 Found .vsix package:"
    ls -la *.vsix
    
    echo "🚀 Installing extension..."
    cursor --install-extension *.vsix
    
    if [ $? -eq 0 ]; then
        echo "✅ Extension installed successfully!"
    else
        echo "❌ Installation failed!"
        exit 1
    fi
else
    echo "❌ No .vsix package found!"
    exit 1
fi

echo ""
echo "🎉 EXTENSION FIX COMPLETE!"
echo "=========================="
echo "✅ Cleaned previous build"
echo "✅ Fresh dependencies installed"
echo "✅ TypeScript recompiled"
echo "✅ Extension packaged"
echo "✅ Extension installed in Cursor"
echo ""
echo "🔄 NEXT STEP: Restart Cursor completely!"
echo "   - Press Cmd+Q to quit"
echo "   - Wait 5-10 seconds"
echo "   - Reopen Cursor"
echo ""
echo "🔍 After restart, verify:"
echo "   - Press Cmd+Shift+X → Search 'cursor-claude-llm-collaboration'"
echo "   - Press Cmd+Shift+P → Type 'Start LLM'"
echo ""
echo "✨ Your extension should now work!"
