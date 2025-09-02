"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemocraticRouter = void 0;
const interfaces_1 = require("../types/interfaces");
class DemocraticRouter {
    constructor() {
        this.taskClassificationCache = new Map();
        this.confidenceCache = new Map();
    }
    async analyzeTask(userMessage, context) {
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
        const rationale = this.generateSelectionRationale(selectedAI, taskType, cursorConfidence, claudeConfidence, collaborationMode);
        return {
            primary_ai: selectedAI,
            secondary_ai: secondaryAI,
            collaboration_mode: collaborationMode,
            confidence_scores: { cursor: cursorConfidence, claude: claudeConfidence },
            cost_estimate: costEstimate,
            selection_rationale: rationale
        };
    }
    async classifyTask(userMessage, context) {
        // Cache check
        const cacheKey = userMessage.toLowerCase().substring(0, 50);
        if (this.taskClassificationCache.has(cacheKey)) {
            return this.taskClassificationCache.get(cacheKey);
        }
        const message = userMessage.toLowerCase();
        // Implementation patterns
        if (message.includes('implement') || message.includes('create') || message.includes('build') || message.includes('add function')) {
            return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.CODE_IMPLEMENTATION);
        }
        // Debugging patterns  
        if (message.includes('debug') || message.includes('fix') || message.includes('error') || message.includes('not working')) {
            return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.DEBUGGING);
        }
        // Refactoring patterns
        if (message.includes('refactor') || message.includes('optimize') || message.includes('clean up') || message.includes('improve')) {
            return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.REFACTORING);
        }
        // Strategic analysis patterns
        if (message.includes('architecture') || message.includes('design') || message.includes('approach') || message.includes('strategy')) {
            return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.STRATEGIC_ANALYSIS);
        }
        // Documentation patterns
        if (message.includes('document') || message.includes('explain') || message.includes('comment') || message.includes('readme')) {
            return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.DOCUMENTATION);
        }
        // Code review patterns
        if (message.includes('review') || message.includes('check') || message.includes('analyze code')) {
            return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.CODE_REVIEW);
        }
        // Testing patterns
        if (message.includes('test') || message.includes('spec') || message.includes('unit test')) {
            return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.TESTING);
        }
        // Default based on file context
        if (context.file_context.length > 0 && context.file_context[0].is_active) {
            return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.CODE_IMPLEMENTATION);
        }
        return this.cacheAndReturn(cacheKey, interfaces_1.TaskType.STRATEGIC_ANALYSIS);
    }
    cacheAndReturn(key, taskType) {
        this.taskClassificationCache.set(key, taskType);
        return taskType;
    }
    async assessComplexity(message, context, taskType) {
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
        if (activeFiles.length > 3)
            complexityScore += 1;
        if (activeFiles.some(f => f.language === 'typescript' || f.language === 'rust'))
            complexityScore += 1;
        // Code selection complexity
        if (context.current_task?.selected_code && context.current_task.selected_code.length > 500) {
            complexityScore += 1;
        }
        // Task type base complexity
        const taskComplexity = {
            [interfaces_1.TaskType.STRATEGIC_ANALYSIS]: 2,
            [interfaces_1.TaskType.ARCHITECTURE_DESIGN]: 2,
            [interfaces_1.TaskType.CODE_IMPLEMENTATION]: 1,
            [interfaces_1.TaskType.DEBUGGING]: 1,
            [interfaces_1.TaskType.REFACTORING]: 1,
            [interfaces_1.TaskType.DOCUMENTATION]: 0,
            [interfaces_1.TaskType.TESTING]: 1,
            [interfaces_1.TaskType.CODE_REVIEW]: 1,
            [interfaces_1.TaskType.PERFORMANCE_OPTIMIZATION]: 2,
            [interfaces_1.TaskType.FILE_NAVIGATION]: 0,
            [interfaces_1.TaskType.RESEARCH]: 1
        }[taskType] || 1;
        complexityScore += taskComplexity;
        if (complexityScore >= 4)
            return 'high';
        if (complexityScore >= 2)
            return 'medium';
        return 'low';
    }
    calculateCursorConfidence(taskType, complexity, context) {
        // Base confidence scores for Cursor (strengths: IDE integration, visual debugging, real-time coding)
        const baseConfidence = {
            [interfaces_1.TaskType.CODE_IMPLEMENTATION]: 0.98,
            [interfaces_1.TaskType.DEBUGGING]: 0.95,
            [interfaces_1.TaskType.REFACTORING]: 0.92,
            [interfaces_1.TaskType.FILE_NAVIGATION]: 0.99,
            [interfaces_1.TaskType.TESTING]: 0.85,
            [interfaces_1.TaskType.PERFORMANCE_OPTIMIZATION]: 0.80,
            [interfaces_1.TaskType.CODE_REVIEW]: 0.75,
            [interfaces_1.TaskType.STRATEGIC_ANALYSIS]: 0.65,
            [interfaces_1.TaskType.ARCHITECTURE_DESIGN]: 0.70,
            [interfaces_1.TaskType.DOCUMENTATION]: 0.75,
            [interfaces_1.TaskType.RESEARCH]: 0.60
        }[taskType] || 0.70;
        // Complexity adjustment (Cursor handles complexity well in coding tasks)
        const complexityMultiplier = {
            'low': 1.0,
            'medium': 1.05,
            'high': taskType === interfaces_1.TaskType.CODE_IMPLEMENTATION ? 1.1 : 0.95
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
    calculateClaudeConfidence(taskType, complexity, context) {
        // Base confidence scores for Claude (strengths: reasoning, analysis, strategic thinking)
        const baseConfidence = {
            [interfaces_1.TaskType.STRATEGIC_ANALYSIS]: 0.98,
            [interfaces_1.TaskType.ARCHITECTURE_DESIGN]: 0.95,
            [interfaces_1.TaskType.DOCUMENTATION]: 0.95,
            [interfaces_1.TaskType.CODE_REVIEW]: 0.90,
            [interfaces_1.TaskType.RESEARCH]: 0.92,
            [interfaces_1.TaskType.CODE_IMPLEMENTATION]: 0.85,
            [interfaces_1.TaskType.DEBUGGING]: 0.80,
            [interfaces_1.TaskType.REFACTORING]: 0.82,
            [interfaces_1.TaskType.TESTING]: 0.78,
            [interfaces_1.TaskType.PERFORMANCE_OPTIMIZATION]: 0.85,
            [interfaces_1.TaskType.FILE_NAVIGATION]: 0.60
        }[taskType] || 0.75;
        // Complexity adjustment (Claude handles high complexity better in analytical tasks)
        const complexityMultiplier = {
            'low': 0.95,
            'medium': 1.0,
            'high': [interfaces_1.TaskType.STRATEGIC_ANALYSIS, interfaces_1.TaskType.ARCHITECTURE_DESIGN, interfaces_1.TaskType.RESEARCH].includes(taskType) ? 1.15 : 1.05
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
    determineCollaborationMode(confidenceGap, taskType) {
        // Very close confidence - parallel collaboration
        if (confidenceGap < 0.1) {
            return interfaces_1.CollaborationMode.PARALLEL;
        }
        // Moderate gap - sequential with handoff potential
        if (confidenceGap < 0.2) {
            return interfaces_1.CollaborationMode.DEMOCRATIC_HANDOFF;
        }
        // Large gap - clear leader
        if (taskType === interfaces_1.TaskType.CODE_IMPLEMENTATION || taskType === interfaces_1.TaskType.DEBUGGING) {
            return interfaces_1.CollaborationMode.CURSOR_LEAD;
        }
        else if (taskType === interfaces_1.TaskType.STRATEGIC_ANALYSIS || taskType === interfaces_1.TaskType.DOCUMENTATION) {
            return interfaces_1.CollaborationMode.CLAUDE_LEAD;
        }
        return interfaces_1.CollaborationMode.SEQUENTIAL;
    }
    estimateCost(taskType, complexity, selectedAI) {
        // Token estimation based on task type and complexity
        const baseTokens = {
            [interfaces_1.TaskType.CODE_IMPLEMENTATION]: { low: 800, medium: 1500, high: 3000 },
            [interfaces_1.TaskType.STRATEGIC_ANALYSIS]: { low: 1200, medium: 2000, high: 4000 },
            [interfaces_1.TaskType.DEBUGGING]: { low: 600, medium: 1000, high: 2000 },
            [interfaces_1.TaskType.DOCUMENTATION]: { low: 1000, medium: 1800, high: 3500 },
            [interfaces_1.TaskType.REFACTORING]: { low: 700, medium: 1300, high: 2500 },
            [interfaces_1.TaskType.CODE_REVIEW]: { low: 900, medium: 1600, high: 3000 },
            [interfaces_1.TaskType.TESTING]: { low: 500, medium: 900, high: 1800 },
            [interfaces_1.TaskType.ARCHITECTURE_DESIGN]: { low: 1500, medium: 2500, high: 5000 },
            [interfaces_1.TaskType.PERFORMANCE_OPTIMIZATION]: { low: 800, medium: 1400, high: 2800 },
            [interfaces_1.TaskType.FILE_NAVIGATION]: { low: 200, medium: 400, high: 800 },
            [interfaces_1.TaskType.RESEARCH]: { low: 1000, medium: 2000, high: 4000 }
        }[taskType] || { low: 500, medium: 1000, high: 2000 };
        const estimatedTokens = baseTokens[complexity];
        // Cost per token (realistic estimates)
        const costPerToken = {
            cursor: 0.000002, // Very cost effective
            claude: 0.000003 // Claude-3.5-Sonnet pricing
        }[selectedAI];
        return estimatedTokens * costPerToken;
    }
    generateSelectionRationale(selectedAI, taskType, cursorConfidence, claudeConfidence, collaborationMode) {
        const confidenceGap = Math.abs(cursorConfidence - claudeConfidence);
        const winnerConfidence = Math.max(cursorConfidence, claudeConfidence);
        const aiStrengths = {
            cursor: "IDE integration, visual debugging, real-time coding",
            claude: "strategic analysis, reasoning, comprehensive documentation"
        };
        const taskDescriptions = {
            [interfaces_1.TaskType.CODE_IMPLEMENTATION]: "code implementation",
            [interfaces_1.TaskType.STRATEGIC_ANALYSIS]: "strategic analysis",
            [interfaces_1.TaskType.DEBUGGING]: "debugging",
            [interfaces_1.TaskType.DOCUMENTATION]: "documentation",
            [interfaces_1.TaskType.REFACTORING]: "refactoring",
            [interfaces_1.TaskType.CODE_REVIEW]: "code review",
            [interfaces_1.TaskType.TESTING]: "testing",
            [interfaces_1.TaskType.ARCHITECTURE_DESIGN]: "architecture design",
            [interfaces_1.TaskType.PERFORMANCE_OPTIMIZATION]: "performance optimization",
            [interfaces_1.TaskType.FILE_NAVIGATION]: "file navigation",
            [interfaces_1.TaskType.RESEARCH]: "research"
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
    getCachedConfidence(message) {
        const cacheKey = message.toLowerCase().substring(0, 50);
        return this.confidenceCache.get(cacheKey) || null;
    }
    // Clear caches periodically to prevent memory leaks
    clearCaches() {
        this.taskClassificationCache.clear();
        this.confidenceCache.clear();
    }
}
exports.DemocraticRouter = DemocraticRouter;
//# sourceMappingURL=democratic-router.js.map