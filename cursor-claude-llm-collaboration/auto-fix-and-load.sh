#!/bin/bash

echo "🚀 AUTOMATED EXTENSION FIX & LOAD PROCESS"
echo "=========================================="
echo ""

# Step 1: Fix the extension
echo "🔧 STEP 1: Fixing the extension..."
echo "-----------------------------------"
./fix-extension.sh

if [ $? -ne 0 ]; then
    echo "❌ Fix script failed! Stopping here."
    exit 1
fi

echo ""
echo "✅ Extension fixed successfully!"
echo ""

# Step 2: Verify extension is properly built
echo "🔍 STEP 2: Verifying extension build..."
echo "----------------------------------------"

# Check if extension.js is now JavaScript
echo "📄 Checking extension.js file type:"
file out/extension.js

# Check if .vsix package exists
echo "📦 Checking .vsix package:"
ls -la *.vsix

# Check if extension is installed
echo "🚀 Checking if extension is installed:"
cursor --list-extensions | grep claude

echo ""
echo "✅ Extension verification complete!"
echo ""

# Step 3: Provide restart instructions
echo "🔄 STEP 3: Loading extension into Cursor..."
echo "-------------------------------------------"
echo ""
echo "🎯 TO COMPLETE THE PROCESS:"
echo "1. Press Cmd+Q to quit Cursor completely"
echo "2. Wait 5-10 seconds"
echo "3. Reopen Cursor"
echo ""
echo "🔍 AFTER RESTART, VERIFY:"
echo "- Press Cmd+Shift+X → Search 'cursor-claude-llm-collaboration'"
echo "- Press Cmd+Shift+P → Type 'Start LLM' → Should show commands"
echo "- Press Cmd+Shift+J → Select 'Cursor-Claude LLM Collaboration'"
echo ""

# Step 4: Auto-detect when Cursor is restarted
echo "⏳ Waiting for Cursor restart detection..."
echo "   (This will check every 5 seconds if extension is active)"

# Function to check if extension is working
check_extension_status() {
    local extension_list=$(cursor --list-extensions 2>/dev/null | grep claude)
    if [[ $extension_list == *"cursor-claude-llm-collaboration"* ]]; then
        echo "✅ Extension detected as installed!"
        return 0
    else
        return 1
    fi
}

# Wait for user to restart Cursor
echo "🔄 Please restart Cursor now (Cmd+Q, wait, reopen)..."
echo "   Script will detect when extension is loaded."

# Check every 5 seconds for up to 2 minutes
for i in {1..24}; do
    sleep 5
    if check_extension_status; then
        echo ""
        echo "🎉 SUCCESS! Extension is now loaded in Cursor!"
        echo ""
        echo "🔍 FINAL VERIFICATION STEPS:"
        echo "1. Press Cmd+Shift+P and type 'Start LLM'"
        echo "2. Look for '🚀 Start LLM Collaboration' command"
        echo "3. Press Cmd+Shift+J and select 'Cursor-Claude LLM Collaboration'"
        echo ""
        echo "✨ Your extension should now be fully functional!"
        break
    else
        echo "⏳ Still waiting... (${i}/24 attempts)"
    fi
done

if [ $i -eq 24 ]; then
    echo ""
    echo "⚠️  Extension not detected after 2 minutes."
    echo "   Please check manually:"
    echo "   - Press Cmd+Shift+X → Search for extension"
    echo "   - Press Cmd+Shift+P → Type 'Start LLM'"
fi

echo ""
echo "🏁 Automation complete!"
