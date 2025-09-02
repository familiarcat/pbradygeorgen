"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    console.log('🚀 Claude-Cursor Extension is now active!');
    // Register the basic command
    const startChatCommand = vscode.commands.registerCommand('cursor-claude.startUnifiedChat', () => {
        vscode.window.showInformationMessage('🚀 Unified AI Chat started! This is a minimal working version.');
        // Create a simple webview panel
        const panel = vscode.window.createWebviewPanel('unifiedChat', 'Unified AI Chat', vscode.ViewColumn.One, {});
        // Set the webview content
        panel.webview.html = getWebviewContent();
    });
    // Register the command
    context.subscriptions.push(startChatCommand);
    // Show activation message
    vscode.window.showInformationMessage('🚀 Claude-Cursor Extension activated! Use "Start Unified AI Chat" command.');
}
function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Unified AI Chat</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
            }
            .header { 
                text-align: center; 
                margin-bottom: 30px;
                color: var(--vscode-textLink-foreground);
            }
            .chat-container {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 8px;
                padding: 20px;
                background: var(--vscode-editor-background);
            }
            .message {
                margin: 10px 0;
                padding: 10px;
                border-radius: 6px;
                background: var(--vscode-input-background);
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Unified AI Chat</h1>
            <p>Minimal working version - Extension is functional!</p>
        </div>
        <div class="chat-container">
            <div class="message">
                <strong>System:</strong> Extension is working! This is a basic chat interface.
            </div>
            <div class="message">
                <strong>Status:</strong> ✅ Command registration successful
            </div>
            <div class="message">
                <strong>Next:</strong> Add your UI upgrades here
            </div>
        </div>
    </body>
    </html>`;
}
function deactivate() {
    console.log('👋 Claude-Cursor Extension deactivated');
}
//# sourceMappingURL=extension.js.map