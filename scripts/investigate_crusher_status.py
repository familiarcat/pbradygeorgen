#!/usr/bin/env python3
"""
Investigate Dr. Crusher Status Script
Finds out what happened to Dr. Beverly Crusher's workflows.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class CrusherInvestigator:
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
    
    def investigate_crusher(self, workflows: List[Dict]) -> Dict:
        """Investigate Dr. Crusher's workflow status."""
        crusher_workflows = []
        all_crusher_related = []
        
        # Look for any workflow with "Crusher" in the name
        for workflow in workflows:
            name = workflow.get('name', '')
            if 'crusher' in name.lower():
                crusher_workflows.append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': workflow.get('active', False),
                    'createdAt': workflow.get('createdAt', ''),
                    'updatedAt': workflow.get('updatedAt', ''),
                    'formatted_created': self.format_timestamp(workflow.get('createdAt', '')),
                    'formatted_updated': self.format_timestamp(workflow.get('updatedAt', '')),
                    'has_memory': self.has_memory_integration(workflow),
                    'has_llm': self.has_llm_integration(workflow),
                    'workflow_url': f"{self.n8n_url}/workflow/{workflow.get('id', '')}"
                })
                all_crusher_related.append(workflow)
        
        # Also check for "Beverly" workflows
        for workflow in workflows:
            name = workflow.get('name', '')
            if 'beverly' in name.lower() and workflow not in all_crusher_related:
                crusher_workflows.append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': workflow.get('active', False),
                    'createdAt': workflow.get('createdAt', ''),
                    'updatedAt': workflow.get('updatedAt', ''),
                    'formatted_created': self.format_timestamp(workflow.get('createdAt', '')),
                    'formatted_updated': self.format_timestamp(workflow.get('updatedAt', '')),
                    'has_memory': self.has_memory_integration(workflow),
                    'has_llm': self.has_llm_integration(workflow),
                    'workflow_url': f"{self.n8n_url}/workflow/{workflow.get('id', '')}"
                })
        
        # Check for "Health" or "Medical" workflows that might be Crusher
        for workflow in workflows:
            name = workflow.get('name', '')
            if any(term in name.lower() for term in ['health', 'medical', 'doctor', 'dr.']) and workflow not in all_crusher_related:
                if 'crusher' not in name.lower() and 'beverly' not in name.lower():
                    # This might be Crusher's workflow with a different naming pattern
                    crusher_workflows.append({
                        'id': workflow.get('id', ''),
                        'name': name,
                        'active': workflow.get('active', False),
                        'createdAt': workflow.get('createdAt', ''),
                        'updatedAt': workflow.get('updatedAt', ''),
                        'formatted_created': self.format_timestamp(workflow.get('createdAt', '')),
                        'formatted_updated': self.format_timestamp(workflow.get('updatedAt', '')),
                        'has_memory': self.has_memory_integration(workflow),
                        'has_llm': self.has_llm_integration(workflow),
                        'workflow_url': f"{self.n8n_url}/workflow/{workflow.get('id', '')}",
                        'note': 'Possible Crusher workflow with different naming'
                    })
        
        return {
            'crusher_workflows': crusher_workflows,
            'total_found': len(crusher_workflows),
            'active_count': len([w for w in crusher_workflows if w.get('active', False)]),
            'inactive_count': len([w for w in crusher_workflows if not w.get('active', False)]),
            'timestamp': datetime.now().isoformat()
        }
    
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
    
    def format_timestamp(self, timestamp_str: str) -> str:
        """Format timestamp for display."""
        try:
            dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            now = datetime.now(dt.tzinfo)
            diff = now - dt
            
            if diff.days > 0:
                return f"{diff.days} day(s) ago"
            elif diff.seconds > 3600:
                hours = diff.seconds // 3600
                return f"{hours} hour(s) ago"
            elif diff.seconds > 60:
                minutes = diff.seconds // 60
                return f"{minutes} minute(s) ago"
            else:
                return "Just now"
        except:
            return timestamp_str
    
    def run_investigation(self):
        """Run the Dr. Crusher investigation."""
        print("🔍 INVESTIGATING DR. CRUSHER'S STATUS...")
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Investigate Dr. Crusher
        print("🎯 Investigating Dr. Beverly Crusher...")
        investigation = self.investigate_crusher(workflows)
        
        # Display results
        print("\n📊 DR. CRUSHER INVESTIGATION RESULTS:")
        print("=" * 60)
        
        print(f"Total Crusher-related workflows found: {investigation['total_found']}")
        print(f"Active Crusher workflows: {investigation['active_count']}")
        print(f"Inactive Crusher workflows: {investigation['inactive_count']}")
        print(f"Investigation Timestamp: {investigation['timestamp']}")
        
        if investigation['crusher_workflows']:
            print("\n🎖️ DR. BEVERLY CRUSHER WORKFLOWS FOUND:")
            print("=" * 50)
            
            for i, workflow in enumerate(investigation['crusher_workflows'], 1):
                print(f"\n{i}. Workflow ID: {workflow['id']}")
                print(f"   Name: {workflow['name']}")
                print(f"   Status: {'🟢 ACTIVE' if workflow['active'] else '🔴 INACTIVE'}")
                print(f"   Last Updated: {workflow['formatted_updated']}")
                print(f"   Memory Integration: {'✅' if workflow['has_memory'] else '❌'}")
                print(f"   LLM Integration: {'✅' if workflow['has_llm'] else '❌'}")
                print(f"   Workflow URL: {workflow['workflow_url']}")
                if 'note' in workflow:
                    print(f"   Note: {workflow['note']}")
        else:
            print("\n❌ NO DR. CRUSHER WORKFLOWS FOUND!")
            print("=" * 40)
            print("This suggests Dr. Crusher's workflows may have been:")
            print("- Deleted accidentally")
            print("- Renamed to something unrecognizable")
            print("- Never deployed")
            print("- Deactivated and hidden")
        
        # Summary
        print("\n" + "=" * 60)
        if investigation['total_found'] > 0:
            print("🎯 Dr. Crusher workflows found - proceed with cleanup")
        else:
            print("⚠️  Dr. Crusher workflows missing - investigation required")
            print("Check if workflows were accidentally deleted or renamed")
        
        return investigation

if __name__ == "__main__":
    try:
        investigator = CrusherInvestigator()
        investigator.run_investigation()
    except Exception as e:
        print(f"❌ Investigation failed: {e}")
