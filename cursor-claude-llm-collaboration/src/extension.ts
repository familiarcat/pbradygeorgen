import * as vscode from 'vscode';
import axios from 'axios';

// Types based on the working Python system
interface CollaborationTask {
    type: string;
    complexity: 'low' | 'medium' | 'high';
    description: string;
    context?: Record<string, any>;
}

interface AISelection {
    primary_model: string;
    confidence_score: number;
    reasoning: string;
    fallback_models?: string[];
}

interface ModelConfig {
    platform: string;
    openrouter_id: string;
    cost_per_token: number;
    specialization: string;
    strengths: string[];
}

class LLMCollaborationSystem {
    private n8nBaseUrl: string;
    private openRouterApiKey: string;
    private claudeApiKey: string;

    constructor() {
        const config = vscode.workspace.getConfiguration('cursor-claude');
        this.n8nBaseUrl = config.get('n8nBaseUrl', 'https://n8n.pbradygeorgen.com');
        this.openRouterApiKey = config.get('openRouterApiKey', '');
        this.claudeApiKey = config.get('claudeApiKey', '');
    }

    // AI model configurations from the working Python system
    private models: Record<string, ModelConfig> = {
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
    private taskAffinities: Record<string, Record<string, number>> = {
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
            'llama-3': 0.85,
            'claude-sonnet': 0.80,
            'gpt-4o': 0.75
        }
    };

    async analyzeTask(task: CollaborationTask): Promise<AISelection> {
        vscode.window.showInformationMessage(`🤖 Analyzing task: ${task.description}`);
        
        // Get task affinity scores
        const scores = this.taskAffinities[task.type] || {};
        
        // Adjust for complexity
        const complexityMultiplier = {
            'low': 0.9,
            'medium': 1.0,
            'high': 1.1
        }[task.complexity] || 1.0;

        // Apply complexity adjustment and cost considerations
        Object.keys(scores).forEach(modelName => {
            if (this.models[modelName]) {
                scores[modelName] *= complexityMultiplier;
                
                // Cost efficiency bonus
                const costEfficiency = 1 / (this.models[modelName].cost_per_token * 1000000);
                scores[modelName] += costEfficiency * 0.1;
            }
        });

        // Find the best model
        const bestModel = Object.entries(scores)
            .sort(([,a], [,b]) => b - a)[0];

        if (!bestModel) {
            throw new Error('No suitable model found for this task');
        }

        return {
            primary_model: bestModel[0],
            confidence_score: bestModel[1],
            reasoning: `Selected ${bestModel[0]} for ${task.type} task with ${task.complexity} complexity`,
            fallback_models: Object.entries(scores)
                .filter(([model]) => model !== bestModel[0])
                .sort(([,a], [,b]) => b - a)
                .slice(0, 2)
                .map(([model]) => model)
        };
    }

    async deployN8NWorkflow(): Promise<boolean> {
        try {
            vscode.window.showInformationMessage('🚀 Deploying N8N workflow...');
            
            // This would integrate with your existing N8N deployment system
            const response = await axios.post(`${this.n8nBaseUrl}/api/v1/workflows`, {
                name: "LLM_Democratic_Collaboration",
                // Add workflow configuration here
            });

            if (response.status === 200 || response.status === 201) {
                vscode.window.showInformationMessage('✅ N8N workflow deployed successfully!');
                return true;
            } else {
                throw new Error(`Deployment failed: ${response.status}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`❌ N8N deployment failed: ${error}`);
            return false;
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Cursor-Claude LLM Collaboration Extension is now active!');

    const llmSystem = new LLMCollaborationSystem();

    // Register commands
    const startCollaborationCommand = vscode.commands.registerCommand(
        'cursor-claude.startLLMCollaboration',
        async () => {
            const taskDescription = await vscode.window.showInputBox({
                prompt: 'Describe the task you want to collaborate on:',
                placeHolder: 'e.g., Implement a React component with TypeScript'
            });

            if (!taskDescription) return;

            const task: CollaborationTask = {
                type: 'code_implementation', // Default, could be made configurable
                complexity: 'medium',
                description: taskDescription
            };

            try {
                const selection = await llmSystem.analyzeTask(task);
                
                // Create and show the collaboration panel
                const panel = vscode.window.createWebviewPanel(
                    'llmCollaboration',
                    'LLM Collaboration',
                    vscode.ViewColumn.One,
                    {}
                );

                panel.webview.html = getCollaborationWebviewContent(selection, task);
            } catch (error) {
                vscode.window.showErrorMessage(`❌ Collaboration failed: ${error}`);
            }
        }
    );

    const democraticSelectionCommand = vscode.commands.registerCommand(
        'cursor-claude.democraticSelection',
        () => {
            vscode.window.showInformationMessage(
                '🗳️ Democratic LLM selection is active! The system automatically chooses the best AI model for each task.'
            );
        }
    );

    const showModelScoresCommand = vscode.commands.registerCommand(
        'cursor-claude.showModelScores',
        () => {
            vscode.window.showInformationMessage(
                '📊 Model confidence scores are calculated automatically during task analysis.'
            );
        }
    );

    const deployN8NCommand = vscode.commands.registerCommand(
        'cursor-claude.deployN8NWorkflow',
        async () => {
            const success = await llmSystem.deployN8NWorkflow();
            if (success) {
                vscode.window.showInformationMessage('🚀 N8N workflow deployment completed!');
            }
        }
    );

    // Register webview provider
    const collaborationProvider = vscode.window.registerWebviewViewProvider(
        'llm-collaboration-panel',
        {
            resolveWebviewView(webviewView: vscode.WebviewView) {
                webviewView.webview.html = getPanelWebviewContent();
            }
        }
    );

    // Register all subscriptions
    context.subscriptions.push(
        startCollaborationCommand,
        democraticSelectionCommand,
        showModelScoresCommand,
        deployN8NCommand,
        collaborationProvider
    );

    // Show activation message
    vscode.window.showInformationMessage(
        '🚀 Cursor-Claude LLM Collaboration activated! Use "Start LLM Collaboration" to begin.'
    );
}

function getCollaborationWebviewContent(selection: AISelection, task: CollaborationTask): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LLM Collaboration</title>
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
            .task-info {
                background: var(--vscode-input-background);
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            .selection-result {
                background: var(--vscode-textBlockQuote-background);
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid var(--vscode-textLink-foreground);
            }
            .model-scores {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-top: 20px;
            }
            .score-card {
                background: var(--vscode-input-background);
                padding: 15px;
                border-radius: 6px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 LLM Collaboration</h1>
            <p>Democratic AI model selection for optimal task execution</p>
        </div>
        
        <div class="task-info">
            <h3>📋 Task Details</h3>
            <p><strong>Description:</strong> ${task.description}</p>
            <p><strong>Type:</strong> ${task.type}</p>
            <p><strong>Complexity:</strong> ${task.complexity}</p>
        </div>
        
        <div class="selection-result">
            <h3>🎯 AI Model Selection</h3>
            <p><strong>Primary Model:</strong> ${selection.primary_model}</p>
            <p><strong>Confidence Score:</strong> ${(selection.confidence_score * 100).toFixed(1)}%</p>
            <p><strong>Reasoning:</strong> ${selection.reasoning}</p>
        </div>
        
        <div class="model-scores">
            <h3>📊 Model Confidence Scores</h3>
            <div class="score-card">
                <h4>🥇 ${selection.primary_model}</h4>
                <p>${(selection.confidence_score * 100).toFixed(1)}%</p>
            </div>
            ${selection.fallback_models?.map(model => `
                <div class="score-card">
                    <h4>🥈 ${model}</h4>
                    <p>Fallback option</p>
                </div>
            `).join('') || ''}
        </div>
    </body>
    </html>`;
}

function getPanelWebviewContent(): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LLM Collaboration Panel</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 15px;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
            }
            .panel-header {
                text-align: center;
                margin-bottom: 20px;
                color: var(--vscode-textLink-foreground);
            }
            .quick-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .action-button {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 10px;
                border-radius: 6px;
                cursor: pointer;
                text-align: center;
            }
            .action-button:hover {
                background: var(--vscode-button-hoverBackground);
            }
        </style>
    </head>
    <body>
        <div class="panel-header">
            <h3>🤖 LLM Collaboration</h3>
            <p>Quick Actions</p>
        </div>
        
        <div class="quick-actions">
            <button class="action-button" onclick="startCollaboration()">
                🚀 Start Collaboration
            </button>
            <button class="action-button" onclick="showScores()">
                📊 Show Scores
            </button>
            <button class="action-button" onclick="deployWorkflow()">
                🚀 Deploy N8N
            </button>
        </div>
        
        <script>
            function startCollaboration() {
                vscode.postMessage({ command: 'startCollaboration' });
            }
            function showScores() {
                vscode.postMessage({ command: 'showScores' });
            }
            function deployWorkflow() {
                vscode.postMessage({ command: 'deployWorkflow' });
            }
        </script>
    </body>
    </html>`;
}

export function deactivate() {
    console.log('👋 Cursor-Claude LLM Collaboration Extension deactivated');
}
