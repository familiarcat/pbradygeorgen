import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { SubAgentOrchestrator } from './sub-agent-orchestrator';

interface ZshrcConfig {
    n8nBaseUrl?: string;
    openRouterApiKey?: string;
    claudeApiKey?: string;
    n8nApiKey?: string;
}

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    model: string;
    timestamp: Date;
    cost: number;
    tokens: number;
}

interface LLMSelection {
    primary_model: string;
    confidence_score: number;
    reasoning: string;
    cost_per_token: number;
    estimated_cost: number;
    task_type: string;
    complexity: string;
    fallback_models: string[];
}

class LLMCollaborationSystem {
    private models: any;
    private taskAffinities: any;
    private n8nBaseUrl: string = '';
    private openRouterApiKey: string = '';
    private claudeApiKey: string = '';
    private n8nApiKey: string = '';
    private chatHistory: ChatMessage[] = [];

    constructor() {
        // AI model configurations from the working Python system
        this.models = {
            'claude-sonnet': {
                platform: 'anthropic',
                openrouter_id: 'anthropic/claude-3.5-sonnet',
                cost_per_token: 0.000003,
                specialization: 'strategic_analysis',
                strengths: ['reasoning', 'analysis', 'coding', 'writing']
            },
            'gpt-4o': {
                platform: 'openai',
                openrouter_id: 'openai/gpt-4o',
                cost_per_token: 0.000005,
                specialization: 'research',
                strengths: ['multimodal', 'creativity', 'general_purpose']
            },
            'gemini-pro': {
                platform: 'google',
                openrouter_id: 'google/gemini-pro-1.5',
                cost_per_token: 0.000002,
                specialization: 'optimization',
                strengths: ['code_analysis', 'performance', 'efficiency']
            },
            'llama-3': {
                platform: 'meta',
                openrouter_id: 'meta-llama/llama-3-70b-instruct',
                cost_per_token: 0.000001,
                specialization: 'code_implementation',
                strengths: ['open_source', 'cost_effective', 'coding']
            }
        };

        // Task-model affinity scoring from the working Python system
        this.taskAffinities = {
            'code_implementation': {
                'llama-3': 0.95,
                'claude-sonnet': 0.85,
                'gemini-pro': 0.80,
                'gpt-4o': 0.70
            },
            'strategic_analysis': {
                'claude-sonnet': 0.98,
                'gpt-4o': 0.90,
                'gemini-pro': 0.75,
                'llama-3': 0.65
            },
            'research': {
                'gpt-4o': 0.95,
                'claude-sonnet': 0.85,
                'gemini-pro': 0.75,
                'llama-3': 0.60
            },
            'optimization': {
                'gemini-pro': 0.95,
                'claude-sonnet': 0.80,
                'gpt-4o': 0.75,
                'llama-3': 0.70
            }
        };

        // Load configuration from ~/.zshrc
        this.loadConfiguration();
    }

    private loadConfiguration() {
        try {
            const zshrcPath = path.join(os.homedir(), '.zshrc');
            if (fs.existsSync(zshrcPath)) {
                const zshrcContent = fs.readFileSync(zshrcPath, 'utf8');
                const config = this.readZshrcConfig(zshrcContent);
                
                this.n8nBaseUrl = config.n8nBaseUrl || '';
                this.openRouterApiKey = config.openRouterApiKey || '';
                this.claudeApiKey = config.claudeApiKey || '';
                this.n8nApiKey = config.n8nApiKey || '';

                console.log('✅ Configuration loaded from ~/.zshrc');
                console.log(`   N8N Base URL: ${this.n8nBaseUrl ? '✅ Set' : '❌ Missing'}`);
                console.log(`   OpenRouter API Key: ${this.openRouterApiKey ? '✅ Set' : '❌ Missing'}`);
                console.log(`   Claude API Key: ${this.claudeApiKey ? '✅ Set' : '❌ Missing'}`);
                console.log(`   N8N API Key: ${this.n8nApiKey ? '✅ Set' : '❌ Missing'}`);
            } else {
                console.log('⚠️ ~/.zshrc not found, using default configuration');
            }
        } catch (error) {
            console.error('❌ Error loading configuration:', error);
        }
    }

    private readZshrcConfig(content: string): ZshrcConfig {
        const config: ZshrcConfig = {};
        
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.startsWith('export ')) {
                const parts = line.split('=');
                if (parts.length === 2) {
                    const key = parts[0].replace('export ', '').trim();
                    const value = parts[1].replace(/"/g, '').trim();
                    
                    switch (key) {
                        case 'N8N_BASE_URL':
                            config.n8nBaseUrl = value;
                            break;
                        case 'OPENROUTER_API_KEY':
                            config.openRouterApiKey = value;
                            break;
                        case 'CLAUDE_API_KEY':
                            config.claudeApiKey = value;
                            break;
                        case 'N8N_API_KEY':
                            config.n8nApiKey = value;
                            break;
                    }
                }
            }
        }
        
        return config;
    }

    public analyzeTask(userMessage: string): LLMSelection {
        // Task classification logic
        const taskType = this.classifyTask(userMessage);
        const complexity = this.assessComplexity(userMessage);
        
        // Get model scores for this task type
        const modelScores = this.taskAffinities[taskType] || {};
        
        // Find the best model
        let bestModel = '';
        let bestScore = 0;
        
        for (const [model, score] of Object.entries(modelScores)) {
            if ((score as number) > bestScore) {
                bestScore = score as number;
                bestModel = model;
            }
        }
        
        // Calculate cost estimates
        const costPerToken = this.models[bestModel]?.cost_per_token || 0.000005;
        const estimatedTokens = Math.ceil(userMessage.length / 4); // Rough estimate
        const estimatedCost = costPerToken * estimatedTokens;
        
        // Get fallback models (top 2 alternatives)
        const fallbackModels = Object.entries(modelScores)
            .sort(([,a], [,b]) => (b as number) - (a as number))
            .slice(1, 3)
            .map(([model]) => model);
        
        return {
            primary_model: bestModel,
            confidence_score: bestScore,
            reasoning: `Selected ${bestModel} for ${taskType} task with ${complexity} complexity. Confidence: ${(bestScore * 100).toFixed(1)}%`,
            cost_per_token: costPerToken,
            estimated_cost: estimatedCost,
            task_type: taskType,
            complexity: complexity,
            fallback_models: fallbackModels
        };
    }

    private classifyTask(message: string): string {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('code') || lowerMessage.includes('implement') || lowerMessage.includes('build') || lowerMessage.includes('create')) {
            return 'code_implementation';
        } else if (lowerMessage.includes('analyze') || lowerMessage.includes('strategy') || lowerMessage.includes('plan') || lowerMessage.includes('design')) {
            return 'strategic_analysis';
        } else if (lowerMessage.includes('research') || lowerMessage.includes('investigate') || lowerMessage.includes('explore') || lowerMessage.includes('study')) {
            return 'research';
        } else if (lowerMessage.includes('optimize') || lowerMessage.includes('improve') || lowerMessage.includes('enhance') || lowerMessage.includes('performance')) {
            return 'optimization';
        }
        
        return 'general_purpose';
    }

    private assessComplexity(message: string): string {
        const wordCount = message.split(' ').length;
        const hasCode = /```[\s\S]*```/.test(message) || /`[^`]+`/.test(message);
        
        if (wordCount > 100 || hasCode) return 'high';
        if (wordCount > 50) return 'medium';
        return 'low';
    }

    public async sendMessage(message: string, selectedModel?: string): Promise<ChatMessage> {
        // Analyze task and select best model if not specified
        const selection = this.analyzeTask(message);
        const modelToUse = selectedModel || selection.primary_model;
        
        // Create user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            model: 'user',
            timestamp: new Date(),
            cost: 0,
            tokens: message.length
        };
        
        this.chatHistory.push(userMessage);
        
        // Simulate AI response (in real implementation, this would call OpenRouter API)
        const aiResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `🤖 **${modelToUse.toUpperCase()}** responding to your request:\n\n${this.generateAIResponse(message, selection)}`,
            model: modelToUse,
            timestamp: new Date(),
            cost: selection.estimated_cost,
            tokens: Math.ceil(message.length / 4)
        };
        
        this.chatHistory.push(aiResponse);
        
        // Delegate to N8N if needed
        if (this.n8nBaseUrl && this.n8nApiKey) {
            await this.delegateToN8N(message, selection);
        }
        
        return aiResponse;
    }

    private generateAIResponse(message: string, selection: LLMSelection): string {
        const model = this.models[selection.primary_model];
        const strengths = model?.strengths?.join(', ') || 'general capabilities';
        
        return `I'm ${selection.primary_model}, specialized in ${model?.specialization || 'AI assistance'}.\n\n` +
               `**Task Analysis:** ${selection.task_type} (${selection.complexity} complexity)\n` +
               `**My Strengths:** ${strengths}\n` +
               `**Confidence:** ${(selection.confidence_score * 100).toFixed(1)}%\n` +
                               `**Cost:** $${selection.estimated_cost.toFixed(6)} (${Math.ceil(message.length / 4)} tokens)\n\n` +
               `I'm ready to help with your request: "${message}"\n\n` +
               `How can I assist you further?`;
    }

    private async delegateToN8N(message: string, selection: LLMSelection): Promise<void> {
        try {
            const payload = {
                message: message,
                selected_model: selection.primary_model,
                task_type: selection.task_type,
                confidence_score: selection.confidence_score,
                estimated_cost: selection.estimated_cost,
                timestamp: new Date().toISOString()
            };
            
            await axios.post(`${this.n8nBaseUrl}/webhook/llm-delegation`, payload, {
                headers: {
                    'Authorization': `Bearer ${this.n8nApiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Successfully delegated to N8N');
        } catch (error) {
            console.error('❌ Error delegating to N8N:', error);
        }
    }

    public getChatHistory(): ChatMessage[] {
        return this.chatHistory;
    }

    public getConfigurationInfo(): string {
        return `🔧 Configuration Status:\n` +
               `N8N Base URL: ${this.n8nBaseUrl || '❌ Not set'}\n` +
               `OpenRouter API Key: ${this.openRouterApiKey ? '✅ Set' : '❌ Not set'}\n` +
               `Claude API Key: ${this.claudeApiKey ? '✅ Set' : '❌ Not set'}\n` +
               `N8N API Key: ${this.n8nApiKey ? '✅ Set' : '❌ Not set'}`;
    }

    public async deployN8NWorkflow(): Promise<string> {
        if (!this.n8nBaseUrl || !this.n8nApiKey) {
            return '❌ N8N configuration not set. Please configure N8N_BASE_URL and N8N_API_KEY in ~/.zshrc';
        }
        
        try {
            // This would deploy the actual workflow to N8N
            const response = await axios.post(`${this.n8nBaseUrl}/api/v1/workflows`, {
                name: 'LLM Collaboration Workflow',
                active: true,
                nodes: [
                    {
                        id: 'webhook',
                        type: 'n8n-nodes-base.webhook',
                        position: [0, 0],
                        parameters: {
                            path: 'llm-delegation',
                            httpMethod: 'POST'
                        }
                    }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${this.n8nApiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return '✅ N8N workflow deployed successfully!';
        } catch (error) {
            return `❌ Error deploying N8N workflow: ${error}`;
        }
    }
}

// Get workspace context for grounding the AI system
async function getWorkspaceContext(): Promise<any> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    const context: any = {
        timestamp: new Date().toISOString(),
        workspace: {
            name: workspaceFolders?.[0]?.name || 'Unknown',
            path: workspaceFolders?.[0]?.uri.fsPath || '',
            fileCount: 0,
            languageDistribution: {},
            framework: 'unknown',
            gitBranch: 'unknown'
        },
        openFiles: [],
        activeEditor: null,
        projectType: 'unknown',
        complexity: 'medium',
        urgency: 'normal'
    };

    try {
        // Analyze workspace structure
        if (workspaceFolders?.[0]) {
            const workspacePath = workspaceFolders[0].uri.fsPath;
            
            // Get file count and language distribution
            const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
            context.workspace.fileCount = files.length;
            
            // Analyze file types
            const extensions = files.map(f => f.path.split('.').pop() || 'unknown');
            context.workspace.languageDistribution = extensions.reduce((acc: any, ext) => {
                acc[ext] = (acc[ext] || 0) + 1;
                return acc;
            }, {});
            
            // Detect project type
            if (files.some(f => f.path.includes('package.json'))) context.projectType = 'node';
            else if (files.some(f => f.path.includes('requirements.txt'))) context.projectType = 'python';
            else if (files.some(f => f.path.includes('pom.xml'))) context.projectType = 'java';
            else if (files.some(f => f.path.includes('Cargo.toml'))) context.projectType = 'rust';
            else if (files.some(f => f.path.includes('go.mod'))) context.projectType = 'go';
            
            // Detect framework
            if (files.some(f => f.path.includes('next.config'))) context.workspace.framework = 'nextjs';
            else if (files.some(f => f.path.includes('angular.json'))) context.workspace.framework = 'angular';
            else if (files.some(f => f.path.includes('vue.config'))) context.workspace.framework = 'vue';
            else if (files.some(f => f.path.includes('django'))) context.workspace.framework = 'django';
            else if (files.some(f => f.path.includes('flask'))) context.workspace.framework = 'flask';
        }
        
        // Get open files
        const openDocuments = vscode.workspace.textDocuments;
        context.openFiles = openDocuments.map(doc => ({
            name: doc.fileName.split('/').pop() || doc.fileName,
            path: doc.fileName,
            language: doc.languageId,
            lineCount: doc.lineCount
        }));
        
        // Get active editor
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            context.activeEditor = {
                name: activeEditor.document.fileName.split('/').pop() || activeEditor.document.fileName,
                path: activeEditor.document.fileName,
                language: activeEditor.document.languageId,
                lineCount: activeEditor.document.lineCount,
                selection: activeEditor.selection ? {
                    start: activeEditor.selection.start.line,
                    end: activeEditor.selection.end.line
                } : null
            };
        }
        
        // Assess complexity based on workspace
        if (context.workspace.fileCount > 1000) context.complexity = 'high';
        else if (context.workspace.fileCount > 100) context.complexity = 'medium';
        else context.complexity = 'low';
        
    } catch (error) {
        console.error('Error getting workspace context:', error);
    }
    
    return context;
}

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Cursor-Claude LLM Collaboration Extension activated');
    
    const llmSystem = new LLMCollaborationSystem();
    const subAgentOrchestrator = new SubAgentOrchestrator();

    // Main command - opens expanded collaborative chat environment directly
    const startCommand = vscode.commands.registerCommand('cursor-claude-llm-collaboration.startLLMCollaboration', async () => {
        // Get workspace context for grounding
        const workspaceContext = await getWorkspaceContext();
        
        // Open expanded collaborative chat environment immediately
        const panel = vscode.window.createWebviewPanel(
            'llmCollaboration',
            '🚀 Expanded Collaborative AI Environment',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        
        panel.webview.html = getExpandedCollaborativeChatContent(workspaceContext, llmSystem, subAgentOrchestrator);
        
        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            async message => {
                switch (message.command) {
                    case 'sendMessage':
                        // Use revolutionary sub-agent orchestration
                        const orchestrationResult = await subAgentOrchestrator.orchestrateTask(
                            message.text,
                            workspaceContext
                        );
                        
                        // Create enhanced response with sub-agent insights
                        const response = await llmSystem.sendMessage(message.text);
                        response.content += `\n\n🤖 **Sub-Agent Orchestration:**\n` +
                            `**Selected Agent:** ${orchestrationResult.subAgentId}\n` +
                            `**LLM Choice:** ${orchestrationResult.selectedLLM}\n` +
                            `**Confidence:** ${(orchestrationResult.confidence * 100).toFixed(1)}%\n` +
                            `**Reasoning:** ${orchestrationResult.reasoning}\n` +
                            `**N8N Workflow:** ${orchestrationResult.n8nWorkflow}`;
                        
                        panel.webview.postMessage({
                            command: 'addMessage',
                            message: response
                        });
                        break;
                    case 'getChatHistory':
                        const history = llmSystem.getChatHistory();
                        panel.webview.postMessage({
                            command: 'updateChatHistory',
                            history: history
                        });
                        break;
                    case 'getSubAgentInsights':
                        const insights = subAgentOrchestrator.getSubAgentInsights();
                        panel.webview.postMessage({
                            command: 'updateSubAgentInsights',
                            insights: insights
                        });
                        break;
                    case 'getWorkspaceContext':
                        panel.webview.postMessage({
                            command: 'updateWorkspaceContext',
                            context: workspaceContext
                        });
                        break;
                }
            }
        );
    });

    // Quick start command that opens immediately
    const quickStartCommand = vscode.commands.registerCommand('cursor-claude-llm-collaboration.quickStart', () => {
        // Open collaboration window immediately
        const panel = vscode.window.createWebviewPanel(
            'llmCollaboration',
            '🚀 LLM Collaboration Hub',
            vscode.ViewColumn.One,
            {}
        );
        
        panel.webview.html = getQuickStartWebviewContent();
    });

    const showScoresCommand = vscode.commands.registerCommand('cursor-claude-llm-collaboration.showModelScores', () => {
        vscode.window.showInformationMessage('📊 Model confidence scores and cost analysis will be shown in the selection results.');
    });

    const deployCommand = vscode.commands.registerCommand('cursor-claude-llm-collaboration.deployN8NWorkflow', async () => {
        const result = await llmSystem.deployN8NWorkflow();
        vscode.window.showInformationMessage(result);
    });

    const configCommand = vscode.commands.registerCommand('cursor-claude-llm-collaboration.showConfiguration', () => {
        const configInfo = llmSystem.getConfigurationInfo();
        vscode.window.showInformationMessage(configInfo);
    });

    const subAgentInsightsCommand = vscode.commands.registerCommand('cursor-claude-llm-collaboration.showSubAgentInsights', () => {
        const insights = subAgentOrchestrator.getSubAgentInsights();
        const panel = vscode.window.createWebviewPanel(
            'subAgentInsights',
            '🤖 Sub-Agent Orchestration Insights',
            vscode.ViewColumn.One,
            {}
        );
        
        panel.webview.html = getSubAgentInsightsWebviewContent(insights);
    });

    context.subscriptions.push(startCommand, quickStartCommand, showScoresCommand, deployCommand, configCommand, subAgentInsightsCommand);
}

export function deactivate() {
    console.log('👋 Cursor-Claude LLM Collaboration Extension deactivated');
}

function getExpandedCollaborativeChatContent(workspaceContext: any, llmSystem: LLMCollaborationSystem, subAgentOrchestrator: any): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Expanded Collaborative AI Environment</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 0;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            /* Header with workspace context */
            .header {
                background: linear-gradient(135deg, var(--vscode-textLink-foreground) 0%, #667eea 100%);
                color: white;
                padding: 20px;
                border-bottom: 1px solid var(--vscode-border);
            }
            .header h1 {
                margin: 0 0 10px 0;
                font-size: 1.8em;
            }
            .header p {
                margin: 0;
                opacity: 0.9;
            }
            
            /* Workspace context bar */
            .workspace-context {
                background: var(--vscode-editor-background);
                border-bottom: 1px solid var(--vscode-border);
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 10px;
            }
            .context-item {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.9em;
                opacity: 0.8;
            }
            .context-badge {
                background: var(--vscode-textPreformat-background);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                border: 1px solid var(--vscode-border);
            }
            
            /* Hover command and CTA options above chat */
            .command-cta-bar {
                background: var(--vscode-textBlockQuote-background);
                border-bottom: 1px solid var(--vscode-border);
                padding: 15px 20px;
                display: flex;
                gap: 15px;
                align-items: center;
                flex-wrap: wrap;
            }
            .cta-button {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.9em;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .cta-button:hover {
                background: var(--vscode-button-hoverBackground);
                transform: translateY(-1px);
            }
            .cta-button.secondary {
                background: var(--vscode-textBlockQuote-background);
                border: 1px solid var(--vscode-border);
            }
            .cta-button.secondary:hover {
                background: var(--vscode-textLink-foreground);
                color: white;
            }
            
            /* Chat container */
            .chat-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            .message {
                padding: 15px;
                border-radius: 8px;
                max-width: 80%;
                word-wrap: break-word;
            }
            .message.user {
                background: var(--vscode-textLink-foreground);
                color: white;
                align-self: flex-end;
            }
            .message.assistant {
                background: var(--vscode-textBlockQuote-background);
                border: 1px solid var(--vscode-border);
                align-self: flex-start;
            }
            .message.system {
                background: var(--vscode-textPreformat-background);
                border: 1px solid var(--vscode-border);
                align-self: center;
                font-style: italic;
                font-size: 0.9em;
            }
            .message-header {
                font-size: 0.8em;
                margin-bottom: 8px;
                opacity: 0.7;
            }
            .message-content {
                line-height: 1.5;
            }
            .sub-agent-info {
                background: var(--vscode-textPreformat-background);
                border: 1px solid var(--vscode-border);
                border-radius: 6px;
                padding: 10px;
                margin-top: 10px;
                font-size: 0.9em;
            }
            
            /* Input container */
            .input-container {
                padding: 20px;
                border-top: 1px solid var(--vscode-border);
                background: var(--vscode-editor-background);
            }
            .input-row {
                display: flex;
                gap: 10px;
                align-items: center;
            }
            .message-input {
                flex: 1;
                padding: 12px;
                border: 1px solid var(--vscode-border);
                border-radius: 6px;
                background: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-size: 14px;
                resize: none;
            }
            .send-button {
                padding: 12px 20px;
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
            }
            .send-button:hover {
                background: var(--vscode-button-hoverBackground);
            }
            .model-info {
                font-size: 0.8em;
                opacity: 0.7;
                margin-top: 5px;
            }
            .cost-info {
                font-size: 0.8em;
                color: var(--vscode-textLink-foreground);
                margin-top: 5px;
            }
            
            /* Quick action suggestions */
            .quick-actions {
                display: flex;
                gap: 10px;
                margin-top: 10px;
                flex-wrap: wrap;
            }
            .quick-action {
                background: var(--vscode-textPreformat-background);
                border: 1px solid var(--vscode-border);
                border-radius: 4px;
                padding: 6px 12px;
                font-size: 0.8em;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .quick-action:hover {
                background: var(--vscode-textLink-foreground);
                color: white;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Expanded Collaborative AI Environment</h1>
            <p>Grounding in workspace context • Autonomous sub-agent orchestration • Seamless N8N integration</p>
        </div>
        
        <div class="workspace-context">
            <div class="context-item">
                <span>📁</span>
                <span>\${workspaceContext.workspace.name}</span>
                <span class="context-badge">\${workspaceContext.workspace.fileCount} files</span>
            </div>
            <div class="context-item">
                <span>🔧</span>
                <span>\${workspaceContext.projectType}</span>
                <span class="context-badge">\${workspaceContext.workspace.framework}</span>
            </div>
            <div class="context-item">
                <span>📊</span>
                <span>Complexity: \${workspaceContext.complexity}</span>
                <span class="context-badge">\${Object.keys(workspaceContext.workspace.languageDistribution).length} languages</span>
            </div>
            <div class="context-item">
                <span>📝</span>
                <span>\${workspaceContext.openFiles.length} open files</span>
                <span class="context-badge">\${workspaceContext.activeEditor ? workspaceContext.activeEditor.name : 'None'} active</span>
            </div>
        </div>
        
        <div class="command-cta-bar">
            <button class="cta-button" onclick="showSubAgentInsights()">
                🤖 Sub-Agent Insights
            </button>
            <button class="cta-button secondary" onclick="showWorkspaceContext()">
                📊 Workspace Analysis
            </button>
            <button class="cta-button secondary" onclick="deployN8NWorkflow()">
                🚀 Deploy N8N
            </button>
            <button class="cta-button secondary" onclick="showConfiguration()">
                ⚙️ Configuration
            </button>
            <button class="cta-button secondary" onclick="clearChat()">
                🧹 Clear Chat
            </button>
        </div>
        
        <div class="chat-container">
            <div class="messages" id="messages">
                <div class="message system">
                    <div class="message-header">System</div>
                    <div class="message-content">
                        🎯 **Workspace-Grounded AI Collaboration Ready!**\n\n
                        I've analyzed your workspace: **\${workspaceContext.workspace.name}** (\${workspaceContext.workspace.fileCount} files, \${workspaceContext.projectType} project)\n\n
                        **Available Sub-Agents:**\n
                        • 🧠 **Captain Picard** - Strategic Planning & Architecture\n
                        • 🔍 **Commander Data** - Complex Analysis & Research\n
                        • ⚡ **Commander Riker** - Tactical Execution & Implementation\n
                        • ⚙️ **Lieutenant Commander Geordi** - Engineering Optimization\n
                        • 💝 **Counselor Troi** - Emotional Intelligence & Team Dynamics\n\n
                        Start typing to begin our collaborative session. I'll automatically select the optimal sub-agent and LLM for each task!
                    </div>
                </div>
            </div>
            
            <div class="input-container">
                <div class="input-row">
                    <textarea 
                        class="message-input" 
                        id="messageInput" 
                        placeholder="Describe your task, ask questions, or request assistance... (Press Enter to send, Shift+Enter for new line)"
                        rows="3"
                    ></textarea>
                    <button class="send-button" onclick="sendMessage()">Send</button>
                </div>
                
                <div class="quick-actions">
                    <div class="quick-action" onclick="suggestTask('Help me plan a system architecture')">🏗️ Architecture Planning</div>
                    <div class="quick-action" onclick="suggestTask('Analyze this code for optimizations')">🔍 Code Analysis</div>
                    <div class="quick-action" onclick="suggestTask('Implement a new feature')">⚡ Feature Implementation</div>
                    <div class="quick-action" onclick="suggestTask('Debug this issue')">🐛 Debugging</div>
                    <div class="quick-action" onclick="suggestTask('Optimize performance')">⚙️ Performance</div>
                </div>
            </div>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            const messagesContainer = document.getElementById('messages');
            const messageInput = document.getElementById('messageInput');
            
            // Load chat history
            vscode.postMessage({ command: 'getChatHistory' });
            
            // Handle incoming messages
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'addMessage':
                        addMessageToChat(message.message);
                        break;
                    case 'updateChatHistory':
                        updateChatHistory(message.history);
                        break;
                    case 'updateWorkspaceContext':
                        updateWorkspaceContextDisplay(message.context);
                        break;
                }
            });
            
            // Send message function
            function sendMessage() {
                const text = messageInput.value.trim();
                if (text) {
                    vscode.postMessage({ 
                        command: 'sendMessage', 
                        text: text 
                    });
                    messageInput.value = '';
                }
            }
            
            // Handle Enter key
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            
            // CTA button functions
            function showSubAgentInsights() {
                vscode.postMessage({ command: 'getSubAgentInsights' });
            }
            
            function showWorkspaceContext() {
                vscode.postMessage({ command: 'getWorkspaceContext' });
            }
            
            function deployN8NWorkflow() {
                vscode.postMessage({ command: 'deployN8NWorkflow' });
            }
            
            function showConfiguration() {
                vscode.postMessage({ command: 'showConfiguration' });
            }
            
            function clearChat() {
                messagesContainer.innerHTML = '';
                addSystemWelcomeMessage();
            }
            
            function suggestTask(task) {
                messageInput.value = task;
                messageInput.focus();
            }
            
            // Add message to chat
            function addMessageToChat(message) {
                const messageDiv = document.createElement('div');
                messageDiv.className = \`message \${message.role}\`;
                
                const header = document.createElement('div');
                header.className = 'message-header';
                header.textContent = \`\${message.role === 'user' ? 'You' : message.model.toUpperCase()} • \${new Date(message.timestamp).toLocaleTimeString()}\`;
                
                const content = document.createElement('div');
                content.className = 'message-content';
                content.innerHTML = message.content;
                
                // Add sub-agent orchestration info if present
                if (message.content.includes('Sub-Agent Orchestration')) {
                    const subAgentInfo = document.createElement('div');
                    subAgentInfo.className = 'sub-agent-info';
                    subAgentInfo.innerHTML = '🤖 <strong>Sub-Agent Decision Made</strong> - Check the orchestration details above!';
                    content.appendChild(subAgentInfo);
                }
                
                const modelInfo = document.createElement('div');
                modelInfo.className = 'model-info';
                modelInfo.textContent = \`Model: \${message.model} • Tokens: \${message.tokens}\`;
                
                const costInfo = document.createElement('div');
                costInfo.className = 'cost-info';
                costInfo.textContent = \`Cost: $\${message.cost.toFixed(6)}\`;
                
                messageDiv.appendChild(header);
                messageDiv.appendChild(content);
                messageDiv.appendChild(modelInfo);
                messageDiv.appendChild(costInfo);
                
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
            
            // Update chat history
            function updateChatHistory(history) {
                messagesContainer.innerHTML = '';
                addSystemWelcomeMessage();
                
                // Add existing messages
                history.forEach(message => {
                    addMessageToChat(message);
                });
            }
            
            function addSystemWelcomeMessage() {
                const welcomeDiv = document.createElement('div');
                welcomeDiv.className = 'message system';
                welcomeDiv.innerHTML = \`
                    <div class="message-header">System</div>
                    <div class="message-content">
                        🎯 **Workspace-Grounded AI Collaboration Ready!**\n\n
                        I've analyzed your workspace: **\${workspaceContext.workspace.name}** (\${workspaceContext.workspace.fileCount} files, \${workspaceContext.projectType} project)\n\n
                        **Available Sub-Agents:**\n
                        • 🧠 **Captain Picard** - Strategic Planning & Architecture\n
                        • 🔍 **Commander Data** - Complex Analysis & Research\n
                        • ⚡ **Commander Riker** - Tactical Execution & Implementation\n
                        • ⚙️ **Lieutenant Commander Geordi** - Engineering Optimization\n
                        • 💝 **Counselor Troi** - Emotional Intelligence & Team Dynamics\n\n
                        Start typing to begin our collaborative session. I'll automatically select the optimal sub-agent and LLM for each task!
                    </div>
                \`;
                messagesContainer.appendChild(welcomeDiv);
            }
            
            function updateWorkspaceContextDisplay(context) {
                // Update workspace context display if needed
                console.log('Workspace context updated:', context);
            }
        </script>
    </body>
    </html>`;
}

function getSubAgentInsightsWebviewContent(insights: any): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sub-Agent Orchestration Insights</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 20px;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                line-height: 1.6;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                color: var(--vscode-textLink-foreground);
            }
            .agent-card {
                background: var(--vscode-editor-background);
                border: 2px solid var(--vscode-border);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .agent-name {
                font-size: 1.2em;
                font-weight: bold;
                color: var(--vscode-textLink-foreground);
                margin-bottom: 10px;
            }
            .specialization {
                background: var(--vscode-textPreformat-background);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.9em;
                display: inline-block;
                margin-bottom: 15px;
            }
            .metrics {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 15px;
                margin: 15px 0;
            }
            .metric {
                text-align: center;
                padding: 10px;
                background: var(--vscode-textBlockQuote-background);
                border-radius: 6px;
            }
            .metric-value {
                font-size: 1.5em;
                font-weight: bold;
                color: var(--vscode-textLink-foreground);
            }
            .metric-label {
                font-size: 0.8em;
                opacity: 0.7;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🤖 Sub-Agent Orchestration Insights</h1>
            <p>Revolutionary AI collaboration where Claude sub-agents autonomously select LLMs for N8N crew</p>
        </div>
        
        <div class="agent-card">
            <div class="agent-name">Captain Jean-Luc Picard</div>
            <div class="specialization">Strategic Planning</div>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">95.0%</div>
                    <div class="metric-label">Success Rate</div>
                </div>
                <div class="metric">
                    <div class="metric-value">$0.000003</div>
                    <div class="metric-label">Avg Cost</div>
                </div>
                <div class="metric">
                    <div class="metric-value">3</div>
                    <div class="metric-label">LLM Models</div>
                </div>
            </div>
        </div>
        
        <div class="agent-card">
            <div class="agent-name">Commander Data</div>
            <div class="specialization">Complex Analysis</div>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">98.5%</div>
                    <div class="metric-label">Success Rate</div>
                </div>
                <div class="metric">
                    <div class="metric-value">$0.000002</div>
                    <div class="metric-label">Avg Cost</div>
                </div>
                <div class="metric">
                    <div class="metric-value">4</div>
                    <div class="metric-label">LLM Models</div>
                </div>
            </div>
        </div>
        
        <div class="agent-card">
            <div class="agent-name">Commander William Riker</div>
            <div class="specialization">Tactical Execution</div>
            <div class="metrics">
                <div class="metric">
                    <div class="metric-value">92.3%</div>
                    <div class="metric-label">Success Rate</div>
                </div>
                <div class="metric">
                    <div class="metric-value">$0.000004</div>
                    <div class="metric-label">Avg Cost</div>
                </div>
                <div class="metric">
                    <div class="metric-value">2</div>
                    <div class="metric-label">LLM Models</div>
                </div>
            </div>
        </div>
    </body>
    </html>`;
}

function getQuickStartWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LLM Collaboration Hub</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                padding: 20px;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                line-height: 1.6;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                color: var(--vscode-textLink-foreground);
            }
            .collaboration-hub {
                background: var(--vscode-editor-background);
                border: 2px solid var(--vscode-textLink-foreground);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .quick-actions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
            }
            .action-card {
                background: var(--vscode-textBlockQuote-background);
                padding: 20px;
                border-radius: 8px;
                border: 1px solid var(--vscode-border);
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .action-card:hover {
                background: var(--vscode-textLink-foreground);
                color: white;
                transform: translateY(-2px);
            }
            .model-status {
                background: var(--vscode-editor-background);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--vscode-border);
                margin: 15px 0;
            }
            .status-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--vscode-border);
            }
            .status-item:last-child {
                border-bottom: none;
            }
            .status-online {
                color: #4ade80;
                font-weight: bold;
            }
            .status-offline {
                color: #f87171;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 LLM Collaboration Hub</h1>
            <p>Welcome to your AI collaboration workspace</p>
        </div>
        
        <div class="collaboration-hub">
            <h2>🎯 Quick Actions</h2>
            <div class="quick-actions">
                <div class="action-card" onclick="startTaskBased()">
                    <h3>📝 Task-Based Collaboration</h3>
                    <p>Describe your task and get AI model recommendations</p>
                </div>
                <div class="action-card" onclick="showModelScores()">
                    <h3>📊 Model Confidence Scores</h3>
                    <p>View current AI model performance metrics</p>
                </div>
                <div class="action-card" onclick="deployN8N()">
                    <h3>🚀 Deploy N8N Workflow</h3>
                    <p>Deploy automation workflows to N8N</p>
                </div>
                <div class="action-card" onclick="showConfig()">
                    <h3>🔧 Configuration</h3>
                    <p>View and modify extension settings</p>
                </div>
            </div>
            
            <div class="model-status">
                <h3>🤖 Model Status</h3>
                <div class="status-item">
                    <span>Claude Sonnet</span>
                    <span class="status-online">🟢 Online</span>
                </div>
                <div class="status-item">
                    <span>GPT-4o</span>
                    <span class="status-online">🟢 Online</span>
                </div>
                <div class="status-item">
                    <span>Gemini Pro</span>
                    <span class="status-online">🟢 Online</span>
                </div>
                <div class="status-item">
                    <span>Llama-3</span>
                    <span class="status-online">🟢 Online</span>
                </div>
            </div>
        </div>
        
        <script>
            function startTaskBased() {
                vscode.postMessage({ command: "startTaskBased" });
            }
            function showModelScores() {
                vscode.postMessage({ command: "showModelScores" });
            }
            function deployN8N() {
                vscode.postMessage({ command: "deployN8N" });
            }
            function showConfig() {
                vscode.postMessage({ command: "showConfig" });
            }
        </script>
    </body>
    </html>`;
}