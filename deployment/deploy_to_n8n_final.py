#!/usr/bin/env python3
"""
🚀 FINAL N8N DEPLOYMENT - CREW MANAGEMENT SYSTEM
Deploys the complete crew management workflow to n8n.pbradygeorgen.com
Uses local credentials from ~/.zshrc for secure deployment
"""

import os
import json
import subprocess
import requests
from datetime import datetime
from typing import Dict, Any

class FinalN8NDeployment:
    def __init__(self):
        self.deployment_results = {
            "timestamp": datetime.now().isoformat(),
            "deployment_type": "crew_management_system",
            "status": "initializing",
            "workflow_deployed": False,
            "workflow_id": None,
            "webhook_url": None,
            "deployment_steps": []
        }
        
        # Load environment variables
        self.load_environment()
    
    def load_environment(self):
        """Load environment variables from ~/.zshrc"""
        print("🔐 Loading environment variables from ~/.zshrc...")
        
        try:
            result = subprocess.run(
                ['bash', '-c', 'source ~/.zshrc && env'],
                capture_output=True, text=True, timeout=30
            )
            
            if result.returncode == 0:
                env_vars = {}
                for line in result.stdout.split('\n'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key] = value
                
                self.n8n_api_key = env_vars.get('N8N_API_KEY', '')
                self.openrouter_api_key = env_vars.get('OPENROUTER_API_KEY', '')
                self.n8n_url = env_vars.get('N8N_URL', '')
                
                if self.n8n_api_key and self.openrouter_api_key and self.n8n_url:
                    print(f"✅ N8N API Key: {self.n8n_api_key[:20]}...")
                    print(f"✅ OpenRouter API Key: {self.openrouter_api_key[:20]}...")
                    print(f"✅ N8N URL: {self.n8n_url}")
                    
                    self.deployment_results["deployment_steps"].append({
                        "step": "environment_loaded",
                        "status": "success",
                        "timestamp": datetime.now().isoformat()
                    })
                    return True
                else:
                    print("❌ Missing required environment variables")
                    return False
            else:
                print(f"❌ Failed to load environment variables: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error loading environment: {e}")
            return False
    
    def test_n8n_connection(self) -> bool:
        """Test connection to n8n instance"""
        print("🔌 Testing n8n connection...")
        
        try:
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.n8n_url}/api/health",
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ n8n connection successful")
                self.deployment_results["deployment_steps"].append({
                    "step": "n8n_connection_test",
                    "status": "success",
                    "timestamp": datetime.now().isoformat()
                })
                return True
            else:
                print(f"❌ n8n connection failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def deploy_crew_management_workflow(self) -> bool:
        """Deploy the crew management workflow to n8n"""
        print("🚀 Deploying crew management workflow to n8n...")
        
        try:
            # Load the workflow file
            workflow_file = "crew_management_workflow.json"
            if not os.path.exists(workflow_file):
                print(f"❌ Workflow file not found: {workflow_file}")
                return False
            
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            print(f"📋 Workflow loaded: {workflow_data.get('name', 'Unknown')}")
            print(f"🔧 Nodes: {len(workflow_data.get('nodes', []))}")
            print(f"🔗 Connections: {len(workflow_data.get('connections', {}))}")
            
            # Prepare deployment payload
            deployment_payload = {
                "name": workflow_data["name"],
                "nodes": workflow_data["nodes"],
                "connections": workflow_data["connections"],
                "settings": workflow_data["settings"]
            }
            
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            print("📤 Sending deployment request...")
            response = requests.post(
                f"{self.n8n_url}/api/v1/workflows",
                headers=headers,
                json=deployment_payload,
                timeout=60
            )
            
            if response.status_code == 201:
                workflow_info = response.json()
                workflow_id = workflow_info.get('id')
                
                print(f"✅ Workflow deployed successfully!")
                print(f"🆔 Workflow ID: {workflow_id}")
                print(f"📋 Name: {workflow_data['name']}")
                
                self.deployment_results["workflow_deployed"] = True
                self.deployment_results["workflow_id"] = workflow_id
                self.deployment_results["webhook_url"] = f"{self.n8n_url}/webhook/crew-management"
                
                self.deployment_results["deployment_steps"].append({
                    "step": "workflow_deployment",
                    "status": "success",
                    "workflow_id": workflow_id,
                    "timestamp": datetime.now().isoformat()
                })
                
                return True
            else:
                print(f"❌ Workflow deployment failed: {response.status_code}")
                print(f"Response: {response.text}")
                
                self.deployment_results["deployment_steps"].append({
                    "step": "workflow_deployment",
                    "status": "failed",
                    "error": response.text,
                    "timestamp": datetime.now().isoformat()
                })
                
                return False
                
        except Exception as e:
            print(f"❌ Deployment error: {e}")
            
            self.deployment_results["deployment_steps"].append({
                "step": "workflow_deployment",
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            })
            
            return False
    
    def activate_workflow(self) -> bool:
        """Activate the deployed workflow"""
        print("🔌 Activating workflow...")
        
        try:
            workflow_id = self.deployment_results.get("workflow_id")
            if not workflow_id:
                print("❌ No workflow ID available")
                return False
            
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            # Try PATCH method for activation
            response = requests.patch(
                f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                headers=headers,
                json={"active": True},
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Workflow activated successfully!")
                self.deployment_results["deployment_steps"].append({
                    "step": "workflow_activation",
                    "status": "success",
                    "timestamp": datetime.now().isoformat()
                })
                return True
            else:
                print(f"❌ Workflow activation failed: {response.status_code}")
                print(f"Response: {response.text}")
                
                self.deployment_results["deployment_steps"].append({
                    "step": "workflow_activation",
                    "status": "failed",
                    "error": response.text,
                    "timestamp": datetime.now().isoformat()
                })
                
                return False
                
        except Exception as e:
            print(f"❌ Activation error: {e}")
            
            self.deployment_results["deployment_steps"].append({
                "step": "workflow_activation",
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            })
            
            return False
    
    def test_crew_management_webhook(self) -> bool:
        """Test the crew management webhook"""
        print("🧪 Testing crew management webhook...")
        
        try:
            webhook_url = self.deployment_results.get("webhook_url")
            if not webhook_url:
                print("❌ No webhook URL available")
                return False
            
            # Test payload for adding a crew member
            test_payload = {
                "operation": "add_crew",
                "name": "Test Crew Member",
                "role": "test_specialist",
                "specialization": "System testing and validation",
                "llm_preference": "openai/gpt-4o-mini"
            }
            
            print(f"🌐 Testing webhook: {webhook_url}")
            response = requests.post(
                webhook_url,
                json=test_payload,
                timeout=30
            )
            
            if response.status_code == 200:
                print("✅ Webhook test successful!")
                print(f"Response: {response.text[:200]}...")
                
                self.deployment_results["deployment_steps"].append({
                    "step": "webhook_test",
                    "status": "success",
                    "response_preview": response.text[:200],
                    "timestamp": datetime.now().isoformat()
                })
                
                return True
            else:
                print(f"❌ Webhook test failed: {response.status_code}")
                print(f"Response: {response.text}")
                
                self.deployment_results["deployment_steps"].append({
                    "step": "webhook_test",
                    "status": "failed",
                    "error": response.text,
                    "timestamp": datetime.now().isoformat()
                })
                
                return False
                
        except Exception as e:
            print(f"❌ Webhook test error: {e}")
            
            self.deployment_results["deployment_steps"].append({
                "step": "webhook_test",
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            })
            
            return False
    
    def generate_deployment_summary(self):
        """Generate deployment summary for user"""
        print("\n" + "=" * 70)
        print("📋 DEPLOYMENT SUMMARY")
        print("=" * 70)
        
        if self.deployment_results["workflow_deployed"]:
            print("✅ CREW MANAGEMENT SYSTEM SUCCESSFULLY DEPLOYED!")
            print(f"🆔 Workflow ID: {self.deployment_results['workflow_id']}")
            print(f"🌐 Webhook URL: {self.deployment_results['webhook_url']}")
            print(f"🔗 n8n UI: {self.n8n_url}")
            
            print("\n📋 NEXT STEPS:")
            print("1. Open n8n UI at the URL above")
            print("2. Navigate to Workflows")
            print("3. Find 'AlexAI Crew Management System'")
            print("4. Verify it's active and operational")
            print("5. Test crew operations via webhook")
            
            print("\n🧪 TEST COMMANDS:")
            print(f"# Add crew member:")
            print(f"curl -X POST {self.deployment_results['webhook_url']} \\")
            print(f"  -H 'Content-Type: application/json' \\")
            print(f"  -d '{{\"operation\": \"add_crew\", \"name\": \"Test Member\", \"role\": \"test_role\"}}'")
            
            print(f"\n# Generate crew report:")
            print(f"curl -X POST {self.deployment_results['webhook_url']} \\")
            print(f"  -H 'Content-Type: application/json' \\")
            print(f"  -d '{{\"operation\": \"crew_report\"}}'")
            
        else:
            print("❌ DEPLOYMENT FAILED")
            print("Check the logs above for error details")
            print("The workflow file is ready for manual import")
            
            print("\n📋 MANUAL IMPORT STEPS:")
            print("1. Open n8n UI at the URL above")
            print("2. Go to Workflows → Import from file")
            print("3. Select: crew_management_workflow.json")
            print("4. Activate the imported workflow")
            print("5. Test crew operations")
        
        print("\n" + "=" * 70)
    
    def run_deployment(self) -> bool:
        """Run the complete deployment process"""
        print("🚀 STARTING FINAL N8N DEPLOYMENT")
        print("=" * 70)
        
        # Step 1: Load environment
        if not self.load_environment():
            print("❌ Failed to load environment variables")
            return False
        
        # Step 2: Test n8n connection
        if not self.test_n8n_connection():
            print("❌ Failed to connect to n8n")
            return False
        
        # Step 3: Deploy workflow
        if not self.deploy_crew_management_workflow():
            print("❌ Failed to deploy workflow")
            return False
        
        # Step 4: Activate workflow
        if not self.activate_workflow():
            print("❌ Failed to activate workflow")
            return False
        
        # Step 5: Test webhook
        if not self.test_crew_management_webhook():
            print("❌ Webhook test failed")
            return False
        
        # Update final status
        self.deployment_results["status"] = "completed_successfully"
        
        # Generate summary
        self.generate_deployment_summary()
        
        return True

def main():
    """Main function to run final deployment"""
    deployer = FinalN8NDeployment()
    success = deployer.run_deployment()
    
    if success:
        print("\n🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!")
        print("Your crew management system is now live in n8n!")
        print("Check the summary above for next steps and test commands.")
    else:
        print("\n❌ DEPLOYMENT FAILED")
        print("Check the logs above for error details.")
        print("The workflow file is ready for manual import if needed.")

if __name__ == "__main__":
    main()
