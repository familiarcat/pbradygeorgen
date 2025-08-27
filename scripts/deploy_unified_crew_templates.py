#!/usr/bin/env python3
"""
Deploy Unified Crew Templates Script
Deploys the unified crew templates to the n8n instance.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime

class UnifiedCrewTemplateDeployer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Load crew configuration
        self.crew_config = self.load_crew_config()
        
    def load_crew_config(self) -> Dict:
        """Load the crew configuration."""
        try:
            with open('config/n8n_optimized_crew_config.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Failed to load crew configuration: {e}")
            return {}
    
    def load_unified_templates(self, template_dir: str) -> Dict[str, Dict]:
        """Load all unified templates from the directory."""
        templates = {}
        
        if not os.path.exists(template_dir):
            print(f"❌ Template directory not found: {template_dir}")
            return templates
        
        for filename in os.listdir(template_dir):
            if filename.endswith('_unified_template.json'):
                crew_id = filename.replace('_unified_template.json', '')
                filepath = os.path.join(template_dir, filename)
                
                try:
                    with open(filepath, 'r') as f:
                        template = json.load(f)
                    templates[crew_id] = template
                    print(f"📋 Loaded template: {crew_id}")
                except Exception as e:
                    print(f"❌ Failed to load template {filename}: {e}")
        
        return templates
    
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
    
    def find_workflow_by_name(self, workflows: List[Dict], name: str) -> Dict:
        """Find a workflow by name."""
        for workflow in workflows:
            if workflow.get('name') == name:
                return workflow
        return {}
    
    def prepare_workflow_for_deployment(self, template: Dict) -> Dict:
        """Prepare a template for deployment by removing non-essential fields."""
        deployment_workflow = template.copy()
        
        # Remove fields that cause deployment issues
        fields_to_remove = ['id', 'createdAt', 'updatedAt', 'versionId', 'triggerCount', 'staticData', 'meta', 'pinData', 'tags']
        
        for field in fields_to_remove:
            if field in deployment_workflow:
                del deployment_workflow[field]
        
        # Don't set active - let n8n handle it
        if 'active' in deployment_workflow:
            del deployment_workflow['active']
        
        # Keep only essential workflow fields
        essential_fields = ['name', 'nodes', 'connections', 'settings']
        cleaned_workflow = {}
        
        for field in essential_fields:
            if field in deployment_workflow:
                cleaned_workflow[field] = deployment_workflow[field]
        
        return cleaned_workflow
    
    def deploy_workflow(self, template: Dict, crew_id: str) -> bool:
        """Deploy a single workflow template."""
        try:
            # Prepare workflow for deployment
            deployment_workflow = self.prepare_workflow_for_deployment(template)
            
            # Deploy workflow
            response = requests.post(f"{self.n8n_url}/api/v1/workflows", 
                                  headers=self.headers,
                                  json=deployment_workflow)
            
            if response.status_code == 201:
                deployed_workflow = response.json()
                print(f"✅ Deployed {crew_id}: {deployed_workflow.get('name', '')}")
                return True
            else:
                print(f"❌ Failed to deploy {crew_id}: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Deployment error for {crew_id}: {e}")
            return False
    
    def update_existing_workflow(self, template: Dict, existing_workflow: Dict, crew_id: str) -> bool:
        """Update an existing workflow with the unified template."""
        try:
            # Prepare workflow for update
            update_workflow = self.prepare_workflow_for_deployment(template)
            
            # Keep the existing ID
            workflow_id = existing_workflow.get('id')
            if not workflow_id:
                print(f"❌ No ID found for existing workflow: {crew_id}")
                return False
            
            # Update workflow
            response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                                 headers=self.headers,
                                 json=update_workflow)
            
            if response.status_code == 200:
                print(f"✅ Updated {crew_id}: {existing_workflow.get('name', '')}")
                return True
            else:
                print(f"❌ Failed to update {crew_id}: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Update error for {crew_id}: {e}")
            return False
    
    def backup_current_workflows(self, workflows: List[Dict]) -> str:
        """Create a backup of current workflows before deployment."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = f"pre_unification_backup_{timestamp}"
        
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        # Save individual workflows
        for workflow in workflows:
            workflow_id = workflow.get('id', 'unknown')
            workflow_name = workflow.get('name', 'unnamed').replace('/', '_').replace('\\', '_')
            
            filename = f"{workflow_id}_{workflow_name}.json"
            filepath = os.path.join(backup_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(workflow, f, indent=2)
        
        # Create backup summary
        backup_summary = {
            'backup_timestamp': datetime.now().isoformat(),
            'total_workflows': len(workflows),
            'crew_workflows': [w for w in workflows if w.get('name', '').startswith('Crew -')],
            'system_workflows': [w for w in workflows if w.get('name', '').startswith('System -')],
            'backup_reason': 'Pre-unification backup before deploying unified templates'
        }
        
        summary_file = os.path.join(backup_dir, "backup_summary.json")
        with open(summary_file, 'w') as f:
            json.dump(backup_summary, f, indent=2)
        
        print(f"💾 Created backup: {backup_dir}")
        return backup_dir
    
    def deploy_unified_templates(self, templates: Dict[str, Dict], deployment_strategy: str = 'replace') -> Dict:
        """Deploy all unified templates."""
        deployment_results = {
            'total_templates': len(templates),
            'deployed': 0,
            'updated': 0,
            'failed': 0,
            'details': []
        }
        
        # Fetch current workflows
        print("📡 Fetching current workflows...")
        current_workflows = self.fetch_current_workflows()
        
        if not current_workflows:
            print("❌ No current workflows found")
            return deployment_results
        
        print(f"📋 Found {len(current_workflows)} current workflows")
        
        # Create backup before deployment
        print("💾 Creating backup of current workflows...")
        backup_dir = self.backup_current_workflows(current_workflows)
        
        # Deploy each template
        print(f"\n🚀 Deploying unified templates (Strategy: {deployment_strategy})...")
        
        for crew_id, template in templates.items():
            crew_name = template.get('name', 'Unknown')
            print(f"\n🔧 Processing {crew_id}: {crew_name}")
            
            # Check if workflow already exists
            existing_workflow = self.find_workflow_by_name(current_workflows, crew_name)
            
            if existing_workflow and deployment_strategy == 'update':
                # Update existing workflow
                success = self.update_existing_workflow(template, existing_workflow, crew_id)
                if success:
                    deployment_results['updated'] += 1
                    deployment_results['details'].append({
                        'crew_id': crew_id,
                        'action': 'updated',
                        'workflow_id': existing_workflow.get('id', ''),
                        'status': 'success'
                    })
                else:
                    deployment_results['failed'] += 1
                    deployment_results['details'].append({
                        'crew_id': crew_id,
                        'action': 'update_failed',
                        'workflow_id': existing_workflow.get('id', ''),
                        'status': 'failed'
                    })
            
            elif existing_workflow and deployment_strategy == 'replace':
                # Replace existing workflow (delete and recreate)
                print(f"  🔄 Replacing existing workflow...")
                
                # Delete existing workflow
                try:
                    delete_response = requests.delete(f"{self.n8n_url}/api/v1/workflows/{existing_workflow.get('id')}",
                                                   headers=self.headers)
                    if delete_response.status_code == 200:
                        print(f"  ✅ Deleted existing workflow")
                    else:
                        print(f"  ⚠️  Failed to delete existing workflow: {delete_response.status_code}")
                except Exception as e:
                    print(f"  ⚠️  Error deleting existing workflow: {e}")
                
                # Deploy new workflow
                success = self.deploy_workflow(template, crew_id)
                if success:
                    deployment_results['deployed'] += 1
                    deployment_results['details'].append({
                        'crew_id': crew_id,
                        'action': 'replaced',
                        'workflow_id': 'new',
                        'status': 'success'
                    })
                else:
                    deployment_results['failed'] += 1
                    deployment_results['details'].append({
                        'crew_id': crew_id,
                        'action': 'replace_failed',
                        'workflow_id': 'failed',
                        'status': 'failed'
                    })
            
            else:
                # Deploy new workflow
                success = self.deploy_workflow(template, crew_id)
                if success:
                    deployment_results['deployed'] += 1
                    deployment_results['details'].append({
                        'crew_id': crew_id,
                        'action': 'deployed',
                        'workflow_id': 'new',
                        'status': 'success'
                    })
                else:
                    deployment_results['failed'] += 1
                    deployment_results['details'].append({
                        'crew_id': crew_id,
                        'action': 'deploy_failed',
                        'workflow_id': 'failed',
                        'status': 'failed'
                    })
        
        # Add backup information
        deployment_results['backup_directory'] = backup_dir
        deployment_results['deployment_timestamp'] = datetime.now().isoformat()
        
        return deployment_results
    
    def generate_deployment_report(self, results: Dict, template_dir: str) -> str:
        """Generate a comprehensive deployment report."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"unified_template_deployment_report_{timestamp}.json"
        
        # Save detailed report
        with open(report_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Display summary
        print("\n📊 DEPLOYMENT RESULTS SUMMARY")
        print("=" * 60)
        
        print(f"📋 Total Templates: {results['total_templates']}")
        print(f"✅ Successfully Deployed: {results['deployed']}")
        print(f"🔄 Successfully Updated: {results['updated']}")
        print(f"❌ Failed: {results['failed']}")
        print(f"💾 Backup Created: {results['backup_directory']}")
        
        if results['failed'] > 0:
            print(f"\n⚠️  Failed Deployments:")
            for detail in results['details']:
                if detail['status'] == 'failed':
                    print(f"   - {detail['crew_id']}: {detail['action']}")
        
        print(f"\n💾 Deployment report saved: {report_file}")
        
        return report_file
    
    def run_deployment(self, template_dir: str, deployment_strategy: str = 'replace'):
        """Run the complete deployment process."""
        print("🚀 DEPLOYING UNIFIED CREW TEMPLATES...")
        print("=" * 70)
        
        # Load templates
        print("📋 Loading unified templates...")
        templates = self.load_unified_templates(template_dir)
        
        if not templates:
            print("❌ No templates found")
            return
        
        print(f"✅ Loaded {len(templates)} templates")
        
        # Deploy templates
        print(f"\n🚀 Starting deployment (Strategy: {deployment_strategy})...")
        results = self.deploy_unified_templates(templates, deployment_strategy)
        
        # Generate report
        print("\n📝 Generating deployment report...")
        report_file = self.generate_deployment_report(results, template_dir)
        
        # Final status
        if results['failed'] == 0:
            print("\n🎉 DEPLOYMENT COMPLETE - ALL TEMPLATES SUCCESSFULLY DEPLOYED!")
            print("Next: Activate workflows and test functionality")
        else:
            print(f"\n⚠️  DEPLOYMENT COMPLETE WITH {results['failed']} FAILURES")
            print("Review the deployment report for details")
        
        return results

if __name__ == "__main__":
    import sys
    
    # Get template directory from command line or use latest
    if len(sys.argv) > 1:
        template_dir = sys.argv[1]
    else:
        # Find the latest template directory
        import glob
        template_dirs = glob.glob("unified_crew_templates_*")
        if template_dirs:
            template_dir = max(template_dirs, key=os.path.getctime)
        else:
            print("❌ No template directory found. Please specify one.")
            sys.exit(1)
    
    # Get deployment strategy
    strategy = 'replace'  # Default to replace strategy
    if len(sys.argv) > 2:
        strategy = sys.argv[2]
    
    try:
        deployer = UnifiedCrewTemplateDeployer()
        deployer.run_deployment(template_dir, strategy)
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
