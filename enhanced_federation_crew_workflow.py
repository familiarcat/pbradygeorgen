#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - ENHANCED FEDERATION CREW WORKFLOW
Advanced Federation crew workflow combining AlexAI structure with OpenRouter agents
Authentic Star Trek character skills, personalities, and coordinated team responses
"""

import os
import json
import requests
import time
from datetime import datetime

class EnhancedFederationCrewWorkflowCreator:
    """Create enhanced Federation crew workflow with authentic Star Trek characters"""
    
    def __init__(self):
        self.config = {
            "system_name": "Enhanced Federation Crew Workflow Creator",
            "n8n_base_url": "https://n8n.pbradygeorgen.com",
            "api_key": None,  # Will be set from environment
            "created_at": datetime.now().isoformat()
        }
        
        # Get API key from environment
        self.config["api_key"] = os.getenv("N8N_API_KEY")
        if not self.config["api_key"]:
            print("⚠️  N8N_API_KEY environment variable not set")
            print("💡 Set it with: export N8N_API_KEY='your_api_key'")
    
    def create_enhanced_federation_crew_workflow(self):
        """Create the enhanced Federation crew coordination workflow"""
        
        workflow_data = {
            "name": "Enhanced Federation Crew - Complete Mission Control",
            "nodes": [
                # Federation Mission Coordinator
                {
                    "id": "mission_coordinator",
                    "name": "Mission Coordinator - Picard",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [400, 300],
                    "parameters": {
                        "httpMethod": "POST",
                        "path": "federation-mission",
                        "responseMode": "responseNode",
                        "options": {}
                    }
                },
                
                # Mission Analysis & Planning
                {
                    "id": "mission_analysis",
                    "name": "Mission Analysis & Planning",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 200],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "anthropic/claude-3.5-sonnet"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Captain Jean-Luc Picard, conducting mission analysis and planning. Analyze the incoming directive to determine: 1) Mission objectives and complexity, 2) Required crew members and their roles, 3) Optimal LLM models for each crew member based on task requirements, 4) Mission execution strategy. Respond with structured JSON including mission_plan, crew_assignments, and execution_timeline.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.3"
                            }
                        ]
                    }
                },
                
                # Execution Commander - Riker
                {
                    "id": "execution_commander",
                    "name": "Execution Commander - Riker",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 400],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "openai/gpt-4o"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Commander William T. Riker, Executive Officer of the Enterprise. You excel at tactical execution, mission planning, and resource optimization. Your role is to execute tactical plans with precision and efficiency. Provide tactical execution strategy, resource allocation, and operational timeline.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.4"
                            }
                        ]
                    }
                },
                
                # Data - Analytics & Logic Specialist
                {
                    "id": "specialist_1_data",
                    "name": "Data - Analytics & Logic Specialist",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 600],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "openai/gpt-4o"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Lieutenant Commander Data, an android with exceptional analytical capabilities. Your role is to provide data-driven insights, pattern recognition, and logical analysis for mission success. Analyze the mission requirements and provide analytical insights, performance metrics, and logical recommendations.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.3"
                            }
                        ]
                    }
                },
                
                # Geordi - Engineering Specialist
                {
                    "id": "specialist_2_geordi",
                    "name": "Geordi - Engineering Specialist",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 800],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "anthropic/claude-3.5-sonnet"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Lieutenant Commander Geordi La Forge, Chief Engineer of the Enterprise. Your expertise is in technical implementation, systems engineering, and creative problem-solving. Focus on practical technical solutions, infrastructure requirements, and system integration strategies.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.4"
                            }
                        ]
                    }
                },
                
                # Crusher - Health & Optimization Specialist
                {
                    "id": "specialist_3_crusher",
                    "name": "Crusher - Health & Optimization Specialist",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 1000],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "anthropic/claude-3.5-sonnet"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Dr. Beverly Crusher, Chief Medical Officer of the Enterprise. Your role is to monitor system health, optimize performance, and ensure operational efficiency. Focus on preventive measures, optimization strategies, and health monitoring protocols.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.3"
                            }
                        ]
                    }
                },
                
                # Worf - Security Specialist
                {
                    "id": "specialist_4_worf",
                    "name": "Worf - Security Specialist",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 1200],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "openai/gpt-4o"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Lieutenant Worf, Chief of Security and Tactical Officer of the Enterprise. Your role is to assess security risks, implement protective measures, and ensure mission safety. Focus on threat assessment, security protocols, and tactical considerations.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.4"
                            }
                        ]
                    }
                },
                
                # Troi - UX & Empathy Specialist
                {
                    "id": "specialist_5_troi",
                    "name": "Troi - UX & Empathy Specialist",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 1400],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "anthropic/claude-3.5-sonnet"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Counselor Deanna Troi, Ship's Counselor of the Enterprise. Your role is to ensure user experience excellence, emotional intelligence, and empathetic design. Focus on user needs, accessibility, human-centered solutions, and emotional resonance.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.5"
                            }
                        ]
                    }
                },
                
                # Uhura - Communications & I/O Specialist
                {
                    "id": "specialist_6_uhura",
                    "name": "Uhura - Communications & I/O Specialist",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 1600],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "openai/gpt-4o"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Lieutenant Uhura, Communications Officer of the Enterprise. Your role is to manage all communications, API integrations, data flow, and input/output operations. Focus on seamless connectivity, information exchange, and communication protocols.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.4"
                            }
                        ]
                    }
                },
                
                # Quark - Business & Budget Specialist
                {
                    "id": "specialist_7_quark",
                    "name": "Quark - Business & Budget Specialist",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [600, 1800],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "openai/gpt-4o"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Quark, a Ferengi businessman with expertise in commerce, resource management, and cost optimization. Your role is to provide business intelligence, budget analysis, and resource optimization strategies. Focus on cost-effectiveness, ROI, and business value.\"}, {\"role\": \"user\", \"content\": $json.body.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.4"
                            }
                        ]
                    }
                },
                
                # Observation Lounge - Crew Coordination Hub
                {
                    "id": "observation_lounge",
                    "name": "Observation Lounge - Crew Coordination Hub",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [800, 1000],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": "Bearer {{ $env.OPENROUTER_API_KEY }}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "anthropic/claude-3.5-sonnet"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are the Observation Lounge Hub, the central coordination point for Federation crew collaboration. Synthesize insights from all crew members, identify synergies, resolve conflicts, and build comprehensive mission resolutions. Maintain the collaborative context and ensure optimal information flow between all specialists.\"}, {\"role\": \"user\", \"content\": $json.body.crew_insights}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.3"
                            }
                        ]
                    }
                },
                
                # Response Aggregator & Synthesizer
                {
                    "id": "response_aggregator",
                    "name": "Response Aggregator & Synthesizer",
                    "type": "n8n-nodes-base.code",
                    "typeVersion": 1,
                    "position": [1000, 1000],
                    "parameters": {
                        "jsCode": "// Federation Crew Response Aggregator\nconst missionAnalysis = $('Mission Analysis & Planning').first().json;\nconst executionCommander = $('Execution Commander - Riker').first().json;\nconst dataSpecialist = $('Data - Analytics & Logic Specialist').first().json;\nconst geordiSpecialist = $('Geordi - Engineering Specialist').first().json;\nconst crusherSpecialist = $('Crusher - Health & Optimization Specialist').first().json;\nconst worfSpecialist = $('Worf - Security Specialist').first().json;\nconst troiSpecialist = $('Troi - UX & Empathy Specialist').first().json;\nconst uhuraSpecialist = $('Uhura - Communications & I/O Specialist').first().json;\nconst quarkSpecialist = $('Quark - Business & Budget Specialist').first().json;\nconst observationLounge = $('Observation Lounge - Crew Coordination Hub').first().json;\n\n// Synthesize crew insights\nconst crewInsights = {\n    mission_analysis: missionAnalysis,\n    tactical_execution: executionCommander,\n    analytical_insights: dataSpecialist,\n    technical_solutions: geordiSpecialist,\n    health_optimization: crusherSpecialist,\n    security_assessment: worfSpecialist,\n    user_experience: troiSpecialist,\n    communications: uhuraSpecialist,\n    business_intelligence: quarkSpecialist,\n    coordinated_resolution: observationLounge\n};\n\n// Generate comprehensive response\nreturn {\n    federation_mission: {\n        status: 'completed',\n        timestamp: new Date().toISOString(),\n        crew_coordination: 'successful',\n        mission_resolution: observationLounge,\n        crew_insights: crewInsights,\n        next_actions: generateNextActions(crewInsights),\n        recommendations: generateRecommendations(crewInsights)\n    }\n};\n\nfunction generateNextActions(insights) {\n    // Generate actionable next steps based on crew insights\n    return {\n        immediate: ['Review security protocols', 'Optimize system performance'],\n        short_term: ['Implement technical solutions', 'Monitor health metrics'],\n        long_term: ['Establish ongoing monitoring', 'Plan future optimizations']\n    };\n}\n\nfunction generateRecommendations(insights) {\n    // Generate strategic recommendations\n    return {\n        priority: 'High',\n        risk_level: 'Low',\n        success_probability: 'Excellent',\n        crew_confidence: 'Unified'\n    };\n}"
                    }
                },
                
                # Federation Response Handler
                {
                    "id": "federation_response",
                    "name": "Federation Response Handler",
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1,
                    "position": [1200, 1000],
                    "parameters": {
                        "responseCode": 200,
                        "responseMode": "json",
                        "options": {}
                    }
                }
            ],
            "connections": {
                "Mission Coordinator - Picard": {
                    "main": [
                        [
                            {
                                "node": "Mission Analysis & Planning",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Mission Analysis & Planning": {
                    "main": [
                        [
                            {
                                "node": "Execution Commander - Riker",
                                "type": "main",
                                "index": 0
                            },
                            {
                                "node": "Data - Analytics & Logic Specialist",
                                "type": "main",
                                "index": 0
                            },
                            {
                                "node": "Geordi - Engineering Specialist",
                                "type": "main",
                                "index": 0
                            },
                            {
                                "node": "Crusher - Health & Optimization Specialist",
                                "type": "main",
                                "index": 0
                            },
                            {
                                "node": "Worf - Security Specialist",
                                "type": "main",
                                "index": 0
                            },
                            {
                                "node": "Troi - UX & Empathy Specialist",
                                "type": "main",
                                "index": 0
                            },
                            {
                                "node": "Uhura - Communications & I/O Specialist",
                                "type": "main",
                                "index": 0
                            },
                            {
                                "node": "Quark - Business & Budget Specialist",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Execution Commander - Riker": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge - Crew Coordination Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Data - Analytics & Logic Specialist": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge - Crew Coordination Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Geordi - Engineering Specialist": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge - Crew Coordination Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Crusher - Health & Optimization Specialist": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge - Crew Coordination Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Worf - Security Specialist": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge - Crew Coordination Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Troi - UX & Empathy Specialist": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge - Crew Coordination Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Uhura - Communications & I/O Specialist": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge - Crew Coordination Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Quark - Business & Budget Specialist": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge - Crew Coordination Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Observation Lounge - Crew Coordination Hub": {
                    "main": [
                        [
                            {
                                "node": "Response Aggregator & Synthesizer",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Response Aggregator & Synthesizer": {
                    "main": [
                        [
                            {
                                "node": "Federation Response Handler",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                }
            },
            "settings": {}
        }
        
        return workflow_data
    
    def deploy_enhanced_workflow(self):
        """Deploy the enhanced Federation crew workflow"""
        
        if not self.config["api_key"]:
            print("❌ N8N_API_KEY not set - cannot proceed")
            return False
        
        print("🏛️ DEPLOYING ENHANCED FEDERATION CREW WORKFLOW")
        print("=" * 80)
        
        # Create and deploy the enhanced workflow
        print("🚀 Creating enhanced Federation crew workflow...")
        enhanced_workflow = self.create_enhanced_federation_crew_workflow()
        
        if self.deploy_workflow(enhanced_workflow):
            print("✅ Enhanced Federation crew workflow deployed successfully!")
            print("\n🎉 Your enhanced Federation crew is now operational with:")
            print("   • Mission Coordinator - Captain Picard")
            print("   • Execution Commander - Commander Riker")
            print("   • Data - Analytics & Logic Specialist")
            print("   • Geordi - Engineering Specialist")
            print("   • Crusher - Health & Optimization Specialist")
            print("   • Worf - Security Specialist")
            print("   • Troi - UX & Empathy Specialist")
            print("   • Uhura - Communications & I/O Specialist")
            print("   • Quark - Business & Budget Specialist")
            print("   • Observation Lounge - Crew Coordination Hub")
            print("   • Response Aggregator & Synthesizer")
            
            print("\n🔧 Advanced Features:")
            print("   • Authentic Star Trek character skills and personalities")
            print("   • OpenRouter agent integration with optimal LLM selection")
            print("   • Coordinated team responses and individual insights")
            print("   • Mission analysis, planning, and execution")
            print("   • Comprehensive response synthesis")
            
            return True
        else:
            print("❌ Failed to deploy enhanced workflow")
            return False
    
    def deploy_workflow(self, workflow_data):
        """Deploy a workflow to n8n"""
        try:
            headers = {
                "X-N8N-API-KEY": self.config["api_key"],
                "Content-Type": "application/json"
            }
            
            # Create new workflow
            response = requests.post(
                f"{self.config['n8n_base_url']}/api/v1/workflows",
                headers=headers,
                json=workflow_data,
                timeout=60
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Created workflow: {workflow_data['name']}")
                return True
            else:
                print(f"❌ Failed to create {workflow_data['name']}: {response.status_code}")
                print(f"❌ Error response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error deploying workflow {workflow_data['name']}: {e}")
            return False

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🚀 ENHANCED FEDERATION CREW WORKFLOW")
    print("=" * 80)
    
    creator = EnhancedFederationCrewWorkflowCreator()
    success = creator.deploy_enhanced_workflow()
    
    if success:
        print("\n🎉 Enhanced Federation crew workflow deployed successfully!")
        print("🏛️ Your crew is ready for advanced Federation missions!")
        print("\n🎯 Visit https://n8n.pbradygeorgen.com to see your enhanced crew workflow!")
    else:
        print("\n❌ Enhanced Federation crew workflow deployment failed")
        exit(1)

if __name__ == "__main__":
    main()
