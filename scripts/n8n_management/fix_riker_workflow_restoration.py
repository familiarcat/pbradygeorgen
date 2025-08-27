#!/usr/bin/env python3
"""
Fix Commander Riker Workflow Restoration
Restores Commander Riker's workflow with a corrected settings field.
"""

import json
import requests
import os
from typing import Dict

class RikerWorkflowRestorer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        self.backup_file = "n8n_renamed_workflows_backup_20250826_194915/workflows/4xHgewymk21FraDJ_Crew - Commander William Riker - Tactical Execution & Workflow Management.json"
    
    def load_riker_backup(self) -> Dict:
        """Load Commander Riker's backup workflow."""
        try:
            with open(self.backup_file, 'r') as f:
                workflow = json.load(f)
            print(f"✅ Loaded Commander Riker backup workflow")
            return workflow
        except Exception as e:
            print(f"❌ Failed to load backup: {e}")
            return {}
    
    def fix_workflow_settings(self, workflow: Dict) -> Dict:
        """Fix the workflow settings field to be API compatible."""
        fixed_workflow = workflow.copy()
        
        # Clean up problematic fields
        if 'id' in fixed_workflow:
            del fixed_workflow['id']
        if 'createdAt' in fixed_workflow:
            del fixed_workflow['createdAt']
        if 'updatedAt' in fixed_workflow:
            del fixed_workflow['updatedAt']
        if 'versionId' in fixed_workflow:
            del fixed_workflow['versionId']
        if 'triggerCount' in fixed_workflow:
            del fixed_workflow['triggerCount']
        if 'staticData' in fixed_workflow:
            del fixed_workflow['staticData']
        if 'meta' in fixed_workflow:
            del fixed_workflow['meta']
        if 'pinData' in fixed_workflow:
            del fixed_workflow['pinData']
        if 'shared' in fixed_workflow:
            del fixed_workflow['shared']
        if 'tags' in fixed_workflow:
            del fixed_workflow['tags']
        if 'active' in fixed_workflow:
            del fixed_workflow['active']
        
        # Fix settings field - use empty object to avoid API rejection
        fixed_workflow['settings'] = {}
        
        print(f"✅ Fixed workflow settings and removed problematic fields")
        return fixed_workflow
    
    def create_riker_workflow(self, fixed_workflow: Dict) -> bool:
        """Create Commander Riker's workflow on n8n."""
        try:
            response = requests.post(f"{self.n8n_url}/api/v1/workflows",
                                  headers=self.headers,
                                  json=fixed_workflow)
            
            if response.status_code == 201:
                print(f"✅ Successfully created Commander Riker workflow")
                return True
            else:
                print(f"❌ Failed to create: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Creation error: {e}")
            return False
    
    def run_riker_restoration(self):
        """Run the complete Commander Riker restoration process."""
        print("🔄 RESTORING COMMANDER RIKER WORKFLOW...")
        print("=" * 60)
        
        # Step 1: Load backup
        print("📁 Step 1: Loading backup workflow...")
        backup_workflow = self.load_riker_backup()
        
        if not backup_workflow:
            print("❌ Failed to load backup workflow!")
            return False
        
        # Step 2: Fix settings
        print("🔧 Step 2: Fixing workflow settings...")
        fixed_workflow = self.fix_workflow_settings(backup_workflow)
        
        # Step 3: Create workflow
        print("🚀 Step 3: Creating workflow on n8n...")
        success = self.create_riker_workflow(fixed_workflow)
        
        if success:
            print("\n🎉 COMMANDER RIKER RESTORATION COMPLETE!")
            print("✅ Commander William Riker is now back in the crew!")
            print("\n🚀 Next steps:")
            print("1. Verify Commander Riker appears in n8n")
            print("2. Activate the workflow if needed")
            print("3. Test crew functionality")
        else:
            print("\n❌ COMMANDER RIKER RESTORATION FAILED!")
            print("Manual intervention may be required.")
        
        return success

if __name__ == "__main__":
    try:
        restorer = RikerWorkflowRestorer()
        success = restorer.run_riker_restoration()
        
        if not success:
            print("\n⚠️  Commander Riker restoration failed. Check the error details above.")
            
    except Exception as e:
        print(f"❌ Commander Riker restoration failed: {e}")
