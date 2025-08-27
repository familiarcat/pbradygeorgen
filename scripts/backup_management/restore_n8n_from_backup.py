#!/usr/bin/env python3
"""
Restore n8n Instance from Backup
Restores the n8n instance to its working state using the comprehensive backup.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime
import glob

class N8nBackupRestorer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        self.backup_dir = "n8n_renamed_workflows_backup_20250826_194915/workflows"
    
    def load_backup_workflows(self) -> List[Dict]:
        """Load all workflows from the backup directory."""
        workflows = []
        backup_files = glob.glob(os.path.join(self.backup_dir, "*.json"))
        
        print(f"📁 Loading workflows from: {self.backup_dir}")
        for backup_file in backup_files:
            try:
                with open(backup_file, 'r') as f:
                    workflow = json.load(f)
                    workflows.append(workflow)
                print(f"   📁 Loaded: {os.path.basename(backup_file)}")
            except Exception as e:
                print(f"   ❌ Failed to load {backup_file}: {e}")
        
        return workflows
    
    def fetch_current_workflows(self) -> List[Dict]:
        """Fetch all current workflows from n8n."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
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
    
    def delete_current_workflow(self, workflow_id: str, workflow_name: str) -> bool:
        """Delete a current workflow from n8n."""
        try:
            response = requests.delete(f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                                    headers=self.headers)
            
            if response.status_code == 200:
                print(f"   ✅ Deleted: {workflow_name}")
                return True
            else:
                print(f"   ❌ Failed to delete: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Delete error: {e}")
            return False
    
    def create_workflow_from_backup(self, backup_workflow: Dict) -> bool:
        """Create a new workflow from backup."""
        try:
            # Prepare workflow for creation
            new_workflow = {
                'name': backup_workflow.get('name', ''),
                'nodes': backup_workflow.get('nodes', []),
                'connections': backup_workflow.get('connections', {}),
                'settings': backup_workflow.get('settings', {})
            }
            
            # Create the workflow
            response = requests.post(f"{self.n8n_url}/api/v1/workflows",
                                  headers=self.headers,
                                  json=new_workflow)
            
            if response.status_code == 201:
                print(f"   ✅ Created: {new_workflow['name']}")
                return True
            else:
                print(f"   ❌ Failed to create: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Creation error: {e}")
            return False
    
    def run_restoration(self):
        """Run the complete n8n restoration process."""
        print("🔄 RESTORING N8N INSTANCE FROM BACKUP...")
        print("=" * 70)
        
        # Phase 1: Load backup workflows
        print("🔍 PHASE 1: Loading backup workflows...")
        backup_workflows = self.load_backup_workflows()
        
        if not backup_workflows:
            print("❌ No backup workflows found!")
            return False
        
        print(f"✅ Loaded {len(backup_workflows)} backup workflows")
        
        # Phase 2: Delete all current workflows
        print(f"\n🗑️  PHASE 2: Deleting all current workflows...")
        current_workflows = self.fetch_current_workflows()
        
        if not current_workflows:
            print("✅ No current workflows to delete")
        else:
            print(f"📋 Found {len(current_workflows)} current workflows to delete")
            
            deleted_count = 0
            failed_deletions = 0
            
            for workflow in current_workflows:
                workflow_id = workflow.get('id', '')
                workflow_name = workflow.get('name', '')
                
                if self.delete_current_workflow(workflow_id, workflow_name):
                    deleted_count += 1
                else:
                    failed_deletions += 1
            
            print(f"\n📊 DELETION RESULTS:")
            print(f"   ✅ Successfully Deleted: {deleted_count}")
            print(f"   ❌ Failed Deletions: {failed_deletions}")
            
            if failed_deletions > 0:
                print("⚠️  Some deletions failed. Manual cleanup may be required.")
        
        # Phase 3: Create workflows from backup
        print(f"\n🔄 PHASE 3: Creating workflows from backup...")
        created_count = 0
        failed_creations = 0
        
        for backup_workflow in backup_workflows:
            if self.create_workflow_from_backup(backup_workflow):
                created_count += 1
            else:
                failed_creations += 1
        
        print(f"\n📊 RESTORATION RESULTS:")
        print(f"   ✅ Successfully Created: {created_count}")
        print(f"   ❌ Failed Creations: {failed_creations}")
        
        # Final summary
        print("\n📊 N8N RESTORATION SUMMARY")
        print("=" * 50)
        print(f"🗑️  Current Workflows Deleted: {deleted_count if 'deleted_count' in locals() else 0}")
        print(f"🔄 Workflows Restored from Backup: {created_count}")
        print(f"📋 Total Backup Workflows: {len(backup_workflows)}")
        
        if failed_creations == 0:
            print("\n🎉 N8N RESTORATION COMPLETE!")
            print("All workflows have been restored from backup.")
            print("The n8n instance is now back to its working state.")
        else:
            print(f"\n⚠️  RESTORATION COMPLETED WITH {failed_creations} ISSUES")
            print("Some workflows may need manual restoration.")
        
        return failed_creations == 0

if __name__ == "__main__":
    try:
        restorer = N8nBackupRestorer()
        success = restorer.run_restoration()
        
        if success:
            print("\n🚀 Next steps:")
            print("1. Verify n8n instance functionality")
            print("2. Test crew workflows")
            print("3. Confirm all crew members are present")
        else:
            print("\n⚠️  Restoration completed with issues. Manual intervention may be required.")
            
    except Exception as e:
        print(f"❌ N8n restoration failed: {e}")
