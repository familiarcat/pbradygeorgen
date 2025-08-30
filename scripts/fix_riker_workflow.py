#!/usr/bin/env python3
"""
Fix Riker Workflow Script
Updates the broken Riker workflow with correct node connections
"""

import os
import json
import requests
from datetime import datetime

def fix_riker_workflow():
    """Fix the Riker workflow by updating it with correct connections"""
    
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    n8n_api_key = os.getenv('N8N_API_KEY')
    
    if not n8n_api_key:
        print("❌ N8N_API_KEY not set")
        return False
    
    # Load the corrected workflow
    workflow_file = "workflow_systems/standardized_crew/standardized_crew_workflows/standardized_riker_workflow_fixed.json"
    
    try:
        with open(workflow_file, 'r') as f:
            corrected_workflow = json.load(f)
    except FileNotFoundError:
        print(f"❌ Workflow file not found: {workflow_file}")
        return False
    
    # Get the current workflow ID
    workflow_id = "Imn7p6pVgi6SRvnF"  # Riker workflow ID from our scraping
    
    print(f"🔧 Fixing Riker workflow: {workflow_id}")
    print(f"📁 Loading corrected workflow from: {workflow_file}")
    
    # Update the workflow
    update_url = f"{n8n_base_url}/api/v1/workflows/{workflow_id}"
    
    headers = {
        'X-N8N-API-KEY': n8n_api_key,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.put(
            update_url,
            json=corrected_workflow,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            print("✅ Riker workflow updated successfully!")
            print("🔄 The workflow should now work properly")
            return True
        else:
            print(f"❌ Failed to update workflow: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error updating workflow: {e}")
        return False

def test_riker_workflow():
    """Test the Riker workflow after fixing"""
    
    n8n_base_url = os.getenv('N8N_BASE_URL', 'https://n8n.pbradygeorgen.com')
    
    print("\n🧪 Testing Riker workflow...")
    
    test_payload = {
        "test": "workflow_fix_verification",
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        response = requests.post(
            f"{n8n_base_url}/webhook/crew-commander-william-riker",
            json=test_payload,
            timeout=10
        )
        
        if response.status_code == 200:
            print("✅ Riker workflow is now working!")
            print(f"Response: {response.text[:100]}...")
            return True
        else:
            print(f"❌ Workflow still failing: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing workflow: {e}")
        return False

def main():
    print("🚀 Riker Workflow Fix Script")
    print("=" * 40)
    
    # Fix the workflow
    if fix_riker_workflow():
        # Test the workflow
        test_riker_workflow()
    else:
        print("❌ Failed to fix workflow")

if __name__ == "__main__":
    main()
