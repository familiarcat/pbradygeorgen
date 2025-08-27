#!/usr/bin/env python3
"""
Complete System Restoration
Deletes all corrupted crew workflows and restores them from backup with clean names.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime
import glob

class CompleteSystemRestoration:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
    def fetch_all_workflows(self) -> List[Dict]:
        """Fetch all workflows from n8n."""
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
    
    def identify_corrupted_crew_workflows(self, workflows: List[Dict]) -> List[Dict]:
        """Identify crew workflows with corrupted names."""
        corrupted_workflows = []
        
        for workflow in workflows:
            name = workflow.get('name', '')
            if 'Crew - Crew -' in name:  # Double prefix indicates corruption
                corrupted_workflows.append(workflow)
        
        return corrupted_workflows
    
    def delete_corrupted_workflow(self, workflow_id: str, workflow_name: str) -> bool:
        """Delete a corrupted workflow."""
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
    
    def load_backup_workflows(self) -> List[Dict]:
        """Load all workflows from the pre-unification backup."""
        backup_dir = "pre_unification_backup_20250826_200417"
        
        if not os.path.exists(backup_dir):
            print(f"❌ Backup directory not found: {backup_dir}")
            return []
        
        workflows = []
        backup_files = glob.glob(os.path.join(backup_dir, "*.json"))
        
        print(f"📁 Loading workflows from: {backup_dir}")
        for backup_file in backup_files:
            try:
                with open(backup_file, 'r') as f:
                    workflow = json.load(f)
                    workflows.append(workflow)
                print(f"   📁 Loaded: {os.path.basename(backup_file)}")
            except Exception as e:
                print(f"   ❌ Failed to load {backup_file}: {e}")
        
        return workflows
    
    def create_new_workflow(self, backup_workflow: Dict) -> bool:
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
    
    def run_complete_restoration(self):
        """Run the complete system restoration process."""
        print("🚨 COMPLETE SYSTEM RESTORATION - CLEANING CORRUPTED WORKFLOWS...")
        print("=" * 80)
        
        # Phase 1: Identify corrupted workflows
        print("🔍 PHASE 1: Identifying corrupted crew workflows...")
        current_workflows = self.fetch_all_workflows()
        
        if not current_workflows:
            print("❌ No workflows found!")
            return False
        
        corrupted_workflows = self.identify_corrupted_crew_workflows(current_workflows)
        print(f"✅ Found {len(corrupted_workflows)} corrupted crew workflows")
        
        if not corrupted_workflows:
            print("✅ No corrupted workflows found. System is clean.")
            return True
        
        # Display corrupted workflows
        print("\n🚨 CORRUPTED WORKFLOWS TO BE DELETED:")
        for workflow in corrupted_workflows:
            print(f"   - {workflow.get('name', '')} (ID: {workflow.get('id', '')})")
        
        # Phase 2: Delete corrupted workflows
        print(f"\n🗑️  PHASE 2: Deleting {len(corrupted_workflows)} corrupted workflows...")
        deleted_count = 0
        failed_deletions = 0
        
        for workflow in corrupted_workflows:
            workflow_id = workflow.get('id', '')
            workflow_name = workflow.get('name', '')
            
            if self.delete_corrupted_workflow(workflow_id, workflow_name):
                deleted_count += 1
            else:
                failed_deletions += 1
        
        print(f"\n📊 DELETION RESULTS:")
        print(f"   ✅ Successfully Deleted: {deleted_count}")
        print(f"   ❌ Failed Deletions: {failed_deletions}")
        
        if failed_deletions > 0:
            print("⚠️  Some deletions failed. Manual cleanup may be required.")
        
        # Phase 3: Restore from backup
        print(f"\n🔄 PHASE 3: Restoring workflows from backup...")
        backup_workflows = self.load_backup_workflows()
        
        if not backup_workflows:
            print("❌ No backup workflows found!")
            return False
        
        print(f"✅ Loaded {len(backup_workflows)} backup workflows")
        
        # Create new workflows
        print("\n🔧 Creating new workflows from backup...")
        created_count = 0
        failed_creations = 0
        
        for backup_workflow in backup_workflows:
            if self.create_new_workflow(backup_workflow):
                created_count += 1
            else:
                failed_creations += 1
        
        print(f"\n📊 RESTORATION RESULTS:")
        print(f"   ✅ Successfully Created: {created_count}")
        print(f"   ❌ Failed Creations: {failed_creations}")
        
        # Final summary
        print("\n📊 COMPLETE SYSTEM RESTORATION SUMMARY")
        print("=" * 60)
        print(f"🗑️  Corrupted Workflows Deleted: {deleted_count}")
        print(f"🔄 Workflows Restored from Backup: {created_count}")
        print(f"📋 Total Workflows Processed: {len(corrupted_workflows)}")
        
        if failed_deletions == 0 and failed_creations == 0:
            print("\n🎉 COMPLETE SYSTEM RESTORATION SUCCESSFUL!")
            print("All corrupted workflows have been replaced with clean versions.")
        else:
            print(f"\n⚠️  RESTORATION COMPLETED WITH {failed_deletions + failed_creations} ISSUES")
            print("Some workflows may need manual intervention.")
        
        return failed_deletions == 0 and failed_creations == 0

if __name__ == "__main__":
    try:
        restoration = CompleteSystemRestoration()
        success = restoration.run_complete_restoration()
        
        if success:
            print("\n🚀 Next steps:")
            print("1. Verify system functionality")
            print("2. Test all crew workflows")
            print("3. Confirm naming conventions are correct")
            print("4. Document the restoration process")
        else:
            print("\n⚠️  Restoration completed with issues. Manual intervention may be required.")
            
    except Exception as e:
        print(f"❌ Complete system restoration failed: {e}")
