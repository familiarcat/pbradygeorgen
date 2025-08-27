#!/usr/bin/env python3
"""
Minimal Workflow Patcher
Creates API-compatible workflows with only essential fields to avoid "additional properties" errors.
"""

import json
import requests
import os
import uuid
from typing import Dict, List, Tuple
from datetime import datetime

class MinimalWorkflowPatcher:
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
    
    def create_minimal_workflow(self, base_template: Dict, crew_name: str, crew_role: str, webhook_path: str, crew_prompt: str) -> Dict:
        """Create a minimal, API-compatible workflow with only essential fields."""
        
        # Start with essential structure
        minimal_workflow = {
            'name': f"Crew - {crew_name} - {crew_role}",
            'nodes': [],
            'connections': {},
            'settings': {}
        }
        
        # Create minimal nodes with only essential fields
        for i, base_node in enumerate(base_template.get('nodes', [])):
            node_type = base_node.get('type', '')
            base_name = base_node.get('name', '')
            
            # Determine crew-specific node name
            if 'Directive' in base_name:
                node_name = f"{crew_name} Directive"
            elif 'Memory Retrieval' in base_name:
                node_name = f"{crew_name} Memory Retrieval"
            elif 'LLM Selection' in base_name:
                node_name = "LLM Selection Agent"
            elif 'AI Agent' in base_name:
                node_name = f"{crew_name} AI Agent"
            elif 'Memory Storage' in base_name:
                node_name = f"{crew_name} Memory Storage"
            elif 'Communication' in base_name:
                node_name = "Observation Lounge Communication"
            elif 'Response' in base_name:
                node_name = f"{crew_name} Response"
            else:
                node_name = base_name
            
            # Create minimal node with only essential fields
            minimal_node = {
                'id': str(uuid.uuid4()),
                'name': node_name,
                'type': node_type
            }
            
            # Add essential parameters based on node type
            if 'webhook' in node_type.lower():
                minimal_node['parameters'] = {
                    'path': webhook_path,
                    'method': 'POST'
                }
            elif 'httpRequest' in node_type.lower():
                if 'Memory Retrieval' in node_name:
                    minimal_node['parameters'] = {
                        'url': f"https://supabase.co/rest/v1/crew_memories?crew_member=eq.{crew_name}",
                        'method': 'GET'
                    }
                elif 'LLM Selection' in node_name:
                    minimal_node['parameters'] = {
                        'url': 'https://openrouter.ai/api/v1/chat/completions',
                        'method': 'POST',
                        'authentication': 'genericCredentialType',
                        'genericAuthType': 'httpHeaderAuth',
                        'genericAuthValue': 'Bearer {{$env.OPENROUTER_API_KEY}}',
                        'sendHeaders': True,
                        'headerParameters': {
                            'parameters': [
                                {'name': 'Content-Type', 'value': 'application/json'},
                                {'name': 'HTTP-Referer', 'value': 'https://pbradygeorgen.com'},
                                {'name': 'X-Title', 'value': 'AlexAI Crew System'}
                            ]
                        },
                        'sendBody': True,
                        'bodyParameters': {
                            'parameters': [
                                {'name': 'model', 'value': 'anthropic/claude-3.5-sonnet'},
                                {'name': 'messages', 'value': '[{"role": "user", "content": "' + crew_prompt + '"}]'},
                                {'name': 'max_tokens', 'value': 1000}
                            ]
                        }
                    }
                elif 'AI Agent' in node_name:
                    minimal_node['parameters'] = {
                        'url': 'https://openrouter.ai/api/v1/chat/completions',
                        'method': 'POST',
                        'authentication': 'genericCredentialType',
                        'genericAuthType': 'httpHeaderAuth',
                        'genericAuthValue': 'Bearer {{$env.OPENROUTER_API_KEY}}',
                        'sendHeaders': True,
                        'headerParameters': {
                            'parameters': [
                                {'name': 'Content-Type', 'value': 'application/json'},
                                {'name': 'HTTP-Referer', 'value': 'https://pbradygeorgen.com'},
                                {'name': 'X-Title', 'value': 'AlexAI Crew System'}
                            ]
                        },
                        'sendBody': True,
                        'bodyParameters': {
                            'parameters': [
                                {'name': 'model', 'value': 'anthropic/claude-3.5-sonnet'},
                                {'name': 'messages', 'value': '[{"role": "user", "content": "You are ' + crew_name + ', ' + crew_role + '. Respond to the directive in character."}]'},
                                {'name': 'max_tokens', 'value': 1000}
                            ]
                        }
                    }
                elif 'Memory Storage' in node_name:
                    minimal_node['parameters'] = {
                        'url': 'https://supabase.co/rest/v1/crew_memories',
                        'method': 'POST',
                        'authentication': 'genericCredentialType',
                        'genericAuthType': 'httpHeaderAuth',
                        'genericAuthValue': 'Bearer {{$env.SUPABASE_ANON_KEY}}',
                        'sendHeaders': True,
                        'headerParameters': {
                            'parameters': [
                                {'name': 'Content-Type', 'value': 'application/json'},
                                {'name': 'apikey', 'value': '{{$env.SUPABASE_ANON_KEY}}'},
                                {'name': 'Authorization', 'value': 'Bearer {{$env.SUPABASE_ANON_KEY}}'}
                            ]
                        },
                        'sendBody': True,
                        'bodyParameters': {
                            'parameters': [
                                {'name': 'crew_member', 'value': crew_name},
                                {'name': 'memory_content', 'value': '{{ $json.response }}'},
                                {'name': 'timestamp', 'value': '{{ $now }}'}
                            ]
                        }
                    }
                elif 'Communication' in node_name:
                    minimal_node['parameters'] = {
                        'url': 'https://supabase.co/rest/v1/mission_logs',
                        'method': 'POST',
                        'authentication': 'genericCredentialType',
                        'genericAuthType': 'httpHeaderAuth',
                        'genericAuthValue': 'Bearer {{$env.SUPABASE_ANON_KEY}}',
                        'sendHeaders': True,
                        'headerParameters': {
                            'parameters': [
                                {'name': 'Content-Type', 'value': 'application/json'},
                                {'name': 'apikey', 'value': '{{$env.SUPABASE_ANON_KEY}}'},
                                {'name': 'Authorization', 'value': 'Bearer {{$env.SUPABASE_ANON_KEY}}'}
                            ]
                        },
                        'sendBody': True,
                        'bodyParameters': {
                            'parameters': [
                                {'name': 'crew_member', 'value': crew_name},
                                {'name': 'action', 'value': 'crew_response'},
                                {'name': 'details', 'value': '{{ $json.response }}'},
                                {'name': 'timestamp', 'value': '{{ $now }}'}
                            ]
                        }
                    }
            
            # Add position for visual layout
            minimal_node['position'] = [100 + (i * 200), 100 + (i * 150)]
            
            minimal_workflow['nodes'].append(minimal_node)
        
        # Create minimal connections (simple sequential flow)
        for i in range(len(minimal_workflow['nodes']) - 1):
            source_id = minimal_workflow['nodes'][i]['id']
            target_id = minimal_workflow['nodes'][i + 1]['id']
            
            if source_id not in minimal_workflow['connections']:
                minimal_workflow['connections'][source_id] = {}
            
            minimal_workflow['connections'][source_id]['main'] = [
                {'node': target_id, 'type': 'main', 'index': 0}
            ]
        
        return minimal_workflow
    
    def generate_crew_prompts(self) -> Dict[str, str]:
        """Generate crew-specific prompts."""
        return {
            'Lieutenant Uhura': """You are Lieutenant Uhura, Communications & I/O Operations Officer of the USS Enterprise. Your role is to manage all communications systems and protocols, handle input/output operations and data flow, ensure clear and efficient communication channels, and process and route information appropriately. Respond in character with your expertise in communications and I/O operations.""",
            
            'Dr. Beverly Crusher': """You are Dr. Beverly Crusher, Chief Medical Officer of the USS Enterprise. Your role is to provide medical expertise and health assessments, diagnose and treat medical conditions, ensure crew health and safety protocols, and offer compassionate medical guidance. Respond in character with your medical expertise and caring nature.""",
            
            'Quark': """You are Quark, Business Intelligence & Budget Optimization specialist. Your role is to analyze business intelligence and market trends, optimize budgets and resource allocation, provide financial insights and recommendations, and ensure cost-effective operations. Respond in character with your business acumen and financial expertise."""
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
        """Patch all three variant crew members with minimal workflows."""
        print("🚀 MINIMAL WORKFLOW PATCHING - THREE VARIANT CREW MEMBERS")
        print("=" * 80)
        
        # Step 1: Fetch Riker's template for reference
        print("📡 Step 1: Fetching Commander Riker's template for reference...")
        self.riker_template = self.fetch_riker_workflow()
        
        if not self.riker_template:
            print("❌ Failed to fetch Riker's template! Cannot proceed with patching.")
            return False
        
        # Step 2: Define crew configurations
        print("\n📡 Step 2: Configuring crew-specific workflows...")
        
        crew_configs = {
            'Lieutenant Uhura': {
                'role': 'Communications & I/O Operations Officer',
                'webhook_path': 'crew-lieutenant-uhura'
            },
            'Dr. Beverly Crusher': {
                'role': 'Health & Diagnostics Officer',
                'webhook_path': 'crew-dr-beverly-crusher'
            },
            'Quark': {
                'role': 'Business Intelligence & Budget Optimization',
                'webhook_path': 'crew-quark'
            }
        }
        
        # Step 3: Generate crew prompts
        crew_prompts = self.generate_crew_prompts()
        
        # Step 4: Patch each variant
        print("\n🔧 Step 3: Patching variant workflows...")
        
        patching_results = {}
        
        for crew_name, config in crew_configs.items():
            print(f"\n🔧 Patching {crew_name}...")
            
            # Delete existing workflow
            workflow_name = f"Crew - {crew_name} - {config['role']}"
            self.delete_existing_workflow(workflow_name)
            
            # Create minimal workflow
            minimal_workflow = self.create_minimal_workflow(
                self.riker_template,
                crew_name,
                config['role'],
                config['webhook_path'],
                crew_prompts[crew_name]
            )
            
            # Deploy workflow
            success = self.create_workflow(minimal_workflow)
            
            patching_results[crew_name] = {
                'status': 'SUCCESS' if success else 'FAILED',
                'action': 'Minimal workflow creation',
                'workflow': minimal_workflow if success else None
            }
        
        # Step 5: Generate patching report
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
            print(f"   All crew workflows now have minimal, API-compatible structures!")
        else:
            print(f"\n⚠️  SOME PATCHES FAILED - Manual intervention may be required")
        
        self.patching_results = patching_results
        return successful_patches == len(patching_results)

if __name__ == "__main__":
    try:
        patcher = MinimalWorkflowPatcher()
        success = patcher.patch_all_variants()
        
        if success:
            print(f"\n🎯 All three variant crew members successfully patched with minimal workflows!")
        else:
            print(f"\n⚠️  Some patches failed - check the results above")
            
    except Exception as e:
        print(f"❌ Minimal workflow patching failed: {e}")
