#!/usr/bin/env python3
"""
Create Quark's Workflow with Optimal Template Format
Builds Quark's workflow using the exact 7-node structure from Captain Picard.
"""

import json
import requests
import os
import uuid
from typing import Dict, List
from datetime import datetime

class QuarkWorkflowCreator:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
    def create_quark_workflow(self) -> Dict:
        """Create Quark's workflow using the optimal 7-node template."""
        
        print("🔧 Creating Quark's optimal workflow...")
        
        # Generate unique IDs for all nodes
        directive_id = str(uuid.uuid4())
        memory_retrieval_id = str(uuid.uuid4())
        llm_selection_id = str(uuid.uuid4())
        ai_agent_id = str(uuid.uuid4())
        memory_storage_id = str(uuid.uuid4())
        communication_id = str(uuid.uuid4())
        response_id = str(uuid.uuid4())
        
        # Create the optimal 7-node workflow structure
        workflow = {
            "name": "Crew - Quark - Business Intelligence & Budget Optimization",
            "nodes": [
                # 1. Directive Node (Webhook trigger)
                {
                    "id": directive_id,
                    "name": "Quark Directive",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [240, 304],
                    "parameters": {
                        "httpMethod": "POST",
                        "path": "crew-quark",
                        "responseMode": "responseNode",
                        "options": {}
                    },
                    "webhookId": str(uuid.uuid4())
                },
                
                # 2. Memory Retrieval Node (Supabase GET)
                {
                    "id": memory_retrieval_id,
                    "name": "Quark Memory Retrieval",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [464, 112],
                    "parameters": {
                        "authentication": "genericCredentialType",
                        "url": "https://rpkkkbufdwxmjaerbhbn.supabase.co/rest/v1/crew_memories?crew_member=eq.Quark",
                        "method": "GET",
                        "options": {}
                    }
                },
                
                # 3. LLM Selection Agent Node (OpenRouter API)
                {
                    "id": llm_selection_id,
                    "name": "LLM Selection Agent",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [464, 208],
                    "parameters": {
                        "authentication": "genericCredentialType",
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "sendHeaders": True,
                        "headerParameters": {
                            "parameters": [
                                {
                                    "name": "Authorization",
                                    "value": "Bearer {{ $env.OPENROUTER_API_KEY }}"
                                },
                                {
                                    "name": "Content-Type",
                                    "value": "application/json"
                                }
                            ]
                        },
                        "sendBody": True,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "model",
                                    "value": "anthropic/claude-3.5-sonnet"
                                },
                                {
                                    "name": "messages",
                                    "value": "=[{\"role\": \"system\", \"content\": \"You are an LLM selection agent. Choose the best model for the given task.\"}]"
                                }
                            ]
                        },
                        "options": {}
                    }
                },
                
                # 4. AI Agent Node (Core LLM processing)
                {
                    "id": ai_agent_id,
                    "name": "Quark AI Agent",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [688, 304],
                    "parameters": {
                        "authentication": "genericCredentialType",
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "sendHeaders": True,
                        "headerParameters": {
                            "parameters": [
                                {
                                    "name": "Authorization",
                                    "value": "Bearer {{ $env.OPENROUTER_API_KEY }}"
                                },
                                {
                                    "name": "Content-Type",
                                    "value": "application/json"
                                }
                            ]
                        },
                        "sendBody": True,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "model",
                                    "value": "={{ $json.model }}"
                                },
                                {
                                    "name": "messages",
                                    "value": "=[{\"role\": \"system\", \"content\": \"You are Quark, Business Intelligence & Budget Optimization specialist. Your role is to analyze business intelligence and market trends, optimize budgets and resource allocation, provide financial insights and recommendations, and ensure cost-effective operations. Respond in character with your business acumen and financial expertise.\"}, {\"role\": \"user\", \"content\": \"={{ $json.body.directive }}\"}]"
                                }
                            ]
                        },
                        "options": {}
                    }
                },
                
                # 5. Memory Storage Node (Supabase POST)
                {
                    "id": memory_storage_id,
                    "name": "Quark Memory Storage",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [912, 112],
                    "parameters": {
                        "authentication": "genericCredentialType",
                        "url": "https://rpkkkbufdwxmjaerbhbn.supabase.co/rest/v1/crew_memories",
                        "method": "POST",
                        "sendHeaders": True,
                        "headerParameters": {
                            "parameters": [
                                {
                                    "name": "Content-Type",
                                    "value": "application/json"
                                }
                            ]
                        },
                        "sendBody": True,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "crew_member",
                                    "value": "Quark"
                                },
                                {
                                    "name": "memory_content",
                                    "value": "={{ $json.choices[0].message.content }}"
                                },
                                {
                                    "name": "timestamp",
                                    "value": "={{ new Date().toISOString() }}"
                                }
                            ]
                        },
                        "options": {}
                    }
                },
                
                # 6. Observation Lounge Communication Node
                {
                    "id": communication_id,
                    "name": "Observation Lounge Communication",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [912, 304],
                    "parameters": {
                        "authentication": "genericCredentialType",
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "sendHeaders": True,
                        "headerParameters": {
                            "parameters": [
                                {
                                    "name": "Authorization",
                                    "value": "Bearer {{ $env.OPENROUTER_API_KEY }}"
                                },
                                {
                                    "name": "Content-Type",
                                    "value": "application/json"
                                }
                            ]
                        },
                        "sendBody": True,
                        "bodyParameters": {
                            "parameters": [
                                {
                                    "name": "model",
                                    "value": "anthropic/claude-3.5-sonnet"
                                },
                                {
                                    "name": "messages",
                                    "value": "=[{\"role\": \"system\", \"content\": \"You are the Observation Lounge communication system. Process and format crew responses for display.\"}, {\"role\": \"user\", \"content\": \"={{ $json.choices[0].message.content }}\"}]"
                                }
                            ]
                        },
                        "options": {}
                    }
                },
                
                # 7. Response Node (Final output)
                {
                    "id": response_id,
                    "name": "Quark Response",
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1,
                    "position": [1136, 304],
                    "parameters": {
                        "respondWith": "json",
                        "responseBody": "={{ { \"crew_member\": \"Quark\", \"response\": $json.choices[0].message.content, \"timestamp\": new Date().toISOString() } }}",
                        "options": {}
                    }
                }
            ],
            
            # Create the exact connection pattern from Picard's template
            "connections": {
                directive_id: {
                    "main": [
                        [
                            {
                                "node": memory_retrieval_id,
                                "type": "main",
                                "index": 0
                            }
                        ],
                        [
                            {
                                "node": llm_selection_id,
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                memory_retrieval_id: {
                    "main": [
                        [
                            {
                                "node": ai_agent_id,
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                llm_selection_id: {
                    "main": [
                        [
                            {
                                "node": ai_agent_id,
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                ai_agent_id: {
                    "main": [
                        [
                            {
                                "node": memory_storage_id,
                                "type": "main",
                                "index": 0
                            }
                        ],
                        [
                            {
                                "node": communication_id,
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                memory_storage_id: {
                    "main": [
                        [
                            {
                                "node": response_id,
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                communication_id: {
                    "main": [
                        [
                            {
                                "node": response_id,
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                }
            },
            
            # Essential n8n settings
            "settings": {}
        }
        
        print(f"      ✅ Created optimal 7-node workflow structure for Quark")
        return workflow
    
    def deploy_workflow(self, workflow: Dict) -> bool:
        """Deploy the workflow to n8n."""
        try:
            response = requests.post(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, json=workflow)
            
            if response.status_code in [200, 201]:
                print(f"   ✅ Successfully deployed Quark's workflow!")
                print(f"      Workflow ID: {response.json().get('id', 'Unknown')}")
                return True
            else:
                print(f"   ❌ Failed to deploy workflow: {response.status_code}")
                print(f"      Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error deploying workflow: {e}")
            return False
    
    def create_and_deploy(self):
        """Create and deploy Quark's workflow."""
        print("🚀 CREATING QUARK'S OPTIMAL WORKFLOW")
        print("=" * 70)
        
        # Step 1: Create the workflow
        print("📡 Step 1: Creating optimal 7-node workflow structure...")
        workflow = self.create_quark_workflow()
        
        # Step 2: Deploy the workflow
        print("\n📡 Step 2: Deploying to n8n...")
        success = self.deploy_workflow(workflow)
        
        if success:
            print(f"\n🎉 QUARK'S WORKFLOW SUCCESSFULLY CREATED!")
            print(f"   ✅ Optimal 7-node template structure implemented")
            print(f"   ✅ Proper memory integration with Supabase")
            print(f"   ✅ LLM integration with OpenRouter")
            print(f"   ✅ Complete workflow flow from directive to response")
            print(f"   ✅ Aligned with Captain Picard's optimal template")
            print(f"\n📋 Next Steps:")
            print(f"   1. Activate the workflow in n8n UI")
            print(f"   2. Test webhook endpoint: crew-quark")
            print(f"   3. Verify memory storage and retrieval")
            print(f"   4. Test LLM response generation")
        else:
            print(f"\n⚠️  Workflow creation failed - check the error details above")
        
        return success

if __name__ == "__main__":
    try:
        creator = QuarkWorkflowCreator()
        success = creator.create_and_deploy()
        
        if success:
            print(f"\n🎯 Quark's workflow successfully created with optimal template format!")
        else:
            print(f"\n⚠️  Workflow creation failed - manual intervention may be required")
            
    except Exception as e:
        print(f"❌ Quark workflow creation failed: {e}")
