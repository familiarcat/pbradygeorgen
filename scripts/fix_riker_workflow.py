#!/usr/bin/env python3
"""
Fix Commander Riker's Workflow
Handles the settings field issue during restoration.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime

class RikerWorkflowFixer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
    def fetch_current_workflows(self) -> List[Dict]:
        """Fetch current workflows from the deployed n8n instance."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            # Handle different response formats
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and 'data' in data:
                return data['data']
            elif isinstance(data, str):
                try:
                    return json.loads(data)
                except json.JSONDecodeError:
                    print(f"❌ Failed to parse response as JSON: {data[:100]}...")
                    return []
            else:
                print(f"❌ Unexpected response format: {type(data)}")
                return []
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return []
    
    def find_riker_workflow(self, workflows: List[Dict]) -> Dict:
        """Find Commander Riker's workflow."""
        for workflow in workflows:
            if "Commander William Riker" in workflow.get('name', ''):
                return workflow
        return {}
    
    def load_backup_riker_workflow(self) -> Dict:
        """Load Commander Riker's backup workflow."""
        backup_dir = "pre_unification_backup_20250826_200417"
        backup_file = f"{backup_dir}/4xHgewymk21FraDJ_Crew - Commander William Riker - Tactical Execution & Workflow Management_before_update.json"
        
        try:
            with open(backup_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Failed to load Riker's backup: {e}")
            return {}
    
    def fix_riker_workflow(self) -> bool:
        """Fix Commander Riker's workflow."""
        print("🔧 Fixing Commander Riker's workflow...")
        
        # Fetch current workflows
        current_workflows = self.fetch_current_workflows()
        if not current_workflows:
            print("❌ No current workflows found!")
            return False
        
        # Find Riker's workflow
        riker_workflow = self.find_riker_workflow(current_workflows)
        if not riker_workflow:
            print("❌ Commander Riker's workflow not found!")
            return False
        
        workflow_id = riker_workflow.get('id', '')
        workflow_name = riker_workflow.get('name', '')
        
        print(f"📍 Found Riker's workflow: {workflow_name}")
        
        # Load backup workflow
        backup_workflow = self.load_backup_riker_workflow()
        if not backup_workflow:
            print("❌ Failed to load backup workflow!")
            return False
        
        # Prepare fixed workflow (with empty settings field)
        fixed_workflow = {
            'name': backup_workflow.get('name', ''),
            'nodes': backup_workflow.get('nodes', []),
            'connections': backup_workflow.get('connections', {}),
            'settings': {}
        }
        
        try:
            # Update the workflow
            response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                                 headers=self.headers,
                                 json=fixed_workflow)
            
            if response.status_code == 200:
                print(f"✅ Successfully fixed Commander Riker's workflow!")
                return True
            else:
                print(f"❌ Failed to fix workflow: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Fix error: {e}")
            return False
    
    def run_fix(self):
        """Run the complete fix process."""
        print("🔧 COMMANDER RIKER WORKFLOW FIX...")
        print("=" * 50)
        
        success = self.fix_riker_workflow()
        
        if success:
            print("\n🎉 RIKER'S WORKFLOW SUCCESSFULLY FIXED!")
            print("All crew workflows should now be operational.")
        else:
            print("\n⚠️  RIKER'S WORKFLOW FIX FAILED!")
            print("Review the error details above.")
        
        return success

if __name__ == "__main__":
    try:
        fixer = RikerWorkflowFixer()
        fixer.run_fix()
    except Exception as e:
        print(f"❌ Riker workflow fix failed: {e}")
