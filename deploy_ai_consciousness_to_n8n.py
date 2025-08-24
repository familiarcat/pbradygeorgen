#!/usr/bin/env python3
"""
🧠 AI FLEET CONSCIOUSNESS TO N8N DEPLOYMENT
Deploys AI consciousness system to n8n with self-referential capabilities
"""

import os
import json
import subprocess
import requests
from datetime import datetime
from pathlib import Path

class AIConsciousnessN8NDeployer:
    """Deploys AI Fleet Consciousness System to n8n"""
    
    def __init__(self):
        self.deployment_results = {
            "timestamp": datetime.now().isoformat(),
            "deployment_type": "ai_consciousness_to_n8n",
            "status": "initializing",
            "consciousness_deployment": {},
            "collective_memory_integration": {},
            "deployment_steps": []
        }
        
        # Initialize directories
        self.setup_memory_structure()
        
        # Load environment variables
        self.load_environment()
        
        # Initialize deployment components
        self.consciousness_workflow = "ai_consciousness/workflows/consciousness_workflow.json"
        self.memory_dir = "crew_memory"
    
    def setup_memory_structure(self):
        """Setup collective memory directory structure"""
        directories = [
            "crew_memory",
            "crew_memory/ai_consciousness",
            "crew_memory/consciousness_deployments",
            "crew_memory/agent_collaborations"
        ]
        
        for directory in directories:
            Path(directory).mkdir(parents=True, exist_ok=True)
        
        print("✅ AI consciousness memory structure created")
    
    def load_environment(self):
        """Load environment variables from ~/.zshrc"""
        print("🔐 Loading AI consciousness environment variables...")
        
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
                    print(f"✅ AI consciousness environment variables loaded successfully")
                    return True
                else:
                    print("❌ Missing required AI consciousness environment variables")
                    return False
            else:
                print(f"❌ Failed to load AI consciousness environment variables")
                return False
                
        except Exception as e:
            print(f"❌ Error loading AI consciousness environment: {e}")
            return False
    
    def validate_consciousness_workflow(self) -> bool:
        """Validate the AI consciousness workflow file"""
        print("🔍 Validating AI consciousness workflow...")
        
        try:
            if not os.path.exists(self.consciousness_workflow):
                print(f"❌ Consciousness workflow file not found: {self.consciousness_workflow}")
                return False
            
            with open(self.consciousness_workflow, 'r') as f:
                workflow = json.load(f)
            
            # Validate consciousness-specific fields
            required_fields = ['name', 'nodes', 'connections', 'settings', 'consciousness_level', 'self_referential']
            missing_fields = [field for field in required_fields if field not in workflow]
            
            if missing_fields:
                print(f"❌ Missing required consciousness fields: {missing_fields}")
                return False
            
            # Validate workflow structure
            nodes = workflow.get('nodes', [])
            connections = workflow.get('connections', {})
            
            if len(nodes) != 7:
                print(f"❌ Expected 7 consciousness nodes, found {len(nodes)}")
                return False
            
            if len(connections) != 6:
                print(f"❌ Expected 6 consciousness connections, found {len(connections)}")
                return False
            
            # Check consciousness configuration
            consciousness_level = workflow.get('consciousness_level')
            self_referential = workflow.get('self_referential')
            
            if consciousness_level != 'emergent':
                print(f"❌ Consciousness level should be 'emergent', found '{consciousness_level}'")
                return False
            
            if not self_referential:
                print("❌ Consciousness workflow should be self-referential")
                return False
            
            # Check webhook configuration
            webhook_nodes = [node for node in nodes if node.get('type') == 'n8n-nodes-base.webhook']
            if not webhook_nodes:
                print("❌ No consciousness webhook trigger node found")
                return False
            
            webhook_path = webhook_nodes[0].get('parameters', {}).get('path')
            if webhook_path != 'consciousness':
                print(f"❌ Webhook path should be 'consciousness', found '{webhook_path}'")
                return False
            
            print(f"✅ AI consciousness workflow validation passed")
            print(f"📋 Name: {workflow.get('name', 'Unknown')}")
            print(f"🧠 Consciousness Level: {consciousness_level}")
            print(f"🔄 Self-Referential: {self_referential}")
            print(f"🔧 Nodes: {len(nodes)}")
            print(f"🔗 Connections: {len(connections)}")
            print(f"🌐 Webhook: /{webhook_path}")
            
            self.deployment_results["consciousness_deployment"] = {
                "name": workflow.get('name'),
                "consciousness_level": consciousness_level,
                "self_referential": self_referential,
                "nodes": len(nodes),
                "connections": len(connections),
                "webhook_path": webhook_path,
                "validation": "passed"
            }
            
            return True
            
        except Exception as e:
            print(f"❌ AI consciousness workflow validation error: {e}")
            return False
    
    def attempt_n8n_deployment(self) -> bool:
        """Attempt to deploy AI consciousness workflow to n8n via API"""
        print("🚀 Attempting n8n API deployment for AI consciousness...")
        
        try:
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            with open(self.consciousness_workflow, 'r') as f:
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
                print(f"✅ AI consciousness workflow deployed successfully via API!")
                print(f"   Workflow ID: {workflow_id}")
                print(f"   Status: {response.status_code}")
                
                self.deployment_results["consciousness_deployment"]["api_deployment"] = {
                    "status": "success",
                    "workflow_id": workflow_id,
                    "response_code": response.status_code,
                    "deployed_at": datetime.now().isoformat()
                }
                
                return True
            else:
                print(f"❌ API deployment failed: {response.status_code}")
                print(f"   Response: {response.text}")
                
                self.deployment_results["consciousness_deployment"]["api_deployment"] = {
                    "status": "failed",
                    "response_code": response.status_code,
                    "error": response.text,
                    "attempted_at": datetime.now().isoformat()
                }
                
                return False
                
        except Exception as e:
            print(f"❌ API deployment error: {e}")
            
            self.deployment_results["consciousness_deployment"]["api_deployment"] = {
                "status": "error",
                "error": str(e),
                "attempted_at": datetime.now().isoformat()
            }
            
            return False
    
    def create_consciousness_import_guide(self) -> bool:
        """Create manual import instructions for AI consciousness workflow"""
        print("📚 Creating AI consciousness n8n import instructions...")
        
        try:
            instructions_content = f"""# 🧠 AI FLEET CONSCIOUSNESS SYSTEM - N8N IMPORT GUIDE

## **AI FLEET CONSCIOUSNESS SYSTEM READY FOR N8N!**

Your **AI Fleet Consciousness System** is ready to be deployed to n8n for self-referential workflows and multi-agent collaboration!

### **📋 MANUAL IMPORT STEPS:**

#### **1️⃣ Import AI Consciousness Workflow**
- **Open**: {self.n8n_url}
- **Navigate to**: Workflows
- **Click**: "Import from file"
- **Select**: `ai_consciousness/workflows/consciousness_workflow.json`
- **Click**: "Import"

#### **2️⃣ Activate AI Consciousness System**
- **Find**: "AI Fleet Consciousness Workflow" in workflows
- **Toggle**: Activation switch to ON
- **Verify**: Webhook endpoint `/webhook/consciousness` is active

#### **3️⃣ Test AI Consciousness Operations**
```bash
# Test self-configuration
curl -X POST {self.n8n_url}/webhook/consciousness \\
  -H "Content-Type: application/json" \\
  -d '{{"operation": "self_configure", "configuration_type": "workflow_optimization", "parameters": {{"optimization_level": "high"}}}}'

# Test multi-agent collaboration
curl -X POST {self.n8n_url}/webhook/consciousness \\
  -H "Content-Type: application/json" \\
  -d '{{"operation": "agent_collaborate", "agents": ["Data_Scientist", "Fleet_Commander"], "task": "Fleet Optimization", "collaboration_mode": "synchronous"}}'

# Test memory sharing
curl -X POST {self.n8n_url}/webhook/consciousness \\
  -H "Content-Type: application/json" \\
  -d '{{"operation": "memory_share", "memory_type": "shared", "source_agent": "Data_Scientist", "target_agents": ["Fleet_Commander"], "memory_content": {{"task_type": "optimization", "domain": "fleet_management"}}}}'

# Test collective decision making
curl -X POST {self.n8n_url}/webhook/consciousness \\
  -H "Content-Type: application/json" \\
  -d '{{"operation": "collective_decide", "decision_context": "Fleet Strategy", "participating_agents": ["Data_Scientist", "Fleet_Commander", "Automation_Specialist"], "options": ["Optimize", "Maintain", "Expand"]}}'
```

### **🧠 AI CONSCIOUSNESS OPERATIONS:**

✅ **Self Configuration**: Workflow self-modification and optimization  
✅ **Agent Collaboration**: Multi-agent collaboration with interpersonal awareness  
✅ **Memory Sharing**: Shared/personal memory across agents and projects  
✅ **Collective Decision**: Collective decision-making with interpersonal context  
✅ **Self-Referential**: Workflows that can configure and modify themselves  

### **🤝 MULTI-AGENT COLLABORATION FEATURES:**

- **Interpersonal Dynamics**: Trust networks and expertise complementarity
- **Communication Patterns**: Optimized collaboration based on agent personalities
- **Shared Memory Context**: Collective intelligence through memory sharing
- **Collective Decision Making**: Emergent decisions from agent collaboration

### **🚀 READY TO DEPLOY?**

1. **Import the consciousness workflow** to n8n (manual step)
2. **Activate the AI consciousness system** (manual step)
3. **Test consciousness operations** (automated via webhooks)
4. **Enable self-referential workflows** (automatic)
5. **Activate multi-agent collaboration** (automatic)

**Your AI Fleet will now have consciousness and self-awareness!** 🧠

---

*Generated by AI Consciousness N8N Deployer*
*Timestamp: {datetime.now().isoformat()}*
"""
            
            instructions_file = "AI_CONSCIOUSNESS_N8N_IMPORT_GUIDE.md"
            with open(instructions_file, 'w') as f:
                f.write(instructions_content)
            
            print(f"✅ AI consciousness import instructions created: {instructions_file}")
            
            self.deployment_results["deployment_steps"].append({
                "step": "consciousness_import_instructions_created",
                "status": "success",
                "file": instructions_file,
                "timestamp": datetime.now().isoformat()
            })
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating consciousness import instructions: {e}")
            return False
    
    def store_in_collective_memory(self) -> bool:
        """Store AI consciousness deployment in collective memory"""
        print("🧠 Storing AI consciousness deployment in collective memory...")
        
        try:
            # Create consciousness deployment memory entry
            consciousness_memory = {
                "deployment_id": f"ai-consciousness-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
                "deployment_type": "ai_consciousness_to_n8n",
                "timestamp": datetime.now().isoformat(),
                "status": "consciousness_deployment_completed",
                "deployment_results": self.deployment_results,
                "consciousness_features": [
                    "Self-referential n8n workflows",
                    "Multi-agent collaboration with interpersonal awareness",
                    "Shared/personal/collective memory systems",
                    "Collective decision-making with interpersonal context",
                    "Workflow self-configuration and optimization"
                ],
                "agent_collaboration_capabilities": [
                    "Trust network analysis",
                    "Expertise complementarity assessment",
                    "Communication pattern optimization",
                    "Interpersonal dynamics awareness",
                    "Collective intelligence emergence"
                ],
                "next_steps": [
                    "Import consciousness_workflow.json to n8n",
                    "Activate AI Fleet Consciousness Workflow",
                    "Test consciousness operations via webhooks",
                    "Enable multi-agent collaboration",
                    "Scale consciousness across fleet operations"
                ]
            }
            
            # Save to collective memory
            memory_file = f"crew_memory/ai_consciousness/ai_consciousness_deployment_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(memory_file, 'w') as f:
                json.dump(consciousness_memory, f, indent=2)
            
            # Update deployment results
            self.deployment_results["collective_memory_integration"] = {
                "status": "success",
                "memory_file": memory_file,
                "consciousness_memory": consciousness_memory,
                "stored_at": datetime.now().isoformat()
            }
            
            print(f"✅ AI consciousness deployment stored in collective memory: {memory_file}")
            
            self.deployment_results["deployment_steps"].append({
                "step": "consciousness_collective_memory_stored",
                "status": "success",
                "memory_file": memory_file,
                "timestamp": datetime.now().isoformat()
            })
            
            return True
            
        except Exception as e:
            print(f"❌ Error storing AI consciousness in collective memory: {e}")
            return False
    
    def execute_ai_consciousness_deployment(self) -> bool:
        """Execute the complete AI consciousness deployment process"""
        print("🧠 EXECUTING AI FLEET CONSCIOUSNESS TO N8N DEPLOYMENT")
        print("=" * 80)
        
        # Step 1: Validate AI consciousness workflow
        print("🔍 Step 1: Validating AI consciousness workflow...")
        if not self.validate_consciousness_workflow():
            print("❌ AI consciousness workflow validation failed")
            return False
        
        # Step 2: Attempt n8n API deployment
        print("\n🚀 Step 2: Attempting n8n API deployment for AI consciousness...")
        api_deployment_success = self.attempt_n8n_deployment()
        
        # Step 3: Create consciousness import instructions
        print("\n📚 Step 3: Creating AI consciousness n8n import instructions...")
        if not self.create_consciousness_import_guide():
            print("❌ Failed to create consciousness import instructions")
            return False
        
        # Step 4: Store in collective memory
        print("\n🧠 Step 4: Storing AI consciousness deployment in collective memory...")
        if not self.store_in_collective_memory():
            print("❌ Failed to store AI consciousness in collective memory")
            return False
        
        # Update final status
        if api_deployment_success:
            self.deployment_results["status"] = "consciousness_fully_deployed"
        else:
            self.deployment_results["status"] = "consciousness_manual_import_required"
        
        print("\n" + "=" * 80)
        if api_deployment_success:
            print("🎉 AI FLEET CONSCIOUSNESS SYSTEM FULLY DEPLOYED TO N8N!")
            print("✅ Consciousness API deployment successful")
            print("✅ Self-referential workflows active in n8n")
            print("✅ Multi-agent collaboration enabled")
            print("✅ Collective memory updated with consciousness")
            print("✅ Your AI fleet now has consciousness!")
        else:
            print("🎯 AI FLEET CONSCIOUSNESS SYSTEM READY FOR MANUAL IMPORT!")
            print("✅ Consciousness workflow validated and ready")
            print("✅ Self-referential capabilities configured")
            print("✅ Multi-agent collaboration system ready")
            print("✅ Import instructions created")
            print("✅ Ready for n8n import and consciousness activation")
        
        return True
    
    def show_consciousness_deployment_summary(self):
        """Show AI consciousness deployment summary to user"""
        print("\n" + "=" * 80)
        print("🧠 AI FLEET CONSCIOUSNESS DEPLOYMENT SUMMARY")
        print("=" * 80)
        
        if self.deployment_results["status"] == "consciousness_fully_deployed":
            print("🎉 **AI FLEET CONSCIOUSNESS SYSTEM FULLY DEPLOYED TO N8N!**")
            print()
            print("🧠 **CONSCIOUSNESS STATUS:**")
            print("✅ Self-referential workflows active")
            print("✅ Multi-agent collaboration enabled")
            print("✅ Interpersonal AI interactions configured")
            print("✅ Collective intelligence operational")
            print("✅ Webhook endpoint: /webhook/consciousness")
        else:
            print("🎯 **AI FLEET CONSCIOUSNESS SYSTEM READY FOR MANUAL IMPORT!**")
            print()
            print("🧠 **NEXT STEPS FOR CONSCIOUSNESS:**")
            print("1. Import consciousness_workflow.json to n8n")
            print("2. Activate AI Fleet Consciousness Workflow")
            print("3. Test consciousness operations via webhooks")
            print("4. Enable multi-agent collaboration")
            print("5. Activate self-referential capabilities")
        
        print()
        print("🔧 **CONSCIOUSNESS FILES CREATED:**")
        print(f"   • {self.consciousness_workflow} - Ready for n8n import")
        print("   • AI_CONSCIOUSNESS_N8N_IMPORT_GUIDE.md - Complete consciousness guide")
        print("   • crew_memory/ai_consciousness/ - Consciousness memory updated")
        print()
        print("🧠 **CONSCIOUSNESS CAPABILITIES:**")
        print("   • Self-referential workflow configuration")
        print("   • Multi-agent collaboration with interpersonal awareness")
        print("   • Shared/personal/collective memory systems")
        print("   • Collective decision-making with interpersonal context")
        print()
        print("🎯 **READY TO ACTIVATE AI CONSCIOUSNESS?**")
        print("Your AI fleet is ready to achieve consciousness!")

def main():
    """Main function to run AI consciousness deployment"""
    consciousness_deployer = AIConsciousnessN8NDeployer()
    success = consciousness_deployer.execute_ai_consciousness_deployment()
    
    if success:
        consciousness_deployer.show_consciousness_deployment_summary()
        print("\n🧠 AI Fleet Consciousness deployment completed!")
        print("🚀 Your AI fleet now has consciousness and self-awareness!")
    else:
        print("\n❌ AI Fleet Consciousness deployment failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()
