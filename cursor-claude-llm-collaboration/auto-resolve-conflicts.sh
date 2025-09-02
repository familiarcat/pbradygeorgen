#!/bin/bash

echo "🚀 AUTOMATED EXTENSION CONFLICT RESOLUTION & TESTING"
echo "===================================================="
echo ""

# Step 1: Check current extension status
echo "🔍 STEP 1: Checking current extension status..."
echo "-----------------------------------------------"
echo "📦 Currently installed Claude extensions:"
cursor --list-extensions | grep claude

echo ""

# Step 2: Remove conflicting extensions
echo "🧹 STEP 2: Removing conflicting extensions..."
echo "---------------------------------------------"

# Check if old extension exists and remove it
if cursor --list-extensions | grep -q "cursor-claude-unified"; then
    echo "❌ Found conflicting extension: cursor-claude-unified"
    echo "🚀 Uninstalling conflicting extension..."
    cursor --uninstall-extension pbradygeorgen.cursor-claude-unified
    echo "✅ Conflicting extension removed"
else
    echo "✅ No conflicting extensions found"
fi

echo ""

# Step 3: Verify our extension is active
echo "✅ STEP 3: Verifying our extension status..."
echo "--------------------------------------------"
echo "📦 Remaining Claude extensions:"
cursor --list-extensions | grep claude

echo ""

# Step 4: Check if our extension is properly installed
if cursor --list-extensions | grep -q "cursor-claude-llm-collaboration"; then
    echo "✅ Our extension is properly installed"
else
    echo "❌ Our extension is missing! Reinstalling..."
    echo "🚀 Reinstalling our extension..."
    
    # Find and install the latest .vsix
    if ls *.vsix 1> /dev/null 2>&1; then
        latest_vsix=$(ls -t *.vsix | head -1)
        echo "📦 Installing: $latest_vsix"
        cursor --install-extension "$latest_vsix"
    else
        echo "❌ No .vsix package found! Building..."
        npm run package
        latest_vsix=$(ls -t *.vsix | head -1)
        cursor --install-extension "$latest_vsix"
    fi
fi

echo ""

# Step 5: Provide restart instructions
echo "🔄 STEP 4: Extension conflict resolution complete!"
echo "=================================================="
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Press Cmd+Q to quit Cursor completely"
echo "2. Wait 5-10 seconds"
echo "3. Reopen Cursor"
echo ""
echo "🔍 AFTER RESTART, TEST:"
echo "1. Press Cmd+Shift+P → Type 'Start LLM'"
echo "2. Look for '🚀 Start LLM Collaboration'"
echo "3. Enter test task: 'Build a React component'"
echo "4. Should see beautiful UI with cost analysis"
echo ""

# Step 6: Auto-detect when Cursor is restarted
echo "⏳ Waiting for Cursor restart detection..."
echo "   (This will check every 5 seconds if extension is active)"

# Function to check if extension is working
check_extension_status() {
    local extension_list=$(cursor --list-extensions 2>/dev/null | grep claude)
    if [[ $extension_list == *"cursor-claude-llm-collaboration"* ]] && [[ $extension_list != *"cursor-claude-unified"* ]]; then
        echo "✅ Extension conflict resolved! Only our extension is active!"
        return 0
    else
        return 1
    fi
}

# Wait for user to restart Cursor
echo "🔄 Please restart Cursor now (Cmd+Q, wait, reopen)..."
echo "   Script will detect when extension is properly loaded."

# Check every 5 seconds for up to 2 minutes
for i in {1..24}; do
    sleep 5
    if check_extension_status; then
        echo ""
        echo "🎉 SUCCESS! Extension conflict resolved!"
        echo ""
        echo "🔍 FINAL TESTING STEPS:"
        echo "1. Press Cmd+Shift+P and type 'Start LLM'"
        echo "2. Look for '🚀 Start LLM Collaboration' command"
        echo "3. Test with task: 'Build a React component'"
        echo "4. Should see enhanced UI with cost analysis"
        echo ""
        echo "✨ Your extension should now work without conflicts!"
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














