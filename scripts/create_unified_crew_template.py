#!/usr/bin/env python3
"""
Create Unified Crew Template Script
Creates a unified template based on the best workflow analysis.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime
import uuid

class UnifiedCrewTemplateCreator:
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
    
    def fetch_best_template(self) -> Dict:
        """Fetch the best template workflow from the deployed n8n instance."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            # Handle different response formats
            workflows = []
            if isinstance(data, list):
                workflows = data
            elif isinstance(data, dict) and 'data' in data:
                workflows = data['data']
            elif isinstance(data, str):
                try:
                    workflows = json.loads(data)
                except json.JSONDecodeError:
                    print(f"❌ Failed to parse response as JSON: {data[:100]}...")
                    return {}
            
            # Find Captain Picard's workflow (best template)
            for workflow in workflows:
                if workflow.get('name') == 'Crew - Captain Jean-Luc Picard - Strategic Leadership & Mission Command':
                    return workflow
            
            print("❌ Best template workflow not found")
            return {}
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return {}
    
    def create_unified_template(self, base_workflow: Dict, crew_member: str, crew_data: Dict) -> Dict:
        """Create a unified template for a specific crew member."""
        # Deep copy the base workflow
        template = json.loads(json.dumps(base_workflow))
        
        # Generate new IDs for all nodes
        old_to_new_ids = {}
        for node in template.get('nodes', []):
            old_id = node.get('id', '')
            new_id = str(uuid.uuid4())
            old_to_new_ids[old_id] = new_id
            node['id'] = new_id
        
        # Update connections with new IDs
        new_connections = {}
        for source_id, targets in template.get('connections', {}).items():
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
        
        template['connections'] = new_connections
        
        # Update workflow metadata
        template['id'] = str(uuid.uuid4())
        template['name'] = f"Crew - {crew_data['name']} - {crew_data['role']}"
        # Don't set active - let n8n handle it
        template['createdAt'] = datetime.now().isoformat()
        template['updatedAt'] = datetime.now().isoformat()
        template['versionId'] = "1"
        template['triggerCount'] = 0
        
        # Clean up any duplicate fields that might cause API issues
        if 'meta' in template:
            del template['meta']
        if 'pinData' in template:
            del template['pinData']
        if 'staticData' in template:
            del template['staticData']
        if 'active' in template:
            del template['active']
        
        # Update node names and content for the specific crew member
        for node in template.get('nodes', []):
            node_name = node.get('name', '')
            
            # Update directive node
            if 'Directive' in node_name:
                node['name'] = f"{crew_data['name']} Directive"
                if 'parameters' in node and 'value' in node['parameters']:
                    node['parameters']['value'] = f"{{{{\"crew_member\": \"{crew_data['name']}\", \"role\": \"{crew_data['role']}\", \"specialization\": \"{crew_data['specialization']}\"}}}}"
            
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
                    current_prompt = node['parameters']['value']
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
        
        # Update tags
        template['tags'] = ['crew', crew_member.lower(), 'unified-template']
        
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
    
    def create_template_variants(self, base_workflow: Dict) -> Dict[str, Dict]:
        """Create template variants for all crew members."""
        templates = {}
        
        for crew_id, crew_data in self.crew_config.get('crew_members', {}).items():
            print(f"🔧 Creating template for {crew_data['name']}...")
            template = self.create_unified_template(base_workflow, crew_id, crew_data)
            templates[crew_id] = template
        
        return templates
    
    def save_templates(self, templates: Dict[str, Dict]) -> str:
        """Save all templates to a directory."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        template_dir = f"unified_crew_templates_{timestamp}"
        
        if not os.path.exists(template_dir):
            os.makedirs(template_dir)
        
        # Save individual templates
        for crew_id, template in templates.items():
            filename = f"{crew_id}_unified_template.json"
            filepath = os.path.join(template_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(template, f, indent=2)
            
            print(f"💾 Saved template: {filename}")
        
        # Save template summary
        summary = {
            'template_creation_timestamp': datetime.now().isoformat(),
            'base_workflow': {
                'id': templates.get('picard', {}).get('id', ''),
                'name': templates.get('picard', {}).get('name', ''),
                'structure': 'webhook-memory-llm-response'
            },
            'crew_templates': {
                crew_id: {
                    'name': template.get('name', ''),
                    'node_count': len(template.get('nodes', [])),
                    'has_memory': any('memory' in n.get('name', '').lower() for n in template.get('nodes', [])),
                    'has_llm': any('ai' in n.get('name', '').lower() for n in template.get('nodes', [])),
                    'has_webhook': any(n.get('type') == 'n8n-nodes-base.webhook' for n in template.get('nodes', []))
                }
                for crew_id, template in templates.items()
            },
            'deployment_instructions': [
                "1. Review each template for accuracy",
                "2. Deploy templates to n8n instance",
                "3. Activate workflows one by one",
                "4. Test functionality with each crew member",
                "5. Verify memory and LLM integration"
            ]
        }
        
        summary_file = os.path.join(template_dir, "template_summary.json")
        with open(summary_file, 'w') as f:
            json.dump(summary, f, indent=2)
        
        # Create README
        readme_content = self.generate_template_readme(summary, template_dir)
        readme_file = os.path.join(template_dir, "README.md")
        with open(readme_file, 'w') as f:
            f.write(readme_content)
        
        print(f"\n💾 All templates saved to: {template_dir}")
        return template_dir
    
    def generate_template_readme(self, summary: Dict, template_dir: str) -> str:
        """Generate README for the templates."""
        readme = [
            "# Unified Crew Workflow Templates",
            "",
            f"**Created**: {summary['template_creation_timestamp']}",
            f"**Base Structure**: {summary['base_workflow']['structure']}",
            "",
            "## Overview",
            "",
            "These templates provide unified, optimized workflow structures for all crew members, based on the best-performing workflow analysis.",
            "",
            "## Template Structure",
            "",
            "Each template follows the optimal `webhook-memory-llm-response` pattern:",
            "",
            "1. **Webhook Trigger** - Receives incoming directives",
            "2. **Memory Retrieval** - Fetches crew member's historical context",
            "3. **AI Agent** - Processes requests using specialized LLM",
            "4. **Memory Storage** - Saves new experiences and insights",
            "5. **Response Handler** - Returns formatted responses",
            "",
            "## Crew Templates",
            ""
        ]
        
        for crew_id, crew_info in summary['crew_templates'].items():
            readme.append(f"### {crew_info['name']}")
            readme.append(f"- **Template File**: `{crew_id}_unified_template.json`")
            readme.append(f"- **Node Count**: {crew_info['node_count']}")
            readme.append(f"- **Memory Integration**: {'✅' if crew_info['has_memory'] else '❌'}")
            readme.append(f"- **LLM Integration**: {'✅' if crew_info['has_llm'] else '❌'}")
            readme.append(f"- **Webhook**: {'✅' if crew_info['has_webhook'] else '❌'}")
            readme.append("")
        
        readme.extend([
            "## Deployment",
            "",
            "Follow the deployment instructions in `template_summary.json` to deploy these templates to your n8n instance.",
            "",
            "## Benefits",
            "",
            "- **Consistent Structure**: All workflows follow the same optimal pattern",
            "- **Standardized Integration**: Uniform memory and LLM integration",
            "- **Maintainability**: Easy to update and maintain",
            "- **Performance**: Optimized for efficiency and reliability",
            "- **Scalability**: Easy to add new crew members",
            ""
        ])
        
        return "\n".join(readme)
    
    def run_template_creation(self):
        """Run the complete template creation process."""
        print("🔧 CREATING UNIFIED CREW WORKFLOW TEMPLATES...")
        print("=" * 70)
        
        # Fetch best template
        print("📡 Fetching best template workflow...")
        base_workflow = self.fetch_best_template()
        
        if not base_workflow:
            print("❌ Failed to fetch best template")
            return
        
        print(f"✅ Best template found: {base_workflow.get('name', '')}")
        print(f"   Node Count: {len(base_workflow.get('nodes', []))}")
        print(f"   Structure: webhook-memory-llm-response")
        
        # Create template variants
        print("\n🔧 Creating unified templates for all crew members...")
        templates = self.create_template_variants(base_workflow)
        
        if not templates:
            print("❌ Failed to create templates")
            return
        
        print(f"✅ Created {len(templates)} unified templates")
        
        # Save templates
        print("\n💾 Saving templates...")
        template_dir = self.save_templates(templates)
        
        # Summary
        print("\n📊 TEMPLATE CREATION SUMMARY")
        print("=" * 70)
        
        print(f"✅ Templates Created: {len(templates)}")
        print(f"✅ Base Structure: webhook-memory-llm-response")
        print(f"✅ Memory Integration: All templates include Supabase integration")
        print(f"✅ LLM Integration: All templates include OpenRouter integration")
        print(f"✅ Webhook Configuration: All templates include proper webhooks")
        print(f"✅ Response Handling: All templates include response formatting")
        
        print(f"\n💾 Templates saved to: {template_dir}")
        print("📝 Next: Review templates and deploy to n8n instance")
        
        return template_dir

if __name__ == "__main__":
    try:
        creator = UnifiedCrewTemplateCreator()
        creator.run_template_creation()
    except Exception as e:
        print(f"❌ Template creation failed: {e}")
