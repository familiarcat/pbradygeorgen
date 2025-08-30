#!/usr/bin/env python3
"""
Comprehensive n8n Workflow Fixer
Fixes all broken workflows by correcting node connections and redeploying
"""

import os
import json
import requests
from datetime import datetime
from typing import Dict, List, Any

class N8NWorkflowFixer:
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_api_key:
            print("❌ N8N_API_KEY not set")
            return
            
        self.session = requests.Session()
        self.session.headers.update({
            'X-N8N-API-KEY': self.n8n_api_key,
            'Content-Type': 'application/json'
        })
        
        # Define all expected workflows and their correct structures
        self.workflow_definitions = {
            "crew-captain-jean-luc-picard": {
                "name": "Crew - Captain Jean-Luc Picard - Strategic Leadership & Mission Command",
                "webhook_path": "crew-captain-jean-luc-picard",
                "status": "working"  # Already working
            },
            "crew-commander-william-riker": {
                "name": "Crew - Commander William Riker - Tactical Execution & Workflow Management",
                "webhook_path": "crew-commander-william-riker",
                "status": "broken",  # Needs fixing
                "fix_required": True
            },
            "crew-commander-data": {
                "name": "Crew - Commander Data - Analytical Processing & Logical Operations",
                "webhook_path": "crew-commander-data",
                "status": "unknown"
            },
            "crew-lieutenant-worf": {
                "name": "Crew - Lieutenant Worf - Security & Tactical Analysis",
                "webhook_path": "crew-lieutenant-worf",
                "status": "unknown"
            },
            "crew-lieutenant-commander-geordi-la-forge": {
                "name": "Crew - Lieutenant Commander Geordi La Forge - Engineering & Technical Solutions",
                "webhook_path": "crew-lieutenant-commander-geordi-la-forge",
                "status": "unknown"
            },
            "crew-counselor-deanna-troi": {
                "name": "Crew - Counselor Deanna Troi - Empathic Analysis & Human Factors",
                "webhook_path": "crew-counselor-deanna-troi",
                "status": "unknown"
            },
            "crew-lieutenant-uhura": {
                "name": "Crew - Lieutenant Uhura - Communications & Information Management",
                "webhook_path": "crew-lieutenant-uhura",
                "status": "unknown"
            },
            "crew-dr-beverly-crusher": {
                "name": "Crew - Dr. Beverly Crusher - Medical Analysis & Health Assessment",
                "webhook_path": "crew-dr-beverly-crusher",
                "status": "unknown"
            },
            "crew-quark": {
                "name": "Crew - Quark - Business Analysis & Financial Operations",
                "webhook_path": "crew-quark",
                "status": "unknown"
            }
        }

    def get_all_workflows(self) -> List[Dict[str, Any]]:
        """Get all workflows from n8n"""
        try:
            response = self.session.get(f"{self.n8n_base_url}/api/v1/workflows")
            if response.status_code == 200:
                data = response.json()
                workflows = data.get('data', []) if isinstance(data, dict) else data
                return workflows
            else:
                print(f"❌ Failed to get workflows: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error getting workflows: {e}")
            return []

    def test_webhook(self, webhook_path: str) -> Dict[str, Any]:
        """Test a webhook endpoint"""
        try:
            test_payload = {
                "test": "workflow_status_check",
                "timestamp": datetime.now().isoformat()
            }

            response = self.session.post(
                f"{self.n8n_base_url}/webhook/{webhook_path}",
                json=test_payload,
                timeout=10
            )

            return {
                "path": webhook_path,
                "status_code": response.status_code,
                "working": response.status_code == 200,
                "response": response.text[:100] if response.text else "No response",
                "error": None
            }
        except Exception as e:
            return {
                "path": webhook_path,
                "status_code": None,
                "working": False,
                "response": None,
                "error": str(e)
            }

    def diagnose_workflow_issues(self) -> Dict[str, Any]:
        """Diagnose all workflow issues"""
        print("🔍 Diagnosing n8n Workflow Issues")
        print("=" * 50)
        
        workflows = self.get_all_workflows()
        if not workflows:
            print("❌ No workflows found")
            return {}
            
        print(f"📋 Found {len(workflows)} workflows")
        print()
        
        diagnosis = {
            "total_workflows": len(workflows),
            "working_webhooks": 0,
            "broken_webhooks": 0,
            "unknown_webhooks": 0,
            "workflow_status": {}
        }
        
        # Test each expected webhook
        for webhook_path, config in self.workflow_definitions.items():
            print(f"🧪 Testing {webhook_path}...")
            status = self.test_webhook(webhook_path)
            
            if status["working"]:
                diagnosis["working_webhooks"] += 1
                config["status"] = "working"
                print(f"   ✅ {webhook_path}: Working (Status {status['status_code']})")
            else:
                diagnosis["broken_webhooks"] += 1
                config["status"] = "broken"
                print(f"   ❌ {webhook_path}: Broken (Status {status['status_code']})")
                if status["error"]:
                    print(f"      Error: {status['error']}")
            
            diagnosis["workflow_status"][webhook_path] = status
        
        print()
        print("📊 Diagnosis Summary")
        print("-" * 25)
        print(f"✅ Working Webhooks: {diagnosis['working_webhooks']}")
        print(f"❌ Broken Webhooks: {diagnosis['broken_webhooks']}")
        print(f"❓ Unknown Webhooks: {diagnosis['unknown_webhooks']}")
        
        return diagnosis

    def create_fixed_workflow(self, webhook_path: str) -> Dict[str, Any]:
        """Create a corrected workflow definition"""
        base_workflow = {
            "name": self.workflow_definitions[webhook_path]["name"],
            "nodes": [
                {
                    "parameters": {
                        "httpMethod": "POST",
                        "path": webhook_path,
                        "responseMode": "responseNode",
                        "options": {}
                    },
                    "id": "crew_directive",
                    "name": f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} Directive",
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 1,
                    "position": [240, 304],
                    "webhookId": f"webhook-{webhook_path}"
                },
                {
                    "parameters": {
                        "authentication": "genericCredentialType",
                        "url": "https://rpkkkbufdwxmjaerbhbn.supabase.co/rest/v1/crew_memories",
                        "options": {}
                    },
                    "id": "memory_retrieval",
                    "name": f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} Memory Retrieval",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [464, 112]
                },
                {
                    "parameters": {
                        "authentication": "genericCredentialType",
                        "url": "https://api.openrouter.ai/api/v1/chat/completions",
                        "options": {}
                    },
                    "id": "crew_ai",
                    "name": f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} AI Agent",
                    "type": "n8n-nodes-base.httpRequest",
                    "typeVersion": 1,
                    "position": [688, 304]
                },
                {
                    "parameters": {
                        "options": {}
                    },
                    "id": "crew_response",
                    "name": f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} Response",
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1,
                    "position": [912, 304]
                }
            ],
            "connections": {
                f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} Directive": {
                    "main": [[
                        {
                            "node": f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} Memory Retrieval",
                            "type": "main",
                            "index": 0
                        }
                    ]]
                },
                f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} Memory Retrieval": {
                    "main": [[
                        {
                            "node": f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} AI Agent",
                            "type": "main",
                            "index": 0
                        }
                    ]]
                },
                f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} AI Agent": {
                    "main": [[
                        {
                            "node": f"{self.workflow_definitions[webhook_path]['name'].split(' - ')[1]} Response",
                            "type": "main",
                            "index": 0
                        }
                    ]]
                }
            },
            "settings": {},
            "staticData": None,
            "meta": None,
            "pinData": None
        }
        
        return base_workflow

    def fix_workflow(self, webhook_path: str) -> bool:
        """Fix a specific broken workflow"""
        print(f"🔧 Fixing workflow: {webhook_path}")
        
        # Create corrected workflow
        corrected_workflow = self.create_fixed_workflow(webhook_path)
        
        # Find existing workflow ID
        workflows = self.get_all_workflows()
        workflow_id = None
        
        for workflow in workflows:
            if workflow.get("name") == corrected_workflow["name"]:
                workflow_id = workflow.get("id")
                break
        
        if not workflow_id:
            print(f"   ❌ Workflow not found: {corrected_workflow['name']}")
            return False
        
        # Update the workflow
        update_url = f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}"
        
        try:
            response = self.session.put(
                update_url,
                json=corrected_workflow,
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"   ✅ Workflow updated successfully!")
                return True
            else:
                print(f"   ❌ Failed to update workflow: {response.status_code}")
                print(f"      Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error updating workflow: {e}")
            return False

    def fix_all_broken_workflows(self) -> Dict[str, Any]:
        """Fix all broken workflows"""
        print("\n🚀 Fixing All Broken Workflows")
        print("=" * 40)
        
        # First diagnose issues
        diagnosis = self.diagnose_workflow_issues()
        
        if not diagnosis:
            return {}
        
        # Fix broken workflows
        fixed_count = 0
        failed_count = 0
        
        for webhook_path, config in self.workflow_definitions.items():
            if config.get("status") == "broken":
                print(f"\n🔧 Fixing {webhook_path}...")
                if self.fix_workflow(webhook_path):
                    fixed_count += 1
                else:
                    failed_count += 1
        
        # Test fixes
        print(f"\n🧪 Testing fixes...")
        final_diagnosis = self.diagnose_workflow_issues()
        
        results = {
            "initial_diagnosis": diagnosis,
            "final_diagnosis": final_diagnosis,
            "fixed_count": fixed_count,
            "failed_count": failed_count,
            "success_rate": fixed_count / (fixed_count + failed_count) if (fixed_count + failed_count) > 0 else 0
        }
        
        print(f"\n📊 Fix Results")
        print("-" * 20)
        print(f"✅ Fixed: {fixed_count}")
        print(f"❌ Failed: {failed_count}")
        print(f"📈 Success Rate: {results['success_rate']:.1%}")
        
        return results

    def save_results(self, results: Dict[str, Any]):
        """Save results to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"workflow_fix_results_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n📁 Results saved to: {filename}")
        return filename

def main():
    print("🚀 N8N Workflow Fixer")
    print("=" * 30)
    
    fixer = N8NWorkflowFixer()
    
    if not fixer.n8n_api_key:
        print("❌ Please set N8N_API_KEY environment variable")
        return
    
    # Fix all workflows
    results = fixer.fix_all_broken_workflows()
    
    if results:
        filename = fixer.save_results(results)
        print(f"\n🎯 Workflow fixing complete!")
        print(f"📊 Results saved to: {filename}")
    else:
        print("\n❌ Workflow fixing failed")

if __name__ == "__main__":
    main()
