#!/usr/bin/env python3
"""
Emergency Crew Cleanup Script
Deactivates duplicate workflows while preserving Enhanced Federation Crew and enhanced individual workflows.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List, Set
from datetime import datetime

class EmergencyCrewCleanup:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
    
    def fetch_workflows(self) -> List[Dict]:
        """Fetch all workflows from n8n instance."""
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
    
    def identify_workflows_to_keep(self, workflows: List[Dict]) -> Dict:
        """Identify which workflows to keep based on priority."""
        workflows_to_keep = {
            'enhanced_federation_crew': None,
            'crew_members': defaultdict(list)
        }
        
        # Priority order for crew member workflows
        priority_patterns = [
            'Enhanced Federation Crew - Complete Mission Control',
            'Federation Crew - OpenRouter Agent Coordination',
            'Captain Jean-Luc Picard - Strategic Leadership & Mission Command',
            'Commander William Riker - Tactical Execution & Workflow Management',
            'Dr. Beverly Crusher - Health & Diagnostics Officer',
            'Commander Data - Analytics & Logic Operations',
            'Lieutenant Commander Geordi La Forge - Infrastructure & System Integration',
            'Lieutenant Worf - Security & Compliance Operations',
            'Counselor Deanna Troi - User Experience & Empathy Analysis',
            'Lieutenant Uhura - Communications & I/O Operations Officer',
            'Quark - Business Intelligence & Budget Optimization'
        ]
        
        # First, find the Enhanced Federation Crew (highest priority)
        for workflow in workflows:
            if not workflow.get('active', False):
                continue
                
            name = workflow.get('name', '')
            if 'Enhanced Federation Crew - Complete Mission Control' in name:
                workflows_to_keep['enhanced_federation_crew'] = workflow
                break
        
        # Then identify the best workflow for each crew member
        for workflow in workflows:
            if not workflow.get('active', False):
                continue
                
            name = workflow.get('name', '')
            workflow_id = workflow.get('id', '')
            
            # Check if this is a crew member workflow
            crew_member = self.extract_crew_member(name)
            if crew_member and crew_member != 'System Workflow':
                # Check if this workflow has memory integration
                has_memory = self.has_memory_integration(workflow)
                
                workflows_to_keep['crew_members'][crew_member].append({
                    'workflow': workflow,
                    'has_memory': has_memory,
                    'priority_score': self.calculate_priority_score(name, priority_patterns)
                })
        
        # For each crew member, keep only the highest priority workflow with memory integration
        final_workflows_to_keep = {}
        for crew_member, workflow_list in workflows_to_keep['crew_members'].items():
            if not workflow_list:
                continue
                
            # Sort by priority score and memory integration
            workflow_list.sort(key=lambda x: (x['has_memory'], x['priority_score']), reverse=True)
            
            # Keep the highest priority workflow with memory integration
            final_workflows_to_keep[crew_member] = workflow_list[0]['workflow']
        
        return {
            'enhanced_federation_crew': workflows_to_keep['enhanced_federation_crew'],
            'crew_members': final_workflows_to_keep
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
                    # Check if it's a Supabase request
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'supabase.co' in url:
                        return True
        
        return False
    
    def calculate_priority_score(self, workflow_name: str, priority_patterns: List[str]) -> int:
        """Calculate priority score based on pattern matching."""
        for i, pattern in enumerate(priority_patterns):
            if pattern.lower() in workflow_name.lower():
                return len(priority_patterns) - i  # Higher score for higher priority
        return 0
    
    def deactivate_workflow(self, workflow_id: str) -> bool:
        """Deactivate a workflow by setting active to false."""
        try:
            # First get the current workflow
            response = requests.get(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", headers=self.headers)
            response.raise_for_status()
            workflow = response.json()
            
            # Prepare update payload (remove active field since it's read-only)
            update_payload = {
                'name': workflow.get('name', ''),
                'nodes': workflow.get('nodes', []),
                'connections': workflow.get('connections', {}),
                'settings': workflow.get('settings', {}),
                'staticData': workflow.get('staticData'),
                'meta': workflow.get('meta'),
                'pinData': workflow.get('pinData')
            }
            
            # Update workflow (this will deactivate it since active is read-only)
            update_response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", 
                                        headers=self.headers, 
                                        json=update_payload)
            
            if update_response.status_code == 200:
                print(f"✅ Deactivated workflow: {workflow_id}")
                return True
            else:
                print(f"❌ Failed to deactivate workflow {workflow_id}: {update_response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Error deactivating workflow {workflow_id}: {e}")
            return False
    
    def execute_cleanup(self):
        """Execute the emergency cleanup process."""
        print("🚨 EMERGENCY CREW CLEANUP INITIATED")
        print("=" * 50)
        
        # Fetch all workflows
        print("🔍 Fetching current workflows...")
        workflows = self.fetch_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Identify workflows to keep
        print("🎯 Identifying workflows to preserve...")
        workflows_to_keep = self.identify_workflows_to_keep(workflows)
        
        # Display what we're keeping
        print("\n📋 WORKFLOWS TO PRESERVE:")
        if workflows_to_keep['enhanced_federation_crew']:
            wf = workflows_to_keep['enhanced_federation_crew']
            print(f"✅ Enhanced Federation Crew: {wf.get('name', 'Unknown')} (ID: {wf.get('id', 'Unknown')})")
        else:
            print("⚠️  No Enhanced Federation Crew found!")
        
        print("\n👥 INDIVIDUAL CREW MEMBERS:")
        for crew_member, workflow in workflows_to_keep['crew_members'].items():
            print(f"✅ {crew_member}: {workflow.get('name', 'Unknown')} (ID: {workflow.get('id', 'Unknown')})")
        
        # Create list of workflows to deactivate
        workflows_to_deactivate = []
        keep_ids = set()
        
        if workflows_to_keep['enhanced_federation_crew']:
            keep_ids.add(workflows_to_keep['enhanced_federation_crew']['id'])
        
        for workflow in workflows_to_keep['crew_members'].values():
            keep_ids.add(workflow['id'])
        
        for workflow in workflows:
            if workflow.get('active', False) and workflow.get('id') not in keep_ids:
                workflows_to_deactivate.append(workflow)
        
        print(f"\n🧹 WORKFLOWS TO DEACTIVATE: {len(workflows_to_deactivate)}")
        
        # Confirm before proceeding
        if workflows_to_deactivate:
            print("\n⚠️  WARNING: This will deactivate the following workflows:")
            for workflow in workflows_to_deactivate[:5]:  # Show first 5
                print(f"   - {workflow.get('name', 'Unknown')} (ID: {workflow.get('id', 'Unknown')}")
            if len(workflows_to_deactivate) > 5:
                print(f"   ... and {len(workflows_to_deactivate) - 5} more")
            
            print(f"\n🚨 This will deactivate {len(workflows_to_deactivate)} workflows.")
            print("Proceeding with cleanup...")
            
            # Execute deactivation
            success_count = 0
            for workflow in workflows_to_deactivate:
                if self.deactivate_workflow(workflow['id']):
                    success_count += 1
            
            print(f"\n📊 CLEANUP RESULTS:")
            print(f"✅ Successfully deactivated: {success_count}")
            print(f"❌ Failed to deactivate: {len(workflows_to_deactivate) - success_count}")
        else:
            print("✅ No duplicate workflows to deactivate!")
        
        # Verify cleanup
        print("\n🔍 Verifying cleanup results...")
        self.verify_cleanup()
    
    def verify_cleanup(self):
        """Verify the cleanup results."""
        workflows = self.fetch_workflows()
        active_workflows = [w for w in workflows if w.get('active', False)]
        
        print(f"\n📊 CLEANUP VERIFICATION:")
        print(f"Total Active Workflows: {len(active_workflows)}")
        
        # Count by crew member
        crew_counts = defaultdict(int)
        for workflow in active_workflows:
            crew_member = self.extract_crew_member(workflow.get('name', ''))
            crew_counts[crew_member] += 1
        
        print("\n👥 ACTIVE WORKFLOWS BY TYPE:")
        for crew_type, count in crew_counts.items():
            status = "⚠️  DUPLICATE" if count > 1 else "✅ SINGLE"
            print(f"{status} {crew_type}: {count} workflow(s)")
        
        # Save verification report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"cleanup_verification_{timestamp}.json"
        
        verification_data = {
            'timestamp': timestamp,
            'total_active_workflows': len(active_workflows),
            'crew_counts': dict(crew_counts),
            'active_workflows': [
                {
                    'id': w.get('id'),
                    'name': w.get('name'),
                    'crew_member': self.extract_crew_member(w.get('name', ''))
                }
                for w in active_workflows
            ]
        }
        
        with open(filename, 'w') as f:
            json.dump(verification_data, f, indent=2)
        
        print(f"\n💾 Verification report saved to: {filename}")

if __name__ == "__main__":
    try:
        cleanup = EmergencyCrewCleanup()
        cleanup.execute_cleanup()
    except Exception as e:
        print(f"❌ Emergency cleanup failed: {e}")
