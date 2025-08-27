#!/usr/bin/env python3
"""
N8N-Compatible Workflow Patcher
Creates workflows by copying Riker's working structure exactly and updating only crew-specific content.
"""

import json
import requests
import os
import uuid
from typing import Dict, List, Tuple
from datetime import datetime

class N8nCompatibleWorkflowPatcher:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Store patching results
        self.patching_results = {}
        self.riker_template = {}
        
    def fetch_riker_workflow(self) -> Dict:
        """Fetch Commander Riker's working workflow as the complete template."""
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
                if 'Commander William Riker' in name:
                    print(f"✅ Found Commander Riker's complete template: {name}")
                    return workflow
            
            print("❌ Commander Riker's workflow not found!")
            return {}
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch Riker's workflow: {e}")
            return {}
    
    def create_crew_workflow_from_riker(self, riker_workflow: Dict, crew_name: str, crew_role: str, webhook_path: str, crew_prompt: str) -> Dict:
        """Create a crew workflow by copying Riker's structure exactly and updating only crew-specific content."""
        
        print(f"   🔧 Creating workflow for {crew_name}...")
        
        # Deep copy Riker's workflow EXACTLY (preserve all n8n metadata)
        crew_workflow = json.loads(json.dumps(riker_workflow))
        
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
        
        print(f"      ✅ Created complete n8n-compatible workflow for {crew_name}")
        return crew_workflow
    
    def generate_crew_configs(self) -> Dict[str, Dict]:
        """Generate crew-specific configurations."""
        return {
            'Lieutenant Uhura': {
                'role': 'Communications & I/O Operations Officer',
                'webhook_path': 'crew-lieutenant-uhura',
                'prompt': 'You are Lieutenant Uhura, Communications & I/O Operations Officer of the USS Enterprise. Your role is to manage all communications systems and protocols, handle input/output operations and data flow, ensure clear and efficient communication channels, and process and route information appropriately. Respond in character with your expertise in communications and I/O operations.'
            },
            'Dr. Beverly Crusher': {
                'role': 'Health & Diagnostics Officer',
                'webhook_path': 'crew-dr-beverly-crusher',
                'prompt': 'You are Dr. Beverly Crusher, Chief Medical Officer of the USS Enterprise. Your role is to provide medical expertise and health assessments, diagnose and treat medical conditions, ensure crew health and safety protocols, and offer compassionate medical guidance. Respond in character with your medical expertise and caring nature.'
            },
            'Quark': {
                'role': 'Business Intelligence & Budget Optimization',
                'webhook_path': 'crew-quark',
                'prompt': 'You are Quark, Business Intelligence & Budget Optimization specialist. Your role is to analyze business intelligence and market trends, optimize budgets and resource allocation, provide financial insights and recommendations, and ensure cost-effective operations. Respond in character with your business acumen and financial expertise.'
            }
        }
    
    def delete_existing_workflow(self, workflow_name: str) -> bool:
        """Delete existing workflow before creating the corrected version."""
        try:
            # Find workflow by name
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list):
                workflows = data
            elif isinstance(data, dict) and 'data' in data:
                workflows = data['data']
            else:
                return False
            
            workflow_id = None
            for workflow in workflows:
                if workflow.get('name', '') == workflow_name:
                    workflow_id = workflow.get('id')
                    break
            
            if workflow_id:
                # Delete the workflow
                delete_response = requests.delete(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", headers=self.headers)
                if delete_response.status_code in [200, 204]:
                    print(f"   🗑️  Deleted existing workflow: {workflow_name}")
                    return True
                else:
                    print(f"   ⚠️  Failed to delete existing workflow: {workflow_name}")
                    return False
            else:
                print(f"   ℹ️  No existing workflow found to delete: {workflow_name}")
                return True
                
        except Exception as e:
            print(f"   ❌ Error deleting workflow {workflow_name}: {e}")
            return False
    
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
    
    def patch_all_variants(self):
        """Patch all three variant crew members with n8n-compatible workflows."""
        print("🚀 N8N-COMPATIBLE WORKFLOW PATCHING - THREE VARIANT CREW MEMBERS")
        print("=" * 80)
        
        # Step 1: Fetch Riker's complete template
        print("📡 Step 1: Fetching Commander Riker's complete template...")
        self.riker_template = self.fetch_riker_workflow()
        
        if not self.riker_template:
            print("❌ Failed to fetch Riker's template! Cannot proceed with patching.")
            return False
        
        # Step 2: Generate crew configurations
        print("\n📡 Step 2: Configuring crew-specific workflows...")
        crew_configs = self.generate_crew_configs()
        
        # Step 3: Patch each variant
        print("\n🔧 Step 3: Patching variant workflows...")
        
        patching_results = {}
        
        for crew_name, config in crew_configs.items():
            print(f"\n🔧 Patching {crew_name}...")
            
            # Delete existing broken workflow
            workflow_name = f"Crew - {crew_name} - {config['role']}"
            self.delete_existing_workflow(workflow_name)
            
            # Create n8n-compatible workflow
            crew_workflow = self.create_crew_workflow_from_riker(
                self.riker_template,
                crew_name,
                config['role'],
                config['webhook_path'],
                config['prompt']
            )
            
            # Deploy workflow
            success = self.create_workflow(crew_workflow)
            
            patching_results[crew_name] = {
                'status': 'SUCCESS' if success else 'FAILED',
                'action': 'n8n-compatible workflow creation',
                'workflow': crew_workflow if success else None
            }
        
        # Step 4: Generate patching report
        print(f"\n📊 PATCHING RESULTS:")
        print("=" * 50)
        
        successful_patches = 0
        failed_patches = 0
        
        for crew_member, result in patching_results.items():
            status_emoji = "✅" if result['status'] == 'SUCCESS' else "❌"
            print(f"   {status_emoji} {crew_member}: {result['action']}")
            print(f"      Status: {result['status']}")
            
            if result['status'] == 'SUCCESS':
                successful_patches += 1
            else:
                failed_patches += 1
        
        print(f"\n📊 FINAL SUMMARY:")
        print(f"   Total variants patched: {len(patching_results)}")
        print(f"   Successful patches: {successful_patches}")
        print(f"   Failed patches: {failed_patches}")
        
        if successful_patches == len(patching_results):
            print(f"\n🎉 ALL VARIANTS SUCCESSFULLY PATCHED!")
            print(f"   All crew workflows now have n8n-compatible structures!")
            print(f"   Workflows should load properly in the n8n editor!")
        else:
            print(f"\n⚠️  SOME PATCHES FAILED - Manual intervention may be required")
        
        self.patching_results = patching_results
        return successful_patches == len(patching_results)

if __name__ == "__main__":
    try:
        patcher = N8nCompatibleWorkflowPatcher()
        success = patcher.patch_all_variants()
        
        if success:
            print(f"\n🎯 All three variant crew members successfully patched with n8n-compatible workflows!")
        else:
            print(f"\n⚠️  Some patches failed - check the results above")
            
    except Exception as e:
        print(f"❌ N8n-compatible workflow patching failed: {e}")
