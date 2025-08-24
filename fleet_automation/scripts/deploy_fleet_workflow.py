#!/usr/bin/env python3
# DEPLOY FLEET WORKFLOW SCRIPT
# Usage: python3 fleet_automation/scripts/deploy_fleet_workflow.py [workflow_name]

import sys
import json
import requests
from pathlib import Path

def deploy_fleet_workflow(workflow_name):
    """Deploy fleet workflow to n8n"""
    print(f"🚀 Deploying fleet workflow: {workflow_name}...")
    
    # Load workflow file
    workflow_file = Path(f"{workflow_name}.json")
    if not workflow_file.exists():
        print(f"❌ Workflow file not found: {workflow_name}.json")
        return False
    
    # Load environment variables
    try:
        import subprocess
        result = subprocess.run(['bash', '-c', 'source ~/.zshrc && echo $N8N_API_KEY'], capture_output=True, text=True)
        n8n_api_key = result.stdout.strip()
        n8n_url = "https://n8n.pbradygeorgen.com"
    except Exception as e:
        print(f"❌ Error loading environment variables: {e}")
        return False
    
    # Prepare deployment
    headers = {
        'X-N8N-API-KEY': n8n_api_key,
        'Content-Type': 'application/json'
    }
    
    try:
        with open(workflow_file, 'r') as f:
            workflow_data = json.load(f)
        
        # Deploy to n8n
        response = requests.post(
            f"{n8n_url}/api/v1/workflows",
            headers=headers,
            json=workflow_data,
            timeout=60
        )
        
        if response.status_code in [200, 201]:
            workflow_id = response.json().get('id')
            print(f"✅ Fleet workflow deployed successfully!")
            print(f"   Workflow ID: {workflow_id}")
            print(f"   Status: {response.status_code}")
            return True
        else:
            print(f"❌ Fleet workflow deployment failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error deploying fleet workflow: {e}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 deploy_fleet_workflow.py [workflow_name]")
        print("Example: python3 deploy_fleet_workflow.py crew_management_workflow")
        sys.exit(1)
    
    workflow_name = sys.argv[1]
    
    success = deploy_fleet_workflow(workflow_name)
    if success:
        print("\n🎉 Fleet workflow deployment successful!")
        print("🚀 Your fleet automation is now live in n8n!")
    else:
        print("\n❌ Fleet workflow deployment failed")
        sys.exit(1)

if __name__ == "__main__":
    main()
