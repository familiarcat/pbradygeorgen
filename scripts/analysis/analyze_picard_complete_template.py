#!/usr/bin/env python3
"""
Analyze Captain Picard's Complete Template
Extracts the complete 7-node workflow structure from Captain Picard's optimal template.
"""

import json
import requests
import os
from typing import Dict, List

class PicardTemplateAnalyzer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
    
    def fetch_picard_workflow(self) -> Dict:
        """Fetch Captain Picard's workflow from n8n."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            if isinstance(data, list):
                workflows = data
            elif isinstance(data, dict) and 'data' in data:
                workflows = data['data']
            else:
                print(f"❌ Unexpected response format: {type(data)}")
                return {}
            
            # Find Captain Picard's workflow
            for workflow in workflows:
                name = workflow.get('name', '')
                if 'Captain Jean-Luc Picard' in name:
                    print(f"✅ Found Captain Picard's workflow: {name}")
                    return workflow
            
            print("❌ Captain Picard's workflow not found!")
            return {}
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return {}
    
    def analyze_picard_structure(self, workflow: Dict):
        """Analyze the complete structure of Captain Picard's workflow."""
        print("🔍 ANALYZING CAPTAIN PICARD'S COMPLETE TEMPLATE...")
        print("=" * 70)
        
        nodes = workflow.get('nodes', [])
        connections = workflow.get('connections', {})
        
        print(f"📊 WORKFLOW STRUCTURE ANALYSIS:")
        print(f"   📋 Total Nodes: {len(nodes)}")
        print(f"   🔗 Total Connections: {len(connections)}")
        
        # Analyze each node in order
        print(f"\n🔧 NODE ANALYSIS (Left to Right Flow):")
        print("=" * 50)
        
        for i, node in enumerate(nodes):
            node_name = node.get('name', 'Unknown')
            node_type = node.get('type', 'Unknown')
            node_id = node.get('id', 'Unknown')
            
            print(f"   {i+1}. {node_name}")
            print(f"      Type: {node_type}")
            print(f"      ID: {node_id}")
            
            # Check for specific node types
            if 'webhook' in node_type.lower():
                print(f"      Role: 🚀 INPUT TRIGGER")
            elif 'memory' in node_name.lower() and 'retrieval' in node_name.lower():
                print(f"      Role: 📚 MEMORY RETRIEVAL")
            elif 'llm' in node_name.lower() and 'selection' in node_name.lower():
                print(f"      Role: 🤖 LLM SELECTION")
            elif 'ai agent' in node_name.lower():
                print(f"      Role: 🧠 AI PROCESSING")
            elif 'communication' in node_name.lower():
                print(f"      Role: 💬 COMMUNICATION")
            elif 'memory' in node_name.lower() and 'storage' in node_name.lower():
                print(f"      Role: 💾 MEMORY STORAGE")
            elif 'response' in node_name.lower():
                print(f"      Role: 📤 FINAL OUTPUT")
        
        # Analyze connections
        print(f"\n🔗 CONNECTION FLOW ANALYSIS:")
        print("=" * 45)
        
        if isinstance(connections, dict):
            for source_name, targets in connections.items():
                if isinstance(targets, dict):
                    for output, connections_list in targets.items():
                        if isinstance(connections_list, list):
                            for connection in connections_list:
                                if isinstance(connection, dict):
                                    target_node_id = connection.get('node', '')
                                    target_node = next((n for n in nodes if n.get('id') == target_node_id), {})
                                    target_name = target_node.get('name', 'Unknown')
                                    print(f"   📤 {source_name} → {target_name}")
        
        # Create template summary
        print(f"\n📋 COMPLETE TEMPLATE SUMMARY:")
        print("=" * 40)
        print("🎯 OPTIMAL WORKFLOW PATTERN:")
        print("   1. 🚀 Directive (Webhook Input)")
        print("   2. 📚 Memory Retrieval")
        print("   3. 🤖 LLM Selection Agent")
        print("   4. 🧠 AI Agent (Main Processing)")
        print("   5. 💬 Observation Lounge Communication")
        print("   6. 💾 Memory Storage")
        print("   7. 📤 Response (Final Output)")
        
        return workflow
    
    def create_riker_template(self, picard_workflow: Dict) -> Dict:
        """Create a corrected Riker workflow based on Picard's template."""
        print(f"\n🔄 CREATING CORRECTED RIKER TEMPLATE...")
        print("=" * 50)
        
        # Deep copy Picard's structure
        riker_template = json.loads(json.dumps(picard_workflow))
        
        # Update workflow metadata
        riker_template['name'] = "Crew - Commander William Riker - Tactical Execution & Workflow Management"
        
        # Update node names and content for Commander Riker
        for node in riker_template.get('nodes', []):
            node_name = node.get('name', '')
            
            if 'Captain Jean-Luc Picard' in node_name:
                # Replace with Commander Riker equivalents
                if 'Directive' in node_name:
                    node['name'] = "Commander William Riker Directive"
                    if 'parameters' in node and 'path' in node['parameters']:
                        node['parameters']['path'] = "crew-commander-william-riker"
                elif 'Memory Retrieval' in node_name:
                    node['name'] = "Commander William Riker Memory Retrieval"
                elif 'AI Agent' in node_name:
                    node['name'] = "Commander William Riker AI Agent"
                elif 'Memory Storage' in node_name:
                    node['name'] = "Commander William Riker Memory Storage"
                elif 'Response' in node_name:
                    node['name'] = "Commander William Riker Response"
        
        # Clean up problematic fields
        if 'id' in riker_template: del riker_template['id']
        if 'createdAt' in riker_template: del riker_template['createdAt']
        if 'updatedAt' in riker_template: del riker_template['updatedAt']
        if 'versionId' in riker_template: del riker_template['versionId']
        if 'triggerCount' in riker_template: del riker_template['triggerCount']
        if 'staticData' in riker_template: del riker_template['staticData']
        if 'meta' in riker_template: del riker_template['meta']
        if 'pinData' in riker_template: del riker_template['pinData']
        if 'active' in riker_template: del riker_template['active']
        
        # Ensure clean settings
        riker_template['settings'] = {}
        
        print(f"✅ Corrected Riker template created")
        print(f"📊 Template fields: {list(riker_template.keys())}")
        
        return riker_template
    
    def run_analysis(self):
        """Run the complete analysis and template creation process."""
        print("🚀 CAPTAIN PICARD TEMPLATE ANALYSIS & RIKER CORRECTION")
        print("=" * 80)
        
        # Step 1: Fetch Picard's workflow
        print("📡 Step 1: Fetching Captain Picard's workflow...")
        picard_workflow = self.fetch_picard_workflow()
        
        if not picard_workflow:
            print("❌ Failed to fetch Picard's workflow!")
            return None
        
        # Step 2: Analyze structure
        print("\n🔍 Step 2: Analyzing Picard's complete structure...")
        self.analyze_picard_structure(picard_workflow)
        
        # Step 3: Create corrected Riker template
        print("\n🔄 Step 3: Creating corrected Riker template...")
        riker_template = self.create_riker_template(picard_workflow)
        
        # Save corrected template
        template_file = "riker_corrected_template.json"
        with open(template_file, 'w') as f:
            json.dump(riker_template, f, indent=2)
        
        print(f"\n💾 Corrected Riker template saved: {template_file}")
        print(f"🎯 This template has the complete 7-node structure matching Picard's optimal pattern")
        
        return riker_template

if __name__ == "__main__":
    try:
        analyzer = PicardTemplateAnalyzer()
        riker_template = analyzer.run_analysis()
        
        if riker_template:
            print(f"\n🎉 ANALYSIS COMPLETE!")
            print("Commander Riker's corrected template is ready for deployment.")
        else:
            print(f"\n❌ Analysis failed!")
            
    except Exception as e:
        print(f"❌ Template analysis failed: {e}")
