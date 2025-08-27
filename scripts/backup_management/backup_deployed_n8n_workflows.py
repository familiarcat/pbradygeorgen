#!/usr/bin/env python3
"""
Backup Deployed N8N Workflows Script
Creates comprehensive backup of all workflows from remote n8n server
"""

import os
import json
import sys
import requests
from typing import Dict, Any, List
from pathlib import Path
from datetime import datetime

class N8NWorkflowBackup:
    def __init__(self):
        # Load environment variables
        self.load_environment_variables()
        
        # Configuration
        self.n8n_url = os.getenv('N8N_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        # Headers for n8n API
        self.headers = {
            'Content-Type': 'application/json',
            'X-N8N-API-Key': self.n8n_api_key or 'n8n_api_key_placeholder'
        }
        
        # File paths
        self.workspace_dir = Path.cwd()
        self.backup_dir = self.workspace_dir / "n8n_deployed_backup"
        
        # Create backup directory with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        self.backup_dir = self.backup_dir / f"backup_{timestamp}"
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
        print("🚀 N8N WORKFLOW BACKUP SYSTEM")
        print("=" * 60)

    def load_environment_variables(self):
        """Load environment variables from ~/.zshrc"""
        try:
            zshrc_path = os.path.expanduser("~/.zshrc")
            if os.path.exists(zshrc_path):
                with open(zshrc_path, 'r') as f:
                    content = f.read()
                
                lines = content.split('\n')
                for line in lines:
                    if line.startswith('export ') and '=' in line:
                        key, value = line.replace('export ', '').split('=', 1)
                        os.environ[key] = value.strip('"')
                        
        except Exception as e:
            print(f"⚠️  Warning: Could not load ~/.zshrc: {e}")

    def test_n8n_connection(self) -> bool:
        """Test connection to n8n instance"""
        try:
            print("🔍 Testing n8n connection...")
            
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                print("   ✅ n8n connection successful")
                return True
            elif response.status_code == 401:
                print("   ⚠️  n8n connection failed: Authentication required")
                print("   💡 Please check your N8N_API_KEY in ~/.zshrc")
                return False
            else:
                print(f"   ❌ n8n connection failed: {response.status_code}")
                return False
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ n8n connection failed: Cannot connect to {self.n8n_url}")
            print("   💡 Please ensure n8n server is accessible")
            return False
        except Exception as e:
            print(f"   ❌ n8n connection failed: {e}")
            return False

    def fetch_all_workflows(self) -> List[Dict[str, Any]]:
        """Fetch all workflows from n8n"""
        try:
            print("📥 Fetching all workflows from n8n...")
            
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                # Handle different response formats
                if isinstance(data, list):
                    workflows = data
                elif isinstance(data, dict) and 'data' in data:
                    workflows = data['data']
                elif isinstance(data, str):
                    # If it's a string, try to parse it as JSON
                    try:
                        workflows = json.loads(data)
                        if not isinstance(workflows, list):
                            workflows = [workflows]
                    except:
                        print(f"   ❌ Unexpected response format: {type(data)}")
                        return []
                else:
                    print(f"   ❌ Unexpected response format: {type(data)}")
                    return []
                
                print(f"   ✅ Fetched {len(workflows)} workflows")
                return workflows
            else:
                print(f"   ❌ Failed to fetch workflows: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"   ❌ Error fetching workflows: {e}")
            return []

    def create_backup_metadata(self, workflows: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create backup metadata"""
        return {
            "backup_metadata": {
                "backup_timestamp": datetime.now().isoformat(),
                "n8n_server_url": self.n8n_url,
                "total_workflows": len(workflows),
                "backup_version": "1.0",
                "backup_type": "deployed_workflows",
                "description": "Complete backup of all deployed n8n workflows"
            },
            "workflow_summary": {
                "active_workflows": len([w for w in workflows if w.get('active')]),
                "inactive_workflows": len([w for w in workflows if not w.get('active')]),
                "archived_workflows": len([w for w in workflows if w.get('isArchived')]),
                "crew_workflows": len([w for w in workflows if any(crew_name in w.get('name', '') for crew_name in [
                    'Captain Jean-Luc Picard', 'Commander William Riker', 'Dr. Beverly Crusher',
                    'Commander Data', 'Lieutenant Commander Geordi La Forge', 'Lieutenant Worf',
                    'Lieutenant Uhura', 'Counselor Deanna Troi', 'Quark'
                ])]),
                "enhanced_workflows": len([w for w in workflows if 'Memory' in str(w.get('nodes', []))])
            }
        }

    def backup_individual_workflow(self, workflow: Dict[str, Any]) -> bool:
        """Backup a single workflow"""
        try:
            workflow_id = workflow.get('id', 'unknown')
            workflow_name = workflow.get('name', 'unnamed_workflow')
            
            # Clean filename
            safe_name = "".join(c for c in workflow_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
            safe_name = safe_name.replace(' ', '_')
            
            filename = f"{workflow_id}_{safe_name}.json"
            filepath = self.backup_dir / filename
            
            # Create backup structure
            backup_data = {
                "backup_metadata": {
                    "backup_timestamp": datetime.now().isoformat(),
                    "original_workflow_id": workflow_id,
                    "original_workflow_name": workflow_name,
                    "backup_version": "1.0",
                    "n8n_version": "latest"
                },
                "workflow_data": workflow
            }
            
            with open(filepath, 'w') as f:
                json.dump(backup_data, f, indent=2)
            
            print(f"   ✅ Backed up: {workflow_name} ({workflow_id})")
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to backup workflow {workflow.get('name', 'unknown')}: {e}")
            return False

    def backup_all_workflows(self, workflows: List[Dict[str, Any]]) -> bool:
        """Backup all workflows"""
        print(f"\n💾 Backing up {len(workflows)} workflows...")
        
        successful_backups = 0
        
        for workflow in workflows:
            if self.backup_individual_workflow(workflow):
                successful_backups += 1
        
        print(f"\n📊 Backup Results: {successful_backups}/{len(workflows)} workflows backed up")
        
        if successful_backups == len(workflows):
            print("   ✅ All workflows backed up successfully")
            return True
        else:
            print("   ⚠️  Some workflows failed to backup")
            return False

    def create_backup_summary(self, workflows: List[Dict[str, Any]], metadata: Dict[str, Any]) -> bool:
        """Create backup summary file"""
        try:
            summary_file = self.backup_dir / "backup_summary.json"
            
            summary_data = {
                **metadata,
                "workflows": [
                    {
                        "id": w.get('id'),
                        "name": w.get('name'),
                        "active": w.get('active'),
                        "isArchived": w.get('isArchived'),
                        "triggerCount": w.get('triggerCount'),
                        "createdAt": w.get('createdAt'),
                        "updatedAt": w.get('updatedAt'),
                        "has_memory_nodes": 'Memory' in str(w.get('nodes', [])),
                        "node_count": len(w.get('nodes', [])),
                        "backup_filename": f"{w.get('id')}_{w.get('name', 'unnamed').replace(' ', '_')}.json"
                    }
                    for w in workflows
                ]
            }
            
            with open(summary_file, 'w') as f:
                json.dump(summary_data, f, indent=2)
            
            print(f"   ✅ Backup summary created: {summary_file}")
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to create backup summary: {e}")
            return False

    def create_restore_script(self, workflows: List[Dict[str, Any]]) -> bool:
        """Create a restore script for the backup"""
        try:
            restore_script = self.backup_dir / "restore_workflows.py"
            
            script_content = f'''#!/usr/bin/env python3
"""
N8N Workflow Restore Script
Restores workflows from backup created on {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
"""

import os
import json
import sys
import requests
from pathlib import Path

def load_environment_variables():
    """Load environment variables from ~/.zshrc"""
    try:
        zshrc_path = os.path.expanduser("~/.zshrc")
        if os.path.exists(zshrc_path):
            with open(zshrc_path, 'r') as f:
                content = f.read()
            
            lines = content.split('\\n')
            for line in lines:
                if line.startswith('export ') and '=' in line:
                    key, value = line.replace('export ', '').split('=', 1)
                    os.environ[key] = value.strip('"')
                    
    except Exception as e:
        print(f"Warning: Could not load ~/.zshrc: {{e}}")

def restore_workflows():
    """Restore workflows from backup"""
    # Load environment variables
    load_environment_variables()
    
    # Configuration
    n8n_url = os.getenv('N8N_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.getenv('N8N_API_KEY')
    
    headers = {{
        'Content-Type': 'application/json',
        'X-N8N-API-Key': n8n_api_key or 'n8n_api_key_placeholder'
    }}
    
    # Get backup directory
    backup_dir = Path(__file__).parent
    
    print("🔄 N8N WORKFLOW RESTORE")
    print("=" * 40)
    
    # Load backup summary
    summary_file = backup_dir / "backup_summary.json"
    if not summary_file.exists():
        print("❌ Backup summary not found")
        return False
    
    with open(summary_file, 'r') as f:
        summary = json.load(f)
    
    print(f"📋 Found {{len(summary['workflows'])}} workflows to restore")
    
    successful_restores = 0
    
    for workflow_info in summary['workflows']:
        workflow_file = backup_dir / workflow_info['backup_filename']
        
        if not workflow_file.exists():
            print(f"⚠️  Workflow file not found: {{workflow_info['backup_filename']}}")
            continue
        
        try:
            with open(workflow_file, 'r') as f:
                backup_data = json.load(f)
            
            workflow_data = backup_data['workflow_data']
            workflow_id = workflow_data.get('id')
            workflow_name = workflow_data.get('name')
            
            print(f"🔄 Restoring: {{workflow_name}}")
            
            # Prepare workflow for deployment (remove read-only fields)
            deployment_data = {{
                'name': workflow_data.get('name', ''),
                'nodes': workflow_data.get('nodes', []),
                'connections': workflow_data.get('connections', {{}}),
                'settings': workflow_data.get('settings', {{}})
            }}
            
            # Check if workflow exists
            response = requests.get(f"{{n8n_url}}/api/v1/workflows/{{workflow_id}}", headers=headers, timeout=10)
            
            if response.status_code == 200:
                # Update existing workflow
                response = requests.put(
                    f"{{n8n_url}}/api/v1/workflows/{{workflow_id}}",
                    headers=headers,
                    json=deployment_data,
                    timeout=30
                )
            else:
                # Create new workflow
                response = requests.post(
                    f"{{n8n_url}}/api/v1/workflows",
                    headers=headers,
                    json=deployment_data,
                    timeout=30
                )
            
            if response.status_code in [200, 201]:
                print(f"   ✅ Restored: {{workflow_name}}")
                successful_restores += 1
            else:
                print(f"   ❌ Failed to restore {{workflow_name}}: {{response.status_code}}")
                
        except Exception as e:
            print(f"   ❌ Error restoring {{workflow_info.get('name', 'unknown')}}: {{e}}")
    
    print(f"\\n📊 Restore Results: {{successful_restores}}/{{len(summary['workflows'])}} workflows restored")
    
    if successful_restores == len(summary['workflows']):
        print("✅ All workflows restored successfully")
        return True
    else:
        print("⚠️  Some workflows failed to restore")
        return False

if __name__ == "__main__":
    success = restore_workflows()
    sys.exit(0 if success else 1)
'''
            
            with open(restore_script, 'w') as f:
                f.write(script_content)
            
            # Make it executable
            os.chmod(restore_script, 0o755)
            
            print(f"   ✅ Restore script created: {restore_script}")
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to create restore script: {e}")
            return False

    def create_backup_readme(self, metadata: Dict[str, Any]) -> bool:
        """Create a README file for the backup"""
        try:
            readme_file = self.backup_dir / "README.md"
            
            readme_content = f"""# N8N Workflow Backup

## Backup Information

- **Backup Date**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
- **N8N Server**: {self.n8n_url}
- **Total Workflows**: {metadata['workflow_summary']['total_workflows']}
- **Active Workflows**: {metadata['workflow_summary']['active_workflows']}
- **Crew Workflows**: {metadata['workflow_summary']['crew_workflows']}
- **Enhanced Workflows**: {metadata['workflow_summary']['enhanced_workflows']}

## Files in this Backup

- `backup_summary.json` - Complete summary of all workflows
- `restore_workflows.py` - Script to restore all workflows
- Individual workflow files (one per workflow)

## How to Restore

1. Ensure you have access to the n8n server
2. Run the restore script:
   ```bash
   python3 restore_workflows.py
   ```

## Backup Contents

This backup contains all workflows currently deployed on the n8n server, including:
- Crew member workflows with memory integration
- System coordination workflows
- All workflow configurations and connections
- Complete workflow metadata

## Important Notes

- This backup was created automatically
- All workflows are preserved in their current state
- The restore script will attempt to update existing workflows or create new ones
- Make sure to test the restore process in a safe environment first
"""
            
            with open(readme_file, 'w') as f:
                f.write(readme_content)
            
            print(f"   ✅ Backup README created: {readme_file}")
            return True
            
        except Exception as e:
            print(f"   ❌ Failed to create backup README: {e}")
            return False

    def run_backup(self) -> bool:
        """Run the complete backup process"""
        try:
            print("🚀 N8N WORKFLOW BACKUP PROCESS")
            print("=" * 60)
            
            # Test n8n connection
            if not self.test_n8n_connection():
                print("\n❌ Cannot proceed without n8n connection")
                return False
            
            # Fetch all workflows
            workflows = self.fetch_all_workflows()
            if not workflows:
                print("\n❌ No workflows found to backup")
                return False
            
            # Create backup metadata
            metadata = self.create_backup_metadata(workflows)
            
            # Backup all workflows
            if not self.backup_all_workflows(workflows):
                return False
            
            # Create backup summary
            if not self.create_backup_summary(workflows, metadata):
                return False
            
            # Create restore script
            if not self.create_restore_script(workflows):
                return False
            
            # Create backup README
            if not self.create_backup_readme(metadata):
                return False
            
            # Success summary
            print(f"\n🎉 N8N WORKFLOW BACKUP COMPLETED SUCCESSFULLY!")
            print("=" * 60)
            print(f"📁 Backup Location: {self.backup_dir}")
            print(f"📊 Total Workflows: {len(workflows)}")
            print(f"🟢 Active Workflows: {metadata['workflow_summary']['active_workflows']}")
            print(f"👥 Crew Workflows: {metadata['workflow_summary']['crew_workflows']}")
            print(f"🧠 Enhanced Workflows: {metadata['workflow_summary']['enhanced_workflows']}")
            print(f"📄 Files Created: backup_summary.json, restore_workflows.py, README.md")
            print(f"🔄 Restore Script: {self.backup_dir}/restore_workflows.py")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Backup process failed: {e}")
            return False

def main():
    """Main execution function"""
    backup = N8NWorkflowBackup()
    
    success = backup.run_backup()
    
    if success:
        print(f"\n🚀 N8N workflow backup completed!")
        print("   Next: Commit backup to git for version control")
    else:
        print(f"\n⚠️  Backup process completed with issues")
        print("   Check the backup directory for partial results")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
