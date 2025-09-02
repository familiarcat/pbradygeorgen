import * as vscode from 'vscode';
import { CursorAIBridge } from '../services/cursor-ai-bridge';
import { SharedContext, AIResponse, FileAnalysis } from '../types/interfaces';

/**
 * 🚀 Enhanced Chat Provider
 * 
 * This service extends Cursor's native chat with additional features:
 * - File context integration
 * - Code generation workflows
 * - Multi-AI collaboration
 * - Enhanced context management
 */
export class EnhancedChatProvider {
  private cursorAIBridge: CursorAIBridge;
  private currentChatState: any = {};
  private enhancedFeatures: any = {};
  private webviewPanel: vscode.WebviewPanel | null = null;

  constructor() {
    this.cursorAIBridge = new CursorAIBridge();
  }

  /**
   * Extend Cursor's native chat with enhanced features
   */
  async extendChat(message: string): Promise<void> {
    try {
      // 1. Capture Cursor's current chat state
      const cursorChat = await this.getCursorChatState();
      
      // 2. Add our enhanced features
      const enhancedFeatures = await this.getEnhancedFeatures(message);
      
      // 3. Integrate with Cursor's chat
      await this.integrateWithCursor(cursorChat, enhancedFeatures);
      
      // 4. Update our chat state
      this.updateChatState(message, enhancedFeatures);
      
    } catch (error) {
      console.error('Error extending chat:', error);
      vscode.window.showErrorMessage('Failed to extend chat with enhanced features');
    }
  }

  /**
   * Add file context to chat
   */
  async addFileContext(filePath: string): Promise<void> {
    try {
      // Analyze the file
      const fileAnalysis = await this.cursorAIBridge.analyzeFile(filePath);
      
      // Add file context to chat
      await this.integrateFileContext(fileAnalysis);
      
      // Show file insights in chat
      await this.showFileInsights(fileAnalysis);
      
    } catch (error) {
      console.error('Error adding file context:', error);
      vscode.window.showErrorMessage('Failed to analyze file for chat context');
    }
  }

  /**
   * Integrate code generation into chat flow
   */
  async integrateCodeGeneration(prompt: string): Promise<void> {
    try {
      // Get current editor context
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showWarningMessage('No active editor found for code generation');
        return;
      }

      // Generate code using the bridge
      const generatedCode = await this.cursorAIBridge.generateCode(prompt, {
        filePath: activeEditor.document.fileName,
        language: activeEditor.document.languageId,
        selection: activeEditor.selection,
        workspace: vscode.workspace.workspaceFolders?.[0]?.name || ''
      });

      // Show code preview in chat
      await this.showCodePreview(generatedCode);
      
      // Provide apply options
      await this.provideApplyOptions(generatedCode, activeEditor);
      
    } catch (error) {
      console.error('Error integrating code generation:', error);
      vscode.window.showErrorMessage('Failed to generate code');
    }
  }

  /**
   * Create enhanced chat webview
   */
  async createEnhancedChatWebview(): Promise<void> {
    // Create webview panel
    this.webviewPanel = vscode.window.createWebviewPanel(
      'enhancedChat',
      '🚀 Enhanced AI Chat',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    // Set webview content
    this.webviewPanel.webview.html = this.getWebviewHTML();

    // Handle webview messages
    this.webviewPanel.webview.onDidReceiveMessage(
      message => this.handleWebviewMessage(message)
    );

    // Handle panel disposal
    this.webviewPanel.onDidDispose(() => {
      this.webviewPanel = null;
    });
  }

  /**
   * Get Cursor's current chat state
   */
  private async getCursorChatState(): Promise<any> {
    // In a real implementation, this would access Cursor's chat state
    // For now, we'll simulate it with VS Code context
    
    const activeEditor = vscode.window.activeTextEditor;
    const workspaceFolders = vscode.workspace.workspaceFolders;
    
    return {
      activeFile: activeEditor?.document.fileName,
      activeLanguage: activeEditor?.document.languageId,
      selection: activeEditor?.selection,
      workspace: workspaceFolders?.[0]?.name,
      openFiles: vscode.workspace.textDocuments.map(doc => doc.fileName),
      cursorPosition: activeEditor?.selection.active,
      chatHistory: this.currentChatState.history || []
    };
  }

  /**
   * Get enhanced features for the message
   */
  private async getEnhancedFeatures(message: string): Promise<any> {
    const features: any = {};
    
    // Analyze message for task type
    features.taskType = this.analyzeTaskType(message);
    
    // Get file context if relevant
    if (this.isFileRelatedTask(message)) {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        features.fileContext = await this.cursorAIBridge.analyzeFile(activeEditor.document.fileName);
      }
    }
    
    // Get workspace insights
    features.workspaceInsights = await this.getWorkspaceInsights();
    
    // Get AI routing recommendations
    features.aiRouting = await this.getAIRoutingRecommendations(message);
    
    return features;
  }

  /**
   * Integrate enhanced features with Cursor
   */
  private async integrateWithCursor(cursorChat: any, enhancedFeatures: any): Promise<void> {
    // Store enhanced features for later use
    this.enhancedFeatures = enhancedFeatures;
    
    // Show enhanced context in status bar
    await this.showEnhancedContextStatus(enhancedFeatures);
    
    // Provide quick actions based on enhanced features
    await this.provideQuickActions(enhancedFeatures);
    
    // Update chat interface with enhanced features
    await this.updateChatInterface(enhancedFeatures);
  }

  /**
   * Integrate file context into chat
   */
  private async integrateFileContext(fileAnalysis: FileAnalysis): Promise<void> {
    // Add file analysis to chat context
    const fileContextMessage = this.createFileContextMessage(fileAnalysis);
    
    // Insert file context into chat
    await this.insertIntoChat(fileContextMessage);
    
    // Update enhanced features
    this.enhancedFeatures.fileContext = fileAnalysis;
  }

  /**
   * Show file insights in chat
   */
  private async showFileInsights(fileAnalysis: FileAnalysis): Promise<void> {
    const insights = this.generateFileInsights(fileAnalysis);
    
    // Show insights in a notification
    vscode.window.showInformationMessage(
      `📊 File Analysis Complete: ${insights.summary}`,
      'View Details',
      'Generate Code',
      'Optimize'
    ).then(selection => {
      if (selection === 'View Details') {
        this.showFileAnalysisDetails(fileAnalysis);
      } else if (selection === 'Generate Code') {
        this.suggestCodeGeneration(fileAnalysis);
      } else if (selection === 'Optimize') {
        this.suggestOptimizations(fileAnalysis);
      }
    });
  }

  /**
   * Show code preview in chat
   */
  private async showCodePreview(generatedCode: any): Promise<void> {
    // Create code preview message
    const previewMessage = this.createCodePreviewMessage(generatedCode);
    
    // Insert preview into chat
    await this.insertIntoChat(previewMessage);
    
    // Show preview in a separate panel
    await this.showCodePreviewPanel(generatedCode);
  }

  /**
   * Provide options to apply generated code
   */
  private async provideApplyOptions(generatedCode: any, editor: vscode.TextEditor): Promise<void> {
    const options = [
      'Apply to Current File',
      'Create New File',
      'Insert at Cursor',
      'Copy to Clipboard',
      'Modify Before Applying'
    ];

    const selection = await vscode.window.showQuickPick(options, {
      placeHolder: 'How would you like to apply the generated code?'
    });

    if (selection) {
      await this.applyGeneratedCode(generatedCode, editor, selection);
    }
  }

  /**
   * Show enhanced context in status bar
   */
  private async showEnhancedContextStatus(enhancedFeatures: any): Promise<void> {
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    
    if (enhancedFeatures.fileContext) {
      statusBarItem.text = `📊 ${enhancedFeatures.fileContext.fileName}`;
      statusBarItem.tooltip = `Complexity: ${enhancedFeatures.fileContext.complexity}/10 | Functions: ${enhancedFeatures.fileContext.structure.functions.length}`;
    } else {
      statusBarItem.text = '🚀 Enhanced Chat Ready';
      statusBarItem.tooltip = 'Click to access enhanced features';
    }
    
    statusBarItem.show();
    
    // Auto-hide after 5 seconds
    setTimeout(() => statusBarItem.dispose(), 5000);
  }

  /**
   * Provide quick actions based on enhanced features
   */
  private async provideQuickActions(enhancedFeatures: any): Promise<void> {
    const actions: string[] = [];
    
    if (enhancedFeatures.fileContext) {
      actions.push('Analyze File', 'Generate Tests', 'Optimize Code');
    }
    
    if (enhancedFeatures.workspaceInsights) {
      actions.push('Workspace Analysis', 'Dependency Check', 'Migration Suggestions');
    }
    
    if (actions.length > 0) {
      const selection = await vscode.window.showQuickPick(actions, {
        placeHolder: 'Quick Actions Available'
      });
      
      if (selection) {
        await this.executeQuickAction(selection, enhancedFeatures);
      }
    }
  }

  /**
   * Update chat interface with enhanced features
   */
  private async updateChatInterface(enhancedFeatures: any): Promise<void> {
    if (this.webviewPanel) {
      // Send enhanced features to webview
      this.webviewPanel.webview.postMessage({
        command: 'updateEnhancedFeatures',
        features: enhancedFeatures
      });
    }
  }

  /**
   * Analyze task type from message
   */
  private analyzeTaskType(message: string): string {
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
    
    if (lowerMessage.includes('test') || lowerMessage.includes('spec')) {
      return 'TESTING';
    }
    
    if (lowerMessage.includes('refactor') || lowerMessage.includes('optimize')) {
      return 'REFACTORING';
    }
    
    return 'GENERAL';
  }

  /**
   * Check if task is file-related
   */
  private isFileRelatedTask(message: string): boolean {
    const fileRelatedKeywords = ['file', 'code', 'function', 'class', 'method', 'variable'];
    const lowerMessage = message.toLowerCase();
    
    return fileRelatedKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Get workspace insights
   */
  private async getWorkspaceInsights(): Promise<any> {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return {};
    
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
  private async getAIRoutingRecommendations(message: string): Promise<any> {
    const taskType = this.analyzeTaskType(message);
    
    // Simple routing logic - can be enhanced with the DemocraticRouter
    if (taskType === 'CODE_GENERATION' || taskType === 'FILE_ANALYSIS') {
      return {
        primaryAI: 'claude',
        secondaryAI: 'cursor',
        reasoning: 'Claude excels at code generation and analysis tasks',
        confidence: 0.95
      };
    } else {
      return {
        primaryAI: 'cursor',
        secondaryAI: 'claude',
        reasoning: 'Cursor is better suited for general IDE tasks',
        confidence: 0.90
      };
    }
  }

  /**
   * Create file context message
   */
  private createFileContextMessage(fileAnalysis: FileAnalysis): any {
    return {
      type: 'fileContext',
      content: `📁 **File Context Added**: ${fileAnalysis.fileName}`,
      details: {
        language: fileAnalysis.language,
        complexity: fileAnalysis.complexity,
        functions: fileAnalysis.structure.functions.length,
        dependencies: fileAnalysis.dependencies.length
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate file insights
   */
  private generateFileInsights(fileAnalysis: FileAnalysis): any {
    const insights = {
      summary: '',
      suggestions: [],
      complexity: fileAnalysis.complexity
    };
    
    if (fileAnalysis.complexity > 7) {
      insights.summary = 'High complexity detected - consider refactoring';
      insights.suggestions.push('Break down large functions', 'Extract utility classes', 'Simplify control flow');
    } else if (fileAnalysis.complexity > 4) {
      insights.summary = 'Moderate complexity - some optimization possible';
      insights.suggestions.push('Review complex functions', 'Consider helper methods', 'Add error handling');
    } else {
      insights.summary = 'Good complexity level - well-structured code';
      insights.suggestions.push('Add documentation', 'Consider unit tests', 'Performance optimization');
    }
    
    return insights;
  }

  /**
   * Create code preview message
   */
  private createCodePreviewMessage(generatedCode: any): any {
    return {
      type: 'codePreview',
      content: `💻 **Code Generated**: ${generatedCode.prompt}`,
      code: generatedCode.code,
      suggestions: generatedCode.suggestions,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Insert message into chat
   */
  private async insertIntoChat(message: any): Promise<void> {
    // Add to chat history
    if (!this.currentChatState.history) {
      this.currentChatState.history = [];
    }
    
    this.currentChatState.history.push(message);
    
    // Update webview if available
    if (this.webviewPanel) {
      this.webviewPanel.webview.postMessage({
        command: 'addMessage',
        message: message
      });
    }
  }

  /**
   * Show file analysis details
   */
  private async showFileAnalysisDetails(fileAnalysis: FileAnalysis): Promise<void> {
    const details = `📊 **File Analysis Details**
    
**File**: ${fileAnalysis.fileName}
**Language**: ${fileAnalysis.language}
**Lines**: ${fileAnalysis.lineCount}
**Complexity**: ${fileAnalysis.complexity}/10

**Structure**:
- Functions: ${fileAnalysis.structure.functions.length}
- Classes: ${fileAnalysis.structure.classes.length}
- Variables: ${fileAnalysis.structure.variables.length}
- Imports: ${fileAnalysis.structure.imports.length}

**Dependencies**: ${fileAnalysis.dependencies.join(', ')}

**Suggestions**:
${fileAnalysis.suggestions.map(s => `- ${s}`).join('\n')}`;

    // Show in a new document
    const document = await vscode.workspace.openTextDocument({
      content: details,
      language: 'markdown'
    });
    
    await vscode.window.showTextDocument(document);
  }

  /**
   * Suggest code generation
   */
  private async suggestCodeGeneration(fileAnalysis: FileAnalysis): Promise<void> {
    const suggestions = [
      `Generate unit tests for ${fileAnalysis.structure.functions.length} functions`,
      `Create documentation for ${fileAnalysis.fileName}`,
      `Generate error handling for async operations`,
      `Create interface definitions for ${fileAnalysis.structure.classes.length} classes`
    ];
    
    const selection = await vscode.window.showQuickPick(suggestions, {
      placeHolder: 'What would you like to generate?'
    });
    
    if (selection) {
      await this.integrateCodeGeneration(selection);
    }
  }

  /**
   * Suggest optimizations
   */
  private async suggestOptimizations(fileAnalysis: FileAnalysis): Promise<void> {
    const optimizations = [];
    
    if (fileAnalysis.complexity > 7) {
      optimizations.push('Refactor high-complexity functions');
    }
    
    if (fileAnalysis.structure.functions.length > 10) {
      optimizations.push('Split into smaller modules');
    }
    
    if (fileAnalysis.dependencies.length > 5) {
      optimizations.push('Review and optimize dependencies');
    }
    
    if (optimizations.length > 0) {
      const selection = await vscode.window.showQuickPick(optimizations, {
        placeHolder: 'Select optimization to apply'
      });
      
      if (selection) {
        await this.applyOptimization(selection, fileAnalysis);
      }
    }
  }

  /**
   * Show code preview panel
   */
  private async showCodePreviewPanel(generatedCode: any): Promise<void> {
    const document = await vscode.workspace.openTextDocument({
      content: generatedCode.code,
      language: generatedCode.context?.language || 'text'
    });
    
    await vscode.window.showTextDocument(document, vscode.ViewColumn.Three);
  }

  /**
   * Apply generated code
   */
  private async applyGeneratedCode(generatedCode: any, editor: vscode.TextEditor, option: string): Promise<void> {
    try {
      switch (option) {
        case 'Apply to Current File':
          await this.applyToCurrentFile(generatedCode, editor);
          break;
        case 'Create New File':
          await this.createNewFile(generatedCode);
          break;
        case 'Insert at Cursor':
          await this.insertAtCursor(generatedCode, editor);
          break;
        case 'Copy to Clipboard':
          await vscode.env.clipboard.writeText(generatedCode.code);
          vscode.window.showInformationMessage('Code copied to clipboard');
          break;
        case 'Modify Before Applying':
          await this.modifyBeforeApplying(generatedCode);
          break;
      }
    } catch (error) {
      console.error('Error applying generated code:', error);
      vscode.window.showErrorMessage('Failed to apply generated code');
    }
  }

  /**
   * Apply code to current file
   */
  private async applyToCurrentFile(generatedCode: any, editor: vscode.TextEditor): Promise<void> {
    const edit = new vscode.WorkspaceEdit();
    const range = new vscode.Range(0, 0, editor.document.lineCount, 0);
    
    edit.replace(editor.document.uri, range, generatedCode.code);
    await vscode.workspace.applyEdit(edit);
    
    vscode.window.showInformationMessage('Code applied to current file');
  }

  /**
   * Create new file with generated code
   */
  private async createNewFile(generatedCode: any): Promise<void> {
    const fileName = await vscode.window.showInputBox({
      prompt: 'Enter filename for generated code',
      value: 'generated-code.ts'
    });
    
    if (fileName) {
      const uri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, fileName);
      const edit = new vscode.WorkspaceEdit();
      
      edit.createFile(uri, { overwrite: false });
      edit.insert(uri, new vscode.Position(0, 0), generatedCode.code);
      
      await vscode.workspace.applyEdit(edit);
      
      const document = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(document);
      
      vscode.window.showInformationMessage(`New file created: ${fileName}`);
    }
  }

  /**
   * Insert code at cursor position
   */
  private async insertAtCursor(generatedCode: any, editor: vscode.TextEditor): Promise<void> {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(editor.document.uri, editor.selection.active, generatedCode.code);
    
    await vscode.workspace.applyEdit(edit);
    vscode.window.showInformationMessage('Code inserted at cursor position');
  }

  /**
   * Modify code before applying
   */
  private async modifyBeforeApplying(generatedCode: any): Promise<void> {
    const document = await vscode.workspace.openTextDocument({
      content: generatedCode.code,
      language: generatedCode.context?.language || 'text'
    });
    
    await vscode.window.showTextDocument(document);
    vscode.window.showInformationMessage('Edit the code in the new tab, then use "Apply to Current File"');
  }

  /**
   * Execute quick action
   */
  private async executeQuickAction(action: string, enhancedFeatures: any): Promise<void> {
    switch (action) {
      case 'Analyze File':
        if (enhancedFeatures.fileContext) {
          await this.showFileAnalysisDetails(enhancedFeatures.fileContext);
        }
        break;
      case 'Generate Tests':
        await this.integrateCodeGeneration('Generate comprehensive unit tests for the current file');
        break;
      case 'Optimize Code':
        if (enhancedFeatures.fileContext) {
          await this.suggestOptimizations(enhancedFeatures.fileContext);
        }
        break;
      case 'Workspace Analysis':
        await this.showWorkspaceAnalysis(enhancedFeatures.workspaceInsights);
        break;
      case 'Dependency Check':
        await this.checkDependencies(enhancedFeatures.workspaceInsights);
        break;
      case 'Migration Suggestions':
        await this.suggestMigrations(enhancedFeatures.workspaceInsights);
        break;
    }
  }

  /**
   * Show workspace analysis
   */
  private async showWorkspaceAnalysis(workspaceInsights: any): Promise<void> {
    const analysis = `🏢 **Workspace Analysis**
    
**Workspace**: ${workspaceInsights.name}
**Total Files**: ${workspaceInsights.fileCount}

**Language Distribution**:
${Object.entries(workspaceInsights.languages).map(([lang, count]) => `- ${lang}: ${count} files`).join('\n')}

**Structure**: ${JSON.stringify(workspaceInsights.structure, null, 2)}`;

    const document = await vscode.workspace.openTextDocument({
      content: analysis,
      language: 'markdown'
    });
    
    await vscode.window.showTextDocument(document);
  }

  /**
   * Check dependencies
   */
  private async checkDependencies(workspaceInsights: any): Promise<void> {
    // This would integrate with package managers and dependency checkers
    vscode.window.showInformationMessage('Dependency check feature coming soon!');
  }

  /**
   * Suggest migrations
   */
  private async suggestMigrations(workspaceInsights: any): Promise<void> {
    const suggestions = [];
    
    if (workspaceInsights.languages.JavaScript > 0 && workspaceInsights.languages.TypeScript > 0) {
      suggestions.push('Migrate JavaScript files to TypeScript for better type safety');
    }
    
    if (workspaceInsights.languages.Python > 0) {
      suggestions.push('Consider adding type hints to Python files');
    }
    
    if (suggestions.length > 0) {
      const selection = await vscode.window.showQuickPick(suggestions, {
        placeHolder: 'Select migration to apply'
      });
      
      if (selection) {
        vscode.window.showInformationMessage(`Migration suggestion: ${selection}`);
      }
    }
  }

  /**
   * Analyze language distribution
   */
  private analyzeLanguageDistribution(files: vscode.Uri[]): Record<string, number> {
    const languages: Record<string, number> = {};
    
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
  private getLanguageFromExtension(ext: string): string {
    const languageMap: Record<string, string> = {
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
  private async analyzeWorkspaceStructure(uri: vscode.Uri): Promise<any> {
    try {
      const entries = await vscode.workspace.fs.readDirectory(uri);
      const structure: any = {};
      
      for (const entry of entries) {
        if (entry[1] === vscode.FileType.Directory) {
          structure[entry[0]] = await this.analyzeWorkspaceStructure(vscode.Uri.joinPath(uri, entry[0]));
        } else {
          structure[entry[0]] = 'file';
        }
      }
      
      return structure;
    } catch (error) {
      return {};
    }
  }

  /**
   * Get webview HTML content
   */
  private getWebviewHTML(): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🚀 Enhanced AI Chat</title>
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
                margin-bottom: 20px;
            }
            .message {
                margin: 10px 0;
                padding: 10px;
                border-radius: 6px;
                background: var(--vscode-input-background);
            }
            .enhanced-features {
                border: 1px solid var(--vscode-panel-border);
                border-radius: 8px;
                padding: 20px;
                background: var(--vscode-editor-background);
            }
            .feature-item {
                margin: 10px 0;
                padding: 10px;
                border-radius: 6px;
                background: var(--vscode-input-background);
                border-left: 4px solid var(--vscode-textLink-foreground);
            }
            .code-block {
                background: var(--vscode-textCodeBlock-background);
                padding: 10px;
                border-radius: 4px;
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                margin: 10px 0;
                overflow-x: auto;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🚀 Enhanced AI Chat</h1>
            <p>Extending Cursor's native AI capabilities with advanced features</p>
        </div>
        
        <div class="chat-container">
            <div class="message">
                <strong>System:</strong> Enhanced chat interface is ready! This extends Cursor's native AI with:
            </div>
            <div class="message">
                <strong>Features:</strong> ✅ File analysis, ✅ Code generation, ✅ Multi-AI collaboration, ✅ Enhanced context
            </div>
        </div>
        
        <div class="enhanced-features">
            <h3>🎯 Enhanced Features</h3>
            <div id="features-container">
                <div class="feature-item">
                    <strong>File Analysis:</strong> Analyze current file structure, complexity, and dependencies
                </div>
                <div class="feature-item">
                    <strong>Code Generation:</strong> Generate code based on context and requirements
                </div>
                <div class="feature-item">
                    <strong>AI Collaboration:</strong> Route tasks to the most appropriate AI system
                </div>
                <div class="feature-item">
                    <strong>Context Management:</strong> Enhanced workspace and file context awareness
                </div>
            </div>
        </div>
        
        <script>
            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                
                switch (message.command) {
                    case 'updateEnhancedFeatures':
                        updateFeatures(message.features);
                        break;
                    case 'addMessage':
                        addMessage(message.message);
                        break;
                }
            });
            
            function updateFeatures(features) {
                const container = document.getElementById('features-container');
                if (features.fileContext) {
                    container.innerHTML += \`
                        <div class="feature-item">
                            <strong>📁 Current File:</strong> \${features.fileContext.fileName} 
                            (Complexity: \${features.fileContext.complexity}/10)
                        </div>
                    \`;
                }
            }
            
            function addMessage(message) {
                const container = document.querySelector('.chat-container');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message';
                
                if (message.type === 'codePreview') {
                    messageDiv.innerHTML = \`
                        <strong>\${message.content}</strong><br>
                        <div class="code-block">\${message.code}</div>
                        <em>Suggestions: \${message.suggestions.join(', ')}</em>
                    \`;
                } else {
                    messageDiv.innerHTML = \`<strong>\${message.content}</strong>\`;
                }
                
                container.appendChild(messageDiv);
            }
        </script>
    </body>
    </html>`;
  }

  /**
   * Handle webview messages
   */
  private handleWebviewMessage(message: any): void {
    switch (message.command) {
      case 'analyzeFile':
        this.addFileContext(message.filePath);
        break;
      case 'generateCode':
        this.integrateCodeGeneration(message.prompt);
        break;
      case 'extendChat':
        this.extendChat(message.message);
        break;
    }
  }

  /**
   * Update chat state
   */
  private updateChatState(message: string, enhancedFeatures: any): void {
    this.currentChatState.lastMessage = message;
    this.currentChatState.lastFeatures = enhancedFeatures;
    this.currentChatState.timestamp = new Date().toISOString();
  }

  /**
   * Get current chat state
   */
  getCurrentChatState(): any {
    return this.currentChatState;
  }

  /**
   * Get enhanced features
   */
  getEnhancedFeatures(): any {
    return this.enhancedFeatures;
  }
}
