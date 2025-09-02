import * as vscode from 'vscode';
import { SharedContext, AISelection, TaskType, TaskContext, CollaborationMode } from '../types/interfaces';

export class DemocraticRouter {
  private taskClassificationCache = new Map<string, TaskType>();
  private confidenceCache = new Map<string, {cursor: number, claude: number}>();

  async analyzeTask(userMessage: string, context: SharedContext): Promise<AISelection> {
    // 1. Classify the task type
    const taskType = await this.classifyTask(userMessage, context);
    
    // 2. Assess complexity
    const complexity = await this.assessComplexity(userMessage, context, taskType);
    
    // 3. Calculate confidence scores
    const cursorConfidence = this.calculateCursorConfidence(taskType, complexity, context);
    const claudeConfidence = this.calculateClaudeConfidence(taskType, complexity, context);
    
    // 4. Determine collaboration mode
    const confidenceGap = Math.abs(cursorConfidence - claudeConfidence);
    const collaborationMode = this.determineCollaborationMode(confidenceGap, taskType);
    
    // 5. Select primary AI
    const selectedAI = cursorConfidence > claudeConfidence ? 'cursor' : 'claude';
    const secondaryAI = selectedAI === 'cursor' ? 'claude' : 'cursor';
    
    // 6. Estimate costs
    const costEstimate = this.estimateCost(taskType, complexity, selectedAI);
    
    // 7. Generate rationale
    const rationale = this.generateSelectionRationale(
      selectedAI, 
      taskType, 
      cursorConfidence, 
      claudeConfidence,
      collaborationMode
    );

    return {
      primary_ai: selectedAI,
      secondary_ai: secondaryAI,
      collaboration_mode: collaborationMode,
      confidence_scores: { cursor: cursorConfidence, claude: claudeConfidence },
      cost_estimate: costEstimate,
      selection_rationale: rationale
    };
  }

  private async classifyTask(userMessage: string, context: SharedContext): Promise<TaskType> {
    // Cache check
    const cacheKey = userMessage.toLowerCase().substring(0, 50);
    if (this.taskClassificationCache.has(cacheKey)) {
      return this.taskClassificationCache.get(cacheKey)!;
    }

    const message = userMessage.toLowerCase();
    
    // Implementation patterns
    if (message.includes('implement') || message.includes('create') || message.includes('build') || message.includes('add function')) {
      return this.cacheAndReturn(cacheKey, TaskType.CODE_IMPLEMENTATION);
    }
    
    // Debugging patterns  
    if (message.includes('debug') || message.includes('fix') || message.includes('error') || message.includes('not working')) {
      return this.cacheAndReturn(cacheKey, TaskType.DEBUGGING);
    }
    
    // Refactoring patterns
    if (message.includes('refactor') || message.includes('optimize') || message.includes('clean up') || message.includes('improve')) {
      return this.cacheAndReturn(cacheKey, TaskType.REFACTORING);
    }
    
    // Strategic analysis patterns
    if (message.includes('architecture') || message.includes('design') || message.includes('approach') || message.includes('strategy')) {
      return this.cacheAndReturn(cacheKey, TaskType.STRATEGIC_ANALYSIS);
    }
    
    // Documentation patterns
    if (message.includes('document') || message.includes('explain') || message.includes('comment') || message.includes('readme')) {
      return this.cacheAndReturn(cacheKey, TaskType.DOCUMENTATION);
    }
    
    // Code review patterns
    if (message.includes('review') || message.includes('check') || message.includes('analyze code')) {
      return this.cacheAndReturn(cacheKey, TaskType.CODE_REVIEW);
    }
    
    // Testing patterns
    if (message.includes('test') || message.includes('spec') || message.includes('unit test')) {
      return this.cacheAndReturn(cacheKey, TaskType.TESTING);
    }

    // Default based on file context
    if (context.file_context.length > 0 && context.file_context[0].is_active) {
      return this.cacheAndReturn(cacheKey, TaskType.CODE_IMPLEMENTATION);
    }

    return this.cacheAndReturn(cacheKey, TaskType.STRATEGIC_ANALYSIS);
  }

  private cacheAndReturn(key: string, taskType: TaskType): TaskType {
    this.taskClassificationCache.set(key, taskType);
    return taskType;
  }

  private async assessComplexity(message: string, context: SharedContext, taskType: TaskType): Promise<'low' | 'medium' | 'high'> {
    let complexityScore = 0;

    // Message indicators
    if (message.includes('complex') || message.includes('advanced') || message.includes('enterprise')) {
      complexityScore += 2;
    }
    if (message.includes('simple') || message.includes('basic') || message.includes('quick')) {
      complexityScore -= 1;
    }

    // File context complexity
    const activeFiles = context.file_context.filter(f => f.is_active);
    if (activeFiles.length > 3) complexityScore += 1;
    if (activeFiles.some(f => f.language === 'typescript' || f.language === 'rust')) complexityScore += 1;

    // Code selection complexity
    if (context.current_task?.selected_code && context.current_task.selected_code.length > 500) {
      complexityScore += 1;
    }

    // Task type base complexity
    const taskComplexity = {
      [TaskType.STRATEGIC_ANALYSIS]: 2,
      [TaskType.ARCHITECTURE_DESIGN]: 2,
      [TaskType.CODE_IMPLEMENTATION]: 1,
      [TaskType.DEBUGGING]: 1,
      [TaskType.REFACTORING]: 1,
      [TaskType.DOCUMENTATION]: 0,
      [TaskType.TESTING]: 1,
      [TaskType.CODE_REVIEW]: 1,
      [TaskType.PERFORMANCE_OPTIMIZATION]: 2,
      [TaskType.FILE_NAVIGATION]: 0,
      [TaskType.RESEARCH]: 1
    }[taskType] || 1;

    complexityScore += taskComplexity;

    if (complexityScore >= 4) return 'high';
    if (complexityScore >= 2) return 'medium';
    return 'low';
  }

  private calculateCursorConfidence(taskType: TaskType, complexity: 'low' | 'medium' | 'high', context: SharedContext): number {
    // Base confidence scores for Cursor (strengths: IDE integration, visual debugging, real-time coding)
    const baseConfidence = {
      [TaskType.CODE_IMPLEMENTATION]: 0.98,
      [TaskType.DEBUGGING]: 0.95,
      [TaskType.REFACTORING]: 0.92,
      [TaskType.FILE_NAVIGATION]: 0.99,
      [TaskType.TESTING]: 0.85,
      [TaskType.PERFORMANCE_OPTIMIZATION]: 0.80,
      [TaskType.CODE_REVIEW]: 0.75,
      [TaskType.STRATEGIC_ANALYSIS]: 0.65,
      [TaskType.ARCHITECTURE_DESIGN]: 0.70,
      [TaskType.DOCUMENTATION]: 0.75,
      [TaskType.RESEARCH]: 0.60
    }[taskType] || 0.70;

    // Complexity adjustment (Cursor handles complexity well in coding tasks)
    const complexityMultiplier = {
      'low': 1.0,
      'medium': 1.05,
      'high': taskType === TaskType.CODE_IMPLEMENTATION ? 1.1 : 0.95
    }[complexity];

    // Context bonuses
    let contextBonus = 0;
    
    // Active file context bonus (Cursor's strength)
    if (context.file_context.some(f => f.is_active)) {
      contextBonus += 0.1;
    }
    
    // Code selection bonus
    if (context.current_task?.selected_code) {
      contextBonus += 0.08;
    }
    
    // Multiple files bonus (IDE navigation)
    if (context.file_context.length > 1) {
      contextBonus += 0.05;
    }

    return Math.min(1.0, (baseConfidence * complexityMultiplier) + contextBonus);
  }

  private calculateClaudeConfidence(taskType: TaskType, complexity: 'low' | 'medium' | 'high', context: SharedContext): number {
    // Base confidence scores for Claude (strengths: reasoning, analysis, strategic thinking)
    const baseConfidence = {
      [TaskType.STRATEGIC_ANALYSIS]: 0.98,
      [TaskType.ARCHITECTURE_DESIGN]: 0.95,
      [TaskType.DOCUMENTATION]: 0.95,
      [TaskType.CODE_REVIEW]: 0.90,
      [TaskType.RESEARCH]: 0.92,
      [TaskType.CODE_IMPLEMENTATION]: 0.85,
      [TaskType.DEBUGGING]: 0.80,
      [TaskType.REFACTORING]: 0.82,
      [TaskType.TESTING]: 0.78,
      [TaskType.PERFORMANCE_OPTIMIZATION]: 0.85,
      [TaskType.FILE_NAVIGATION]: 0.60
    }[taskType] || 0.75;

    // Complexity adjustment (Claude handles high complexity better in analytical tasks)
    const complexityMultiplier = {
      'low': 0.95,
      'medium': 1.0,
      'high': [TaskType.STRATEGIC_ANALYSIS, TaskType.ARCHITECTURE_DESIGN, TaskType.RESEARCH].includes(taskType) ? 1.15 : 1.05
    }[complexity];

    // Context bonuses
    let contextBonus = 0;
    
    // Large codebase analysis bonus
    if (context.file_context.length > 5) {
      contextBonus += 0.08;
    }
    
    // Complex reasoning task bonus
    if (context.current_task?.description.includes('why') || context.current_task?.description.includes('how')) {
      contextBonus += 0.06;
    }

    return Math.min(1.0, (baseConfidence * complexityMultiplier) + contextBonus);
  }

  private determineCollaborationMode(confidenceGap: number, taskType: TaskType): CollaborationMode {
    // Very close confidence - parallel collaboration
    if (confidenceGap < 0.1) {
      return CollaborationMode.PARALLEL;
    }
    
    // Moderate gap - sequential with handoff potential
    if (confidenceGap < 0.2) {
      return CollaborationMode.DEMOCRATIC_HANDOFF;
    }
    
    // Large gap - clear leader
    if (taskType === TaskType.CODE_IMPLEMENTATION || taskType === TaskType.DEBUGGING) {
      return CollaborationMode.CURSOR_LEAD;
    } else if (taskType === TaskType.STRATEGIC_ANALYSIS || taskType === TaskType.DOCUMENTATION) {
      return CollaborationMode.CLAUDE_LEAD;
    }
    
    return CollaborationMode.SEQUENTIAL;
  }

  private estimateCost(taskType: TaskType, complexity: 'low' | 'medium' | 'high', selectedAI: 'cursor' | 'claude'): number {
    // Token estimation based on task type and complexity
    const baseTokens = {
      [TaskType.CODE_IMPLEMENTATION]: { low: 800, medium: 1500, high: 3000 },
      [TaskType.STRATEGIC_ANALYSIS]: { low: 1200, medium: 2000, high: 4000 },
      [TaskType.DEBUGGING]: { low: 600, medium: 1000, high: 2000 },
      [TaskType.DOCUMENTATION]: { low: 1000, medium: 1800, high: 3500 },
      [TaskType.REFACTORING]: { low: 700, medium: 1300, high: 2500 },
      [TaskType.CODE_REVIEW]: { low: 900, medium: 1600, high: 3000 },
      [TaskType.TESTING]: { low: 500, medium: 900, high: 1800 },
      [TaskType.ARCHITECTURE_DESIGN]: { low: 1500, medium: 2500, high: 5000 },
      [TaskType.PERFORMANCE_OPTIMIZATION]: { low: 800, medium: 1400, high: 2800 },
      [TaskType.FILE_NAVIGATION]: { low: 200, medium: 400, high: 800 },
      [TaskType.RESEARCH]: { low: 1000, medium: 2000, high: 4000 }
    }[taskType] || { low: 500, medium: 1000, high: 2000 };

    const estimatedTokens = baseTokens[complexity];

    // Cost per token (realistic estimates)
    const costPerToken = {
      cursor: 0.000002, // Very cost effective
      claude: 0.000003  // Claude-3.5-Sonnet pricing
    }[selectedAI];

    return estimatedTokens * costPerToken;
  }

  private generateSelectionRationale(
    selectedAI: 'cursor' | 'claude',
    taskType: TaskType,
    cursorConfidence: number,
    claudeConfidence: number,
    collaborationMode: CollaborationMode
  ): string {
    const confidenceGap = Math.abs(cursorConfidence - claudeConfidence);
    const winnerConfidence = Math.max(cursorConfidence, claudeConfidence);
    
    const aiStrengths = {
      cursor: "IDE integration, visual debugging, real-time coding",
      claude: "strategic analysis, reasoning, comprehensive documentation"
    };

    const taskDescriptions = {
      [TaskType.CODE_IMPLEMENTATION]: "code implementation",
      [TaskType.STRATEGIC_ANALYSIS]: "strategic analysis", 
      [TaskType.DEBUGGING]: "debugging",
      [TaskType.DOCUMENTATION]: "documentation",
      [TaskType.REFACTORING]: "refactoring",
      [TaskType.CODE_REVIEW]: "code review",
      [TaskType.TESTING]: "testing",
      [TaskType.ARCHITECTURE_DESIGN]: "architecture design",
      [TaskType.PERFORMANCE_OPTIMIZATION]: "performance optimization",
      [TaskType.FILE_NAVIGATION]: "file navigation",
      [TaskType.RESEARCH]: "research"
    };

    let rationale = `Selected @${selectedAI} (${(winnerConfidence * 100).toFixed(1)}% confidence) for ${taskDescriptions[taskType]} task. `;
    
    rationale += `@${selectedAI}'s strengths in ${aiStrengths[selectedAI]} make it the optimal choice. `;
    
    if (confidenceGap < 0.15) {
      const otherAI = selectedAI === 'cursor' ? 'claude' : 'cursor';
      rationale += `@${otherAI} will provide additional perspective with ${(selectedAI === 'cursor' ? claudeConfidence : cursorConfidence) * 100}% confidence. `;
    }
    
    rationale += `Collaboration mode: ${collaborationMode}.`;
    
    return rationale;
  }

  // Public method to get cached confidence scores for UI
  getCachedConfidence(message: string): {cursor: number, claude: number} | null {
    const cacheKey = message.toLowerCase().substring(0, 50);
    return this.confidenceCache.get(cacheKey) || null;
  }

  // Clear caches periodically to prevent memory leaks
  clearCaches(): void {
    this.taskClassificationCache.clear();
    this.confidenceCache.clear();
  }
}