#!/usr/bin/env python3
"""
Verify Cleanup Status Script
Checks the current state after manual cleanup of duplicate workflows.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class CleanupVerifier:
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
        """Fetch current workflows from the deployed n8n instance."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            # Handle different response formats
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
    
    def analyze_cleanup_status(self, workflows: List[Dict]) -> Dict:
        """Analyze the current cleanup status."""
        active_workflows = [w for w in workflows if w.get('active', False)]
        inactive_workflows = [w for w in workflows if not w.get('active', False)]
        
        crew_workflows = defaultdict(list)
        system_workflows = []
        
        # Categorize active workflows
        for workflow in active_workflows:
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member and crew_member != 'System Workflow':
                crew_workflows[crew_member].append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'createdAt': workflow.get('createdAt', ''),
                    'updatedAt': workflow.get('updatedAt', ''),
                    'has_memory': self.has_memory_integration(workflow),
                    'has_llm': self.has_llm_integration(workflow)
                })
            else:
                system_workflows.append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': workflow.get('active', False)
                })
        
        # Check for duplicates
        duplicates_found = []
        for crew_member, workflow_list in crew_workflows.items():
            if len(workflow_list) > 1:
                duplicates_found.append({
                    'crew_member': crew_member,
                    'count': len(workflow_list),
                    'workflows': workflow_list
                })
        
        return {
            'total_workflows': len(workflows),
            'active_workflows': len(active_workflows),
            'inactive_workflows': len(inactive_workflows),
            'crew_members': len(crew_workflows),
            'system_workflows': len(system_workflows),
            'duplicates_found': duplicates_found,
            'cleanup_status': 'incomplete' if duplicates_found else 'complete',
            'timestamp': datetime.now().isoformat()
        }
    
    def extract_crew_member(self, workflow_name: str) -> str:
        """Extract crew member name from workflow name."""
        crew_members = [
            'Captain Jean-Luc Picard',
            'Commander William Riker',
            'Dr. Beverly Crusher',
            'Commander Data',
            'Lieutenant Commander Geordi La Forge',
            'Lieutenant Worf',
            'Counselor Deanna Troi',
            'Lieutenant Uhura',
            'Quark'
        ]
        
        for member in crew_members:
            if member.lower() in workflow_name.lower():
                return member
        
        if 'Federation' in workflow_name or 'AlexAI' in workflow_name:
            return 'System Workflow'
        
        return 'Unknown'
    
    def has_memory_integration(self, workflow: Dict) -> bool:
        """Check if workflow has memory integration (Supabase nodes)."""
        nodes = workflow.get('nodes', [])
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'supabase.co' in url:
                        return True
        
        return False
    
    def has_llm_integration(self, workflow: Dict) -> bool:
        """Check if workflow has LLM integration (OpenRouter nodes)."""
        nodes = workflow.get('nodes', [])
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'openrouter.ai' in url:
                        return True
        
        return False
    
    def run_verification(self):
        """Run the cleanup verification."""
        print("🔍 VERIFYING CLEANUP STATUS...")
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Analyze cleanup status
        print("🎯 Analyzing cleanup status...")
        status = self.analyze_cleanup_status(workflows)
        
        # Display results
        print("\n📊 CLEANUP VERIFICATION RESULTS:")
        print("=" * 60)
        
        print(f"Total Workflows: {status['total_workflows']}")
        print(f"Active Workflows: {status['active_workflows']}")
        print(f"Inactive Workflows: {status['inactive_workflows']}")
        print(f"Crew Members: {status['crew_members']}")
        print(f"System Workflows: {status['system_workflows']}")
        print(f"Cleanup Status: {status['cleanup_status'].upper()}")
        print(f"Verification Timestamp: {status['timestamp']}")
        
        # Check for duplicates
        if status['duplicates_found']:
            print(f"\n⚠️  DUPLICATES STILL FOUND: {len(status['duplicates_found'])}")
            print("=" * 40)
            
            for duplicate in status['duplicates_found']:
                print(f"\n🎖️ {duplicate['crew_member']}")
                print(f"   Active Workflows: {duplicate['count']}")
                for wf in duplicate['workflows']:
                    print(f"   - {wf['name']}")
                    print(f"     Memory: {'✅' if wf['has_memory'] else '❌'}")
                    print(f"     LLM: {'✅' if wf['has_llm'] else '❌'}")
        else:
            print("\n✅ NO DUPLICATES FOUND - CLEANUP COMPLETE!")
            print("=" * 40)
            print("🎯 Target achieved: Clean crew system with no duplicates")
        
        # Summary
        print("\n" + "=" * 60)
        if status['cleanup_status'] == 'complete':
            print("🎉 SUCCESS: Crew system is now clean and optimized!")
            print("Next steps: Test crew interactions and verify memory integration")
        else:
            print("⚠️  CLEANUP INCOMPLETE: Duplicates still exist")
            print("Continue manual deactivation of duplicate workflows")
        
        return status

if __name__ == "__main__":
    try:
        verifier = CleanupVerifier()
        verifier.run_verification()
    except Exception as e:
        print(f"❌ Verification failed: {e}")
