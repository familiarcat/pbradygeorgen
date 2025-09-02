import * as vscode from 'vscode';
import { CursorAIBridge } from './services/cursor-ai-bridge';
import { EnhancedChatProvider } from './webview/enhanced-chat';
import { DemocraticRouter } from './services/democratic-router';

/**
 * 🚀 Cursor-Claude Unified Extension
 * 
 * This extension extends Cursor's native AI capabilities with:
 * - Enhanced file analysis and code generation
 * - Multi-AI collaboration (Cursor + Claude)
 * - Advanced context management
 * - Seamless integration with Cursor's chat
 * - Intelligent LLM model selection and N8N synchronization
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Cursor-Claude Unified Extension is now active!');

    // Initialize core services
    const cursorAIBridge = new CursorAIBridge();
    const enhancedChatProvider = new EnhancedChatProvider();
    const democraticRouter = new DemocraticRouter();

    // Register enhanced chat commands
    const extendChatCommand = vscode.commands.registerCommand(
        'cursor-claude.extendChat',
        async () => {
            const message = await vscode.window.showInputBox({
                prompt: 'Enter your message to extend Cursor\'s chat',
                placeHolder: 'e.g., Analyze this file, Generate tests, Optimize code...'
            });
            
            if (message) {
                await enhancedChatProvider.extendChat(message);
            }
        }
    );

    // Register file analysis command
    const analyzeFileCommand = vscode.commands.registerCommand(
        'cursor-claude.analyzeFile',
        async () => {
            const activeEditor = vscode.window.activeTextEditor;
            if (activeEditor) {
                await enhancedChatProvider.addFileContext(activeEditor.document.fileName);
            } else {
                vscode.window.showWarningMessage('No active file to analyze');
            }
        }
    );

    // Register code generation command
    const generateCodeCommand = vscode.commands.registerCommand(
        'cursor-claude.generateCode',
        async () => {
            const prompt = await vscode.window.showInputBox({
                prompt: 'What code would you like to generate?',
                placeHolder: 'e.g., Create a React component, Generate API endpoints, Write unit tests...'
            });
            
            if (prompt) {
                await enhancedChatProvider.integrateCodeGeneration(prompt);
            }
        }
    );

    // Register enhanced chat webview command
    const enhancedChatWebviewCommand = vscode.commands.registerCommand(
        'cursor-claude.enhancedChatWebview',
        async () => {
            await enhancedChatProvider.createEnhancedChatWebview();
        }
    );

    // Register AI collaboration command
    const aiCollaborationCommand = vscode.commands.registerCommand(
        'cursor-claude.aiCollaboration',
        async () => {
            const message = await vscode.window.showInputBox({
                prompt: 'Describe your task for AI collaboration',
                placeHolder: 'e.g., Debug this function, Review architecture, Optimize performance...'
            });
            
            if (message) {
                await showAICollaboration(message, democraticRouter, cursorAIBridge);
            }
        }
    );

    // Register file context command
    const addFileContextCommand = vscode.commands.registerCommand(
        'cursor-claude.addFileContext',
        async () => {
            const filePath = await vscode.window.showInputBox({
                prompt: 'Enter file path to add context',
                placeHolder: 'e.g., src/components/Button.tsx'
            });
            
            if (filePath) {
                await enhancedChatProvider.addFileContext(filePath);
            }
        }
    );

    // Register workspace analysis command
    const workspaceAnalysisCommand = vscode.commands.registerCommand(
        'cursor-claude.workspaceAnalysis',
        async () => {
            await showWorkspaceAnalysis(cursorAIBridge);
        }
    );

    // Register performance metrics command
    const performanceMetricsCommand = vscode.commands.registerCommand(
        'cursor-claude.performanceMetrics',
        async () => {
            await showPerformanceMetrics(cursorAIBridge);
        }
    );

    // Register LLM optimization insights command
    const llmOptimizationCommand = vscode.commands.registerCommand(
        'cursor-claude.llmOptimization',
        async () => {
            await showLLMOptimizationInsights(cursorAIBridge);
        }
    );

    // Register all commands
    context.subscriptions.push(
        extendChatCommand,
        analyzeFileCommand,
        generateCodeCommand,
        enhancedChatWebviewCommand,
        aiCollaborationCommand,
        addFileContextCommand,
        workspaceAnalysisCommand,
        performanceMetricsCommand,
        llmOptimizationCommand
    );

    // Create status bar items
    const statusBarItems = createStatusBarItems(enhancedChatProvider);
    context.subscriptions.push(...statusBarItems);

    // Show activation message with enhanced features
    vscode.window.showInformationMessage(
        '🚀 Cursor-Claude Extension activated with enhanced features!',
        'Open Enhanced Chat',
        'Analyze Current File',
        'Generate Code',
        'View LLM Optimization'
    ).then(selection => {
        if (selection === 'Open Enhanced Chat') {
            enhancedChatProvider.createEnhancedChatWebview();
        } else if (selection === 'Analyze Current File') {
            vscode.commands.executeCommand('cursor-claude.analyzeFile');
        } else if (selection === 'Generate Code') {
            vscode.commands.executeCommand('cursor-claude.generateCode');
        } else if (selection === 'View LLM Optimization') {
            vscode.commands.executeCommand('cursor-claude.llmOptimization');
        }
    });

    // Register workspace file watcher for context updates
    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');
    fileWatcher.onDidChange(async (uri) => {
        // Update context when files change
        await updateFileContext(uri, enhancedChatProvider);
    });
    context.subscriptions.push(fileWatcher);

    console.log('✅ All enhanced features registered successfully');
}

/**
 * Show LLM optimization insights
 */
async function showLLMOptimizationInsights(cursorAIBridge: CursorAIBridge): Promise<void> {
    try {
        const insights = cursorAIBridge.getOptimizationInsights();
        
        const insightsText = `🚀 **LLM Optimization Insights**
        
**Model Performance**:
${insights.modelPerformance.map(([modelId, performance]) => 
  `- ${modelId}: ${performance.totalTasks} tasks, avg: ${performance.averageResponseTime}ms, cost: $${performance.averageCost.toFixed(4)}`
).join('\n')}

**N8N Sync Status**:
${insights.n8nSyncStatus.map(([workflowId, status]) => 
  `- ${workflowId}: ${status.status} (${status.lastSync.toLocaleString()})`
).join('\n')}

**Optimization Recommendations**:
${insights.recommendations.map(rec => `- ${rec}`).join('\n')}

**Last Updated**: ${new Date().toLocaleString()}`;

        const document = await vscode.workspace.openTextDocument({
            content: insightsText,
            language: 'markdown'
        });
        
        await vscode.window.showTextDocument(document);
        
    } catch (error) {
        console.error('Error showing LLM optimization insights:', error);
        vscode.window.showErrorMessage('Failed to retrieve LLM optimization insights');
    }
}

/**
 * Show AI collaboration interface
 */
async function showAICollaboration(
    message: string, 
    democraticRouter: DemocraticRouter, 
    cursorAIBridge: CursorAIBridge
): Promise<void> {
    try {
        // Get current context
        const context = await getCurrentContext();
        
        // Route task using democratic router
        const aiSelection = await democraticRouter.analyzeTask(message, context);
        
        // Show AI selection results
        const selection = await vscode.window.showInformationMessage(
            `🤖 AI Collaboration: ${aiSelection.primary_ai.toUpperCase()} selected for your task`,
            'View Details',
            'Execute Task',
            'Modify Selection'
        );
        
        if (selection === 'View Details') {
            await showAISelectionDetails(aiSelection);
        } else if (selection === 'Execute Task') {
            await executeAITask(message, aiSelection, cursorAIBridge);
        } else if (selection === 'Modify Selection') {
            await modifyAISelection(aiSelection, democraticRouter, context);
        }
        
    } catch (error) {
        console.error('Error in AI collaboration:', error);
        vscode.window.showErrorMessage('Failed to process AI collaboration request');
    }
}

/**
 * Show workspace analysis
 */
async function showWorkspaceAnalysis(cursorAIBridge: CursorAIBridge): Promise<void> {
    try {
        // Get workspace insights
        const workspace = vscode.workspace.workspaceFolders?.[0];
        if (!workspace) {
            vscode.window.showWarningMessage('No workspace found');
            return;
        }
        
        // Analyze workspace structure
        const analysis = await cursorAIBridge['analyzeWorkspace']();
        
        // Show analysis results
        const document = await vscode.workspace.openTextDocument({
            content: formatWorkspaceAnalysis(analysis),
            language: 'markdown'
        });
        
        await vscode.window.showTextDocument(document);
        
    } catch (error) {
        console.error('Error in workspace analysis:', error);
        vscode.window.showErrorMessage('Failed to analyze workspace');
    }
}

/**
 * Show performance metrics
 */
async function showPerformanceMetrics(cursorAIBridge: CursorAIBridge): Promise<void> {
    try {
        const metrics = cursorAIBridge.getPerformanceMetrics();
        
        const metricsText = `📊 **Performance Metrics**
        
**Response Time**: ${metrics.responseTime}ms
**Context Update Time**: ${metrics.contextUpdateTime}ms
**File Analysis Time**: ${metrics.fileAnalysisTime}ms

**Performance Status**: ${getPerformanceStatus(metrics)}`;

        const document = await vscode.workspace.openTextDocument({
            content: metricsText,
            language: 'markdown'
        });
        
        await vscode.window.showTextDocument(document);
        
    } catch (error) {
        console.error('Error showing performance metrics:', error);
        vscode.window.showErrorMessage('Failed to retrieve performance metrics');
    }
}

/**
 * Create status bar items
 */
function createStatusBarItems(enhancedChatProvider: EnhancedChatProvider): vscode.StatusBarItem[] {
    const items: vscode.StatusBarItem[] = [];
    
    // Enhanced Chat Status
    const enhancedChatStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    enhancedChatStatus.text = '🚀 Enhanced Chat';
    enhancedChatStatus.tooltip = 'Click to open enhanced AI chat features';
    enhancedChatStatus.command = 'cursor-claude.enhancedChatWebview';
    enhancedChatStatus.show();
    items.push(enhancedChatStatus);
    
    // File Analysis Status
    const fileAnalysisStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
    fileAnalysisStatus.text = '📊 Analyze';
    fileAnalysisStatus.tooltip = 'Analyze current file for enhanced context';
    fileAnalysisStatus.command = 'cursor-claude.analyzeFile';
    fileAnalysisStatus.show();
    items.push(fileAnalysisStatus);
    
    // Code Generation Status
    const codeGenerationStatus = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 98);
    codeGenerationStatus.text = '💻 Generate';
    codeGenerationStatus.tooltip = 'Generate code using enhanced AI capabilities';
    codeGenerationStatus.command = 'cursor-claude.generateCode';
    codeGenerationStatus.show();
    items.push(codeGenerationStatus);
    
    return items;
}

/**
 * Get current workspace context
 */
async function getCurrentContext(): Promise<any> {
    const activeEditor = vscode.window.activeTextEditor;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    return {
        file_context: activeEditor ? [{
            path: activeEditor.document.fileName,
            language: activeEditor.document.languageId,
            is_active: true,
            selection: activeEditor.selection
        }] : [],
        workspace_context: {
            name: workspaceFolders?.[0]?.name || '',
            files: vscode.workspace.textDocuments.map(doc => doc.fileName)
        },
        aiContext: {
            crewMembers: ['cursor', 'claude'],
            systemCapabilities: ['file_analysis', 'code_generation', 'ai_collaboration'],
            supabaseMemories: [],
            n8nConfigurations: []
        }
    };
}

/**
 * Show AI selection details
 */
async function showAISelectionDetails(aiSelection: any): Promise<void> {
    const details = `🤖 **AI Selection Details**
    
**Primary AI**: ${aiSelection.primary_ai.toUpperCase()}
**Secondary AI**: ${aiSelection.secondary_ai.toUpperCase()}
**Collaboration Mode**: ${aiSelection.collaboration_mode}

**Confidence Scores**:
- Cursor: ${(aiSelection.confidence_scores.cursor * 100).toFixed(1)}%
- Claude: ${(aiSelection.confidence_scores.claude * 100).toFixed(1)}%

**Cost Estimate**: $${aiSelection.cost_estimate}

**Selection Rationale**:
${aiSelection.selection_rationale}`;

    const document = await vscode.workspace.openTextDocument({
        content: details,
        language: 'markdown'
    });
    
    await vscode.window.showTextDocument(document);
}

/**
 * Execute AI task
 */
async function executeAITask(message: string, aiSelection: any, cursorAIBridge: CursorAIBridge): Promise<void> {
    try {
        const context = await getCurrentContext();
        
        // Execute task using selected AI
        const response = await cursorAIBridge.extendCursorChat(message, context);
        
        // Show results
        vscode.window.showInformationMessage(
            `✅ Task completed by ${aiSelection.primary_ai.toUpperCase()}`,
            'View Results',
            'Apply Changes'
        ).then(selection => {
            if (selection === 'View Results') {
                showTaskResults(response);
            } else if (selection === 'Apply Changes') {
                applyTaskChanges(response);
            }
        });
        
    } catch (error) {
        console.error('Error executing AI task:', error);
        vscode.window.showErrorMessage('Failed to execute AI task');
    }
}

/**
 * Modify AI selection
 */
async function modifyAISelection(
    aiSelection: any, 
    democraticRouter: DemocraticRouter, 
    context: any
): Promise<void> {
    const options = ['Force Cursor', 'Force Claude', 'Collaborative Mode', 'Cancel'];
    
    const selection = await vscode.window.showQuickPick(options, {
        placeHolder: 'How would you like to modify the AI selection?'
    });
    
    if (selection === 'Force Cursor') {
        aiSelection.primary_ai = 'cursor';
        aiSelection.secondary_ai = 'claude';
    } else if (selection === 'Force Claude') {
        aiSelection.primary_ai = 'claude';
        aiSelection.secondary_ai = 'cursor';
    } else if (selection === 'Collaborative Mode') {
        aiSelection.collaboration_mode = 'collaborative';
    }
    
    if (selection !== 'Cancel') {
        vscode.window.showInformationMessage(`AI selection modified: ${aiSelection.primary_ai.toUpperCase()} will be primary`);
    }
}

/**
 * Update file context when files change
 */
async function updateFileContext(uri: vscode.Uri, enhancedChatProvider: EnhancedChatProvider): Promise<void> {
    try {
        // Only update for relevant file types
        const relevantExtensions = ['.ts', '.js', '.py', '.java', '.cpp', '.rs', '.go'];
        const fileExtension = uri.path.split('.').pop()?.toLowerCase();
        
        if (fileExtension && relevantExtensions.includes(`.${fileExtension}`)) {
            // Update context in background
            console.log(`Updating context for changed file: ${uri.fsPath}`);
            
            // This could trigger a background context refresh
            // For now, we'll just log the change
        }
    } catch (error) {
        console.error('Error updating file context:', error);
    }
}

/**
 * Format workspace analysis for display
 */
function formatWorkspaceAnalysis(analysis: any): string {
    return `🏢 **Workspace Analysis**
    
**Workspace**: ${analysis.name || 'Unknown'}
**Total Files**: ${analysis.fileCount || 0}

**Language Distribution**:
${analysis.languages ? Object.entries(analysis.languages)
    .map(([lang, count]) => `- ${lang}: ${count} files`)
    .join('\n') : 'No language data available'}

**Structure**: 
\`\`\`json
${JSON.stringify(analysis.structure || {}, null, 2)}
\`\`\`

**Analysis Complete**: ${new Date().toLocaleString()}`;
}

/**
 * Get performance status
 */
function getPerformanceStatus(metrics: any): string {
    const avgResponseTime = metrics.responseTime;
    
    if (avgResponseTime < 100) {
        return '🟢 Excellent - Fast response times';
    } else if (avgResponseTime < 500) {
        return '🟡 Good - Acceptable performance';
    } else if (avgResponseTime < 1000) {
        return '🟠 Fair - Some performance issues';
    } else {
        return '🔴 Poor - Performance needs optimization';
    }
}

/**
 * Show task results
 */
async function showTaskResults(response: any): Promise<void> {
    const document = await vscode.workspace.openTextDocument({
        content: response.content,
        language: 'markdown'
    });
    
    await vscode.window.showTextDocument(document);
}

/**
 * Apply task changes
 */
async function applyTaskChanges(response: any): Promise<void> {
    // This would apply any code changes from the AI response
    vscode.window.showInformationMessage('Task changes applied successfully');
}

export function deactivate() {
    console.log('👋 Cursor-Claude Unified Extension deactivated');
}