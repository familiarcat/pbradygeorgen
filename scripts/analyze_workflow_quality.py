#!/usr/bin/env python3
"""
Workflow Quality Analysis Script
Analyzes duplicate workflows to identify best-of-breed versions for each crew member.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List, Set
from datetime import datetime

class WorkflowQualityAnalyzer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
    
    def fetch_workflows(self) -> List[Dict]:
        """Fetch all workflows from n8n instance."""
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
    
    def analyze_workflow_quality(self, workflow: Dict) -> Dict:
        """Analyze the quality of a single workflow."""
        nodes = workflow.get('nodes', [])
        connections = workflow.get('connections', {})
        
        analysis = {
            'id': workflow.get('id', ''),
            'name': workflow.get('name', ''),
            'active': workflow.get('active', False),
            'archived': workflow.get('isArchived', False),
            'node_count': len(nodes),
            'connection_count': len(connections),
            'has_memory_integration': False,
            'has_llm_integration': False,
            'has_webhook': False,
            'has_response_handler': False,
            'memory_nodes': [],
            'llm_nodes': [],
            'webhook_nodes': [],
            'response_nodes': [],
            'quality_score': 0,
            'missing_components': [],
            'recommendations': []
        }
        
        # Analyze each node
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                node_name = node.get('name', '')
                
                # Check for memory integration (Supabase)
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'supabase.co' in url:
                        analysis['has_memory_integration'] = True
                        analysis['memory_nodes'].append({
                            'name': node_name,
                            'type': node_type,
                            'url': url
                        })
                
                # Check for LLM integration (OpenRouter)
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'openrouter.ai' in url:
                        analysis['has_llm_integration'] = True
                        analysis['llm_nodes'].append({
                            'name': node_name,
                            'type': node_type,
                            'url': url
                        })
                
                # Check for webhook
                if 'webhook' in node_type:
                    analysis['has_webhook'] = True
                    analysis['webhook_nodes'].append({
                        'name': node_name,
                        'type': node_type
                    })
                
                # Check for response handler
                if 'respondToWebhook' in node_type:
                    analysis['has_response_handler'] = True
                    analysis['response_nodes'].append({
                        'name': node_name,
                        'type': node_type
                    })
        
        # Calculate quality score
        score = 0
        missing = []
        
        # Base score for essential components
        if analysis['has_webhook']:
            score += 20
        else:
            missing.append('Webhook trigger')
        
        if analysis['has_llm_integration']:
            score += 25
        else:
            missing.append('LLM integration')
        
        if analysis['has_memory_integration']:
            score += 30
        else:
            missing.append('Memory integration')
        
        if analysis['has_response_handler']:
            score += 15
        else:
            missing.append('Response handler')
        
        # Bonus for proper structure
        if analysis['node_count'] >= 5:
            score += 10
        else:
            missing.append('Sufficient node count')
        
        if analysis['connection_count'] >= 3:
            score += 10
        else:
            missing.append('Proper connections')
        
        analysis['quality_score'] = score
        analysis['missing_components'] = missing
        
        # Generate recommendations
        if score >= 80:
            analysis['recommendations'].append('High quality - Keep this workflow')
        elif score >= 60:
            analysis['recommendations'].append('Medium quality - Consider keeping if no better alternatives')
        else:
            analysis['recommendations'].append('Low quality - Candidate for removal')
        
        return analysis
    
    def compare_crew_workflows(self, workflows: List[Dict]) -> Dict:
        """Compare workflows for each crew member and identify best of breed."""
        crew_analysis = defaultdict(list)
        
        # Group workflows by crew member
        for workflow in workflows:
            if not workflow.get('active', False):
                continue
                
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member and crew_member != 'System Workflow':
                # Analyze workflow quality
                quality_analysis = self.analyze_workflow_quality(workflow)
                crew_analysis[crew_member].append(quality_analysis)
        
        # Find best of breed for each crew member
        best_of_breed = {}
        comparison_results = {}
        
        for crew_member, workflow_list in crew_analysis.items():
            if len(workflow_list) == 1:
                # Only one workflow, keep it
                best_of_breed[crew_member] = workflow_list[0]
                comparison_results[crew_member] = {
                    'workflow_count': 1,
                    'best_workflow': workflow_list[0],
                    'duplicates': [],
                    'recommendation': 'Keep single workflow'
                }
            else:
                # Multiple workflows, find best
                # Sort by quality score (highest first)
                workflow_list.sort(key=lambda x: x['quality_score'], reverse=True)
                
                best_workflow = workflow_list[0]
                duplicates = workflow_list[1:]
                
                best_of_breed[crew_member] = best_workflow
                comparison_results[crew_member] = {
                    'workflow_count': len(workflow_list),
                    'best_workflow': best_workflow,
                    'duplicates': duplicates,
                    'recommendation': f'Keep best workflow (ID: {best_workflow["id"]}), deactivate {len(duplicates)} duplicates'
                }
        
        return {
            'best_of_breed': best_of_breed,
            'comparison_results': comparison_results,
            'summary': {
                'total_crew_members': len(crew_analysis),
                'crew_with_duplicates': len([c for c in comparison_results.values() if c['workflow_count'] > 1]),
                'total_duplicates': sum([c['workflow_count'] - 1 for c in comparison_results.values()])
            }
        }
    
    def extract_crew_member(self, workflow_name: str) -> str:
        """Extract crew member name from workflow name."""
        crew_members = [
            'Captain Jean-Luc Picard',
            'Commander William Riker',
            'Dr. Beverly Crusher',
            'Commander Data',
            'Lieutenant Commander Geordi La Forge',
            'Lieutenant Worf',
            'Counselor Deanna Troi',
            'Lieutenant Uhura',
            'Quark'
        ]
        
        for member in crew_members:
            if member.lower() in workflow_name.lower():
                return member
        
        if 'Federation' in workflow_name or 'AlexAI' in workflow_name:
            return 'System Workflow'
        
        return 'Unknown'
    
    def generate_cleanup_guide(self, comparison_results: Dict) -> str:
        """Generate a manual cleanup guide for the user."""
        guide = []
        guide.append("🧹 MANUAL CLEANUP GUIDE")
        guide.append("=" * 50)
        guide.append("")
        guide.append("Based on the analysis, here's what to keep vs. deactivate:")
        guide.append("")
        
        for crew_member, result in comparison_results.items():
            guide.append(f"👥 {crew_member}")
            guide.append(f"   📊 Total workflows: {result['workflow_count']}")
            
            if result['workflow_count'] == 1:
                guide.append(f"   ✅ KEEP: {result['best_workflow']['name']}")
                guide.append(f"      ID: {result['best_workflow']['id']}")
                guide.append(f"      Quality Score: {result['best_workflow']['quality_score']}/100")
            else:
                guide.append(f"   🎯 KEEP (Best): {result['best_workflow']['name']}")
                guide.append(f"      ID: {result['best_workflow']['id']}")
                guide.append(f"      Quality Score: {result['best_workflow']['quality_score']}/100")
                guide.append("")
                guide.append("   🗑️  DEACTIVATE (Duplicates):")
                for duplicate in result['duplicates']:
                    guide.append(f"      - {duplicate['name']}")
                    guide.append(f"        ID: {duplicate['id']}")
                    guide.append(f"        Quality Score: {duplicate['quality_score']}/100")
                    guide.append(f"        Missing: {', '.join(duplicate['missing_components'])}")
            
            guide.append("")
        
        return "\n".join(guide)
    
    def run_analysis(self):
        """Run the complete workflow quality analysis."""
        print("🔍 Analyzing workflow quality and identifying best of breed...")
        
        # Fetch workflows
        workflows = self.fetch_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Compare crew workflows
        print("🎯 Comparing workflows for each crew member...")
        comparison_results = self.compare_crew_workflows(workflows)
        
        # Display results
        print("\n📊 ANALYSIS RESULTS:")
        print("=" * 50)
        
        summary = comparison_results['summary']
        print(f"Total Crew Members: {summary['total_crew_members']}")
        print(f"Crew with Duplicates: {summary['crew_with_duplicates']}")
        print(f"Total Duplicates: {summary['total_duplicates']}")
        
        # Display detailed results for each crew member
        print("\n👥 CREW MEMBER ANALYSIS:")
        for crew_member, result in comparison_results['comparison_results'].items():
            print(f"\n🎖️ {crew_member}")
            print(f"   Workflows: {result['workflow_count']}")
            print(f"   Recommendation: {result['recommendation']}")
            
            if result['workflow_count'] > 1:
                best = result['best_workflow']
                print(f"   Best Workflow: {best['name']}")
                print(f"   Quality Score: {best['quality_score']}/100")
                print(f"   Memory Integration: {'✅' if best['has_memory_integration'] else '❌'}")
                print(f"   LLM Integration: {'✅' if best['has_llm_integration'] else '❌'}")
        
        # Generate cleanup guide
        print("\n" + "=" * 50)
        cleanup_guide = self.generate_cleanup_guide(comparison_results['comparison_results'])
        print(cleanup_guide)
        
        # Save detailed analysis
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"workflow_quality_analysis_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(comparison_results, f, indent=2)
        
        print(f"\n💾 Detailed analysis saved to: {filename}")
        
        return comparison_results

if __name__ == "__main__":
    try:
        analyzer = WorkflowQualityAnalyzer()
        analyzer.run_analysis()
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
