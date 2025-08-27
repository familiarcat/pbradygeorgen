#!/usr/bin/env python3
"""
Prune Inactive Workflows for Optimized Structure
Removes all inactive workflows to clean up the n8n instance.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime

class InactiveWorkflowPruner:
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
        """Fetch all workflows from the deployed n8n instance."""
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
    
    def analyze_workflow_status(self, workflows: List[Dict]) -> Dict:
        """Analyze the current workflow status."""
        active_workflows = []
        inactive_workflows = []
        
        for workflow in workflows:
            if workflow.get('active', False):
                active_workflows.append(workflow)
            else:
                inactive_workflows.append(workflow)
        
        return {
            'total_workflows': len(workflows),
            'active_workflows': active_workflows,
            'inactive_workflows': inactive_workflows,
            'active_count': len(active_workflows),
            'inactive_count': len(inactive_workflows)
        }
    
    def categorize_workflows(self, workflows: List[Dict]) -> Dict:
        """Categorize workflows by type."""
        crew_workflows = []
        system_workflows = []
        other_workflows = []
        
        for workflow in workflows:
            name = workflow.get('name', '')
            if name.startswith('Crew -'):
                crew_workflows.append(workflow)
            elif name.startswith('System -'):
                system_workflows.append(workflow)
            else:
                other_workflows.append(workflow)
        
        return {
            'crew_workflows': crew_workflows,
            'system_workflows': system_workflows,
            'other_workflows': other_workflows,
            'crew_count': len(crew_workflows),
            'system_count': len(system_workflows),
            'other_count': len(other_workflows)
        }
    
    def prune_inactive_workflow(self, workflow: Dict) -> bool:
        """Prune a single inactive workflow."""
        workflow_id = workflow.get('id', '')
        workflow_name = workflow.get('name', '')
        
        try:
            response = requests.delete(f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                                    headers=self.headers)
            
            if response.status_code == 200:
                print(f"   ✅ Pruned: {workflow_name}")
                return True
            else:
                print(f"   ❌ Failed to prune {workflow_name}: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Prune error for {workflow_name}: {e}")
            return False
    
    def create_backup_before_pruning(self, workflows: List[Dict]) -> str:
        """Create a backup before pruning inactive workflows."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = f"pre_pruning_backup_{timestamp}"
        
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        print(f"💾 Creating backup before pruning: {backup_dir}")
        
        # Save all workflows
        for workflow in workflows:
            workflow_id = workflow.get('id', 'unknown')
            workflow_name = workflow.get('name', 'unnamed').replace('/', '_').replace('\\', '_')
            filename = f"{workflow_id}_{workflow_name}.json"
            filepath = os.path.join(backup_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(workflow, f, indent=2)
        
        # Create summary
        summary = {
            'backup_timestamp': datetime.now().isoformat(),
            'total_workflows': len(workflows),
            'workflows': [{'id': w.get('id'), 'name': w.get('name'), 'active': w.get('active')} for w in workflows]
        }
        
        summary_file = os.path.join(backup_dir, 'backup_summary.json')
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
        
        return backup_dir
    
    def prune_all_inactive_workflows(self) -> Dict:
        """Prune all inactive workflows."""
        results = {
            'total_inactive': 0,
            'successfully_pruned': 0,
            'failed_prunings': 0,
            'details': [],
            'backup_directory': '',
            'pruning_timestamp': datetime.now().isoformat()
        }
        
        print("🧹 PRUNING INACTIVE WORKFLOWS FOR OPTIMIZED STRUCTURE...")
        print("=" * 70)
        
        # Fetch all workflows
        print("📡 Fetching all workflows...")
        all_workflows = self.fetch_all_workflows()
        
        if not all_workflows:
            print("❌ No workflows found!")
            return results
        
        # Analyze current status
        print("📊 Analyzing current workflow status...")
        status = self.analyze_workflow_status(all_workflows)
        categories = self.categorize_workflows(all_workflows)
        
        print(f"📋 Total Workflows: {status['total_workflows']}")
        print(f"✅ Active Workflows: {status['active_count']}")
        print(f"❌ Inactive Workflows: {status['inactive_count']}")
        print(f"👥 Crew Workflows: {categories['crew_count']}")
        print(f"⚙️  System Workflows: {categories['system_count']}")
        print(f"🔧 Other Workflows: {categories['other_count']}")
        
        # Create backup before pruning
        print("\n💾 Creating backup before pruning...")
        backup_dir = self.create_backup_before_pruning(all_workflows)
        results['backup_directory'] = backup_dir
        
        # Prune inactive workflows
        inactive_workflows = status['inactive_workflows']
        results['total_inactive'] = len(inactive_workflows)
        
        if not inactive_workflows:
            print("\n🎉 No inactive workflows to prune!")
            return results
        
        print(f"\n🧹 Pruning {len(inactive_workflows)} inactive workflows...")
        
        for workflow in inactive_workflows:
            workflow_name = workflow.get('name', '')
            workflow_id = workflow.get('id', '')
            
            print(f"\n🔧 Pruning: {workflow_name}")
            
            success = self.prune_inactive_workflow(workflow)
            
            if success:
                results['successfully_pruned'] += 1
                results['details'].append({
                    'workflow_id': workflow_id,
                    'workflow_name': workflow_name,
                    'status': 'pruned'
                })
            else:
                results['failed_prunings'] += 1
                results['details'].append({
                    'workflow_id': workflow_id,
                    'workflow_name': workflow_name,
                    'status': 'failed'
                })
        
        return results
    
    def generate_pruning_report(self, results: Dict) -> str:
        """Generate a comprehensive pruning report."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"inactive_workflow_pruning_report_{timestamp}.json"
        
        # Save detailed report
        with open(report_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Display summary
        print("\n📊 PRUNING RESULTS SUMMARY")
        print("=" * 60)
        
        print(f"📋 Total Inactive Workflows: {results['total_inactive']}")
        print(f"✅ Successfully Pruned: {results['successfully_pruned']}")
        print(f"❌ Failed Prunings: {results['failed_prunings']}")
        print(f"💾 Backup Created: {results['backup_directory']}")
        
        if results['failed_prunings'] > 0:
            print(f"\n⚠️  Failed Prunings:")
            for detail in results['details']:
                if detail['status'] == 'failed':
                    print(f"   - {detail['workflow_name']}")
        
        print(f"\n💾 Pruning report saved: {report_file}")
        
        return report_file
    
    def run_pruning(self):
        """Run the complete pruning process."""
        try:
            # Prune inactive workflows
            results = self.prune_all_inactive_workflows()
            
            # Generate report
            print("\n📝 Generating pruning report...")
            report_file = self.generate_pruning_report(results)
            
            # Final status
            if results['failed_prunings'] == 0:
                print("\n🎉 PRUNING COMPLETE - ALL INACTIVE WORKFLOWS SUCCESSFULLY REMOVED!")
                print("n8n instance now has a clean, optimized structure.")
            else:
                print(f"\n⚠️  PRUNING COMPLETE WITH {results['failed_prunings']} FAILURES")
                print("Review the pruning report for details.")
            
            return results
            
        except Exception as e:
            print(f"❌ Inactive workflow pruning failed: {e}")
            return None

if __name__ == "__main__":
    try:
        pruner = InactiveWorkflowPruner()
        pruner.run_pruning()
    except Exception as e:
        print(f"❌ Inactive workflow pruning initialization failed: {e}")
