#!/usr/bin/env python3
"""
Compare Picard vs Riker Workflows
Detailed analysis of workflow differences and structural variations.
"""

import json
import requests
import os
from typing import Dict, List
from datetime import datetime

class WorkflowComparator:
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
    
    def find_crew_workflows(self, workflows: List[Dict]) -> Dict:
        """Find Captain Picard's and Commander Riker's workflows."""
        picard_workflow = None
        riker_workflow = None
        
        for workflow in workflows:
            name = workflow.get('name', '')
            if 'Captain Jean-Luc Picard' in name:
                picard_workflow = workflow
            elif 'Commander William Riker' in name:
                riker_workflow = workflow
        
        return {
            'picard': picard_workflow,
            'riker': riker_workflow
        }
    
    def analyze_workflow_structure(self, workflow: Dict, name: str) -> Dict:
        """Analyze the structure of a workflow."""
        if not workflow:
            return {}
        
        nodes = workflow.get('nodes', [])
        connections = workflow.get('connections', {})
        
        # Analyze node types and flow
        node_analysis = {
            'total_nodes': len(nodes),
            'node_types': {},
            'webhook_nodes': [],
            'memory_nodes': [],
            'llm_nodes': [],
            'response_nodes': [],
            'other_nodes': []
        }
        
        for node in nodes:
            node_type = node.get('type', '')
            node_name = node.get('name', '')
            
            # Count node types
            if node_type in node_analysis['node_types']:
                node_analysis['node_types'][node_type] += 1
            else:
                node_analysis['node_types'][node_type] = 1
            
            # Categorize nodes by function
            if 'webhook' in node_type.lower():
                node_analysis['webhook_nodes'].append({
                    'name': node_name,
                    'type': node_type,
                    'parameters': node.get('parameters', {})
                })
            elif 'httpRequest' in node_type and 'supabase' in str(node.get('parameters', {})):
                node_analysis['memory_nodes'].append({
                    'name': node_name,
                    'type': node_type,
                    'parameters': node.get('parameters', {})
                })
            elif 'httpRequest' in node_type and 'openrouter' in str(node.get('parameters', {})):
                node_analysis['llm_nodes'].append({
                    'name': node_name,
                    'type': node_type,
                    'parameters': node.get('parameters', {})
                })
            elif 'respondToWebhook' in node_type:
                node_analysis['response_nodes'].append({
                    'name': node_name,
                    'type': node_type,
                    'parameters': node.get('parameters', {})
                })
            else:
                node_analysis['other_nodes'].append({
                    'name': node_name,
                    'type': node_type,
                    'parameters': node.get('parameters', {})
                })
        
        # Analyze connections and flow
        connection_analysis = {
            'total_connections': 0,
            'connection_details': []
        }
        
        if isinstance(connections, dict):
            for source_id, targets in connections.items():
                if isinstance(targets, dict):
                    for output, connections_list in targets.items():
                        if isinstance(connections_list, list):
                            for connection in connections_list:
                                if isinstance(connection, dict):
                                    connection_analysis['total_connections'] += 1
                                    
                                    # Find source and target node names
                                    source_node = next((n for n in nodes if n.get('id') == source_id), {})
                                    target_node = next((n for n in nodes if n.get('id') == connection.get('node')), {})
                                    
                                    connection_analysis['connection_details'].append({
                                        'from': source_node.get('name', 'Unknown'),
                                        'to': target_node.get('name', 'Unknown'),
                                        'output': output
                                    })
        
        # Determine flow pattern
        if node_analysis['webhook_nodes'] and node_analysis['memory_nodes'] and node_analysis['llm_nodes'] and node_analysis['response_nodes']:
            node_analysis['flow_pattern'] = 'webhook-memory-llm-response'
        elif node_analysis['webhook_nodes'] and node_analysis['llm_nodes'] and node_analysis['response_nodes']:
            node_analysis['flow_pattern'] = 'webhook-llm-response'
        else:
            node_analysis['flow_pattern'] = 'custom'
        
        return {
            'name': name,
            'node_analysis': node_analysis,
            'connection_analysis': connection_analysis,
            'workflow_id': workflow.get('id', ''),
            'active': workflow.get('active', False),
            'created_at': workflow.get('createdAt', ''),
            'updated_at': workflow.get('updatedAt', '')
        }
    
    def compare_workflows(self, picard_analysis: Dict, riker_analysis: Dict) -> Dict:
        """Compare the two workflow analyses."""
        comparison = {
            'structural_differences': {},
            'node_count_comparison': {},
            'flow_pattern_comparison': {},
            'memory_integration_comparison': {},
            'llm_integration_comparison': {},
            'webhook_configuration_comparison': {},
            'recommendations': []
        }
        
        # Node count comparison
        comparison['node_count_comparison'] = {
            'picard': picard_analysis.get('node_analysis', {}).get('total_nodes', 0),
            'riker': riker_analysis.get('node_analysis', {}).get('total_nodes', 0),
            'difference': abs((picard_analysis.get('node_analysis', {}).get('total_nodes', 0) - 
                             riker_analysis.get('node_analysis', {}).get('total_nodes', 0)))
        }
        
        # Flow pattern comparison
        picard_pattern = picard_analysis.get('node_analysis', {}).get('flow_pattern', 'unknown')
        riker_pattern = riker_analysis.get('node_analysis', {}).get('flow_pattern', 'unknown')
        
        comparison['flow_pattern_comparison'] = {
            'picard': picard_pattern,
            'riker': riker_pattern,
            'patterns_match': picard_pattern == riker_pattern
        }
        
        # Memory integration comparison
        picard_memory = len(picard_analysis.get('node_analysis', {}).get('memory_nodes', []))
        riker_memory = len(riker_analysis.get('node_analysis', {}).get('memory_nodes', []))
        
        comparison['memory_integration_comparison'] = {
            'picard': picard_memory,
            'riker': riker_memory,
            'picard_has_more': picard_memory > riker_memory,
            'riker_has_more': riker_memory > picard_memory
        }
        
        # LLM integration comparison
        picard_llm = len(picard_analysis.get('node_analysis', {}).get('llm_nodes', []))
        riker_llm = len(riker_analysis.get('node_analysis', {}).get('llm_nodes', []))
        
        comparison['llm_integration_comparison'] = {
            'picard': picard_llm,
            'riker': riker_llm,
            'picard_has_more': picard_llm > riker_llm,
            'riker_has_more': riker_llm > picard_llm
        }
        
        # Webhook configuration comparison
        picard_webhooks = len(picard_analysis.get('node_analysis', {}).get('webhook_nodes', []))
        riker_webhooks = len(riker_analysis.get('node_analysis', {}).get('webhook_nodes', []))
        
        comparison['webhook_configuration_comparison'] = {
            'picard': picard_webhooks,
            'riker': riker_webhooks,
            'both_have_webhooks': picard_webhooks > 0 and riker_webhooks > 0
        }
        
        # Generate recommendations
        if picard_pattern == 'webhook-memory-llm-response' and riker_pattern != 'webhook-memory-llm-response':
            comparison['recommendations'].append("Picard's workflow follows the optimal 'webhook-memory-llm-response' pattern")
            comparison['recommendations'].append("Riker's workflow should be updated to match Picard's structure")
        
        if picard_memory > riker_memory:
            comparison['recommendations'].append("Picard's workflow has better memory integration")
            comparison['recommendations'].append("Riker's workflow is missing memory storage/retrieval nodes")
        
        if picard_llm > riker_llm:
            comparison['recommendations'].append("Picard's workflow has more comprehensive LLM integration")
            comparison['recommendations'].append("Riker's workflow may be missing LLM processing nodes")
        
        return comparison
    
    def generate_comparison_report(self, picard_analysis: Dict, riker_analysis: Dict, comparison: Dict) -> str:
        """Generate a comprehensive comparison report."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = f"picard_vs_riker_comparison_report_{timestamp}.json"
        
        # Create comprehensive report
        full_report = {
            'comparison_timestamp': datetime.now().isoformat(),
            'picard_workflow': picard_analysis,
            'riker_workflow': riker_analysis,
            'comparison_analysis': comparison,
            'summary': {
                'picard_optimal': comparison.get('flow_pattern_comparison', {}).get('picard') == 'webhook-memory-llm-response',
                'riker_needs_update': comparison.get('flow_pattern_comparison', {}).get('picard') != comparison.get('flow_pattern_comparison', {}).get('riker'),
                'structural_differences': comparison.get('node_count_comparison', {}).get('difference', 0) > 0
            }
        }
        
        # Save detailed report
        with open(report_file, 'w') as f:
            json.dump(full_report, f, indent=2)
        
        # Display summary
        print("\n📊 PICARD VS RIKER WORKFLOW COMPARISON SUMMARY")
        print("=" * 70)
        
        print(f"🏆 CAPTAIN PICARD'S WORKFLOW:")
        print(f"   Node Count: {picard_analysis.get('node_analysis', {}).get('total_nodes', 0)}")
        print(f"   Flow Pattern: {picard_analysis.get('node_analysis', {}).get('flow_pattern', 'unknown')}")
        print(f"   Memory Nodes: {len(picard_analysis.get('node_analysis', {}).get('memory_nodes', []))}")
        print(f"   LLM Nodes: {len(picard_analysis.get('node_analysis', {}).get('llm_nodes', []))}")
        print(f"   Webhook Nodes: {len(picard_analysis.get('node_analysis', {}).get('webhook_nodes', []))}")
        
        print(f"\n⚡ COMMANDER RIKER'S WORKFLOW:")
        print(f"   Node Count: {riker_analysis.get('node_analysis', {}).get('total_nodes', 0)}")
        print(f"   Flow Pattern: {riker_analysis.get('node_analysis', {}).get('flow_pattern', 'unknown')}")
        print(f"   Memory Nodes: {len(riker_analysis.get('node_analysis', {}).get('memory_nodes', []))}")
        print(f"   LLM Nodes: {len(riker_analysis.get('node_analysis', {}).get('llm_nodes', []))}")
        print(f"   Webhook Nodes: {len(riker_analysis.get('node_analysis', {}).get('webhook_nodes', []))}")
        
        print(f"\n🔍 COMPARISON ANALYSIS:")
        print(f"   Node Count Difference: {comparison.get('node_count_comparison', {}).get('difference', 0)}")
        print(f"   Flow Patterns Match: {comparison.get('flow_pattern_comparison', {}).get('patterns_match', False)}")
        print(f"   Memory Integration: Picard {'>' if comparison.get('memory_integration_comparison', {}).get('picard_has_more', False) else '<='} Riker")
        print(f"   LLM Integration: Picard {'>' if comparison.get('llm_integration_comparison', {}).get('picard_has_more', False) else '<='} Riker")
        
        if comparison.get('recommendations'):
            print(f"\n💡 RECOMMENDATIONS:")
            for rec in comparison.get('recommendations', []):
                print(f"   - {rec}")
        
        print(f"\n💾 Comparison report saved: {report_file}")
        
        return report_file
    
    def run_comparison(self):
        """Run the complete workflow comparison."""
        print("🔍 COMPARING PICARD VS RIKER WORKFLOWS...")
        print("=" * 60)
        
        # Fetch workflows
        print("📡 Fetching workflows from n8n instance...")
        all_workflows = self.fetch_all_workflows()
        
        if not all_workflows:
            print("❌ No workflows found!")
            return None
        
        # Find crew workflows
        print("👥 Finding Captain Picard and Commander Riker workflows...")
        crew_workflows = self.find_crew_workflows(all_workflows)
        
        if not crew_workflows['picard'] or not crew_workflows['riker']:
            print("❌ Could not find both Picard and Riker workflows!")
            return None
        
        print(f"✅ Found Picard's workflow: {crew_workflows['picard'].get('name', '')}")
        print(f"✅ Found Riker's workflow: {crew_workflows['riker'].get('name', '')}")
        
        # Analyze workflows
        print("\n🔍 Analyzing workflow structures...")
        picard_analysis = self.analyze_workflow_structure(crew_workflows['picard'], "Captain Jean-Luc Picard")
        riker_analysis = self.analyze_workflow_structure(crew_workflows['riker'], "Commander William Riker")
        
        # Compare workflows
        print("📊 Comparing workflow differences...")
        comparison = self.compare_workflows(picard_analysis, riker_analysis)
        
        # Generate report
        print("\n📝 Generating comparison report...")
        report_file = self.generate_comparison_report(picard_analysis, riker_analysis, comparison)
        
        return {
            'picard_analysis': picard_analysis,
            'riker_analysis': riker_analysis,
            'comparison': comparison,
            'report_file': report_file
        }

if __name__ == "__main__":
    try:
        comparator = WorkflowComparator()
        result = comparator.run_comparison()
        
        if result:
            print("\n🎉 WORKFLOW COMPARISON COMPLETE!")
            print("Use the generated report for detailed analysis.")
        else:
            print("\n❌ Workflow comparison failed!")
            
    except Exception as e:
        print(f"❌ Workflow comparison failed: {e}")
