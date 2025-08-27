#!/usr/bin/env python3
"""
Corrected Emergency Rollback Script
Restores workflows from backup by matching the corrupted names.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime
import glob

class CorrectedEmergencyRollback:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Find the most recent backup directory
        self.backup_dir = self.find_latest_backup()
        
    def find_latest_backup(self) -> str:
        """Find the most recent pre_unification_backup directory."""
        backup_dirs = glob.glob("pre_unification_backup_*")
        if not backup_dirs:
            raise ValueError("No pre_unification_backup directories found!")
        
        # Sort by timestamp and get the most recent
        backup_dirs.sort(reverse=True)
        latest_backup = backup_dirs[0]
        print(f"📁 Found backup directory: {latest_backup}")
        return latest_backup
    
    def load_backup_workflows(self) -> List[Dict]:
        """Load all backup workflows."""
        backup_workflows = []
        backup_files = glob.glob(f"{self.backup_dir}/*.json")
        
        print(f"📋 Loading {len(backup_files)} backup workflows...")
        
        for backup_file in backup_files:
            try:
                with open(backup_file, 'r') as f:
                    workflow = json.load(f)
                    backup_workflows.append(workflow)
                    print(f"   ✅ Loaded: {workflow.get('name', 'unnamed')}")
            except Exception as e:
                print(f"   ❌ Failed to load {backup_file}: {e}")
        
        return backup_workflows
    
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
    
    def find_workflow_by_corrupted_name(self, workflows: List[Dict], backup_name: str) -> Dict:
        """Find a workflow by matching the corrupted name pattern."""
        # Extract the crew member name from backup
        # Backup: "Crew - Captain Jean-Luc Picard - Strategic Leadership & Mission Command"
        # Corrupted: "Crew - Crew - Captain Jean-Luc Picard - Strategic Leadership & Mission Command - Strategic Leadership & Mission Coordination"
        
        crew_member = None
        if "Captain Jean-Luc Picard" in backup_name:
            crew_member = "Captain Jean-Luc Picard"
        elif "Commander William Riker" in backup_name:
            crew_member = "Commander William Riker"
        elif "Dr. Beverly Crusher" in backup_name:
            crew_member = "Dr. Beverly Crusher"
        elif "Lieutenant Uhura" in backup_name:
            crew_member = "Lieutenant Uhura"
        elif "Commander Data" in backup_name:
            crew_member = "Commander Data"
        elif "Lieutenant Worf" in backup_name:
            crew_member = "Lieutenant Worf"
        elif "Counselor Deanna Troi" in backup_name:
            crew_member = "Counselor Deanna Troi"
        elif "Quark" in backup_name:
            crew_member = "Quark"
        elif "Lieutenant Commander Geordi La Forge" in backup_name:
            crew_member = "Lieutenant Commander Geordi La Forge"
        
        if not crew_member:
            return {}
        
        # Find workflow with corrupted name containing this crew member
        for workflow in workflows:
            if workflow.get('name', '').startswith('Crew - Crew -') and crew_member in workflow.get('name', ''):
                return workflow
        
        return {}
    
    def restore_workflow(self, backup_workflow: Dict, current_workflows: List[Dict]) -> bool:
        """Restore a workflow from backup."""
        workflow_name = backup_workflow.get('name', '')
        
        print(f"\n🔧 Restoring: {workflow_name}")
        
        # Find the current corrupted workflow
        current_workflow = self.find_workflow_by_corrupted_name(current_workflows, workflow_name)
        
        if not current_workflow:
            print(f"   ⚠️  Current corrupted workflow not found, skipping: {workflow_name}")
            return False
        
        current_id = current_workflow.get('id', '')
        corrupted_name = current_workflow.get('name', '')
        
        print(f"   📍 Found corrupted workflow: {corrupted_name}")
        
        try:
            # Prepare the backup workflow for restoration
            restored_workflow = self.prepare_workflow_for_restoration(backup_workflow)
            
            # Update the current workflow with the backup content
            response = requests.put(f"{self.n8n_url}/api/v1/workflows/{current_id}",
                                 headers=self.headers,
                                 json=restored_workflow)
            
            if response.status_code == 200:
                print(f"   ✅ Restored: {workflow_name}")
                return True
            else:
                print(f"   ❌ Failed to restore {workflow_name}: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Restore error for {workflow_name}: {e}")
            return False
    
    def prepare_workflow_for_restoration(self, workflow: Dict) -> Dict:
        """Prepare backup workflow for restoration."""
        # Keep only essential workflow fields
        essential_fields = ['name', 'nodes', 'connections', 'settings']
        restored_workflow = {}
        
        for field in essential_fields:
            if field in workflow:
                restored_workflow[field] = workflow[field]
        
        return restored_workflow
    
    def create_rollback_report(self, results: Dict) -> str:
        """Create a rollback report."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"corrected_emergency_rollback_report_{timestamp}.json"
        
        # Save detailed report
        with open(report_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Display summary
        print("\n📊 ROLLBACK RESULTS SUMMARY")
        print("=" * 50)
        
        print(f"📋 Total Workflows to Restore: {results['total_workflows']}")
        print(f"✅ Successfully Restored: {results['successfully_restored']}")
        print(f"❌ Failed Restorations: {results['failed_restorations']}")
        print(f"💾 Backup Source: {results['backup_directory']}")
        
        if results['failed_restorations'] > 0:
            print(f"\n⚠️  Failed Restorations:")
            for detail in results['details']:
                if detail['status'] == 'failed':
                    print(f"   - {detail['workflow_name']}")
        
        print(f"\n💾 Rollback report saved: {report_file}")
        
        return report_file
    
    def execute_emergency_rollback(self) -> Dict:
        """Execute the emergency rollback."""
        results = {
            'total_workflows': 0,
            'successfully_restored': 0,
            'failed_restorations': 0,
            'details': [],
            'backup_directory': self.backup_dir,
            'rollback_timestamp': datetime.now().isoformat()
        }
        
        print("🚨 CORRECTED EMERGENCY ROLLBACK - RESTORING FROM BACKUP...")
        print("=" * 70)
        
        # Load backup workflows
        print("📁 Loading backup workflows...")
        backup_workflows = self.load_backup_workflows()
        
        if not backup_workflows:
            print("❌ No backup workflows found!")
            return results
        
        # Fetch current workflows
        print("📡 Fetching current corrupted workflows...")
        current_workflows = self.fetch_current_workflows()
        
        if not current_workflows:
            print("❌ No current workflows found!")
            return results
        
        print(f"📋 Found {len(current_workflows)} current workflows")
        print(f"📋 Found {len(backup_workflows)} backup workflows")
        
        results['total_workflows'] = len(backup_workflows)
        
        # Restore each workflow
        print(f"\n🔧 Restoring {len(backup_workflows)} workflows...")
        
        for backup_workflow in backup_workflows:
            workflow_name = backup_workflow.get('name', '')
            
            success = self.restore_workflow(backup_workflow, current_workflows)
            
            if success:
                results['successfully_restored'] += 1
                results['details'].append({
                    'workflow_name': workflow_name,
                    'status': 'restored'
                })
            else:
                results['failed_restorations'] += 1
                results['details'].append({
                    'workflow_name': workflow_name,
                    'status': 'failed'
                })
        
        return results
    
    def run_rollback(self):
        """Run the complete emergency rollback process."""
        try:
            # Execute rollback
            results = self.execute_emergency_rollback()
            
            # Generate report
            print("\n📝 Generating rollback report...")
            report_file = self.create_rollback_report(results)
            
            # Final status
            if results['failed_restorations'] == 0:
                print("\n🎉 ROLLBACK COMPLETE - ALL WORKFLOWS SUCCESSFULLY RESTORED!")
                print("System has been restored to its previous working state.")
            else:
                print(f"\n⚠️  ROLLBACK COMPLETE WITH {results['failed_restorations']} FAILURES")
                print("Review the rollback report for details.")
            
            return results
            
        except Exception as e:
            print(f"❌ Corrected emergency rollback failed: {e}")
            return None

if __name__ == "__main__":
    try:
        rollback = CorrectedEmergencyRollback()
        rollback.run_rollback()
    except Exception as e:
        print(f"❌ Corrected emergency rollback initialization failed: {e}")
