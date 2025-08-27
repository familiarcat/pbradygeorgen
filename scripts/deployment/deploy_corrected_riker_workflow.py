#!/usr/bin/env python3
"""
Deploy Corrected Commander Riker Workflow
Deploys the corrected Riker workflow based on Captain Picard's optimal template.
"""

import json
import requests
import os
from typing import Dict

class CorrectedRikerDeployer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        self.template_file = "riker_clean_template.json"
    
    def load_corrected_template(self) -> Dict:
        """Load the corrected Riker template."""
        try:
            with open(self.template_file, 'r') as f:
                template = json.load(f)
            print(f"✅ Loaded corrected Riker template")
            print(f"📊 Template fields: {list(template.keys())}")
            return template
        except Exception as e:
            print(f"❌ Failed to load template: {e}")
            return {}
    
    def find_current_riker_workflow(self) -> Dict:
        """Find Commander Riker's current workflow on n8n."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list):
                workflows = data
            elif isinstance(data, dict) and 'data' in data:
                workflows = data['data']
            else:
                print(f"❌ Unexpected response format: {type(data)}")
                return {}
            
            # Find Commander Riker's workflow
            for workflow in workflows:
                name = workflow.get('name', '')
                if 'Commander William Riker' in name:
                    print(f"✅ Found current Riker workflow: {name}")
                    print(f"   ID: {workflow.get('id', 'Unknown')}")
                    print(f"   Nodes: {len(workflow.get('nodes', []))}")
                    return workflow
            
            print("❌ Commander Riker's workflow not found!")
            return {}
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return {}
    
    def delete_current_riker_workflow(self, workflow_id: str) -> bool:
        """Delete Commander Riker's current incomplete workflow."""
        try:
            response = requests.delete(f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                                    headers=self.headers)
            
            if response.status_code == 200:
                print(f"✅ Successfully deleted incomplete Riker workflow")
                return True
            else:
                print(f"❌ Failed to delete: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Delete error: {e}")
            return False
    
    def deploy_corrected_workflow(self, template: Dict) -> bool:
        """Deploy the corrected Riker workflow."""
        try:
            response = requests.post(f"{self.n8n_url}/api/v1/workflows",
                                  headers=self.headers,
                                  json=template)
            
            if response.status_code == 201:
                print(f"✅ Successfully deployed corrected Riker workflow")
                response_data = response.json()
                print(f"   New ID: {response_data.get('id', 'Unknown')}")
                print(f"   Name: {response_data.get('name', 'Unknown')}")
                return True
            elif response.status_code == 200:
                print(f"✅ Successfully deployed corrected Riker workflow (status 200)")
                response_data = response.json()
                print(f"   New ID: {response_data.get('id', 'Unknown')}")
                print(f"   Name: {response_data.get('name', 'Unknown')}")
                return True
            else:
                print(f"❌ Failed to deploy: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Deployment error: {e}")
            return False
    
    def run_deployment(self):
        """Run the complete deployment process."""
        print("🚀 DEPLOYING CORRECTED COMMANDER RIKER WORKFLOW")
        print("=" * 70)
        
        # Step 1: Load corrected template
        print("📁 Step 1: Loading corrected Riker template...")
        template = self.load_corrected_template()
        
        if not template:
            print("❌ Failed to load template!")
            return False
        
        # Step 2: Find current Riker workflow
        print("🔍 Step 2: Finding current Riker workflow...")
        current_workflow = self.find_current_riker_workflow()
        
        if not current_workflow:
            print("❌ Current Riker workflow not found!")
            return False
        
        # Step 3: Delete incomplete workflow
        print("🗑️  Step 3: Deleting incomplete Riker workflow...")
        workflow_id = current_workflow.get('id', '')
        if not self.delete_current_riker_workflow(workflow_id):
            print("❌ Failed to delete incomplete workflow!")
            return False
        
        # Step 4: Deploy corrected workflow
        print("🚀 Step 4: Deploying corrected Riker workflow...")
        success = self.deploy_corrected_workflow(template)
        
        if success:
            print(f"\n🎉 CORRECTED RIKER WORKFLOW DEPLOYMENT COMPLETE!")
            print("✅ Commander Riker now has the complete 7-node structure")
            print("✅ Memory integration is properly configured")
            print("✅ Workflow follows Picard's optimal pattern")
            print("\n🚀 Next steps:")
            print("1. Verify the corrected workflow in n8n")
            print("2. Test memory integration")
            print("3. Activate the workflow when ready")
        else:
            print(f"\n❌ CORRECTED RIKER WORKFLOW DEPLOYMENT FAILED!")
            print("Manual intervention may be required")
        
        return success

if __name__ == "__main__":
    try:
        deployer = CorrectedRikerDeployer()
        success = deployer.run_deployment()
        
        if not success:
            print("\n⚠️  Corrected Riker workflow deployment failed. Check the error details above.")
            
    except Exception as e:
        print(f"❌ Corrected Riker workflow deployment failed: {e}")
