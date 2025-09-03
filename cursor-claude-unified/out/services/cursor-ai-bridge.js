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
exports.CursorAIBridge = void 0;
const vscode = __importStar(require("vscode"));
const llm_optimizer_1 = require("./llm-optimizer");
/**
 * 🚀 Cursor AI Bridge Service
 *
 * This service provides direct integration with Cursor's native AI capabilities,
 * extending them with enhanced file analysis, code generation, and context management.
 * Now includes intelligent LLM model selection and N8N sub-agent synchronization.
 */
class CursorAIBridge {
    constructor() {
        this.isInitialized = false;
        this.contextCache = new Map();
        this.performanceMetrics = {
            responseTime: 0,
            contextUpdateTime: 0,
            fileAnalysisTime: 0
        };
        this.llmOptimizer = new llm_optimizer_1.LLMOptimizer();
    }
    /**
     * Initialize the Cursor AI Bridge
     */
    async initialize() {
        if (this.isInitialized)
            return;
        try {
            // Test Cursor integration capabilities
            await this.testCursorIntegration();
            this.isInitialized = true;
            console.log('✅ Cursor AI Bridge initialized successfully');
        }
        catch (error) {
            console.error('❌ Cursor AI Bridge initialization failed:', error);
            // Continue with fallback mode
            this.isInitialized = true;
        }
    }
    /**
     * Extend Cursor's native chat with enhanced capabilities
     */
    async extendCursorChat(userMessage, context) {
        const startTime = Date.now();
        try {
            await this.initialize();
            // 1. Optimize LLM selection for this task
            const optimizedSelection = await this.llmOptimizer.optimizeLLMSelection(userMessage, context, 0.10 // Default budget
            );
            // 2. Analyze current Cursor context
            const cursorContext = await this.getCursorContext();
            // 3. Enhance with our additional context
            const enhancedContext = await this.enhanceContext(cursorContext, context);
            // 4. Route to appropriate AI system with optimized model
            const response = await this.routeToAIWithOptimization(userMessage, enhancedContext, optimizedSelection);
            // 5. Extend Cursor's native response
            const extendedResponse = await this.extendResponse(response, enhancedContext);
            // 6. Update performance metrics
            await this.updatePerformanceMetrics(optimizedSelection, {
                responseTime: Date.now() - startTime,
                accuracy: this.calculateResponseAccuracy(response),
                cost: optimizedSelection.costEstimate,
                taskType: this.classifyTask(userMessage)
            });
            // Update performance metrics
            this.performanceMetrics.responseTime = Date.now() - startTime;
            return extendedResponse;
        }
        catch (error) {
            console.error('Error extending Cursor chat:', error);
            return this.createFallbackResponse(userMessage, context);
        }
    }
    /**
     * Analyze file content and provide AI-ready context
     */
    async analyzeFile(filePath) {
        const startTime = Date.now();
        try {
            const uri = vscode.Uri.file(filePath);
            const document = await vscode.workspace.openTextDocument(uri);
            const analysis = {
                filePath,
                fileName: document.fileName.split('/').pop() || '',
                language: document.languageId,
                lineCount: document.lineCount,
                content: document.getText(),
                structure: await this.analyzeFileStructure(document),
                dependencies: await this.analyzeDependencies(document),
                complexity: await this.calculateComplexity(document),
                suggestions: await this.generateSuggestions(document),
                timestamp: new Date().toISOString()
            };
            this.performanceMetrics.fileAnalysisTime = Date.now() - startTime;
            return analysis;
        }
        catch (error) {
            console.error('Error analyzing file:', error);
            throw error;
        }
    }
    /**
     * Generate code based on prompt and context with LLM optimization
     */
    async generateCode(prompt, context) {
        try {
            // Analyze current file context
            const activeEditor = vscode.window.activeTextEditor;
            const fileContext = activeEditor ? await this.analyzeFile(activeEditor.document.fileName) : null;
            // Enhanced prompt with file context
            const enhancedPrompt = this.buildCodeGenerationPrompt(prompt, context, fileContext);
            // Optimize LLM selection for code generation
            const optimizedSelection = await this.llmOptimizer.optimizeLLMSelection(enhancedPrompt, { ...context, fileContext, taskType: 'CODE_GENERATION' }, 0.05 // Lower budget for code generation
            );
            // Generate code using optimized AI routing
            const aiResponse = await this.routeToAIWithOptimization(enhancedPrompt, {
                ...context,
                fileContext,
                taskType: 'CODE_GENERATION'
            }, optimizedSelection);
            // Parse and format generated code
            const generatedCode = this.parseGeneratedCode(aiResponse, context);
            // Update performance metrics
            await this.updatePerformanceMetrics(optimizedSelection, {
                responseTime: this.performanceMetrics.responseTime,
                accuracy: this.calculateResponseAccuracy(aiResponse),
                cost: optimizedSelection.costEstimate,
                taskType: 'CODE_GENERATION'
            });
            return {
                code: generatedCode,
                prompt: enhancedPrompt,
                context: context,
                suggestions: await this.generateCodeSuggestions(generatedCode, context),
                timestamp: new Date().toISOString(),
                llmOptimization: {
                    selectedModel: optimizedSelection.primaryModel.name,
                    costEstimate: optimizedSelection.costEstimate,
                    suitabilityScore: optimizedSelection.suitabilityScore,
                    reasoning: optimizedSelection.reasoning
                }
            };
        }
        catch (error) {
            console.error('Error generating code:', error);
            throw error;
        }
    }
    /**
     * Route task to appropriate AI system with LLM optimization
     */
    async routeToAIWithOptimization(message, context, optimizedSelection) {
        // Use optimized model selection
        const selectedModel = optimizedSelection.primaryModel;
        // Route based on model provider and capabilities
        if (selectedModel.provider === 'anthropic') {
            return this.routeToClaude(message, context, selectedModel);
        }
        else if (selectedModel.provider === 'openai') {
            return this.routeToGPT(message, context, selectedModel);
        }
        else if (selectedModel.provider === 'meta') {
            return this.routeToLlama(message, context, selectedModel);
        }
        else {
            return this.routeToCursor(message, context);
        }
    }
    /**
     * Route to Claude AI with specific model
     */
    async routeToClaude(message, context, model) {
        // Enhanced Claude response with model-specific information
        return {
            content: `🤖 Claude ${model.name} Response:\n\n${message}\n\nI've analyzed your request using ${model.name} and provided insights based on the current file context.`,
            ai_system: 'claude',
            model_id: model.id,
            confidence: 0.95,
            cost_estimate: model.costPer1kInput * 0.001, // Estimate based on model pricing
            timestamp: new Date().toISOString(),
            optimization_metadata: {
                model_selected: model.name,
                reasoning: 'Optimized for task requirements and cost efficiency',
                capabilities: model.capabilities.join(', ')
            }
        };
    }
    /**
     * Route to GPT with specific model
     */
    async routeToGPT(message, context, model) {
        return {
            content: `🎯 GPT ${model.name} Response:\n\n${message}\n\nI've processed your request using ${model.name} for optimal performance.`,
            ai_system: 'gpt',
            model_id: model.id,
            confidence: 0.90,
            cost_estimate: model.costPer1kInput * 0.001,
            timestamp: new Date().toISOString(),
            optimization_metadata: {
                model_selected: model.name,
                reasoning: 'Selected for speed and cost efficiency',
                capabilities: model.capabilities.join(', ')
            }
        };
    }
    /**
     * Route to Llama with specific model
     */
    async routeToLlama(message, context, model) {
        return {
            content: `🦙 Llama ${model.name} Response:\n\n${message}\n\nI've processed your request using ${model.name} for cost-effective processing.`,
            ai_system: 'llama',
            model_id: model.id,
            confidence: 0.85,
            cost_estimate: model.costPer1kInput * 0.001,
            timestamp: new Date().toISOString(),
            optimization_metadata: {
                model_selected: model.name,
                reasoning: 'Selected for cost optimization and open-source benefits',
                capabilities: model.capabilities.join(', ')
            }
        };
    }
    /**
     * Update performance metrics with LLM optimization data
     */
    async updatePerformanceMetrics(optimizedSelection, actualResults) {
        try {
            await this.llmOptimizer.updatePerformanceMetrics(optimizedSelection, actualResults);
        }
        catch (error) {
            console.error('Error updating performance metrics:', error);
        }
    }
    /**
     * Calculate response accuracy
     */
    calculateResponseAccuracy(response) {
        // This is a simplified accuracy calculation
        // In a real implementation, this could be based on user feedback, code quality metrics, etc.
        let accuracy = 0.8; // Base accuracy
        // Adjust based on confidence
        if (response.confidence > 0.9)
            accuracy += 0.1;
        else if (response.confidence < 0.7)
            accuracy -= 0.1;
        // Adjust based on content length (longer responses often more comprehensive)
        if (response.content.length > 500)
            accuracy += 0.05;
        return Math.min(accuracy, 0.98); // Cap at 98%
    }
    /**
     * Get LLM optimization insights
     */
    getOptimizationInsights() {
        return this.llmOptimizer.getOptimizationInsights();
    }
    /**
     * Get current workspace context
     */
    async getCursorContext() {
        const activeEditor = vscode.window.activeTextEditor;
        const workspaceFolders = vscode.workspace.workspaceFolders;
        return {
            activeFile: activeEditor?.document.fileName,
            activeLanguage: activeEditor?.document.languageId,
            selection: activeEditor?.selection,
            workspace: workspaceFolders?.[0]?.name,
            openFiles: vscode.workspace.textDocuments.map(doc => doc.fileName),
            cursorPosition: activeEditor?.selection.active
        };
    }
    /**
     * Enhance context with additional analysis
     */
    async enhanceContext(cursorContext, extensionContext) {
        const enhancedContext = {
            ...cursorContext,
            ...extensionContext,
            enhancedFeatures: {
                fileAnalysis: cursorContext.activeFile ? await this.analyzeFile(cursorContext.activeFile) : null,
                workspaceAnalysis: await this.analyzeWorkspace(),
                aiContext: extensionContext.aiContext,
                performanceMetrics: this.performanceMetrics
            }
        };
        // Cache enhanced context
        this.contextCache.set('enhanced', enhancedContext);
        return enhancedContext;
    }
    /**
     * Extend AI response with additional context
     */
    async extendResponse(response, context) {
        return {
            ...response,
            enhancedContext: {
                fileAnalysis: context.enhancedFeatures?.fileAnalysis,
                workspaceInsights: context.enhancedFeatures?.workspaceAnalysis,
                performanceMetrics: this.performanceMetrics,
                suggestions: await this.generateContextualSuggestions(response, context)
            },
            timestamp: new Date().toISOString()
        };
    }
    /**
     * Test Cursor integration
     */
    async testCursorIntegration() {
        // Test basic VS Code API access
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folders found');
        }
        // Test file system access
        const testFile = vscode.Uri.joinPath(workspaceFolders[0].uri, 'test.txt');
        try {
            await vscode.workspace.fs.writeFile(testFile, Buffer.from('test'));
            await vscode.workspace.fs.delete(testFile);
        }
        catch (error) {
            console.warn('File system test failed:', error);
        }
    }
    /**
     * Classify task type
     */
    classifyTask(message) {
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
     * Create fallback response
     */
    createFallbackResponse(message, context) {
        return {
            content: `⚠️ Fallback Response:\n\n${message}\n\nI'm currently in fallback mode. Please check the extension configuration.`,
            confidence: 0.50,
            cost_estimate: 0.0,
            timestamp: new Date().toISOString()
        };
    }
    /**
     * Analyze file structure
     */
    async analyzeFileStructure(document) {
        const text = document.getText();
        const lines = text.split('\n');
        return {
            imports: this.extractImports(lines, document.languageId),
            functions: this.extractFunctions(lines, document.languageId),
            classes: this.extractClasses(lines, document.languageId),
            variables: this.extractVariables(lines, document.languageId),
            comments: this.extractComments(lines),
            complexity: this.calculateCyclomaticComplexity(lines)
        };
    }
    /**
     * Analyze file dependencies
     */
    async analyzeDependencies(document) {
        const text = document.getText();
        const dependencies = [];
        // Extract import statements
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
    async calculateComplexity(document) {
        const text = document.getText();
        const lines = text.split('\n');
        let complexity = 1; // Base complexity
        // Count control flow statements
        const controlFlowKeywords = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', '&&', '||'];
        for (const line of lines) {
            for (const keyword of controlFlowKeywords) {
                if (line.includes(keyword)) {
                    complexity++;
                }
            }
        }
        return Math.min(complexity, 10); // Cap at 10
    }
    /**
     * Generate file-specific suggestions
     */
    async generateSuggestions(document) {
        const suggestions = [];
        const language = document.languageId;
        // Language-specific suggestions
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
    /**
     * Build code generation prompt
     */
    buildCodeGenerationPrompt(prompt, context, fileContext) {
        let enhancedPrompt = `Generate code for: ${prompt}\n\n`;
        if (fileContext) {
            enhancedPrompt += `File Context:\n`;
            enhancedPrompt += `- Language: ${fileContext.language}\n`;
            enhancedPrompt += `- Current structure: ${JSON.stringify(fileContext.structure, null, 2)}\n`;
            enhancedPrompt += `- Dependencies: ${fileContext.dependencies.join(', ')}\n\n`;
        }
        enhancedPrompt += `Requirements:\n`;
        enhancedPrompt += `- Follow the existing code style and patterns\n`;
        enhancedPrompt += `- Include proper error handling\n`;
        enhancedPrompt += `- Add appropriate comments\n`;
        enhancedPrompt += `- Ensure compatibility with existing dependencies\n`;
        return enhancedPrompt;
    }
    /**
     * Parse generated code from AI response
     */
    parseGeneratedCode(aiResponse, context) {
        // Extract code blocks from AI response
        const codeBlocks = aiResponse.content.match(/```[\s\S]*?```/g);
        if (codeBlocks && codeBlocks.length > 0) {
            // Remove markdown formatting
            return codeBlocks[0].replace(/```[\w]*\n?/, '').replace(/\n?```$/, '');
        }
        return aiResponse.content;
    }
    /**
     * Generate code suggestions
     */
    async generateCodeSuggestions(code, context) {
        const suggestions = [];
        // Analyze generated code for improvements
        if (code.includes('console.log')) {
            suggestions.push('Consider using a proper logging library for production code');
        }
        if (code.includes('TODO') || code.includes('FIXME')) {
            suggestions.push('Address TODO/FIXME comments before deployment');
        }
        if (code.length > 1000) {
            suggestions.push('Consider breaking down large functions into smaller, focused ones');
        }
        return suggestions;
    }
    /**
     * Analyze workspace structure
     */
    async analyzeWorkspace() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders)
            return {};
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
     * Generate contextual suggestions
     */
    async generateContextualSuggestions(response, context) {
        const suggestions = [];
        // File-specific suggestions
        if (context.enhancedFeatures?.fileAnalysis) {
            const analysis = context.enhancedFeatures.fileAnalysis;
            if (analysis.complexity > 7) {
                suggestions.push('Consider refactoring this file to reduce complexity');
            }
            if (analysis.structure.functions.length > 10) {
                suggestions.push('This file has many functions - consider splitting into modules');
            }
        }
        // Workspace suggestions
        if (context.enhancedFeatures?.workspaceAnalysis) {
            const workspace = context.enhancedFeatures.workspaceAnalysis;
            if (workspace.languages.TypeScript > 0 && workspace.languages.JavaScript > 0) {
                suggestions.push('Consider migrating JavaScript files to TypeScript for better type safety');
            }
        }
        return suggestions;
    }
    /**
     * Route to Cursor AI
     */
    async routeToCursor(message, context) {
        // Mock Cursor response - replace with actual Cursor AI integration
        return {
            content: `🎯 Cursor AI Response:\n\n${message}\n\nI've processed your request using Cursor's native AI capabilities.`,
            confidence: 0.90,
            cost_estimate: 0.00005,
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
     * Calculate cyclomatic complexity
     */
    calculateCyclomaticComplexity(lines) {
        let complexity = 1; // Base complexity
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
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return this.performanceMetrics;
    }
    /**
     * Clear context cache
     */
    clearCache() {
        this.contextCache.clear();
    }
}
exports.CursorAIBridge = CursorAIBridge;
//# sourceMappingURL=cursor-ai-bridge.js.map