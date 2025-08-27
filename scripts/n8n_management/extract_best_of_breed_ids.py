#!/usr/bin/env python3
"""
Extract Best-of-Breed Workflow IDs
Identifies the optimal workflow versions and provides their IDs for manual cleanup.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class BestOfBreedExtractor:
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
    
    def identify_best_of_breed(self, workflows: List[Dict]) -> Dict:
        """Identify the best-of-breed workflow for each crew member."""
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
                    'connection_count': len(workflow.get('connections', {})),
                    'workflow_url': f"{self.n8n_url}/workflow/{workflow.get('id', '')}"
                })
        
        # Identify best of breed for each crew member
        best_of_breed = {}
        duplicates_to_deactivate = {}
        
        for crew_member, workflow_list in crew_workflows.items():
            if len(workflow_list) == 1:
                # Single workflow, keep it
                best_of_breed[crew_member] = workflow_list[0]
                duplicates_to_deactivate[crew_member] = []
            else:
                # Multiple workflows, find best of breed
                # Sort by quality (most recent + memory integration first)
                workflow_list.sort(key=lambda x: (
                    x['has_memory'], 
                    x['has_llm'], 
                    x['updatedAt']
                ), reverse=True)
                
                best_workflow = workflow_list[0]
                duplicates = workflow_list[1:]
                
                best_of_breed[crew_member] = best_workflow
                duplicates_to_deactivate[crew_member] = duplicates
        
        return {
            'best_of_breed': best_of_breed,
            'duplicates_to_deactivate': duplicates_to_deactivate,
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
        """Generate a cleanup guide with specific workflow IDs."""
        guide = []
        guide.append("🎯 BEST-OF-BREED WORKFLOW IDs - CLEANUP GUIDE")
        guide.append("=" * 70)
        guide.append("")
        guide.append("KEEP these workflow IDs (best of breed):")
        guide.append("")
        
        # Best of breed workflows to keep
        for crew_member, workflow in analysis['best_of_breed'].items():
            guide.append(f"🎖️ {crew_member}")
            guide.append("-" * 50)
            guide.append(f"✅ KEEP - Workflow ID: {workflow['id']}")
            guide.append(f"   Name: {workflow['name']}")
            guide.append(f"   Last Updated: {workflow['formatted_updated']}")
            guide.append(f"   Memory Integration: {'✅' if workflow['has_memory'] else '❌'}")
            guide.append(f"   LLM Integration: {'✅' if workflow['has_llm'] else '❌'}")
            guide.append(f"   Workflow URL: {workflow['workflow_url']}")
            guide.append("")
        
        guide.append("🗑️  DEACTIVATE these workflow IDs (duplicates):")
        guide.append("=" * 50)
        guide.append("")
        
        # Duplicates to deactivate
        for crew_member, duplicates in analysis['duplicates_to_deactivate'].items():
            if duplicates:
                guide.append(f"🎖️ {crew_member}")
                guide.append("-" * 30)
                for i, duplicate in enumerate(duplicates, 1):
                    guide.append(f"   {i}. DEACTIVATE - Workflow ID: {duplicate['id']}")
                    guide.append(f"      Name: {duplicate['name']}")
                    guide.append(f"      Last Updated: {duplicate['formatted_updated']}")
                    guide.append(f"      Memory Integration: {'✅' if duplicate['has_memory'] else '❌'}")
                    guide.append(f"      LLM Integration: {'✅' if duplicate['has_llm'] else '❌'}")
                    guide.append(f"      Workflow URL: {duplicate['workflow_url']}")
                    guide.append("")
        
        # Summary
        guide.append("📊 CLEANUP SUMMARY:")
        guide.append("=" * 30)
        guide.append(f"Total Crew Members: {len(analysis['best_of_breed'])}")
        guide.append(f"Total Duplicates to Deactivate: {sum(len(dups) for dups in analysis['duplicates_to_deactivate'].values())}")
        guide.append("")
        guide.append("🎯 TARGET: After cleanup, you should have exactly 22 active workflows")
        guide.append("(9 crew members + 13 system workflows)")
        
        return "\n".join(guide)
    
    def run_extraction(self):
        """Run the best-of-breed ID extraction."""
        print("🔍 EXTRACTING BEST-OF-BREED WORKFLOW IDs...")
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Identify best of breed
        print("🎯 Identifying best-of-breed workflows...")
        analysis = self.identify_best_of_breed(workflows)
        
        # Display results
        print("\n📊 BEST-OF-BREED ANALYSIS RESULTS:")
        print("=" * 60)
        
        print(f"Total Crew Members: {len(analysis['best_of_breed'])}")
        total_duplicates = sum(len(dups) for dups in analysis['duplicates_to_deactivate'].values())
        print(f"Total Duplicates to Deactivate: {total_duplicates}")
        print(f"Analysis Timestamp: {analysis['timestamp']}")
        
        # Generate and display cleanup guide
        print("\n" + "=" * 70)
        cleanup_guide = self.generate_cleanup_guide(analysis)
        print(cleanup_guide)
        
        # Save analysis
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"best_of_breed_ids_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        print(f"\n💾 Best-of-breed analysis saved to: {filename}")
        
        return analysis

if __name__ == "__main__":
    try:
        extractor = BestOfBreedExtractor()
        extractor.run_extraction()
    except Exception as e:
        print(f"❌ Extraction failed: {e}")
