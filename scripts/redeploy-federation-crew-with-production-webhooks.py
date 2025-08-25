#!/usr/bin/env python3
"""
Enhanced Federation Crew Deployment with Production Webhooks
This script redeploys all Federation Crew workflows with proper production webhook configurations.
"""

import json
import requests
import time
import os
from datetime import datetime

# Configuration
N8N_BASE_URL = "https://n8n.pbradygeorgen.com"
N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"

# Headers for API requests
HEADERS = {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Content-Type": "application/json"
}

def print_header():
    """Print deployment header"""
    print("🎖️ CAPTAIN PICARD - FEDERATION CREW PRODUCTION WEBHOOK DEPLOYMENT")
    print("==================================================================")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Target: {N8N_BASE_URL}")
    print("")

def backup_current_workflows():
    """Backup current workflows before deployment"""
    print("📦 BACKING UP CURRENT WORKFLOWS...")
    print("-----------------------------------")
    
    try:
        # Get all workflows
        response = requests.get(f"{N8N_BASE_URL}/api/v1/workflows", headers=HEADERS)
        response.raise_for_status()
        
        workflows = response.json().get("data", [])
        
        # Filter Federation Crew workflows
        federation_workflows = [w for w in workflows if "Federation" in w.get("name", "") or "Captain" in w.get("name", "") or "Commander" in w.get("name", "") or "Lieutenant" in w.get("name", "") or "Counselor" in w.get("name", "")]
        
        # Create backup directory
        backup_dir = f"n8n_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        os.makedirs(backup_dir, exist_ok=True)
        
        # Save each workflow
        for workflow in federation_workflows:
            workflow_name = workflow.get("name", "unknown").replace(" ", "_").replace("-", "_")
            filename = f"{backup_dir}/{workflow_name}.json"
            
            with open(filename, 'w') as f:
                json.dump(workflow, f, indent=2)
            
            print(f"   ✅ Backed up: {workflow.get('name')}")
        
        print(f"   📁 Backup saved to: {backup_dir}")
        return backup_dir
        
    except Exception as e:
        print(f"   ❌ Backup failed: {e}")
        return None

def fix_webhook_configuration(workflow_data):
    """Fix webhook configuration for production"""
    if "nodes" not in workflow_data:
        return workflow_data
    
    modified = False
    
    for node in workflow_data["nodes"]:
        if node.get("type") == "n8n-nodes-base.webhook":
            # Fix webhook parameters for production
            if "parameters" not in node:
                node["parameters"] = {}
            
            # Ensure webhook is configured for production
            node["parameters"]["options"] = node["parameters"].get("options", {})
            
            # Add production webhook settings
            if "active" not in node["parameters"]:
                node["parameters"]["active"] = True
                modified = True
            
            # Ensure proper response mode
            if "responseMode" not in node["parameters"]:
                node["parameters"]["responseMode"] = "responseNode"
                modified = True
            
            # Add authentication if needed
            if "authentication" not in node["parameters"]:
                node["parameters"]["authentication"] = "none"
                modified = True
            
            print(f"   🔧 Fixed webhook node: {node.get('name', 'Unknown')}")
    
    return workflow_data, modified

def deploy_workflow_with_production_webhooks(workflow_data, workflow_name):
    """Deploy a single workflow with production webhook configuration"""
    print(f"🚀 Deploying: {workflow_name}")
    print(f"   📍 Workflow ID: {workflow_data.get('id', 'New')}")
    
    try:
        # Fix webhook configuration
        fixed_workflow, was_modified = fix_webhook_configuration(workflow_data)
        
        if not was_modified:
            print(f"   ⚠️  No webhook fixes needed for {workflow_name}")
        
        # Prepare deployment payload
        deployment_payload = {
            "name": workflow_data.get("name"),
            "nodes": fixed_workflow.get("nodes", []),
            "connections": fixed_workflow.get("connections", {}),
            "active": True,
            "settings": fixed_workflow.get("settings", {}),
            "tags": fixed_workflow.get("tags", [])
        }
        
        # Deploy workflow
        if workflow_data.get("id"):
            # Update existing workflow
            response = requests.put(
                f"{N8N_BASE_URL}/api/v1/workflows/{workflow_data['id']}",
                headers=HEADERS,
                json=deployment_payload
            )
        else:
            # Create new workflow
            response = requests.post(
                f"{N8N_BASE_URL}/api/v1/workflows",
                headers=HEADERS,
                json=deployment_payload
            )
        
        response.raise_for_status()
        result = response.json()
        
        print(f"   ✅ Successfully deployed: {workflow_name}")
        print(f"   🆔 New ID: {result.get('data', {}).get('id', 'Unknown')}")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Deployment failed: {e}")
        return False

def test_webhook_endpoints():
    """Test all webhook endpoints after deployment"""
    print("🧪 TESTING WEBHOOK ENDPOINTS...")
    print("--------------------------------")
    
    webhook_tests = [
        ("federation-mission", {"mission_description": "Test production webhook"}),
        ("federation-directive", {"directive": "Test production webhook"}),
        ("crew-captain-jean-luc-picard", {"task": "Test production webhook"}),
        ("crew-commander-data", {"task": "Test production webhook"}),
        ("crew-lieutenant-commander-geordi-la-forge", {"task": "Test production webhook"}),
        ("crew-lieutenant-worf", {"task": "Test production webhook"}),
        ("crew-counselor-deanna-troi", {"task": "Test production webhook"})
    ]
    
    success_count = 0
    
    for webhook_path, payload in webhook_tests:
        try:
            response = requests.post(
                f"{N8N_BASE_URL}/webhook/{webhook_path}",
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"   ✅ {webhook_path}: SUCCESS")
                success_count += 1
            else:
                print(f"   ❌ {webhook_path}: HTTP {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ {webhook_path}: ERROR - {e}")
    
    print(f"   📊 Results: {success_count}/{len(webhook_tests)} webhooks working")
    return success_count == len(webhook_tests)

def main():
    """Main deployment function"""
    print_header()
    
    # Step 1: Backup current workflows
    backup_dir = backup_current_workflows()
    if not backup_dir:
        print("❌ Cannot proceed without backup. Aborting deployment.")
        return False
    
    print("")
    
    # Step 2: Load workflow templates (from backup or original files)
    print("📋 LOADING WORKFLOW TEMPLATES...")
    print("---------------------------------")
    
    # Try to load from backup first, then fall back to original files
    workflow_files = []
    
    if os.path.exists(backup_dir):
        workflow_files = [f for f in os.listdir(backup_dir) if f.endswith('.json')]
        workflow_files = [os.path.join(backup_dir, f) for f in workflow_files]
    
    if not workflow_files:
        print("   ⚠️  No backup files found, checking for original workflow files...")
        # Add fallback to original workflow files if needed
        pass
    
    if not workflow_files:
        print("   ❌ No workflow files found. Cannot proceed.")
        return False
    
    print(f"   📁 Found {len(workflow_files)} workflow files")
    
    # Step 3: Deploy each workflow
    print("")
    print("🚀 DEPLOYING FEDERATION CREW WORKFLOWS...")
    print("------------------------------------------")
    
    success_count = 0
    
    for workflow_file in workflow_files:
        try:
            with open(workflow_file, 'r') as f:
                workflow_data = json.load(f)
            
            workflow_name = workflow_data.get("name", "Unknown Workflow")
            success = deploy_workflow_with_production_webhooks(workflow_data, workflow_name)
            
            if success:
                success_count += 1
            
            # Small delay between deployments
            time.sleep(1)
            
        except Exception as e:
            print(f"   ❌ Failed to process {workflow_file}: {e}")
    
    print(f"   📊 Deployment Results: {success_count}/{len(workflow_files)} workflows deployed")
    
    # Step 4: Test webhook endpoints
    print("")
    print("🧪 TESTING PRODUCTION WEBHOOKS...")
    print("----------------------------------")
    
    # Wait a moment for n8n to process the deployments
    print("   ⏳ Waiting for n8n to process deployments...")
    time.sleep(5)
    
    webhooks_working = test_webhook_endpoints()
    
    # Step 5: Summary
    print("")
    print("🎖️ CAPTAIN PICARD - DEPLOYMENT SUMMARY")
    print("=======================================")
    print(f"✅ Workflows Deployed: {success_count}/{len(workflow_files)}")
    print(f"✅ Webhooks Working: {'Yes' if webhooks_working else 'No'}")
    print(f"📦 Backup Location: {backup_dir}")
    
    if webhooks_working:
        print("🎉 FEDERATION CREW IS NOW FULLY OPERATIONAL!")
        print("   The crew is ready to receive external webhook requests.")
    else:
        print("⚠️  Some webhooks may need manual activation in the n8n UI.")
        print("   Please check the n8n interface for any remaining issues.")
    
    return webhooks_working

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
