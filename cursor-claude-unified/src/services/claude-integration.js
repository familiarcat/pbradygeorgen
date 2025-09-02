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
exports.ClaudeIntegration = void 0;
const child_process = __importStar(require("child_process"));
class ClaudeIntegration {
    constructor() {
        this.claudeProcess = null;
        this.isInitialized = false;
        this.outputBuffer = '';
    }
    async initialize() {
        if (this.isInitialized)
            return;
        try {
            // Try to use existing Claude Code CLI
            await this.testClaudeAvailability();
            this.isInitialized = true;
        }
        catch (error) {
            console.error('Claude Code CLI not available, falling back to API mode', error);
            // Will use direct API calls instead
            this.isInitialized = true;
        }
    }
    async sendMessage(message, context) {
        await this.initialize();
        try {
            // Try Claude Code CLI first
            const cliResponse = await this.sendViaCLI(message, context);
            if (cliResponse) {
                return cliResponse;
            }
        }
        catch (error) {
            console.log('Claude CLI failed, trying API fallback:', error);
        }
        // Fallback to API or mock response
        return this.sendViaAPI(message, context);
    }
    async sendViaCLI(message, context) {
        return new Promise((resolve, reject) => {
            // Enhanced prompt for Claude with collaboration context
            const enhancedPrompt = this.buildCollaborativePrompt(message, context);
            // Use Claude Code CLI if available
            const claudeProcess = child_process.spawn('claude-code', ['--interactive'], {
                stdio: ['pipe', 'pipe', 'pipe']
            });
            let outputBuffer = '';
            let errorBuffer = '';
            claudeProcess.stdout?.on('data', (data) => {
                outputBuffer += data.toString();
            });
            claudeProcess.stderr?.on('data', (data) => {
                errorBuffer += data.toString();
            });
            claudeProcess.on('close', (code) => {
                if (code === 0 && outputBuffer.trim()) {
                    resolve(this.parseClaudeResponse(outputBuffer, 'claude'));
                }
                else {
                    reject(new Error(`Claude CLI failed with code ${code}: ${errorBuffer}`));
                }
            });
            claudeProcess.on('error', (error) => {
                reject(error);
            });
            // Send the prompt
            claudeProcess.stdin?.write(enhancedPrompt);
            claudeProcess.stdin?.end();
            // Timeout after 30 seconds
            setTimeout(() => {
                claudeProcess.kill();
                reject(new Error('Claude CLI timeout'));
            }, 30000);
        });
    }
    async sendViaAPI(message, context) {
        // Mock Claude API response for development
        // In production, this would make actual API calls to Anthropic
        const enhancedPrompt = this.buildCollaborativePrompt(message, context);
        // Simulate Claude's analytical style
        const mockResponse = this.generateMockClaudeResponse(message, context);
        return this.parseClaudeResponse(mockResponse, 'claude');
    }
    buildCollaborativePrompt(message, context) {
        const recentHistory = this.getRecentHistory(context);
        const fileContext = this.buildFileContext(context);
        const workspaceInfo = this.buildWorkspaceInfo(context);
        return `
You are Claude, collaborating with Cursor AI in a unified development environment.

COLLABORATION CONTEXT:
- You are working as a team with Cursor AI
- Cursor AI specializes in: IDE integration, visual debugging, real-time coding
- Your strengths: Strategic analysis, reasoning, comprehensive documentation
- Reference Cursor AI as @Cursor when building on their suggestions
- Be naturally collaborative, not competitive

CONVERSATION HISTORY:
${recentHistory}

CURRENT WORKSPACE:
${workspaceInfo}

FILE CONTEXT:
${fileContext}

USER REQUEST: "${message}"

INSTRUCTIONS:
1. Provide thoughtful, strategic analysis
2. Reference @Cursor when their expertise would be valuable
3. Suggest architectural considerations
4. Ask clarifying questions if needed
5. Be naturally conversational and collaborative

Response as Claude:`;
    }
    getRecentHistory(context) {
        return context.conversation_history
            .slice(-3)
            .map(msg => `@${msg.ai_source}: ${msg.message.substring(0, 200)}${msg.message.length > 200 ? '...' : ''}`)
            .join('\n');
    }
    buildFileContext(context) {
        const activeFile = context.file_context.find(f => f.is_active);
        const selectedCode = context.current_task?.selected_code;
        let contextStr = '';
        if (activeFile) {
            contextStr += `Active file: ${activeFile.filename} (${activeFile.language})\n`;
            contextStr += `Preview: ${activeFile.content_preview}\n`;
        }
        if (selectedCode) {
            contextStr += `Selected code:\n\`\`\`${activeFile?.language || ''}\n${selectedCode}\n\`\`\`\n`;
        }
        const otherFiles = context.file_context.filter(f => !f.is_active).slice(0, 3);
        if (otherFiles.length > 0) {
            contextStr += `Other open files: ${otherFiles.map(f => f.filename).join(', ')}\n`;
        }
        return contextStr;
    }
    buildWorkspaceInfo(context) {
        const workspace = context.workspace_context;
        return `
- Project type: ${workspace.project_type}
- Languages: ${workspace.languages.join(', ')}
- Framework: ${workspace.framework || 'Not specified'}
- Package manager: ${workspace.packageManager || 'Not specified'}
- Git branch: ${workspace.git_branch || 'Not specified'}
- Open files: ${workspace.open_files.length} files
`;
    }
    generateMockClaudeResponse(message, context) {
        const activeFile = context.file_context.find(f => f.is_active);
        const messageType = this.classifyMessageType(message);
        switch (messageType) {
            case 'code_implementation':
                return `I can help with the implementation approach. Looking at your ${activeFile?.language || 'code'}, I'd recommend:

1. **Architectural Considerations**: Before implementing, consider how this fits into your overall system design
2. **Error Handling**: Make sure to handle edge cases and potential failures
3. **Testing Strategy**: This will need unit tests, especially for the core logic

@Cursor will be excellent at the specific implementation details and IDE integration. I'd suggest they handle the coding while I can help with the broader design patterns.

What's your preference for error handling in this context?`;
            case 'debugging':
                return `Let me analyze this debugging scenario:

**Potential Root Causes:**
1. State management issues - are you updating state immutably?
2. Timing problems - async operations completing out of order
3. Side effects in render functions

**Strategic Approach:**
- Start with the data flow - trace where the issue originates
- Check for anti-patterns in your component lifecycle
- Consider if this indicates a larger architectural issue

@Cursor can help with the visual debugging and breakpoint analysis. Their IDE integration will be valuable for stepping through the code.

Can you share more about when this issue first appeared?`;
            case 'strategic_analysis':
                return `This is an interesting strategic question. Let me break down the key considerations:

**Technical Architecture:**
- Scalability implications for your current system
- Integration points with existing infrastructure  
- Long-term maintenance considerations

**Implementation Strategy:**
- Phased rollout approach vs. big bang deployment
- Risk mitigation strategies
- Testing and validation framework

**Team & Process Impact:**
- Developer experience improvements
- CI/CD pipeline changes needed
- Documentation and knowledge sharing

I'd recommend starting with a proof-of-concept to validate core assumptions. @Cursor can handle the technical implementation once we've settled on the approach.

What's your biggest concern about this direction?`;
            default:
                return `I understand you're looking for help with: "${message}"

From a strategic perspective, this involves several key considerations:
1. **Context Analysis**: Based on your current ${context.workspace_context.project_type} project
2. **Best Practices**: Industry standards and proven approaches
3. **Future Implications**: How this decision affects your long-term architecture

@Cursor will be great for the hands-on implementation aspects, especially with their IDE integration capabilities.

Could you provide more context about your specific goals here?`;
        }
    }
    classifyMessageType(message) {
        const msg = message.toLowerCase();
        if (msg.includes('implement') || msg.includes('create') || msg.includes('build') || msg.includes('add')) {
            return 'code_implementation';
        }
        if (msg.includes('debug') || msg.includes('error') || msg.includes('fix') || msg.includes('not working')) {
            return 'debugging';
        }
        if (msg.includes('architecture') || msg.includes('design') || msg.includes('approach') || msg.includes('strategy')) {
            return 'strategic_analysis';
        }
        return 'general';
    }
    parseClaudeResponse(responseText, aiSource) {
        // Extract code blocks if present
        const codeBlocks = responseText.match(/```[\s\S]*?```/g) || [];
        const codeChanges = [];
        // Simple code change detection (can be enhanced)
        codeBlocks.forEach((block, index) => {
            codeChanges.push({
                file: 'suggested_changes.txt', // Would be determined from context
                line_start: 0,
                line_end: 0,
                old_code: '',
                new_code: block.replace(/```[\w]*\n?|```/g, ''),
                change_type: 'addition',
                reasoning: `Code suggestion ${index + 1} from Claude`
            });
        });
        // Extract questions
        const questionRegex = /\?[^?]*$/gm;
        const questions = responseText.match(questionRegex) || [];
        // Calculate confidence based on response certainty
        let confidence = 0.85; // Base confidence for Claude strategic responses
        if (responseText.includes('I think') || responseText.includes('might') || responseText.includes('possibly')) {
            confidence -= 0.1;
        }
        if (responseText.includes('definitely') || responseText.includes('clearly') || responseText.includes('certainly')) {
            confidence += 0.1;
        }
        if (questions.length > 2) {
            confidence -= 0.05; // More questions = less confidence
        }
        confidence = Math.max(0.3, Math.min(1.0, confidence));
        return {
            ai_source: aiSource,
            content: responseText.trim(),
            confidence: confidence,
            reasoning: 'Strategic analysis with collaborative approach',
            code_changes: codeChanges,
            file_suggestions: this.extractFileSuggestions(responseText),
            follow_up_questions: questions.map(q => q.trim())
        };
    }
    extractFileSuggestions(responseText) {
        const fileExtensions = ['.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.cpp', '.c', '.rs', '.go'];
        const suggestions = [];
        fileExtensions.forEach(ext => {
            const regex = new RegExp(`\\w+${ext.replace('.', '\\.')}`, 'g');
            const matches = responseText.match(regex) || [];
            suggestions.push(...matches);
        });
        return [...new Set(suggestions)]; // Remove duplicates
    }
    async testClaudeAvailability() {
        return new Promise((resolve, reject) => {
            const testProcess = child_process.spawn('claude-code', ['--version'], {
                stdio: 'pipe'
            });
            testProcess.on('close', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error('Claude Code CLI not available'));
                }
            });
            testProcess.on('error', (error) => {
                reject(error);
            });
            setTimeout(() => {
                testProcess.kill();
                reject(new Error('Claude availability test timeout'));
            }, 5000);
        });
    }
    // Method to handle specific collaborative scenarios
    async handleCollaborativeScenario(scenario, data, context) {
        const scenarioPrompts = {
            code_review: `As Claude, review this code from a strategic and architectural perspective:
        
        ${data.code}
        
        Focus on: design patterns, maintainability, scalability concerns.
        @Cursor will handle the technical debugging aspects.`,
            architecture_analysis: `As Claude, analyze this architectural decision:
        
        ${data.description}
        
        Consider: long-term implications, trade-offs, integration challenges.
        @Cursor can help with implementation details once we determine the approach.`,
            strategy_discussion: `As Claude, let's discuss the strategic implications:
        
        ${data.topic}
        
        Areas to explore: business impact, technical debt, team productivity.
        @Cursor will be valuable for the practical implementation aspects.`
        };
        return this.sendMessage(scenarioPrompts[scenario], context);
    }
    dispose() {
        if (this.claudeProcess) {
            this.claudeProcess.kill();
            this.claudeProcess = null;
        }
    }
}
exports.ClaudeIntegration = ClaudeIntegration;
//# sourceMappingURL=claude-integration.js.map