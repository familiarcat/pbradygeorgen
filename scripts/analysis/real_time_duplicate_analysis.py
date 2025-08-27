#!/usr/bin/env python3
"""
Real-Time Duplicate Analysis Script
Queries the deployed n8n instance and creates a manual implementation strategy.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class RealTimeDuplicateAnalyzer:
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
    
    def analyze_current_duplicates(self, workflows: List[Dict]) -> Dict:
        """Analyze current duplicates in real-time."""
        crew_workflows = defaultdict(list)
        
        # Group workflows by crew member
        for workflow in workflows:
            if not workflow.get('active', False):
                continue
                
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member and crew_member != 'System Workflow':
                crew_workflows[crew_member].append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'createdAt': workflow.get('createdAt', ''),
                    'updatedAt': workflow.get('updatedAt', ''),
                    'formatted_created': self.format_timestamp(workflow.get('createdAt', '')),
                    'formatted_updated': self.format_timestamp(workflow.get('updatedAt', '')),
                    'has_memory': self.has_memory_integration(workflow),
                    'has_llm': self.has_llm_integration(workflow),
                    'node_count': len(workflow.get('nodes', [])),
                    'connection_count': len(workflow.get('connections', {}))
                })
        
        # Analyze duplicates and identify best of breed
        analysis_results = {}
        total_duplicates = 0
        
        for crew_member, workflow_list in crew_workflows.items():
            if len(workflow_list) == 1:
                # Single workflow, keep it
                analysis_results[crew_member] = {
                    'status': 'single',
                    'workflow': workflow_list[0],
                    'action': 'keep',
                    'reason': 'Only workflow for this crew member'
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
                
                analysis_results[crew_member] = {
                    'status': 'duplicate',
                    'best_workflow': best_workflow,
                    'duplicates': duplicates,
                    'action': f'keep_best_deactivate_{len(duplicates)}',
                    'reason': f'Best workflow: {best_workflow["formatted_updated"]} with memory={best_workflow["has_memory"]}, LLM={best_workflow["has_llm"]}'
                }
        
        return {
            'analysis_results': analysis_results,
            'total_duplicates': total_duplicates,
            'crew_members': len(crew_workflows),
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
    
    def generate_manual_implementation_guide(self, analysis: Dict) -> str:
        """Generate a manual implementation guide that works around hidden IDs."""
        guide = []
        guide.append("🎯 MANUAL IMPLEMENTATION GUIDE")
        guide.append("=" * 60)
        guide.append("")
        guide.append("This guide works around hidden IDs in the n8n UI.")
        guide.append("Use visual markers and timestamps to identify workflows.")
        guide.append("")
        
        # Summary
        summary = analysis
        guide.append("📊 CURRENT STATUS:")
        guide.append(f"Total Crew Members: {summary['crew_members']}")
        guide.append(f"Total Duplicates to Remove: {summary['total_duplicates']}")
        guide.append(f"Analysis Timestamp: {summary['timestamp']}")
        guide.append("")
        
        # Detailed implementation guide
        guide.append("👥 IMPLEMENTATION BY CREW MEMBER:")
        guide.append("")
        
        for crew_member, result in analysis['analysis_results'].items():
            guide.append(f"🎖️ {crew_member}")
            guide.append("-" * 40)
            
            if result['status'] == 'single':
                wf = result['workflow']
                guide.append(f"✅ KEEP (Single Workflow):")
                guide.append(f"   Name: {wf['name']}")
                guide.append(f"   Last Updated: {wf['formatted_updated']}")
                guide.append(f"   Memory Integration: {'✅' if wf['has_memory'] else '❌'}")
                guide.append(f"   LLM Integration: {'✅' if wf['has_llm'] else '❌'}")
                guide.append(f"   Action: No action needed")
            else:
                best = result['best_workflow']
                duplicates = result['duplicates']
                
                guide.append(f"🎯 KEEP (Best of Breed):")
                guide.append(f"   Name: {best['name']}")
                guide.append(f"   Last Updated: {best['formatted_updated']}")
                guide.append(f"   Memory Integration: {'✅' if best['has_memory'] else '❌'}")
                guide.append(f"   LLM Integration: {'✅' if best['has_llm'] else '❌'}")
                guide.append(f"   Action: Keep this workflow active")
                guide.append("")
                
                guide.append(f"🗑️  DEACTIVATE (Duplicates):")
                for i, duplicate in enumerate(duplicates, 1):
                    guide.append(f"   {i}. Name: {duplicate['name']}")
                    guide.append(f"      Last Updated: {duplicate['formatted_updated']}")
                    guide.append(f"      Memory Integration: {'✅' if duplicate['has_memory'] else '❌'}")
                    guide.append(f"      LLM Integration: {'✅' if duplicate['has_llm'] else '❌'}")
                    guide.append(f"      Action: Deactivate this workflow")
                    guide.append("")
            
            guide.append("")
        
        # Visual identification strategies
        guide.append("🔍 VISUAL IDENTIFICATION STRATEGIES:")
        guide.append("=" * 50)
        guide.append("")
        guide.append("Since IDs are hidden in the UI, use these visual markers:")
        guide.append("")
        guide.append("1. 📅 TIMESTAMP-BASED IDENTIFICATION:")
        guide.append("   - Look at 'Last updated' timestamps")
        guide.append("   - Keep the MOST RECENT workflow")
        guide.append("   - Deactivate ALL OLDER workflows")
        guide.append("")
        guide.append("2. 🎯 QUALITY-BASED IDENTIFICATION:")
        guide.append("   - Keep workflows with Memory Integration (✅)")
        guide.append("   - Keep workflows with LLM Integration (✅)")
        guide.append("   - Deactivate workflows missing these features")
        guide.append("")
        guide.append("3. 📍 POSITION-BASED IDENTIFICATION:")
        guide.append("   - Most recent workflows usually appear at the TOP")
        guide.append("   - Older workflows usually appear LOWER in the list")
        guide.append("")
        
        # Step-by-step cleanup process
        guide.append("🧹 STEP-BY-STEP CLEANUP PROCESS:")
        guide.append("=" * 50)
        guide.append("")
        guide.append("1. Navigate to n8n.pbradygeorgen.com")
        guide.append("2. Go to Workflows section")
        guide.append("3. For each crew member with duplicates:")
        guide.append("   a. Find all workflows with the same name")
        guide.append("   b. Identify the MOST RECENT one (keep)")
        guide.append("   c. Deactivate ALL OLDER ones")
        guide.append("4. Verify you have exactly 10 active workflows")
        guide.append("5. Run verification script to confirm cleanup")
        
        return "\n".join(guide)
    
    def run_real_time_analysis(self):
        """Run the complete real-time analysis."""
        print("🔍 Starting REAL-TIME duplicate analysis...")
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Analyze current duplicates
        print("🎯 Analyzing current duplicates...")
        analysis = self.analyze_current_duplicates(workflows)
        
        # Display results
        print("\n📊 REAL-TIME ANALYSIS RESULTS:")
        print("=" * 60)
        
        print(f"Total Crew Members: {analysis['crew_members']}")
        print(f"Total Duplicates to Remove: {analysis['total_duplicates']}")
        print(f"Analysis Timestamp: {analysis['timestamp']}")
        
        # Display detailed results
        print("\n👥 DETAILED ANALYSIS:")
        for crew_member, result in analysis['analysis_results'].items():
            print(f"\n🎖️ {crew_member}")
            if result['status'] == 'single':
                wf = result['workflow']
                print(f"   ✅ Single workflow - Keep")
                print(f"   Last Updated: {wf['formatted_updated']}")
            else:
                best = result['best_workflow']
                duplicates = result['duplicates']
                print(f"   🎯 Keep: {best['formatted_updated']} (Best)")
                print(f"   🗑️  Deactivate: {len(duplicates)} duplicates")
        
        # Generate manual implementation guide
        print("\n" + "=" * 60)
        implementation_guide = self.generate_manual_implementation_guide(analysis)
        print(implementation_guide)
        
        # Save analysis
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"real_time_analysis_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        print(f"\n💾 Real-time analysis saved to: {filename}")
        
        return analysis

if __name__ == "__main__":
    try:
        analyzer = RealTimeDuplicateAnalyzer()
        analyzer.run_real_time_analysis()
    except Exception as e:
        print(f"❌ Real-time analysis failed: {e}")
