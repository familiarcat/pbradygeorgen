#!/usr/bin/env python3
"""
Backup Current N8N State Script
Creates a comprehensive backup of the current n8n server state after manual deactivation.
"""

import json
import requests
import os
import shutil
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class N8NStateBackup:
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
    
    def analyze_current_state(self, workflows: List[Dict]) -> Dict:
        """Analyze the current state after manual deactivation."""
        active_workflows = [w for w in workflows if w.get('active', False)]
        inactive_workflows = [w for w in workflows if not w.get('active', False)]
        
        crew_workflows = defaultdict(list)
        system_workflows = []
        
        # Categorize active workflows
        for workflow in active_workflows:
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member and crew_member != 'System Workflow':
                crew_workflows[crew_member].append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'createdAt': workflow.get('createdAt', ''),
                    'updatedAt': workflow.get('updatedAt', ''),
                    'has_memory': self.has_memory_integration(workflow),
                    'has_llm': self.has_llm_integration(workflow),
                    'node_count': len(workflow.get('nodes', [])),
                    'connection_count': len(workflow.get('connections', {}))
                })
            else:
                system_workflows.append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': workflow.get('active', False)
                })
        
        # Check for duplicates
        duplicates_found = []
        for crew_member, workflow_list in crew_workflows.items():
            if len(workflow_list) > 1:
                duplicates_found.append({
                    'crew_member': crew_member,
                    'count': len(workflow_list),
                    'workflows': workflow_list
                })
        
        return {
            'total_workflows': len(workflows),
            'active_workflows': len(active_workflows),
            'inactive_workflows': len(inactive_workflows),
            'crew_members': len(crew_workflows),
            'system_workflows': len(system_workflows),
            'duplicates_found': duplicates_found,
            'cleanup_status': 'incomplete' if duplicates_found else 'complete',
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
    
    def has_memory_integration(self, workflow: Dict) -> bool:
        """Check if workflow has memory integration (Supabase nodes)."""
        nodes = workflow.get('nodes', [])
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'supabase.co' in url:
                        return True
        
        return False
    
    def has_llm_integration(self, workflow: Dict) -> bool:
        """Check if workflow has LLM integration (OpenRouter nodes)."""
        nodes = workflow.get('nodes', [])
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'openrouter.ai' in url:
                        return True
        
        return False
    
    def create_backup_directory(self) -> str:
        """Create timestamped backup directory."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = f"n8n_current_state_backup_{timestamp}"
        
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        return backup_dir
    
    def backup_workflows(self, workflows: List[Dict], backup_dir: str):
        """Backup individual workflow files."""
        workflows_dir = os.path.join(backup_dir, "workflows")
        if not os.path.exists(workflows_dir):
            os.makedirs(workflows_dir)
        
        for workflow in workflows:
            workflow_id = workflow.get('id', 'unknown')
            workflow_name = workflow.get('name', 'unnamed').replace('/', '_').replace('\\', '_')
            
            filename = f"{workflow_id}_{workflow_name}.json"
            filepath = os.path.join(workflows_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(workflow, f, indent=2)
        
        print(f"💾 Backed up {len(workflows)} individual workflows to {workflows_dir}")
    
    def create_backup_summary(self, workflows: List[Dict], state_analysis: Dict, backup_dir: str):
        """Create comprehensive backup summary."""
        # Create backup summary
        backup_summary = {
            'backup_timestamp': datetime.now().isoformat(),
            'n8n_url': self.n8n_url,
            'state_analysis': state_analysis,
            'workflow_details': []
        }
        
        # Add workflow details
        for workflow in workflows:
            backup_summary['workflow_details'].append({
                'id': workflow.get('id', ''),
                'name': workflow.get('name', ''),
                'active': workflow.get('active', False),
                'createdAt': workflow.get('createdAt', ''),
                'updatedAt': workflow.get('updatedAt', ''),
                'crew_member': self.extract_crew_member(workflow.get('name', '')),
                'has_memory': self.has_memory_integration(workflow),
                'has_llm': self.has_llm_integration(workflow),
                'node_count': len(workflow.get('nodes', [])),
                'connection_count': len(workflow.get('connections', {}))
            })
        
        # Save backup summary
        summary_file = os.path.join(backup_dir, "backup_summary.json")
        with open(summary_file, 'w') as f:
            json.dump(backup_summary, f, indent=2)
        
        print(f"💾 Created backup summary: {summary_file}")
        
        # Create README
        readme_content = self.generate_backup_readme(state_analysis, backup_dir)
        readme_file = os.path.join(backup_dir, "README.md")
        with open(readme_file, 'w') as f:
            f.write(readme_content)
        
        print(f"💾 Created backup README: {readme_file}")
        
        return backup_summary
    
    def generate_backup_readme(self, state_analysis: Dict, backup_dir: str) -> str:
        """Generate README for the backup."""
        readme = []
        readme.append("# N8N Current State Backup")
        readme.append("")
        readme.append(f"**Backup Timestamp**: {state_analysis['timestamp']}")
        readme.append(f"**N8N URL**: {self.n8n_url}")
        readme.append("")
        readme.append("## Current State Summary")
        readme.append("")
        readme.append(f"- **Total Workflows**: {state_analysis['total_workflows']}")
        readme.append(f"- **Active Workflows**: {state_analysis['active_workflows']}")
        readme.append(f"- **Inactive Workflows**: {state_analysis['inactive_workflows']}")
        readme.append(f"- **Crew Members**: {state_analysis['crew_members']}")
        readme.append(f"- **System Workflows**: {state_analysis['system_workflows']}")
        readme.append(f"- **Cleanup Status**: {state_analysis['cleanup_status'].upper()}")
        readme.append("")
        
        if state_analysis['duplicates_found']:
            readme.append("## ⚠️ Duplicates Still Found")
            readme.append("")
            for duplicate in state_analysis['duplicates_found']:
                readme.append(f"### {duplicate['crew_member']}")
                readme.append(f"- **Active Workflows**: {duplicate['count']}")
                readme.append("")
        else:
            readme.append("## ✅ No Duplicates Found")
            readme.append("Cleanup appears to be complete!")
            readme.append("")
        
        readme.append("## Backup Contents")
        readme.append("")
        readme.append("- `workflows/` - Individual workflow JSON files")
        readme.append("- `backup_summary.json` - Complete state analysis")
        readme.append("- `README.md` - This file")
        readme.append("")
        readme.append("## Next Steps")
        readme.append("")
        readme.append("1. Review the backup to ensure it captures the desired state")
        readme.append("2. Commit this backup to git for reference")
        readme.append("3. Proceed with script-based cleanup if needed")
        readme.append("4. Verify final state matches expectations")
        
        return "\n".join(readme)
    
    def run_backup(self):
        """Run the complete backup process."""
        print("💾 CREATING COMPREHENSIVE N8N STATE BACKUP...")
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Analyze current state
        print("🎯 Analyzing current state...")
        state_analysis = self.analyze_current_state(workflows)
        
        # Create backup directory
        print("📁 Creating backup directory...")
        backup_dir = self.create_backup_directory()
        print(f"📁 Backup directory created: {backup_dir}")
        
        # Backup individual workflows
        print("💾 Backing up individual workflows...")
        self.backup_workflows(workflows, backup_dir)
        
        # Create backup summary
        print("📊 Creating backup summary...")
        backup_summary = self.create_backup_summary(workflows, state_analysis, backup_dir)
        
        # Display results
        print("\n📊 BACKUP COMPLETE!")
        print("=" * 60)
        
        print(f"Backup Directory: {backup_dir}")
        print(f"Total Workflows Backed Up: {len(workflows)}")
        print(f"Active Workflows: {state_analysis['active_workflows']}")
        print(f"Inactive Workflows: {state_analysis['inactive_workflows']}")
        print(f"Cleanup Status: {state_analysis['cleanup_status'].upper()}")
        
        if state_analysis['duplicates_found']:
            print(f"\n⚠️  DUPLICATES STILL FOUND: {len(state_analysis['duplicates_found'])}")
            print("Review backup before proceeding with cleanup")
        else:
            print("\n✅ NO DUPLICATES FOUND!")
            print("Cleanup appears complete - backup created for reference")
        
        print(f"\n💾 Backup saved to: {backup_dir}")
        print("📝 Next: Review backup and commit to git")
        
        return backup_dir

if __name__ == "__main__":
    try:
        backup = N8NStateBackup()
        backup.run_backup()
    except Exception as e:
        print(f"❌ Backup failed: {e}")
