#!/usr/bin/env python3
"""
Verify N8n Restoration State
Checks the actual state of the n8n instance after restoration attempts.
"""

import json
import requests
import os
from typing import Dict, List

class N8nRestorationVerifier:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
    
    def fetch_current_workflows(self) -> List[Dict]:
        """Fetch all current workflows from n8n."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and 'data' in data:
                return data['data']
            elif isinstance(data, str):
                try:
                    return json.loads(data)
                except json.JSONDecodeError:
                    print(f"❌ Failed to parse response as JSON: {data[:100]}...")
                    return []
            else:
                print(f"❌ Unexpected response format: {type(data)}")
                return []
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return []
    
    def analyze_restoration_state(self):
        """Analyze the current state of the n8n instance."""
        print("🔍 VERIFYING N8N RESTORATION STATE...")
        print("=" * 60)
        
        # Fetch current workflows
        current_workflows = self.fetch_current_workflows()
        
        if not current_workflows:
            print("❌ No workflows found on n8n instance!")
            return
        
        print(f"📋 Found {len(current_workflows)} workflows on n8n instance")
        
        # Categorize workflows
        crew_workflows = []
        system_workflows = []
        other_workflows = []
        
        for workflow in current_workflows:
            name = workflow.get('name', '')
            workflow_id = workflow.get('id', '')
            active = workflow.get('active', False)
            
            if name.startswith('Crew -'):
                crew_workflows.append({
                    'id': workflow_id,
                    'name': name,
                    'active': active
                })
            elif name.startswith('System -'):
                system_workflows.append({
                    'id': workflow_id,
                    'name': name,
                    'active': active
                })
            else:
                other_workflows.append({
                    'id': workflow_id,
                    'name': name,
                    'active': active
                })
        
        # Display results
        print(f"\n📊 WORKFLOW ANALYSIS:")
        print(f"   🚀 Crew Workflows: {len(crew_workflows)}")
        print(f"   ⚙️  System Workflows: {len(system_workflows)}")
        print(f"   🔧 Other Workflows: {len(other_workflows)}")
        print(f"   📈 Total: {len(current_workflows)}")
        
        # Check for Commander Riker specifically
        riker_found = False
        for crew_workflow in crew_workflows:
            if 'Commander William Riker' in crew_workflow['name']:
                riker_found = True
                print(f"\n✅ COMMANDER RIKER FOUND:")
                print(f"   ID: {crew_workflow['id']}")
                print(f"   Name: {crew_workflow['name']}")
                print(f"   Active: {crew_workflow['active']}")
                break
        
        if not riker_found:
            print(f"\n❌ COMMANDER RIKER NOT FOUND!")
        
        # Display all crew workflows
        if crew_workflows:
            print(f"\n🚀 CREW WORKFLOWS:")
            for i, workflow in enumerate(crew_workflows, 1):
                status = "🟢 ACTIVE" if workflow['active'] else "🔴 INACTIVE"
                print(f"   {i}. {workflow['name']}")
                print(f"      ID: {workflow['id']} | Status: {status}")
        
        # Display all system workflows
        if system_workflows:
            print(f"\n⚙️  SYSTEM WORKFLOWS:")
            for i, workflow in enumerate(system_workflows, 1):
                status = "🟢 ACTIVE" if workflow['active'] else "🔴 INACTIVE"
                print(f"   {i}. {workflow['name']}")
                print(f"      ID: {workflow['id']} | Status: {status}")
        
        # Display other workflows
        if other_workflows:
            print(f"\n🔧 OTHER WORKFLOWS:")
            for i, workflow in enumerate(other_workflows, 1):
                status = "🟢 ACTIVE" if workflow['active'] else "🔴 INACTIVE"
                print(f"   {i}. {workflow['name']}")
                print(f"      ID: {workflow['id']} | Status: {status}")
        
        # Final assessment
        print(f"\n📊 FINAL ASSESSMENT:")
        print("=" * 40)
        
        if len(crew_workflows) == 9 and len(system_workflows) == 4:
            print("🎉 RESTORATION SUCCESSFUL!")
            print("   ✅ All 9 crew members restored")
            print("   ✅ All 4 system workflows restored")
            print("   ✅ Total: 13 workflows (expected)")
            
            if riker_found:
                print("   ✅ Commander Riker is present")
            else:
                print("   ❌ Commander Riker is missing")
                
        elif len(current_workflows) > 0:
            print("⚠️  PARTIAL RESTORATION:")
            print(f"   📋 Found {len(current_workflows)} workflows")
            print(f"   🚀 Crew: {len(crew_workflows)}/9")
            print(f"   ⚙️  System: {len(system_workflows)}/4")
            
            if riker_found:
                print("   ✅ Commander Riker is present")
            else:
                print("   ❌ Commander Riker is missing")
        else:
            print("❌ RESTORATION FAILED:")
            print("   No workflows found on n8n instance")
        
        return current_workflows

if __name__ == "__main__":
    try:
        verifier = N8nRestorationVerifier()
        workflows = verifier.analyze_restoration_state()
        
        if workflows:
            print(f"\n🚀 Next steps:")
            print("1. Verify workflow functionality")
            print("2. Test crew member responses")
            print("3. Activate workflows if needed")
        else:
            print(f"\n⚠️  No workflows found. Manual restoration required.")
            
    except Exception as e:
        print(f"❌ Verification failed: {e}")
