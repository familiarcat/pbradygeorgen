#!/usr/bin/env python3
"""
True Workflow Unification Script
Actually updates existing crew workflows to match Picard's optimal structure.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime
import uuid

class TrueWorkflowUnifier:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Load crew configuration
        self.crew_config = self.load_crew_config()
        
    def load_crew_config(self) -> Dict:
        """Load the crew configuration."""
        try:
            with open('config/n8n_optimized_crew_config.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Failed to load crew configuration: {e}")
            return {}
    
    def fetch_active_workflows(self) -> List[Dict]:
        """Fetch active workflows from the deployed n8n instance."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            # Handle different response formats
            if isinstance(data, list):
                return [w for w in data if w.get('active', False)]
            elif isinstance(data, dict) and 'data' in data:
                return [w for w in data['data'] if w.get('active', False)]
            elif isinstance(data, str):
                try:
                    workflows = json.loads(data)
                    return [w for w in workflows if w.get('active', False)]
                except json.JSONDecodeError:
                    print(f"❌ Failed to parse response as JSON: {data[:100]}...")
                    return []
            else:
                print(f"❌ Unexpected response format: {type(data)}")
                return []
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return []
    
    def get_picard_workflow_structure(self, workflows: List[Dict]) -> Dict:
        """Get Captain Picard's workflow structure as the template."""
        for workflow in workflows:
            if workflow.get('name') == 'Crew - Captain Jean-Luc Picard - Strategic Leadership & Mission Command':
                return workflow
        
        print("❌ Captain Picard's workflow not found")
        return {}
    
    def create_unified_structure_for_crew(self, picard_structure: Dict, crew_id: str, crew_data: Dict) -> Dict:
        """Create unified structure for a specific crew member based on Picard's template."""
        # Deep copy Picard's structure
        unified_workflow = json.loads(json.dumps(picard_structure))
        
        # Generate new IDs for all nodes
        old_to_new_ids = {}
        for node in unified_workflow.get('nodes', []):
            old_id = node.get('id', '')
            new_id = str(uuid.uuid4())
            old_to_new_ids[old_id] = new_id
            node['id'] = new_id
        
        # Update connections with new IDs
        new_connections = {}
        for source_id, targets in unified_workflow.get('connections', {}).items():
            if source_id in old_to_new_ids:
                new_source_id = old_to_new_ids[source_id]
                new_connections[new_source_id] = {}
                for output, connections in targets.items():
                    new_connections[new_source_id][output] = []
                    for connection in connections:
                        if connection.get('node') in old_to_new_ids:
                            new_connection = connection.copy()
                            new_connection['node'] = old_to_new_ids[connection['node']]
                            new_connections[new_source_id][output].append(new_connection)
                        else:
                            new_connections[new_source_id][output].append(connection)
            else:
                new_connections[source_id] = targets
        
        unified_workflow['connections'] = new_connections
        
        # Update workflow metadata
        unified_workflow['id'] = str(uuid.uuid4())
        unified_workflow['name'] = f"Crew - {crew_data['name']} - {crew_data['role']}"
        unified_workflow['createdAt'] = datetime.now().isoformat()
        unified_workflow['updatedAt'] = datetime.now().isoformat()
        unified_workflow['versionId'] = "1"
        unified_workflow['triggerCount'] = 0
        
        # Clean up problematic fields
        if 'meta' in unified_workflow:
            del unified_workflow['meta']
        if 'pinData' in unified_workflow:
            del unified_workflow['pinData']
        if 'staticData' in unified_workflow:
            del unified_workflow['staticData']
        if 'active' in unified_workflow:
            del unified_workflow['active']
        
        # Update node names and content for the specific crew member
        for node in unified_workflow.get('nodes', []):
            node_name = node.get('name', '')
            
            # Update directive node
            if 'Directive' in node_name:
                node['name'] = f"{crew_data['name']} Directive"
                if 'parameters' in node and 'value' in node['parameters']:
                    node['parameters']['value'] = f"{{{{\"crew_member\": \"{crew_data['name']}\", \"role\": \"{crew_data['role']}\", \"specialization\": \"{crew_data['specialization']}\"}}}}"
                
                # Update webhook path for individual crew member
                if 'parameters' in node and 'path' in node['parameters']:
                    crew_path = crew_id.lower().replace(' ', '-')
                    node['parameters']['path'] = f"crew-{crew_path}"
            
            # Update memory retrieval node
            elif 'Memory Retrieval' in node_name:
                node['name'] = f"{crew_data['name']} Memory Retrieval"
                if 'parameters' in node and 'url' in node['parameters']:
                    # Update Supabase query for specific crew member
                    current_url = node['parameters']['url']
                    if 'crew_memories' in current_url:
                        # Add crew member filter
                        if '?' in current_url:
                            node['parameters']['url'] = f"{current_url}&crew_member=eq.{crew_data['name']}"
                        else:
                            node['parameters']['url'] = f"{current_url}?crew_member=eq.{crew_data['name']}"
            
            # Update AI agent node
            elif 'AI Agent' in node_name:
                node['name'] = f"{crew_data['name']} AI Agent"
                if 'parameters' in node and 'value' in node['parameters']:
                    # Update system prompt for specific crew member
                    crew_prompt = self.generate_crew_prompt(crew_data)
                    node['parameters']['value'] = crew_prompt
            
            # Update memory storage node
            elif 'Memory Storage' in node_name:
                node['name'] = f"{crew_data['name']} Memory Storage"
                if 'parameters' in node and 'url' in node['parameters']:
                    # Ensure Supabase URL is correct
                    current_url = node['parameters']['url']
                    if 'crew_memories' in current_url:
                        # Add crew member to payload
                        if 'json' in node['parameters']:
                            node['parameters']['json'] = f"{{{{\"crew_member\": \"{crew_data['name']}\", \"memory_content\": \"{{{{ $json.response }}}}\", \"timestamp\": \"{{{{ $now }}}}\"}}}}"
            
            # Update response node
            elif 'Response' in node_name:
                node['name'] = f"{crew_data['name']} Response"
        
        return unified_workflow
    
    def generate_crew_prompt(self, crew_data: Dict) -> str:
        """Generate a system prompt for a specific crew member."""
        prompt = f"""You are {crew_data['name']}, the {crew_data['role']} of the Enterprise. Your character is defined by:

PERSONALITY TRAITS:
- {crew_data.get('personality', 'Professional and dedicated to your role')}
- {crew_data.get('approach', 'Methodical and thorough in your approach')}

SPECIALIZATION:
{crew_data['specialization']}

RESPONSIBILITIES:
{chr(10).join(f"- {resp}" for resp in crew_data['responsibilities'])}

LLM PREFERENCE:
{crew_data.get('llm_preference', 'Optimized for your specific role')}

When responding to directives:
1. Analyze the request based on your expertise
2. Provide strategic insights relevant to your role
3. Consider the broader mission context
4. Offer actionable recommendations
5. Maintain your character's voice and perspective

Remember: You are part of an elite crew working together for the greater good. Your expertise is crucial to mission success."""
        
        return prompt
    
    def update_existing_workflow(self, workflow_id: str, unified_structure: Dict, crew_id: str) -> bool:
        """Update an existing workflow with the unified structure."""
        try:
            # Prepare workflow for update
            update_workflow = self.prepare_workflow_for_update(unified_structure)
            
            # Update the workflow
            response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                                 headers=self.headers,
                                 json=update_workflow)
            
            if response.status_code == 200:
                print(f"✅ Updated {crew_id}: {unified_structure.get('name', '')}")
                return True
            else:
                print(f"❌ Failed to update {crew_id}: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Update error for {crew_id}: {e}")
            return False
    
    def prepare_workflow_for_update(self, workflow: Dict) -> Dict:
        """Prepare workflow for update by keeping only essential fields."""
        # Keep only essential workflow fields
        essential_fields = ['name', 'nodes', 'connections', 'settings']
        cleaned_workflow = {}
        
        for field in essential_fields:
            if field in workflow:
                cleaned_workflow[field] = workflow[field]
        
        return cleaned_workflow
    
    def backup_workflow_before_update(self, workflow: Dict, backup_dir: str):
        """Backup a workflow before updating it."""
        workflow_id = workflow.get('id', 'unknown')
        workflow_name = workflow.get('name', 'unnamed').replace('/', '_').replace('\\', '_')
        
        filename = f"{workflow_id}_{workflow_name}_before_update.json"
        filepath = os.path.join(backup_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(workflow, f, indent=2)
        
        print(f"💾 Backed up: {filename}")
    
    def unify_all_crew_workflows(self) -> Dict:
        """Unify all crew workflows to match Picard's structure."""
        results = {
            'total_crew_workflows': 0,
            'successfully_unified': 0,
            'failed_unifications': 0,
            'details': []
        }
        
        # Fetch current workflows
        print("📡 Fetching current workflows...")
        current_workflows = self.fetch_active_workflows()
        
        if not current_workflows:
            print("❌ No active workflows found")
            return results
        
        print(f"📋 Found {len(current_workflows)} active workflows")
        
        # Get Picard's workflow structure
        print("🏆 Getting Captain Picard's optimal structure...")
        picard_structure = self.get_picard_workflow_structure(current_workflows)
        
        if not picard_structure:
            print("❌ Cannot proceed without Picard's structure")
            return results
        
        print(f"✅ Got Picard's structure: {picard_structure.get('name', '')}")
        print(f"   Node Count: {len(picard_structure.get('nodes', []))}")
        print(f"   Structure: webhook-memory-llm-response")
        
        # Create backup directory
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = f"pre_unification_backup_{timestamp}"
        
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        print(f"💾 Created backup directory: {backup_dir}")
        
        # Process each crew workflow
        crew_workflows = [w for w in current_workflows if w.get('name', '').startswith('Crew -')]
        results['total_crew_workflows'] = len(crew_workflows)
        
        print(f"\n🔧 Unifying {len(crew_workflows)} crew workflows...")
        
        for workflow in crew_workflows:
            workflow_name = workflow.get('name', '')
            workflow_id = workflow.get('id', '')
            
            # Extract crew ID from workflow name
            crew_id = None
            for crew_key, crew_data in self.crew_config.get('crew_members', {}).items():
                if crew_data['name'] in workflow_name:
                    crew_id = crew_key
                    break
            
            if not crew_id:
                print(f"⚠️  Could not identify crew member for: {workflow_name}")
                continue
            
            print(f"\n🔧 Processing {crew_id}: {workflow_name}")
            
            # Backup current workflow
            self.backup_workflow_before_update(workflow, backup_dir)
            
            # Create unified structure for this crew member
            unified_structure = self.create_unified_structure_for_crew(
                picard_structure, crew_id, self.crew_config['crew_members'][crew_id]
            )
            
            # Update the existing workflow
            success = self.update_existing_workflow(workflow_id, unified_structure, crew_id)
            
            if success:
                results['successfully_unified'] += 1
                results['details'].append({
                    'crew_id': crew_id,
                    'workflow_id': workflow_id,
                    'status': 'unified',
                    'old_name': workflow_name,
                    'new_name': unified_structure.get('name', '')
                })
            else:
                results['failed_unifications'] += 1
                results['details'].append({
                    'crew_id': crew_id,
                    'workflow_id': workflow_id,
                    'status': 'failed',
                    'old_name': workflow_name,
                    'new_name': unified_structure.get('name', '')
                })
        
        # Add backup information
        results['backup_directory'] = backup_dir
        results['unification_timestamp'] = datetime.now().isoformat()
        
        return results
    
    def generate_unification_report(self, results: Dict) -> str:
        """Generate a comprehensive unification report."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"true_workflow_unification_report_{timestamp}.json"
        
        # Save detailed report
        with open(report_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Display summary
        print("\n📊 UNIFICATION RESULTS SUMMARY")
        print("=" * 60)
        
        print(f"📋 Total Crew Workflows: {results['total_crew_workflows']}")
        print(f"✅ Successfully Unified: {results['successfully_unified']}")
        print(f"❌ Failed Unifications: {results['failed_unifications']}")
        print(f"💾 Backup Created: {results['backup_directory']}")
        
        if results['failed_unifications'] > 0:
            print(f"\n⚠️  Failed Unifications:")
            for detail in results['details']:
                if detail['status'] == 'failed':
                    print(f"   - {detail['crew_id']}: {detail['old_name']}")
        
        print(f"\n💾 Unification report saved: {report_file}")
        
        return report_file
    
    def run_unification(self):
        """Run the complete workflow unification process."""
        print("🔧 TRUE WORKFLOW UNIFICATION - UPDATING EXISTING WORKFLOWS...")
        print("=" * 70)
        
        # Unify all crew workflows
        print("🚀 Starting true workflow unification...")
        results = self.unify_all_crew_workflows()
        
        # Generate report
        print("\n📝 Generating unification report...")
        report_file = self.generate_unification_report(results)
        
        # Final status
        if results['failed_unifications'] == 0:
            print("\n🎉 UNIFICATION COMPLETE - ALL CREW WORKFLOWS SUCCESSFULLY UNIFIED!")
            print("All workflows now follow Captain Picard's optimal structure.")
        else:
            print(f"\n⚠️  UNIFICATION COMPLETE WITH {results['failed_unifications']} FAILURES")
            print("Review the unification report for details.")
        
        return results

if __name__ == "__main__":
    try:
        unifier = TrueWorkflowUnifier()
        unifier.run_unification()
    except Exception as e:
        print(f"❌ True workflow unification failed: {e}")
