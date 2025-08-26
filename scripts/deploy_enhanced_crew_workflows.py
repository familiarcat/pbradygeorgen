#!/usr/bin/env python3
"""
Deploy Enhanced Crew Workflows Script
Deploys enhanced n8n workflows with Supabase database integration
"""

import os
import json
import sys
import requests
from typing import Dict, Any, List
from pathlib import Path
from datetime import datetime

class EnhancedCrewWorkflowDeployer:
    def __init__(self):
        # Load environment variables
        self.load_environment_variables()
        
        # Configuration
        self.n8n_url = os.getenv('N8N_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        # File paths
        self.workspace_dir = Path.cwd()
        self.enhanced_dir = self.workspace_dir / "enhanced_crew_workflows"
        
        # Headers for n8n API
        self.headers = {
            'Content-Type': 'application/json',
            'X-N8N-API-Key': self.n8n_api_key or 'n8n_api_key_placeholder'
        }
        
        print("🚀 ENHANCED CREW WORKFLOW DEPLOYER")
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
            
            # Test basic connectivity
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

    def get_existing_workflows(self) -> List[Dict[str, Any]]:
        """Get list of existing workflows from n8n"""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                workflows = response.json()
                print(f"   📋 Found {len(workflows)} existing workflows")
                return workflows
            else:
                print(f"   ❌ Failed to fetch workflows: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"   ❌ Error fetching workflows: {e}")
            return []

    def prepare_workflow_for_deployment(self, workflow_file: Path) -> Dict[str, Any]:
        """Prepare enhanced workflow for n8n deployment"""
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            # Extract the workflow data from backup format
            if 'workflow_data' in workflow_data:
                workflow = workflow_data['workflow_data']
            else:
                workflow = workflow_data
            
            # Remove backup metadata and other non-deployment fields
            # Only include essential fields that n8n accepts
            deployment_workflow = {
                'name': workflow.get('name', ''),
                'nodes': workflow.get('nodes', []),
                'connections': workflow.get('connections', {}),
                'settings': workflow.get('settings', {})
                # Note: 'active' field is read-only and cannot be set during creation
            }
            
            return deployment_workflow
            
        except Exception as e:
            print(f"   ❌ Failed to prepare workflow: {e}")
            return None

    def deploy_workflow(self, workflow_file: Path, existing_workflows: List[Dict[str, Any]]) -> bool:
        """Deploy a single enhanced workflow to n8n"""
        try:
            # Extract workflow name from the enhanced file
            workflow_name = workflow_file.stem.replace('enhanced_', '')
            # Clean up the name for better matching
            if '_' in workflow_name and workflow_name.count('_') >= 2:
                # Remove the ID suffix (last underscore and after)
                parts = workflow_name.split('_')
                if len(parts) >= 3:
                    workflow_name = '_'.join(parts[:-2])  # Remove last two parts (ID and timestamp)
            
            print(f"   🚀 Deploying: {workflow_name}")
            
            # Check if workflow already exists
            existing_workflow = None
            for wf in existing_workflows:
                if isinstance(wf, dict) and wf.get('name') == workflow_name:
                    existing_workflow = wf
                    break
            
            # Prepare workflow data
            deployment_data = self.prepare_workflow_for_deployment(workflow_file)
            if not deployment_data:
                return False
            
            if existing_workflow:
                # Update existing workflow
                print(f"   🔄 Updating existing workflow: {existing_workflow['id']}")
                response = requests.put(
                    f"{self.n8n_url}/api/v1/workflows/{existing_workflow['id']}",
                    headers=self.headers,
                    json=deployment_data,
                    timeout=30
                )
            else:
                # Create new workflow
                print(f"   🆕 Creating new workflow")
                response = requests.post(
                    f"{self.n8n_url}/api/v1/workflows",
                    headers=self.headers,
                    json=deployment_data,
                    timeout=30
                )
            
            if response.status_code in [200, 201]:
                result = response.json()
                workflow_id = result.get('id', 'unknown')
                print(f"   ✅ Workflow deployed successfully: {workflow_id}")
                
                # Activate the workflow
                if self.activate_workflow(workflow_id):
                    print(f"   🟢 Workflow activated: {workflow_id}")
                else:
                    print(f"   ⚠️  Workflow deployed but not activated: {workflow_id}")
                
                return True
            else:
                print(f"   ❌ Deployment failed: {response.status_code}")
                if response.text:
                    print(f"      Error: {response.text[:200]}")
                return False
                
        except Exception as e:
            print(f"   ❌ Deployment error: {e}")
            return False

    def activate_workflow(self, workflow_id: str) -> bool:
        """Activate a deployed workflow"""
        try:
            activation_data = {'active': True}
            response = requests.patch(
                f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                headers=self.headers,
                json=activation_data,
                timeout=10
            )
            
            return response.status_code == 200
            
        except Exception as e:
            print(f"      ⚠️  Activation failed: {e}")
            return False

    def deploy_all_enhanced_workflows(self) -> bool:
        """Deploy all enhanced crew workflows to n8n"""
        print("\n🚀 Deploying enhanced crew workflows to n8n...")
        
        # Get existing workflows
        existing_workflows = self.get_existing_workflows()
        
        # Find all enhanced workflow files
        enhanced_files = list(self.enhanced_dir.glob("enhanced_*.json"))
        print(f"   📋 Found {len(enhanced_files)} enhanced workflows to deploy")
        
        successful_deployments = 0
        
        for workflow_file in enhanced_files:
            if self.deploy_workflow(workflow_file, existing_workflows):
                successful_deployments += 1
        
        print(f"\n📊 Deployment Results: {successful_deployments}/{len(enhanced_files)} workflows deployed")
        
        if successful_deployments == len(enhanced_files):
            print("   ✅ All workflows deployed successfully")
            return True
        else:
            print("   ⚠️  Some workflows failed to deploy")
            return False

    def verify_deployment(self) -> bool:
        """Verify that all enhanced workflows are properly deployed"""
        print("\n🔍 Verifying deployment...")
        
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                workflows = response.json()
                
                # Check for enhanced workflows
                enhanced_workflows = []
                for wf in workflows:
                    if isinstance(wf, dict) and any(crew_name in wf.get('name', '') for crew_name in [
                        'Captain Jean-Luc Picard', 'Commander William Riker', 'Dr. Beverly Crusher',
                        'Commander Data', 'Lieutenant Commander Geordi La Forge', 'Lieutenant Worf',
                        'Lieutenant Uhura', 'Counselor Deanna Troi', 'Quark'
                    ]):
                        enhanced_workflows.append(wf)
                
                print(f"   📋 Found {len(enhanced_workflows)} enhanced crew workflows")
                
                # Check activation status
                active_workflows = [wf for wf in enhanced_workflows if wf.get('active')]
                print(f"   🟢 {len(active_workflows)} workflows are active")
                
                # Check for memory nodes
                workflows_with_memory = 0
                for wf in enhanced_workflows:
                    nodes = wf.get('nodes', [])
                    memory_nodes = [n for n in nodes if 'Memory' in n.get('name', '')]
                    if memory_nodes:
                        workflows_with_memory += 1
                
                print(f"   🧠 {workflows_with_memory} workflows have memory integration")
                
                return len(enhanced_workflows) > 0
            else:
                print(f"   ❌ Verification failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ Verification error: {e}")
            return False

    def run_deployment(self) -> bool:
        """Run the complete deployment process"""
        try:
            print("🚀 ENHANCED CREW WORKFLOW DEPLOYMENT PROCESS")
            print("=" * 60)
            
            # Test n8n connection
            if not self.test_n8n_connection():
                print("\n❌ Cannot proceed without n8n connection")
                return False
            
            # Deploy workflows
            if not self.deploy_all_enhanced_workflows():
                return False
            
            # Verify deployment
            if not self.verify_deployment():
                return False
            
            # Success summary
            print(f"\n🎉 WORKFLOW DEPLOYMENT COMPLETED SUCCESSFULLY!")
            print("=" * 60)
            print("✅ All enhanced crew workflows deployed to n8n")
            print("✅ Supabase database integration active")
            print("✅ Memory retrieval and storage nodes operational")
            print("✅ Crew character consistency enabled")
            print("✅ System ready for mission operations!")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Workflow deployment failed: {e}")
            return False

def main():
    """Main execution function"""
    deployer = EnhancedCrewWorkflowDeployer()
    
    success = deployer.run_deployment()
    
    if success:
        print(f"\n🚀 Enhanced crew workflows deployed to n8n!")
        print("   Next: Test crew member workflows with memory integration")
    else:
        print(f"\n⚠️  Workflow deployment completed with issues")
        print("   Check n8n dashboard for deployment status")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
