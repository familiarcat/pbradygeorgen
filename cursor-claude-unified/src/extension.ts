import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Claude-Cursor Extension is now active!');

    // Register the basic command
    const startChatCommand = vscode.commands.registerCommand(
        'cursor-claude.startUnifiedChat',
        () => {
            vscode.window.showInformationMessage('🚀 Unified AI Chat started! This is a minimal working version.');
            
            // Create a simple webview panel
            const panel = vscode.window.createWebviewPanel(
                'unifiedChat',
                'Unified AI Chat',
                vscode.ViewColumn.One,
                {}
            );

            // Set the webview content
            panel.webview.html = getWebviewContent();
        }
    );

    // Register the command
    context.subscriptions.push(startChatCommand);

    // Show activation message
    vscode.window.showInformationMessage(
        '🚀 Claude-Cursor Extension activated! Use "Start Unified AI Chat" command.'
    );
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

export function deactivate() {
    console.log('👋 Claude-Cursor Extension deactivated');
}