#!/usr/bin/env python3
"""
Comprehensive Emergency Rollback
Restores ALL crew workflows from the pre-unification backup to restore system stability.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime
import glob

class ComprehensiveEmergencyRollback:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
    def load_pre_unification_backup(self) -> List[Dict]:
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
    
    def find_workflow_by_name(self, workflows: List[Dict], name: str) -> Dict:
        """Find a workflow by name."""
        for workflow in workflows:
            if workflow.get('name', '') == name:
                return workflow
        return {}
    
    def restore_workflow(self, workflow_id: str, backup_workflow: Dict) -> bool:
        """Restore a workflow from backup."""
        try:
            # Prepare workflow for restoration
            restored_workflow = {
                'name': backup_workflow.get('name', ''),
                'nodes': backup_workflow.get('nodes', []),
                'connections': backup_workflow.get('connections', {}),
                'settings': backup_workflow.get('settings', {})
            }
            
            # Update the workflow
            response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                                 headers=self.headers,
                                 json=restored_workflow)
            
            if response.status_code == 200:
                return True
            else:
                print(f"   ❌ Failed to restore workflow: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Restore error: {e}")
            return False
    
    def run_comprehensive_rollback(self):
        """Run the comprehensive emergency rollback process."""
        print("🚨 COMPREHENSIVE EMERGENCY ROLLBACK - RESTORING ALL CREW WORKFLOWS...")
        print("=" * 80)
        
        # Load pre-unification backup
        print("🔍 Loading pre-unification backup...")
        backup_workflows = self.load_pre_unification_backup()
        
        if not backup_workflows:
            print("❌ No backup workflows found!")
            return False
        
        print(f"✅ Loaded {len(backup_workflows)} backup workflows")
        
        # Fetch current workflows
        print("📡 Fetching current workflows from n8n...")
        current_workflows = self.fetch_current_workflows()
        
        if not current_workflows:
            print("❌ No current workflows found!")
            return False
        
        print(f"✅ Found {len(current_workflows)} current workflows")
        
        # Restore each workflow
        print("\n🔧 Restoring ALL crew workflows from backup...")
        restored_count = 0
        failed_count = 0
        
        for backup_workflow in backup_workflows:
            workflow_name = backup_workflow.get('name', '')
            print(f"\n🔧 Restoring: {workflow_name}")
            
            # Find corresponding current workflow
            current_workflow = self.find_workflow_by_name(current_workflows, workflow_name)
            
            if not current_workflow:
                print(f"   ⚠️  Current workflow not found, skipping: {workflow_name}")
                continue
            
            workflow_id = current_workflow.get('id', '')
            
            # Restore the workflow
            if self.restore_workflow(workflow_id, backup_workflow):
                print(f"   ✅ Successfully restored: {workflow_name}")
                restored_count += 1
            else:
                print(f"   ❌ Failed to restore: {workflow_name}")
                failed_count += 1
        
        # Summary
        print("\n📊 COMPREHENSIVE ROLLBACK RESULTS SUMMARY")
        print("=" * 60)
        print(f"📋 Total Backup Workflows: {len(backup_workflows)}")
        print(f"✅ Successfully Restored: {restored_count}")
        print(f"❌ Failed Restorations: {failed_count}")
        
        if failed_count == 0:
            print("\n🎉 COMPREHENSIVE ROLLBACK COMPLETE - ALL CREW WORKFLOWS RESTORED!")
            print("System has been restored to its stable state before the failed unification.")
        else:
            print(f"\n⚠️  ROLLBACK COMPLETE WITH {failed_count} FAILURES")
            print("Some workflows may need manual restoration.")
        
        return failed_count == 0

if __name__ == "__main__":
    try:
        rollback = ComprehensiveEmergencyRollback()
        success = rollback.run_comprehensive_rollback()
        
        if success:
            print("\n🚀 Next steps:")
            print("1. Verify system functionality")
            print("2. Test crew workflows")
            print("3. Investigate unification failure")
            print("4. Document lessons learned")
        else:
            print("\n⚠️  Rollback completed with issues. Manual intervention may be required.")
            
    except Exception as e:
        print(f"❌ Comprehensive emergency rollback failed: {e}")
