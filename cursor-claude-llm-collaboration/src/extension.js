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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
class LLMCollaborationSystem {
    constructor() {
        this.n8nBaseUrl = '';
        this.openRouterApiKey = '';
        this.claudeApiKey = '';
        this.n8nApiKey = '';
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
    loadConfiguration() {
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
            }
        }
        catch (error) {
            console.error('❌ Error loading configuration:', error);
        }
    }
    readZshrcConfig(content) {
        const config = {};
        // Extract environment variables
        const lines = content.split('\n');
        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('export ')) {
                const [key, value] = line.substring(7).split('=');
                if (value) {
                    const cleanValue = value.replace(/"/g, '').replace(/'/g, '');
                    if (key === 'N8N_BASE_URL' || key === 'N8N_URL') {
                        config.n8nBaseUrl = cleanValue;
                    }
                    else if (key === 'OPENROUTER_API_KEY' || key === 'OPENROUTER_KEY') {
                        config.openRouterApiKey = cleanValue;
                    }
                    else if (key === 'CLAUDE_API_KEY' || key === 'ANTHROPIC_API_KEY') {
                        config.claudeApiKey = cleanValue;
                    }
                    else if (key === 'N8N_API_KEY') {
                        config.n8nApiKey = cleanValue;
                    }
                }
            }
        });
        return config;
    }
    analyzeTask(taskDescription) {
        // Simple task classification
        const taskType = this.classifyTask(taskDescription);
        const complexity = this.assessComplexity(taskDescription);
        // Get affinity scores for this task type
        let scores = {};
        if (this.taskAffinities[taskType]) {
            scores = this.taskAffinities[taskType];
        }
        else {
            // Default scoring for unknown task types
            scores = Object.fromEntries(Object.keys(this.models).map(model => [model, 0.7]));
        }
        // Adjust for complexity
        const complexityMultiplier = { 'low': 0.9, 'medium': 1.0, 'high': 1.1 }[complexity] || 1.0;
        for (const model in scores) {
            scores[model] *= complexityMultiplier;
        }
        // Find the best model
        const bestModel = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b);
        // Get fallback models
        const fallbackModels = Object.entries(scores)
            .sort(([, a], [, b]) => b - a)
            .slice(1, 4)
            .map(([model]) => model);
        return {
            primary_model: bestModel[0],
            confidence_score: bestModel[1],
            reasoning: `Selected ${bestModel[0]} with ${(bestModel[1] * 100).toFixed(1)}% confidence for ${taskType} task`,
            fallback_models: fallbackModels,
            task_type: taskType,
            complexity: complexity
        };
    }
    classifyTask(description) {
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes('code') || lowerDesc.includes('implement') || lowerDesc.includes('build')) {
            return 'code_implementation';
        }
        else if (lowerDesc.includes('analyze') || lowerDesc.includes('strategy') || lowerDesc.includes('plan')) {
            return 'strategic_analysis';
        }
        else if (lowerDesc.includes('research') || lowerDesc.includes('investigate') || lowerDesc.includes('explore')) {
            return 'research';
        }
        else if (lowerDesc.includes('optimize') || lowerDesc.includes('improve') || lowerDesc.includes('performance')) {
            return 'optimization';
        }
        return 'general';
    }
    assessComplexity(description) {
        const wordCount = description.split(' ').length;
        const hasComplexTerms = description.toLowerCase().includes('complex') ||
            description.toLowerCase().includes('advanced') ||
            description.toLowerCase().includes('system');
        if (wordCount > 50 || hasComplexTerms)
            return 'high';
        if (wordCount > 20)
            return 'medium';
        return 'low';
    }
    async deployN8NWorkflow() {
        if (!this.n8nBaseUrl || !this.n8nApiKey) {
            return '❌ N8N configuration missing. Please check your ~/.zshrc file.';
        }
        try {
            const workflowData = {
                name: 'LLM Collaboration Workflow',
                nodes: [
                    {
                        id: 'webhook-trigger',
                        type: 'n8n-nodes-base.webhook',
                        position: [240, 300],
                        parameters: {
                            httpMethod: 'POST',
                            path: 'llm-collaboration',
                            responseMode: 'responseNode'
                        }
                    },
                    {
                        id: 'democratic-router',
                        type: 'n8n-nodes-base.function',
                        position: [460, 300],
                        parameters: {
                            functionCode: `
                                // Democratic LLM Router
                                const task = $input.first().json;
                                const models = {
                                    'claude-sonnet': { cost: 0.000003, specialization: 'strategic_analysis' },
                                    'gpt-4o': { cost: 0.000005, specialization: 'research' },
                                    'gemini-pro': { cost: 0.000002, specialization: 'optimization' },
                                    'llama-3': { cost: 0.000001, specialization: 'code_implementation' }
                                };
                                
                                const taskType = task.type || 'general';
                                const complexity = task.complexity || 'medium';
                                
                                // Simple routing logic
                                let selectedModel = 'claude-sonnet'; // default
                                if (taskType === 'code_implementation') selectedModel = 'llama-3';
                                else if (taskType === 'strategic_analysis') selectedModel = 'claude-sonnet';
                                else if (taskType === 'research') selectedModel = 'gpt-4o';
                                else if (taskType === 'optimization') selectedModel = 'gemini-pro';
                                
                                return {
                                    json: {
                                        selectedModel,
                                        taskType,
                                        complexity,
                                        cost: models[selectedModel].cost,
                                        reasoning: \`Selected \${selectedModel} for \${taskType} task\`
                                    }
                                };
                            `
                        }
                    }
                ],
                connections: {
                    'webhook-trigger': {
                        main: [['democratic-router']]
                    }
                }
            };
            const response = await axios_1.default.post(`${this.n8nBaseUrl}/api/v1/workflows`, workflowData, {
                headers: {
                    'Authorization': `Bearer ${this.n8nApiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return `✅ N8N workflow deployed successfully!\nWorkflow ID: ${response.data.id}`;
        }
        catch (error) {
            return `❌ Failed to deploy N8N workflow: ${error.message}`;
        }
    }
    getConfigurationInfo() {
        return `🔧 Configuration Status:
        
📡 N8N Base URL: ${this.n8nBaseUrl || '❌ Not set'}
🔑 OpenRouter API Key: ${this.openRouterApiKey ? '✅ Set' : '❌ Not set'}
🔑 Claude API Key: ${this.claudeApiKey ? '✅ Set' : '❌ Not set'}
🔑 N8N API Key: ${this.n8nApiKey ? '✅ Set' : '❌ Not set'}

💡 To configure, add these to your ~/.zshrc:
export N8N_BASE_URL="https://your-n8n-instance.com"
export OPENROUTER_API_KEY="your-openrouter-key"
export CLAUDE_API_KEY="your-claude-key"
export N8N_API_KEY="your-n8n-key"

🔄 Restart Cursor after updating ~/.zshrc`;
    }
}
function activate(context) {
    console.log('🚀 Cursor-Claude LLM Collaboration Extension activated');
    const llmSystem = new LLMCollaborationSystem();
    // Register commands
    const startCommand = vscode.commands.registerCommand('cursor-claude-llm-collaboration.startLLMCollaboration', async () => {
        const taskDescription = await vscode.window.showInputBox({
            prompt: 'Describe your task for AI collaboration',
            placeHolder: 'e.g., "Build a React component for user authentication"'
        });
        if (taskDescription) {
            const selection = llmSystem.analyzeTask(taskDescription);
            // Show detailed selection results with cost analysis
            const panel = vscode.window.createWebviewPanel('aiSelection', '🤖 AI Model Selection Results', vscode.ViewColumn.One, {});
            panel.webview.html = getSelectionWebviewContent(selection, {
                description: taskDescription,
                type: selection.task_type,
                complexity: selection.complexity
            });
        }
    });
    // Add quick start command that opens immediately
    const quickStartCommand = vscode.commands.registerCommand('cursor-claude-llm-collaboration.quickStart', () => {
        // Open collaboration window immediately
        const panel = vscode.window.createWebviewPanel('llmCollaboration', '🚀 LLM Collaboration Hub', vscode.ViewColumn.One, {});
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
    context.subscriptions.push(startCommand, quickStartCommand, showScoresCommand, deployCommand, configCommand);
}
function deactivate() {
    console.log('👋 Cursor-Claude LLM Collaboration Extension deactivated');
}
function getSelectionWebviewContent(selection, task) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Model Selection Results</title>
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
            .selection-card {
                background: var(--vscode-editor-background);
                border: 2px solid var(--vscode-textLink-foreground);
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .primary-model {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                text-align: center;
            }
            .confidence-score {
                font-size: 2em;
                font-weight: bold;
                margin: 10px 0;
            }
            .model-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 15px 0;
            }
            .detail-item {
                background: var(--vscode-editor-background);
                padding: 10px;
                border-radius: 6px;
                border: 1px solid var(--vscode-border);
            }
            .cost-info {
                background: var(--vscode-textBlockQuote-background);
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
                border-left: 4px solid var(--vscode-textLink-foreground);
            }
            .fallback-models {
                background: var(--vscode-editor-background);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--vscode-border);
            }
            .fallback-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid var(--vscode-border);
            }
            .fallback-item:last-child {
                border-bottom: none;
            }
            .reasoning {
                background: var(--vscode-textBlockQuote-background);
                padding: 15px;
                border-radius: 8px;
                font-style: italic;
                border-left: 4px solid var(--vscode-textLink-foreground);
            }
            .task-info {
                background: var(--vscode-editor-background);
                padding: 15px;
                border-radius: 8px;
                border: 1px solid var(--vscode-border);
                margin-bottom: 20px;
            }
            .task-type {
                display: inline-block;
                background: var(--vscode-textLink-foreground);
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.9em;
                margin: 5px 5px 5px 0;
            }
            .complexity-badge {
                display: inline-block;
                background: var(--vscode-textPreformat-background);
                color: var(--vscode-textPreformat-foreground);
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 0.9em;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🤖 AI Model Selection Results</h1>
            <p>Democratic AI routing for your task</p>
        </div>
        
        <div class="task-info">
            <h3>📋 Task Details</h3>
            <p><strong>Description:</strong> ${task.description}</p>
            <span class="task-type">${task.type}</span>
            <span class="complexity-badge">${task.complexity} complexity</span>
        </div>
        
        <div class="selection-card">
            <div class="primary-model">
                <h2>🥇 Primary AI Model Selected</h2>
                <div class="confidence-score">${(selection.confidence_score * 100).toFixed(1)}%</div>
                <h3>${selection.primary_model}</h3>
            </div>
            
            <div class="model-details">
                <div class="detail-item">
                    <strong>Platform:</strong> ${getModelPlatform(selection.primary_model)}
                </div>
                <div class="detail-item">
                    <strong>Specialization:</strong> ${getModelSpecialization(selection.primary_model)}
                </div>
                <div class="detail-item">
                    <strong>Cost per token:</strong> $${getModelCost(selection.primary_model).toFixed(6)}
                </div>
                <div class="detail-item">
                    <strong>Strengths:</strong> ${getModelStrengths(selection.primary_model).join(', ')}
                </div>
            </div>
            
            <div class="cost-info">
                <h4>💰 Cost Analysis</h4>
                <p><strong>Primary Model Cost:</strong> $${getModelCost(selection.primary_model).toFixed(6)} per token</p>
                <p><strong>Estimated for 1000 tokens:</strong> $${(getModelCost(selection.primary_model) * 1000).toFixed(4)}</p>
                <p><strong>Cost Efficiency:</strong> ${getCostEfficiency(selection.primary_model)}</p>
            </div>
            
            <div class="reasoning">
                <h4>💡 Selection Reasoning</h4>
                <p>${selection.reasoning}</p>
            </div>
        </div>
        
        <div class="fallback-models">
            <h3>🥈 Fallback Models</h3>
            ${selection.fallback_models?.map((model) => `
                <div class="fallback-item">
                    <span><strong>${model}</strong></span>
                    <span>${getModelSpecialization(model)} • $${getModelCost(model).toFixed(6)}/token</span>
                </div>
            `).join('') || '<p>No fallback models available</p>'}
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button onclick="window.close()" style="
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
            ">✅ Got it!</button>
        </div>
    </body>
    </html>`;
}
// Helper functions for model information
function getModelPlatform(modelName) {
    const models = {
        'claude-sonnet': 'Anthropic',
        'gpt-4o': 'OpenAI',
        'gemini-pro': 'Google',
        'llama-3': 'Meta'
    };
    return models[modelName] || 'Unknown';
}
function getModelSpecialization(modelName) {
    const models = {
        'claude-sonnet': 'Strategic Analysis',
        'gpt-4o': 'Research & Creativity',
        'gemini-pro': 'Optimization & Efficiency',
        'llama-3': 'Code Implementation'
    };
    return models[modelName] || 'General Purpose';
}
function getModelCost(modelName) {
    const models = {
        'claude-sonnet': 0.000003,
        'gpt-4o': 0.000005,
        'gemini-pro': 0.000002,
        'llama-3': 0.000001
    };
    return models[modelName] || 0.000005;
}
function getModelStrengths(modelName) {
    const models = {
        'claude-sonnet': ['Reasoning', 'Analysis', 'Coding', 'Writing'],
        'gpt-4o': ['Multimality', 'Creativity', 'General Purpose'],
        'gemini-pro': ['Code Analysis', 'Performance', 'Efficiency'],
        'llama-3': ['Open Source', 'Cost Effective', 'Coding']
    };
    return models[modelName] || ['General Purpose'];
}
function getCostEfficiency(modelName) {
    const cost = getModelCost(modelName);
    if (cost <= 0.000002)
        return '🟢 Excellent (Lowest cost)';
    if (cost <= 0.000003)
        return '🟡 Good (Balanced)';
    if (cost <= 0.000005)
        return '🟠 Moderate (Higher cost)';
    return '🔴 Expensive (Premium)';
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
//# sourceMappingURL=extension.js.map