#!/usr/bin/env python3
"""
Verify Riker and Picard Workflow Identity
Ensures both workflows have identical nodes and connections after manual corrections.
"""

import json
import requests
import os
from typing import Dict, List, Tuple

class WorkflowIdentityVerifier:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
    
    def fetch_workflows(self) -> Tuple[Dict, Dict]:
        """Fetch both Riker's and Picard's workflows from n8n."""
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
                return {}, {}
            
            riker_workflow = {}
            picard_workflow = {}
            
            for workflow in workflows:
                name = workflow.get('name', '')
                if 'Commander William Riker' in name:
                    riker_workflow = workflow
                    print(f"✅ Found Commander Riker's workflow: {name}")
                elif 'Captain Jean-Luc Picard' in name:
                    picard_workflow = workflow
                    print(f"✅ Found Captain Picard's workflow: {name}")
            
            if not riker_workflow:
                print("❌ Commander Riker's workflow not found!")
            if not picard_workflow:
                print("❌ Captain Picard's workflow not found!")
                
            return riker_workflow, picard_workflow
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to fetch workflows: {e}")
            return {}, {}
    
    def analyze_workflow_structure(self, workflow: Dict, name: str) -> Dict:
        """Analyze the structure of a workflow."""
        nodes = workflow.get('nodes', [])
        connections = workflow.get('connections', {})
        
        # Analyze nodes
        node_analysis = []
        for i, node in enumerate(nodes):
            node_info = {
                'index': i + 1,
                'id': node.get('id', ''),
                'name': node.get('name', ''),
                'type': node.get('type', ''),
                'role': self.determine_node_role(node.get('name', ''), node.get('type', ''))
            }
            node_analysis.append(node_info)
        
        # Analyze connections
        connection_analysis = []
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
                                    connection_analysis.append({
                                        'from': source_name,
                                        'to': target_name,
                                        'output': output
                                    })
        
        return {
            'name': name,
            'total_nodes': len(nodes),
            'total_connections': len(connection_analysis),
            'nodes': node_analysis,
            'connections': connection_analysis
        }
    
    def determine_node_role(self, node_name: str, node_type: str) -> str:
        """Determine the role of a node based on its name and type."""
        if 'webhook' in node_type.lower():
            return "🚀 INPUT TRIGGER"
        elif 'memory' in node_name.lower() and 'retrieval' in node_name.lower():
            return "📚 MEMORY RETRIEVAL"
        elif 'llm' in node_name.lower() and 'selection' in node_name.lower():
            return "🤖 LLM SELECTION"
        elif 'ai agent' in node_name.lower():
            return "🧠 AI PROCESSING"
        elif 'communication' in node_name.lower():
            return "💬 COMMUNICATION"
        elif 'memory' in node_name.lower() and 'storage' in node_name.lower():
            return "💾 MEMORY STORAGE"
        elif 'response' in node_name.lower():
            return "📤 FINAL OUTPUT"
        else:
            return "🔧 UNKNOWN"
    
    def compare_workflows(self, riker_analysis: Dict, picard_analysis: Dict) -> bool:
        """Compare two workflows for identity."""
        print("🔍 COMPARING WORKFLOW STRUCTURES...")
        print("=" * 60)
        
        # Compare basic metrics
        print(f"📊 BASIC METRICS COMPARISON:")
        print(f"   {'Metric':<20} {'Riker':<10} {'Picard':<10} {'Match':<10}")
        print(f"   {'-'*20} {'-'*10} {'-'*10} {'-'*10}")
        
        metrics = [
            ('Total Nodes', riker_analysis['total_nodes'], picard_analysis['total_nodes']),
            ('Total Connections', riker_analysis['total_connections'], picard_analysis['total_connections'])
        ]
        
        all_match = True
        for metric, riker_val, picard_val in metrics:
            match = "✅" if riker_val == picard_val else "❌"
            if riker_val != picard_val:
                all_match = False
            print(f"   {metric:<20} {riker_val:<10} {picard_val:<10} {match:<10}")
        
        # Compare node structures
        print(f"\n🔧 NODE STRUCTURE COMPARISON:")
        print("=" * 50)
        
        riker_nodes = riker_analysis['nodes']
        picard_nodes = picard_analysis['nodes']
        
        if len(riker_nodes) != len(picard_nodes):
            print(f"❌ Node count mismatch: Riker has {len(riker_nodes)}, Picard has {len(picard_nodes)}")
            all_match = False
        else:
            print(f"✅ Node count matches: {len(riker_nodes)} nodes each")
            
            for i in range(len(riker_nodes)):
                riker_node = riker_nodes[i]
                picard_node = picard_nodes[i]
                
                print(f"\n   Node {i+1}:")
                print(f"      Riker:  {riker_node['name']} ({riker_node['role']})")
                print(f"      Picard: {picard_node['name']} ({picard_node['role']})")
                
                # Check if node types match (ignoring names)
                if riker_node['type'] == picard_node['type']:
                    print(f"      ✅ Type match: {riker_node['type']}")
                else:
                    print(f"      ❌ Type mismatch: {riker_node['type']} vs {picard_node['type']}")
                    all_match = False
                
                # Check if roles match
                if riker_node['role'] == picard_node['role']:
                    print(f"      ✅ Role match: {riker_node['role']}")
                else:
                    print(f"      ❌ Role mismatch: {riker_node['role']} vs {picard_node['role']}")
                    all_match = False
        
        # Compare connection structures
        print(f"\n🔗 CONNECTION STRUCTURE COMPARISON:")
        print("=" * 55)
        
        riker_connections = riker_analysis['connections']
        picard_connections = picard_analysis['connections']
        
        if len(riker_connections) != len(picard_connections):
            print(f"❌ Connection count mismatch: Riker has {len(riker_connections)}, Picard has {len(picard_connections)}")
            all_match = False
        else:
            print(f"✅ Connection count matches: {len(riker_connections)} connections each")
            
            # Compare connection patterns (ignoring specific names)
            riker_patterns = [(conn['from'], conn['to'], conn['output']) for conn in riker_connections]
            picard_patterns = [(conn['from'], conn['to'], conn['output']) for conn in picard_connections]
            
            # Sort patterns for comparison
            riker_patterns.sort()
            picard_patterns.sort()
            
            if riker_patterns == picard_patterns:
                print(f"✅ Connection patterns match exactly")
            else:
                print(f"❌ Connection patterns differ")
                all_match = False
                
                print(f"\n   Riker's connections:")
                for conn in riker_connections:
                    print(f"      {conn['from']} → {conn['to']} ({conn['output']})")
                
                print(f"\n   Picard's connections:")
                for conn in picard_connections:
                    print(f"      {conn['from']} → {conn['to']} ({conn['output']})")
        
        return all_match
    
    def run_verification(self):
        """Run the complete workflow identity verification."""
        print("🔍 VERIFYING RIKER AND PICARD WORKFLOW IDENTITY")
        print("=" * 80)
        
        # Step 1: Fetch workflows
        print("📡 Step 1: Fetching workflows from n8n...")
        riker_workflow, picard_workflow = self.fetch_workflows()
        
        if not riker_workflow or not picard_workflow:
            print("❌ Failed to fetch one or both workflows!")
            return False
        
        # Step 2: Analyze structures
        print("\n🔍 Step 2: Analyzing workflow structures...")
        riker_analysis = self.analyze_workflow_structure(riker_workflow, "Commander William Riker")
        picard_analysis = self.analyze_workflow_structure(picard_workflow, "Captain Jean-Luc Picard")
        
        # Step 3: Compare workflows
        print("\n🔍 Step 3: Comparing workflow structures...")
        workflows_match = self.compare_workflows(riker_analysis, picard_analysis)
        
        # Final assessment
        print(f"\n📊 FINAL ASSESSMENT:")
        print("=" * 40)
        
        if workflows_match:
            print("🎉 WORKFLOW IDENTITY VERIFIED!")
            print("✅ Commander Riker and Captain Picard have identical workflow structures")
            print("✅ All nodes match in type and role")
            print("✅ All connections follow the same pattern")
            print("✅ Manual corrections were successful")
        else:
            print("❌ WORKFLOW IDENTITY MISMATCH DETECTED!")
            print("⚠️  Commander Riker and Captain Picard have different workflow structures")
            print("⚠️  Manual corrections may be incomplete")
            print("⚠️  Further investigation required")
        
        return workflows_match

if __name__ == "__main__":
    try:
        verifier = WorkflowIdentityVerifier()
        workflows_match = verifier.run_verification()
        
        if workflows_match:
            print(f"\n🎯 Verification complete: Workflows are identical!")
        else:
            print(f"\n⚠️  Verification complete: Workflows have differences!")
            
    except Exception as e:
        print(f"❌ Workflow identity verification failed: {e}")
