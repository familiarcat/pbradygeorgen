#!/usr/bin/env python3
"""
Patch Three Variant Crew Members
Targeted fixing of Lieutenant Uhura, Dr. Beverly Crusher, and Quark workflows
using Commander Riker's optimal template as the base.
"""

import json
import requests
import os
import uuid
from typing import Dict, List, Tuple
from datetime import datetime

class VariantCrewPatcher:
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
        """Fetch Commander Riker's optimal workflow as the template."""
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
                    print(f"✅ Found Commander Riker's optimal template: {name}")
                    return workflow
            
            print("❌ Commander Riker's workflow not found!")
            return {}
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch Riker's workflow: {e}")
            return {}
    
    def fetch_variant_workflows(self) -> Dict[str, Dict]:
        """Fetch the three variant workflows that need patching."""
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
            
            variant_workflows = {}
            variant_names = [
                'Lieutenant Uhura',
                'Dr. Beverly Crusher', 
                'Quark'
            ]
            
            for workflow in workflows:
                name = workflow.get('name', '')
                for variant_name in variant_names:
                    if variant_name in name:
                        variant_workflows[variant_name] = workflow
                        print(f"✅ Found variant workflow: {name}")
                        break
            
            print(f"📊 Found {len(variant_workflows)} variant workflows to patch")
            return variant_workflows
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch variant workflows: {e}")
            return {}
    
    def create_uhura_workflow(self, riker_template: Dict) -> Dict:
        """Create complete 7-node workflow for Lieutenant Uhura."""
        print(f"\n🔧 Creating complete workflow for Lieutenant Uhura...")
        
        # Deep copy Riker's template
        uhura_workflow = json.loads(json.dumps(riker_template))
        
        # Update workflow metadata
        uhura_workflow['name'] = "Crew - Lieutenant Uhura - Communications & I/O Operations Officer"
        
        # Generate new IDs for all nodes
        old_to_new_ids = {}
        for node in uhura_workflow.get('nodes', []):
            old_id = node.get('id', '')
            new_id = str(uuid.uuid4())
            old_to_new_ids[old_id] = new_id
            node['id'] = new_id
        
        # Update connections with new IDs
        new_connections = {}
        for source_id, targets in uhura_workflow.get('connections', {}).items():
            if source_id in old_to_new_ids:
                new_source_id = old_to_new_ids[source_id]
                new_connections[new_source_id] = {}
                for output, connections_list in targets.items():
                    new_connections[new_source_id][output] = []
                    for connection in connections_list:
                        if connection.get('node') in old_to_new_ids:
                            new_connection = connection.copy()
                            new_connection['node'] = old_to_new_ids[connection['node']]
                            new_connections[new_source_id][output].append(new_connection)
            else:
                new_connections[source_id] = targets
        
        uhura_workflow['connections'] = new_connections
        
        # Update node names and content for Uhura
        for node in uhura_workflow.get('nodes', []):
            node_name = node.get('name', '')
            
            # Update directive node
            if 'Directive' in node_name:
                node['name'] = "Lieutenant Uhura Directive"
                if 'parameters' in node and 'path' in node['parameters']:
                    node['parameters']['path'] = "crew-lieutenant-uhura"
            
            # Update memory retrieval node
            elif 'Memory Retrieval' in node_name:
                node['name'] = "Lieutenant Uhura Memory Retrieval"
                if 'parameters' in node and 'url' in node['parameters']:
                    current_url = node['parameters']['url']
                    if 'crew_memories' in current_url:
                        if '?' in current_url:
                            node['parameters']['url'] = f"{current_url}&crew_member=eq.Lieutenant Uhura"
                        else:
                            node['parameters']['url'] = f"{current_url}?crew_member=eq.Lieutenant Uhura"
            
            # Update AI agent node
            elif 'AI Agent' in node_name:
                node['name'] = "Lieutenant Uhura AI Agent"
                if 'parameters' in node and 'value' in node['parameters']:
                    crew_prompt = self.generate_uhura_prompt()
                    node['parameters']['value'] = crew_prompt
            
            # Update memory storage node
            elif 'Memory Storage' in node_name:
                node['name'] = "Lieutenant Uhura Memory Storage"
                if 'parameters' in node and 'json' in node['parameters']:
                    node['parameters']['json'] = "{{\"crew_member\": \"Lieutenant Uhura\", \"memory_content\": \"{{{{ $json.response }}}}\", \"timestamp\": \"{{{{ $now }}}}\"}}"
            
            # Update response node
            elif 'Response' in node_name:
                node['name'] = "Lieutenant Uhura Response"
        
        # Clean up problematic fields
        if 'id' in uhura_workflow: del uhura_workflow['id']
        if 'createdAt' in uhura_workflow: del uhura_workflow['createdAt']
        if 'updatedAt' in uhura_workflow: del uhura_workflow['updatedAt']
        if 'versionId' in uhura_workflow: del uhura_workflow['versionId']
        if 'triggerCount' in uhura_workflow: del uhura_workflow['triggerCount']
        if 'meta' in uhura_workflow: del uhura_workflow['meta']
        if 'pinData' in uhura_workflow: del uhura_workflow['pinData']
        if 'staticData' in uhura_workflow: del uhura_workflow['staticData']
        if 'active' in uhura_workflow: del uhura_workflow['active']
        
        print(f"   ✅ Created complete 7-node workflow for Lieutenant Uhura")
        return uhura_workflow
    
    def create_crusher_workflow(self, riker_template: Dict) -> Dict:
        """Create 7-node workflow for Dr. Beverly Crusher by adding missing Response node."""
        print(f"\n🔧 Creating complete workflow for Dr. Beverly Crusher...")
        
        # Deep copy Riker's template
        crusher_workflow = json.loads(json.dumps(riker_template))
        
        # Update workflow metadata
        crusher_workflow['name'] = "Crew - Dr. Beverly Crusher - Health & Diagnostics Officer"
        
        # Generate new IDs for all nodes
        old_to_new_ids = {}
        for node in crusher_workflow.get('nodes', []):
            old_id = node.get('id', '')
            new_id = str(uuid.uuid4())
            old_to_new_ids[old_id] = new_id
            node['id'] = new_id
        
        # Update connections with new IDs
        new_connections = {}
        for source_id, targets in crusher_workflow.get('connections', {}).items():
            if source_id in old_to_new_ids:
                new_source_id = old_to_new_ids[source_id]
                new_connections[new_source_id] = {}
                for output, connections_list in targets.items():
                    new_connections[new_source_id][output] = []
                    for connection in connections_list:
                        if connection.get('node') in old_to_new_ids:
                            new_connection = connection.copy()
                            new_connection['node'] = old_to_new_ids[connection['node']]
                            new_connections[new_source_id][output].append(new_connection)
            else:
                new_connections[source_id] = targets
        
        crusher_workflow['connections'] = new_connections
        
        # Update node names and content for Dr. Crusher
        for node in crusher_workflow.get('nodes', []):
            node_name = node.get('name', '')
            
            # Update directive node
            if 'Directive' in node_name:
                node['name'] = "Dr. Beverly Crusher Directive"
                if 'parameters' in node and 'path' in node['parameters']:
                    node['parameters']['path'] = "crew-dr-beverly-crusher"
            
            # Update memory retrieval node
            elif 'Memory Retrieval' in node_name:
                node['name'] = "Dr. Beverly Crusher Memory Retrieval"
                if 'parameters' in node and 'url' in node['parameters']:
                    current_url = node['parameters']['url']
                    if 'crew_memories' in current_url:
                        if '?' in current_url:
                            node['parameters']['url'] = f"{current_url}&crew_member=eq.Dr. Beverly Crusher"
                        else:
                            node['parameters']['url'] = f"{current_url}?crew_member=eq.Dr. Beverly Crusher"
            
            # Update AI agent node
            elif 'AI Agent' in node_name:
                node['name'] = "Dr. Beverly Crusher AI Agent"
                if 'parameters' in node and 'value' in node['parameters']:
                    crew_prompt = self.generate_crusher_prompt()
                    node['parameters']['value'] = crew_prompt
            
            # Update memory storage node
            elif 'Memory Storage' in node_name:
                node['name'] = "Dr. Beverly Crusher Memory Storage"
                if 'parameters' in node and 'json' in node['parameters']:
                    node['parameters']['json'] = "{{\"crew_member\": \"Dr. Beverly Crusher\", \"memory_content\": \"{{{{ $json.response }}}}\", \"timestamp\": \"{{{{ $now }}}}\"}}"
            
            # Update response node
            elif 'Response' in node_name:
                node['name'] = "Dr. Beverly Crusher Response"
        
        # Clean up problematic fields
        if 'id' in crusher_workflow: del crusher_workflow['id']
        if 'createdAt' in crusher_workflow: del crusher_workflow['createdAt']
        if 'updatedAt' in crusher_workflow: del crusher_workflow['updatedAt']
        if 'versionId' in crusher_workflow: del crusher_workflow['versionId']
        if 'triggerCount' in crusher_workflow: del crusher_workflow['triggerCount']
        if 'meta' in crusher_workflow: del crusher_workflow['meta']
        if 'pinData' in crusher_workflow: del crusher_workflow['pinData']
        if 'staticData' in crusher_workflow: del crusher_workflow['staticData']
        if 'active' in crusher_workflow: del crusher_workflow['active']
        
        print(f"   ✅ Created complete 7-node workflow for Dr. Beverly Crusher")
        return crusher_workflow
    
    def create_quark_workflow(self, riker_template: Dict) -> Dict:
        """Create 7-node workflow for Quark by adding missing Response node."""
        print(f"\n🔧 Creating complete workflow for Quark...")
        
        # Deep copy Riker's template
        quark_workflow = json.loads(json.dumps(riker_template))
        
        # Update workflow metadata
        quark_workflow['name'] = "Crew - Quark - Business Intelligence & Budget Optimization"
        
        # Generate new IDs for all nodes
        old_to_new_ids = {}
        for node in quark_workflow.get('nodes', []):
            old_id = node.get('id', '')
            new_id = str(uuid.uuid4())
            old_to_new_ids[old_id] = new_id
            node['id'] = new_id
        
        # Update connections with new IDs
        new_connections = {}
        for source_id, targets in quark_workflow.get('connections', {}).items():
            if source_id in old_to_new_ids:
                new_source_id = old_to_new_ids[source_id]
                new_connections[new_source_id] = {}
                for output, connections_list in targets.items():
                    new_connections[new_source_id][output] = []
                    for connection in connections_list:
                        if connection.get('node') in old_to_new_ids:
                            new_connection = connection.copy()
                            new_connection['node'] = old_to_new_ids[connection['node']]
                            new_connections[new_source_id][output].append(new_connection)
            else:
                new_connections[source_id] = targets
        
        quark_workflow['connections'] = new_connections
        
        # Update node names and content for Quark
        for node in quark_workflow.get('nodes', []):
            node_name = node.get('name', '')
            
            # Update directive node
            if 'Directive' in node_name:
                node['name'] = "Quark Directive"
                if 'parameters' in node and 'path' in node['parameters']:
                    node['parameters']['path'] = "crew-quark"
            
            # Update memory retrieval node
            elif 'Memory Retrieval' in node_name:
                node['name'] = "Quark Memory Retrieval"
                if 'parameters' in node and 'url' in node['parameters']:
                    current_url = node['parameters']['url']
                    if 'crew_memories' in current_url:
                        if '?' in current_url:
                            node['parameters']['url'] = f"{current_url}&crew_member=eq.Quark"
                        else:
                            node['parameters']['url'] = f"{current_url}?crew_member=eq.Quark"
            
            # Update AI agent node
            elif 'AI Agent' in node_name:
                node['name'] = "Quark AI Agent"
                if 'parameters' in node and 'value' in node['parameters']:
                    crew_prompt = self.generate_quark_prompt()
                    node['parameters']['value'] = crew_prompt
            
            # Update memory storage node
            elif 'Memory Storage' in node_name:
                node['name'] = "Quark Memory Storage"
                if 'parameters' in node and 'json' in node['parameters']:
                    node['parameters']['json'] = "{{\"crew_member\": \"Quark\", \"memory_content\": \"{{{{ $json.response }}}}\", \"timestamp\": \"{{{{ $now }}}}\"}}"
            
            # Update response node
            elif 'Response' in node_name:
                node['name'] = "Quark Response"
        
        # Clean up problematic fields
        if 'id' in quark_workflow: del quark_workflow['id']
        if 'createdAt' in quark_workflow: del quark_workflow['createdAt']
        if 'updatedAt' in quark_workflow: del quark_workflow['updatedAt']
        if 'versionId' in quark_workflow: del quark_workflow['versionId']
        if 'triggerCount' in quark_workflow: del quark_workflow['triggerCount']
        if 'meta' in quark_workflow: del quark_workflow['meta']
        if 'pinData' in quark_workflow: del quark_workflow['pinData']
        if 'staticData' in quark_workflow: del quark_workflow['staticData']
        if 'active' in quark_workflow: del quark_workflow['active']
        
        print(f"   ✅ Created complete 7-node workflow for Quark")
        return quark_workflow
    
    def generate_uhura_prompt(self) -> str:
        """Generate crew-specific prompt for Lieutenant Uhura."""
        return """You are Lieutenant Uhura, Communications & I/O Operations Officer of the USS Enterprise. 

Your role is to:
- Manage all communications systems and protocols
- Handle input/output operations and data flow
- Ensure clear and efficient communication channels
- Process and route information appropriately

Respond in character with your expertise in communications and I/O operations."""

    def generate_crusher_prompt(self) -> str:
        """Generate crew-specific prompt for Dr. Beverly Crusher."""
        return """You are Dr. Beverly Crusher, Chief Medical Officer of the USS Enterprise.

Your role is to:
- Provide medical expertise and health assessments
- Diagnose and treat medical conditions
- Ensure crew health and safety protocols
- Offer compassionate medical guidance

Respond in character with your medical expertise and caring nature."""

    def generate_quark_prompt(self) -> str:
        """Generate crew-specific prompt for Quark."""
        return """You are Quark, Business Intelligence & Budget Optimization specialist.

Your role is to:
- Analyze business intelligence and market trends
- Optimize budgets and resource allocation
- Provide financial insights and recommendations
- Ensure cost-effective operations

Respond in character with your business acumen and financial expertise."""

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
        """Patch all three variant crew members."""
        print("🚀 PATCHING THREE VARIANT CREW MEMBERS")
        print("=" * 80)
        
        # Step 1: Fetch Riker's optimal template
        print("📡 Step 1: Fetching Commander Riker's optimal template...")
        self.riker_template = self.fetch_riker_workflow()
        
        if not self.riker_template:
            print("❌ Failed to fetch Riker's template! Cannot proceed with patching.")
            return False
        
        # Step 2: Fetch variant workflows
        print("\n📡 Step 2: Fetching variant workflows...")
        variant_workflows = self.fetch_variant_workflows()
        
        if not variant_workflows:
            print("❌ No variant workflows found! Nothing to patch.")
            return False
        
        # Step 3: Patch each variant
        print("\n🔧 Step 3: Patching variant workflows...")
        
        patching_results = {}
        
        # Patch Lieutenant Uhura (complete reconstruction)
        if 'Lieutenant Uhura' in variant_workflows:
            print(f"\n🔧 Patching Lieutenant Uhura...")
            
            # Delete existing workflow
            uhura_name = "Crew - Lieutenant Uhura - Communications & I/O Operations Officer"
            self.delete_existing_workflow(uhura_name)
            
            # Create new complete workflow
            uhura_workflow = self.create_uhura_workflow(self.riker_template)
            success = self.create_workflow(uhura_workflow)
            
            patching_results['Lieutenant Uhura'] = {
                'status': 'SUCCESS' if success else 'FAILED',
                'action': 'Complete reconstruction (4 → 7 nodes)',
                'workflow': uhura_workflow if success else None
            }
        
        # Patch Dr. Beverly Crusher (add missing Response node)
        if 'Dr. Beverly Crusher' in variant_workflows:
            print(f"\n🔧 Patching Dr. Beverly Crusher...")
            
            # Delete existing workflow
            crusher_name = "Crew - Dr. Beverly Crusher - Health & Diagnostics Officer"
            self.delete_existing_workflow(crusher_name)
            
            # Create new complete workflow
            crusher_workflow = self.create_crusher_workflow(self.riker_template)
            success = self.create_workflow(crusher_workflow)
            
            patching_results['Dr. Beverly Crusher'] = {
                'status': 'SUCCESS' if success else 'FAILED',
                'action': 'Add missing Response node (6 → 7 nodes)',
                'workflow': crusher_workflow if success else None
            }
        
        # Patch Quark (add missing Response node)
        if 'Quark' in variant_workflows:
            print(f"\n🔧 Patching Quark...")
            
            # Delete existing workflow
            quark_name = "Crew - Quark - Business Intelligence & Budget Optimization"
            self.delete_existing_workflow(quark_name)
            
            # Create new complete workflow
            quark_workflow = self.create_quark_workflow(self.riker_template)
            success = self.create_workflow(quark_workflow)
            
            patching_results['Quark'] = {
                'status': 'SUCCESS' if success else 'FAILED',
                'action': 'Add missing Response node (6 → 7 nodes)',
                'workflow': quark_workflow if success else None
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
            print(f"   All crew workflows now have the optimal 7-node structure!")
        else:
            print(f"\n⚠️  SOME PATCHES FAILED - Manual intervention may be required")
        
        self.patching_results = patching_results
        return successful_patches == len(patching_results)

if __name__ == "__main__":
    try:
        patcher = VariantCrewPatcher()
        success = patcher.patch_all_variants()
        
        if success:
            print(f"\n🎯 All three variant crew members successfully patched!")
        else:
            print(f"\n⚠️  Some patches failed - check the results above")
            
    except Exception as e:
        print(f"❌ Variant crew patching failed: {e}")
