#!/usr/bin/env python3
"""
Prune System Workflow Duplicates Script
Removes deactivated system workflow duplicates to complete the cleanup.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class SystemWorkflowPruner:
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
    
    def identify_deactivated_system_duplicates(self, workflows: List[Dict]) -> Dict:
        """Identify deactivated system workflow duplicates for pruning."""
        active_workflows = [w for w in workflows if w.get('active', False)]
        inactive_workflows = [w for w in workflows if not w.get('active', False)]
        
        crew_workflows = []
        system_workflows = []
        
        # Categorize active workflows
        for workflow in active_workflows:
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member and crew_member != 'System Workflow':
                crew_workflows.append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'crew_member': crew_member,
                    'active': True
                })
            else:
                system_workflows.append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': True
                })
        
        # Identify inactive system duplicates (workflows with same names as active system ones)
        inactive_system_duplicates = []
        
        for workflow in inactive_workflows:
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member == 'System Workflow':
                # Check if this inactive workflow has the same name as an active system workflow
                active_system_names = [w['name'] for w in system_workflows]
                if name in active_system_names:
                    inactive_system_duplicates.append({
                        'id': workflow.get('id', ''),
                        'name': name,
                        'reason': 'Deactivated duplicate of active system workflow'
                    })
        
        return {
            'total_workflows': len(workflows),
            'active_workflows': len(active_workflows),
            'inactive_workflows': len(inactive_workflows),
            'crew_workflows': len(crew_workflows),
            'system_workflows': len(system_workflows),
            'inactive_system_duplicates': inactive_system_duplicates,
            'total_to_prune': len(inactive_system_duplicates),
            'timestamp': datetime.now().isoformat()
        }
    
    def extract_crew_member(self, workflow_name: str) -> str:
        """Extract crew member name from workflow name."""
        crew_members = [
            'Captain Jean-Luc Picard',
            'Commander William Riker',
            'Dr. Beverly Crusher',
            'Commander Data',
            'Lieutenant Commander Geordi La Forge',
            'Lieutenant Worf',
            'Counselor Deanna Troi',
            'Lieutenant Uhura',
            'Quark'
        ]
        
        for member in crew_members:
            if member.lower() in workflow_name.lower():
                return member
        
        if 'Federation' in workflow_name or 'AlexAI' in workflow_name:
            return 'System Workflow'
        
        return 'Unknown'
    
    def prune_workflow(self, workflow_id: str, workflow_name: str) -> bool:
        """Prune (delete) a specific workflow."""
        try:
            response = requests.delete(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", headers=self.headers)
            response.raise_for_status()
            print(f"✅ Pruned workflow: {workflow_name} (ID: {workflow_id})")
            return True
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to prune workflow {workflow_name} (ID: {workflow_id}): {e}")
            return False
    
    def run_pruning(self, dry_run: bool = True):
        """Run the system workflow duplicate pruning process."""
        if dry_run:
            print("🔍 DRY RUN MODE - No workflows will be deleted")
        else:
            print("🗑️  PRUNING MODE - Deactivated system duplicates will be deleted")
        
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Identify deactivated system duplicates
        print("🎯 Identifying deactivated system duplicates...")
        analysis = self.identify_deactivated_system_duplicates(workflows)
        
        # Display analysis
        print("\n📊 DEACTIVATED SYSTEM DUPLICATE ANALYSIS:")
        print("=" * 60)
        
        print(f"Total Workflows: {analysis['total_workflows']}")
        print(f"Active Workflows: {analysis['active_workflows']}")
        print(f"Inactive Workflows: {analysis['inactive_workflows']}")
        print(f"Crew Workflows: {analysis['crew_workflows']}")
        print(f"System Workflows: {analysis['system_workflows']}")
        print(f"System Duplicates to Prune: {analysis['total_to_prune']}")
        print(f"Analysis Timestamp: {analysis['timestamp']}")
        
        # Display deactivated system duplicates
        if analysis['inactive_system_duplicates']:
            print(f"\n🔧 DEACTIVATED SYSTEM DUPLICATES ({len(analysis['inactive_system_duplicates'])}):")
            print("=" * 50)
            
            for duplicate in analysis['inactive_system_duplicates']:
                print(f"   - {duplicate['name']}")
                print(f"     Workflow ID: {duplicate['id']}")
                print(f"     Reason: {duplicate['reason']}")
                print("")
        else:
            print("\n✅ NO DEACTIVATED SYSTEM DUPLICATES FOUND!")
            print("All system workflows are already clean")
            return
        
        # Execute pruning if not dry run
        if not dry_run and analysis['total_to_prune'] > 0:
            print("\n🗑️  EXECUTING PRUNING...")
            print("=" * 40)
            
            success_count = 0
            total_count = analysis['total_to_prune']
            
            # Prune deactivated system duplicates
            for duplicate in analysis['inactive_system_duplicates']:
                if self.prune_workflow(duplicate['id'], duplicate['name']):
                    success_count += 1
            
            print(f"\n📊 PRUNING RESULTS:")
            print("=" * 30)
            print(f"Successfully Pruned: {success_count}/{total_count}")
            print(f"Failed: {total_count - success_count}")
            
            if success_count == total_count:
                print("🎉 All deactivated system duplicates successfully pruned!")
                print("🎯 n8n server is now fully optimized!")
            else:
                print("⚠️  Some workflows failed to prune - review manually")
        
        elif dry_run:
            print(f"\n🔍 DRY RUN COMPLETE")
            print("=" * 30)
            print(f"Found {analysis['total_to_prune']} deactivated system duplicates to prune")
            print("Run with dry_run=False to execute actual pruning")
        
        return analysis

if __name__ == "__main__":
    import sys
    
    # Check if --execute flag is provided
    dry_run = True
    if len(sys.argv) > 1 and sys.argv[1] == '--execute':
        dry_run = False
    
    try:
        pruner = SystemWorkflowPruner()
        pruner.run_pruning(dry_run=dry_run)
    except Exception as e:
        print(f"❌ Pruning failed: {e}")
