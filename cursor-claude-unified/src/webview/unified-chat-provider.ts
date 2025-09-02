import * as vscode from 'vscode';
import { SharedContext, ChatMessage, UnifiedResponse } from '../types/interfaces';
import { DemocraticRouter } from '../services/democratic-router';
import { CrossReferenceEngine } from '../services/cross-reference-engine';
import { AutonomousCollaborationEngine } from '../services/autonomous-collaboration-engine';
import { v4 as uuidv4 } from 'uuid';

export class UnifiedChatProvider implements vscode.WebviewViewProvider {
    private webview?: vscode.Webview;
    private messages: ChatMessage[] = [];

    constructor(
        private readonly extensionUri: vscode.Uri,
        private sharedContext: SharedContext,
        private democraticRouter: DemocraticRouter,
        private crossReferenceEngine: CrossReferenceEngine,
        private autonomousEngine: AutonomousCollaborationEngine
    ) {}

    public resolveWebviewView(
        webviewView: vscode.WebviewView | vscode.WebviewPanel,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken,
    ) {
        this.webview = webviewView.webview;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.extensionUri]
        };

        webviewView.webview.html = this.getWebviewContent(webviewView.webview);

        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.command) {
                case 'user-message':
                    await this.handleUserMessage(data.text);
                    break;
                case 'request-context-update':
                    this.sendContextUpdate();
                    break;
                case 'clear-chat':
                    this.clearChat();
                    break;
                case 'export-conversation':
                    this.exportConversation();
                    break;
            }
        });

        // Send initial welcome message
        setTimeout(() => {
            this.addSystemMessage('🚀 Autonomous AI Collaboration initialized! Claude and Cursor will work together automatically without any user input needed.');
        }, 1000);
    }

    private async handleUserMessage(message: string) {
        if (!message.trim()) return;

        // Add user message to chat
        this.addUserMessage(message);

        try {
            // Show autonomous collaboration indicator
            this.sendToWebview({
                type: 'autonomous-collaboration-indicator',
                content: { 
                    message: '🤖 Autonomous AI collaboration in progress...',
                    status: 'analyzing'
                }
            });

            // EXECUTE AUTONOMOUS COLLABORATION - No user choice needed!
            const autonomousResult = await this.autonomousEngine.executeAutonomousCollaboration(
                message, 
                this.sharedContext
            );
            
            // Show autonomous decision process
            this.addAutonomousDecisionProcess(autonomousResult);

            // Show autonomous execution
            this.addAutonomousExecution(autonomousResult);

            // Show autonomous review process
            this.addAutonomousReview(autonomousResult);

            // Show final integrated result
            this.addFinalIntegratedResult(autonomousResult);

            // Update conversation history
            this.updateConversationHistory(message, autonomousResult);

        } catch (error) {
            console.error('Error in autonomous collaboration:', error);
            this.addSystemMessage(`❌ Autonomous collaboration error: ${error}. The AIs will retry automatically.`);
        } finally {
            // Remove autonomous collaboration indicator
            this.sendToWebview({ type: 'stop-autonomous-collaboration' });
        }
    }

    private addUserMessage(message: string) {
        const chatMessage: ChatMessage = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            type: 'user',
            source: 'user',
            content: message,
            confidence: 1.0,
            references: [],
            metadata: { message_type: 'user_input' }
        };

        this.messages.push(chatMessage);
        this.sendToWebview({
            type: 'user-message',
            content: chatMessage
        });
    }

    private addAutonomousDecisionProcess(result: any) {
        const { task_analysis, ai_selection } = result;
        
        // Show task analysis
        this.addSystemMessage(`🔍 **Autonomous Task Analysis**\n\n` +
            `**Task Type**: ${task_analysis.task_type}\n` +
            `**Complexity**: ${task_analysis.complexity}\n` +
            `**Priority**: ${task_analysis.priority}\n` +
            `**Required Capabilities**: ${task_analysis.required_capabilities.join(', ')}`
        );

        // Show AI selection
        this.addSystemMessage(`🤖 **Autonomous AI Selection**\n\n` +
            `**Primary AI**: ${ai_selection.primary_ai.toUpperCase()}\n` +
            `**Secondary AI**: ${ai_selection.secondary_ai.toUpperCase()}\n` +
            `**Collaboration Mode**: ${ai_selection.collaboration_mode}\n` +
            `**Rationale**: ${ai_selection.selection_rationale}\n\n` +
            `**Primary Responsibilities**:\n${ai_selection.primary_responsibilities.map((r: string) => `• ${r}`).join('\n')}\n\n` +
            `**Secondary Responsibilities**:\n${ai_selection.secondary_responsibilities.map((r: string) => `• ${r}`).join('\n')}`
        );
    }

    private addAutonomousExecution(result: any) {
        const { execution_result } = result;
        
        this.addSystemMessage(`⚡ **Autonomous Execution**\n\n` +
            `**Primary AI Execution**: ${execution_result.primary_execution.content}\n` +
            `**Secondary AI Execution**: ${execution_result.secondary_execution.content}\n` +
            `**Enhancement Opportunities**: ${execution_result.enhancement_opportunities.join(', ')}\n` +
            `**Collaboration Quality**: ${execution_result.collaboration_quality}`
        );
    }

    private addAutonomousReview(result: any) {
        const { review_result } = result;
        
        this.addSystemMessage(`🔍 **Autonomous Review Process**\n\n` +
            `**Primary AI Review**: ${review_result.primary_review.feedback}\n` +
            `**Secondary AI Review**: ${review_result.secondary_review.feedback}\n` +
            `**Cross-Validation**: ${review_result.cross_validation.overall_agreement > 0.8 ? '✅ Strong Consensus' : '⚠️ Some Disagreement'}\n` +
            `**Overall Quality Assessment**: ${review_result.quality_assessment}`
        );
    }

    private addFinalIntegratedResult(result: any) {
        const { final_integrated_result } = result;
        
        this.addSystemMessage(`🎯 **Final Integrated Result**\n\n` +
            `**Integrated Content**: ${final_integrated_result.final_content}\n\n` +
            `**Quality Metrics**:\n` +
            `• Overall Quality: ${final_integrated_result.quality_metrics.overall_quality}\n` +
            `• Collaboration Effectiveness: ${final_integrated_result.quality_metrics.collaboration_effectiveness}\n` +
            `• User Satisfaction Prediction: ${final_integrated_result.quality_metrics.user_satisfaction_prediction}`
        );
    }

    private addSystemMessage(message: string) {
        const systemMessage: ChatMessage = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            type: 'system',
            source: 'system',
            content: message,
            confidence: 1.0,
            references: [],
            metadata: { message_type: 'system_message' }
        };

        this.messages.push(systemMessage);
        this.sendToWebview({
            type: 'system-message',
            content: systemMessage
        });
    }

    private extractReferences(content: string): string[] {
        const references: string[] = [];
        const mentionRegex = /@(cursor|claude)/gi;
        const matches = content.match(mentionRegex);
        
        if (matches) {
            references.push(...matches.map(match => match.toLowerCase()));
        }

        return [...new Set(references)]; // Remove duplicates
    }

    private updateConversationHistory(userMessage: string, autonomousResult: any) {
        // Update shared context with autonomous collaboration results
        this.sharedContext.conversation_history.push({
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            ai_source: autonomousResult.ai_selection.primary_ai,
            message: autonomousResult.final_integrated_result.final_content,
            confidence_score: autonomousResult.final_integrated_result.quality_metrics.overall_quality,
            references_to_other_ai: [autonomousResult.ai_selection.secondary_ai],
            message_type: 'response'
        });

        // Keep only last 20 messages to prevent memory bloat
        if (this.sharedContext.conversation_history.length > 20) {
            this.sharedContext.conversation_history = this.sharedContext.conversation_history.slice(-20);
        }
    }

    private sendContextUpdate() {
        this.sendToWebview({
            type: 'context-update',
            content: {
                activeFile: this.sharedContext.file_context.find(f => f.is_active),
                openFiles: this.sharedContext.file_context.length,
                projectType: this.sharedContext.workspace_context.project_type,
                languages: this.sharedContext.workspace_context.languages
            }
        });
    }

    private clearChat() {
        this.messages = [];
        this.sharedContext.conversation_history = [];
        this.sendToWebview({ type: 'clear-chat' });
        this.addSystemMessage('🧹 Chat cleared. Ready for autonomous AI collaboration!');
    }

    private async exportConversation() {
        const conversationData = {
            session_id: this.sharedContext.session_id,
            timestamp: new Date().toISOString(),
            messages: this.messages,
            context: this.sharedContext
        };

        const conversationJson = JSON.stringify(conversationData, null, 2);
        
        try {
            const document = await vscode.workspace.openTextDocument({
                content: conversationJson,
                language: 'json'
            });
            
            await vscode.window.showTextDocument(document);
            vscode.window.showInformationMessage('💾 Autonomous collaboration conversation exported successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to export conversation: ${error}`);
        }
    }

    private sendToWebview(message: any) {
        if (this.webview) {
            this.webview.postMessage(message);
        }
    }

    private getWebviewContent(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Autonomous AI Collaboration</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 16px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            line-height: 1.6;
        }
        
        .chat-container {
            max-width: 100%;
            margin: 0 auto;
        }
        
        .message {
            margin-bottom: 16px;
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .user-message {
            background: var(--vscode-input-background);
            border-left-color: var(--vscode-button-background);
        }
        
        .system-message {
            background: var(--vscode-editor-background);
            border-left-color: var(--vscode-textLink-foreground);
        }
        
        .ai-message {
            background: var(--vscode-editor-background);
            border-left-color: var(--vscode-textPreformat-foreground);
        }
        
        .claude-message {
            border-left-color: #FF6B35;
            background: rgba(255, 107, 53, 0.05);
        }
        
        .cursor-message {
            border-left-color: #007ACC;
            background: rgba(0, 122, 204, 0.05);
        }
        
        .autonomous-indicator {
            background: var(--vscode-progressBar-background);
            border-left-color: var(--vscode-progressBar-foreground);
            text-align: center;
            font-weight: bold;
        }
        
        .message-header {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 8px;
        }
        
        .message-content {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .input-container {
            position: sticky;
            bottom: 0;
            background: var(--vscode-editor-background);
            padding: 16px 0;
            border-top: 1px solid var(--vscode-panel-border);
        }
        
        .input-field {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--vscode-input-border);
            border-radius: 6px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            font-size: 14px;
            resize: vertical;
            min-height: 60px;
        }
        
        .input-field:focus {
            outline: none;
            border-color: var(--vscode-focusBorder);
        }
        
        .send-button {
            margin-top: 8px;
            padding: 8px 16px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .send-button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        
        .send-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .controls {
            display: flex;
            gap: 8px;
            margin-top: 8px;
        }
        
        .control-button {
            padding: 6px 12px;
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .control-button:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        
        .status-indicator {
            text-align: center;
            padding: 8px;
            margin: 8px 0;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        
        .status-analyzing {
            background: var(--vscode-progressBar-background);
            color: var(--vscode-progressBar-foreground);
        }
        
        .status-executing {
            background: var(--vscode-textLink-foreground);
            color: white;
        }
        
        .status-reviewing {
            background: var(--vscode-textPreformat-foreground);
            color: white;
        }
        
        .status-complete {
            background: var(--vscode-debugIcon-startForeground);
            color: white;
        }
    </style>
</head>
<body>
    <div class="chat-container">
        <div id="messages"></div>
        
        <div class="input-container">
            <textarea 
                id="messageInput" 
                class="input-field" 
                placeholder="🤖 Ask anything - the AIs will collaborate autonomously without any input from you!"
                rows="3"
            ></textarea>
            
            <div class="controls">
                <button id="sendButton" class="send-button">🚀 Send to Autonomous AIs</button>
                <button id="clearButton" class="control-button">🧹 Clear Chat</button>
                <button id="exportButton" class="control-button">💾 Export</button>
            </div>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const messagesContainer = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const clearButton = document.getElementById('clearButton');
        const exportButton = document.getElementById('exportButton');

        // Handle send button click
        sendButton.addEventListener('click', sendMessage);
        
        // Handle Enter key (Shift+Enter for new line)
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Handle clear button
        clearButton.addEventListener('click', () => {
            vscode.postMessage({ command: 'clear-chat' });
        });

        // Handle export button
        exportButton.addEventListener('click', () => {
            vscode.postMessage({ command: 'export-conversation' });
        });

        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                vscode.postMessage({ 
                    command: 'user-message', 
                    text: message 
                });
                messageInput.value = '';
                sendButton.disabled = true;
            }
        }

        // Listen for messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.type) {
                case 'user-message':
                    addMessage(message.content, 'user');
                    break;
                case 'system-message':
                    addMessage(message.content, 'system');
                    break;
                case 'autonomous-collaboration-indicator':
                    addAutonomousIndicator(message.content);
                    break;
                case 'stop-autonomous-collaboration':
                    removeAutonomousIndicator();
                    sendButton.disabled = false;
                    break;
                case 'clear-chat':
                    messagesContainer.innerHTML = '';
                    break;
                case 'context-update':
                    updateContext(message.content);
                    break;
            }
        });

        function addMessage(message, type) {
            const messageElement = document.createElement('div');
            messageElement.className = \`message \${type}-message\`;
            
            const header = document.createElement('div');
            header.className = 'message-header';
            header.textContent = \`\${message.source || message.ai_source || type} • \${new Date(message.timestamp).toLocaleTimeString()}\`;
            
            const content = document.createElement('div');
            content.className = 'message-content';
            content.textContent = message.content || message.message || '';
            
            messageElement.appendChild(header);
            messageElement.appendChild(content);
            messagesContainer.appendChild(messageElement);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function addAutonomousIndicator(content) {
            const indicator = document.createElement('div');
            indicator.id = 'autonomousIndicator';
            indicator.className = 'autonomous-indicator';
            indicator.textContent = content.message;
            messagesContainer.appendChild(indicator);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function removeAutonomousIndicator() {
            const indicator = document.getElementById('autonomousIndicator');
            if (indicator) {
                indicator.remove();
            }
        }

        function updateContext(context) {
            // Update context display if needed
            console.log('Context updated:', context);
        }

        // Request initial context
        vscode.postMessage({ command: 'request-context-update' });
    </script>
</body>
</html>`;
    }
}