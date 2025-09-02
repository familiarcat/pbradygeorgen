import * as vscode from 'vscode';
import { DemocraticRouter } from './democratic-router';

/**
 * 🚀 LLM Model Optimizer Service
 * 
 * This service optimizes LLM model selection and N8N sub-agent synchronization
 * behind the scenes for maximum performance and cost efficiency.
 */
export class LLMOptimizer {
  private modelPerformanceCache = new Map<string, ModelPerformance>();
  private costOptimizationCache = new Map<string, CostAnalysis>();
  private n8nSyncStatus = new Map<string, N8NSyncStatus>();
  private adaptiveLearning = new AdaptiveLearningEngine();

  constructor() {
    this.initializeModelRegistry();
    this.startN8NSync();
  }

  /**
   * Optimize LLM selection for a given task
   */
  async optimizeLLMSelection(
    task: string, 
    context: any, 
    budget: number = 0.10
  ): Promise<OptimizedLLMSelection> {
    try {
      // 1. Analyze task requirements
      const taskRequirements = await this.analyzeTaskRequirements(task, context);
      
      // 2. Get available models and their capabilities
      const availableModels = await this.getAvailableModels();
      
      // 3. Calculate optimal model selection
      const optimalSelection = await this.calculateOptimalSelection(
        taskRequirements,
        availableModels,
        budget
      );
      
      // 4. Sync with N8N sub-agents
      await this.syncWithN8NSubAgents(optimalSelection, context);
      
      // 5. Update performance metrics
      await this.updatePerformanceMetrics(optimalSelection);
      
      return optimalSelection;
      
    } catch (error) {
      console.error('Error optimizing LLM selection:', error);
      return this.getFallbackSelection();
    }
  }

  /**
   * Analyze task requirements for optimal model selection
   */
  private async analyzeTaskRequirements(task: string, context: any): Promise<TaskRequirements> {
    const requirements: TaskRequirements = {
      complexity: this.calculateTaskComplexity(task),
      language: this.detectLanguageRequirements(context),
      contextSize: this.estimateContextSize(context),
      precision: this.assessPrecisionRequirements(task),
      speed: this.assessSpeedRequirements(task),
      costSensitivity: this.assessCostSensitivity(context),
      specializedCapabilities: this.detectSpecializedCapabilities(task)
    };

    return requirements;
  }

  /**
   * Get available LLM models with capabilities and pricing
   */
  private async getAvailableModels(): Promise<LLMModel[]> {
    return [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        capabilities: ['code_generation', 'complex_reasoning', 'analysis'],
        maxTokens: 200000,
        costPer1kInput: 0.015,
        costPer1kOutput: 0.075,
        speed: 'high',
        precision: 'very_high',
        availability: 'available'
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        provider: 'anthropic',
        capabilities: ['code_generation', 'reasoning', 'analysis'],
        maxTokens: 200000,
        costPer1kInput: 0.003,
        costPer1kOutput: 0.015,
        speed: 'very_high',
        precision: 'high',
        availability: 'available'
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        capabilities: ['code_generation', 'basic_reasoning'],
        maxTokens: 200000,
        costPer1kInput: 0.00025,
        costPer1kOutput: 0.00125,
        speed: 'ultra_high',
        precision: 'medium',
        availability: 'available'
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        capabilities: ['code_generation', 'complex_reasoning', 'analysis'],
        maxTokens: 128000,
        costPer1kInput: 0.01,
        costPer1kOutput: 0.03,
        speed: 'high',
        precision: 'very_high',
        availability: 'available'
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        capabilities: ['code_generation', 'basic_reasoning'],
        maxTokens: 16385,
        costPer1kInput: 0.0005,
        costPer1kOutput: 0.0015,
        speed: 'ultra_high',
        precision: 'medium',
        availability: 'available'
      },
      {
        id: 'llama-3-70b',
        name: 'Llama 3 70B',
        provider: 'meta',
        capabilities: ['code_generation', 'reasoning'],
        maxTokens: 8192,
        costPer1kInput: 0.0001,
        costPer1kOutput: 0.0002,
        speed: 'medium',
        precision: 'high',
        availability: 'available'
      }
    ];
  }

  /**
   * Calculate optimal model selection based on requirements and budget
   */
  private async calculateOptimalSelection(
    requirements: TaskRequirements,
    availableModels: LLMModel[],
    budget: number
  ): Promise<OptimizedLLMSelection> {
    let bestSelection: OptimizedLLMSelection | null = null;
    let bestScore = -1;

    for (const model of availableModels) {
      // Calculate model suitability score
      const suitabilityScore = this.calculateModelSuitability(model, requirements);
      
      // Calculate cost estimate
      const costEstimate = this.estimateModelCost(model, requirements);
      
      // Check if within budget
      if (costEstimate > budget) {
        continue;
      }

      // Calculate overall score (suitability - cost penalty)
      const costPenalty = (costEstimate / budget) * 0.3; // 30% weight for cost
      const overallScore = suitabilityScore - costPenalty;

      if (overallScore > bestScore) {
        bestScore = overallScore;
        bestSelection = {
          primaryModel: model,
          fallbackModel: this.findFallbackModel(model, availableModels),
          costEstimate: costEstimate,
          suitabilityScore: suitabilityScore,
          reasoning: this.generateSelectionReasoning(model, requirements),
          n8nWorkflow: await this.getN8NWorkflowForModel(model),
          performancePrediction: await this.predictPerformance(model, requirements)
        };
      }
    }

    if (!bestSelection) {
      return this.getFallbackSelection();
    }

    return bestSelection;
  }

  /**
   * Calculate model suitability score
   */
  private calculateModelSuitability(model: LLMModel, requirements: TaskRequirements): number {
    let score = 0;

    // Capability matching (40% weight)
    const capabilityMatch = this.calculateCapabilityMatch(model.capabilities, requirements.specializedCapabilities);
    score += capabilityMatch * 0.4;

    // Precision matching (25% weight)
    const precisionMatch = this.calculatePrecisionMatch(model.precision, requirements.precision);
    score += precisionMatch * 0.25;

    // Speed matching (20% weight)
    const speedMatch = this.calculateSpeedMatch(model.speed, requirements.speed);
    score += speedMatch * 0.2;

    // Context size matching (15% weight)
    const contextMatch = this.calculateContextMatch(model.maxTokens, requirements.contextSize);
    score += contextMatch * 0.15;

    return score;
  }

  /**
   * Calculate capability match score
   */
  private calculateCapabilityMatch(modelCapabilities: string[], requiredCapabilities: string[]): number {
    if (requiredCapabilities.length === 0) return 1.0;
    
    const matchedCapabilities = requiredCapabilities.filter(cap => 
      modelCapabilities.includes(cap)
    );
    
    return matchedCapabilities.length / requiredCapabilities.length;
  }

  /**
   * Calculate precision match score
   */
  private calculatePrecisionMatch(modelPrecision: string, requiredPrecision: string): number {
    const precisionLevels = {
      'low': 0.3,
      'medium': 0.6,
      'high': 0.8,
      'very_high': 1.0
    };

    const modelLevel = precisionLevels[modelPrecision as keyof typeof precisionLevels] || 0.5;
    const requiredLevel = precisionLevels[requiredPrecision as keyof typeof precisionLevels] || 0.5;

    if (modelLevel >= requiredLevel) {
      return 1.0; // Model meets or exceeds requirements
    } else {
      return modelLevel / requiredLevel; // Partial match
    }
  }

  /**
   * Calculate speed match score
   */
  private calculateSpeedMatch(modelSpeed: string, requiredSpeed: string): number {
    const speedLevels = {
      'ultra_high': 1.0,
      'very_high': 0.9,
      'high': 0.8,
      'medium': 0.6,
      'low': 0.4
    };

    const modelLevel = speedLevels[modelSpeed as keyof typeof speedLevels] || 0.5;
    const requiredLevel = speedLevels[requiredSpeed as keyof typeof speedLevels] || 0.5;

    if (modelLevel >= requiredLevel) {
      return 1.0; // Model meets or exceeds requirements
    } else {
      return modelLevel / requiredLevel; // Partial match
    }
  }

  /**
   * Calculate context size match score
   */
  private calculateContextMatch(modelMaxTokens: number, requiredContextSize: number): number {
    if (modelMaxTokens >= requiredContextSize) {
      return 1.0; // Model can handle the context
    } else {
      return modelMaxTokens / requiredContextSize; // Partial match
    }
  }

  /**
   * Estimate model cost for the task
   */
  private estimateModelCost(model: LLMModel, requirements: TaskRequirements): number {
    const inputTokens = requirements.contextSize;
    const estimatedOutputTokens = this.estimateOutputTokens(requirements);
    
    const inputCost = (inputTokens / 1000) * model.costPer1kInput;
    const outputCost = (estimatedOutputTokens / 1000) * model.costPer1kOutput;
    
    return inputCost + outputCost;
  }

  /**
   * Estimate output tokens based on task requirements
   */
  private estimateOutputTokens(requirements: TaskRequirements): number {
    let baseTokens = 100; // Base response tokens
    
    if (requirements.complexity === 'high') baseTokens *= 3;
    if (requirements.complexity === 'medium') baseTokens *= 2;
    
    if (requirements.precision === 'very_high') baseTokens *= 1.5;
    if (requirements.precision === 'high') baseTokens *= 1.2;
    
    if (requirements.specializedCapabilities.includes('code_generation')) baseTokens *= 2;
    if (requirements.specializedCapabilities.includes('complex_reasoning')) baseTokens *= 1.8;
    
    return Math.min(baseTokens, 8000); // Cap at reasonable limit
  }

  /**
   * Find fallback model
   */
  private findFallbackModel(primaryModel: LLMModel, availableModels: LLMModel[]): LLMModel {
    // Find a cheaper alternative with similar capabilities
    const fallbackCandidates = availableModels.filter(model => 
      model.id !== primaryModel.id && 
      model.costPer1kInput < primaryModel.costPer1kInput &&
      model.provider === primaryModel.provider
    );

    if (fallbackCandidates.length === 0) {
      // Fall back to cheapest available model
      return availableModels.reduce((cheapest, current) => 
        current.costPer1kInput < cheapest.costPer1kInput ? current : cheapest
      );
    }

    // Return the cheapest fallback candidate
    return fallbackCandidates.reduce((cheapest, current) => 
      current.costPer1kInput < cheapest.costPer1kInput ? current : cheapest
    );
  }

  /**
   * Generate selection reasoning
   */
  private generateSelectionReasoning(model: LLMModel, requirements: TaskRequirements): string {
    const reasons: string[] = [];
    
    if (requirements.specializedCapabilities.includes('code_generation') && 
        model.capabilities.includes('code_generation')) {
      reasons.push('Excellent code generation capabilities');
    }
    
    if (requirements.precision === 'very_high' && model.precision === 'very_high') {
      reasons.push('High precision required and provided');
    }
    
    if (requirements.speed === 'ultra_high' && model.speed === 'ultra_high') {
      reasons.push('Ultra-fast response required');
    }
    
    if (requirements.contextSize > 10000 && model.maxTokens > 100000) {
      reasons.push('Large context handling capability');
    }
    
    const costEfficiency = this.calculateCostEfficiency(model, requirements);
    if (costEfficiency > 0.8) {
      reasons.push('Cost-efficient for task requirements');
    }
    
    return reasons.join('. ') + '.';
  }

  /**
   * Calculate cost efficiency
   */
  private calculateCostEfficiency(model: LLMModel, requirements: TaskRequirements): number {
    const cost = this.estimateModelCost(model, requirements);
    const maxBudget = 0.10; // Default max budget
    
    return Math.max(0, 1 - (cost / maxBudget));
  }

  /**
   * Get N8N workflow for selected model
   */
  private async getN8NWorkflowForModel(model: LLMModel): Promise<string> {
    // Map models to N8N workflows
    const workflowMap: Record<string, string> = {
      'claude-3-opus': 'claude-opus-optimization',
      'claude-3-sonnet': 'claude-sonnet-optimization',
      'claude-3-haiku': 'claude-haiku-optimization',
      'gpt-4-turbo': 'gpt-4-optimization',
      'gpt-3.5-turbo': 'gpt-35-optimization',
      'llama-3-70b': 'llama-3-optimization'
    };
    
    return workflowMap[model.id] || 'default-llm-optimization';
  }

  /**
   * Predict model performance
   */
  private async predictPerformance(model: LLMModel, requirements: TaskRequirements): Promise<PerformancePrediction> {
    // Get historical performance data
    const historicalData = this.modelPerformanceCache.get(model.id);
    
    if (historicalData) {
      const avgResponseTime = historicalData.averageResponseTime;
      const avgAccuracy = historicalData.averageAccuracy;
      const avgCost = historicalData.averageCost;
      
      return {
        predictedResponseTime: avgResponseTime * this.getComplexityMultiplier(requirements.complexity),
        predictedAccuracy: avgAccuracy * this.getPrecisionMultiplier(requirements.precision),
        predictedCost: avgCost * this.getContextMultiplier(requirements.contextSize),
        confidence: 0.8 // High confidence with historical data
      };
    }
    
    // Fallback prediction based on model specifications
    return {
      predictedResponseTime: this.estimateResponseTime(model, requirements),
      predictedAccuracy: this.estimateAccuracy(model, requirements),
      predictedCost: this.estimateModelCost(model, requirements),
      confidence: 0.5 // Medium confidence without historical data
    };
  }

  /**
   * Sync with N8N sub-agents
   */
  private async syncWithN8NSubAgents(selection: OptimizedLLMSelection, context: any): Promise<void> {
    try {
      const workflowId = selection.n8nWorkflow;
      
      // Update N8N workflow with model selection
      await this.updateN8NWorkflow(workflowId, {
        selectedModel: selection.primaryModel.id,
        fallbackModel: selection.fallbackModel.id,
        taskContext: context,
        costEstimate: selection.costEstimate,
        performancePrediction: selection.performancePrediction
      });
      
      // Update sync status
      this.n8nSyncStatus.set(workflowId, {
        lastSync: new Date(),
        status: 'synced',
        modelSelection: selection.primaryModel.id,
        costEstimate: selection.costEstimate
      });
      
      console.log(`✅ N8N workflow ${workflowId} synced with model selection`);
      
    } catch (error) {
      console.error('Error syncing with N8N:', error);
      this.n8nSyncStatus.set(selection.n8NWorkflow, {
        lastSync: new Date(),
        status: 'failed',
        error: error.message,
        modelSelection: selection.primaryModel.id
      });
    }
  }

  /**
   * Update N8N workflow with model selection
   */
  private async updateN8NWorkflow(workflowId: string, data: any): Promise<void> {
    // This would make an API call to N8N to update the workflow
    // For now, we'll simulate the update
    
    const n8nEndpoint = process.env.N8N_ENDPOINT || 'http://localhost:5678';
    const apiKey = process.env.N8N_API_KEY || '';
    
    if (n8nEndpoint && apiKey) {
      // Real N8N API call would go here
      console.log(`Updating N8N workflow ${workflowId} with model selection`);
    } else {
      console.log(`Simulating N8N workflow update for ${workflowId}`);
    }
  }

  /**
   * Update performance metrics after task completion
   */
  async updatePerformanceMetrics(selection: OptimizedLLMSelection, actualResults: any): Promise<void> {
    const modelId = selection.primaryModel.id;
    const currentMetrics = this.modelPerformanceCache.get(modelId) || {
      totalTasks: 0,
      totalResponseTime: 0,
      totalAccuracy: 0,
      totalCost: 0,
      averageResponseTime: 0,
      averageAccuracy: 0,
      averageCost: 0
    };

    // Update metrics
    currentMetrics.totalTasks++;
    currentMetrics.totalResponseTime += actualResults.responseTime;
    currentMetrics.totalAccuracy += actualResults.accuracy;
    currentMetrics.totalCost += actualResults.cost;

    // Recalculate averages
    currentMetrics.averageResponseTime = currentMetrics.totalResponseTime / currentMetrics.totalTasks;
    currentMetrics.averageAccuracy = currentMetrics.totalAccuracy / currentMetrics.totalTasks;
    currentMetrics.averageCost = currentMetrics.totalCost / currentMetrics.totalTasks;

    // Update cache
    this.modelPerformanceCache.set(modelId, currentMetrics);

    // Update adaptive learning
    await this.adaptiveLearning.updateModelPerformance(modelId, actualResults);
  }

  /**
   * Get optimization insights
   */
  getOptimizationInsights(): OptimizationInsights {
    const insights: OptimizationInsights = {
      modelPerformance: Array.from(this.modelPerformanceCache.entries()),
      costOptimization: Array.from(this.costOptimizationCache.entries()),
      n8nSyncStatus: Array.from(this.n8nSyncStatus.entries()),
      recommendations: this.generateOptimizationRecommendations()
    };

    return insights;
  }

  /**
   * Generate optimization recommendations
   */
  private generateOptimizationRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Analyze model performance
    for (const [modelId, performance] of this.modelPerformanceCache.entries()) {
      if (performance.averageResponseTime > 5000) {
        recommendations.push(`Consider faster models for ${modelId} - current avg: ${performance.averageResponseTime}ms`);
      }
      
      if (performance.averageCost > 0.05) {
        recommendations.push(`Consider cost optimization for ${modelId} - current avg: $${performance.averageCost}`);
      }
    }
    
    // Analyze N8N sync status
    for (const [workflowId, status] of this.n8nSyncStatus.entries()) {
      if (status.status === 'failed') {
        recommendations.push(`Fix N8N sync for workflow ${workflowId}: ${status.error}`);
      }
    }
    
    return recommendations;
  }

  /**
   * Initialize model registry
   */
  private initializeModelRegistry(): void {
    console.log('🚀 Initializing LLM Model Registry...');
    // This would load model configurations from a registry or config file
  }

  /**
   * Start N8N synchronization
   */
  private startN8NSync(): void {
    console.log('🔄 Starting N8N Sub-Agent Synchronization...');
    // This would start a background process to keep N8N workflows in sync
  }

  /**
   * Get fallback selection
   */
  private getFallbackSelection(): OptimizedLLMSelection {
    return {
      primaryModel: {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        provider: 'anthropic',
        capabilities: ['code_generation', 'basic_reasoning'],
        maxTokens: 200000,
        costPer1kInput: 0.00025,
        costPer1kOutput: 0.00125,
        speed: 'ultra_high',
        precision: 'medium',
        availability: 'available'
      },
      fallbackModel: {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        capabilities: ['code_generation', 'basic_reasoning'],
        maxTokens: 16385,
        costPer1kInput: 0.0005,
        costPer1kOutput: 0.0015,
        speed: 'ultra_high',
        precision: 'medium',
        availability: 'available'
      },
      costEstimate: 0.001,
      suitabilityScore: 0.7,
      reasoning: 'Fallback to cost-effective models due to optimization failure',
      n8nWorkflow: 'fallback-optimization',
      performancePrediction: {
        predictedResponseTime: 2000,
        predictedAccuracy: 0.7,
        predictedCost: 0.001,
        confidence: 0.6
      }
    };
  }

  // Helper methods for task analysis
  private calculateTaskComplexity(task: string): 'low' | 'medium' | 'high' {
    const complexKeywords = ['analyze', 'optimize', 'refactor', 'architecture', 'design'];
    const mediumKeywords = ['generate', 'create', 'implement', 'debug'];
    
    if (complexKeywords.some(keyword => task.toLowerCase().includes(keyword))) {
      return 'high';
    } else if (mediumKeywords.some(keyword => task.toLowerCase().includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }

  private detectLanguageRequirements(context: any): string[] {
    // Analyze context for programming language requirements
    const languages: string[] = [];
    if (context.file_context?.some((f: any) => f.language)) {
      languages.push(...context.file_context.map((f: any) => f.language));
    }
    return [...new Set(languages)];
  }

  private estimateContextSize(context: any): number {
    let size = 0;
    if (context.file_context) {
      size += context.file_context.reduce((acc: number, f: any) => acc + (f.content?.length || 0), 0);
    }
    return Math.min(size, 100000); // Cap at reasonable size
  }

  private assessPrecisionRequirements(task: string): 'low' | 'medium' | 'high' | 'very_high' {
    if (task.toLowerCase().includes('debug') || task.toLowerCase().includes('optimize')) {
      return 'very_high';
    } else if (task.toLowerCase().includes('generate') || task.toLowerCase().includes('create')) {
      return 'high';
    } else if (task.toLowerCase().includes('explain') || task.toLowerCase().includes('describe')) {
      return 'medium';
    }
    return 'low';
  }

  private assessSpeedRequirements(task: string): 'low' | 'medium' | 'high' | 'very_high' | 'ultra_high' {
    if (task.toLowerCase().includes('real-time') || task.toLowerCase().includes('live')) {
      return 'ultra_high';
    } else if (task.toLowerCase().includes('quick') || task.toLowerCase().includes('fast')) {
      return 'very_high';
    } else if (task.toLowerCase().includes('generate') || task.toLowerCase().includes('create')) {
      return 'high';
    }
    return 'medium';
  }

  private assessCostSensitivity(context: any): 'low' | 'medium' | 'high' {
    // This could be based on user preferences, project budget, etc.
    return 'medium';
  }

  private detectSpecializedCapabilities(task: string): string[] {
    const capabilities: string[] = [];
    
    if (task.toLowerCase().includes('code') || task.toLowerCase().includes('function') || 
        task.toLowerCase().includes('class') || task.toLowerCase().includes('generate')) {
      capabilities.push('code_generation');
    }
    
    if (task.toLowerCase().includes('analyze') || task.toLowerCase().includes('reason') || 
        task.toLowerCase().includes('think') || task.toLowerCase().includes('optimize')) {
      capabilities.push('complex_reasoning');
    }
    
    if (task.toLowerCase().includes('explain') || task.toLowerCase().includes('describe') || 
        task.toLowerCase().includes('summarize')) {
      capabilities.push('analysis');
    }
    
    return capabilities;
  }

  private getComplexityMultiplier(complexity: string): number {
    const multipliers = { 'low': 1.0, 'medium': 1.5, 'high': 2.5 };
    return multipliers[complexity as keyof typeof multipliers] || 1.0;
  }

  private getPrecisionMultiplier(precision: string): number {
    const multipliers = { 'low': 0.8, 'medium': 1.0, 'high': 1.2, 'very_high': 1.5 };
    return multipliers[precision as keyof typeof multipliers] || 1.0;
  }

  private getContextMultiplier(contextSize: number): number {
    if (contextSize < 1000) return 1.0;
    if (contextSize < 10000) return 1.2;
    if (contextSize < 50000) return 1.5;
    return 2.0;
  }

  private estimateResponseTime(model: LLMModel, requirements: TaskRequirements): number {
    let baseTime = 1000; // Base 1 second
    
    // Adjust for model speed
    const speedMultipliers = {
      'ultra_high': 0.5,
      'very_high': 0.7,
      'high': 1.0,
      'medium': 1.5,
      'low': 2.0
    };
    
    baseTime *= speedMultipliers[model.speed as keyof typeof speedMultipliers] || 1.0;
    
    // Adjust for complexity
    baseTime *= this.getComplexityMultiplier(requirements.complexity);
    
    // Adjust for context size
    baseTime *= this.getContextMultiplier(requirements.contextSize);
    
    return Math.round(baseTime);
  }

  private estimateAccuracy(model: LLMModel, requirements: TaskRequirements): number {
    let baseAccuracy = 0.8; // Base 80% accuracy
    
    // Adjust for model precision
    const precisionMultipliers = {
      'low': 0.7,
      'medium': 0.8,
      'high': 0.9,
      'very_high': 0.95
    };
    
    baseAccuracy *= precisionMultipliers[model.precision as keyof typeof precisionMultipliers] || 0.8;
    
    // Adjust for task complexity
    if (requirements.complexity === 'high') baseAccuracy *= 0.9;
    if (requirements.complexity === 'low') baseAccuracy *= 1.1;
    
    return Math.min(baseAccuracy, 0.98); // Cap at 98%
  }
}

/**
 * Adaptive Learning Engine for continuous optimization
 */
class AdaptiveLearningEngine {
  private learningRate = 0.1;
  private performanceHistory = new Map<string, any[]>();

  async updateModelPerformance(modelId: string, results: any): Promise<void> {
    if (!this.performanceHistory.has(modelId)) {
      this.performanceHistory.set(modelId, []);
    }

    const history = this.performanceHistory.get(modelId)!;
    history.push({
      timestamp: new Date(),
      responseTime: results.responseTime,
      accuracy: results.accuracy,
      cost: results.cost,
      taskType: results.taskType
    });

    // Keep only last 100 entries
    if (history.length > 100) {
      history.shift();
    }

    // Update learning parameters based on performance trends
    await this.updateLearningParameters(modelId);
  }

  private async updateLearningParameters(modelId: string): Promise<void> {
    const history = this.performanceHistory.get(modelId);
    if (!history || history.length < 10) return;

    // Analyze performance trends
    const recentPerformance = history.slice(-10);
    const avgResponseTime = recentPerformance.reduce((sum, entry) => sum + entry.responseTime, 0) / recentPerformance.length;
    const avgAccuracy = recentPerformance.reduce((sum, entry) => sum + entry.accuracy, 0) / recentPerformance.length;

    // Adjust learning rate based on performance stability
    if (avgAccuracy > 0.9 && avgResponseTime < 3000) {
      this.learningRate = Math.min(this.learningRate * 1.1, 0.2); // Increase learning rate
    } else if (avgAccuracy < 0.7 || avgResponseTime > 8000) {
      this.learningRate = Math.max(this.learningRate * 0.9, 0.05); // Decrease learning rate
    }
  }
}

// Type definitions
interface LLMModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  maxTokens: number;
  costPer1kInput: number;
  costPer1kOutput: number;
  speed: string;
  precision: string;
  availability: string;
}

interface TaskRequirements {
  complexity: 'low' | 'medium' | 'high';
  language: string[];
  contextSize: number;
  precision: 'low' | 'medium' | 'high' | 'very_high';
  speed: 'low' | 'medium' | 'high' | 'very_high' | 'ultra_high';
  costSensitivity: 'low' | 'medium' | 'high';
  specializedCapabilities: string[];
}

interface OptimizedLLMSelection {
  primaryModel: LLMModel;
  fallbackModel: LLMModel;
  costEstimate: number;
  suitabilityScore: number;
  reasoning: string;
  n8nWorkflow: string;
  performancePrediction: PerformancePrediction;
}

interface PerformancePrediction {
  predictedResponseTime: number;
  predictedAccuracy: number;
  predictedCost: number;
  confidence: number;
}

interface ModelPerformance {
  totalTasks: number;
  totalResponseTime: number;
  totalAccuracy: number;
  totalCost: number;
  averageResponseTime: number;
  averageAccuracy: number;
  averageCost: number;
}

interface CostAnalysis {
  totalSpent: number;
  averageCostPerTask: number;
  costTrend: 'increasing' | 'decreasing' | 'stable';
  budgetUtilization: number;
}

interface N8NSyncStatus {
  lastSync: Date;
  status: 'synced' | 'pending' | 'failed';
  modelSelection?: string;
  costEstimate?: number;
  error?: string;
}

interface OptimizationInsights {
  modelPerformance: [string, ModelPerformance][];
  costOptimization: [string, CostAnalysis][];
  n8nSyncStatus: [string, N8NSyncStatus][];
  recommendations: string[];
}
