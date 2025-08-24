#!/usr/bin/env python3
"""
N8N Workflow Deployment Script
Deploys AlexAI Optimized Crew workflows to n8n instance
"""

import os
import json
import requests
from pathlib import Path

class N8NDeployer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.headers = {
            'Authorization': f'Bearer {self.n8n_api_key}',
            'Content-Type': 'application/json'
        }
        
    def test_connection(self):
        """Test connection to n8n instance"""
        try:
            response = requests.get(f"{self.n8n_url}/api/health", headers=self.headers)
            if response.status_code == 200:
                print("✅ Successfully connected to n8n instance")
                return True
            else:
                print(f"❌ Failed to connect to n8n: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def deploy_workflow(self, workflow_file):
        """Deploy a single workflow to n8n"""
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            # Prepare workflow for n8n import
            workflow_payload = {
                "name": workflow_data.get("name", "Unknown Workflow"),
                "active": False,  # Start inactive for safety
                "nodes": workflow_data.get("workflow_nodes", []),
                "connections": {},
                "settings": {
                    "executionOrder": "v1"
                }
            }
            
            # Import workflow to n8n
            response = requests.post(
                f"{self.n8n_url}/api/v1/workflows",
                headers=self.headers,
                json=workflow_payload
            )
            
            if response.status_code in [200, 201]:
                workflow_id = response.json().get('id')
                print(f"✅ Deployed workflow: {workflow_data.get('name')} (ID: {workflow_id})")
                return workflow_id
            else:
                print(f"❌ Failed to deploy {workflow_data.get('name')}: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error deploying {workflow_file}: {e}")
            return None
    
    def deploy_all_workflows(self, workflows_dir):
        """Deploy all workflows from the workflows directory"""
        workflows_path = Path(workflows_dir)
        workflow_files = list(workflows_path.glob("*.json"))
        
        print(f"🔧 Found {len(workflow_files)} workflow files to deploy")
        
        deployed_workflows = []
        for workflow_file in workflow_files:
            workflow_id = self.deploy_workflow(workflow_file)
            if workflow_id:
                deployed_workflows.append({
                    "file": workflow_file.name,
                    "id": workflow_id
                })
        
        return deployed_workflows

def main():
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv('.env.n8n')
    
    deployer = N8NDeployer()
    
    # Test connection
    if not deployer.test_connection():
        print("❌ Cannot proceed without n8n connection")
        return
    
    # Deploy workflows
    print("🚀 Starting workflow deployment...")
    deployed = deployer.deploy_all_workflows('n8n_workflows')
    
    print(f"\n📊 Deployment Summary:")
    print(f"  • Total workflows: {len(deployed)}")
    print(f"  • Successfully deployed: {len(deployed)}")
    
    if deployed:
        print("\n✅ All workflows deployed successfully!")
        print("Next steps:")
        print("1. Activate workflows in n8n interface")
        print("2. Configure OpenRouter authentication")
        print("3. Test crew member workflows")
    else:
        print("❌ No workflows were deployed successfully")

if __name__ == "__main__":
    main()
