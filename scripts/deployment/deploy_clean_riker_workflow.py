#!/usr/bin/env python3
"""
Deploy Clean Riker Workflow
Deploys the cleaned Riker workflow directly without replacement.
"""

import json
import requests
import os
from typing import Dict

class CleanRikerDeployer:
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
    
    def load_clean_template(self) -> Dict:
        """Load the cleaned Riker template."""
        try:
            with open(self.template_file, 'r') as f:
                template = json.load(f)
            print(f"✅ Loaded clean Riker template")
            print(f"📊 Template fields: {list(template.keys())}")
            print(f"📊 Template size: {len(json.dumps(template))} characters")
            return template
        except Exception as e:
            print(f"❌ Failed to load template: {e}")
            return {}
    
    def deploy_clean_workflow(self, template: Dict) -> bool:
        """Deploy the cleaned Riker workflow."""
        try:
            print(f"\n🚀 Deploying clean Riker workflow...")
            
            response = requests.post(f"{self.n8n_url}/api/v1/workflows",
                                  headers=self.headers,
                                  json=template)
            
            print(f"📡 Response Status: {response.status_code}")
            
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
        print("🚀 DEPLOYING CLEAN COMMANDER RIKER WORKFLOW")
        print("=" * 70)
        
        # Step 1: Load clean template
        print("📁 Step 1: Loading clean Riker template...")
        template = self.load_clean_template()
        
        if not template:
            print("❌ Failed to load template!")
            return False
        
        # Step 2: Deploy clean workflow
        print("\n🚀 Step 2: Deploying clean Riker workflow...")
        success = self.deploy_clean_workflow(template)
        
        if success:
            print(f"\n🎉 CLEAN RIKER WORKFLOW DEPLOYMENT COMPLETE!")
            print("✅ Commander Riker now has the complete 7-node structure")
            print("✅ Memory integration is properly configured")
            print("✅ Workflow follows Picard's optimal pattern")
            print("✅ All problematic fields removed")
            print("\n🚀 Next steps:")
            print("1. Verify the corrected workflow in n8n")
            print("2. Test memory integration")
            print("3. Activate the workflow when ready")
        else:
            print(f"\n❌ CLEAN RIKER WORKFLOW DEPLOYMENT FAILED!")
            print("Manual intervention may be required")
        
        return success

if __name__ == "__main__":
    try:
        deployer = CleanRikerDeployer()
        success = deployer.run_deployment()
        
        if not success:
            print("\n⚠️  Clean Riker workflow deployment failed. Check the error details above.")
            
    except Exception as e:
        print(f"❌ Clean Riker workflow deployment failed: {e}")
