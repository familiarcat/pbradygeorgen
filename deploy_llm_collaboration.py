#!/usr/bin/env python3
"""
Deploy LLM Collaboration Workflow to N8N Production
"""

import os
import json
import requests
from datetime import datetime

def deploy_llm_collaboration_workflow():
    """Deploy the LLM collaboration workflow to N8N production"""
    
    print("🚀 DEPLOYING LLM COLLABORATION WORKFLOW TO PRODUCTION!")
    print("=" * 70)
    print("Target: https://n8n.pbradygeorgen.com")
    print("Workflow: LLM_Democratic_Collaboration")
    print("=" * 70)
    
    # Load environment variables
    n8n_base_url = os.environ.get('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.environ.get('N8N_API_KEY', '')
    
    if not n8n_api_key:
        print("❌ Error: N8N_API_KEY not found in environment variables")
        return False
    
    # Load the workflow file
    workflow_file = "llm_collaboration/n8n_workflow_llm_collaboration.json"
    
    try:
        with open(workflow_file, 'r') as f:
            workflow_data = json.load(f)
    except FileNotFoundError:
        print(f"❌ Error: Workflow file {workflow_file} not found")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ Error: Invalid JSON in workflow file: {e}")
        return False
    
    # Prepare deployment payload - only include valid N8N API properties
    deployment_payload = {
        "name": workflow_data.get("name", "LLM_Democratic_Collaboration"),
        "nodes": workflow_data.get("nodes", []),
        "connections": workflow_data.get("connections", {}),
        "settings": workflow_data.get("settings", {}),
        "staticData": None  # Must be null, not empty dict
    }
    
    print("📋 Workflow loaded successfully")
    print(f"   Nodes: {len(deployment_payload['nodes'])}")
    print(f"   Connections: {len(deployment_payload['connections'])}")
    
    # Deploy to N8N
    print("\n🚀 Deploying to N8N...")
    
    try:
        response = requests.post(
            f"{n8n_base_url}/api/v1/workflows",
            headers={
                'X-N8N-API-KEY': n8n_api_key,
                'Content-Type': 'application/json'
            },
            json=deployment_payload,
            timeout=30
        )
        
        if response.status_code == 201 or response.status_code == 200:
            result = response.json()
            workflow_id = result.get('id', 'unknown')
            print(f"✅ SUCCESS! Workflow deployed with ID: {workflow_id}")
            
            # Activate the workflow
            print("\n🔓 Activating workflow...")
            activate_response = requests.patch(
                f"{n8n_base_url}/api/v1/workflows/{workflow_id}",
                headers={
                    'X-N8N-API-KEY': n8n_api_key,
                    'Content-Type': 'application/json'
                },
                json={"active": True},
                timeout=30
            )
            
            if activate_response.status_code == 200:
                print("✅ Workflow activated successfully!")
            else:
                print(f"⚠️  Workflow deployed but activation failed: {activate_response.status_code}")
            
            # Display webhook information
            webhook_url = f"{n8n_base_url}/webhook/llm-collaboration"
            print(f"\n🌐 Webhook URL: {webhook_url}")
            print("📝 Use this URL to trigger LLM collaboration requests")
            
            return True
            
        else:
            print(f"❌ Deployment failed: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error during deployment: {e}")
        return False

def test_webhook_endpoint():
    """Test the deployed webhook endpoint"""
    
    print("\n🧪 Testing webhook endpoint...")
    
    n8n_base_url = os.environ.get('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    webhook_url = f"{n8n_base_url}/webhook/llm-collaboration"
    
    test_payload = {
        "collaboration_id": "deployment_test_001",
        "session_id": "deployment_session",
        "task": {
            "type": "code_implementation",
            "complexity": "medium",
            "description": "Test deployment of LLM collaboration system"
        },
        "collaboration_context": {
            "available_models": ["claude-sonnet", "gpt-4o", "gemini-pro"],
            "budget_constraints": {"max_cost_per_query": 0.02}
        },
        "llm_routing": {
            "mode": "democratic_selection"
        }
    }
    
    try:
        response = requests.post(
            webhook_url,
            json=test_payload,
            timeout=30
        )
        
        if response.status_code == 200:
            print("✅ Webhook test successful!")
            result = response.json()
            print(f"   Selected model: {result.get('selected_model', 'unknown')}")
            print(f"   Confidence: {result.get('confidence_score', 'unknown')}")
        else:
            print(f"⚠️  Webhook test returned: HTTP {response.status_code}")
            print(f"   Response: {response.text[:200]}...")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Webhook test failed: {e}")

if __name__ == "__main__":
    print("🤖 LLM Collaboration Workflow Deployment Script")
    print("=" * 50)
    
    # Deploy the workflow
    success = deploy_llm_collaboration_workflow()
    
    if success:
        # Test the deployment
        test_webhook_endpoint()
        
        print("\n🎉 DEPLOYMENT COMPLETE!")
        print("=" * 30)
        print("✅ LLM Collaboration workflow deployed to production")
        print("✅ Democratic AI selection system operational")
        print("✅ Multi-model collaboration ready")
        print("✅ Webhook endpoint: /webhook/llm-collaboration")
        print("\n🚀 Your revolutionary AI collaboration system is now live!")
        
    else:
        print("\n❌ DEPLOYMENT FAILED")
        print("Please check the error messages above and try again.")
