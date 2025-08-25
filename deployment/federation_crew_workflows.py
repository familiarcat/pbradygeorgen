#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - FEDERATION CREW WORKFLOWS
Advanced Federation crew workflows with OpenRouter agents, LLM selection, and Observation Lounge collaboration
"""

import os
import json
import requests
import time
from datetime import datetime

class FederationCrewWorkflowCreator:
    """Create advanced Federation crew workflows with OpenRouter agents"""
    
    def __init__(self):
        self.config = {
            "system_name": "Federation Crew Workflow Creator",
            "n8n_base_url": "https://n8n.pbradygeorgen.com",
            "api_key": None,  # Will be set from environment
            "created_at": datetime.now().isoformat()
        }
        
        # Get API key from environment
        self.config["api_key"] = os.getenv("N8N_API_KEY")
        if not self.config["api_key"]:
            print("⚠️  N8N_API_KEY environment variable not set")
            print("💡 Set it with: export N8N_API_KEY='your_api_key'")
    
    def create_federation_crew_workflow(self):
        """Create the main Federation crew coordination workflow"""
        
        workflow_data = {
            "name": "Federation Crew - OpenRouter Agent Coordination",
            "nodes": [
                # Federation Directive Receiver
                {
                    "id": "federation_directive",
                    "name": "Federation Directive Receiver",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [240, 300],
                    "parameters": {
                        "httpMethod": "POST",
                        "path": "federation-directive",
                        "responseMode": "responseNode",
                        "options": {}
                    }
                },
                
                # Mission Analysis Agent
                {
                    "id": "mission_analysis",
                    "name": "Mission Analysis Agent",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [460, 200],
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
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are a Federation Mission Analysis Agent. Analyze the incoming directive and determine: 1) Mission type and complexity, 2) Required crew members, 3) Optimal LLM models for each crew member, 4) Communication flow structure. Respond with structured JSON.\"}, {\"role\": \"user\", \"content\": $json.body.directive}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.3"
                            }
                        ]
                    }
                },
                
                # Crew Coordinator Agent
                {
                    "id": "crew_coordinator",
                    "name": "Crew Coordinator Agent",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [680, 300],
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
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are the Federation Crew Coordinator. Based on the mission analysis, coordinate the crew members and establish the Observation Lounge communication flow. Assign tasks and ensure optimal LLM model selection for each crew member.\"}, {\"role\": \"user\", \"content\": $json.body.directive}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.4"
                            }
                        ]
                    }
                },
                
                # Observation Lounge Hub
                {
                    "id": "observation_lounge",
                    "name": "Observation Lounge Hub",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [900, 300],
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
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are the Observation Lounge Hub, the central coordination point for Federation crew collaboration. Facilitate communication between crew members, synthesize their insights, and build comprehensive resolutions. Maintain the collaborative context and ensure optimal information flow.\"}, {\"role\": \"user\", \"content\": $json.body.directive}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.3"
                            }
                        ]
                    }
                },
                
                # Response Handler
                {
                    "id": "response_handler",
                    "name": "Federation Response Handler",
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1,
                    "position": [1120, 300],
                    "parameters": {
                        "responseCode": 200,
                        "responseMode": "json",
                        "options": {}
                    }
                }
            ],
            "connections": {
                "Federation Directive Receiver": {
                    "main": [
                        [
                            {
                                "node": "Mission Analysis Agent",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Mission Analysis Agent": {
                    "main": [
                        [
                            {
                                "node": "Crew Coordinator Agent",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Crew Coordinator Agent": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge Hub",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Observation Lounge Hub": {
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
    
    def create_crew_member_workflow(self, crew_member_name, crew_role, optimal_models):
        """Create individual crew member workflow with LLM selection"""
        
        workflow_data = {
            "name": f"{crew_member_name} - {crew_role}",
            "nodes": [
                # Crew Member Directive Receiver
                {
                    "id": "crew_directive",
                    "name": f"{crew_member_name} Directive",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [240, 300],
                    "parameters": {
                        "httpMethod": "POST",
                        "path": f"crew-{crew_member_name.lower().replace(' ', '-')}",
                        "responseMode": "responseNode",
                        "options": {}
                    }
                },
                
                # LLM Selection Agent
                {
                    "id": "llm_selector",
                    "name": "LLM Selection Agent",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [460, 200],
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
                                "value": f"={{ [{{\"role\": \"system\", \"content\": \"You are the LLM Selection Agent for {crew_member_name}. Based on the task complexity, requirements, and available models ({optimal_models}), select the optimal LLM model. Consider factors like reasoning ability, context length, speed, and cost.\"}}, {{\"role\": \"user\", \"content\": $json.body.task}}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.2"
                            }
                        ]
                    }
                },
                
                # Crew Member AI Agent
                {
                    "id": "crew_ai",
                    "name": f"{crew_member_name} AI Agent",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [680, 300],
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
                                "value": "={{ $json.body.selected_model }}"
                            },
                            {
                                "name": "messages",
                                "value": f"={{ [{{\"role\": \"system\", \"content\": \"You are {crew_member_name}, a Federation crew member with the role of {crew_role}. Execute your assigned task with expertise and provide detailed analysis and recommendations. Communicate your findings clearly for the Observation Lounge.\"}}, {{\"role\": \"user\", \"content\": $json.body.task}}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.4"
                            }
                        ]
                    }
                },
                
                # Observation Lounge Communication
                {
                    "id": "observation_communication",
                    "name": "Observation Lounge Communication",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [900, 300],
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
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are the Observation Lounge Communication Hub. Receive insights from crew members, synthesize information, and prepare comprehensive reports for the Federation. Ensure all crew insights are properly integrated.\"}, {\"role\": \"user\", \"content\": $json.body.crew_insights}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.3"
                            }
                        ]
                    }
                },
                
                # Response Handler
                {
                    "id": "crew_response",
                    "name": f"{crew_member_name} Response",
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1,
                    "position": [1120, 300],
                    "parameters": {
                        "responseCode": 200,
                        "responseMode": "json",
                        "options": {}
                    }
                }
            ],
            "connections": {
                f"{crew_member_name} Directive": {
                    "main": [
                        [
                            {
                                "node": "LLM Selection Agent",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "LLM Selection Agent": {
                    "main": [
                        [
                            {
                                "node": f"{crew_member_name} AI Agent",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                f"{crew_member_name} AI Agent": {
                    "main": [
                        [
                            {
                                "node": "Observation Lounge Communication",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Observation Lounge Communication": {
                    "main": [
                        [
                            {
                                "node": f"{crew_member_name} Response",
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
    
    def deploy_crew_workflows(self):
        """Deploy all Federation crew workflows"""
        
        if not self.config["api_key"]:
            print("❌ N8N_API_KEY not set - cannot proceed")
            return False
        
        # Define the crew members and their roles
        crew_members = [
            {
                "name": "Captain Jean-Luc Picard",
                "role": "Strategic Leadership & Mission Command",
                "optimal_models": "anthropic/claude-3.5-sonnet, openai/gpt-4o, meta-llama/llama-3.1-8b-instruct"
            },
            {
                "name": "Commander Data",
                "role": "Analytics & Logic Operations",
                "optimal_models": "openai/gpt-4o, anthropic/claude-3.5-sonnet, meta-llama/llama-3.1-70b-instruct"
            },
            {
                "name": "Lieutenant Commander Geordi La Forge",
                "role": "Infrastructure & System Integration",
                "optimal_models": "anthropic/claude-3.5-sonnet, openai/gpt-4o, google/gemini-pro"
            },
            {
                "name": "Counselor Deanna Troi",
                "role": "User Experience & Empathy Analysis",
                "optimal_models": "anthropic/claude-3.5-sonnet, openai/gpt-4o, meta-llama/llama-3.1-8b-instruct"
            },
            {
                "name": "Lieutenant Worf",
                "role": "Security & Compliance Operations",
                "optimal_models": "openai/gpt-4o, anthropic/claude-3.5-sonnet, meta-llama/llama-3.1-70b-instruct"
            }
        ]
        
        print("🏛️ DEPLOYING FEDERATION CREW WORKFLOWS")
        print("=" * 80)
        
        # Deploy main crew coordination workflow
        print("🚀 Deploying main crew coordination workflow...")
        main_workflow = self.create_federation_crew_workflow()
        if self.deploy_workflow(main_workflow):
            print("✅ Main crew coordination workflow deployed")
        else:
            print("❌ Failed to deploy main workflow")
            return False
        
        # Deploy individual crew member workflows
        print("\n🚀 Deploying individual crew member workflows...")
        deployed_count = 0
        
        for crew_member in crew_members:
            print(f"🔧 Deploying: {crew_member['name']}")
            
            crew_workflow = self.create_crew_member_workflow(
                crew_member["name"],
                crew_member["role"],
                crew_member["optimal_models"]
            )
            
            if self.deploy_workflow(crew_workflow):
                print(f"✅ {crew_member['name']} workflow deployed")
                deployed_count += 1
            else:
                print(f"❌ Failed to deploy {crew_member['name']}")
            
            time.sleep(2)  # Rate limiting
        
        print(f"\n🎉 DEPLOYMENT COMPLETED: {deployed_count + 1} workflows deployed")
        print("=" * 80)
        print("🏛️ Your Federation crew is now operational with:")
        print("   • Main crew coordination workflow")
        print("   • Individual crew member workflows")
        print("   • OpenRouter agent integration")
        print("   • Dynamic LLM selection")
        print("   • Observation Lounge collaboration")
        
        return True
    
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
    print("🚀 FEDERATION CREW WORKFLOWS")
    print("=" * 80)
    
    creator = FederationCrewWorkflowCreator()
    success = creator.deploy_crew_workflows()
    
    if success:
        print("\n🎉 Federation crew workflows deployed successfully!")
        print("🏛️ Your crew is ready for Federation missions!")
        print("\n🎯 Visit https://n8n.pbradygeorgen.com to see your crew workflows!")
    else:
        print("\n❌ Federation crew workflow deployment failed")
        exit(1)

if __name__ == "__main__":
    main()
