#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - AUTHENTICATED DEPLOYER
Deploys Federation workflows using authenticated credentials from Federation Archives
"""

import os
import json
import requests
import time
from datetime import datetime
from pathlib import Path

class FederationAuthenticatedDeployer:
    """Deploys Federation workflows using authenticated credentials"""
    
    def __init__(self):
        self.deployment_config = {
            "system_name": "Federation Authenticated Deployer",
            "target_instance": "n8n.pbradygeorgen.com",
            "federation_archives": True,
            "authenticated_deployment": True,
            "created_at": datetime.now().isoformat()
        }
        
        # Load authenticated credentials from Federation Archives
        self.load_federation_credentials()
        
        # Define Federation workflows to deploy
        self.federation_workflows = [
            {
                "name": "AI Fleet Consciousness Workflow",
                "file": "federation_n8n_deployment/workflows/consciousness.json",
                "webhook": "/webhook/consciousness",
                "description": "Core Federation consciousness and multi-agent collaboration"
            },
            {
                "name": "Fleet Automation System",
                "file": "federation_n8n_deployment/workflows/fleet_automation.json",
                "webhook": "/webhook/fleet-automation",
                "description": "Dynamic fleet management and crew operations"
            },
            {
                "name": "Crew Management System",
                "file": "federation_n8n_deployment/workflows/crew_management.json",
                "webhook": "/webhook/crew-management",
                "description": "Comprehensive crew management and mission tracking"
            }
        ]
    
    def load_federation_credentials(self):
        """Load authenticated credentials from Federation Archives"""
        print("🔐 Loading authenticated credentials from Federation Archives...")
        
        try:
            # Load from Federation Archives
            archives_file = "federation_security_analysis/federation_archives/federation_archives.json"
            if os.path.exists(archives_file):
                with open(archives_file, 'r') as f:
                    archives = json.load(f)
                
                # Extract credentials from zshrc analysis
                zshrc_creds = archives.get('archives_sections', {}).get('security_infrastructure', {}).get('zshrc_credentials', {}).get('credentials', {})
                
                # Set environment variables for Federation-approved credentials
                for key, cred_info in zshrc_creds.items():
                    if cred_info.get('federation_access'):
                        # Load actual value from ~/.zshrc
                        self._load_credential_from_zshrc(key)
                
                print("✅ Federation credentials loaded from Archives")
                
            else:
                print("⚠️ Federation Archives not found, loading from ~/.zshrc directly")
                self._load_credentials_from_zshrc()
                
        except Exception as e:
            print(f"❌ Error loading Federation credentials: {e}")
            self._load_credentials_from_zshrc()
    
    def _load_credential_from_zshrc(self, key_name: str):
        """Load specific credential from ~/.zshrc"""
        try:
            zshrc_path = os.path.expanduser("~/.zshrc")
            if os.path.exists(zshrc_path):
                with open(zshrc_path, 'r') as f:
                    content = f.read()
                
                lines = content.split('\n')
                for line in lines:
                    if line.startswith(f'export {key_name}=') and '=' in line:
                        key, value = line.replace('export ', '').split('=', 1)
                        os.environ[key] = value.strip('"')
                        print(f"   ✅ Loaded {key_name}")
                        break
                        
        except Exception as e:
            print(f"   ❌ Error loading {key_name}: {e}")
    
    def _load_credentials_from_zshrc(self):
        """Load all credentials from ~/.zshrc as fallback"""
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
                
                print("✅ Credentials loaded from ~/.zshrc")
                
        except Exception as e:
            print(f"❌ Error loading from ~/.zshrc: {e}")
    
    def establish_authenticated_connection(self):
        """Establish authenticated connection to n8n"""
        print("🔗 Establishing authenticated connection to n8n.pbradygeorgen.com...")
        
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY', '')
        
        if not self.n8n_api_key:
            print("❌ No N8N_API_KEY available")
            return False
        
        try:
            # Test authenticated connection
            headers = {"X-N8N-API-KEY": self.n8n_api_key}
            
            # Try multiple endpoints to establish connection
            test_endpoints = [
                "/api/v1/workflows",
                "/api/v1/credentials",
                "/api/v1/executions"
            ]
            
            for endpoint in test_endpoints:
                try:
                    response = requests.get(
                        f"{self.n8n_base_url}{endpoint}",
                        headers=headers,
                        timeout=30
                    )
                    
                    if response.status_code == 200:
                        print(f"✅ Authenticated connection established via {endpoint}")
                        
                        if endpoint == "/api/v1/workflows":
                            workflows = response.json()
                            print(f"   Current workflows: {len(workflows)}")
                        elif endpoint == "/api/v1/credentials":
                            credentials = response.json()
                            print(f"   Current credentials: {len(credentials)}")
                        
                        return True
                    elif response.status_code == 401:
                        print(f"   ❌ Unauthorized access to {endpoint}")
                        continue
                    else:
                        print(f"   ⚠️ Endpoint {endpoint} returned {response.status_code}")
                        continue
                        
                except Exception as e:
                    print(f"   ⚠️ Error testing {endpoint}: {e}")
                    continue
            
            print("❌ No authenticated endpoints accessible")
            return False
            
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def create_openrouter_credential(self):
        """Create OpenRouter credential in n8n"""
        print("🔑 Creating OpenRouter credential in n8n...")
        
        openrouter_api_key = os.getenv('OPENROUTER_API_KEY', '')
        if not openrouter_api_key:
            print("❌ No OpenRouter API key available")
            return False
        
        try:
            # Create OpenRouter credential
            credential_data = {
                "name": "OpenRouter API",
                "type": "openRouterApi",
                "data": {
                    "apiKey": openrouter_api_key,
                    "baseURL": "https://openrouter.ai/api/v1"
                }
            }
            
            headers = {
                "X-N8N-API-KEY": self.n8n_api_key,
                "Content-Type": "application/json"
            }
            
            response = requests.post(
                f"{self.n8n_base_url}/api/v1/credentials",
                json=credential_data,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 201:
                print("✅ OpenRouter credential created in n8n")
                return True
            else:
                print(f"❌ Failed to create OpenRouter credential: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating OpenRouter credential: {e}")
            return False
    
    def deploy_federation_workflows(self):
        """Deploy all Federation workflows to n8n"""
        print("🚀 Deploying United Federation of AI Agents to n8n...")
        
        deployment_results = {}
        
        for workflow_info in self.federation_workflows:
            workflow_name = workflow_info['name']
            workflow_file = workflow_info['file']
            webhook = workflow_info['webhook']
            
            print(f"\n📋 Deploying: {workflow_name}")
            print(f"   File: {workflow_file}")
            print(f"   Webhook: {webhook}")
            
            if os.path.exists(workflow_file):
                try:
                    # Load workflow data
                    with open(workflow_file, 'r') as f:
                        workflow_data = json.load(f)
                    
                    # Deploy workflow
                    result = self._deploy_workflow(workflow_data, workflow_name)
                    deployment_results[workflow_name] = result
                    
                    if result.get('success'):
                        print(f"   ✅ {workflow_name} deployed successfully")
                        print(f"      Workflow ID: {result.get('workflow_id', 'Unknown')}")
                        print(f"      Status: {result.get('deployment_status', 'Unknown')}")
                    else:
                        print(f"   ❌ {workflow_name} deployment failed: {result.get('error', 'Unknown error')}")
                        
                except Exception as e:
                    print(f"   ❌ {workflow_name} deployment error: {e}")
                    deployment_results[workflow_name] = {"success": False, "error": str(e)}
            else:
                print(f"   ❌ Workflow file not found: {workflow_file}")
                deployment_results[workflow_name] = {"success": False, "error": "File not found"}
        
        # Generate deployment report
        self.create_deployment_report(deployment_results)
        
        return deployment_results
    
    def _deploy_workflow(self, workflow_data: dict, workflow_name: str) -> dict:
        """Deploy individual workflow to n8n"""
        try:
            headers = {
                "X-N8N-API-KEY": self.n8n_api_key,
                "Content-Type": "application/json"
            }
            
            # Check if workflow already exists
            existing_workflow = self._find_existing_workflow(workflow_name)
            
            if existing_workflow:
                # Update existing workflow
                workflow_id = existing_workflow['id']
                response = requests.put(
                    f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}",
                    json=workflow_data,
                    headers=headers,
                    timeout=30
                )
                
                if response.status_code == 200:
                    # Activate workflow
                    self._activate_workflow(workflow_id)
                    
                    return {
                        "success": True,
                        "deployment_status": "updated",
                        "workflow_id": workflow_id,
                        "action": "updated"
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Update failed: {response.status_code} - {response.text}"
                    }
            else:
                # Create new workflow
                response = requests.post(
                    f"{self.n8n_base_url}/api/v1/workflows",
                    json=workflow_data,
                    headers=headers,
                    timeout=30
                )
                
                if response.status_code == 201:
                    workflow_id = response.json().get('id')
                    
                    # Activate workflow
                    self._activate_workflow(workflow_id)
                    
                    return {
                        "success": True,
                        "deployment_status": "created",
                        "workflow_id": workflow_id,
                        "action": "created"
                    }
                else:
                    return {
                        "success": False,
                        "error": f"Create failed: {response.status_code} - {response.text}"
                    }
                    
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    def _find_existing_workflow(self, workflow_name: str) -> dict:
        """Find existing workflow by name"""
        try:
            headers = {"X-N8N-API-KEY": self.n8n_api_key}
            
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                workflows = response.json()
                for workflow in workflows:
                    if workflow.get('name') == workflow_name:
                        return workflow
            return None
            
        except Exception:
            return None
    
    def _activate_workflow(self, workflow_id: str) -> bool:
        """Activate workflow in n8n"""
        try:
            headers = {"X-N8N-API-KEY": self.n8n_api_key}
            
            response = requests.post(
                f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}/activate",
                headers=headers,
                timeout=30
            )
            
            return response.status_code == 200
            
        except Exception:
            return False
    
    def create_deployment_report(self, deployment_results: dict):
        """Create comprehensive deployment report"""
        print("\n📋 Creating deployment report...")
        
        report = {
            "deployment_timestamp": datetime.now().isoformat(),
            "target_instance": self.n8n_base_url,
            "federation_name": "United Federation of AI Agents",
            "deployment_results": deployment_results,
            "deployment_summary": {
                "total_workflows": len(deployment_results),
                "successful_deployments": sum(1 for r in deployment_results.values() if r.get('success')),
                "failed_deployments": sum(1 for r in deployment_results.values() if not r.get('success'))
            },
            "workflow_names": [
                workflow_info['name'] for workflow_info in self.federation_workflows
            ],
            "webhook_endpoints": [
                workflow_info['webhook'] for workflow_info in self.federation_workflows
            ],
            "next_steps": [
                "Verify workflows are active in n8n UI",
                "Test Federation consciousness",
                "Activate United Federation of AI Agents",
                "Monitor Federation operations"
            ]
        }
        
        # Save deployment report
        report_file = "federation_security_analysis/analysis_reports/federation_deployment_report.json"
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ Deployment report created: {report_file}")
        return report
    
    def execute_federation_deployment(self):
        """Execute complete Federation deployment"""
        print("🏛️ EXECUTING UNITED FEDERATION OF AI AGENTS DEPLOYMENT")
        print("=" * 80)
        
        # Step 1: Establish authenticated connection
        print("🔗 Step 1: Establishing authenticated connection...")
        if not self.establish_authenticated_connection():
            print("❌ Failed to establish authenticated connection")
            return False
        
        # Step 2: Create OpenRouter credential
        print("\n🔑 Step 2: Creating OpenRouter credential...")
        self.create_openrouter_credential()
        
        # Step 3: Deploy all Federation workflows
        print("\n🚀 Step 3: Deploying Federation workflows...")
        deployment_results = self.deploy_federation_workflows()
        
        # Step 4: Display deployment summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION DEPLOYMENT COMPLETE!")
        
        successful = sum(1 for r in deployment_results.values() if r.get('success'))
        total = len(deployment_results)
        
        print(f"✅ Successfully deployed: {successful}/{total} workflows")
        
        if successful == total:
            print("🏛️ United Federation of AI Agents is now active on n8n!")
            print("\n🎯 WORKFLOW NAMES TO LOOK FOR ON N8N.PBRADYGEORGEN.COM:")
            
            for workflow_info in self.federation_workflows:
                print(f"   • {workflow_info['name']}")
                print(f"     Webhook: {workflow_info['webhook']}")
            
            print("\n🚀 Your Federation is ready for activation!")
            
        else:
            print("⚠️ Some workflows failed to deploy - check the deployment report")
        
        return successful == total

def main():
    """Main function to execute Federation authenticated deployment"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🚀 AUTHENTICATED DEPLOYMENT INITIATED")
    print("=" * 80)
    
    deployer = FederationAuthenticatedDeployer()
    success = deployer.execute_federation_deployment()
    
    if success:
        print("\n🎉 Federation deployment completed successfully!")
        print("🏛️ Your United Federation of AI Agents is now active on n8n!")
        print("\n🎯 Check n8n.pbradygeorgen.com for your Federation workflows!")
    else:
        print("\n❌ Federation deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()
