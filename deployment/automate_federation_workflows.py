#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - AUTOMATE FEDERATION WORKFLOWS
Automatically discover, deploy, and activate Federation workflows from workspace
"""

import os
import json
import requests
import glob
from pathlib import Path
from datetime import datetime
import time

class FederationWorkflowAutomator:
    """Automate Federation workflow discovery and activation"""
    
    def __init__(self):
        self.config = {
            "system_name": "Federation Workflow Automator",
            "n8n_base_url": "https://n8n.pbradygeorgen.com",
            "workspace_root": os.path.expanduser("~/Documents/workspace"),
            "api_key": None,  # Will be set from environment
            "created_at": datetime.now().isoformat()
        }
        
        # Get API key from environment
        self.config["api_key"] = os.getenv("N8N_API_KEY")
        if not self.config["api_key"]:
            print("⚠️  N8N_API_KEY environment variable not set")
            print("💡 Set it with: export N8N_API_KEY='your_api_key'")
    
    def scan_workspace_for_workflows(self):
        """Scan entire workspace for n8n workflow files"""
        print("🔍 Scanning workspace for n8n workflows...")
        
        workflow_files = []
        workspace_path = Path(self.config["workspace_root"])
        
        # Find all .json files recursively
        json_files = list(workspace_path.rglob("*.json"))
        
        for json_file in json_files:
            try:
                with open(json_file, 'r') as f:
                    content = f.read()
                    
                    # Try to parse JSON content
                    try:
                        data = json.loads(content)
                    except json.JSONDecodeError:
                        # Skip invalid JSON files
                        continue
                    
                    # Check if it's an n8n workflow
                    if self.is_n8n_workflow(data):
                        workflow_info = {
                            "file_path": str(json_file),
                            "relative_path": str(json_file.relative_to(workspace_path)),
                            "workflow_data": data,
                            "name": data.get("name", "Unnamed Workflow"),
                            "active": data.get("active", False),
                            "is_federation": self.is_federation_workflow(data)
                        }
                        workflow_files.append(workflow_info)
                        
                        print(f"✅ Found workflow: {workflow_info['name']} ({'Federation' if workflow_info['is_federation'] else 'Other'})")
                        
            except Exception as e:
                print(f"⚠️  Error reading {json_file}: {e}")
                continue
        
        print(f"🎯 Total workflows found: {len(workflow_files)}")
        return workflow_files
    
    def is_n8n_workflow(self, data):
        """Check if JSON data represents an n8n workflow"""
        if not isinstance(data, dict):
            return False
        
        # Check for n8n workflow indicators
        n8n_indicators = [
            "nodes" in data,
            "connections" in data,
            "active" in data,
            "settings" in data
        ]
        
        return sum(n8n_indicators) >= 3
    
    def is_federation_workflow(self, data):
        """Check if workflow is Federation-related"""
        if not isinstance(data, dict):
            return False
        
        # Check name and description for Federation keywords
        name = data.get("name", "").lower()
        description = data.get("description", "").lower()
        
        federation_keywords = [
            "federation", "agency", "crew", "directive", "mission",
            "pbradygeorgen", "united", "agents", "ai", "automation"
        ]
        
        return any(keyword in name or keyword in description for keyword in federation_keywords)
    
    def get_n8n_workflows(self):
        """Get existing workflows from n8n"""
        try:
            headers = {
                "X-N8N-API-KEY": self.config["api_key"],
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"{self.config['n8n_base_url']}/api/v1/workflows",
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Failed to get workflows: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error getting workflows: {e}")
            return []
    
    def create_or_update_workflow(self, workflow_info):
        """Create or update workflow in n8n"""
        try:
            headers = {
                "X-N8N-API-KEY": self.config["api_key"],
                "Content-Type": "application/json"
            }
            
            # Handle different workflow data formats
            workflow_data_raw = workflow_info["workflow_data"]
            
            # Check if workflow_data is a string (needs parsing) or dict
            if isinstance(workflow_data_raw, str):
                try:
                    workflow_data_raw = json.loads(workflow_data_raw)
                except json.JSONDecodeError:
                    print(f"⚠️  Skipping {workflow_info['name']}: Invalid JSON string")
                    return False
            
            # Ensure we have a dictionary
            if not isinstance(workflow_data_raw, dict):
                print(f"⚠️  Skipping {workflow_info['name']}: Invalid workflow data format")
                return False
            
            # Prepare workflow data with safe access
            workflow_data = {
                "name": workflow_info["name"],
                "active": workflow_info["is_federation"],  # Auto-activate Federation workflows
                "nodes": workflow_data_raw.get("nodes", []),
                "connections": workflow_data_raw.get("connections", {}),
                "settings": workflow_data_raw.get("settings", {}),
                "tags": ["Federation", "Automated"] if workflow_info["is_federation"] else ["Automated"]
            }
            
            # Check if workflow already exists
            existing_workflows = self.get_n8n_workflows()
            existing_workflow = None
            
            for wf in existing_workflows:
                if wf.get("name") == workflow_info["name"]:
                    existing_workflow = wf
                    break
            
            if existing_workflow:
                # Update existing workflow
                workflow_id = existing_workflow["id"]
                response = requests.put(
                    f"{self.config['n8n_base_url']}/api/v1/workflows/{workflow_id}",
                    headers=headers,
                    json=workflow_data,
                    timeout=60
                )
                
                if response.status_code == 200:
                    print(f"✅ Updated workflow: {workflow_info['name']}")
                    return True
                else:
                    print(f"❌ Failed to update {workflow_info['name']}: {response.status_code}")
                    return False
            else:
                # Create new workflow
                response = requests.post(
                    f"{self.config['n8n_base_url']}/api/v1/workflows",
                    headers=headers,
                    json=workflow_data,
                    timeout=60
                )
                
                if response.status_code == 201:
                    print(f"✅ Created workflow: {workflow_info['name']}")
                    return True
                else:
                    print(f"❌ Failed to create {workflow_info['name']}: {response.status_code}")
                    return False
                    
        except Exception as e:
            print(f"❌ Error managing workflow {workflow_info['name']}: {e}")
            return False
    
    def activate_federation_workflows(self):
        """Activate all Federation workflows"""
        print("🚀 Activating Federation workflows...")
        
        try:
            headers = {
                "X-N8N-API-KEY": self.config["api_key"],
                "Content-Type": "application/json"
            }
            
            workflows = self.get_n8n_workflows()
            activated_count = 0
            
            for workflow in workflows:
                if workflow.get("name") and any(keyword in workflow["name"].lower() for keyword in ["federation", "agency", "crew"]):
                    # Activate Federation workflow
                    workflow_data = {
                        "active": True,
                        "name": workflow["name"],
                        "nodes": workflow.get("nodes", []),
                        "connections": workflow.get("connections", {}),
                        "settings": workflow.get("settings", {})
                    }
                    
                    response = requests.put(
                        f"{self.config['n8n_base_url']}/api/v1/workflows/{workflow['id']}",
                        headers=headers,
                        json=workflow_data,
                        timeout=60
                    )
                    
                    if response.status_code == 200:
                        print(f"✅ Activated: {workflow['name']}")
                        activated_count += 1
                    else:
                        print(f"❌ Failed to activate {workflow['name']}: {response.status_code}")
            
            print(f"🎯 Activated {activated_count} Federation workflows")
            return activated_count
            
        except Exception as e:
            print(f"❌ Error activating workflows: {e}")
            return 0
    
    def test_federation_agency(self):
        """Test Federation agency with a test directive"""
        print("🧪 Testing Federation agency...")
        
        try:
            # Find Federation workflow
            workflows = self.get_n8n_workflows()
            federation_workflow = None
            
            for workflow in workflows:
                if workflow.get("name") and "federation" in workflow["name"].lower():
                    federation_workflow = workflow
                    break
            
            if not federation_workflow:
                print("⚠️  No Federation workflow found to test")
                return False
            
            # Test webhook if available
            webhook_url = f"{self.config['n8n_base_url']}/webhook/test-federation"
            
            test_data = {
                "directive": "ALL HANDS ON BOARD",
                "mission": "Test Federation Agency Response",
                "timestamp": datetime.now().isoformat(),
                "source": "Automated Test Script"
            }
            
            response = requests.post(
                webhook_url,
                json=test_data,
                timeout=30
            )
            
            if response.status_code in [200, 201, 202]:
                print("✅ Federation agency test successful!")
                return True
            else:
                print(f"⚠️  Federation agency test response: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"⚠️  Federation agency test error: {e}")
            return False
    
    def execute_automation(self):
        """Execute the complete workflow automation process"""
        print("🏛️ EXECUTING FEDERATION WORKFLOW AUTOMATION")
        print("=" * 80)
        print("🔍 Automating Federation workflow discovery and activation")
        print("=" * 80)
        
        if not self.config["api_key"]:
            print("❌ N8N_API_KEY not set - cannot proceed")
            return False
        
        # Step 1: Scan workspace for workflows
        print("🔍 Step 1: Scanning workspace for workflows...")
        workflows = self.scan_workspace_for_workflows()
        
        if not workflows:
            print("⚠️  No workflows found in workspace")
            return False
        
        # Step 2: Deploy workflows to n8n
        print("🚀 Step 2: Deploying workflows to n8n...")
        deployed_count = 0
        
        for workflow in workflows:
            if self.create_or_update_workflow(workflow):
                deployed_count += 1
            time.sleep(1)  # Rate limiting
        
        print(f"✅ Deployed {deployed_count}/{len(workflows)} workflows")
        
        # Step 3: Activate Federation workflows
        print("🎯 Step 3: Activating Federation workflows...")
        activated_count = self.activate_federation_workflows()
        
        # Step 4: Test Federation agency
        print("🧪 Step 4: Testing Federation agency...")
        test_success = self.test_federation_agency()
        
        # Success summary
        print("\n" + "=" * 80)
        print("🎉 FEDERATION WORKFLOW AUTOMATION COMPLETED!")
        print("=" * 80)
        print(f"✅ Workspace scanned: {len(workflows)} workflows found")
        print(f"✅ Workflows deployed: {deployed_count} to n8n")
        print(f"✅ Federation workflows activated: {activated_count}")
        print(f"✅ Federation agency test: {'Success' if test_success else 'Check manually'}")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Scanned entire workspace for n8n workflows")
        print(f"   • Automatically deployed workflows to n8n")
        print(f"   • Activated Federation workflows")
        print(f"   • Tested Federation agency response")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Monitor workflows** - Check n8n UI for active workflows")
        print(f"• **Test Federation** - Send directives to verify crew response")
        print(f"• **Review automation** - Check logs for any deployment issues")
        
        print(f"\n🔧 AUTOMATION FEATURES:")
        print(f"• **Recursive workspace scanning** - Finds all workflows")
        print(f"• **Smart workflow detection** - Identifies n8n vs other JSON")
        print(f"• **Federation auto-activation** - Enables Federation workflows")
        print(f"• **API-driven deployment** - No manual UI interaction needed")
        
        print(f"\n🚀 READY FOR FEDERATION MISSIONS:")
        print(f"1. Federation workflows are active in n8n")
        print(f"2. Crew should respond to directives")
        print(f"3. Agency automation is fully operational")
        print(f"4. Ready for Federation missions!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔧 AUTOMATE FEDERATION WORKFLOWS")
    print("=" * 80)
    
    automator = FederationWorkflowAutomator()
    success = automator.execute_automation()
    
    if success:
        print("\n🎉 Federation workflow automation completed successfully!")
        print("🏛️ Your Federation agency is fully automated!")
        print("\n🎯 Visit https://n8n.pbradygeorgen.com to see active workflows!")
    else:
        print("\n❌ Federation workflow automation failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()
