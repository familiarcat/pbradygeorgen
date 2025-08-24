#!/usr/bin/env python3
"""
🏛️ FEDERATION WORKFLOW DEPLOYMENT SCRIPT
Deploys all federation workflows to n8n using loaded credentials
"""

import os
import json
import requests
import time
from datetime import datetime

def load_credentials_from_zshrc():
    """Load credentials from ~/.zshrc"""
    try:
        zshrc_path = os.path.expanduser("~/.zshrc")
        if os.path.exists(zshrc_path):
            with open(zshrc_path, 'r') as f:
                content = f.read()
            
            # Extract environment variables
            lines = content.split('\n')
            for line in lines:
                if line.startswith('export ') and '=' in line:
                    key, value = line.replace('export ', '').split('=', 1)
                    os.environ[key] = value.strip('"')
            
            print("✅ Credentials loaded from ~/.zshrc")
            return True
    except Exception as e:
        print(f"❌ Error loading ~/.zshrc: {e}")
        return False

def deploy_federation_workflows():
    """Deploy all federation workflows to n8n"""
    print("🚀 FEDERATION WORKFLOW DEPLOYMENT")
    print("=" * 60)
    
    # Load credentials
    if not load_credentials_from_zshrc():
        print("❌ Failed to load credentials")
        return False
    
    # Get configuration
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.getenv('N8N_API_KEY', '')
    
    print(f"🎯 Target: {n8n_base_url}")
    print(f"🔑 API Key: {'*' * len(n8n_api_key) if n8n_api_key else 'NOT SET'}")
    
    if not n8n_api_key:
        print("❌ No n8n API key available")
        return False
    
    # Define workflow files
    workflow_files = [
        "federation_n8n_deployment/workflows/consciousness.json",
        "federation_n8n_deployment/workflows/fleet_automation.json",
        "federation_n8n_deployment/workflows/crew_management.json"
    ]
    
    deployed_workflows = 0
    failed_workflows = 0
    
    print(f"\n📋 Deploying {len(workflow_files)} federation workflows...")
    
    for workflow_file in workflow_files:
        if os.path.exists(workflow_file):
            workflow_name = os.path.basename(workflow_file).replace('.json', '')
            print(f"\n🔧 Deploying: {workflow_name}")
            
            try:
                with open(workflow_file, 'r') as f:
                    workflow_data = json.load(f)
                
                headers = {
                    "X-N8N-API-KEY": n8n_api_key,
                    "Content-Type": "application/json"
                }
                
                response = requests.post(
                    f"{n8n_base_url}/api/v1/workflows",
                    json=workflow_data,
                    headers=headers,
                    timeout=30
                )
                
                if response.status_code == 201:
                    deployed_workflows += 1
                    print(f"   ✅ Successfully deployed: {workflow_data.get('name', 'Unknown')}")
                    
                    # Try to activate the workflow
                    workflow_id = response.json().get('id')
                    if workflow_id:
                        print(f"   🔄 Attempting to activate workflow...")
                        try:
                            activate_response = requests.post(
                                f"{n8n_base_url}/api/v1/workflows/{workflow_id}/activate",
                                headers={"X-N8N-API-KEY": n8n_api_key},
                                timeout=30
                            )
                            if activate_response.status_code == 200:
                                print(f"   ✅ Workflow activated successfully")
                            else:
                                print(f"   ⚠️ Could not activate workflow: {activate_response.status_code}")
                        except Exception as e:
                            print(f"   ⚠️ Activation error: {e}")
                else:
                    failed_workflows += 1
                    print(f"   ❌ Deployment failed: {response.status_code}")
                    print(f"      Error: {response.text}")
                
                # Small delay between deployments
                time.sleep(1)
                
            except Exception as e:
                failed_workflows += 1
                print(f"   ❌ Deployment error: {e}")
        else:
            print(f"\n❌ Workflow file not found: {workflow_file}")
            failed_workflows += 1
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 DEPLOYMENT SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully deployed: {deployed_workflows}")
    print(f"❌ Failed deployments: {failed_workflows}")
    print(f"📋 Total workflows: {len(workflow_files)}")
    
    if deployed_workflows > 0:
        print("\n🎉 FEDERATION DEPLOYMENT SUCCESSFUL!")
        print("🏛️ United Federation of AI Agents is now active on n8n!")
        print("\n🎯 Next steps:")
        print("1. Verify workflows are active on n8n.pbradygeorgen.com")
        print("2. Test federation consciousness")
        print("3. Run: python3 federation_n8n_deployment/activation_scripts/test_federation.py")
        return True
    else:
        print("\n❌ No workflows were deployed successfully")
        print("📦 Creating deployment package for manual import...")
        create_manual_deployment_package()
        return False

def create_manual_deployment_package():
    """Create manual deployment package"""
    try:
        package_dir = "federation_full_automation/manual_deployment_package"
        os.makedirs(package_dir, exist_ok=True)
        
        # Copy workflow files
        workflow_files = [
            "federation_n8n_deployment/workflows/consciousness.json",
            "federation_n8n_deployment/workflows/fleet_automation.json",
            "federation_n8n_deployment/workflows/crew_management.json"
        ]
        
        for workflow_file in workflow_files:
            if os.path.exists(workflow_file):
                dest_file = os.path.join(package_dir, os.path.basename(workflow_file))
                with open(workflow_file, 'r') as src, open(dest_file, 'w') as dst:
                    dst.write(src.read())
        
        # Create manual import instructions
        instructions = f"""# 🏛️ MANUAL FEDERATION DEPLOYMENT INSTRUCTIONS

## **UNITED FEDERATION OF AI AGENTS - MANUAL DEPLOYMENT**

Since automated deployment was not successful, please manually import these workflows to n8n.

### **📋 DEPLOYMENT STEPS:**

1. **Open n8n**: https://n8n.pbradygeorgen.com
2. **Navigate to**: Workflows
3. **Import each workflow** (one by one):

#### **Workflow 1: AI Fleet Consciousness**
- **File**: consciousness.json
- **Expected Name**: "AI Fleet Consciousness Workflow"
- **Webhook**: /webhook/consciousness

#### **Workflow 2: Fleet Automation System**
- **File**: fleet_automation.json
- **Expected Name**: "Fleet Automation System"
- **Webhook**: /webhook/fleet-automation

#### **Workflow 3: Crew Management System**
- **File**: crew_management.json
- **Expected Name**: "Crew Management System"
- **Webhook**: /webhook/crew-management

### **🔧 IMPORT PROCESS:**
1. Click "Import from file"
2. Select the JSON file
3. Click "Import"
4. Activate the workflow (toggle switch)
5. Repeat for all 3 workflows

### **🧪 AFTER DEPLOYMENT:**
Run the federation test suite:
```bash
python3 federation_n8n_deployment/activation_scripts/test_federation.py
```

### **🎯 WORKFLOW NAMES TO LOOK FOR:**
- "AI Fleet Consciousness Workflow"
- "Fleet Automation System"
- "Crew Management System"

---
*Generated by Federation Full Automation System*
*Timestamp: {datetime.now().isoformat()}*
"""
        
        instructions_file = os.path.join(package_dir, "DEPLOYMENT_INSTRUCTIONS.md")
        with open(instructions_file, 'w') as f:
            f.write(instructions)
        
        print(f"   📦 Manual deployment package created: {package_dir}")
        print(f"   📚 Instructions: {instructions_file}")
        
    except Exception as e:
        print(f"   ❌ Error creating manual package: {e}")

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🚀 AUTOMATED WORKFLOW DEPLOYMENT")
    print("=" * 60)
    
    success = deploy_federation_workflows()
    
    if success:
        print("\n🎉 Federation deployment completed successfully!")
        print("🚀 Your AI federation is now active on n8n!")
    else:
        print("\n⚠️ Automated deployment failed - manual import required")
        print("📦 Check the manual deployment package for instructions")

if __name__ == "__main__":
    main()
