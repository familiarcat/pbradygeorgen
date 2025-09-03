#!/usr/bin/env node

/**
 * 🧪 Extension Command Test Script
 * 
 * This script tests if the Cursor-Claude Unified extension commands are properly registered
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Cursor-Claude Unified Extension Commands...\n');

// Test 1: Check if extension is installed
console.log('📋 Test 1: Extension Installation Status');
try {
    const extensions = execSync('code --list-extensions --show-versions', { encoding: 'utf8' });
    const cursorExtension = extensions.split('\n').find(line => line.includes('cursor-claude-unified'));

    if (cursorExtension) {
        console.log('✅ Extension found:', cursorExtension);
    } else {
        console.log('❌ Extension not found');
        process.exit(1);
    }
} catch (error) {
    console.log('❌ Error checking extensions:', error.message);
    process.exit(1);
}

// Test 2: Check package.json for commands
console.log('\n📋 Test 2: Command Registration in package.json');
try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    if (packageData.contributes && packageData.contributes.commands) {
        const commands = packageData.contributes.commands;
        console.log(`✅ Found ${commands.length} commands:`);

        commands.forEach((cmd, index) => {
            console.log(`   ${index + 1}. ${cmd.command} - ${cmd.title}`);
        });

        // Check for specific commands
        const requiredCommands = [
            'cursor-claude.extendChat',
            'cursor-claude.analyzeFile',
            'cursor-claude.generateCode',
            'cursor-claude.enhancedChatWebview',
            'cursor-claude.aiCollaboration',
            'cursor-claude.addFileContext',
            'cursor-claude.workspaceAnalysis',
            'cursor-claude.performanceMetrics',
            'cursor-claude.llmOptimization'
        ];

        const missingCommands = requiredCommands.filter(cmd =>
            !commands.find(c => c.command === cmd)
        );

        if (missingCommands.length === 0) {
            console.log('✅ All required commands are registered');
        } else {
            console.log('❌ Missing commands:', missingCommands);
        }
    } else {
        console.log('❌ No commands found in package.json');
    }
} catch (error) {
    console.log('❌ Error reading package.json:', error.message);
}

// Test 3: Check compiled extension.js
console.log('\n📋 Test 3: Compiled Extension File');
try {
    const extensionPath = path.join(__dirname, 'out', 'extension.js');
    if (fs.existsSync(extensionPath)) {
        const stats = fs.statSync(extensionPath);
        console.log(`✅ Extension.js found (${(stats.size / 1024).toFixed(2)} KB)`);

        // Check if file contains expected content
        const content = fs.readFileSync(extensionPath, 'utf8');
        const hasCommands = content.includes('cursor-claude.extendChat') &&
            content.includes('cursor-claude.analyzeFile') &&
            content.includes('cursor-claude.generateCode');

        if (hasCommands) {
            console.log('✅ Extension.js contains expected commands');
        } else {
            console.log('❌ Extension.js missing expected commands');
        }
    } else {
        console.log('❌ Extension.js not found');
    }
} catch (error) {
    console.log('❌ Error checking extension.js:', error.message);
}

// Test 4: Check VSIX package
console.log('\n📋 Test 4: VSIX Package');
try {
    const vsixFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.vsix'));

    if (vsixFiles.length > 0) {
        const latestVsix = vsixFiles.sort().pop();
        const stats = fs.statSync(latestVsix);
        console.log(`✅ VSIX package found: ${latestVsix} (${(stats.size / 1024).toFixed(2)} KB)`);

        // Check if VSIX contains expected files
        try {
            const vsixContent = execSync(`unzip -l "${latestVsix}"`, { encoding: 'utf8' });
            const hasExtensionJs = vsixContent.includes('extension.js');
            const hasPackageJson = vsixContent.includes('package.json');

            if (hasExtensionJs && hasPackageJson) {
                console.log('✅ VSIX contains required files');
            } else {
                console.log('❌ VSIX missing required files');
            }
        } catch (unzipError) {
            console.log('⚠️  Could not inspect VSIX contents (unzip not available)');
        }
    } else {
        console.log('❌ No VSIX packages found');
    }
} catch (error) {
    console.log('❌ Error checking VSIX packages:', error.message);
}

// Test 5: Extension Activation
console.log('\n📋 Test 5: Extension Activation Test');
console.log('ℹ️  To test extension activation:');
console.log('   1. Open VS Code');
console.log('   2. Press Ctrl+Shift+P (Cmd+Shift+P on Mac)');
console.log('   3. Type "Cursor-Claude" to see available commands');
console.log('   4. Try "Cursor-Claude: Extend Chat" command');

console.log('\n🎯 Available Commands:');
console.log('   • cursor-claude.extendChat - Extend Cursor\'s native chat');
console.log('   • cursor-claude.analyzeFile - Analyze current file');
console.log('   • cursor-claude.generateCode - Generate code with AI');
console.log('   • cursor-claude.enhancedChatWebview - Open enhanced chat interface');
console.log('   • cursor-claude.aiCollaboration - AI collaboration analysis');
console.log('   • cursor-claude.addFileContext - Add file context');
console.log('   • cursor-claude.workspaceAnalysis - Analyze workspace');
console.log('   • cursor-claude.performanceMetrics - View performance metrics');
console.log('   • cursor-claude.llmOptimization - View LLM optimization insights');

console.log('\n🚀 Extension Test Complete!');
console.log('📝 Next Steps:');
console.log('   1. Restart VS Code to ensure extension loads');
console.log('   2. Check the status bar for enhanced chat indicators');
console.log('   3. Test the commands in the command palette');
console.log('   4. Verify the enhanced chat webview opens correctly');



