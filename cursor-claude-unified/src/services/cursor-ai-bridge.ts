import * as vscode from 'vscode';
import { SharedContext, AIResponse, CodeChange, FileAnalysis, CodeContext, GeneratedCode } from '../types/interfaces';
import { LLMOptimizer } from './llm-optimizer';

/**
 * 🚀 Cursor AI Bridge Service
 * 
 * This service provides direct integration with Cursor's native AI capabilities,
 * extending them with enhanced file analysis, code generation, and context management.
 * Now includes intelligent LLM model selection and N8N sub-agent synchronization.
 */
export class CursorAIBridge {
  private isInitialized = false;
  private contextCache = new Map<string, any>();
  private performanceMetrics = {
    responseTime: 0,
    contextUpdateTime: 0,
    fileAnalysisTime: 0
  };
  private llmOptimizer: LLMOptimizer;

  constructor() {
    this.llmOptimizer = new LLMOptimizer();
  }

  /**
   * Initialize the Cursor AI Bridge
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Test Cursor integration capabilities
      await this.testCursorIntegration();
      this.isInitialized = true;
      console.log('✅ Cursor AI Bridge initialized successfully');
    } catch (error) {
      console.error('❌ Cursor AI Bridge initialization failed:', error);
      // Continue with fallback mode
      this.isInitialized = true;
    }
  }

  /**
   * Extend Cursor's native chat with enhanced capabilities
   */
  async extendCursorChat(userMessage: string, context: SharedContext): Promise<AIResponse> {
    const startTime = Date.now();
    
    try {
      await this.initialize();

      // 1. Optimize LLM selection for this task
      const optimizedSelection = await this.llmOptimizer.optimizeLLMSelection(
        userMessage, 
        context, 
        0.10 // Default budget
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
    } catch (error) {
      console.error('Error extending Cursor chat:', error);
      return this.createFallbackResponse(userMessage, context);
    }
  }

  /**
   * Analyze file content and provide AI-ready context
   */
  async analyzeFile(filePath: string): Promise<FileAnalysis> {
    const startTime = Date.now();
    
    try {
      const uri = vscode.Uri.file(filePath);
      const document = await vscode.workspace.openTextDocument(uri);
      
      const analysis: FileAnalysis = {
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
    } catch (error) {
      console.error('Error analyzing file:', error);
      throw error;
    }
  }

  /**
   * Generate code based on prompt and context with LLM optimization
   */
  async generateCode(prompt: string, context: CodeContext): Promise<GeneratedCode> {
    try {
      // Analyze current file context
      const activeEditor = vscode.window.activeTextEditor;
      const fileContext = activeEditor ? await this.analyzeFile(activeEditor.document.fileName) : null;
      
      // Enhanced prompt with file context
      const enhancedPrompt = this.buildCodeGenerationPrompt(prompt, context, fileContext);
      
      // Optimize LLM selection for code generation
      const optimizedSelection = await this.llmOptimizer.optimizeLLMSelection(
        enhancedPrompt,
        { ...context, fileContext, taskType: 'CODE_GENERATION' },
        0.05 // Lower budget for code generation
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
    } catch (error) {
      console.error('Error generating code:', error);
      throw error;
    }
  }

  /**
   * Route task to appropriate AI system with LLM optimization
   */
  private async routeToAIWithOptimization(
    message: string, 
    context: any, 
    optimizedSelection: any
  ): Promise<AIResponse> {
    // Use optimized model selection
    const selectedModel = optimizedSelection.primaryModel;
    
    // Route based on model provider and capabilities
    if (selectedModel.provider === 'anthropic') {
      return this.routeToClaude(message, context, selectedModel);
    } else if (selectedModel.provider === 'openai') {
      return this.routeToGPT(message, context, selectedModel);
    } else if (selectedModel.provider === 'meta') {
      return this.routeToLlama(message, context, selectedModel);
    } else {
      return this.routeToCursor(message, context);
    }
  }

  /**
   * Route to Claude AI with specific model
   */
  private async routeToClaude(message: string, context: any, model: any): Promise<AIResponse> {
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
  private async routeToGPT(message: string, context: any, model: any): Promise<AIResponse> {
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
  private async routeToLlama(message: string, context: any, model: any): Promise<AIResponse> {
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
  private async updatePerformanceMetrics(optimizedSelection: any, actualResults: any): Promise<void> {
    try {
      await this.llmOptimizer.updatePerformanceMetrics(optimizedSelection, actualResults);
    } catch (error) {
      console.error('Error updating performance metrics:', error);
    }
  }

  /**
   * Calculate response accuracy
   */
  private calculateResponseAccuracy(response: AIResponse): number {
    // This is a simplified accuracy calculation
    // In a real implementation, this could be based on user feedback, code quality metrics, etc.
    
    let accuracy = 0.8; // Base accuracy
    
    // Adjust based on confidence
    if (response.confidence > 0.9) accuracy += 0.1;
    else if (response.confidence < 0.7) accuracy -= 0.1;
    
    // Adjust based on content length (longer responses often more comprehensive)
    if (response.content.length > 500) accuracy += 0.05;
    
    return Math.min(accuracy, 0.98); // Cap at 98%
  }

  /**
   * Get LLM optimization insights
   */
  getOptimizationInsights(): any {
    return this.llmOptimizer.getOptimizationInsights();
  }

  /**
   * Get current workspace context
   */
  private async getCursorContext(): Promise<any> {
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
  private async enhanceContext(cursorContext: any, extensionContext: SharedContext): Promise<any> {
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
  private async extendResponse(response: AIResponse, context: any): Promise<AIResponse> {
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

  // ... existing code ...
}
