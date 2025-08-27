#!/usr/bin/env python3
"""
Analyze Crew Workflow Templates Script
Analyzes all crew workflows to identify the most optimized template for unification.
"""

import json
import requests
import os
from typing import Dict, List, Tuple
from datetime import datetime
from collections import defaultdict

class CrewWorkflowTemplateAnalyzer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Template quality metrics
        self.quality_metrics = {
            'memory_integration': 10,      # Supabase integration
            'llm_integration': 10,         # OpenRouter integration
            'webhook_configuration': 8,    # Proper webhook setup
            'response_handler': 8,         # Response formatting
            'error_handling': 6,           # Error handling nodes
            'node_efficiency': 5,          # Optimal node count
            'connection_quality': 5,       # Logical flow
            'documentation': 3,            # Node descriptions
            'tags': 2,                     # Proper tagging
            'settings': 2                  # Workflow settings
        }
    
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
    
    def analyze_workflow_structure(self, workflow: Dict) -> Dict:
        """Analyze the structure and quality of a workflow."""
        analysis = {
            'workflow_id': workflow.get('id', ''),
            'workflow_name': workflow.get('name', ''),
            'total_score': 0,
            'metrics': {},
            'structure': {},
            'issues': []
        }
        
        nodes = workflow.get('nodes', [])
        connections = workflow.get('connections', {})
        
        # Analyze memory integration
        memory_score = self.analyze_memory_integration(nodes)
        analysis['metrics']['memory_integration'] = memory_score
        
        # Analyze LLM integration
        llm_score = self.analyze_llm_integration(nodes)
        analysis['metrics']['llm_integration'] = llm_score
        
        # Analyze webhook configuration
        webhook_score = self.analyze_webhook_configuration(nodes)
        analysis['metrics']['webhook_configuration'] = webhook_score
        
        # Analyze response handler
        response_score = self.analyze_response_handler(nodes, connections)
        analysis['metrics']['response_handler'] = response_score
        
        # Analyze error handling
        error_score = self.analyze_error_handling(nodes)
        analysis['metrics']['error_handling'] = error_score
        
        # Analyze node efficiency
        efficiency_score = self.analyze_node_efficiency(nodes)
        analysis['metrics']['node_efficiency'] = efficiency_score
        
        # Analyze connection quality
        connection_score = self.analyze_connection_quality(nodes, connections)
        analysis['metrics']['connection_quality'] = connection_score
        
        # Analyze documentation
        doc_score = self.analyze_documentation(nodes)
        analysis['metrics']['documentation'] = doc_score
        
        # Analyze tags
        tag_score = self.analyze_tags(workflow)
        analysis['metrics']['tags'] = tag_score
        
        # Analyze settings
        settings_score = self.analyze_settings(workflow)
        analysis['metrics']['settings'] = settings_score
        
        # Calculate total score
        total_score = 0
        for metric, score in analysis['metrics'].items():
            weight = self.quality_metrics.get(metric, 1)
            total_score += score * weight
        
        analysis['total_score'] = total_score
        
        # Analyze structure
        analysis['structure'] = {
            'node_count': len(nodes),
            'connection_count': len(connections),
            'node_types': self.get_node_type_distribution(nodes),
            'flow_pattern': self.analyze_flow_pattern(nodes, connections),
            'memory_nodes': self.get_memory_nodes(nodes),
            'llm_nodes': self.get_llm_nodes(nodes),
            'webhook_nodes': self.get_webhook_nodes(nodes)
        }
        
        return analysis
    
    def analyze_memory_integration(self, nodes: List[Dict]) -> float:
        """Analyze memory integration quality."""
        memory_nodes = []
        score = 0
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'supabase.co' in url:
                        memory_nodes.append(node)
                        
                        # Check for proper memory configuration
                        if 'memory' in node.get('name', '').lower():
                            score += 2
                        if 'retrieve' in node.get('name', '').lower() or 'store' in node.get('name', '').lower():
                            score += 2
                        if parameters.get('method') == 'POST' or parameters.get('method') == 'GET':
                            score += 2
                        if parameters.get('authentication') or 'authorization' in str(parameters):
                            score += 2
                        score += 2  # Base score for having memory integration
        
        return min(score, 10)  # Cap at 10
    
    def analyze_llm_integration(self, nodes: List[Dict]) -> float:
        """Analyze LLM integration quality."""
        llm_nodes = []
        score = 0
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'openrouter.ai' in url:
                        llm_nodes.append(node)
                        
                        # Check for proper LLM configuration
                        if 'llm' in node.get('name', '').lower() or 'ai' in node.get('name', '').lower():
                            score += 2
                        if parameters.get('method') == 'POST':
                            score += 2
                        if 'model' in str(parameters) or 'anthropic' in str(parameters) or 'openai' in str(parameters):
                            score += 2
                        if 'prompt' in str(parameters) or 'messages' in str(parameters):
                            score += 2
                        score += 2  # Base score for having LLM integration
        
        return min(score, 10)  # Cap at 10
    
    def analyze_webhook_configuration(self, nodes: List[Dict]) -> float:
        """Analyze webhook configuration quality."""
        webhook_nodes = []
        score = 0
        
        for node in nodes:
            if isinstance(node, dict) and node.get('type') == 'n8n-nodes-base.webhook':
                webhook_nodes.append(node)
                
                parameters = node.get('parameters', {})
                
                # Check webhook configuration
                if parameters.get('httpMethod') == 'POST':
                    score += 2
                if parameters.get('path') and parameters.get('path') != '/':
                    score += 2
                if parameters.get('responseMode') == 'responseNode':
                    score += 2
                if parameters.get('options', {}).get('responseHeaders'):
                    score += 2
                score += 2  # Base score for having webhook
        
        return min(score, 8)  # Cap at 8
    
    def analyze_response_handler(self, nodes: List[Dict], connections: Dict) -> float:
        """Analyze response handler quality."""
        score = 0
        
        # Look for response nodes
        for node in nodes:
            if isinstance(node, dict):
                node_name = node.get('name', '').lower()
                if 'response' in node_name or 'output' in node_name:
                    score += 2
                    
                    # Check if it's properly connected
                    node_id = node.get('id', '')
                    if any(node_id in conn for conn in connections.values()):
                        score += 2
                    
                    # Check for proper response formatting
                    if node.get('type') == 'n8n-nodes-base.respondToWebhook':
                        score += 2
                    elif node.get('type') == 'n8n-nodes-base.set':
                        score += 1
        
        return min(score, 8)  # Cap at 8
    
    def analyze_error_handling(self, nodes: List[Dict]) -> float:
        """Analyze error handling quality."""
        score = 0
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                node_name = node.get('name', '').lower()
                
                # Check for error handling nodes
                if 'error' in node_name or 'catch' in node_name:
                    score += 2
                if node_type == 'n8n-nodes-base.if':
                    score += 1
                if 'continueOnFail' in str(node.get('parameters', {})):
                    score += 1
        
        return min(score, 6)  # Cap at 6
    
    def analyze_node_efficiency(self, nodes: List[Dict]) -> float:
        """Analyze node efficiency."""
        if not nodes:
            return 0
        
        # Optimal node count is 5-8 for crew workflows
        node_count = len(nodes)
        if 5 <= node_count <= 8:
            score = 5
        elif 3 <= node_count <= 10:
            score = 3
        else:
            score = 1
        
        return score
    
    def analyze_connection_quality(self, nodes: List[Dict], connections: Dict) -> float:
        """Analyze connection quality."""
        if not connections:
            return 0
        
        # Check for logical flow
        score = 0
        
        # Look for webhook → processing → response pattern
        webhook_ids = [n.get('id') for n in nodes if n.get('type') == 'n8n-nodes-base.webhook']
        response_ids = [n.get('id') for n in nodes if 'response' in n.get('name', '').lower()]
        
        if webhook_ids and response_ids:
            score += 2
        
        # Check for memory flow
        memory_ids = [n.get('id') for n in nodes if 'memory' in n.get('name', '').lower()]
        if memory_ids:
            score += 2
        
        # Check for LLM flow
        llm_ids = [n.get('id') for n in nodes if 'openrouter.ai' in str(n.get('parameters', {}))]
        if llm_ids:
            score += 1
        
        return min(score, 5)  # Cap at 5
    
    def analyze_documentation(self, nodes: List[Dict]) -> float:
        """Analyze documentation quality."""
        score = 0
        
        for node in nodes:
            if isinstance(node, dict):
                # Check for node descriptions
                if node.get('description'):
                    score += 1
                
                # Check for meaningful names
                node_name = node.get('name', '')
                if len(node_name) > 10 and not node_name.isupper():
                    score += 1
        
        return min(score, 3)  # Cap at 3
    
    def analyze_tags(self, workflow: Dict) -> float:
        """Analyze tagging quality."""
        tags = workflow.get('tags', [])
        score = 0
        
        if tags:
            score += 1
            if 'crew' in [tag.lower() for tag in tags]:
                score += 1
        
        return min(score, 2)  # Cap at 2
    
    def analyze_settings(self, workflow: Dict) -> float:
        """Analyze workflow settings."""
        settings = workflow.get('settings', {})
        score = 0
        
        if settings.get('executionOrder') == 'v1':
            score += 1
        if settings.get('saveExecutionProgress'):
            score += 1
        
        return min(score, 2)  # Cap at 2
    
    def get_node_type_distribution(self, nodes: List[Dict]) -> Dict[str, int]:
        """Get distribution of node types."""
        distribution = defaultdict(int)
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', 'unknown')
                distribution[node_type] += 1
        
        return dict(distribution)
    
    def analyze_flow_pattern(self, nodes: List[Dict], connections: Dict) -> str:
        """Analyze the flow pattern of the workflow."""
        if not nodes:
            return 'empty'
        
        webhook_count = len([n for n in nodes if n.get('type') == 'n8n-nodes-base.webhook'])
        response_count = len([n for n in nodes if 'response' in n.get('name', '').lower()])
        memory_count = len([n for n in nodes if 'memory' in n.get('name', '').lower()])
        llm_count = len([n for n in nodes if 'openrouter.ai' in str(n.get('parameters', {}))])
        
        if webhook_count > 0 and response_count > 0:
            if memory_count > 0 and llm_count > 0:
                return 'webhook-memory-llm-response'
            elif memory_count > 0:
                return 'webhook-memory-response'
            elif llm_count > 0:
                return 'webhook-llm-response'
            else:
                return 'webhook-response'
        else:
            return 'custom'
    
    def get_memory_nodes(self, nodes: List[Dict]) -> List[Dict]:
        """Get memory-related nodes."""
        memory_nodes = []
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'supabase.co' in url:
                        memory_nodes.append({
                            'id': node.get('id', ''),
                            'name': node.get('name', ''),
                            'type': node_type,
                            'url': url
                        })
        
        return memory_nodes
    
    def get_llm_nodes(self, nodes: List[Dict]) -> List[Dict]:
        """Get LLM-related nodes."""
        llm_nodes = []
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'openrouter.ai' in url:
                        llm_nodes.append({
                            'id': node.get('id', ''),
                            'name': node.get('name', ''),
                            'type': node_type,
                            'url': url
                        })
        
        return llm_nodes
    
    def get_webhook_nodes(self, nodes: List[Dict]) -> List[Dict]:
        """Get webhook nodes."""
        webhook_nodes = []
        
        for node in nodes:
            if isinstance(node, dict) and node.get('type') == 'n8n-nodes-base.webhook':
                webhook_nodes.append({
                    'id': node.get('id', ''),
                    'name': node.get('name', ''),
                    'parameters': node.get('parameters', {})
                })
        
        return webhook_nodes
    
    def find_best_template(self, analyses: List[Dict]) -> Tuple[Dict, List[Dict]]:
        """Find the best template and rank all workflows."""
        # Sort by total score (descending)
        sorted_analyses = sorted(analyses, key=lambda x: x['total_score'], reverse=True)
        
        best_template = sorted_analyses[0] if sorted_analyses else None
        
        return best_template, sorted_analyses
    
    def generate_unification_plan(self, best_template: Dict, all_analyses: List[Dict]) -> Dict:
        """Generate a plan to unify all workflows to the best template."""
        plan = {
            'best_template': {
                'workflow_id': best_template['workflow_id'],
                'workflow_name': best_template['workflow_name'],
                'total_score': best_template['total_score'],
                'structure': best_template['structure']
            },
            'unification_targets': [],
            'improvement_opportunities': [],
            'implementation_steps': []
        }
        
        # Identify workflows that need unification
        for analysis in all_analyses:
            if analysis['workflow_id'] != best_template['workflow_id']:
                score_diff = best_template['total_score'] - analysis['total_score']
                
                if score_diff > 10:  # Significant improvement needed
                    plan['unification_targets'].append({
                        'workflow_id': analysis['workflow_id'],
                        'workflow_name': analysis['workflow_name'],
                        'current_score': analysis['total_score'],
                        'score_gap': score_diff,
                        'priority': 'high' if score_diff > 20 else 'medium'
                    })
                elif score_diff > 5:  # Moderate improvement needed
                    plan['improvement_opportunities'].append({
                        'workflow_id': analysis['workflow_id'],
                        'workflow_name': analysis['workflow_name'],
                        'current_score': analysis['total_score'],
                        'score_gap': score_diff
                    })
        
        # Generate implementation steps
        plan['implementation_steps'] = [
            "1. Backup current workflow state",
            "2. Analyze best template structure in detail",
            "3. Create standardized template JSON",
            "4. Deploy unified template to all crew workflows",
            "5. Verify functionality and performance",
            "6. Update local configurations"
        ]
        
        return plan
    
    def run_analysis(self):
        """Run the complete workflow template analysis."""
        print("🔍 ANALYZING CREW WORKFLOW TEMPLATES FOR UNIFICATION...")
        print("=" * 70)
        
        # Fetch active workflows
        print("📡 Fetching active workflows from deployed n8n instance...")
        workflows = self.fetch_active_workflows()
        
        if not workflows:
            print("❌ No active workflows found")
            return
        
        print(f"📋 Found {len(workflows)} active workflows")
        
        # Filter crew workflows
        crew_workflows = [w for w in workflows if w.get('name', '').startswith('Crew -')]
        print(f"👥 Found {len(crew_workflows)} crew workflows")
        
        if not crew_workflows:
            print("❌ No crew workflows found")
            return
        
        # Analyze each crew workflow
        print("\n🔍 Analyzing crew workflow structures...")
        analyses = []
        
        for workflow in crew_workflows:
            print(f"  Analyzing: {workflow.get('name', '')}")
            analysis = self.analyze_workflow_structure(workflow)
            analyses.append(analysis)
        
        # Find best template
        print("\n🏆 Identifying best template...")
        best_template, ranked_analyses = self.find_best_template(analyses)
        
        if best_template:
            print(f"✅ Best Template: {best_template['workflow_name']}")
            print(f"   Score: {best_template['total_score']:.1f}")
            print(f"   Structure: {best_template['structure']['flow_pattern']}")
        
        # Generate unification plan
        print("\n📋 Generating unification plan...")
        plan = self.generate_unification_plan(best_template, ranked_analyses)
        
        # Display results
        print("\n📊 TEMPLATE ANALYSIS RESULTS")
        print("=" * 70)
        
        print(f"🏆 Best Template: {best_template['workflow_name']}")
        print(f"   Score: {best_template['total_score']:.1f}")
        print(f"   Node Count: {best_template['structure']['node_count']}")
        print(f"   Flow Pattern: {best_template['structure']['flow_pattern']}")
        
        print(f"\n📋 Workflow Rankings:")
        for i, analysis in enumerate(ranked_analyses[:5], 1):
            print(f"   {i}. {analysis['workflow_name']} - Score: {analysis['total_score']:.1f}")
        
        print(f"\n🎯 Unification Targets: {len(plan['unification_targets'])}")
        for target in plan['unification_targets']:
            print(f"   - {target['workflow_name']} (Gap: {target['score_gap']:.1f}, Priority: {target['priority']})")
        
        print(f"\n📈 Improvement Opportunities: {len(plan['improvement_opportunities'])}")
        for opp in plan['improvement_opportunities']:
            print(f"   - {opp['workflow_name']} (Gap: {opp['score_gap']:.1f})")
        
        # Save analysis results
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        analysis_file = f"crew_workflow_template_analysis_{timestamp}.json"
        
        results = {
            'analysis_timestamp': datetime.now().isoformat(),
            'best_template': best_template,
            'all_analyses': analyses,
            'unification_plan': plan,
            'summary': {
                'total_crew_workflows': len(crew_workflows),
                'best_template_score': best_template['total_score'] if best_template else 0,
                'average_score': sum(a['total_score'] for a in analyses) / len(analyses) if analyses else 0,
                'unification_targets': len(plan['unification_targets']),
                'improvement_opportunities': len(plan['improvement_opportunities'])
            }
        }
        
        with open(analysis_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\n💾 Analysis results saved: {analysis_file}")
        print("\n📝 Next: Review analysis and implement unification plan")
        
        return analysis_file

if __name__ == "__main__":
    try:
        analyzer = CrewWorkflowTemplateAnalyzer()
        analyzer.run_analysis()
    except Exception as e:
        print(f"❌ Template analysis failed: {e}")
