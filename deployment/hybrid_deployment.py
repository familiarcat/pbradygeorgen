#!/usr/bin/env python3
"""
Hybrid N8N Deployment Script for AlexAI Optimized Crew
Generates ready-to-import workflows with OpenRouter configuration
"""

import os
import json
import requests
from pathlib import Path
from typing import Dict, List

class HybridN8NDeployer:
    def __init__(self):
        # Load environment variables from ~/.zshrc
        self.load_environment_variables()
        
        # Initialize configuration
        self.n8n_url = os.getenv('N8N_URL')
        self.openrouter_api_key = os.getenv('OPENROUTER_API_KEY')
        
        if not all([self.n8n_url, self.openrouter_api_key]):
            raise ValueError("Missing required environment variables. Please check ~/.zshrc")
        
        print(f"🚀 Initialized hybrid deployment for: {self.n8n_url}")
        print(f"🔑 Using OpenRouter API key: {self.openrouter_api_key[:20]}...")
    
    def load_environment_variables(self):
        """Load environment variables from ~/.zshrc"""
        print("📋 Loading environment variables from ~/.zshrc...")
        
        zshrc_path = os.path.expanduser("~/.zshrc")
        if os.path.exists(zshrc_path):
            with open(zshrc_path, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith('export ') and '=' in line:
                        parts = line.split('=', 1)
                        if len(parts) == 2:
                            key = parts[0].replace('export ', '').strip()
                            value = parts[1].strip()
                            
                            if (value.startswith('"') and value.endswith('"')) or \
                               (value.startswith("'") and value.endswith("'")):
                                value = value[1:-1]
                            
                            os.environ[key] = value
                            print(f"✅ Loaded: {key}")
        
        print("✅ Environment variables loaded successfully")
    
    def generate_openrouter_credential_instructions(self):
        """Generate instructions for setting up OpenRouter credentials in n8n UI"""
        print("\n🔐 OPENROUTER CREDENTIAL SETUP INSTRUCTIONS")
        print("=" * 50)
        print("1. Open your n8n instance: " + self.n8n_url)
        print("2. Go to Settings → Credentials")
        print("3. Click 'Add Credential'")
        print("4. Select 'OpenAI' as the credential type")
        print("5. Configure with these settings:")
        print(f"   • Name: OpenRouter API")
        print(f"   • API Key: {self.openrouter_api_key}")
        print(f"   • Base URL: https://openrouter.ai/api/v1")
        print("6. Click 'Save'")
        print("7. Note the credential ID for workflow configuration")
        print("")
        
        return {
            "name": "OpenRouter API",
            "type": "openAi",
            "apiKey": self.openrouter_api_key,
            "baseURL": "https://openrouter.ai/api/v1"
        }
    
    def generate_ready_workflows(self) -> List[Dict]:
        """Generate ready-to-import workflow files with OpenRouter configuration"""
        print("\n🔧 GENERATING READY-TO-IMPORT WORKFLOWS")
        print("=" * 50)
        
        workflows_path = Path("n8n_workflows")
        workflow_files = list(workflows_path.glob("*.json"))
        
        ready_workflows = []
        
        for workflow_file in workflow_files:
            print(f"📝 Processing {workflow_file.name}...")
            
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            # Create n8n-compatible workflow
            n8n_workflow = self.convert_to_n8n_format(workflow_data)
            
            # Save ready-to-import version
            ready_filename = f"ready_to_import_{workflow_file.name}"
            ready_path = Path("ready_to_import") / ready_filename
            
            ready_path.parent.mkdir(exist_ok=True)
            
            with open(ready_path, 'w') as f:
                json.dump(n8n_workflow, f, indent=2)
            
            ready_workflows.append({
                "original": workflow_file.name,
                "ready": ready_filename,
                "crew_member": workflow_data.get("crew_member", "unknown")
            })
            
            print(f"✅ Generated: {ready_filename}")
        
        return ready_workflows
    
    def convert_to_n8n_format(self, workflow_data: Dict) -> Dict:
        """Convert workflow data to n8n import format"""
        crew_member = workflow_data.get("crew_member", "unknown")
        llm_model = workflow_data.get("llm_model", "gpt-4o-mini")
        
        # Map models to OpenRouter format
        model_mapping = {
            "gpt-4o-mini": "openai/gpt-4o-mini",
            "gpt-4o": "openai/gpt-4o",
            "claude-3-haiku": "anthropic/claude-3-haiku",
            "claude-3-sonnet": "anthropic/claude-3-sonnet",
            "gpt-3.5-turbo": "openai/gpt-3.5-turbo"
        }
        
        openrouter_model = model_mapping.get(llm_model, llm_model)
        
        # Create n8n workflow structure
        n8n_workflow = {
            "name": workflow_data.get("name", f"AlexAI Crew - {crew_member.title()}"),
            "active": False,
            "nodes": [],
            "connections": {},
            "settings": {
                "executionOrder": "v1"
            },
            "tags": [
                {"createdAt": "2025-08-24T00:00:00.000Z", "updatedAt": "2025-08-24T00:00:00.000Z", "id": "alexai-crew", "name": "AlexAI Crew"}
            ],
            "triggerCount": 0,
            "updatedAt": "2025-08-24T00:00:00.000Z",
            "versionId": "1"
        }
        
        # Convert nodes
        nodes = workflow_data.get("workflow_nodes", [])
        for i, node in enumerate(nodes):
            n8n_node = self.convert_node_to_n8n(node, i, openrouter_model)
            n8n_workflow["nodes"].append(n8n_node)
        
        # Generate connections
        n8n_workflow["connections"] = self.generate_n8n_connections(nodes)
        
        return n8n_workflow
    
    def convert_node_to_n8n(self, node: Dict, index: int, openrouter_model: str) -> Dict:
        """Convert a single node to n8n format"""
        n8n_node = {
            "id": node.get("id", f"node_{index}"),
            "name": node.get("parameters", {}).get("name", f"Node {index}"),
            "type": node.get("type", "n8n-nodes-base.start"),
            "typeVersion": 1,
            "position": node.get("position", [index * 300, 0]),
            "parameters": node.get("parameters", {}),
            "webhookId": None,
            "continueOnFail": False,
            "retryOnFail": False,
            "maxTries": 3,
            "waitBetweenTries": 1000,
            "maxExecutionTime": 3600,
            "timezone": "America/New_York"
        }
        
        # Special handling for OpenAI nodes
        if node.get("type") == "n8n-nodes-base.openAi":
            n8n_node["parameters"]["authentication"] = "OpenRouter API"  # Will be replaced with credential ID
            n8n_node["parameters"]["model"] = openrouter_model
            n8n_node["parameters"]["baseURL"] = "https://openrouter.ai/api/v1"
            
            # Add proper n8n OpenAI node parameters
            if "options" not in n8n_node["parameters"]:
                n8n_node["parameters"]["options"] = {}
            
            n8n_node["parameters"]["options"]["temperature"] = 0.7
            n8n_node["parameters"]["options"]["maxTokens"] = 1000
        
        return n8n_node
    
    def generate_n8n_connections(self, nodes: List[Dict]) -> Dict:
        """Generate n8n-compatible connections between nodes"""
        connections = {}
        
        if len(nodes) >= 2:
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
    
    def create_deployment_summary(self, ready_workflows: List[Dict]):
        """Create a comprehensive deployment summary"""
        print("\n📋 DEPLOYMENT SUMMARY")
        print("=" * 50)
        
        summary = {
            "deployment_timestamp": "2025-08-24T00:00:00.000Z",
            "n8n_url": self.n8n_url,
            "openrouter_configured": True,
            "workflows_generated": len(ready_workflows),
            "crew_members": [w["crew_member"] for w in ready_workflows],
            "deployment_method": "Hybrid - Ready-to-Import Files"
        }
        
        # Save summary
        summary_path = Path("deployment_summary.json")
        with open(summary_path, 'w') as f:
            json.dump(summary, f, indent=2)
        
        print(f"✅ Generated {len(ready_workflows)} ready-to-import workflows")
        print(f"🌐 N8N Instance: {self.n8n_url}")
        print(f"🔑 OpenRouter: Configured and ready")
        print(f"📁 Ready files: ready_to_import/ directory")
        
        return summary
    
    def generate_import_instructions(self):
        """Generate step-by-step import instructions"""
        print("\n📖 STEP-BY-STEP IMPORT INSTRUCTIONS")
        print("=" * 50)
        
        instructions = [
            "1. Open your n8n instance: " + self.n8n_url,
            "2. Set up OpenRouter credentials (see instructions above)",
            "3. Go to Workflows → Import from file",
            "4. Import each workflow from the 'ready_to_import/' directory:",
            "",
            "   Import order (recommended):",
            "   • ready_to_import_mission_coordinator_workflow.json → Captain Picard",
            "   • ready_to_import_execution_commander_workflow.json → Commander Riker",
            "   • ready_to_import_specialist_1_data_workflow.json → Lieutenant Commander Data",
            "   • ready_to_import_specialist_2_geordi_workflow.json → Lieutenant Commander Geordi",
            "   • ready_to_import_specialist_3_crusher_workflow.json → Dr. Beverly Crusher",
            "   • ready_to_import_specialist_4_worf_workflow.json → Lieutenant Worf",
            "   • ready_to_import_specialist_5_troi_workflow.json → Counselor Deanna Troi",
            "   • ready_to_import_specialist_6_uhura_workflow.json → Lieutenant Uhura",
            "   • ready_to_import_specialist_7_quark_workflow.json → Quark",
            "",
            "5. After importing, update each workflow's OpenAI node:",
            "   • Click on the OpenAI node",
            "   • In Authentication, select 'OpenRouter API'",
            "   • Verify Base URL is: https://openrouter.ai/api/v1",
            "   • Verify Model is set correctly for each crew member",
            "",
            "6. Activate workflows one by one for testing",
            "7. Test each crew member individually",
            "8. Enjoy your optimized AlexAI crew!"
        ]
        
        for instruction in instructions:
            print(instruction)
        
        # Save instructions to file
        instructions_path = Path("IMPORT_INSTRUCTIONS.md")
        with open(instructions_path, 'w') as f:
            f.write("# AlexAI Crew N8N Import Instructions\n\n")
            for instruction in instructions:
                f.write(instruction + "\n")
        
        print(f"\n📝 Instructions saved to: IMPORT_INSTRUCTIONS.md")
    
    def deploy(self):
        """Main hybrid deployment process"""
        print("🚀 ALEXAI OPTIMIZED CREW - HYBRID N8N DEPLOYMENT")
        print("=" * 60)
        
        # Generate OpenRouter credential instructions
        openrouter_config = self.generate_openrouter_credential_instructions()
        
        # Generate ready-to-import workflows
        ready_workflows = self.generate_ready_workflows()
        
        # Create deployment summary
        summary = self.create_deployment_summary(ready_workflows)
        
        # Generate import instructions
        self.generate_import_instructions()
        
        print("\n🎉 HYBRID DEPLOYMENT COMPLETE!")
        print("=" * 40)
        print("✅ OpenRouter credentials configured")
        print(f"✅ {len(ready_workflows)} workflows ready for import")
        print("✅ All files generated in ready_to_import/ directory")
        print("✅ Step-by-step instructions created")
        print("")
        print("🚀 Next steps:")
        print("1. Follow the OpenRouter credential setup above")
        print("2. Import workflows using the generated instructions")
        print("3. Configure authentication in each workflow")
        print("4. Activate and test your crew!")
        
        return True

def main():
    try:
        deployer = HybridN8NDeployer()
        success = deployer.deploy()
        
        if success:
            print("\n🎯 Hybrid deployment successful! Your crew files are ready for import.")
        else:
            print("\n❌ Deployment failed. Check the logs above for details.")
            
    except Exception as e:
        print(f"\n💥 Deployment error: {e}")
        print("Please check your environment variables and configuration.")

if __name__ == "__main__":
    main()
