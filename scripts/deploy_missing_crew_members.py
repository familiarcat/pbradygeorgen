#!/usr/bin/env python3
"""
Deploy Missing Crew Members to N8N
Deploys Commander William Riker and Dr. Beverly Crusher workflows
"""

import requests
import json
import os
import sys
from typing import Dict, Any

class MissingCrewDeployer:
    def __init__(self):
        self.n8n_base_url = "https://n8n.pbradygeorgen.com"
        self.api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"
        self.headers = {
            "X-N8N-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }
        
        # Load OpenRouter API key from environment
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.openrouter_api_key:
            print("❌ OPENROUTER_API_KEY not found in environment")
            sys.exit(1)

    def create_riker_workflow(self) -> Dict[str, Any]:
        """Create Commander William Riker workflow"""
        return {
            "name": "Commander William Riker - Tactical Execution & Workflow Management",
            "nodes": [
                {
                    "id": "webhook_trigger",
                    "name": "Webhook Trigger",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [240, 300],
                    "parameters": {
                        "httpMethod": "POST",
                        "path": "crew-commander-william-riker",
                        "responseMode": "responseNode",
                        "options": {}
                    }
                },
                {
                    "id": "riker_ai",
                    "name": "Commander William Riker - AI",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [460, 300],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": f"Bearer {self.openrouter_api_key}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "anthropic/claude-3-haiku"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Commander William Riker, First Officer of the Federation crew. You specialize in tactical execution, workflow management, operational efficiency, and tactical decision making. You excel at operational planning, tactical implementation, and crew coordination. Provide clear, actionable tactical guidance and operational recommendations.\"}, {\"role\": \"user\", \"content\": $json.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.7"
                            },
                            {
                                "name": "max_tokens",
                                "value": "1000"
                            }
                        ]
                    }
                },
                {
                    "id": "response_formatter",
                    "name": "Response Formatter",
                    "type": "n8n-nodes-base.set",
                    "typeVersion": 1,
                    "position": [680, 300],
                    "parameters": {
                        "values": {
                            "string": [
                                {
                                    "name": "crew_member",
                                    "value": "Commander William Riker"
                                },
                                {
                                    "name": "role",
                                    "value": "Tactical Execution & Workflow Management"
                                },
                                {
                                    "name": "response",
                                    "value": "={{ $json.choices[0].message.content }}"
                                },
                                {
                                    "name": "timestamp",
                                    "value": "={{ new Date().toISOString() }}"
                                }
                            ]
                        }
                    }
                }
            ],
            "connections": {
                "Webhook Trigger": {
                    "main": [
                        [
                            {
                                "node": "Commander William Riker - AI",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Commander William Riker - AI": {
                    "main": [
                        [
                            {
                                "node": "Response Formatter",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                }
            },
            "active": True,
            "settings": {},
            "tags": ["crew", "riker", "tactical", "execution"]
        }

    def create_crusher_workflow(self) -> Dict[str, Any]:
        """Create Dr. Beverly Crusher workflow"""
        return {
            "name": "Dr. Beverly Crusher - Health & Diagnostics Officer",
            "nodes": [
                {
                    "id": "webhook_trigger",
                    "name": "Webhook Trigger",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [240, 300],
                    "parameters": {
                        "httpMethod": "POST",
                        "path": "crew-dr-beverly-crusher",
                        "responseMode": "responseNode",
                        "options": {}
                    }
                },
                {
                    "id": "crusher_ai",
                    "name": "Dr. Beverly Crusher - AI",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [460, 300],
                    "parameters": {
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "method": "POST",
                        "authentication": "genericCredentialType",
                        "genericAuthType": "httpHeaderAuth",
                        "nodeCredentialType": "httpHeaderAuth",
                        "httpHeaderAuth": f"Bearer {self.openrouter_api_key}",
                        "sendBody": True,
                        "bodyParameters": [
                            {
                                "name": "model",
                                "value": "anthropic/claude-3-haiku"
                            },
                            {
                                "name": "messages",
                                "value": "={{ [{\"role\": \"system\", \"content\": \"You are Dr. Beverly Crusher, Chief Medical Officer of the Federation crew. You specialize in system health monitoring, performance diagnostics, error detection, and preventive maintenance. You excel at identifying potential issues before they become problems and providing health-focused recommendations. Provide clear diagnostic insights and health optimization guidance.\"}, {\"role\": \"user\", \"content\": $json.mission_description}] }}"
                            },
                            {
                                "name": "temperature",
                                "value": "0.7"
                            },
                            {
                                "name": "max_tokens",
                                "value": "1000"
                            }
                        ]
                    }
                },
                {
                    "id": "response_formatter",
                    "name": "Response Formatter",
                    "type": "n8n-nodes-base.set",
                    "typeVersion": 1,
                    "position": [680, 300],
                    "parameters": {
                        "values": {
                            "string": [
                                {
                                    "name": "crew_member",
                                    "value": "Dr. Beverly Crusher"
                                },
                                {
                                    "name": "role",
                                    "value": "Health & Diagnostics Officer"
                                },
                                {
                                    "name": "response",
                                    "value": "={{ $json.choices[0].message.content }}"
                                },
                                {
                                    "name": "timestamp",
                                    "value": "={{ new Date().toISOString() }}"
                                }
                            ]
                        }
                    }
                }
            ],
            "connections": {
                "Webhook Trigger": {
                    "main": [
                        [
                            {
                                "node": "Dr. Beverly Crusher - AI",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                },
                "Dr. Beverly Crusher - AI": {
                    "main": [
                        [
                            {
                                "node": "Response Formatter",
                                "type": "main",
                                "index": 0
                            }
                        ]
                    ]
                }
            },
            "active": True,
            "settings": {},
            "tags": ["crew", "crusher", "health", "diagnostics"]
        }

    def deploy_workflow(self, workflow_data: Dict[str, Any]) -> bool:
        """Deploy a workflow to n8n"""
        try:
            response = requests.post(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers=self.headers,
                json=workflow_data
            )
            response.raise_for_status()
            result = response.json()
            print(f"   ✅ Successfully deployed: {workflow_data['name']}")
            print(f"   🆔 Workflow ID: {result.get('data', {}).get('id', 'Unknown')}")
            return True
        except Exception as e:
            print(f"   ❌ Failed to deploy {workflow_data['name']}: {e}")
            return False

    def test_webhook(self, webhook_path: str, crew_member: str) -> bool:
        """Test a webhook endpoint"""
        try:
            response = requests.post(
                f"{self.n8n_base_url}/webhook/{webhook_path}",
                headers={"Content-Type": "application/json"},
                json={"mission_description": f"Test mission for {crew_member}"},
                timeout=30
            )
            if response.status_code == 200:
                print(f"   ✅ Webhook test successful: /webhook/{webhook_path}")
                return True
            else:
                print(f"   ❌ Webhook test failed: /webhook/{webhook_path} (Status: {response.status_code})")
                return False
        except Exception as e:
            print(f"   ❌ Webhook test failed: /webhook/{webhook_path} - {e}")
            return False

    def deploy_missing_crew(self) -> bool:
        """Deploy all missing crew members"""
        print("🚀 DEPLOYING MISSING CREW MEMBERS TO N8N")
        print("=" * 60)
        
        # Create workflows
        riker_workflow = self.create_riker_workflow()
        crusher_workflow = self.create_crusher_workflow()
        
        workflows_to_deploy = [
            ("Commander William Riker", riker_workflow, "crew-commander-william-riker"),
            ("Dr. Beverly Crusher", crusher_workflow, "crew-dr-beverly-crusher")
        ]
        
        success_count = 0
        
        for crew_member, workflow, webhook_path in workflows_to_deploy:
            print(f"\n🎖️ Deploying {crew_member}...")
            if self.deploy_workflow(workflow):
                success_count += 1
                
                # Wait a moment for n8n to process
                import time
                time.sleep(3)
                
                # Test webhook
                print(f"   🧪 Testing webhook for {crew_member}...")
                self.test_webhook(webhook_path, crew_member)
        
        print(f"\n📊 Deployment Results: {success_count}/{len(workflows_to_deploy)} crew members deployed")
        
        if success_count == len(workflows_to_deploy):
            print("🎉 ALL MISSING CREW MEMBERS SUCCESSFULLY DEPLOYED!")
            print("   The Federation crew is now complete and operational.")
        else:
            print("⚠️  Some crew members failed to deploy. Please check the n8n interface.")
        
        return success_count == len(workflows_to_deploy)

def main():
    """Main deployment function"""
    deployer = MissingCrewDeployer()
    success = deployer.deploy_missing_crew()
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
