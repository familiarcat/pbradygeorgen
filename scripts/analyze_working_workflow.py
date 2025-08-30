#!/usr/bin/env python3
"""
Analyze Working Workflow
Examines a working crew workflow to understand the exact structure needed
"""

import os
import json
import requests
from datetime import datetime

def get_working_workflow():
    """Get a working crew workflow to use as template"""
    
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.getenv('N8N_API_KEY')
    
    if not n8n_api_key:
        print("❌ N8N_API_KEY not set")
        return None
    
    try:
        headers = {'X-N8N-API-KEY': n8n_api_key}
        response = requests.get(f"{n8n_base_url}/api/v1/workflows", headers=headers)
        
        if response.status_code == 200:
            workflows = response.json()
            
            # Handle different response formats
            if isinstance(workflows, dict) and 'data' in workflows:
                workflows = workflows['data']
            
            # Find a working crew workflow (like Data or Picard)
            for workflow in workflows:
                if ('data' in workflow['name'].lower() or 'picard' in workflow['name'].lower()) and 'crew' in workflow['name'].lower():
                    print(f"📋 Found working workflow: {workflow['name']}")
                    
                    # Get the full workflow details
                    detail_response = requests.get(
                        f"{n8n_base_url}/api/v1/workflows/{workflow['id']}",
                        headers=headers
                    )
                    
                    if detail_response.status_code == 200:
                        full_workflow = detail_response.json()
                        print(f"✅ Retrieved workflow structure: {workflow['id']}")
                        return full_workflow
                    
        return None
        
    except Exception as e:
        print(f"❌ Error getting workflows: {e}")
        return None

def create_riker_from_template(template_workflow):
    """Create Riker workflow based on working template"""
    
    if not template_workflow:
        print("❌ No template workflow provided")
        return False
        
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.getenv('N8N_API_KEY')
    
    # Create Riker workflow by modifying template
    riker_workflow = template_workflow.copy()
    
    # Remove fields that shouldn't be in create/update requests
    fields_to_remove = ['id', 'createdAt', 'updatedAt', 'versionId', 'sharedWith']
    for field in fields_to_remove:
        riker_workflow.pop(field, None)
    
    # Update the workflow for Riker
    riker_workflow['name'] = "Crew - Commander William Riker - Tactical Execution & Workflow Management"
    riker_workflow['active'] = True
    
    # Update webhook path in nodes
    if 'nodes' in riker_workflow:
        for node in riker_workflow['nodes']:
            if node['type'] == 'n8n-nodes-base.webhook':
                node['parameters']['path'] = 'crew-commander-william-riker'
                node['name'] = 'Commander Riker Webhook'
            elif node['type'] == 'n8n-nodes-base.respondToWebhook':
                # Update response for Riker
                if 'responseBody' in node['parameters']:
                    node['parameters']['responseBody'] = {
                        "agent": "Commander William Riker",
                        "role": "Tactical Execution & Workflow Management", 
                        "status": "operational",
                        "message": "Tactical directive received and execution analysis initiated",
                        "specialization": "tactical_execution_workflow_management",
                        "timestamp": "={{$now.format('yyyy-MM-dd HH:mm:ss')}}",
                        "capabilities": [
                            "tactical_execution",
                            "workflow_management", 
                            "project_coordination",
                            "operational_efficiency",
                            "mission_leadership"
                        ]
                    }
    
    print("🔧 Creating Riker workflow from template...")
    print(f"📋 Template: {template_workflow.get('name', 'Unknown')}")
    
    # Get existing Riker workflow ID
    riker_workflow_id = get_riker_workflow_id(n8n_base_url, n8n_api_key)
    
    headers = {
        'X-N8N-API-KEY': n8n_api_key,
        'Content-Type': 'application/json'
    }
    
    try:
        if riker_workflow_id:
            # Update existing workflow
            print(f"🔄 Updating existing Riker workflow: {riker_workflow_id}")
            response = requests.put(
                f"{n8n_base_url}/api/v1/workflows/{riker_workflow_id}",
                json=riker_workflow,
                headers=headers,
                timeout=30
            )
        else:
            # Create new workflow  
            print("🆕 Creating new Riker workflow...")
            response = requests.post(
                f"{n8n_base_url}/api/v1/workflows",
                json=riker_workflow,
                headers=headers,
                timeout=30
            )
        
        if response.status_code in [200, 201]:
            print("✅ Riker workflow created/updated successfully!")
            return True
        else:
            print(f"❌ Failed to create/update workflow: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Save the workflow data for debugging
            with open('riker_workflow_debug.json', 'w') as f:
                json.dump(riker_workflow, f, indent=2)
            print("🐛 Debug data saved to riker_workflow_debug.json")
            return False
            
    except Exception as e:
        print(f"❌ Error creating workflow: {e}")
        return False

def get_riker_workflow_id(n8n_base_url, n8n_api_key):
    """Get existing Riker workflow ID"""
    try:
        headers = {'X-N8N-API-KEY': n8n_api_key}
        response = requests.get(f"{n8n_base_url}/api/v1/workflows", headers=headers)
        
        if response.status_code == 200:
            workflows = response.json()
            
            if isinstance(workflows, dict) and 'data' in workflows:
                workflows = workflows['data']
            
            for workflow in workflows:
                if 'riker' in workflow['name'].lower() and 'william' in workflow['name'].lower():
                    return workflow['id']
        
        return None
        
    except Exception as e:
        print(f"⚠️ Could not get existing workflow ID: {e}")
        return None

def test_riker_webhook():
    """Test the Riker webhook"""
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    
    print("\n🧪 Testing Riker webhook...")
    
    test_payload = {
        "test": "riker_workflow_template_test",
        "crewMember": "riker",
        "task": "Template-based workflow test",
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        response = requests.post(
            f"{n8n_base_url}/webhook/crew-commander-william-riker",
            json=test_payload,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Riker webhook is working!")
            try:
                response_data = response.json()
                print(f"📋 Response: {json.dumps(response_data, indent=2)}")
            except:
                print(f"📋 Response: {response.text}")
            return True
        else:
            print(f"❌ Webhook test failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing webhook: {e}")
        return False

def main():
    print("🔍 Working Workflow Analysis & Riker Creation")
    print("=" * 55)
    
    # Get a working workflow as template
    print("🔍 Finding working workflow template...")
    template = get_working_workflow()
    
    if template:
        # Create Riker workflow from template
        if create_riker_from_template(template):
            print("\n🎉 Riker workflow creation completed!")
            
            # Test the webhook
            if test_riker_webhook():
                print("\n🎯 SUCCESS: Riker is fully operational!")
            else:
                print("\n⚠️ Workflow created but webhook needs verification")
        else:
            print("\n❌ Failed to create Riker workflow")
    else:
        print("❌ Could not find working template workflow")

if __name__ == "__main__":
    main()