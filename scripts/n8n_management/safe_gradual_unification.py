#!/usr/bin/env python3
"""
Safe Gradual Unification Script
Implements Picard's optimal template across all crew members safely and incrementally.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime
import time

class SafeGradualUnifier:
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
    
    def fetch_all_workflows(self) -> List[Dict]:
        """Fetch all workflows from the deployed n8n instance."""
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
    
    def get_picard_workflow(self, workflows: List[Dict]) -> Dict:
        """Get Captain Picard's workflow as the template."""
        for workflow in workflows:
            if 'Captain Jean-Luc Picard' in workflow.get('name', ''):
                return workflow
        return {}
    
    def create_backup_for_crew_member(self, workflow: Dict, crew_id: str) -> str:
        """Create a backup for a specific crew member before updating."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = f"safe_unification_backup_{timestamp}"
        
        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)
        
        # Save the workflow
        workflow_id = workflow.get('id', 'unknown')
        workflow_name = workflow.get('name', 'unnamed').replace('/', '_').replace('\\', '_')
        filename = f"{crew_id}_{workflow_name}_before_unification.json"
        filepath = os.path.join(backup_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(workflow, f, indent=2)
        
        print(f"   💾 Created backup: {filename}")
        return backup_dir
    
    def create_picard_template_for_crew(self, picard_workflow: Dict, crew_id: str, crew_data: Dict) -> Dict:
        """Create a Picard-based template for a specific crew member."""
        # Deep copy Picard's workflow
        template = json.loads(json.dumps(picard_workflow))
        
        # Update workflow metadata
        template['name'] = f"Crew - {crew_data['name']} - {crew_data['role']}"
        
        # Update node names and content for the specific crew member
        for node in template.get('nodes', []):
            node_name = node.get('name', '')
            
            # Update directive node
            if 'Directive' in node_name:
                node['name'] = f"{crew_data['name']} Directive"
                if 'parameters' in node and 'path' in node['parameters']:
                    crew_path = crew_id.lower().replace(' ', '-')
                    node['parameters']['path'] = f"crew-{crew_path}"
            
            # Update memory retrieval node
            elif 'Memory Retrieval' in node_name:
                node['name'] = f"{crew_data['name']} Memory Retrieval"
                if 'parameters' in node and 'url' in node['parameters']:
                    current_url = node['parameters']['url']
                    if 'crew_memories' in current_url:
                        if '?' in current_url:
                            node['parameters']['url'] = f"{current_url}&crew_member=eq.{crew_data['name']}"
                        else:
                            node['parameters']['url'] = f"{current_url}?crew_member=eq.{crew_data['name']}"
            
            # Update AI agent node
            elif 'AI Agent' in node_name:
                node['name'] = f"{crew_data['name']} AI Agent"
                if 'parameters' in node and 'value' in node['parameters']:
                    crew_prompt = self.generate_crew_prompt(crew_data)
                    node['parameters']['value'] = crew_prompt
            
            # Update memory storage node
            elif 'Memory Storage' in node_name:
                node['name'] = f"{crew_data['name']} Memory Storage"
                if 'parameters' in node and 'json' in node['parameters']:
                    node['parameters']['json'] = f"{{{{\"crew_member\": \"{crew_data['name']}\", \"memory_content\": \"{{{{ $json.response }}}}\", \"timestamp\": \"{{{{ $now }}}}\"}}}}"
            
            # Update response node
            elif 'Response' in node_name:
                node['name'] = f"{crew_data['name']} Response"
        
        # Clean up problematic fields
        if 'id' in template:
            del template['id']
        if 'createdAt' in template:
            del template['createdAt']
        if 'updatedAt' in template:
            del template['updatedAt']
        if 'versionId' in template:
            del template['versionId']
        if 'triggerCount' in template:
            del template['triggerCount']
        if 'meta' in template:
            del template['meta']
        if 'pinData' in template:
            del template['pinData']
        if 'staticData' in template:
            del template['staticData']
        if 'active' in template:
            del template['active']
        
        return template
    
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
    
    def update_crew_workflow(self, workflow_id: str, template: Dict, crew_id: str) -> bool:
        """Update a crew workflow with the Picard template."""
        try:
            # Prepare template for update
            update_workflow = {
                'name': template.get('name', ''),
                'nodes': template.get('nodes', []),
                'connections': template.get('connections', {}),
                'settings': template.get('settings', {})
            }
            
            # Update the workflow
            response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}",
                                 headers=self.headers,
                                 json=update_workflow)
            
            if response.status_code == 200:
                print(f"   ✅ Successfully updated {crew_id}")
                return True
            else:
                print(f"   ❌ Failed to update {crew_id}: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"   ❌ Update error for {crew_id}: {e}")
            return False
    
    def test_workflow_functionality(self, workflow: Dict, crew_id: str) -> bool:
        """Test if a workflow is functional after update."""
        try:
            # Basic validation
            if not workflow.get('nodes'):
                print(f"   ⚠️  {crew_id}: No nodes found")
                return False
            
            if not workflow.get('connections'):
                print(f"   ⚠️  {crew_id}: No connections found")
                return False
            
            # Check for essential components
            has_webhook = any('webhook' in node.get('type', '').lower() for node in workflow.get('nodes', []))
            has_memory = any('supabase' in str(node.get('parameters', {})) for node in workflow.get('nodes', []))
            has_llm = any('openrouter' in str(node.get('parameters', {})) for node in workflow.get('nodes', []))
            has_response = any('respondToWebhook' in node.get('type', '') for node in workflow.get('nodes', []))
            
            if not all([has_webhook, has_memory, has_llm, has_response]):
                print(f"   ⚠️  {crew_id}: Missing essential components")
                return False
            
            print(f"   ✅ {crew_id}: All essential components present")
            return True
            
        except Exception as e:
            print(f"   ❌ {crew_id}: Validation error - {e}")
            return False
    
    def unify_crew_member(self, crew_id: str, crew_data: Dict, picard_workflow: Dict, current_workflows: List[Dict]) -> Dict:
        """Unify a single crew member to Picard's template."""
        result = {
            'crew_id': crew_id,
            'status': 'pending',
            'backup_created': False,
            'update_successful': False,
            'validation_passed': False,
            'backup_directory': '',
            'error_message': ''
        }
        
        print(f"\n🔧 Unifying {crew_id}: {crew_data['name']}")
        
        # Find current workflow
        current_workflow = None
        for workflow in current_workflows:
            if crew_data['name'] in workflow.get('name', ''):
                current_workflow = workflow
                break
        
        if not current_workflow:
            result['status'] = 'failed'
            result['error_message'] = 'Current workflow not found'
            print(f"   ❌ Current workflow not found for {crew_id}")
            return result
        
        # Create backup
        try:
            backup_dir = self.create_backup_for_crew_member(current_workflow, crew_id)
            result['backup_created'] = True
            result['backup_directory'] = backup_dir
        except Exception as e:
            result['status'] = 'failed'
            result['error_message'] = f'Backup creation failed: {e}'
            print(f"   ❌ Backup creation failed: {e}")
            return result
        
        # Create template
        try:
            template = self.create_picard_template_for_crew(picard_workflow, crew_id, crew_data)
        except Exception as e:
            result['status'] = 'failed'
            result['error_message'] = f'Template creation failed: {e}'
            print(f"   ❌ Template creation failed: {e}")
            return result
        
        # Update workflow
        try:
            workflow_id = current_workflow.get('id', '')
            success = self.update_crew_workflow(workflow_id, template, crew_id)
            result['update_successful'] = success
            
            if not success:
                result['status'] = 'failed'
                result['error_message'] = 'Workflow update failed'
                return result
        except Exception as e:
            result['status'] = 'failed'
            result['error_message'] = f'Update execution failed: {e}'
            print(f"   ❌ Update execution failed: {e}")
            return result
        
        # Test functionality
        try:
            # Fetch updated workflow for validation
            response = requests.get(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", headers=self.headers)
            if response.status_code == 200:
                updated_workflow = response.json()
                validation_passed = self.test_workflow_functionality(updated_workflow, crew_id)
                result['validation_passed'] = validation_passed
                
                if validation_passed:
                    result['status'] = 'success'
                    print(f"   🎉 {crew_id}: Unification successful and validated!")
                else:
                    result['status'] = 'failed'
                    result['error_message'] = 'Validation failed after update'
            else:
                result['status'] = 'failed'
                result['error_message'] = 'Could not fetch updated workflow for validation'
                print(f"   ❌ Could not fetch updated workflow for validation")
        except Exception as e:
            result['status'] = 'failed'
            result['error_message'] = f'Validation failed: {e}'
            print(f"   ❌ Validation failed: {e}")
        
        return result
    
    def run_safe_gradual_unification(self) -> Dict:
        """Run the safe, gradual unification process."""
        results = {
            'total_crew_members': 0,
            'successful_unifications': 0,
            'failed_unifications': 0,
            'crew_results': [],
            'unification_timestamp': datetime.now().isoformat()
        }
        
        print("🛡️ SAFE GRADUAL UNIFICATION - IMPLEMENTING PICARD'S TEMPLATE...")
        print("=" * 80)
        
        # Fetch current workflows
        print("📡 Fetching current workflows...")
        current_workflows = self.fetch_all_workflows()
        
        if not current_workflows:
            print("❌ No workflows found!")
            return results
        
        # Get Picard's workflow as template
        print("🏆 Getting Captain Picard's optimal template...")
        picard_workflow = self.get_picard_workflow(current_workflows)
        
        if not picard_workflow:
            print("❌ Captain Picard's workflow not found!")
            return results
        
        print(f"✅ Got Picard's template: {picard_workflow.get('name', '')}")
        print(f"   Node Count: {len(picard_workflow.get('nodes', []))}")
        print(f"   Structure: webhook-memory-llm-response")
        
        # Process each crew member
        crew_members = self.crew_config.get('crew_members', {})
        results['total_crew_members'] = len(crew_members)
        
        print(f"\n🔧 Unifying {len(crew_members)} crew members to Picard's template...")
        
        for crew_id, crew_data in crew_members.items():
            # Skip Picard (he's already the template)
            if 'Captain Jean-Luc Picard' in crew_data['name']:
                print(f"\n⏭️  Skipping {crew_id}: Already using optimal template")
                continue
            
            # Unify this crew member
            result = self.unify_crew_member(crew_id, crew_data, picard_workflow, current_workflows)
            results['crew_results'].append(result)
            
            if result['status'] == 'success':
                results['successful_unifications'] += 1
            else:
                results['failed_unifications'] += 1
                print(f"   ⚠️  {crew_id}: Unification failed - {result['error_message']}")
            
            # Safety pause between updates
            if crew_id != list(crew_members.keys())[-1]:  # Not the last one
                print("   ⏳ Safety pause: 3 seconds...")
                time.sleep(3)
        
        return results
    
    def generate_unification_report(self, results: Dict) -> str:
        """Generate a comprehensive unification report."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"safe_gradual_unification_report_{timestamp}.json"
        
        # Save detailed report
        with open(report_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Display summary
        print("\n📊 UNIFICATION RESULTS SUMMARY")
        print("=" * 60)
        
        print(f"📋 Total Crew Members: {results['total_crew_members']}")
        print(f"✅ Successful Unifications: {results['successful_unifications']}")
        print(f"❌ Failed Unifications: {results['failed_unifications']}")
        
        if results['failed_unifications'] > 0:
            print(f"\n⚠️  Failed Unifications:")
            for result in results['crew_results']:
                if result['status'] == 'failed':
                    print(f"   - {result['crew_id']}: {result['error_message']}")
        
        print(f"\n💾 Unification report saved: {report_file}")
        
        return report_file
    
    def run_unification(self):
        """Run the complete safe gradual unification process."""
        try:
            # Execute unification
            results = self.run_safe_gradual_unification()
            
            # Generate report
            print("\n📝 Generating unification report...")
            report_file = self.generate_unification_report(results)
            
            # Final status
            if results['failed_unifications'] == 0:
                print("\n🎉 UNIFICATION COMPLETE - ALL CREW MEMBERS SUCCESSFULLY UPDATED!")
                print("All workflows now follow Captain Picard's optimal template.")
            else:
                print(f"\n⚠️  UNIFICATION COMPLETE WITH {results['failed_unifications']} FAILURES")
                print("Review the unification report for details.")
            
            return results
            
        except Exception as e:
            print(f"❌ Safe gradual unification failed: {e}")
            return None

if __name__ == "__main__":
    try:
        unifier = SafeGradualUnifier()
        unifier.run_unification()
    except Exception as e:
        print(f"❌ Safe gradual unification initialization failed: {e}")
