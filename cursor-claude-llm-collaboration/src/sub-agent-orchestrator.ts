import * as vscode from 'vscode';
import axios from 'axios';

interface SubAgent {
    id: string;
    name: string;
    specialization: string;
    n8nCounterpart: string;
    decisionHistory: DecisionRecord[];
    performanceMetrics: PerformanceMetrics;
}

interface DecisionRecord {
    timestamp: Date;
    task: string;
    selectedLLM: string;
    reasoning: string;
    n8nExecutionResult: any;
    success: boolean;
    cost: number;
}

interface PerformanceMetrics {
    totalDecisions: number;
    successfulDecisions: number;
    averageCost: number;
    preferredModels: { [model: string]: number };
}

interface LLMSelectionDecision {
    subAgentId: string;
    task: string;
    selectedLLM: string;
    confidence: number;
    reasoning: string;
    expectedCost: number;
    n8nWorkflow: string;
    delegationPayload: any;
}

class SubAgentOrchestrator {
    private subAgents: Map<string, SubAgent> = new Map();
    private n8nConnector: N8NConnector;
    private llmSelector: IntelligentLLMSelector;

    constructor() {
        this.n8nConnector = new N8NConnector();
        this.llmSelector = new IntelligentLLMSelector();
        this.initializeSubAgents();
    }

    private initializeSubAgents() {
        // Initialize Claude sub-agents that mirror your N8N crew
        const crewMembers = [
            {
                id: 'picard',
                name: 'Captain Jean-Luc Picard',
                specialization: 'strategic_planning',
                n8nCounterpart: 'crew-captain-jean-luc-picard'
            },
            {
                id: 'data',
                name: 'Commander Data',
                specialization: 'complex_analysis',
                n8nCounterpart: 'crew-commander-data'
            },
            {
                id: 'riker',
                name: 'Commander William Riker',
                specialization: 'tactical_execution',
                n8nCounterpart: 'crew-commander-william-riker'
            },
            {
                id: 'geordi',
                name: 'Lieutenant Commander Geordi La Forge',
                specialization: 'engineering_optimization',
                n8nCounterpart: 'crew-lieutenant-commander-geordi-la-forge'
            },
            {
                id: 'troi',
                name: 'Counselor Deanna Troi',
                specialization: 'emotional_intelligence',
                n8nCounterpart: 'crew-counselor-deanna-troi'
            }
        ];

        crewMembers.forEach(member => {
            this.subAgents.set(member.id, {
                ...member,
                decisionHistory: [],
                performanceMetrics: {
                    totalDecisions: 0,
                    successfulDecisions: 0,
                    averageCost: 0,
                    preferredModels: {}
                }
            });
        });
    }

    public async orchestrateTask(task: string, context: any): Promise<LLMSelectionDecision> {
        // 1. Determine which sub-agent should handle this task
        const selectedAgent = this.selectSubAgent(task, context);
        
        // 2. Let the sub-agent autonomously select the optimal LLM
        const llmDecision = await this.llmSelector.getSubAgentDecision(
            selectedAgent,
            task,
            context
        );

        // 3. Delegate to N8N with the sub-agent's LLM choice
        const n8nResult = await this.n8nConnector.executeWithSelectedLLM(
            selectedAgent.n8nCounterpart,
            llmDecision.selectedLLM,
            task,
            llmDecision.delegationPayload
        );

        // 4. Record the decision and learn from the outcome
        await this.recordDecision(selectedAgent.id, task, llmDecision, n8nResult);

        return llmDecision;
    }

    private selectSubAgent(task: string, context: any): SubAgent {
        // Intelligent sub-agent selection based on task type and context
        const taskType = this.classifyTask(task);
        const contextComplexity = this.assessContextComplexity(context);

        let bestAgent: SubAgent | null = null;
        let bestScore = 0;

        for (const agent of this.subAgents.values()) {
            const score = this.calculateAgentFitness(agent, taskType, contextComplexity);
            if (score > bestScore) {
                bestScore = score;
                bestAgent = agent;
            }
        }

        return bestAgent!;
    }

    private async recordDecision(
        agentId: string, 
        task: string, 
        decision: LLMSelectionDecision, 
        result: any
    ) {
        const agent = this.subAgents.get(agentId);
        if (!agent) return;

        const record: DecisionRecord = {
            timestamp: new Date(),
            task,
            selectedLLM: decision.selectedLLM,
            reasoning: decision.reasoning,
            n8nExecutionResult: result,
            success: this.evaluateSuccess(result),
            cost: decision.expectedCost
        };

        agent.decisionHistory.push(record);
        this.updatePerformanceMetrics(agent, record);
    }

    private updatePerformanceMetrics(agent: SubAgent, record: DecisionRecord) {
        const metrics = agent.performanceMetrics;
        metrics.totalDecisions++;
        
        if (record.success) {
            metrics.successfulDecisions++;
        }

        // Update cost average
        const totalCost = metrics.averageCost * (metrics.totalDecisions - 1) + record.cost;
        metrics.averageCost = totalCost / metrics.totalDecisions;

        // Update preferred models
        const model = record.selectedLLM;
        metrics.preferredModels[model] = (metrics.preferredModels[model] || 0) + 1;
    }

    public getSubAgentInsights(): any {
        const insights: { [key: string]: any } = {};
        
        for (const [id, agent] of this.subAgents) {
            insights[id] = {
                name: agent.name,
                specialization: agent.specialization,
                performance: {
                    successRate: agent.performanceMetrics.successfulDecisions / agent.performanceMetrics.totalDecisions,
                    averageCost: agent.performanceMetrics.averageCost,
                    preferredModels: agent.performanceMetrics.preferredModels
                },
                recentDecisions: agent.decisionHistory.slice(-5)
            };
        }

        return insights;
    }

    private classifyTask(task: string): string {
        const lowerTask = task.toLowerCase();
        
        if (lowerTask.includes('strategy') || lowerTask.includes('plan') || lowerTask.includes('vision')) {
            return 'strategic_planning';
        } else if (lowerTask.includes('analyze') || lowerTask.includes('investigate') || lowerTask.includes('research')) {
            return 'complex_analysis';
        } else if (lowerTask.includes('execute') || lowerTask.includes('implement') || lowerTask.includes('deploy')) {
            return 'tactical_execution';
        } else if (lowerTask.includes('optimize') || lowerTask.includes('improve') || lowerTask.includes('engineer')) {
            return 'engineering_optimization';
        } else if (lowerTask.includes('emotion') || lowerTask.includes('feel') || lowerTask.includes('empathy')) {
            return 'emotional_intelligence';
        }
        
        return 'general';
    }

    private assessContextComplexity(context: any): string {
        // Assess complexity based on context factors
        const factors = [
            context.fileCount || 0,
            context.codeComplexity || 0,
            context.dependencyCount || 0,
            context.urgency || 0
        ];
        
        const complexityScore = factors.reduce((sum, factor) => sum + factor, 0);
        
        if (complexityScore > 8) return 'high';
        if (complexityScore > 4) return 'medium';
        return 'low';
    }

    private calculateAgentFitness(agent: SubAgent, taskType: string, complexity: string): number {
        let baseScore = 0;
        
        // Base specialization matching
        if (agent.specialization === taskType) {
            baseScore += 0.8;
        } else if (this.isSpecializationRelated(agent.specialization, taskType)) {
            baseScore += 0.6;
        } else {
            baseScore += 0.3;
        }

        // Performance-based adjustment
        if (agent.performanceMetrics.totalDecisions > 0) {
            const successRate = agent.performanceMetrics.successfulDecisions / agent.performanceMetrics.totalDecisions;
            baseScore += successRate * 0.2;
        }

        // Complexity preference
        if (complexity === 'high' && agent.specialization === 'complex_analysis') {
            baseScore += 0.3;
        }

        return Math.min(baseScore, 1.0);
    }

    private isSpecializationRelated(spec1: string, spec2: string): boolean {
        const relatedPairs = [
            ['strategic_planning', 'tactical_execution'],
            ['complex_analysis', 'engineering_optimization'],
            ['emotional_intelligence', 'strategic_planning']
        ];

        return relatedPairs.some(pair => 
            (pair[0] === spec1 && pair[1] === spec2) ||
            (pair[0] === spec2 && pair[1] === spec1)
        );
    }

    private evaluateSuccess(result: any): boolean {
        // Evaluate N8N execution success
        return result && result.success && !result.error;
    }
}

class IntelligentLLMSelector {
    private llmModels: { [key: string]: { cost: number; specialization: string; reliability: number } } = {
        'claude-sonnet': { cost: 0.000003, specialization: 'strategic_analysis', reliability: 0.95 },
        'gpt-4o': { cost: 0.000005, specialization: 'research', reliability: 0.92 },
        'gemini-pro': { cost: 0.000002, specialization: 'optimization', reliability: 0.88 },
        'llama-3': { cost: 0.000001, specialization: 'code_implementation', reliability: 0.85 }
    };

    public async getSubAgentDecision(
        agent: SubAgent, 
        task: string, 
        context: any
    ): Promise<LLMSelectionDecision> {
        // Sub-agent autonomously analyzes the task and selects optimal LLM
        const taskAnalysis = this.analyzeTaskForAgent(agent, task, context);
        const llmScores = this.scoreLLMsForTask(taskAnalysis);
        
        // Select best LLM based on sub-agent's analysis
        const selectedLLM = this.selectOptimalLLM(llmScores, agent.performanceMetrics);
        
        return {
            subAgentId: agent.id,
            task,
            selectedLLM,
            confidence: llmScores[selectedLLM].score,
            reasoning: this.generateReasoning(agent, taskAnalysis, selectedLLM),
            expectedCost: this.llmModels[selectedLLM].cost * this.estimateTokens(task),
            n8nWorkflow: agent.n8nCounterpart,
            delegationPayload: this.buildDelegationPayload(task, context, selectedLLM)
        };
    }

    private analyzeTaskForAgent(agent: SubAgent, task: string, context: any) {
        // Sub-agent's perspective on the task
        return {
            complexity: this.assessTaskComplexity(task, context),
            urgency: context.urgency || 'normal',
            resourceConstraints: context.resourceConstraints || 'flexible',
            successCriteria: this.extractSuccessCriteria(task),
            agentCapabilities: this.mapAgentCapabilities(agent)
        };
    }

    private scoreLLMsForTask(taskAnalysis: any) {
        const scores: { [key: string]: { score: number, reasoning: string } } = {};
        
        for (const [model, config] of Object.entries(this.llmModels)) {
            let score = 0;
            let reasoning = '';

            // Specialization matching
            if (config.specialization === taskAnalysis.complexity) {
                score += 0.4;
                reasoning += 'Perfect specialization match. ';
            }

            // Cost efficiency
            const costEfficiency = 1 / config.cost;
            score += (costEfficiency / 1000000) * 0.3;

            // Reliability
            score += config.reliability * 0.3;

            scores[model] = { score, reasoning };
        }

        return scores;
    }

    private selectOptimalLLM(
        scores: { [key: string]: { score: number, reasoning: string } },
        performanceMetrics: PerformanceMetrics
    ): string {
        let bestModel = '';
        let bestScore = 0;

        for (const [model, data] of Object.entries(scores)) {
            // Adjust score based on historical performance
            const historicalSuccess = performanceMetrics.preferredModels[model] || 0;
            const adjustedScore = data.score + (historicalSuccess * 0.1);

            if (adjustedScore > bestScore) {
                bestScore = adjustedScore;
                bestModel = model;
            }
        }

        return bestModel;
    }

    private generateReasoning(agent: SubAgent, taskAnalysis: any, selectedLLM: string): string {
        return `As ${agent.name}, I've analyzed this ${taskAnalysis.complexity} complexity task and selected ${selectedLLM} because it excels at ${this.llmModels[selectedLLM].specialization}. The task requires ${taskAnalysis.successCriteria.join(', ')} which aligns with ${selectedLLM}'s strengths.`;
    }

    private estimateTokens(task: string): number {
        return Math.ceil(task.length / 4) + 100; // Base tokens + context overhead
    }

    private buildDelegationPayload(task: string, context: any, selectedLLM: string) {
        return {
            task,
            context,
            selectedLLM,
            timestamp: new Date().toISOString(),
            agentReasoning: `LLM ${selectedLLM} selected for optimal performance`,
            expectedOutcome: 'High-quality, cost-effective execution'
        };
    }

    private assessTaskComplexity(task: string, context: any): string {
        const factors = [
            task.length > 200 ? 2 : 1,
            context.fileCount > 5 ? 2 : 1,
            context.urgency === 'high' ? 2 : 1
        ];
        
        const complexityScore = factors.reduce((sum, factor) => sum + factor, 0);
        
        if (complexityScore >= 5) return 'high';
        if (complexityScore >= 3) return 'medium';
        return 'low';
    }

    private extractSuccessCriteria(task: string): string[] {
        const criteria = [];
        if (task.includes('fast') || task.includes('quick')) criteria.push('speed');
        if (task.includes('accurate') || task.includes('precise')) criteria.push('accuracy');
        if (task.includes('cost') || task.includes('efficient')) criteria.push('cost-efficiency');
        if (task.includes('quality') || task.includes('excellent')) criteria.push('quality');
        
        return criteria.length > 0 ? criteria : ['quality', 'efficiency'];
    }

    private mapAgentCapabilities(agent: SubAgent): string[] {
        const capabilityMap: { [key: string]: string[] } = {
            'strategic_planning': ['vision', 'planning', 'leadership'],
            'complex_analysis': ['analysis', 'investigation', 'research'],
            'tactical_execution': ['implementation', 'deployment', 'execution'],
            'engineering_optimization': ['optimization', 'engineering', 'efficiency'],
            'emotional_intelligence': ['empathy', 'understanding', 'communication']
        };

        return capabilityMap[agent.specialization] || ['general'];
    }
}

class N8NConnector {
    private baseUrl: string;
    private apiKey: string;

    constructor() {
        this.baseUrl = process.env.N8N_BASE_URL || '';
        this.apiKey = process.env.N8N_API_KEY || '';
    }

    public async executeWithSelectedLLM(
        workflowId: string,
        selectedLLM: string,
        task: string,
        payload: any
    ): Promise<any> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/webhook/${workflowId}`,
                {
                    ...payload,
                    selectedLLM,
                    executionMode: 'llm_optimized',
                    timestamp: new Date().toISOString()
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                success: true,
                result: response.data,
                selectedLLM,
                executionTime: new Date().toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                selectedLLM,
                executionTime: new Date().toISOString()
            };
        }
    }
}

export { SubAgentOrchestrator, SubAgent, LLMSelectionDecision };
