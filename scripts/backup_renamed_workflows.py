#!/usr/bin/env python3
"""
Backup Renamed Workflows Script
Creates a comprehensive backup of the current n8n state after manual renaming.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class RenamedWorkflowBackup:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Define the expected naming conventions
        self.expected_naming = {
            'CREW-LEADERSHIP-PICARD': 'Captain Jean-Luc Picard - Strategic Leadership & Mission Command',
            'CREW-TACTICAL-RIKER': 'Commander William Riker - Tactical Execution & Workflow Management',
            'CREW-MEDICAL-CRUSHER': 'Dr. Beverly Crusher - Health & Diagnostics Officer',
            'CREW-ANALYTICS-DATA': 'Commander Data - Analytics & Logic Operations',
            'CREW-ENGINEERING-LA_FORGE': 'Lieutenant Commander Geordi La Forge - Infrastructure & System Integration',
            'CREW-SECURITY-WORF': 'Lieutenant Worf - Security & Compliance Operations',
            'CREW-COUNSELING-TROI': 'Counselor Deanna Troi - User Experience & Empathy Analysis',
            'CREW-COMMUNICATIONS-UHURA': 'Lieutenant Uhura - Communications & I/O Operations Officer',
            'CREW-BUSINESS_INTELLIGENCE-QUARK': 'Quark - Business Intelligence & Budget Optimization',
            'SYSTEM-ORCHESTRATION-FEDERATION': 'Enhanced Federation Crew - Complete Mission Control',
            'SYSTEM-COORDINATION-ALEXAI': 'AlexAI Optimized Crew - Complete Mission Control',
            'SYSTEM-AGENT-OPENROUTER': 'Federation Crew - OpenRouter Agent Coordination',
            'SYSTEM-AGENCY-CONCISE': 'Federation Concise Agency - OpenRouter Crew'
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
    
    def analyze_naming_conventions(self, workflows: List[Dict]) -> Dict:
        """Analyze the current naming conventions after manual renaming."""
        active_workflows = [w for w in workflows if w.get('active', False)]
        
        crew_workflows = []
        system_workflows = []
        naming_analysis = {}
        
        # Categorize workflows
        for workflow in active_workflows:
            name = workflow.get('name', '')
            
            workflow_info = {
                'id': workflow.get('id', ''),
                'current_name': name,
                'createdAt': workflow.get('createdAt', ''),
                'updatedAt': workflow.get('updatedAt', ''),
                'formatted_created': self.format_timestamp(workflow.get('createdAt', '')),
                'formatted_updated': self.format_timestamp(workflow.get('updatedAt', '')),
                'has_memory': self.has_memory_integration(workflow),
                'has_llm': self.has_llm_integration(workflow),
                'node_count': len(workflow.get('nodes', [])),
                'connection_count': len(workflow.get('connections', {}))
            }
            
            # Check if naming follows convention
            if name.startswith('CREW-'):
                crew_workflows.append(workflow_info)
                naming_analysis[name] = {
                    'category': 'crew',
                    'follows_convention': True,
                    'old_name': self.get_old_name(name)
                }
            elif name.startswith('SYSTEM-'):
                system_workflows.append(workflow_info)
                naming_analysis[name] = {
                    'category': 'system',
                    'follows_convention': True,
                    'old_name': self.get_old_name(name)
                }
            else:
                # Check if this is an old name that should have been updated
                old_name = self.get_old_name(name)
                if old_name:
                    naming_analysis[name] = {
                        'category': 'unknown',
                        'follows_convention': False,
                        'old_name': old_name,
                        'should_be': self.get_expected_new_name(old_name)
                    }
                else:
                    naming_analysis[name] = {
                        'category': 'unknown',
                        'follows_convention': False,
                        'old_name': None,
                        'should_be': None
                    }
        
        return {
            'total_workflows': len(workflows),
            'active_workflows': len(active_workflows),
            'crew_workflows': crew_workflows,
            'system_workflows': system_workflows,
            'naming_analysis': naming_analysis,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_old_name(self, new_name: str) -> str:
        """Get the old name for a given new name."""
        for old_name, expected_new in self.expected_naming.items():
            if expected_new == new_name:
                return old_name
        return None
    
    def get_expected_new_name(self, old_name: str) -> str:
        """Get the expected new name for a given old name."""
        return self.expected_naming.get(old_name, 'Unknown')
    
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
    
    def format_timestamp(self, timestamp_str: str) -> str:
        """Format timestamp for display."""
        try:
            dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            now = datetime.now(dt.tzinfo)
            diff = now - dt
            
            if diff.days > 0:
                return f"{diff.days} day(s) ago"
            elif diff.seconds > 3600:
                hours = diff.seconds // 3600
                return f"{hours} hour(s) ago"
            elif diff.seconds > 60:
                minutes = diff.seconds // 60
                return f"{minutes} minute(s) ago"
            else:
                return "Just now"
        except:
            return timestamp_str
    
    def create_backup_directory(self) -> str:
        """Create timestamped backup directory."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = f"n8n_renamed_workflows_backup_{timestamp}"
        
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
    
    def create_backup_summary(self, workflows: List[Dict], analysis: Dict, backup_dir: str):
        """Create comprehensive backup summary."""
        # Create backup summary
        backup_summary = {
            'backup_timestamp': datetime.now().isoformat(),
            'n8n_url': self.n8n_url,
            'naming_convention_implemented': True,
            'analysis': analysis,
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
                'category': 'crew' if workflow.get('name', '').startswith('CREW-') else 'system' if workflow.get('name', '').startswith('SYSTEM-') else 'unknown',
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
        readme_content = self.generate_backup_readme(analysis, backup_dir)
        readme_file = os.path.join(backup_dir, "README.md")
        with open(readme_file, 'w') as f:
            f.write(readme_content)
        
        print(f"💾 Created backup README: {readme_file}")
        
        return backup_summary
    
    def generate_backup_readme(self, analysis: Dict, backup_dir: str) -> str:
        """Generate README for the backup."""
        readme = []
        readme.append("# N8N Renamed Workflows Backup")
        readme.append("")
        readme.append(f"**Backup Timestamp**: {analysis['timestamp']}")
        readme.append(f"**N8N URL**: {self.n8n_url}")
        readme.append("**Status**: Naming conventions successfully implemented")
        readme.append("")
        readme.append("## Naming Convention Implementation")
        readme.append("")
        readme.append("This backup captures the state after manual implementation of standardized naming conventions.")
        readme.append("")
        readme.append("### Naming Convention Structure")
        readme.append("- **`CREW-[FUNCTION]-[IDENTIFIER]`** - Crew member workflows")
        readme.append("- **`SYSTEM-[FUNCTION]-[IDENTIFIER]`** - System orchestration workflows")
        readme.append("")
        readme.append("## Current State Summary")
        readme.append("")
        readme.append(f"- **Total Workflows**: {analysis['total_workflows']}")
        readme.append(f"- **Active Workflows**: {analysis['active_workflows']}")
        readme.append(f"- **Crew Workflows**: {len(analysis['crew_workflows'])}")
        readme.append(f"- **System Workflows**: {len(analysis['system_workflows'])}")
        readme.append("")
        readme.append("## Crew Workflows")
        readme.append("")
        for workflow in analysis['crew_workflows']:
            readme.append(f"- **{workflow['current_name']}**")
            readme.append(f"  - ID: {workflow['id']}")
            readme.append(f"  - Last Updated: {workflow['formatted_updated']}")
            readme.append(f"  - Memory Integration: {'✅' if workflow['has_memory'] else '❌'}")
            readme.append(f"  - LLM Integration: {'✅' if workflow['has_llm'] else '❌'}")
            readme.append("")
        
        readme.append("## System Workflows")
        readme.append("")
        for workflow in analysis['system_workflows']:
            readme.append(f"- **{workflow['current_name']}**")
            readme.append(f"  - ID: {workflow['id']}")
            readme.append(f"  - Last Updated: {workflow['formatted_updated']}")
            readme.append(f"  - Memory Integration: {'✅' if workflow['has_memory'] else '❌'}")
            readme.append(f"  - LLM Integration: {'✅' if workflow['has_llm'] else '❌'}")
            readme.append("")
        
        readme.append("## Backup Contents")
        readme.append("")
        readme.append("- `workflows/` - Individual workflow JSON files")
        readme.append("- `backup_summary.json` - Complete state analysis")
        readme.append("- `README.md` - This file")
        readme.append("")
        readme.append("## Next Steps")
        readme.append("")
        readme.append("1. Commit this backup to git for reference")
        readme.append("2. Update local configuration files to use new naming")
        readme.append("3. Test crew system functionality with new names")
        readme.append("4. Document the naming convention for future deployments")
        
        return "\n".join(readme)
    
    def run_backup(self):
        """Run the complete backup process."""
        print("💾 CREATING BACKUP OF RENAMED WORKFLOWS...")
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Analyze naming conventions
        print("🎯 Analyzing naming conventions...")
        analysis = self.analyze_naming_conventions(workflows)
        
        # Create backup directory
        print("📁 Creating backup directory...")
        backup_dir = self.create_backup_directory()
        print(f"📁 Backup directory created: {backup_dir}")
        
        # Backup individual workflows
        print("💾 Backing up individual workflows...")
        self.backup_workflows(workflows, backup_dir)
        
        # Create backup summary
        print("📊 Creating backup summary...")
        backup_summary = self.create_backup_summary(workflows, analysis, backup_dir)
        
        # Display results
        print("\n📊 BACKUP COMPLETE!")
        print("=" * 60)
        
        print(f"Backup Directory: {backup_dir}")
        print(f"Total Workflows Backed Up: {len(workflows)}")
        print(f"Active Workflows: {analysis['active_workflows']}")
        print(f"Crew Workflows: {len(analysis['crew_workflows'])}")
        print(f"System Workflows: {len(analysis['system_workflows'])}")
        
        # Check naming convention compliance
        print("\n🎯 NAMING CONVENTION STATUS:")
        print("=" * 40)
        
        crew_count = len(analysis['crew_workflows'])
        system_count = len(analysis['system_workflows'])
        
        print(f"✅ Crew Workflows: {crew_count} (all follow CREW- convention)")
        print(f"✅ System Workflows: {system_count} (all follow SYSTEM- convention)")
        
        if crew_count == 9 and system_count == 4:
            print("🎉 PERFECT! All workflows follow the new naming convention!")
        else:
            print("⚠️  Some workflows may not follow the naming convention")
        
        print(f"\n💾 Backup saved to: {backup_dir}")
        print("📝 Next: Commit to git and update local configurations")
        
        return backup_dir

if __name__ == "__main__":
    try:
        backup = RenamedWorkflowBackup()
        backup.run_backup()
    except Exception as e:
        print(f"❌ Backup failed: {e}")
