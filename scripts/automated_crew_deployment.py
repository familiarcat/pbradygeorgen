#!/usr/bin/env python3
"""
Automated Crew Deployment Script
Enhanced version with proper error handling and validation
"""

import requests
import json
import os
import sys
import time
from typing import Dict, Any, List, Tuple

class AutomatedCrewDeployer:
    def __init__(self):
        self.n8n_base_url = "https://n8n.pbradygeorgen.com"
        self.api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"
        self.headers = {
            "X-N8N-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }
        
        # Load OpenRouter API key from environment
        self.openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.openrouter_api_key:
            print("❌ OPENROUTER_API_KEY not found in environment")
            print("   Please set your OpenRouter API key in ~/.zshrc")
            sys.exit(1)

    def test_n8n_connection(self) -> bool:
        """Test connection to n8n instance"""
        try:
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers={"X-N8N-API-KEY": self.api_key},
                timeout=10
            )
            if response.status_code == 200:
                print("✅ n8n connection successful")
                return True
            else:
                print(f"❌ n8n connection failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ n8n connection error: {e}")
            return False

    def load_workflow_template(self, filename: str) -> Dict[str, Any]:
        """Load workflow template from JSON file"""
        try:
            filepath = f"n8n_workflow_backups/{filename}"
            with open(filepath, 'r') as f:
                data = json.load(f)
            
            # Extract workflow_data from backup format
            if "workflow_data" in data:
                return data["workflow_data"]
            else:
                return data
        except Exception as e:
            print(f"❌ Failed to load {filename}: {e}")
            return None

    def prepare_workflow_for_deployment(self, workflow_data: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare workflow data for n8n API deployment"""
        # Remove fields that might cause API issues
        deployment_data = {
            "name": workflow_data.get("name"),
            "nodes": workflow_data.get("nodes", []),
            "connections": workflow_data.get("connections", {}),
            "settings": workflow_data.get("settings", {})
        }
        
        # Clean up node data
        for node in deployment_data["nodes"]:
            # Remove problematic fields
            node.pop("id", None)  # Let n8n assign new IDs
            node.pop("createdAt", None)
            node.pop("updatedAt", None)
            
            # Ensure parameters are properly formatted
            if "parameters" in node:
                params = node["parameters"]
                # Fix authentication references
                if "httpHeaderAuth" in params:
                    params["httpHeaderAuth"] = f"Bearer {self.openrouter_api_key}"
        
        return deployment_data

    def deploy_workflow(self, workflow_data: Dict[str, Any], crew_member: str) -> Tuple[bool, str]:
        """Deploy a single workflow to n8n"""
        try:
            print(f"🚀 Deploying {crew_member}...")
            
            # Prepare workflow for deployment
            deployment_data = self.prepare_workflow_for_deployment(workflow_data)
            
            # Deploy workflow
            response = requests.post(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers=self.headers,
                json=deployment_data,
                timeout=30
            )
            
            if response.status_code in [200, 201]:
                result = response.json()
                workflow_id = result.get("id", result.get("data", {}).get("id", "Unknown"))
                print(f"   ✅ Successfully deployed: {crew_member}")
                print(f"   🆔 Workflow ID: {workflow_id}")
                
                # Activate the workflow
                if workflow_id != "Unknown":
                    activation_success = self.activate_workflow(workflow_id, crew_member)
                    if activation_success:
                        print(f"   ✅ Successfully activated: {crew_member}")
                    else:
                        print(f"   ⚠️  Failed to activate: {crew_member} - may need manual activation")
                
                return True, workflow_id
            else:
                print(f"   ❌ Deployment failed: {response.status_code}")
                print(f"   Response: {response.text}")
                return False, None
                
        except Exception as e:
            print(f"   ❌ Deployment error: {e}")
            return False, None

    def activate_workflow(self, workflow_id: str, crew_member: str) -> bool:
        """Activate a workflow after deployment"""
        try:
            response = requests.patch(
                f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}",
                headers=self.headers,
                json={"active": True},
                timeout=10
            )
            
            if response.status_code == 200:
                return True
            else:
                print(f"   ⚠️  Activation failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ⚠️  Activation error: {e}")
            return False

    def test_webhook_endpoint(self, webhook_path: str, crew_member: str) -> bool:
        """Test a webhook endpoint after deployment"""
        try:
            print(f"   🧪 Testing webhook for {crew_member}...")
            
            # Wait for n8n to process the deployment
            time.sleep(5)
            
            response = requests.post(
                f"{self.n8n_base_url}/webhook/{webhook_path}",
                headers={"Content-Type": "application/json"},
                json={"task": f"Test mission for {crew_member}"},
                timeout=30
            )
            
            if response.status_code == 200:
                print(f"   ✅ Webhook test successful: /webhook/{webhook_path}")
                return True
            else:
                print(f"   ❌ Webhook test failed: /webhook/{webhook_path} (Status: {response.status_code})")
                return False
                
        except Exception as e:
            print(f"   ❌ Webhook test error: {e}")
            return False

    def get_missing_crew_workflows(self) -> List[Tuple[str, str, str]]:
        """Get list of missing crew workflows to deploy"""
        return [
            ("Commander William Riker", "Commander William Riker - Tactical Execution & Workflow Management.json", "crew-commander-william-riker"),
            ("Dr. Beverly Crusher", "Dr. Beverly Crusher - Health & Diagnostics Officer.json", "crew-dr-beverly-crusher"),
            ("Lieutenant Uhura", "Lieutenant Uhura - Communications & I/O Operations Officer.json", "crew-lieutenant-uhura"),
            ("Quark", "Quark - Business Intelligence & Budget Optimization.json", "crew-quark")
        ]

    def deploy_all_missing_crew(self) -> bool:
        """Deploy all missing crew members"""
        print("🚀 AUTOMATED CREW DEPLOYMENT TO N8N")
        print("=" * 60)
        
        # Test n8n connection first
        if not self.test_n8n_connection():
            print("❌ Cannot proceed without n8n connection")
            return False
        
        # Get missing crew workflows
        crew_workflows = self.get_missing_crew_workflows()
        
        success_count = 0
        total_count = len(crew_workflows)
        
        print(f"\n📋 Deploying {total_count} missing crew members...")
        
        for crew_member, filename, webhook_path in crew_workflows:
            print(f"\n🎖️ Processing {crew_member}...")
            
            # Load workflow template
            workflow_data = self.load_workflow_template(filename)
            if not workflow_data:
                print(f"   ❌ Failed to load workflow template for {crew_member}")
                continue
            
            # Deploy workflow
            success, workflow_id = self.deploy_workflow(workflow_data, crew_member)
            if success:
                success_count += 1
                
                # Test webhook endpoint
                webhook_success = self.test_webhook_endpoint(webhook_path, crew_member)
                if not webhook_success:
                    print(f"   ⚠️  Webhook test failed for {crew_member} - may need manual activation")
            else:
                print(f"   ❌ Deployment failed for {crew_member}")
        
        # Summary
        print(f"\n📊 Deployment Results: {success_count}/{total_count} crew members deployed")
        
        if success_count == total_count:
            print("🎉 ALL MISSING CREW MEMBERS SUCCESSFULLY DEPLOYED!")
            print("   The Federation crew is now complete and operational.")
        elif success_count > 0:
            print(f"⚠️  Partial success: {success_count}/{total_count} crew members deployed")
            print("   Some crew members may need manual deployment.")
        else:
            print("❌ No crew members were deployed successfully")
            print("   Please check the n8n interface and try manual deployment.")
        
        return success_count > 0

    def validate_deployment(self) -> bool:
        """Validate that all crew members are now deployed"""
        try:
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                workflows = response.json().get("data", [])
                crew_workflows = [w for w in workflows if any(crew in w.get("name", "") for crew in ["Riker", "Crusher", "Uhura", "Quark"])]
                
                print(f"\n🔍 Validation: Found {len(crew_workflows)} crew workflows")
                for workflow in crew_workflows:
                    status = "✅ Active" if workflow.get("active") else "❌ Inactive"
                    print(f"   {workflow.get('name')}: {status}")
                
                return len(crew_workflows) >= 4
            else:
                print("❌ Failed to validate deployment")
                return False
                
        except Exception as e:
            print(f"❌ Validation error: {e}")
            return False

def main():
    """Main deployment function"""
    deployer = AutomatedCrewDeployer()
    
    # Deploy missing crew members
    success = deployer.deploy_all_missing_crew()
    
    if success:
        # Validate deployment
        print("\n🔍 Validating deployment...")
        validation_success = deployer.validate_deployment()
        
        if validation_success:
            print("✅ Deployment validation successful!")
        else:
            print("⚠️  Deployment validation failed - some workflows may need manual activation")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
