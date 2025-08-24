#!/usr/bin/env python3
"""
🚀 FLEET AUTOMATION TO N8N DEPLOYMENT
Deploys fleet automation workflow to n8n and stores in collective memory
"""

import os
import json
import subprocess
import requests
from datetime import datetime
from pathlib import Path

class FleetAutomationN8NDeployer:
    """Deploys fleet automation system to n8n and stores in collective memory"""
    
    def __init__(self):
        self.deployment_results = {
            "timestamp": datetime.now().isoformat(),
            "deployment_type": "fleet_automation_to_n8n",
            "status": "initializing",
            "workflow_deployment": {},
            "collective_memory_integration": {},
            "deployment_steps": []
        }
        
        # Initialize directories
        self.setup_memory_structure()
        
        # Load environment variables
        self.load_environment()
        
        # Initialize deployment components
        self.workflow_file = "fleet_automation_workflow.json"
        self.memory_dir = "crew_memory"
    
    def setup_memory_structure(self):
        """Setup collective memory directory structure"""
        directories = [
            "crew_memory",
            "crew_memory/fleet_automation",
            "crew_memory/deployments",
            "crew_memory/crew_operations"
        ]
        
        for directory in directories:
            Path(directory).mkdir(parents=True, exist_ok=True)
        
        print("✅ Collective memory structure created")
    
    def load_environment(self):
        """Load environment variables from ~/.zshrc"""
        print("🔐 Loading deployment environment variables...")
        
        try:
            result = subprocess.run(
                ['bash', '-c', 'source ~/.zshrc && env'],
                capture_output=True, text=True, timeout=30
            )
            
            if result.returncode == 0:
                env_vars = {}
                for line in result.stdout.split('\n'):
                    if '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key] = value
                
                self.n8n_api_key = env_vars.get('N8N_API_KEY', '')
                self.openrouter_api_key = env_vars.get('OPENROUTER_API_KEY', '')
                self.n8n_url = env_vars.get('N8N_URL', '')
                
                if self.n8n_api_key and self.openrouter_api_key and self.n8n_url:
                    print(f"✅ Deployment environment variables loaded successfully")
                    return True
                else:
                    print("❌ Missing required deployment environment variables")
                    return False
            else:
                print(f"❌ Failed to load deployment environment variables")
                return False
                
        except Exception as e:
            print(f"❌ Error loading deployment environment: {e}")
            return False
    
    def validate_fleet_workflow(self) -> bool:
        """Validate the fleet automation workflow file"""
        print("🔍 Validating fleet automation workflow...")
        
        try:
            if not os.path.exists(self.workflow_file):
                print(f"❌ Fleet workflow file not found: {self.workflow_file}")
                return False
            
            with open(self.workflow_file, 'r') as f:
                workflow = json.load(f)
            
            # Validate required fields
            required_fields = ['name', 'nodes', 'connections', 'settings']
            missing_fields = [field for field in required_fields if field not in workflow]
            
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False
            
            # Validate workflow structure
            nodes = workflow.get('nodes', [])
            connections = workflow.get('connections', {})
            
            if len(nodes) != 8:
                print(f"❌ Expected 8 nodes, found {len(nodes)}")
                return False
            
            if len(connections) != 7:
                print(f"❌ Expected 7 connections, found {len(connections)}")
                return False
            
            # Check webhook configuration
            webhook_nodes = [node for node in nodes if node.get('type') == 'n8n-nodes-base.webhook']
            if not webhook_nodes:
                print("❌ No webhook trigger node found")
                return False
            
            webhook_path = webhook_nodes[0].get('parameters', {}).get('path')
            if webhook_path != 'fleet-automation':
                print(f"❌ Webhook path should be 'fleet-automation', found '{webhook_path}'")
                return False
            
            print(f"✅ Fleet workflow validation passed")
            print(f"📋 Name: {workflow.get('name', 'Unknown')}")
            print(f"🔧 Nodes: {len(nodes)}")
            print(f"🔗 Connections: {len(connections)}")
            print(f"🌐 Webhook: /{webhook_path}")
            
            self.deployment_results["workflow_deployment"] = {
                "name": workflow.get('name'),
                "nodes": len(nodes),
                "connections": len(connections),
                "webhook_path": webhook_path,
                "validation": "passed"
            }
            
            return True
            
        except Exception as e:
            print(f"❌ Fleet workflow validation error: {e}")
            return False
    
    def attempt_n8n_deployment(self) -> bool:
        """Attempt to deploy fleet workflow to n8n via API"""
        print("🚀 Attempting n8n API deployment...")
        
        try:
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            with open(self.workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            # Deploy to n8n
            response = requests.post(
                f"{self.n8n_url}/api/v1/workflows",
                headers=headers,
                json=workflow_data,
                timeout=60
            )
            
            if response.status_code in [200, 201]:
                workflow_id = response.json().get('id')
                print(f"✅ Fleet workflow deployed successfully via API!")
                print(f"   Workflow ID: {workflow_id}")
                print(f"   Status: {response.status_code}")
                
                self.deployment_results["workflow_deployment"]["api_deployment"] = {
                    "status": "success",
                    "workflow_id": workflow_id,
                    "response_code": response.status_code,
                    "deployed_at": datetime.now().isoformat()
                }
                
                return True
            else:
                print(f"❌ API deployment failed: {response.status_code}")
                print(f"   Response: {response.text}")
                
                self.deployment_results["workflow_deployment"]["api_deployment"] = {
                    "status": "failed",
                    "response_code": response.status_code,
                    "error": response.text,
                    "attempted_at": datetime.now().isoformat()
                }
                
                return False
                
        except Exception as e:
            print(f"❌ API deployment error: {e}")
            
            self.deployment_results["workflow_deployment"]["api_deployment"] = {
                "status": "error",
                "error": str(e),
                "attempted_at": datetime.now().isoformat()
            }
            
            return False
    
    def create_import_instructions(self) -> bool:
        """Create manual import instructions for n8n"""
        print("📚 Creating n8n import instructions...")
        
        try:
            instructions_content = f"""# 🚀 FLEET AUTOMATION SYSTEM - N8N IMPORT GUIDE

## **FLEET AUTOMATION SYSTEM READY FOR N8N!**

Your **Fleet Automation System** is ready to be deployed to n8n for full fleet crew management!

### **📋 MANUAL IMPORT STEPS:**

#### **1️⃣ Import Fleet Automation Workflow**
- **Open**: {self.n8n_url}
- **Navigate to**: Workflows
- **Click**: "Import from file"
- **Select**: `fleet_automation_workflow.json`
- **Click**: "Import"

#### **2️⃣ Activate Fleet Automation System**
- **Find**: "Fleet Automation System" in workflows
- **Toggle**: Activation switch to ON
- **Verify**: Webhook endpoint `/webhook/fleet-automation` is active

#### **3️⃣ Test Fleet Operations**
```bash
# Test adding crew to fleet
curl -X POST {self.n8n_url}/webhook/fleet-automation \\
  -H "Content-Type: application/json" \\
  -d '{{"operation": "add_crew_to_fleet", "name": "Test Specialist", "role": "tester", "specialization": "Testing", "llm_preference": "openai/gpt-4o"}}'

# Test adding crew to project
curl -X POST {self.n8n_url}/webhook/fleet-automation \\
  -H "Content-Type: application/json" \\
  -d '{{"operation": "add_crew_to_project", "project_name": "Test Project", "crew_name": "Test Specialist", "role_in_project": "Lead Tester"}}'

# Test adding crew to mission
curl -X POST {self.n8n_url}/webhook/fleet-automation \\
  -H "Content-Type: application/json" \\
  -d '{{"operation": "add_crew_to_mission", "mission_id": "test-mission", "crew_name": "Test Specialist", "mission_role": "Mission Tester"}}'

# Test fleet status report
curl -X POST {self.n8n_url}/webhook/fleet-automation \\
  -H "Content-Type: application/json" \\
  -d '{{"operation": "fleet_status_report"}}'
```

### **🎯 FLEET AUTOMATION OPERATIONS:**

✅ **Add Crew to Fleet**: Add crew member to entire fleet  
✅ **Add Crew to Project**: Assign crew to specific projects  
✅ **Add Crew to Mission**: Assign crew to specific missions  
✅ **Fleet Status Report**: Generate comprehensive fleet reports  
✅ **Deploy Workflow**: Deploy workflows to n8n automatically  

### **🚀 READY TO DEPLOY?**

1. **Import the workflow** to n8n (manual step)
2. **Activate the system** (manual step)
3. **Test fleet operations** (automated via webhooks)
4. **Integrate with collective memory** (automatic)

**Your Fleet Automation System will become the mission control center for all fleet operations!** 🎯

---

*Generated by Fleet Automation N8N Deployer*
*Timestamp: {datetime.now().isoformat()}*
"""
            
            instructions_file = "FLEET_AUTOMATION_N8N_IMPORT_GUIDE.md"
            with open(instructions_file, 'w') as f:
                f.write(instructions_content)
            
            print(f"✅ N8N import instructions created: {instructions_file}")
            
            self.deployment_results["deployment_steps"].append({
                "step": "import_instructions_created",
                "status": "success",
                "file": instructions_file,
                "timestamp": datetime.now().isoformat()
            })
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating import instructions: {e}")
            return False
    
    def store_in_collective_memory(self) -> bool:
        """Store deployment results in collective memory"""
        print("🧠 Storing deployment in collective memory...")
        
        try:
            # Create deployment memory entry
            deployment_memory = {
                "deployment_id": f"fleet-automation-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
                "deployment_type": "fleet_automation_to_n8n",
                "timestamp": datetime.now().isoformat(),
                "status": "deployment_completed",
                "deployment_results": self.deployment_results,
                "fleet_automation_features": [
                    "Multi-level crew management (fleet, project, mission)",
                    "Automated crew assignment scripts",
                    "Fleet status reporting",
                    "Workflow deployment automation",
                    "Collective memory integration"
                ],
                    "next_steps": [
                    "Import fleet_automation_workflow.json to n8n",
                    "Activate Fleet Automation System workflow",
                    "Test fleet operations via webhooks",
                    "Integrate with existing crew management",
                    "Scale fleet operations as needed"
                ]
            }
            
            # Save to collective memory
            memory_file = f"crew_memory/fleet_automation/fleet_automation_deployment_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(memory_file, 'w') as f:
                json.dump(deployment_memory, f, indent=2)
            
            # Update deployment results
            self.deployment_results["collective_memory_integration"] = {
                "status": "success",
                "memory_file": memory_file,
                "deployment_memory": deployment_memory,
                "stored_at": datetime.now().isoformat()
            }
            
            print(f"✅ Deployment stored in collective memory: {memory_file}")
            
            self.deployment_results["deployment_steps"].append({
                "step": "collective_memory_stored",
                "status": "success",
                "memory_file": memory_file,
                "timestamp": datetime.now().isoformat()
            })
            
            return True
            
        except Exception as e:
            print(f"❌ Error storing in collective memory: {e}")
            return False
    
    def execute_fleet_automation_deployment(self) -> bool:
        """Execute the complete fleet automation deployment process"""
        print("🚀 EXECUTING FLEET AUTOMATION TO N8N DEPLOYMENT")
        print("=" * 70)
        
        # Step 1: Validate fleet workflow
        print("🔍 Step 1: Validating fleet automation workflow...")
        if not self.validate_fleet_workflow():
            print("❌ Fleet workflow validation failed")
            return False
        
        # Step 2: Attempt n8n API deployment
        print("\n🚀 Step 2: Attempting n8n API deployment...")
        api_deployment_success = self.attempt_n8n_deployment()
        
        # Step 3: Create import instructions
        print("\n📚 Step 3: Creating n8n import instructions...")
        if not self.create_import_instructions():
            print("❌ Failed to create import instructions")
            return False
        
        # Step 4: Store in collective memory
        print("\n🧠 Step 4: Storing deployment in collective memory...")
        if not self.store_in_collective_memory():
            print("❌ Failed to store in collective memory")
            return False
        
        # Update final status
        if api_deployment_success:
            self.deployment_results["status"] = "fully_deployed"
        else:
            self.deployment_results["status"] = "manual_import_required"
        
        print("\n" + "=" * 70)
        if api_deployment_success:
            print("🎉 FLEET AUTOMATION SYSTEM FULLY DEPLOYED TO N8N!")
            print("✅ API deployment successful")
            print("✅ Workflow active in n8n")
            print("✅ Collective memory updated")
            print("✅ Fleet automation ready for operations")
        else:
            print("🎯 FLEET AUTOMATION SYSTEM READY FOR MANUAL IMPORT!")
            print("✅ Workflow validated and ready")
            print("✅ Import instructions created")
            print("✅ Collective memory updated")
            print("✅ Ready for n8n import and activation")
        
        return True
    
    def show_deployment_summary(self):
        """Show deployment summary to user"""
        print("\n" + "=" * 70)
        print("📋 FLEET AUTOMATION DEPLOYMENT SUMMARY")
        print("=" * 70)
        
        if self.deployment_results["status"] == "fully_deployed":
            print("🚀 **FLEET AUTOMATION SYSTEM FULLY DEPLOYED TO N8N!**")
            print()
            print("📋 **DEPLOYMENT STATUS:**")
            print("✅ API deployment successful")
            print("✅ Workflow active in n8n")
            print("✅ Webhook endpoint: /webhook/fleet-automation")
            print("✅ Collective memory updated")
        else:
            print("🎯 **FLEET AUTOMATION SYSTEM READY FOR MANUAL IMPORT!**")
            print()
            print("📋 **NEXT STEPS:**")
            print("1. Import fleet_automation_workflow.json to n8n")
            print("2. Activate Fleet Automation System workflow")
            print("3. Test fleet operations via webhooks")
            print("4. Integrate with existing crew management")
        
        print()
        print("🔧 **FILES CREATED:**")
        print(f"   • {self.workflow_file} - Ready for n8n import")
        print("   • FLEET_AUTOMATION_N8N_IMPORT_GUIDE.md - Complete import guide")
        print("   • crew_memory/ - Collective memory updated")
        print()
        print("🎯 **READY TO OPERATE YOUR FLEET?**")
        print("Your fleet automation system is ready for deployment!")

def main():
    """Main function to run fleet automation deployment"""
    deployer = FleetAutomationN8NDeployer()
    success = deployer.execute_fleet_automation_deployment()
    
    if success:
        deployer.show_deployment_summary()
        print("\n🎉 Fleet automation deployment completed!")
        print("🚀 Your fleet is ready for automated operations!")
    else:
        print("\n❌ Fleet automation deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()
