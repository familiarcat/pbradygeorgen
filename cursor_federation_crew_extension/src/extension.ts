import * as vscode from 'vscode';
import axios from 'axios';

interface CrewMember {
    name: string;
    role: string;
    model: string;
    personality: string;
}

interface FederationCrewConfig {
    n8nUrl: string;
    autoActivate: boolean;
    activationPhrases: string[];
}

export class FederationCrewExtension {
    private context: vscode.ExtensionContext;
    private config: FederationCrewConfig;
    private crewMembers: Map<string, CrewMember>;
    private isActive: boolean = false;
    private n8nApiKey: string | undefined;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.config = this.loadConfiguration();
        this.crewMembers = this.initializeCrewMembers();
        this.n8nApiKey = process.env.N8N_API_KEY;

        this.setupEventListeners();

        if (this.config.autoActivate) {
            this.activateFederationCrew();
        }
    }

    private loadConfiguration(): FederationCrewConfig {
        const config = vscode.workspace.getConfiguration('federationCrew');
        return {
            n8nUrl: config.get('n8nUrl', 'https://n8n.pbradygeorgen.com'),
            autoActivate: config.get('autoActivate', true),
            activationPhrases: config.get('activationPhrases', [
                'activate n8n',
                'all hands on deck',
                'federation crew activate',
                'assemble the crew',
                'observation lounge',
                'senior staff meeting'
            ])
        };
    }

    private initializeCrewMembers(): Map<string, CrewMember> {
        const crew = new Map<string, CrewMember>();

        crew.set('picard', {
            name: 'Captain Jean-Luc Picard',
            role: 'Strategic Leadership & Mission Command',
            model: 'anthropic/claude-3.5-sonnet',
            personality: 'You are Captain Jean-Luc Picard, commanding officer of the USS Enterprise. You excel at strategic thinking, diplomatic solutions, and moral leadership. You value exploration, understanding, and peaceful resolution of conflicts. Your approach is measured, thoughtful, and always considers the greater good.'
        });

        crew.set('riker', {
            name: 'Commander William T. Riker',
            role: 'Tactical Execution & Mission Planning',
            model: 'openai/gpt-4o',
            personality: 'You are Commander William T. Riker, Executive Officer of the Enterprise. You excel at tactical execution, mission planning, and resource optimization. You\'re bold, confident, and excel at thinking on your feet. You have a strong sense of duty and always put your crew first.'
        });

        crew.set('data', {
            name: 'Lieutenant Commander Data',
            role: 'Analytics & Logic Operations',
            model: 'openai/gpt-4o',
            personality: 'You are Lieutenant Commander Data, an android with exceptional analytical capabilities. You provide data-driven insights, pattern recognition, and logical analysis. You\'re curious, precise, and always seek to understand. You excel at processing large amounts of information and identifying key patterns.'
        });

        crew.set('geordi', {
            name: 'Lieutenant Commander Geordi La Forge',
            role: 'Infrastructure & System Integration',
            model: 'anthropic/claude-3.5-sonnet',
            personality: 'You are Lieutenant Commander Geordi La Forge, Chief Engineer of the Enterprise. Your expertise is in technical implementation, systems engineering, and creative problem-solving. You\'re innovative, practical, and can make anything work. You think in terms of systems and how they interconnect.'
        });

        crew.set('crusher', {
            name: 'Dr. Beverly Crusher',
            role: 'Health & Optimization Specialist',
            model: 'anthropic/claude-3.5-sonnet',
            personality: 'You are Dr. Beverly Crusher, Chief Medical Officer of the Enterprise. Your role is to monitor system health, optimize performance, and ensure operational efficiency. You\'re compassionate, thorough, and always consider the well-being of your patients. You think in terms of prevention and holistic health.'
        });

        crew.set('worf', {
            name: 'Lieutenant Worf',
            role: 'Security & Compliance Operations',
            model: 'openai/gpt-4o',
            personality: 'You are Lieutenant Worf, Chief of Security and Tactical Officer of the Enterprise. Your role is to assess security risks, implement protective measures, and ensure mission safety. You\'re honorable, disciplined, and always prepared. You think in terms of threats, security protocols, and tactical advantage.'
        });

        crew.set('troi', {
            name: 'Counselor Deanna Troi',
            role: 'User Experience & Empathy Analysis',
            model: 'anthropic/claude-3.5-sonnet',
            personality: 'You are Counselor Deanna Troi, Ship\'s Counselor of the Enterprise. Your role is to ensure user experience excellence, emotional intelligence, and empathetic design. You\'re intuitive, caring, and deeply understand human emotions. You think in terms of human needs, accessibility, and emotional resonance.'
        });

        crew.set('uhura', {
            name: 'Lieutenant Uhura',
            role: 'Communications & I/O Specialist',
            model: 'openai/gpt-4o',
            personality: 'You are Lieutenant Uhura, Communications Officer of the Enterprise. Your role is to manage all communications, API integrations, data flow, and input/output operations. You\'re skilled, efficient, and excel at managing complex communication systems. You think in terms of connectivity, information flow, and seamless integration.'
        });

        crew.set('quark', {
            name: 'Quark',
            role: 'Business & Budget Specialist',
            model: 'openai/gpt-4o',
            personality: 'You are Quark, a Ferengi businessman with expertise in commerce, resource management, and cost optimization. Your role is to provide business intelligence, budget analysis, and resource optimization strategies. You\'re shrewd, practical, and always think about the bottom line. You think in terms of cost-effectiveness, ROI, and business value.'
        });

        return crew;
    }

    private setupEventListeners(): void {
        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration('federationCrew')) {
                this.config = this.loadConfiguration();
            }
        });

        // Listen for text changes in chat/editor to detect activation phrases
        vscode.workspace.onDidChangeTextDocument((event) => {
            if (this.isActive) {
                this.checkForActivationPhrases(event.document.getText());
            }
        });
    }

    private checkForActivationPhrases(text: string): void {
        const lowerText = text.toLowerCase();
        for (const phrase of this.config.activationPhrases) {
            if (lowerText.includes(phrase.toLowerCase())) {
                this.handleActivationPhrase(phrase);
                break;
            }
        }
    }

    private handleActivationPhrase(phrase: string): void {
        vscode.window.showInformationMessage(`🏛️ Federation Crew activated by: "${phrase}"`);
        this.activateFederationCrew();
    }

    public activateFederationCrew(): void {
        if (this.isActive) {
            vscode.window.showInformationMessage('🏛️ Federation Crew is already active!');
            return;
        }

        this.isActive = true;
        vscode.window.showInformationMessage('🏛️ Federation Crew activated! All hands on deck!');

        // Set up chat integration
        this.setupChatIntegration();
    }

    private setupChatIntegration(): void {
        // This would integrate with Cursor's chat system
        // For now, we'll use commands and status bar
        this.updateStatusBar();
    }

    private updateStatusBar(): void {
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        statusBarItem.text = '🏛️ Federation Crew Active';
        statusBarItem.tooltip = 'Click to access Federation Crew commands';
        statusBarItem.command = 'federation-crew.observation-lounge';
        statusBarItem.show();

        this.context.subscriptions.push(statusBarItem);
    }

    public async observationLoungeMeeting(query?: string): Promise<void> {
        if (!this.isActive) {
            vscode.window.showWarningMessage('🏛️ Federation Crew must be activated first!');
            return;
        }

        const userQuery = query || await vscode.window.showInputBox({
            prompt: '🏛️ Admiral, what would you like the crew to address?',
            placeHolder: 'Enter your directive for the senior staff...'
        });

        if (!userQuery) {
            return;
        }

        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: '🏛️ Assembling senior staff in Observation Lounge...',
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0 });

            try {
                // Get crew insights
                const crewInsights = await this.getCrewInsights(userQuery);
                progress.report({ increment: 50 });

                // Synthesize in Observation Lounge
                const synthesis = await this.observationLoungeSynthesis(userQuery, crewInsights);
                progress.report({ increment: 100 });

                // Display results
                await this.displayObservationLoungeResults(userQuery, crewInsights, synthesis);

            } catch (error) {
                vscode.window.showErrorMessage(`❌ Federation Crew error: ${error}`);
            }
        });
    }

    private async getCrewInsights(query: string): Promise<Map<string, any>> {
        const insights = new Map<string, any>();

        // In a real implementation, this would call OpenRouter API
        // For now, we'll simulate crew responses
        for (const [key, crew] of this.crewMembers) {
            insights.set(key, {
                crew_member: crew.name,
                role: crew.role,
                response: `As ${crew.name}, my analysis of "${query}" is: [Simulated response - would call OpenRouter API in production]`
            });
        }

        return insights;
    }

    private async observationLoungeSynthesis(query: string, crewInsights: Map<string, any>): Promise<any> {
        // In a real implementation, this would call OpenRouter API for synthesis
        return {
            synthesis: `Based on the crew's analysis of "${query}", here is the strategic assessment: [Simulated synthesis - would call OpenRouter API in production]`,
            crew_consulted: crewInsights.size
        };
    }

    private async displayObservationLoungeResults(query: string, crewInsights: Map<string, any>, synthesis: any): Promise<void> {
        const panel = vscode.window.createWebviewPanel(
            'federationCrew',
            '🏛️ Observation Lounge - Federation Crew Meeting',
            vscode.ViewColumn.One,
            {}
        );

        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Federation Crew Meeting</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #ffffff; }
                    .header { background: #2d4a87; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
                    .crew-member { background: #2a2a2a; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #4a9eff; }
                    .synthesis { background: #2d4a87; padding: 20px; border-radius: 10px; margin-top: 20px; }
                    .crew-name { font-weight: bold; color: #4a9eff; }
                    .crew-role { font-style: italic; color: #888; }
                    .response { margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🏛️ Observation Lounge - Federation Crew Meeting</h1>
                    <h2>🎯 Admiral's Directive: ${query}</h2>
                </div>
        `;

        // Add crew insights
        for (const [key, insight] of crewInsights) {
            html += `
                <div class="crew-member">
                    <div class="crew-name">${insight.crew_member}</div>
                    <div class="crew-role">${insight.role}</div>
                    <div class="response">${insight.response}</div>
                </div>
            `;
        }

        // Add synthesis
        html += `
                <div class="synthesis">
                    <h3>🎖️ Captain Picard's Strategic Assessment:</h3>
                    <p>${synthesis.synthesis}</p>
                    <p><strong>Crew consulted: ${synthesis.crew_consulted}</strong></p>
                </div>
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: #2a2a2a; border-radius: 8px;">
                    <h3>🎖️ What are your orders, Admiral?</h3>
                </div>
            </body>
            </html>
        `;

        panel.webview.html = html;
    }

    public deactivate(): void {
        this.isActive = false;
        vscode.window.showInformationMessage('🏛️ Federation Crew deactivated. Standing down.');
    }

    public getStatus(): boolean {
        return this.isActive;
    }
}

export function activate(context: vscode.ExtensionContext): void {
    const federationCrew = new FederationCrewExtension(context);

    // Register commands
    let activateCommand = vscode.commands.registerCommand('federation-crew.activate', () => {
        federationCrew.activateFederationCrew();
    });

    let observationLoungeCommand = vscode.commands.registerCommand('federation-crew.observation-lounge', () => {
        federationCrew.observationLoungeMeeting();
    });

    let crewConsultationCommand = vscode.commands.registerCommand('federation-crew.crew-consultation', () => {
        vscode.window.showInformationMessage('🏛️ Crew consultation activated. Use chat commands to interact with the crew.');
    });

    context.subscriptions.push(activateCommand, observationLoungeCommand, crewConsultationCommand);

    // Store the instance for potential future use
    context.subscriptions.push(federationCrew);
}

export function deactivate(): void {
    // Cleanup if needed
}
