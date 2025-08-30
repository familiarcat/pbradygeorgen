#!/usr/bin/env python3
"""
N8N Workflow Backup Script
Creates a backup of all currently deployed workflows from your n8n instance
"""

import os
import json
import requests
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List

class N8NWorkflowBackup:
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.backup_dir = Path('archives/n8n_backups')
        
        if not self.n8n_api_key:
            print("❌ N8N_API_KEY environment variable not set")
            print("Please set it in your ~/.zshrc file")
            return
            
        self.session = requests.Session()
        self.session.headers.update({
            'X-N8N-API-KEY': self.n8n_api_key,
            'Content-Type': 'application/json'
        })
        
        # Create backup directory if it doesn't exist
        self.backup_dir.mkdir(parents=True, exist_ok=True)
    
    def test_connection(self) -> bool:
        """Test connection to n8n instance"""
        try:
            # Try the workflows endpoint instead of health endpoint
            response = self.session.get(f"{self.n8n_base_url}/api/v1/workflows")
            if response.status_code == 200:
                print(f"✅ Connected to n8n instance: {self.n8n_base_url}")
                return True
            elif response.status_code == 401:
                print(f"❌ Authentication failed - check your N8N_API_KEY")
                return False
            elif response.status_code == 404:
                print(f"❌ API endpoint not found - check if n8n is running and accessible")
                return False
            else:
                print(f"❌ Failed to connect to n8n: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def get_all_workflows(self) -> List[Dict[str, Any]]:
        """Get all workflows from n8n instance"""
        try:
            response = self.session.get(f"{self.n8n_base_url}/api/v1/workflows")
            if response.status_code == 200:
                data = response.json()
                
                # Handle different response formats
                if isinstance(data, dict) and 'data' in data:
                    workflows = data['data']
                elif isinstance(data, list):
                    workflows = data
                else:
                    print(f"⚠️  Unexpected response format: {type(data)}")
                    workflows = []
                
                print(f"📊 Found {len(workflows)} workflows to backup")
                
                # Debug: print first workflow structure
                if workflows:
                    print(f"🔍 First workflow structure: {type(workflows[0])}")
                    if isinstance(workflows[0], dict):
                        print(f"   Keys: {list(workflows[0].keys())}")
                    else:
                        print(f"   Value: {workflows[0]}")
                
                return workflows
            else:
                print(f"❌ Failed to get workflows: {response.status_code}")
                return []
        except Exception as e:
            print(f"❌ Error getting workflows: {e}")
            return []
    
    def create_backup_summary(self, workflows: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create a summary of all workflows for the backup"""
        summary = {
            'backup_timestamp': datetime.now().isoformat(),
            'n8n_instance': self.n8n_base_url,
            'total_workflows': len(workflows),
            'active_workflows': 0,
            'crew_workflows': 0,
            'federation_workflows': 0,
            'workflow_details': []
        }
        
        for workflow in workflows:
            if not isinstance(workflow, dict):
                print(f"⚠️  Skipping non-dict workflow: {type(workflow)}")
                continue
                
            workflow_info = {
                'id': workflow.get('id'),
                'name': workflow.get('name'),
                'active': workflow.get('active', False),
                'created_at': workflow.get('createdAt'),
                'updated_at': workflow.get('updatedAt'),
                'tags': workflow.get('tags', []),
                'node_count': len(workflow.get('nodes', [])),
                'connection_count': len(workflow.get('connections', {}))
            }
            
            summary['workflow_details'].append(workflow_info)
            
            if workflow.get('active'):
                summary['active_workflows'] += 1
            
            if 'crew' in workflow.get('name', '').lower():
                summary['crew_workflows'] += 1
            
            if 'federation' in workflow.get('name', '').lower():
                summary['federation_workflows'] += 1
        
        return summary
    
    def backup_workflow(self, workflow: Dict[str, Any], backup_dir: Path) -> bool:
        """Backup a single workflow to a JSON file"""
        try:
            if not isinstance(workflow, dict):
                print(f"⚠️  Skipping non-dict workflow: {type(workflow)}")
                return False
                
            workflow_name = workflow.get('name', 'unnamed_workflow')
            workflow_id = workflow.get('id', 'unknown_id')
            
            # Create a safe filename
            safe_name = "".join(c for c in workflow_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
            safe_name = safe_name.replace(' ', '_')
            
            filename = f"{safe_name}_{workflow_id}.json"
            filepath = backup_dir / filename
            
            # Save the workflow
            with open(filepath, 'w') as f:
                json.dump(workflow, f, indent=2, default=str)
            
            print(f"✅ Backed up: {workflow_name}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to backup {workflow.get('name', 'unknown') if isinstance(workflow, dict) else 'unknown'}: {e}")
            return False
    
    def create_backup(self) -> bool:
        """Create a complete backup of all workflows"""
        if not self.test_connection():
            return False
        
        print("\n🔄 Starting n8n workflow backup...")
        
        # Get all workflows
        workflows = self.get_all_workflows()
        if not workflows:
            print("❌ No workflows found to backup")
            return False
        
        # Create timestamped backup directory
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"n8n_backup_{timestamp}"
        backup_path = self.backup_dir / backup_name
        backup_path.mkdir(exist_ok=True)
        
        print(f"📁 Creating backup in: {backup_path}")
        
        # Create backup summary
        summary = self.create_backup_summary(workflows)
        summary_file = backup_path / "backup_summary.json"
        
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2, default=str)
        
        print(f"📋 Created backup summary: {summary_file}")
        
        # Backup individual workflows
        successful_backups = 0
        total_workflows = len(workflows)
        
        for workflow in workflows:
            if self.backup_workflow(workflow, backup_path):
                successful_backups += 1
            time.sleep(0.1)  # Small delay to be respectful to the API
        
        # Create a README file for the backup
        readme_content = f"""# N8N Workflow Backup - {timestamp}

This backup was created on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")} from {self.n8n_base_url}

## Backup Contents

- **Total Workflows**: {total_workflows}
- **Active Workflows**: {summary['active_workflows']}
- **Crew Workflows**: {summary['crew_workflows']}
- **Federation Workflows**: {summary['federation_workflows']}

## Files

- `backup_summary.json` - Overview of all workflows
- Individual workflow files (one per workflow)

## Restoration

To restore a workflow from this backup:

1. Copy the workflow JSON file to your n8n instance
2. Import it through the n8n interface
3. Activate the workflow if needed

## Notes

- This backup was created before deploying corrected workflows
- All workflow configurations and connections are preserved
- Use this backup to rollback if needed

Generated by: N8N Workflow Backup Script
"""
        
        readme_file = backup_path / "README.md"
        with open(readme_file, 'w') as f:
            f.write(readme_content)
        
        print(f"\n📊 Backup Summary:")
        print(f"   Total workflows: {total_workflows}")
        print(f"   Successfully backed up: {successful_backups}")
        print(f"   Failed: {total_workflows - successful_backups}")
        print(f"   Backup location: {backup_path}")
        
        if successful_backups > 0:
            print(f"\n✅ Backup completed successfully!")
            print(f"📁 Backup directory: {backup_path}")
            print(f"📋 Summary file: {summary_file}")
            print(f"📖 Readme file: {readme_file}")
            
            # Print workflow details
            print(f"\n🔍 Workflow Details:")
            for workflow_info in summary['workflow_details']:
                status = "🟢 ACTIVE" if workflow_info['active'] else "🔴 INACTIVE"
                print(f"   {status} {workflow_info['name']}")
                print(f"      Nodes: {workflow_info['node_count']}, Connections: {workflow_info['connection_count']}")
            
            return True
        else:
            print(f"\n❌ Backup failed - no workflows were successfully backed up")
            return False

def main():
    """Main backup function"""
    print("💾 N8N Workflow Backup Script")
    print("=" * 50)
    
    backup_tool = N8NWorkflowBackup()
    
    if not backup_tool.n8n_api_key:
        print("\n📝 Setup Instructions:")
        print("1. Add your n8n API key to ~/.zshrc:")
        print("   export N8N_API_KEY='your-api-key-here'")
        print("2. Reload your shell: source ~/.zshrc")
        print("3. Run this script again")
        return
    
    # Create backup
    if backup_tool.create_backup():
        print("\n🎉 Backup completed successfully!")
        print("\n📋 Next Steps:")
        print("1. Review the backup files in the archives/n8n_backups directory")
        print("2. Verify all workflows were captured correctly")
        print("3. Proceed with deploying corrected workflows")
        print("4. Keep this backup for rollback purposes")
    else:
        print("\n❌ Backup failed!")
        print("Check the error messages above and try again.")

if __name__ == "__main__":
    main()
