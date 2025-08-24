#!/usr/bin/env python3
"""
Automated N8N Deployment Script for AlexAI Optimized Crew
Handles OpenRouter credentials and workflow deployment automatically
"""

import os
import json
import requests
import time
from pathlib import Path
from typing import Dict, List, Optional

class AutomatedN8NDeployer:
    def __init__(self):
        # Load environment variables from ~/.zshrc
        self.load_environment_variables()
        
        # Initialize n8n connection
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
        
        if not all([self.n8n_url, self.n8n_api_key, self.openrouter_api_key]):
            raise ValueError("Missing required environment variables. Please check ~/.zshrc")
        
        self.headers = {
            'Authorization': f'Bearer {self.n8n_api_key}',
            'Content-Type': 'application/json'
        }
        
        print(f"🚀 Initialized deployment to: {self.n8n_url}")
        print(f"🔑 Using OpenRouter API key: {self.openrouter_api_key[:20]}...")
    
    def load_environment_variables(self):
        """Load environment variables from ~/.zshrc"""
        print("📋 Loading environment variables from ~/.zshrc...")
        
        # Read ~/.zshrc and extract export statements
        zshrc_path = os.path.expanduser("~/.zshrc")
        if os.path.exists(zshrc_path):
            with open(zshrc_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('export ') and '=' in line:
                        # Parse export KEY="VALUE" or export KEY='VALUE'
                        parts = line.split('=', 1)
                        if len(parts) == 2:
                            key = parts[0].replace('export ', '').strip()
                            value = parts[1].strip()
                            
                            # Remove quotes if present
                            if (value.startswith('"') and value.endswith('"')) or \
                               (value.startswith("'") and value.endswith("'")):
                                value = value[1:-1]
                            
                            os.environ[key] = value
                            print(f"✅ Loaded: {key}")
        else:
            print("❌ ~/.zshrc not found")
            return
        
        print("✅ Environment variables loaded successfully")
    
    def test_n8n_connection(self) -> bool:
        """Test connection to n8n instance"""
        print("🔍 Testing n8n connection...")
        
        try:
            # Try different health endpoints
            endpoints = ['/api/health', '/api/v1/health', '/health']
            
            for endpoint in endpoints:
                try:
                    response = requests.get(f"{self.n8n_url}{endpoint}", headers=self.headers, timeout=10)
                    if response.status_code == 200:
                        print(f"✅ Successfully connected to n8n via {endpoint}")
                        self.health_endpoint = endpoint
                        return True
                except requests.exceptions.RequestException:
                    continue
            
            print("❌ Failed to connect to n8n via any endpoint")
            return False
            
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return False
    
    def create_openrouter_credential(self) -> Optional[str]:
        """Create OpenRouter credential in n8n"""
        print("🔐 Creating OpenRouter credential...")
        
        try:
            # First, check if credential already exists
            credentials_response = requests.get(
                f"{self.n8n_url}/api/v1/credentials",
                headers=self.headers,
                timeout=10
            )
            
            if credentials_response.status_code == 200:
                existing_creds = credentials_response.json()
                for cred in existing_creds:
                    if cred.get('name') == 'OpenRouter API':
                        print("✅ OpenRouter credential already exists")
                        return cred.get('id')
            
            # Create new OpenRouter credential
            credential_payload = {
                "name": "OpenRouter API",
                "type": "openAi",
                "data": {
                    "apiKey": self.openrouter_api_key,
                    "baseURL": "https://openrouter.ai/api/v1"
                }
            }
            
            response = requests.post(
                f"{self.n8n_url}/api/v1/credentials",
                headers=self.headers,
                json=credential_payload,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                credential_id = response.json().get('id')
                print(f"✅ OpenRouter credential created with ID: {credential_id}")
                return credential_id
            else:
                print(f"❌ Failed to create credential: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error creating credential: {e}")
            return None
    
    def deploy_workflow(self, workflow_file: Path, openrouter_credential_id: str) -> Optional[str]:
        """Deploy a single workflow to n8n"""
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            # Prepare workflow for n8n import
            workflow_payload = {
                "name": workflow_data.get("name", "Unknown Workflow"),
                "active": False,  # Start inactive for safety
                "nodes": self.prepare_workflow_nodes(workflow_data, openrouter_credential_id),
                "connections": self.generate_connections(workflow_data),
                "settings": {
                    "executionOrder": "v1"
                }
            }
            
            # Import workflow to n8n
            response = requests.post(
                f"{self.n8n_url}/api/v1/workflows",
                headers=self.headers,
                json=workflow_payload,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                workflow_id = response.json().get('id')
                print(f"✅ Deployed workflow: {workflow_data.get('name')} (ID: {workflow_id})")
                return workflow_id
            else:
                print(f"❌ Failed to deploy {workflow_data.get('name')}: {response.status_code}")
                print(f"Response: {response.text}")
                return None
                
        except Exception as e:
            print(f"❌ Error deploying {workflow_file}: {e}")
            return None
    
    def prepare_workflow_nodes(self, workflow_data: Dict, credential_id: str) -> List[Dict]:
        """Prepare workflow nodes with proper OpenRouter configuration"""
        nodes = workflow_data.get("workflow_nodes", [])
        prepared_nodes = []
        
        for node in nodes:
            prepared_node = node.copy()
            
            # Configure OpenRouter nodes
            if node.get("type") == "n8n-nodes-base.openAi":
                prepared_node["parameters"] = prepared_node.get("parameters", {}).copy()
                prepared_node["parameters"]["authentication"] = credential_id
                
                # Set proper OpenRouter configuration
                if "baseURL" not in prepared_node["parameters"]:
                    prepared_node["parameters"]["baseURL"] = "https://openrouter.ai/api/v1"
                
                # Map models to OpenRouter format
                model_mapping = {
                    "gpt-4o-mini": "openai/gpt-4o-mini",
                    "gpt-4o": "openai/gpt-4o",
                    "claude-3-haiku": "anthropic/claude-3-haiku",
                    "claude-3-sonnet": "anthropic/claude-3-sonnet",
                    "gpt-3.5-turbo": "openai/gpt-3.5-turbo"
                }
                
                current_model = prepared_node["parameters"].get("model", "")
                if current_model in model_mapping:
                    prepared_node["parameters"]["model"] = model_mapping[current_model]
            
            prepared_nodes.append(prepared_node)
        
        return prepared_nodes
    
    def generate_connections(self, workflow_data: Dict) -> Dict:
        """Generate connections between workflow nodes"""
        nodes = workflow_data.get("workflow_nodes", [])
        connections = {}
        
        if len(nodes) >= 2:
            # Create simple linear connections
            for i in range(len(nodes) - 1):
                source_node = nodes[i]["id"]
                target_node = nodes[i + 1]["id"]
                
                if source_node not in connections:
                    connections[source_node] = {}
                
                connections[source_node]["main"] = [
                    [
                        {
                            "node": target_node,
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
        
        return connections
    
    def deploy_all_workflows(self, openrouter_credential_id: str) -> List[Dict]:
        """Deploy all workflows from the workflows directory"""
        workflows_path = Path("n8n_workflows")
        workflow_files = list(workflows_path.glob("*.json"))
        
        print(f"🔧 Found {len(workflow_files)} workflow files to deploy")
        
        deployed_workflows = []
        for workflow_file in workflow_files:
            print(f"\n🚀 Deploying {workflow_file.name}...")
            workflow_id = self.deploy_workflow(workflow_file, openrouter_credential_id)
            if workflow_id:
                deployed_workflows.append({
                    "file": workflow_file.name,
                    "id": workflow_id,
                    "name": workflow_file.stem
                })
                time.sleep(1)  # Small delay between deployments
            else:
                print(f"⚠️  Skipping {workflow_file.name} due to deployment failure")
        
        return deployed_workflows
    
    def activate_workflows(self, workflow_ids: List[str]) -> bool:
        """Activate all deployed workflows"""
        print("\n🔌 Activating workflows...")
        
        activated_count = 0
        for workflow_id in workflow_ids:
            try:
                # Get current workflow
                response = requests.get(
                    f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                    headers=self.headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    workflow = response.json()
                    workflow["active"] = True
                    
                    # Update workflow to activate it
                    update_response = requests.put(
                        f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                        headers=self.headers,
                        json=workflow,
                        timeout=10
                    )
                    
                    if update_response.status_code == 200:
                        print(f"✅ Activated workflow ID: {workflow_id}")
                        activated_count += 1
                    else:
                        print(f"❌ Failed to activate workflow ID: {workflow_id}")
                
                time.sleep(0.5)  # Small delay
                
            except Exception as e:
                print(f"❌ Error activating workflow {workflow_id}: {e}")
        
        print(f"✅ Activated {activated_count}/{len(workflow_ids)} workflows")
        return activated_count == len(workflow_ids)
    
    def test_crew_member(self, workflow_id: str, crew_name: str) -> bool:
        """Test a crew member workflow with a simple execution"""
        print(f"🧪 Testing {crew_name} workflow...")
        
        try:
            # Execute workflow manually
            execution_payload = {
                "startNodes": ["mission_input"],  # Default start node
                "pinData": {
                    "mission_input": [
                        {
                            "json": {
                                "mission_description": f"Test mission for {crew_name}",
                                "test_mode": True
                            }
                        }
                    ]
                }
            }
            
            response = requests.post(
                f"{self.n8n_url}/api/v1/workflows/{workflow_id}/execute",
                headers=self.headers,
                json=execution_payload,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ {crew_name} workflow executed successfully")
                return True
            else:
                print(f"❌ {crew_name} workflow execution failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error testing {crew_name}: {e}")
            return False
    
    def deploy(self):
        """Main deployment process"""
        print("🚀 ALEXAI OPTIMIZED CREW N8N AUTOMATED DEPLOYMENT")
        print("=" * 60)
        
        # Test connection
        if not self.test_n8n_connection():
            print("❌ Cannot proceed without n8n connection")
            return False
        
        # Create OpenRouter credential
        openrouter_credential_id = self.create_openrouter_credential()
        if not openrouter_credential_id:
            print("❌ Cannot proceed without OpenRouter credential")
            return False
        
        # Deploy all workflows
        print("\n🚀 Starting workflow deployment...")
        deployed_workflows = self.deploy_all_workflows(openrouter_credential_id)
        
        if not deployed_workflows:
            print("❌ No workflows were deployed successfully")
            return False
        
        print(f"\n📊 Deployment Summary:")
        print(f"  • Total workflows: {len(deployed_workflows)}")
        print(f"  • Successfully deployed: {len(deployed_workflows)}")
        
        # Activate workflows
        workflow_ids = [w["id"] for w in deployed_workflows]
        activation_success = self.activate_workflows(workflow_ids)
        
        # Test crew members
        print("\n🧪 Testing crew member workflows...")
        test_results = []
        for workflow in deployed_workflows:
            success = self.test_crew_member(workflow["id"], workflow["name"])
            test_results.append({"name": workflow["name"], "success": success})
        
        # Final summary
        print("\n🎉 DEPLOYMENT COMPLETE!")
        print("=" * 40)
        print(f"✅ Deployed: {len(deployed_workflows)} workflows")
        print(f"✅ Activated: {len(workflow_ids)} workflows")
        print(f"✅ Tested: {sum(1 for r in test_results if r['success'])}/{len(test_results)} crew members")
        
        print("\n🚀 Your optimized AlexAI crew is now live in n8n!")
        print(f"🌐 Access at: {self.n8n_url}")
        print("\n📋 Next steps:")
        print("1. Verify all workflows are visible in n8n UI")
        print("2. Test crew member collaboration workflows")
        print("3. Monitor cost optimization and performance")
        print("4. Scale crew operations as needed")
        
        return True

def main():
    try:
        deployer = AutomatedN8NDeployer()
        success = deployer.deploy()
        
        if success:
            print("\n🎯 Deployment successful! Your crew is ready for action.")
        else:
            print("\n❌ Deployment failed. Check the logs above for details.")
            
    except Exception as e:
        print(f"\n💥 Deployment error: {e}")
        print("Please check your environment variables and n8n configuration.")

if __name__ == "__main__":
    main()
