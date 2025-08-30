#!/usr/bin/env python3
"""
N8N Workflow Deployment Script
Deploys corrected workflows to your n8n instance
"""

import os
import json
import requests
import time
from pathlib import Path
from typing import Dict, Any, Optional

class N8NWorkflowDeployer:
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.workflows_dir = Path('workflow_systems/standardized_crew/standardized_crew_workflows')
        
        if not self.n8n_api_key:
            print("❌ N8N_API_KEY environment variable not set")
            print("Please set it in your ~/.zshrc file")
            return
            
        self.session = requests.Session()
        self.session.headers.update({
            'X-N8N-API-KEY': self.n8n_api_key,
            'Content-Type': 'application/json'
        })
    
    def test_connection(self) -> bool:
        """Test connection to n8n instance"""
        try:
            # Use the workflows endpoint instead of health endpoint
            response = self.session.get(f"{self.n8n_base_url}/api/v1/workflows")
            if response.status_code == 200:
                print(f"✅ Connected to n8n instance: {self.n8n_base_url}")
                return True
            elif response.status_code == 401:
                print(f"❌ Authentication failed - check your N8N_API_KEY")
                return False
            elif response.status_code == 404:
                print(f"❌ API endpoint not found - check if n8n is running and accessible")
                return False
            else:
                print(f"❌ Failed to connect to n8n: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def get_existing_workflows(self) -> Dict[str, Any]:
        """Get list of existing workflows from n8n"""
        try:
            response = self.session.get(f"{self.n8n_base_url}/api/v1/workflows")
            if response.status_code == 200:
                data = response.json()
                
                # Handle different response formats
                if isinstance(data, dict) and 'data' in data:
                    workflows = data['data']
                elif isinstance(data, list):
                    workflows = data
                else:
                    print(f"⚠️  Unexpected response format: {type(data)}")
                    workflows = []
                
                return {wf['name']: wf for wf in workflows}
            else:
                print(f"❌ Failed to get workflows: {response.status_code}")
                return {}
        except Exception as e:
            print(f"❌ Error getting workflows: {e}")
            return {}
    
    def deploy_workflow(self, workflow_file: Path) -> bool:
        """Deploy a single workflow to n8n"""
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            workflow_name = workflow_data.get('name', workflow_file.stem)
            print(f"🚀 Deploying workflow: {workflow_name}")
            
            # Check if workflow already exists
            existing_workflows = self.get_existing_workflows()
            workflow_exists = any(name == workflow_name for name in existing_workflows.keys())
            
            if workflow_exists:
                print(f"⚠️  Workflow '{workflow_name}' already exists, updating...")
                # Get the existing workflow ID
                existing_id = None
                for wf in existing_workflows.values():
                    if wf['name'] == workflow_name:
                        existing_id = wf['id']
                        break
                
                if existing_id:
                    # Update existing workflow
                    response = self.session.put(
                        f"{self.n8n_base_url}/api/v1/workflows/{existing_id}",
                        json=workflow_data
                    )
                else:
                    print(f"❌ Could not find existing workflow ID for {workflow_name}")
                    return False
            else:
                # Create new workflow
                response = self.session.post(
                    f"{self.n8n_base_url}/api/v1/workflows",
                    json=workflow_data
                )
            
            if response.status_code in [200, 201]:
                print(f"✅ Successfully deployed: {workflow_name}")
                return True
            else:
                print(f"❌ Failed to deploy {workflow_name}: {response.status_code}")
                print(f"Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error deploying {workflow_file.name}: {e}")
            return False
    
    def activate_workflows(self) -> bool:
        """Activate all deployed workflows"""
        try:
            workflows = self.get_existing_workflows()
            activated_count = 0
            
            for workflow_name, workflow_data in workflows.items():
                if 'crew' in workflow_name.lower() or 'federation' in workflow_name.lower():
                    workflow_id = workflow_data['id']
                    
                    # Activate the workflow
                    activation_data = {
                        'active': True
                    }
                    
                    response = self.session.patch(
                        f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}",
                        json=activation_data
                    )
                    
                    if response.status_code == 200:
                        print(f"✅ Activated workflow: {workflow_name}")
                        activated_count += 1
                    else:
                        print(f"❌ Failed to activate {workflow_name}: {response.status_code}")
            
            print(f"🎯 Activated {activated_count} workflows")
            return activated_count > 0
            
        except Exception as e:
            print(f"❌ Error activating workflows: {e}")
            return False
    
    def deploy_all_workflows(self) -> bool:
        """Deploy all corrected workflows"""
        if not self.test_connection():
            return False
        
        print("\n🔧 Starting workflow deployment...")
        
        workflow_files = list(self.workflows_dir.glob('*.json'))
        if not workflow_files:
            print(f"❌ No workflow files found in {self.workflows_dir}")
            return False
        
        successful_deployments = 0
        total_deployments = len(workflow_files)
        
        for workflow_file in workflow_files:
            if self.deploy_workflow(workflow_file):
                successful_deployments += 1
            time.sleep(1)  # Rate limiting
        
        print(f"\n📊 Deployment Summary:")
        print(f"   Total workflows: {total_deployments}")
        print(f"   Successful: {successful_deployments}")
        print(f"   Failed: {total_deployments - successful_deployments}")
        
        if successful_deployments > 0:
            print("\n🎯 Activating workflows...")
            self.activate_workflows()
        
        return successful_deployments > 0
    
    def test_webhooks(self) -> bool:
        """Test webhook endpoints after deployment"""
        print("\n🧪 Testing webhook endpoints...")
        
        test_webhooks = [
            'crew-captain-jean-luc-picard',
            'crew-commander-william-riker',
            'crew-commander-data',
            'crew-lieutenant-commander-geordi-la-forge',
            'crew-lieutenant-worf',
            'crew-counselor-deanna-troi'
        ]
        
        for webhook in test_webhooks:
            webhook_url = f"{self.n8n_base_url}/webhook/{webhook}"
            try:
                response = requests.post(webhook_url, json={
                    'test': True,
                    'message': 'Webhook connectivity test'
                }, timeout=10)
                
                if response.status_code == 200:
                    print(f"✅ {webhook}: OK")
                else:
                    print(f"⚠️  {webhook}: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ {webhook}: Connection failed - {e}")
        
        return True

def main():
    """Main deployment function"""
    print("🚀 N8N Workflow Deployment Script")
    print("=" * 50)
    
    deployer = N8NWorkflowDeployer()
    
    if not deployer.n8n_api_key:
        print("\n📝 Setup Instructions:")
        print("1. Add your n8n API key to ~/.zshrc:")
        print("   export N8N_API_KEY='your-api-key-here'")
        print("2. Reload your shell: source ~/.zshrc")
        print("3. Run this script again")
        return
    
    # Deploy workflows
    if deployer.deploy_all_workflows():
        print("\n🎉 Workflow deployment completed successfully!")
        
        # Test webhooks
        deployer.test_webhooks()
        
        print("\n📋 Next Steps:")
        print("1. Check your n8n instance at:", deployer.n8n_base_url)
        print("2. Verify all workflows are active")
        print("3. Test crew member interactions")
        print("4. Monitor logs for any errors")
        
    else:
        print("\n❌ Workflow deployment failed!")
        print("Check the error messages above and try again.")

if __name__ == "__main__":
    main()
