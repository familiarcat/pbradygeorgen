#!/usr/bin/env python3
"""
Analyze System Workflow Duplicates Script
Identifies and analyzes duplicates among system workflows to find best-of-breed versions.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class SystemWorkflowAnalyzer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
    
    def fetch_current_workflows(self) -> List[Dict]:
        """Fetch current workflows from the deployed n8n instance."""
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
    
    def analyze_system_workflows(self, workflows: List[Dict]) -> Dict:
        """Analyze system workflows for duplicates and identify best of breed."""
        active_workflows = [w for w in workflows if w.get('active', False)]
        inactive_workflows = [w for w in workflows if not w.get('active', False)]
        
        crew_workflows = []
        system_workflows = []
        
        # Categorize active workflows
        for workflow in active_workflows:
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member and crew_member != 'System Workflow':
                crew_workflows.append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'crew_member': crew_member,
                    'active': True
                })
            else:
                system_workflows.append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'active': True,
                    'createdAt': workflow.get('createdAt', ''),
                    'updatedAt': workflow.get('updatedAt', ''),
                    'formatted_created': self.format_timestamp(workflow.get('createdAt', '')),
                    'formatted_updated': self.format_timestamp(workflow.get('updatedAt', '')),
                    'has_memory': self.has_memory_integration(workflow),
                    'has_llm': self.has_llm_integration(workflow),
                    'node_count': len(workflow.get('nodes', [])),
                    'connection_count': len(workflow.get('connections', {})),
                    'workflow_url': f"{self.n8n_url}/workflow/{workflow.get('id', '')}"
                })
        
        # Group system workflows by name to find duplicates
        system_workflow_groups = defaultdict(list)
        for workflow in system_workflows:
            name = workflow.get('name', '')
            system_workflow_groups[name].append(workflow)
        
        # Analyze each group for best of breed
        system_analysis = {}
        total_duplicates = 0
        
        for workflow_name, workflow_list in system_workflow_groups.items():
            if len(workflow_list) == 1:
                # Single workflow, keep it
                system_analysis[workflow_name] = {
                    'status': 'single',
                    'workflow': workflow_list[0],
                    'action': 'keep',
                    'reason': 'Only workflow with this name'
                }
            else:
                # Multiple workflows, find best of breed
                total_duplicates += len(workflow_list) - 1
                
                # Sort by quality (most recent + memory integration first)
                workflow_list.sort(key=lambda x: (
                    x['has_memory'], 
                    x['has_llm'], 
                    x['updatedAt']
                ), reverse=True)
                
                best_workflow = workflow_list[0]
                duplicates = workflow_list[1:]
                
                system_analysis[workflow_name] = {
                    'status': 'duplicate',
                    'best_workflow': best_workflow,
                    'duplicates': duplicates,
                    'action': f'keep_best_deactivate_{len(duplicates)}',
                    'reason': f'Best workflow: {best_workflow["formatted_updated"]} with memory={best_workflow["has_memory"]}, LLM={best_workflow["has_llm"]}'
                }
        
        return {
            'total_workflows': len(workflows),
            'active_workflows': len(active_workflows),
            'inactive_workflows': len(inactive_workflows),
            'crew_workflows': len(crew_workflows),
            'system_workflows': len(system_workflows),
            'system_analysis': system_analysis,
            'total_system_duplicates': total_duplicates,
            'timestamp': datetime.now().isoformat()
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
    
    def has_memory_integration(self, workflow: Dict) -> bool:
        """Check if workflow has memory integration (Supabase nodes)."""
        nodes = workflow.get('nodes', [])
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'supabase.co' in url:
                        return True
        
        return False
    
    def has_llm_integration(self, workflow: Dict) -> bool:
        """Check if workflow has LLM integration (OpenRouter nodes)."""
        nodes = workflow.get('nodes', [])
        
        for node in nodes:
            if isinstance(node, dict):
                node_type = node.get('type', '')
                if 'httpRequest' in node_type:
                    parameters = node.get('parameters', {})
                    url = parameters.get('url', '')
                    if 'openrouter.ai' in url:
                        return True
        
        return False
    
    def format_timestamp(self, timestamp_str: str) -> str:
        """Format timestamp for display."""
        try:
            dt = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
            now = datetime.now(dt.tzinfo)
            diff = now - dt
            
            if diff.days > 0:
                return f"{diff.days} day(s) ago"
            elif diff.seconds > 3600:
                hours = diff.seconds // 3600
                return f"{hours} hour(s) ago"
            elif diff.seconds > 60:
                minutes = diff.seconds // 60
                return f"{minutes} minute(s) ago"
            else:
                return "Just now"
        except:
            return timestamp_str
    
    def generate_cleanup_guide(self, analysis: Dict) -> str:
        """Generate a cleanup guide for system workflow duplicates."""
        guide = []
        guide.append("🎯 SYSTEM WORKFLOW DUPLICATE CLEANUP GUIDE")
        guide.append("=" * 70)
        guide.append("")
        guide.append("This guide identifies best-of-breed system workflows and duplicates to deactivate.")
        guide.append("")
        
        # Summary
        guide.append("📊 CURRENT STATUS:")
        guide.append(f"Total Workflows: {analysis['total_workflows']}")
        guide.append(f"Active Workflows: {analysis['active_workflows']}")
        guide.append(f"Crew Workflows: {analysis['crew_workflows']}")
        guide.append(f"System Workflows: {analysis['system_workflows']}")
        guide.append(f"System Duplicates to Remove: {analysis['total_system_duplicates']}")
        guide.append("")
        
        # Detailed analysis
        guide.append("🔧 SYSTEM WORKFLOW ANALYSIS:")
        guide.append("")
        
        for workflow_name, result in analysis['system_analysis'].items():
            guide.append(f"🎯 {workflow_name}")
            guide.append("-" * 50)
            
            if result['status'] == 'single':
                wf = result['workflow']
                guide.append(f"✅ KEEP (Single Workflow):")
                guide.append(f"   Workflow ID: {wf['id']}")
                guide.append(f"   Last Updated: {wf['formatted_updated']}")
                guide.append(f"   Memory Integration: {'✅' if wf['has_memory'] else '❌'}")
                guide.append(f"   LLM Integration: {'✅' if wf['has_llm'] else '❌'}")
                guide.append(f"   Nodes: {wf['node_count']}, Connections: {wf['connection_count']}")
                guide.append(f"   Action: No action needed")
            else:
                best = result['best_workflow']
                duplicates = result['duplicates']
                
                guide.append(f"🎯 KEEP (Best of Breed):")
                guide.append(f"   Workflow ID: {best['id']}")
                guide.append(f"   Last Updated: {best['formatted_updated']}")
                guide.append(f"   Memory Integration: {'✅' if best['has_memory'] else '❌'}")
                guide.append(f"   LLM Integration: {'✅' if best['has_llm'] else '❌'}")
                guide.append(f"   Nodes: {best['node_count']}, Connections: {best['connection_count']}")
                guide.append(f"   Action: Keep this workflow active")
                guide.append("")
                
                guide.append(f"🗑️  DEACTIVATE (Duplicates):")
                for i, duplicate in enumerate(duplicates, 1):
                    guide.append(f"   {i}. Workflow ID: {duplicate['id']}")
                    guide.append(f"      Last Updated: {duplicate['formatted_updated']}")
                    guide.append(f"      Memory Integration: {'✅' if duplicate['has_memory'] else '❌'}")
                    guide.append(f"      LLM Integration: {'✅' if duplicate['has_llm'] else '❌'}")
                    guide.append(f"      Nodes: {duplicate['node_count']}, Connections: {duplicate['connection_count']}")
                    guide.append(f"      Action: Deactivate this workflow")
                    guide.append("")
            
            guide.append("")
        
        # Summary
        guide.append("📊 CLEANUP SUMMARY:")
        guide.append("=" * 30)
        guide.append(f"Total System Workflows: {len(analysis['system_analysis'])}")
        guide.append(f"Duplicates to Remove: {analysis['total_system_duplicates']}")
        guide.append("")
        guide.append("🎯 TARGET: After cleanup, you should have optimized system workflows")
        guide.append("with no duplicates, maintaining the best functionality for each type.")
        
        return "\n".join(guide)
    
    def run_analysis(self):
        """Run the system workflow analysis."""
        print("🔍 ANALYZING SYSTEM WORKFLOW DUPLICATES...")
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Analyze system workflows
        print("🎯 Analyzing system workflows...")
        analysis = self.analyze_system_workflows(workflows)
        
        # Display results
        print("\n📊 SYSTEM WORKFLOW ANALYSIS RESULTS:")
        print("=" * 60)
        
        print(f"Total Workflows: {analysis['total_workflows']}")
        print(f"Active Workflows: {analysis['active_workflows']}")
        print(f"Crew Workflows: {analysis['crew_workflows']}")
        print(f"System Workflows: {analysis['system_workflows']}")
        print(f"System Duplicates to Remove: {analysis['total_system_duplicates']}")
        print(f"Analysis Timestamp: {analysis['timestamp']}")
        
        # Display detailed results
        print("\n🔧 SYSTEM WORKFLOW DETAILS:")
        for workflow_name, result in analysis['system_analysis'].items():
            print(f"\n🎯 {workflow_name}")
            if result['status'] == 'single':
                wf = result['workflow']
                print(f"   ✅ Single workflow - Keep")
                print(f"   Last Updated: {wf['formatted_updated']}")
            else:
                best = result['best_workflow']
                duplicates = result['duplicates']
                print(f"   🎯 Keep: {best['formatted_updated']} (Best)")
                print(f"   🗑️  Deactivate: {len(duplicates)} duplicates")
        
        # Generate cleanup guide
        print("\n" + "=" * 70)
        cleanup_guide = self.generate_cleanup_guide(analysis)
        print(cleanup_guide)
        
        # Save analysis
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"system_workflow_analysis_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        print(f"\n💾 System workflow analysis saved to: {filename}")
        
        return analysis

if __name__ == "__main__":
    try:
        analyzer = SystemWorkflowAnalyzer()
        analyzer.run_analysis()
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
