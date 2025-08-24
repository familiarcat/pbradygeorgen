#!/usr/bin/env node

/**
 * AlexAI Optimized Crew N8N Deployment Script
 * Deploys the optimized 8-member crew to n8n with OpenRouter integration
 */

const fs = require('fs');
const path = require('path');

class OptimizedCrewDeployer {
    constructor() {
        this.crewConfig = null;
        this.n8nConfig = null;
    }

    // Load crew configuration
    loadCrewConfig() {
        try {
            const configPath = path.join(__dirname, 'n8n_optimized_crew_config.json');
            this.crewConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            console.log('✅ Crew configuration loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to load crew configuration:', error.message);
            return false;
        }
    }

    // Generate n8n workflow templates
    generateN8nWorkflows() {
        console.log('\n🔧 GENERATING N8N WORKFLOW TEMPLATES');
        console.log('='.repeat(50));

        const workflows = {
            mission_coordinator: this.generateMissionCoordinatorWorkflow(),
            execution_commander: this.generateExecutionCommanderWorkflow(),
            specialist_workflows: this.generateSpecialistWorkflows()
        };

        return workflows;
    }

    // Generate Mission Coordinator workflow (Picard)
    generateMissionCoordinatorWorkflow() {
        return {
            name: "Mission Coordinator - Strategic Leadership",
            crew_member: "picard",
            llm_model: "gpt-4o-mini",
            workflow_nodes: [
                {
                    id: "mission_input",
                    type: "n8n-nodes-base.start",
                    position: [0, 0],
                    parameters: {
                        name: "Mission Input"
                    }
                },
                {
                    id: "picard_analysis",
                    type: "n8n-nodes-base.openAi",
                    position: [300, 0],
                    parameters: {
                        authentication: "openRouter",
                        model: "gpt-4o-mini",
                        prompt: "As Captain Picard, analyze this mission: {{$json.mission_description}}. Provide strategic assessment, crew allocation recommendations, and risk analysis.",
                        options: {
                            temperature: 0.3,
                            maxTokens: 1000
                        }
                    }
                },
                {
                    id: "crew_allocation",
                    type: "n8n-nodes-base.code",
                    position: [600, 0],
                    parameters: {
                        jsCode: `
                        // Crew allocation logic based on mission requirements
                        const mission = $input.first().json;
                        const crewMembers = ${JSON.stringify(Object.keys(this.crewConfig.crew_members))};
                        
                        // Determine which crew members to activate
                        const requiredCrew = this.analyzeMissionRequirements(mission, crewMembers);
                        
                        return {
                            mission_analysis: mission,
                            crew_allocation: requiredCrew,
                            next_steps: this.generateNextSteps(requiredCrew)
                        };
                        `
                    }
                }
            ]
        };
    }

    // Generate Execution Commander workflow (Riker)
    generateExecutionCommanderWorkflow() {
        return {
            name: "Execution Commander - Tactical Operations",
            crew_member: "riker",
            llm_model: "claude-3-haiku",
            workflow_nodes: [
                {
                    id: "execution_input",
                    type: "n8n-nodes-base.start",
                    position: [0, 0],
                    parameters: {
                        name: "Execution Input"
                    }
                },
                {
                    id: "riker_execution",
                    type: "n8n-nodes-base.openAi",
                    position: [300, 0],
                    parameters: {
                        authentication: "openRouter",
                        model: "claude-3-haiku",
                        prompt: "As Commander Riker, execute this tactical plan: {{$json.execution_plan}}. Optimize workflow efficiency and resource allocation.",
                        options: {
                            temperature: 0.2,
                            maxTokens: 800
                        }
                    }
                },
                {
                    id: "workflow_optimization",
                    type: "n8n-nodes-base.code",
                    position: [600, 0],
                    parameters: {
                        jsCode: `
                        // Workflow optimization logic
                        const execution = $input.first().json;
                        return {
                            optimized_workflow: this.optimizeWorkflow(execution),
                            resource_allocation: this.allocateResources(execution),
                            performance_metrics: this.calculatePerformanceMetrics(execution)
                        };
                        `
                    }
                }
            ]
        };
    }

    // Generate specialist workflows
    generateSpecialistWorkflows() {
        const specialists = Object.entries(this.crewConfig.crew_members)
            .filter(([key, member]) => !['picard', 'riker'].includes(key))
            .map(([key, member]) => this.generateSpecialistWorkflow(key, member));

        return specialists;
    }

    // Generate individual specialist workflow
    generateSpecialistWorkflow(key, member) {
        return {
            name: `${member.name} - ${member.role}`,
            crew_member: key,
            llm_model: member.llm_preference,
            workflow_nodes: [
                {
                    id: `${key}_input`,
                    type: "n8n-nodes-base.start",
                    position: [0, 0],
                    parameters: {
                        name: `${member.name} Input`
                    }
                },
                {
                    id: `${key}_specialist`,
                    type: "n8n-nodes-base.openAi",
                    position: [300, 0],
                    parameters: {
                        authentication: "openRouter",
                        model: member.llm_preference,
                        prompt: `As ${member.name}, ${member.role}, analyze this request: {{$json.request}}. Provide specialized expertise in ${member.specialization}.`,
                        options: {
                            temperature: 0.4,
                            maxTokens: 1000
                        }
                    }
                },
                {
                    id: `${key}_output`,
                    type: "n8n-nodes-base.code",
                    position: [600, 0],
                    parameters: {
                        jsCode: `
                        // Specialist output processing
                        const specialistResponse = $input.first().json;
                        return {
                            crew_member: "${key}",
                            role: "${member.role}",
                            analysis: specialistResponse,
                            recommendations: this.processSpecialistRecommendations(specialistResponse),
                            next_actions: this.generateNextActions(specialistResponse)
                        };
                        `
                    }
                }
            ]
        };
    }

    // Generate OpenRouter configuration
    generateOpenRouterConfig() {
        return {
            openrouter_config: {
                baseURL: "https://openrouter.ai/api/v1",
                authentication: {
                    type: "apiKey",
                    apiKey: "{{$env.OPENROUTER_API_KEY}}"
                },
                models: {
                    "gpt-4o-mini": "openai/gpt-4o-mini",
                    "gpt-4o": "openai/gpt-4o",
                    "claude-3-haiku": "anthropic/claude-3-haiku",
                    "claude-3-sonnet": "anthropic/claude-3-sonnet",
                    "gpt-3.5-turbo": "openai/gpt-3.5-turbo"
                },
                cost_optimization: {
                    "gpt-4o-mini": "low_cost_strategy",
                    "claude-3-haiku": "fast_execution",
                    "gpt-4o": "complex_analysis",
                    "claude-3-sonnet": "data_analysis",
                    "gpt-3.5-turbo": "business_calculations"
                }
            }
        };
    }

    // Generate deployment instructions
    generateDeploymentInstructions() {
        console.log('\n📋 N8N DEPLOYMENT INSTRUCTIONS');
        console.log('='.repeat(50));

        console.log('\n🚀 STEP 1: OpenRouter Setup');
        console.log('   • Get API key from https://openrouter.ai/');
        console.log('   • Set environment variable: OPENROUTER_API_KEY');
        console.log('   • Configure n8n to use OpenRouter as AI provider');

        console.log('\n🔧 STEP 2: Import Workflows');
        console.log('   • Import each workflow template into n8n');
        console.log('   • Configure authentication for OpenRouter');
        console.log('   • Test each crew member workflow individually');

        console.log('\n⚙️ STEP 3: Crew Integration');
        console.log('   • Set up webhook triggers for crew activation');
        console.log('   • Configure crew member routing based on task type');
        console.log('   • Implement cost optimization logic');

        console.log('\n🧪 STEP 4: Testing & Validation');
        console.log('   • Test solo crew member activation');
        console.log('   • Test crew collaboration workflows');
        console.log('   • Validate cost optimization and LLM routing');

        console.log('\n📊 STEP 5: Monitoring & Optimization');
        console.log('   • Monitor crew performance metrics');
        console.log('   • Track cost per mission');
        console.log('   • Optimize LLM selection based on results');
    }

    // Generate crew activation patterns
    generateActivationPatterns() {
        console.log('\n🎯 CREW ACTIVATION PATTERNS');
        console.log('='.repeat(50));

        const patterns = {
            solo_activation: "Individual crew member for specific expertise",
            specialist_team: "2-3 specialists for focused tasks",
            core_crew: "Picard + Riker + 2 specialists for standard missions",
            full_crew: "All 8 members for complex, multi-faceted missions"
        };

        Object.entries(patterns).forEach(([pattern, description]) => {
            console.log(`\n${pattern.toUpperCase()}:`);
            console.log(`  ${description}`);
        });
    }

    // Deploy the optimized crew
    deploy() {
        console.log('🚀 ALEXAI OPTIMIZED CREW N8N DEPLOYMENT');
        console.log('='.repeat(60));

        if (!this.loadCrewConfig()) {
            return false;
        }

        console.log(`\n📊 CREW OPTIMIZATION SUMMARY:`);
        console.log(`  • Original Crew: 11 members`);
        console.log(`  • Optimized Crew: ${this.crewConfig.crew_size} members`);
        console.log(`  • Crew Reduction: ${this.crewConfig.optimization_metrics.crew_reduction}`);
        console.log(`  • Expected Cost Savings: ${this.crewConfig.optimization_metrics.cost_savings}`);
        console.log(`  • Efficiency Gain: ${this.crewConfig.optimization_metrics.efficiency_gain}`);

        const workflows = this.generateN8nWorkflows();
        const openRouterConfig = this.generateOpenRouterConfig();

        // Save workflow templates
        this.saveWorkflowTemplates(workflows);
        this.saveOpenRouterConfig(openRouterConfig);

        this.generateDeploymentInstructions();
        this.generateActivationPatterns();

        console.log('\n✅ DEPLOYMENT READY!');
        console.log('Your optimized AlexAI crew is ready for n8n deployment.');
        console.log('Review the generated files and follow the deployment instructions.');

        return true;
    }

    // Save workflow templates
    saveWorkflowTemplates(workflows) {
        const outputDir = path.join(__dirname, 'n8n_workflows');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Save main workflows
        fs.writeFileSync(
            path.join(outputDir, 'mission_coordinator_workflow.json'),
            JSON.stringify(workflows.mission_coordinator, null, 2)
        );

        fs.writeFileSync(
            path.join(outputDir, 'execution_commander_workflow.json'),
            JSON.stringify(workflows.execution_commander, null, 2)
        );

        // Save specialist workflows
        workflows.specialist_workflows.forEach((workflow, index) => {
            const filename = `specialist_${index + 1}_${workflow.crew_member}_workflow.json`;
            fs.writeFileSync(
                path.join(outputDir, filename),
                JSON.stringify(workflow, null, 2)
            );
        });

        console.log('✅ Workflow templates saved to n8n_workflows/ directory');
    }

    // Save OpenRouter configuration
    saveOpenRouterConfig(config) {
        const outputPath = path.join(__dirname, 'n8n_openrouter_config.json');
        fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
        console.log('✅ OpenRouter configuration saved');
    }
}

// Main execution
if (require.main === module) {
    const deployer = new OptimizedCrewDeployer();
    deployer.deploy();
}

module.exports = { OptimizedCrewDeployer };
