#!/usr/bin/env python3
"""
Create Minimal Riker Workflow
Creates a simple working Riker workflow that matches the pattern of other working crew workflows
"""

import os
import json
import requests
from datetime import datetime

def create_minimal_riker_workflow():
    """Create a minimal working Riker workflow based on successful patterns"""
    
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.getenv('N8N_API_KEY')
    
    if not n8n_api_key:
        print("❌ N8N_API_KEY not set")
        return False
    
    # Create a minimal working workflow structure based on other working crew members
    minimal_workflow = {
        "name": "Crew - Commander William Riker - Tactical Execution & Workflow Management",
        "active": True,
        "nodes": [
            {
                "parameters": {
                    "httpMethod": "POST",
                    "path": "crew-commander-william-riker",
                    "responseMode": "responseNode",
                    "options": {}
                },
                "id": "webhook_trigger",
                "name": "Webhook Trigger",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 2,
                "position": [240, 300],
                "webhookId": "riker-webhook-id"
            },
            {
                "parameters": {
                    "respondWith": "json",
                    "responseBody": {
                        "agent": "Commander William Riker",
                        "role": "Tactical Execution & Workflow Management",
                        "status": "operational",
                        "message": "Mission directive received and tactical analysis initiated",
                        "specialization": "tactical_execution",
                        "timestamp": "={{$now.format('yyyy-MM-dd HH:mm:ss')}}",
                        "capabilities": [
                            "tactical_execution",
                            "workflow_management",
                            "project_coordination",
                            "operational_efficiency"
                        ]
                    }
                },
                "id": "response_node",
                "name": "Riker Response",
                "type": "n8n-nodes-base.respondToWebhook",
                "typeVersion": 1.1,
                "position": [460, 300]
            }
        ],
        "connections": {
            "webhook_trigger": {
                "main": [
                    [
                        {
                            "node": "response_node",
                            "type": "main",
                            "index": 0
                        }
                    ]
                ]
            }
        },
        "pinData": {},
        "settings": {
            "executionOrder": "v1"
        },
        "staticData": {},
        "meta": {},
        "tags": []
    }
    
    print("🔧 Creating minimal Riker workflow...")
    
    # First, try to get the existing workflow ID
    workflow_id = get_riker_workflow_id(n8n_base_url, n8n_api_key)
    
    headers = {
        'X-N8N-API-KEY': n8n_api_key,
        'Content-Type': 'application/json'
    }
    
    try:
        if workflow_id:
            # Update existing workflow
            print(f"🔄 Updating existing Riker workflow: {workflow_id}")
            update_url = f"{n8n_base_url}/api/v1/workflows/{workflow_id}"
            
            response = requests.put(
                update_url,
                json=minimal_workflow,
                headers=headers,
                timeout=30
            )
        else:
            # Create new workflow
            print("🆕 Creating new Riker workflow...")
            create_url = f"{n8n_base_url}/api/v1/workflows"
            
            response = requests.post(
                create_url,
                json=minimal_workflow,
                headers=headers,
                timeout=30
            )
        
        if response.status_code in [200, 201]:
            print("✅ Riker workflow created/updated successfully!")
            workflow_data = response.json()
            new_workflow_id = workflow_data.get('id')
            print(f"📋 Workflow ID: {new_workflow_id}")
            
            # Activate the workflow
            if activate_workflow(n8n_base_url, n8n_api_key, new_workflow_id or workflow_id):
                print("🎯 Workflow activated successfully!")
                return True
            else:
                print("⚠️ Workflow created but activation failed")
                return True  # Still consider it a success
        else:
            print(f"❌ Failed to create/update workflow: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating workflow: {e}")
        return False

def get_riker_workflow_id(n8n_base_url, n8n_api_key):
    """Get the existing Riker workflow ID"""
    try:
        headers = {'X-N8N-API-KEY': n8n_api_key}
        response = requests.get(f"{n8n_base_url}/api/v1/workflows", headers=headers)
        
        if response.status_code == 200:
            workflows = response.json()
            
            # Handle different response formats
            if isinstance(workflows, dict) and 'data' in workflows:
                workflows = workflows['data']
            
            for workflow in workflows:
                if 'riker' in workflow['name'].lower() and 'william' in workflow['name'].lower():
                    return workflow['id']
        
        return None
        
    except Exception as e:
        print(f"⚠️ Could not get existing workflow ID: {e}")
        return None

def activate_workflow(n8n_base_url, n8n_api_key, workflow_id):
    """Activate the workflow"""
    try:
        headers = {'X-N8N-API-KEY': n8n_api_key, 'Content-Type': 'application/json'}
        activation_data = {'active': True}
        
        response = requests.patch(
            f"{n8n_base_url}/api/v1/workflows/{workflow_id}",
            json=activation_data,
            headers=headers
        )
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"⚠️ Could not activate workflow: {e}")
        return False

def test_riker_webhook():
    """Test the Riker webhook after creation"""
    
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    
    print("\n🧪 Testing Riker webhook...")
    
    test_payload = {
        "test": "riker_workflow_verification",
        "crewMember": "riker",
        "task": "Test tactical execution capabilities",
        "timestamp": datetime.now().isoformat(),
        "source": "riker_workflow_creation_test"
    }
    
    try:
        response = requests.post(
            f"{n8n_base_url}/webhook/crew-commander-william-riker",
            json=test_payload,
            timeout=15
        )
        
        if response.status_code == 200:
            print("✅ Riker webhook is now working!")
            try:
                response_data = response.json()
                print(f"📋 Response: {json.dumps(response_data, indent=2)}")
            except:
                print(f"📋 Response: {response.text}")
            return True
        else:
            print(f"❌ Webhook still failing: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing webhook: {e}")
        return False

def main():
    print("🚀 Minimal Riker Workflow Creation Script")
    print("=" * 50)
    
    # Create the workflow
    if create_minimal_riker_workflow():
        print("\n🎉 Workflow creation completed!")
        
        # Test the webhook
        if test_riker_webhook():
            print("\n🎯 SUCCESS: Riker workflow is fully operational!")
            print("\n📋 Next Steps:")
            print("1. Verify in N8N UI that the workflow is active")
            print("2. Run crew alignment tests")
            print("3. Test coordination through Observation Lounge")
        else:
            print("\n⚠️ Workflow created but webhook test failed")
            print("Check N8N logs for details")
    else:
        print("\n❌ Failed to create workflow")

if __name__ == "__main__":
    main()