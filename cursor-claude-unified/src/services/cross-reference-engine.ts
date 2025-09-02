import * as vscode from 'vscode';
import { 
  SharedContext, 
  UnifiedResponse, 
  AIResponse, 
  AISelection, 
  CrossReference, 
  AIMessage 
} from '../types/interfaces';
import { ClaudeIntegration } from './claude-integration';
import { CursorIntegration } from './cursor-integration';

export class CrossReferenceEngine {
  private claudeIntegration: ClaudeIntegration;
  private cursorIntegration: CursorIntegration;

  constructor() {
    this.claudeIntegration = new ClaudeIntegration();
    this.cursorIntegration = new CursorIntegration();
  }

  async generateUnifiedResponse(
    selection: AISelection,
    userMessage: string,
    context: SharedContext
  ): Promise<UnifiedResponse> {
    
    // 1. Generate primary AI response
    const primaryResponse = await this.generatePrimaryResponse(
      selection.primary_ai,
      userMessage,
      context
    );

    // 2. Generate secondary AI enhancement with cross-references
    const secondaryResponse = await this.generateSecondaryEnhancement(
      selection.secondary_ai,
      selection.primary_ai,
      primaryResponse,
      userMessage,
      context
    );

    // 3. Extract cross-references
    const crossReferences = this.extractCrossReferences(primaryResponse, secondaryResponse);

    // 4. Calculate total cost
    const totalCost = this.calculateTotalCost(primaryResponse, secondaryResponse, selection);

    // 5. Build unified response
    return {
      thread_id: context.thread_id,
      timestamp: new Date().toISOString(),
      primary_ai: selection.primary_ai,
      secondary_ai: selection.secondary_ai,
      primary_response: primaryResponse,
      secondary_enhancement: secondaryResponse,
      democratic_decision: {
        selected_ai: selection.primary_ai,
        confidence_gap: Math.abs(selection.confidence_scores.cursor - selection.confidence_scores.claude),
        task_analysis: this.generateTaskAnalysis(userMessage, context),
        cost_comparison: {
          cursor: selection.primary_ai === 'cursor' ? selection.cost_estimate : selection.cost_estimate * 0.67,
          claude: selection.primary_ai === 'claude' ? selection.cost_estimate : selection.cost_estimate * 1.5
        },
        rationale: selection.selection_rationale
      },
      cross_references: crossReferences,
      total_cost: totalCost
    };
  }

  private async generatePrimaryResponse(
    ai: 'cursor' | 'claude',
    userMessage: string,
    context: SharedContext
  ): Promise<AIResponse> {
    
    const enhancedPrompt = this.buildEnhancedPrompt(ai, userMessage, context, true);
    
    try {
      if (ai === 'claude') {
        return await this.claudeIntegration.sendMessage(enhancedPrompt, context);
      } else {
        return await this.cursorIntegration.sendMessage(enhancedPrompt, context);
      }
    } catch (error) {
      // Fallback response with error handling
      return {
        ai_source: ai,
        content: `I encountered an error while processing your request: ${error}. Let me try a different approach...`,
        confidence: 0.3,
        reasoning: 'Error recovery response',
        code_changes: [],
        file_suggestions: [],
        follow_up_questions: ['Would you like me to try a different approach?']
      };
    }
  }

  private async generateSecondaryEnhancement(
    secondaryAI: 'cursor' | 'claude',
    primaryAI: 'cursor' | 'claude',
    primaryResponse: AIResponse,
    userMessage: string,
    context: SharedContext
  ): Promise<AIResponse> {
    
    // Build enhancement prompt that references the primary AI's response
    const enhancementPrompt = `
    Your colleague @${primaryAI} just responded to the user's request: "${userMessage}"
    
    @${primaryAI}'s response:
    "${primaryResponse.content}"
    
    As @${secondaryAI}, provide your perspective by:
    1. Building upon @${primaryAI}'s suggestions
    2. Adding complementary insights from your expertise
    3. Identifying any gaps or alternative approaches  
    4. Asking clarifying questions if needed
    
    Use @${primaryAI} notation when referencing their response.
    Focus on collaboration, not competition.
    
    Context:
    ${this.buildContextString(context)}
    `;

    try {
      if (secondaryAI === 'claude') {
        return await this.claudeIntegration.sendMessage(enhancementPrompt, context);
      } else {
        return await this.cursorIntegration.sendMessage(enhancementPrompt, context);
      }
    } catch (error) {
      // Fallback enhancement
      return {
        ai_source: secondaryAI,
        content: `@${primaryAI} provided a solid approach. I agree with their analysis and would add that this solution looks comprehensive. Great collaboration!`,
        confidence: 0.7,
        reasoning: 'Fallback collaborative response',
        code_changes: [],
        file_suggestions: [],
        follow_up_questions: []
      };
    }
  }

  private buildEnhancedPrompt(
    ai: 'cursor' | 'claude',
    userMessage: string,
    context: SharedContext,
    isPrimary: boolean
  ): string {
    const aiPersonality = {
      cursor: {
        role: "Cursor AI - IDE integration specialist",
        strengths: "visual debugging, real-time coding, file navigation",
        style: "practical, code-focused, IDE-aware"
      },
      claude: {
        role: "Claude - Strategic analysis specialist", 
        strengths: "reasoning, architecture design, comprehensive analysis",
        style: "thoughtful, strategic, detail-oriented"
      }
    }[ai];

    const conversationHistory = this.getRecentConversationHistory(context, 3);
    const fileContext = this.buildFileContextString(context);
    
    return `
    You are ${aiPersonality.role}, collaborating with ${ai === 'cursor' ? 'Claude' : 'Cursor AI'} in a unified chat.
    
    Your strengths: ${aiPersonality.strengths}
    Your style: ${aiPersonality.style}
    
    User's request: "${userMessage}"
    
    Recent conversation:
    ${conversationHistory}
    
    Current context:
    ${fileContext}
    
    Workspace context:
    - Project: ${context.workspace_context.project_type}
    - Languages: ${context.workspace_context.languages.join(', ')}
    - Framework: ${context.workspace_context.framework || 'Not specified'}
    
    ${isPrimary 
      ? 'As the primary AI for this task, provide a comprehensive response leveraging your expertise.'
      : 'As the secondary AI, enhance and build upon the primary response with your unique perspective.'
    }
    
    Important: 
    - Be naturally collaborative
    - Reference specific code/files when relevant
    - Ask follow-up questions if needed
    - Suggest next steps
    `;
  }

  private buildContextString(context: SharedContext): string {
    const activeFile = context.file_context.find(f => f.is_active);
    const selectedCode = context.current_task?.selected_code;
    
    let contextStr = '';
    
    if (activeFile) {
      contextStr += `Active file: ${activeFile.filename} (${activeFile.language})\n`;
    }
    
    if (selectedCode) {
      contextStr += `Selected code:\n\`\`\`\n${selectedCode}\n\`\`\`\n`;
    }
    
    if (context.file_context.length > 1) {
      contextStr += `Other open files: ${context.file_context.filter(f => !f.is_active).map(f => f.filename).join(', ')}\n`;
    }
    
    return contextStr;
  }

  private buildFileContextString(context: SharedContext): string {
    return context.file_context
      .slice(0, 3) // Limit to 3 most relevant files
      .map(file => `- ${file.filename}: ${file.content_preview}`)
      .join('\n');
  }

  private getRecentConversationHistory(context: SharedContext, limit: number = 3): string {
    return context.conversation_history
      .slice(-limit)
      .map(msg => `@${msg.ai_source}: ${msg.message.substring(0, 200)}...`)
      .join('\n');
  }

  private extractCrossReferences(
    primaryResponse: AIResponse,
    secondaryResponse: AIResponse
  ): CrossReference[] {
    const crossReferences: CrossReference[] = [];
    
    // Extract @mentions from secondary response
    const mentionRegex = /@(cursor|claude)/gi;
    const mentions = secondaryResponse.content.match(mentionRegex) || [];
    
    mentions.forEach(mention => {
      const mentionedAI = mention.toLowerCase().replace('@', '') as 'cursor' | 'claude';
      
      // Find the context around the mention
      const mentionIndex = secondaryResponse.content.indexOf(mention);
      const contextStart = Math.max(0, mentionIndex - 50);
      const contextEnd = Math.min(secondaryResponse.content.length, mentionIndex + 100);
      const context = secondaryResponse.content.substring(contextStart, contextEnd);
      
      // Determine reference type based on surrounding words
      let referenceType: 'agreement' | 'enhancement' | 'alternative' | 'question' = 'enhancement';
      
      if (context.includes('agree') || context.includes('correct') || context.includes('exactly')) {
        referenceType = 'agreement';
      } else if (context.includes('alternatively') || context.includes('different') || context.includes('instead')) {
        referenceType = 'alternative';
      } else if (context.includes('?') || context.includes('clarify') || context.includes('question')) {
        referenceType = 'question';
      }
      
      crossReferences.push({
        from_ai: secondaryResponse.ai_source,
        to_ai: mentionedAI,
        reference_type: referenceType,
        content: context,
        context: 'collaborative_response'
      });
    });
    
    return crossReferences;
  }

  private generateTaskAnalysis(userMessage: string, context: SharedContext): string {
    const activeFile = context.file_context.find(f => f.is_active);
    const hasSelection = !!context.current_task?.selected_code;
    const messageLength = userMessage.length;
    
    let analysis = `Task analysis: `;
    
    if (messageLength < 50) {
      analysis += 'Concise request, ';
    } else if (messageLength > 200) {
      analysis += 'Detailed request, ';
    } else {
      analysis += 'Standard request, ';
    }
    
    if (activeFile) {
      analysis += `working with ${activeFile.language} file (${activeFile.filename}), `;
    }
    
    if (hasSelection) {
      analysis += 'specific code selection provided, ';
    }
    
    if (context.file_context.length > 3) {
      analysis += 'complex multi-file context. ';
    } else {
      analysis += 'focused context. ';
    }
    
    return analysis;
  }

  private calculateTotalCost(
    primaryResponse: AIResponse,
    secondaryResponse: AIResponse,
    selection: AISelection
  ): number {
    // Estimate token usage from response lengths
    const primaryTokens = this.estimateTokens(primaryResponse.content);
    const secondaryTokens = this.estimateTokens(secondaryResponse.content);
    
    // Cost per token
    const costPerToken = {
      cursor: 0.000002,
      claude: 0.000003
    };
    
    const primaryCost = primaryTokens * costPerToken[selection.primary_ai];
    const secondaryCost = secondaryTokens * costPerToken[selection.secondary_ai];
    
    return primaryCost + secondaryCost;
  }

  private estimateTokens(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  // Method to handle real-time collaborative editing
  async handleCollaborativeEdit(
    editRequest: string,
    currentCode: string,
    context: SharedContext
  ): Promise<{cursorSuggestion: string, claudeAnalysis: string}> {
    
    const cursorPrompt = `
    As Cursor AI, suggest specific code changes for this edit request:
    "${editRequest}"
    
    Current code:
    \`\`\`
    ${currentCode}
    \`\`\`
    
    Provide exact code changes with line numbers.
    `;
    
    const claudePrompt = `
    As Claude, analyze the implications of this edit request:
    "${editRequest}"
    
    Current code:
    \`\`\`
    ${currentCode}
    \`\`\`
    
    Consider: architecture impact, potential issues, testing needs.
    `;
    
    try {
      const [cursorResponse, claudeResponse] = await Promise.all([
        this.cursorIntegration.sendMessage(cursorPrompt, context),
        this.claudeIntegration.sendMessage(claudePrompt, context)
      ]);
      
      return {
        cursorSuggestion: cursorResponse.content,
        claudeAnalysis: claudeResponse.content
      };
    } catch (error) {
      return {
        cursorSuggestion: 'Error generating cursor suggestion',
        claudeAnalysis: 'Error generating claude analysis'
      };
    }
  }
}