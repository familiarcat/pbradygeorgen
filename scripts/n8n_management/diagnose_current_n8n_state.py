#!/usr/bin/env python3
"""
Diagnose Current n8n State
Investigates the current corrupted state of n8n workflows to understand the extent of damage.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime

class N8nStateDiagnostic:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
    
    def fetch_all_workflows(self) -> List[Dict]:
        """Fetch all workflows from the deployed n8n instance."""
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
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
    
    def analyze_workflow_structure(self, workflow: Dict) -> Dict:
        """Analyze the structure of a workflow."""
        nodes = workflow.get('nodes', [])
        connections = workflow.get('connections', {})
        
        # Count node types
        node_types = {}
        for node in nodes:
            node_type = node.get('type', '')
            if node_type in node_types:
                node_types[node_type] += 1
            else:
                node_types[node_type] = 1
        
        # Check for duplicate names
        node_names = [node.get('name', '') for node in nodes]
        duplicate_names = [name for name in set(node_names) if node_names.count(name) > 1]
        
        # Check connections
        total_connections = 0
        if isinstance(connections, dict):
            for source_id, targets in connections.items():
                if isinstance(targets, dict):
                    for output, connections_list in targets.items():
                        if isinstance(connections_list, list):
                            total_connections += len(connections_list)
        
        return {
            'workflow_id': workflow.get('id', ''),
            'workflow_name': workflow.get('name', ''),
            'active': workflow.get('active', False),
            'total_nodes': len(nodes),
            'node_types': node_types,
            'duplicate_node_names': duplicate_names,
            'total_connections': total_connections,
            'has_webhook': any('webhook' in node.get('type', '').lower() for node in nodes),
            'has_memory': any('supabase' in str(node.get('parameters', {})) for node in nodes),
            'has_llm': any('openrouter' in str(node.get('parameters', {})) for node in nodes),
            'has_response': any('respondToWebhook' in node.get('type', '') for node in nodes)
        }
    
    def run_diagnosis(self):
        """Run the complete diagnosis."""
        print("🔍 DIAGNOSING CURRENT N8N STATE...")
        print("=" * 60)
        
        # Fetch current workflows
        print("📡 Fetching current workflows from n8n...")
        current_workflows = self.fetch_all_workflows()
        
        if not current_workflows:
            print("❌ No workflows found!")
            return
        
        print(f"✅ Found {len(current_workflows)} workflows")
        
        # Analyze each workflow
        print("\n🔍 Analyzing workflow structures...")
        analysis_results = []
        
        for workflow in current_workflows:
            analysis = self.analyze_workflow_structure(workflow)
            analysis_results.append(analysis)
            
            # Display immediate findings
            name = analysis['workflow_name']
            active = "🟢 ACTIVE" if analysis['active'] else "🔴 INACTIVE"
            nodes = analysis['total_nodes']
            connections = analysis['total_connections']
            duplicates = len(analysis['duplicate_node_names'])
            
            print(f"\n📋 {name}")
            print(f"   Status: {active}")
            print(f"   Nodes: {nodes}, Connections: {connections}")
            
            if duplicates > 0:
                print(f"   🚨 DUPLICATE NODE NAMES: {duplicates}")
                for dup_name in analysis['duplicate_node_names']:
                    print(f"      - {dup_name}")
            
            if analysis['total_connections'] == 0:
                print(f"   🚨 NO CONNECTIONS - WORKFLOW IS BROKEN!")
            
            # Check for essential components
            components = []
            if analysis['has_webhook']: components.append("Webhook")
            if analysis['has_memory']: components.append("Memory")
            if analysis['has_llm']: components.append("LLM")
            if analysis['has_response']: components.append("Response")
            
            if components:
                print(f"   Components: {', '.join(components)}")
            else:
                print(f"   🚨 NO ESSENTIAL COMPONENTS!")
        
        # Summary analysis
        print("\n📊 DIAGNOSIS SUMMARY")
        print("=" * 50)
        
        active_workflows = [w for w in analysis_results if w['active']]
        inactive_workflows = [w for w in analysis_results if not w['active']]
        broken_workflows = [w for w in analysis_results if w['total_connections'] == 0]
        workflows_with_duplicates = [w for w in analysis_results if w['duplicate_node_names']]
        
        print(f"📋 Total Workflows: {len(analysis_results)}")
        print(f"🟢 Active Workflows: {len(active_workflows)}")
        print(f"🔴 Inactive Workflows: {len(inactive_workflows)}")
        print(f"🚨 Broken Workflows (No Connections): {len(broken_workflows)}")
        print(f"🚨 Workflows with Duplicate Names: {len(workflows_with_duplicates)}")
        
        # Identify crew workflows
        crew_workflows = [w for w in analysis_results if 'Crew -' in w['workflow_name']]
        print(f"👥 Crew Workflows: {len(crew_workflows)}")
        
        # Save detailed report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"n8n_state_diagnosis_report_{timestamp}.json"
        
        full_report = {
            'diagnosis_timestamp': datetime.now().isoformat(),
            'summary': {
                'total_workflows': len(analysis_results),
                'active_workflows': len(active_workflows),
                'inactive_workflows': len(inactive_workflows),
                'broken_workflows': len(broken_workflows),
                'workflows_with_duplicates': len(workflows_with_duplicates),
                'crew_workflows': len(crew_workflows)
            },
            'workflow_analyses': analysis_results,
            'broken_workflows': [w for w in analysis_results if w['total_connections'] == 0],
            'workflows_with_duplicates': [w for w in analysis_results if w['duplicate_node_names']]
        }
        
        with open(report_file, 'w') as f:
            json.dump(full_report, f, indent=2)
        
        print(f"\n💾 Detailed diagnosis report saved: {report_file}")
        
        # Recommendations
        print("\n💡 RECOMMENDATIONS:")
        if len(broken_workflows) > 0:
            print("🚨 IMMEDIATE ACTION REQUIRED:")
            print("   - System is severely corrupted")
            print("   - Multiple workflows have no connections")
            print("   - Consider complete system restoration from backup")
        
        if len(workflows_with_duplicates) > 0:
            print("⚠️  STRUCTURAL ISSUES DETECTED:")
            print("   - Multiple workflows have duplicate node names")
            print("   - This indicates failed unification attempts")
        
        if len(crew_workflows) < 9:
            print("👥 CREW WORKFLOW ISSUES:")
            print("   - Expected 9 crew workflows, found fewer")
            print("   - Some crew members may be missing or corrupted")

if __name__ == "__main__":
    try:
        diagnostic = N8nStateDiagnostic()
        diagnostic.run_diagnosis()
    except Exception as e:
        print(f"❌ Diagnosis failed: {e}")
