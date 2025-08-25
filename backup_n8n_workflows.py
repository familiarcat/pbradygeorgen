#!/usr/bin/env python3
"""
🏛️ N8N WORKFLOW BACKUP SYSTEM
Backup all deployed workflows from n8n for safekeeping and redeployment
"""

import os
import json
import requests
import time
from datetime import datetime
from pathlib import Path

class N8NWorkflowBackup:
    """Backup all n8n workflows to local files"""
    
    def __init__(self):
        self.config = {
            "system_name": "N8N Workflow Backup System",
            "n8n_base_url": "https://n8n.pbradygeorgen.com",
            "api_key": None,  # Will be set from environment
            "backup_dir": "n8n_workflow_backups",
            "created_at": datetime.now().isoformat()
        }
        
        # Get API key from environment
        self.config["api_key"] = os.getenv("N8N_API_KEY")
        if not self.config["api_key"]:
            print("⚠️  N8N_API_KEY environment variable not set")
            print("💡 Set it with: export N8N_API_KEY='your_api_key'")
        
        # Create backup directory
        self.backup_path = Path(self.config["backup_dir"])
        self.backup_path.mkdir(exist_ok=True)
    
    def get_all_workflows(self):
        """Fetch all workflows from n8n"""
        try:
            headers = {
                "X-N8N-API-KEY": self.config["api_key"],
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.config['n8n_base_url']}/api/v1/workflows",
                headers=headers,
                timeout=60
            )
            
            if response.status_code == 200:
                workflows = response.json().get("data", [])
                print(f"✅ Retrieved {len(workflows)} workflows from n8n")
                return workflows
            else:
                print(f"❌ Failed to retrieve workflows: {response.status_code}")
                print(f"❌ Error response: {response.text}")
                return []
                
        except Exception as e:
            print(f"❌ Error retrieving workflows: {e}")
            return []
    
    def backup_workflow(self, workflow):
        """Backup a single workflow to local file"""
        try:
            # Create filename from workflow name
            safe_name = "".join(c for c in workflow.get("name", "unnamed") if c.isalnum() or c in (' ', '-', '_')).rstrip()
            filename = f"{safe_name}_{workflow.get('id', 'no-id')}.json"
            filepath = self.backup_path / filename
            
            # Add backup metadata
            workflow_with_metadata = {
                "backup_metadata": {
                    "backup_timestamp": datetime.now().isoformat(),
                    "original_workflow_id": workflow.get("id"),
                    "backup_version": "1.0",
                    "n8n_version": "latest"
                },
                "workflow_data": workflow
            }
            
            # Save to file
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(workflow_with_metadata, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Backed up: {workflow.get('name', 'Unnamed')}")
            return True
            
        except Exception as e:
            print(f"❌ Error backing up {workflow.get('name', 'Unnamed')}: {e}")
            return False
    
    def create_backup_summary(self, workflows):
        """Create a comprehensive backup summary"""
        try:
            summary = {
                "backup_summary": {
                    "timestamp": datetime.now().isoformat(),
                    "total_workflows": len(workflows),
                    "backup_directory": str(self.backup_path.absolute()),
                    "n8n_url": self.config["n8n_base_url"]
                },
                "workflow_list": []
            }
            
            for workflow in workflows:
                summary["workflow_list"].append({
                    "name": workflow.get("name", "Unnamed"),
                    "id": workflow.get("id"),
                    "active": workflow.get("active", False),
                    "tags": workflow.get("tags", []),
                    "backup_file": f"{workflow.get('name', 'unnamed')}_{workflow.get('id', 'no-id')}.json"
                })
            
            # Save summary
            summary_path = self.backup_path / "backup_summary.json"
            with open(summary_path, 'w', encoding='utf-8') as f:
                json.dump(summary, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Created backup summary: {summary_path}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating backup summary: {e}")
            return False
    
    def create_redeployment_script(self, workflows):
        """Create a script to redeploy all backed up workflows"""
        try:
            script_content = f'''#!/usr/bin/env python3
"""
🏛️ N8N WORKFLOW REDEPLOYMENT SCRIPT
Redeploy all backed up workflows to n8n
Generated on: {datetime.now().isoformat()}
"""

import os
import json
import requests
import time
from pathlib import Path

class N8NWorkflowRedeployment:
    """Redeploy all backed up workflows to n8n"""
    
    def __init__(self):
        self.config = {{
            "n8n_base_url": "{self.config['n8n_base_url']}",
            "api_key": os.getenv("N8N_API_KEY"),
            "backup_dir": "{self.config['backup_dir']}"
        }}
        
        if not self.config["api_key"]:
            print("❌ N8N_API_KEY environment variable not set")
            exit(1)
    
    def redeploy_workflows(self):
        """Redeploy all backed up workflows"""
        backup_path = Path(self.config["backup_dir"])
        
        if not backup_path.exists():
            print("❌ Backup directory not found")
            return False
        
        # Get all backup files
        backup_files = list(backup_path.glob("*.json"))
        backup_files = [f for f in backup_files if f.name != "backup_summary.json"]
        
        print(f"🚀 Found {len(backup_files)} workflows to redeploy")
        
        success_count = 0
        for backup_file in backup_files:
            try:
                with open(backup_file, 'r', encoding='utf-8') as f:
                    backup_data = json.load(f)
                
                workflow_data = backup_data.get("workflow_data", {{}})
                workflow_name = workflow_data.get("name", "Unnamed")
                
                print(f"🔧 Redeploying: {{workflow_name}}")
                
                if self.deploy_workflow(workflow_data):
                    print(f"✅ Redeployed: {{workflow_name}}")
                    success_count += 1
                else:
                    print(f"❌ Failed to redeploy: {{workflow_name}}")
                
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                print(f"❌ Error processing {backup_file.name}: {{e}}")
        
        print(f"\\n🎉 REDEPLOYMENT COMPLETED: {{success_count}}/{{len(backup_files)}} workflows redeployed")
        return success_count == len(backup_files)
    
    def deploy_workflow(self, workflow_data):
        """Deploy a single workflow to n8n"""
        try:
            headers = {{
                "X-N8N-API-KEY": self.config["api_key"],
                "Content-Type": "application/json"
            }}
            
            # Remove ID to create new workflow
            workflow_data.pop("id", None)
            workflow_data.pop("active", None)
            
            response = requests.post(
                f"{{self.config['n8n_base_url']}}/api/v1/workflows",
                headers=headers,
                json=workflow_data,
                timeout=60
            )
            
            return response.status_code in [200, 201]
            
        except Exception as e:
            print(f"❌ Error deploying workflow: {{e}}")
            return False

def main():
    """Main function"""
    print("🏛️ N8N WORKFLOW REDEPLOYMENT")
    print("=" * 50)
    
    redeployer = N8NWorkflowRedeployment()
    success = redeployer.redeploy_workflows()
    
    if success:
        print("\\n🎉 All workflows redeployed successfully!")
    else:
        print("\\n⚠️  Some workflows failed to redeploy")
        exit(1)

if __name__ == "__main__":
    main()
'''
            
            script_path = self.backup_path / "redeploy_workflows.py"
            with open(script_path, 'w', encoding='utf-8') as f:
                f.write(script_content)
            
            # Make executable
            os.chmod(script_path, 0o755)
            
            print(f"✅ Created redeployment script: {script_path}")
            return True
            
        except Exception as e:
            print(f"❌ Error creating redeployment script: {e}")
            return False
    
    def run_backup(self):
        """Run the complete backup process"""
        if not self.config["api_key"]:
            print("❌ N8N_API_KEY not set - cannot proceed")
            return False
        
        print("🏛️ N8N WORKFLOW BACKUP SYSTEM")
        print("=" * 80)
        
        # Get all workflows
        print("📥 Retrieving workflows from n8n...")
        workflows = self.get_all_workflows()
        
        if not workflows:
            print("❌ No workflows found or error occurred")
            return False
        
        # Backup each workflow
        print(f"\n💾 Backing up {len(workflows)} workflows...")
        success_count = 0
        
        for workflow in workflows:
            if self.backup_workflow(workflow):
                success_count += 1
        
        # Create summary and redeployment script
        print(f"\n📋 Creating backup summary...")
        self.create_backup_summary(workflows)
        
        print(f"\n🔧 Creating redeployment script...")
        self.create_redeployment_script(workflows)
        
        print(f"\n🎉 BACKUP COMPLETED: {success_count}/{len(workflows)} workflows backed up")
        print("=" * 80)
        print(f"📁 Backup location: {self.backup_path.absolute()}")
        print(f"📋 Summary file: backup_summary.json")
        print(f"🔧 Redeploy script: redeploy_workflows.py")
        print(f"💡 To redeploy: python3 {self.backup_path}/redeploy_workflows.py")
        
        return True

def main():
    """Main function"""
    backup_system = N8NWorkflowBackup()
    success = backup_system.run_backup()
    
    if not success:
        exit(1)

if __name__ == "__main__":
    main()
