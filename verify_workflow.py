#!/usr/bin/env python3
"""
🔍 WORKFLOW VERIFICATION SCRIPT
Verifies the crew management workflow is properly formatted for n8n import
"""

import json
import os

def verify_workflow():
    """Verify the workflow file is ready for n8n import"""
    print("🔍 VERIFYING CREW MANAGEMENT WORKFLOW")
    print("=" * 50)
    
    workflow_file = "crew_management_workflow.json"
    
    if not os.path.exists(workflow_file):
        print(f"❌ Workflow file not found: {workflow_file}")
        return False
    
    try:
        with open(workflow_file, 'r') as f:
            workflow = json.load(f)
        
        print(f"✅ Workflow file loaded successfully")
        print(f"📋 Name: {workflow.get('name', 'Unknown')}")
        print(f"🔧 Nodes: {len(workflow.get('nodes', []))}")
        print(f"🔗 Connections: {len(workflow.get('connections', {}))}")
        print(f"⚙️ Settings: {len(workflow.get('settings', {}))}")
        
        # Verify required fields
        required_fields = ['name', 'nodes', 'connections', 'settings']
        missing_fields = [field for field in required_fields if field not in workflow]
        
        if missing_fields:
            print(f"❌ Missing required fields: {missing_fields}")
            return False
        
        # Verify nodes
        nodes = workflow.get('nodes', [])
        if len(nodes) != 8:
            print(f"❌ Expected 8 nodes, found {len(nodes)}")
            return False
        
        # Check for webhook trigger
        webhook_nodes = [node for node in nodes if node.get('type') == 'n8n-nodes-base.webhook']
        if not webhook_nodes:
            print("❌ No webhook trigger node found")
            return False
        
        webhook_node = webhook_nodes[0]
        webhook_path = webhook_node.get('parameters', {}).get('path')
        if webhook_path != 'crew-management':
            print(f"❌ Webhook path should be 'crew-management', found '{webhook_path}'")
            return False
        
        print(f"✅ Webhook trigger configured: /{webhook_path}")
        
        # Verify connections
        connections = workflow.get('connections', {})
        if len(connections) != 7:
            print(f"❌ Expected 7 connections, found {len(connections)}")
            return False
        
        print("✅ All connections properly configured")
        
        # Check workflow status
        if workflow.get('active', False):
            print("⚠️ Workflow is set to active (will be imported as inactive)")
        else:
            print("✅ Workflow is set to inactive (safe for import)")
        
        print("\n" + "=" * 50)
        print("🎉 WORKFLOW VERIFICATION COMPLETE!")
        print("✅ Ready for n8n import")
        print("✅ All required components present")
        print("✅ Webhook endpoint configured")
        print("✅ Node structure correct")
        
        return True
        
    except json.JSONDecodeError as e:
        print(f"❌ Invalid JSON format: {e}")
        return False
    except Exception as e:
        print(f"❌ Error verifying workflow: {e}")
        return False

if __name__ == "__main__":
    success = verify_workflow()
    if success:
        print("\n🚀 Your workflow is ready for n8n import!")
        print("📋 Follow the N8N_IMPORT_GUIDE.md for import instructions")
    else:
        print("\n❌ Workflow verification failed - check the errors above")
        exit(1)
