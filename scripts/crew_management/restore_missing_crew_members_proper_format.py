#!/usr/bin/env python3
"""
Restore Missing Crew Members with Proper N8N Format
Recreates Crusher, Uhura, and Quark using Captain Picard's optimal template structure.
"""

import json
import requests
import os
import uuid
from typing import Dict, List
from datetime import datetime

class MissingCrewMemberRestorer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Store restoration results
        self.restoration_results = {}
        
    def fetch_picard_template(self) -> Dict:
        """Fetch Captain Picard's workflow as the optimal template."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list):
                workflows = data
            elif isinstance(data, dict) and 'data' in data:
                workflows = data['data']
            else:
                return {}
            
            for workflow in workflows:
                name = workflow.get('name', '')
                if 'Captain Jean-Luc Picard' in name:
                    print(f"✅ Found Captain Picard's optimal template: {name}")
                    return workflow
            
            print("❌ Captain Picard's workflow not found!")
            return {}
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch Picard's template: {e}")
            return {}
    
    def create_crew_workflow_from_picard(self, picard_workflow: Dict, crew_name: str, crew_role: str, webhook_path: str, crew_prompt: str) -> Dict:
        """Create a crew workflow by copying Picard's structure exactly and updating only crew-specific content."""
        
        print(f"   🔧 Creating properly formatted workflow for {crew_name}...")
        
        # Deep copy Picard's workflow EXACTLY (preserve all n8n metadata)
        crew_workflow = json.loads(json.dumps(picard_workflow))
        
        # Update workflow metadata
        crew_workflow['name'] = f"Crew - {crew_name} - {crew_role}"
        
        # Generate new workflow ID
        crew_workflow['id'] = str(uuid.uuid4())
        
        # Update timestamps
        current_time = datetime.now().isoformat()
        crew_workflow['createdAt'] = current_time
        crew_workflow['updatedAt'] = current_time
        
        # Generate new IDs for all nodes (but preserve all other node properties)
        old_to_new_ids = {}
        for node in crew_workflow.get('nodes', []):
            old_id = node.get('id', '')
            new_id = str(uuid.uuid4())
            old_to_new_ids[old_id] = new_id
            node['id'] = new_id
        
        # Update connections with new node IDs (preserve exact connection structure)
        new_connections = {}
        for source_id, targets in crew_workflow.get('connections', {}).items():
            if source_id in old_to_new_ids:
                new_source_id = old_to_new_ids[source_id]
                new_connections[new_source_id] = targets
            else:
                new_connections[source_id] = targets
        
        crew_workflow['connections'] = new_connections
        
        # Update node content for the specific crew member (preserve all n8n metadata)
        for node in crew_workflow.get('nodes', []):
            node_name = node.get('name', '')
            
            # Update directive node
            if 'Directive' in node_name:
                node['name'] = f"{crew_name} Directive"
                if 'parameters' in node and 'path' in node['parameters']:
                    node['parameters']['path'] = webhook_path
                
                # Update webhookId if present
                if 'webhookId' in node:
                    node['webhookId'] = str(uuid.uuid4())
            
            # Update memory retrieval node
            elif 'Memory Retrieval' in node_name:
                node['name'] = f"{crew_name} Memory Retrieval"
                if 'parameters' in node and 'url' in node['parameters']:
                    current_url = node['parameters']['url']
                    if 'crew_memories' in current_url:
                        if '?' in current_url:
                            node['parameters']['url'] = f"{current_url}&crew_member=eq.{crew_name}"
                        else:
                            node['parameters']['url'] = f"{current_url}?crew_member=eq.{crew_name}"
            
            # Update LLM selection node (keep as is - this is shared functionality)
            elif 'LLM Selection' in node_name:
                # Keep node name and parameters exactly as they are
                pass
            
            # Update AI agent node
            elif 'AI Agent' in node_name:
                node['name'] = f"{crew_name} AI Agent"
                if 'parameters' in node and 'value' in node['parameters']:
                    # Update the prompt to be crew-specific
                    crew_specific_prompt = f"You are {crew_name}, {crew_role}. Respond to the directive in character."
                    node['parameters']['value'] = crew_specific_prompt
            
            # Update memory storage node
            elif 'Memory Storage' in node_name:
                node['name'] = f"{crew_name} Memory Storage"
                if 'parameters' in node and 'json' in node['parameters']:
                    node['parameters']['json'] = f"{{{{\"crew_member\": \"{crew_name}\", \"memory_content\": \"{{{{ $json.response }}}}\", \"timestamp\": \"{{{{ $now }}}}\"}}}}"
            
            # Update communication node (keep as is - this is shared functionality)
            elif 'Communication' in node_name:
                # Keep node name and parameters exactly as they are
                pass
            
            # Update response node
            elif 'Response' in node_name:
                node['name'] = f"{crew_name} Response"
        
        print(f"      ✅ Created properly formatted n8n workflow for {crew_name}")
        return crew_workflow
    
    def generate_missing_crew_configs(self) -> Dict[str, Dict]:
        """Generate configurations for the three missing crew members."""
        return {
            'Dr. Beverly Crusher': {
                'role': 'Health & Diagnostics Officer',
                'webhook_path': 'crew-dr-beverly-crusher',
                'prompt': 'You are Dr. Beverly Crusher, Chief Medical Officer of the USS Enterprise. Your role is to provide medical expertise and health assessments, diagnose and treat medical conditions, ensure crew health and safety protocols, and offer compassionate medical guidance. Respond in character with your medical expertise and caring nature.'
            },
            'Lieutenant Uhura': {
                'role': 'Communications & I/O Operations Officer',
                'webhook_path': 'crew-lieutenant-uhura',
                'prompt': 'You are Lieutenant Uhura, Communications & I/O Operations Officer of the USS Enterprise. Your role is to manage all communications systems and protocols, handle input/output operations and data flow, ensure clear and efficient communication channels, and process and route information appropriately. Respond in character with your expertise in communications and I/O operations.'
            },
            'Quark': {
                'role': 'Business Intelligence & Budget Optimization',
                'webhook_path': 'crew-quark',
                'prompt': 'You are Quark, Business Intelligence & Budget Optimization specialist. Your role is to analyze business intelligence and market trends, optimize budgets and resource allocation, provide financial insights and recommendations, and ensure cost-effective operations. Respond in character with your business acumen and financial expertise.'
            }
        }
    
    def create_workflow(self, workflow: Dict) -> bool:
        """Create a new workflow on n8n."""
        try:
            response = requests.post(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, json=workflow)
            
            if response.status_code in [200, 201]:
                print(f"   ✅ Successfully created workflow: {workflow.get('name', '')}")
                return True
            else:
                print(f"   ❌ Failed to create workflow: {workflow.get('name', '')} - {response.status_code}")
                print(f"      Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error creating workflow: {e}")
            return False
    
    def restore_all_missing_crew_members(self):
        """Restore all three missing crew members with proper n8n formatting."""
        print("🚀 RESTORING MISSING CREW MEMBERS WITH PROPER N8N FORMAT")
        print("=" * 80)
        
        # Step 1: Fetch Picard's optimal template
        print("📡 Step 1: Fetching Captain Picard's optimal template...")
        picard_template = self.fetch_picard_template()
        
        if not picard_template:
            print("❌ Failed to fetch Picard's template! Cannot proceed with restoration.")
            return False
        
        # Step 2: Generate crew configurations
        print("\n📡 Step 2: Configuring missing crew members...")
        crew_configs = self.generate_missing_crew_configs()
        
        # Step 3: Restore each missing crew member
        print("\n🔧 Step 3: Restoring missing crew members with proper formatting...")
        
        restoration_results = {}
        
        for crew_name, config in crew_configs.items():
            print(f"\n🔧 Restoring {crew_name}...")
            
            # Create properly formatted workflow from Picard's template
            crew_workflow = self.create_crew_workflow_from_picard(
                picard_template,
                crew_name,
                config['role'],
                config['webhook_path'],
                config['prompt']
            )
            
            # Deploy workflow
            success = self.create_workflow(crew_workflow)
            
            restoration_results[crew_name] = {
                'status': 'SUCCESS' if success else 'FAILED',
                'action': 'Proper n8n format restoration',
                'workflow': crew_workflow if success else None
            }
        
        # Step 4: Generate restoration report
        print(f"\n📊 RESTORATION RESULTS:")
        print("=" * 50)
        
        successful_restorations = 0
        failed_restorations = 0
        
        for crew_member, result in restoration_results.items():
            status_emoji = "✅" if result['status'] == 'SUCCESS' else "❌"
            print(f"   {status_emoji} {crew_member}: {result['action']}")
            print(f"      Status: {result['status']}")
            
            if result['status'] == 'SUCCESS':
                successful_restorations += 1
            else:
                failed_restorations += 1
        
        print(f"\n📊 FINAL SUMMARY:")
        print(f"   Total crew members restored: {len(restoration_results)}")
        print(f"   Successful restorations: {successful_restorations}")
        print(f"   Failed restorations: {failed_restorations}")
        
        if successful_restorations == len(restoration_results):
            print(f"\n🎉 ALL MISSING CREW MEMBERS SUCCESSFULLY RESTORED!")
            print(f"   All workflows now use Picard's optimal 7-node template!")
            print(f"   Proper n8n format alignment achieved!")
            print(f"   Complete crew complement restored!")
        else:
            print(f"\n⚠️  SOME RESTORATIONS FAILED - Manual intervention may be required")
        
        self.restoration_results = restoration_results
        return successful_restorations == len(restoration_results)

if __name__ == "__main__":
    try:
        restorer = MissingCrewMemberRestorer()
        success = restorer.restore_all_missing_crew_members()
        
        if success:
            print(f"\n🎯 All three missing crew members successfully restored with proper n8n formatting!")
        else:
            print(f"\n⚠️  Some restorations failed - check the results above")
            
    except Exception as e:
        print(f"❌ Missing crew member restoration failed: {e}")
