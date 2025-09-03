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
exports.EnhancedChatProvider = void 0;
const vscode = __importStar(require("vscode"));
/**
 * 🚀 Enhanced Chat Provider Service
 *
 * This service provides an enhanced chat interface that integrates with Cursor's native chat,
 * offering file context, code generation workflows, and multi-AI collaboration.
 */
class EnhancedChatProvider {
    constructor() {
        this.chatState = {};
        this.fileContext = [];
        this.initializeChatState();
    }
    /**
     * Extend Cursor's native chat with enhanced features
     */
    async extendChat(userMessage, context) {
        try {
            // 1. Get current Cursor chat state
            const cursorState = await this.getCursorChatState();
            // 2. Get enhanced features for this message
            const enhancedFeatures = await this.getEnhancedFeatures(userMessage);
            // 3. Integrate with Cursor's native chat
            await this.integrateWithCursor(cursorState, enhancedFeatures);
            // 4. Add file context if relevant
            if (this.isFileRelatedTask(userMessage)) {
                await this.integrateFileContext(context);
            }
            // 5. Show enhanced context status
            await this.showEnhancedContextStatus(enhancedFeatures);
            // 6. Provide quick actions
            await this.provideQuickActions(userMessage, enhancedFeatures);
            // 7. Update chat interface
            await this.updateChatInterface(enhancedFeatures);
        }
        catch (error) {
            console.error('Error extending chat:', error);
            vscode.window.showErrorMessage('Failed to extend chat with enhanced features');
        }
    }
    /**
     * Add file context to the chat
     */
    async addFileContext(context) {
        try {
            // 1. Analyze current file
            const activeEditor = vscode.window.activeTextEditor;
            if (!activeEditor) {
                vscode.window.showInformationMessage('No active file to analyze');
                return;
            }
            const fileAnalysis = await this.analyzeFile(activeEditor.document);
            this.fileContext.push(fileAnalysis);
            // 2. Show file insights
            await this.showFileInsights(fileAnalysis);
            // 3. Integrate with chat
            await this.integrateFileContext(context);
            // 4. Update context status
            await this.showEnhancedContextStatus({
                fileContext: this.fileContext,
                workspaceInsights: await this.getWorkspaceInsights(),
                aiRouting: await this.getAIRoutingRecommendations()
            });
        }
        catch (error) {
            console.error('Error adding file context:', error);
            vscode.window.showErrorMessage('Failed to add file context');
        }
    }
    /**
     * Integrate code generation workflows
     */
    async integrateCodeGeneration(prompt, context) {
        try {
            // 1. Analyze task type
            const taskType = this.analyzeTaskType(prompt);
            // 2. Show code preview
            if (taskType === 'CODE_GENERATION') {
                await this.showCodePreview(prompt, context);
            }
            // 3. Provide apply options
            await this.provideApplyOptions(prompt, context);
            // 4. Suggest optimizations
            await this.suggestOptimizations(context);
        }
        catch (error) {
            console.error('Error integrating code generation:', error);
            vscode.window.showErrorMessage('Failed to integrate code generation');
        }
    }
    /**
     * Create enhanced chat webview
     */
    async createEnhancedChatWebview() {
        try {
            // Create webview panel
            this.webviewPanel = vscode.window.createWebviewPanel('enhancedChat', '🚀 Enhanced AI Chat', vscode.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true
            });
            // Set webview content
            this.webviewPanel.webview.html = this.getWebviewHTML();
            // Handle webview messages
            this.webviewPanel.webview.onDidReceiveMessage(message => this.handleWebviewMessage(message));
            // Handle panel disposal
            this.webviewPanel.onDidDispose(() => {
                this.webviewPanel = undefined;
            });
            // Show activation message
            vscode.window.showInformationMessage('🚀 Enhanced AI Chat activated! Use the command palette to access enhanced features.');
        }
        catch (error) {
            console.error('Error creating enhanced chat webview:', error);
            vscode.window.showErrorMessage('Failed to create enhanced chat webview');
        }
    }
    /**
     * Get current Cursor chat state
     */
    async getCursorChatState() {
        // This would integrate with Cursor's actual chat state
        // For now, return a mock state
        return {
            isActive: true,
            currentThread: 'main',
            messageCount: 0,
            lastActivity: new Date().toISOString()
        };
    }
    /**
     * Get enhanced features for a message
     */
    async getEnhancedFeatures(message) {
        const features = {
            fileContext: this.fileContext,
            workspaceInsights: await this.getWorkspaceInsights(),
            aiRouting: await this.getAIRoutingRecommendations(),
            codeGeneration: this.analyzeTaskType(message) === 'CODE_GENERATION',
            fileAnalysis: this.analyzeTaskType(message) === 'FILE_ANALYSIS'
        };
        return features;
    }
    /**
     * Integrate with Cursor's native chat
     */
    async integrateWithCursor(cursorState, enhancedFeatures) {
        // This would integrate with Cursor's actual chat API
        console.log('Integrating enhanced features with Cursor chat:', enhancedFeatures);
    }
    /**
     * Integrate file context
     */
    async integrateFileContext(context) {
        // This would integrate file context with Cursor's chat
        console.log('Integrating file context:', context);
    }
    /**
     * Show file insights
     */
    async showFileInsights(fileAnalysis) {
        const insights = `📊 **File Analysis Results**

**File:** ${fileAnalysis.fileName}
**Language:** ${fileAnalysis.language}
**Lines:** ${fileAnalysis.lineCount}
**Complexity:** ${fileAnalysis.complexity}/10

**Structure:**
- Imports: ${fileAnalysis.structure.imports?.length || 0}
- Functions: ${fileAnalysis.structure.functions?.length || 0}
- Classes: ${fileAnalysis.structure.classes?.length || 0}
- Variables: ${fileAnalysis.structure.variables?.length || 0}

**Suggestions:**
${fileAnalysis.suggestions.map(s => `- ${s}`).join('\n')}`;
        vscode.window.showInformationMessage('File analysis complete! Check the output panel for details.');
        // Output to console for now
        console.log(insights);
    }
    /**
     * Show code preview
     */
    async showCodePreview(prompt, context) {
        // This would show a code preview panel
        vscode.window.showInformationMessage('Code preview available! Check the preview panel.');
    }
    /**
     * Provide apply options for generated code
     */
    async provideApplyOptions(prompt, context) {
        const options = ['Apply to current file', 'Create new file', 'Insert at cursor', 'Modify before applying'];
        const selection = await vscode.window.showQuickPick(options, {
            placeHolder: 'How would you like to apply the generated code?'
        });
        if (selection) {
            await this.executeQuickAction(selection, prompt, context);
        }
    }
    /**
     * Suggest optimizations
     */
    async suggestOptimizations(context) {
        const insights = {
            suggestions: []
        };
        // Analyze context and provide suggestions
        if (context.fileContext) {
            const fileAnalysis = context.fileContext[0];
            if (fileAnalysis.complexity > 7) {
                insights.suggestions.push('Break down large functions', 'Extract utility classes', 'Simplify control flow');
            }
            if (fileAnalysis.structure.functions.length > 10) {
                insights.suggestions.push('Review complex functions', 'Consider helper methods', 'Add error handling');
            }
            if (fileAnalysis.structure.comments.length < 5) {
                insights.suggestions.push('Add documentation', 'Consider unit tests', 'Performance optimization');
            }
        }
        if (insights.suggestions.length > 0) {
            vscode.window.showInformationMessage(`💡 Optimization suggestions available: ${insights.suggestions.length} recommendations`);
        }
    }
    /**
     * Show enhanced context status
     */
    async showEnhancedContextStatus(features) {
        const status = `🚀 **Enhanced Context Status**

**File Context:** ${features.fileContext?.length || 0} files analyzed
**Workspace Insights:** ${features.workspaceInsights ? 'Available' : 'Not available'}
**AI Routing:** ${features.aiRouting ? 'Optimized' : 'Standard'}
**Code Generation:** ${features.codeGeneration ? 'Ready' : 'Not applicable'}`;
        // Output to console for now
        console.log(status);
    }
    /**
     * Provide quick actions
     */
    async provideQuickActions(message, features) {
        const actions = ['Analyze current file', 'Generate code', 'Show workspace insights', 'Performance metrics'];
        const selection = await vscode.window.showQuickPick(actions, {
            placeHolder: 'Quick actions available'
        });
        if (selection) {
            await this.executeQuickAction(selection, message, features);
        }
    }
    /**
     * Update chat interface
     */
    async updateChatInterface(features) {
        // This would update the actual chat interface
        console.log('Updating chat interface with features:', features);
    }
    /**
     * Analyze task type
     */
    analyzeTaskType(message) {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('generate') || lowerMessage.includes('create') || lowerMessage.includes('write')) {
            return 'CODE_GENERATION';
        }
        if (lowerMessage.includes('analyze') || lowerMessage.includes('review') || lowerMessage.includes('check')) {
            return 'FILE_ANALYSIS';
        }
        if (lowerMessage.includes('debug') || lowerMessage.includes('fix') || lowerMessage.includes('error')) {
            return 'DEBUGGING';
        }
        return 'GENERAL';
    }
    /**
     * Check if task is file-related
     */
    isFileRelatedTask(message) {
        const fileKeywords = ['file', 'code', 'function', 'class', 'variable', 'import', 'export'];
        return fileKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
    /**
     * Get workspace insights
     */
    async getWorkspaceInsights() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders)
            return null;
        const workspace = workspaceFolders[0];
        const files = await vscode.workspace.findFiles('**/*', '**/node_modules/**');
        return {
            name: workspace.name,
            fileCount: files.length,
            languages: this.analyzeLanguageDistribution(files),
            structure: await this.analyzeWorkspaceStructure(workspace.uri)
        };
    }
    /**
     * Get AI routing recommendations
     */
    async getAIRoutingRecommendations() {
        // This would provide AI routing recommendations
        return {
            primaryAI: 'claude',
            secondaryAI: 'cursor',
            reasoning: 'Task requires complex reasoning and code generation'
        };
    }
    /**
     * Create file context message
     */
    createFileContextMessage(fileAnalysis) {
        return `📁 **File Context Added**

**File:** ${fileAnalysis.fileName}
**Language:** ${fileAnalysis.language}
**Complexity:** ${fileAnalysis.complexity}/10

**Key Elements:**
- Functions: ${fileAnalysis.structure.functions?.length || 0}
- Classes: ${fileAnalysis.structure.classes?.length || 0}
- Dependencies: ${fileAnalysis.dependencies.length}

**Suggestions:**
${fileAnalysis.suggestions.map(s => `- ${s}`).join('\n')}`;
    }
    /**
     * Generate file insights
     */
    generateFileInsights(fileAnalysis) {
        return {
            complexity: fileAnalysis.complexity,
            structure: fileAnalysis.structure,
            dependencies: fileAnalysis.dependencies,
            suggestions: fileAnalysis.suggestions,
            language: fileAnalysis.language
        };
    }
    /**
     * Create code preview message
     */
    createCodePreviewMessage(code, context) {
        return `💻 **Code Preview**

**Generated Code:**
\`\`\`${context.language || 'typescript'}
${code}
\`\`\`

**Context:** ${context.description || 'No description provided'}`;
    }
    /**
     * Insert into chat
     */
    async insertIntoChat(message) {
        // This would insert the message into Cursor's chat
        console.log('Inserting into chat:', message);
    }
    /**
     * Show file analysis details
     */
    async showFileAnalysisDetails(fileAnalysis) {
        const details = this.createFileContextMessage(fileAnalysis);
        await this.insertIntoChat(details);
    }
    /**
     * Suggest code generation
     */
    async suggestCodeGeneration(context) {
        vscode.window.showInformationMessage('Code generation is available for this task!');
    }
    /**
     * Show code preview panel
     */
    async showCodePreviewPanel(code, context) {
        // This would show a dedicated code preview panel
        vscode.window.showInformationMessage('Code preview panel opened');
    }
    /**
     * Apply generated code
     */
    async applyGeneratedCode(code, context) {
        const action = await vscode.window.showQuickPick([
            'Apply to current file',
            'Create new file',
            'Insert at cursor'
        ], {
            placeHolder: 'How would you like to apply the code?'
        });
        if (action) {
            await this.executeQuickAction(action, code, context);
        }
    }
    /**
     * Apply to current file
     */
    async applyToCurrentFile(code, context) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        try {
            await editor.edit(editBuilder => {
                const document = editor.document;
                const lastLine = document.lineAt(document.lineCount - 1);
                const position = lastLine.range.end;
                editBuilder.insert(position, '\n\n' + code);
            });
            vscode.window.showInformationMessage('Code applied to current file');
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to apply code to file');
        }
    }
    /**
     * Create new file
     */
    async createNewFile(code, context) {
        const fileName = await vscode.window.showInputBox({
            prompt: 'Enter filename for new file',
            value: 'generated-code.ts'
        });
        if (fileName) {
            try {
                const uri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, fileName);
                await vscode.workspace.fs.writeFile(uri, Buffer.from(code));
                const document = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(document);
                vscode.window.showInformationMessage(`New file created: ${fileName}`);
            }
            catch (error) {
                vscode.window.showErrorMessage('Failed to create new file');
            }
        }
    }
    /**
     * Insert at cursor
     */
    async insertAtCursor(code, context) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        try {
            await editor.edit(editBuilder => {
                editBuilder.insert(editor.selection.active, code);
            });
            vscode.window.showInformationMessage('Code inserted at cursor');
        }
        catch (error) {
            vscode.window.showErrorMessage('Failed to insert code at cursor');
        }
    }
    /**
     * Modify before applying
     */
    async modifyBeforeApplying(code, context) {
        const modifiedCode = await vscode.window.showInputBox({
            prompt: 'Modify the code before applying',
            value: code,
            valueSelection: [0, code.length]
        });
        if (modifiedCode) {
            await this.applyGeneratedCode(modifiedCode, context);
        }
    }
    /**
     * Execute quick action
     */
    async executeQuickAction(action, context, additionalContext) {
        switch (action) {
            case 'Analyze current file':
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const analysis = await this.analyzeFile(editor.document);
                    await this.showFileInsights(analysis);
                }
                break;
            case 'Generate code':
                await this.suggestCodeGeneration(additionalContext);
                break;
            case 'Show workspace insights':
                const insights = await this.getWorkspaceInsights();
                if (insights) {
                    vscode.window.showInformationMessage(`Workspace: ${insights.name}, Files: ${insights.fileCount}`);
                }
                break;
            case 'Performance metrics':
                vscode.window.showInformationMessage('Performance metrics available in the status bar');
                break;
            case 'Apply to current file':
                if (additionalContext) {
                    await this.applyToCurrentFile(additionalContext, context);
                }
                break;
            case 'Create new file':
                if (additionalContext) {
                    await this.createNewFile(additionalContext, context);
                }
                break;
            case 'Insert at cursor':
                if (additionalContext) {
                    await this.insertAtCursor(additionalContext, context);
                }
                break;
            case 'Modify before applying':
                if (additionalContext) {
                    await this.modifyBeforeApplying(additionalContext, context);
                }
                break;
            default:
                vscode.window.showInformationMessage(`Action: ${action}`);
        }
    }
    /**
     * Show workspace analysis
     */
    async showWorkspaceAnalysis() {
        const insights = await this.getWorkspaceInsights();
        if (insights) {
            const analysis = `🏗️ **Workspace Analysis**

**Name:** ${insights.name}
**Total Files:** ${insights.fileCount}
**Languages:** ${Object.entries(insights.languages).map(([lang, count]) => `${lang}: ${count}`).join(', ')}`;
            vscode.window.showInformationMessage('Workspace analysis complete! Check the output panel.');
            console.log(analysis);
        }
    }
    /**
     * Check dependencies
     */
    async checkDependencies() {
        // This would check project dependencies
        vscode.window.showInformationMessage('Dependency check available');
    }
    /**
     * Suggest migrations
     */
    async suggestMigrations() {
        // This would suggest code migrations
        vscode.window.showInformationMessage('Migration suggestions available');
    }
    /**
     * Analyze language distribution
     */
    analyzeLanguageDistribution(files) {
        const languages = {};
        for (const file of files) {
            const ext = file.path.split('.').pop() || '';
            const language = this.getLanguageFromExtension(ext);
            languages[language] = (languages[language] || 0) + 1;
        }
        return languages;
    }
    /**
     * Get language from file extension
     */
    getLanguageFromExtension(ext) {
        const languageMap = {
            'ts': 'TypeScript',
            'js': 'JavaScript',
            'py': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'rs': 'Rust',
            'go': 'Go',
            'rb': 'Ruby',
            'php': 'PHP'
        };
        return languageMap[ext] || 'Unknown';
    }
    /**
     * Analyze workspace structure
     */
    async analyzeWorkspaceStructure(uri) {
        try {
            const entries = await vscode.workspace.fs.readDirectory(uri);
            const structure = {};
            for (const entry of entries) {
                if (entry[1] === vscode.FileType.Directory) {
                    structure[entry[0]] = await this.analyzeWorkspaceStructure(vscode.Uri.joinPath(uri, entry[0]));
                }
                else {
                    structure[entry[0]] = 'file';
                }
            }
            return structure;
        }
        catch (error) {
            return {};
        }
    }
    /**
     * Get webview HTML content
     */
    getWebviewHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Enhanced AI Chat</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            background: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 8px;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .feature-card {
            padding: 20px;
            background: var(--vscode-editor-selectionBackground);
            border-radius: 8px;
            border: 1px solid var(--vscode-editor-lineHighlightBorder);
        }
        .feature-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
            color: var(--vscode-editor-foreground);
        }
        .feature-description {
            color: var(--vscode-editor-foreground);
            line-height: 1.5;
        }
        .status-bar {
            padding: 15px;
            background: var(--vscode-statusBar-background);
            border-radius: 8px;
            text-align: center;
            color: var(--vscode-statusBar-foreground);
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Enhanced AI Chat</h1>
        <p>Advanced AI collaboration with intelligent model selection and N8N integration</p>
    </div>
    
    <div class="feature-grid">
        <div class="feature-card">
            <div class="feature-title">🤖 LLM Optimization</div>
            <div class="feature-description">
                Intelligent model selection based on task requirements, cost optimization, and performance learning.
            </div>
        </div>
        
        <div class="feature-card">
            <div class="feature-title">📁 File Analysis</div>
            <div class="feature-description">
                Deep file structure analysis with complexity metrics, dependency tracking, and optimization suggestions.
            </div>
        </div>
        
        <div class="feature-card">
            <div class="feature-title">💻 Code Generation</div>
            <div class="feature-description">
                Context-aware code generation with multiple application options and intelligent suggestions.
            </div>
        </div>
        
        <div class="feature-card">
            <div class="feature-title">🔄 N8N Integration</div>
            <div class="feature-description">
                Real-time synchronization with N8N workflows for seamless sub-agent coordination.
            </div>
        </div>
    </div>
    
    <div class="status-bar">
        <strong>Status:</strong> Enhanced features are active and ready to use
    </div>
    
    <script>
        // Handle webview messages
        window.addEventListener('message', event => {
            const message = event.data;
            console.log('Received message:', message);
        });
        
        // Notify extension that webview is ready
        vscode.postMessage({
            command: 'webviewReady'
        });
    </script>
</body>
</html>`;
    }
    /**
     * Handle webview messages
     */
    handleWebviewMessage(message) {
        switch (message.command) {
            case 'webviewReady':
                console.log('Enhanced chat webview is ready');
                break;
            case 'analyzeFile':
                this.analyzeCurrentFile();
                break;
            case 'generateCode':
                this.showCodeGenerationPrompt();
                break;
            case 'showInsights':
                this.showWorkspaceAnalysis();
                break;
            default:
                console.log('Unknown message command:', message.command);
        }
    }
    /**
     * Update chat state
     */
    updateChatState(newState) {
        this.chatState = { ...this.chatState, ...newState };
    }
    /**
     * Get current chat state
     */
    getCurrentChatState() {
        return this.chatState;
    }
    /**
     * Initialize chat state
     */
    initializeChatState() {
        this.chatState = {
            isActive: false,
            features: {
                fileAnalysis: false,
                codeGeneration: false,
                aiCollaboration: false,
                performanceMonitoring: false,
                llmOptimization: false,
                n8nIntegration: false
            },
            lastActivity: null
        };
    }
    /**
     * Analyze current file
     */
    async analyzeCurrentFile() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const analysis = await this.analyzeFile(editor.document);
            await this.showFileInsights(analysis);
        }
    }
    /**
     * Show code generation prompt
     */
    async showCodeGenerationPrompt() {
        const prompt = await vscode.window.showInputBox({
            prompt: 'What code would you like me to generate?',
            placeHolder: 'e.g., Create a React component for user authentication'
        });
        if (prompt) {
            await this.integrateCodeGeneration(prompt, {});
        }
    }
    /**
     * Analyze file
     */
    async analyzeFile(document) {
        const text = document.getText();
        const lines = text.split('\n');
        return {
            filePath: document.fileName,
            fileName: document.fileName.split('/').pop() || '',
            language: document.languageId,
            lineCount: document.lineCount,
            content: text,
            structure: {
                imports: this.extractImports(lines, document.languageId),
                functions: this.extractFunctions(lines, document.languageId),
                classes: this.extractClasses(lines, document.languageId),
                variables: this.extractVariables(lines, document.languageId),
                comments: this.extractComments(lines),
                complexity: this.calculateCyclomaticComplexity(lines)
            },
            dependencies: this.extractDependencies(text),
            complexity: this.calculateComplexity(lines),
            suggestions: this.generateSuggestions(document),
            timestamp: new Date().toISOString()
        };
    }
    /**
     * Extract imports from code
     */
    extractImports(lines, language) {
        const imports = [];
        if (language === 'typescript' || language === 'javascript') {
            const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
            for (const line of lines) {
                let match;
                while ((match = importRegex.exec(line)) !== null) {
                    imports.push(match[1]);
                }
            }
        }
        return imports;
    }
    /**
     * Extract functions from code
     */
    extractFunctions(lines, language) {
        const functions = [];
        if (language === 'typescript' || language === 'javascript') {
            const functionRegex = /(?:function\s+(\w+)|(\w+)\s*[:=]\s*(?:async\s+)?function|(\w+)\s*[:=]\s*(?:async\s+)?\(|(\w+)\s*[:=]\s*\([^)]*\)\s*=>)/g;
            for (const line of lines) {
                let match;
                while ((match = functionRegex.exec(line)) !== null) {
                    const functionName = match[1] || match[2] || match[3] || match[4];
                    if (functionName)
                        functions.push(functionName);
                }
            }
        }
        return functions;
    }
    /**
     * Extract classes from code
     */
    extractClasses(lines, language) {
        const classes = [];
        if (language === 'typescript' || language === 'javascript') {
            const classRegex = /class\s+(\w+)/g;
            for (const line of lines) {
                let match;
                while ((match = classRegex.exec(line)) !== null) {
                    classes.push(match[1]);
                }
            }
        }
        return classes;
    }
    /**
     * Extract variables from code
     */
    extractVariables(lines, language) {
        const variables = [];
        if (language === 'typescript' || language === 'javascript') {
            const varRegex = /(?:const|let|var)\s+(\w+)/g;
            for (const line of lines) {
                let match;
                while ((match = varRegex.exec(line)) !== null) {
                    variables.push(match[1]);
                }
            }
        }
        return variables;
    }
    /**
     * Extract comments from code
     */
    extractComments(lines) {
        const comments = [];
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                comments.push(trimmed);
            }
        }
        return comments;
    }
    /**
     * Extract dependencies from code
     */
    extractDependencies(text) {
        const dependencies = [];
        const importRegex = /import\s+.*?from\s+['"]([^'"]+)['"]/g;
        let match;
        while ((match = importRegex.exec(text)) !== null) {
            dependencies.push(match[1]);
        }
        return dependencies;
    }
    /**
     * Calculate file complexity
     */
    calculateComplexity(lines) {
        let complexity = 1;
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('if') || lowerLine.includes('else if'))
                complexity++;
            if (lowerLine.includes('for') || lowerLine.includes('while'))
                complexity++;
            if (lowerLine.includes('case'))
                complexity++;
            if (lowerLine.includes('catch'))
                complexity++;
            if (lowerLine.includes('&&') || lowerLine.includes('||'))
                complexity++;
        }
        return Math.min(complexity, 10);
    }
    /**
     * Calculate cyclomatic complexity
     */
    calculateCyclomaticComplexity(lines) {
        let complexity = 1;
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            if (lowerLine.includes('if') || lowerLine.includes('else if'))
                complexity++;
            if (lowerLine.includes('for') || lowerLine.includes('while'))
                complexity++;
            if (lowerLine.includes('case'))
                complexity++;
            if (lowerLine.includes('catch'))
                complexity++;
            if (lowerLine.includes('&&') || lowerLine.includes('||'))
                complexity++;
        }
        return complexity;
    }
    /**
     * Generate suggestions for file
     */
    generateSuggestions(document) {
        const suggestions = [];
        const language = document.languageId;
        if (language === 'typescript' || language === 'javascript') {
            suggestions.push('Consider adding JSDoc comments for better documentation');
            suggestions.push('Implement error handling for async operations');
            suggestions.push('Add type annotations for better type safety');
        }
        if (language === 'python') {
            suggestions.push('Add type hints for function parameters');
            suggestions.push('Consider using dataclasses for data structures');
            suggestions.push('Implement proper exception handling');
        }
        return suggestions;
    }
}
exports.EnhancedChatProvider = EnhancedChatProvider;
//# sourceMappingURL=enhanced-chat.js.map