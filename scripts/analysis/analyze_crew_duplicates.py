#!/usr/bin/env python3
"""
Crew Duplicate Analysis Script
Analyzes n8n workflows for duplicate crew members and inconsistencies.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List, Set

class CrewDuplicateAnalyzer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
    
    def fetch_workflows(self) -> List[Dict]:
        """Fetch all workflows from n8n instance."""
        headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=headers)
            response.raise_for_status()
            data = response.json()
            
            # Handle different response formats
            if isinstance(data, list):
                return data
            elif isinstance(data, dict) and 'data' in data:
                return data['data']
            elif isinstance(data, str):
                # Try to parse JSON string
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
    
    def analyze_crew_duplicates(self, workflows: List[Dict]) -> Dict:
        """Analyze workflows for crew member duplicates and inconsistencies."""
        crew_analysis = {
            'crew_members': defaultdict(list),
            'duplicates': [],
            'inconsistencies': [],
            'summary': {}
        }
        
        # Extract crew member names from workflow names
        for workflow in workflows:
            if not workflow.get('active', False):
                continue
                
            name = workflow.get('name', '')
            workflow_id = workflow.get('id', '')
            
            # Extract crew member name from workflow name
            crew_member = self.extract_crew_member(name)
            if crew_member:
                crew_analysis['crew_members'][crew_member].append({
                    'id': workflow_id,
                    'name': name,
                    'active': workflow.get('active', False),
                    'archived': workflow.get('isArchived', False)
                })
        
        # Identify duplicates
        for crew_member, workflows_list in crew_analysis['crew_members'].items():
            if len(workflows_list) > 1:
                crew_analysis['duplicates'].append({
                    'crew_member': crew_member,
                    'workflows': workflows_list,
                    'count': len(workflows_list)
                })
        
        # Generate summary
        crew_analysis['summary'] = {
            'total_active_workflows': len([w for w in workflows if w.get('active', False)]),
            'unique_crew_members': len(crew_analysis['crew_members']),
            'duplicate_crew_members': len(crew_analysis['duplicates']),
            'crew_member_counts': {member: len(workflows_list) for member, workflows_list in crew_analysis['crew_members'].items()}
        }
        
        return crew_analysis
    
    def extract_crew_member(self, workflow_name: str) -> str:
        """Extract crew member name from workflow name."""
        # Known crew members
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
        
        # Check for other patterns
        if 'Federation' in workflow_name or 'AlexAI' in workflow_name:
            return 'System Workflow'
        
        return 'Unknown'
    
    def generate_report(self, analysis: Dict) -> str:
        """Generate a comprehensive report."""
        report = []
        report.append("🎖️ CREW DUPLICATE ANALYSIS REPORT")
        report.append("=" * 50)
        report.append("")
        
        # Summary
        summary = analysis['summary']
        report.append("📊 SUMMARY")
        report.append(f"Total Active Workflows: {summary['total_active_workflows']}")
        report.append(f"Unique Crew Members: {summary['unique_crew_members']}")
        report.append(f"Duplicate Crew Members: {summary['duplicate_crew_members']}")
        report.append("")
        
        # Crew member counts
        report.append("👥 CREW MEMBER COUNTS")
        for member, count in summary['crew_member_counts'].items():
            status = "⚠️  DUPLICATE" if count > 1 else "✅ SINGLE"
            report.append(f"{status} {member}: {count} workflow(s)")
        report.append("")
        
        # Detailed duplicates
        if analysis['duplicates']:
            report.append("🚨 DUPLICATE DETAILS")
            for duplicate in analysis['duplicates']:
                report.append(f"")
                report.append(f"🔴 {duplicate['crew_member']} ({duplicate['count']} workflows):")
                for workflow in duplicate['workflows']:
                    report.append(f"   - ID: {workflow['id']}")
                    report.append(f"   - Name: {workflow['name']}")
                    report.append(f"   - Active: {workflow['active']}")
                    report.append(f"   - Archived: {workflow['archived']}")
        else:
            report.append("✅ NO DUPLICATES FOUND")
        
        return "\n".join(report)
    
    def run_analysis(self):
        """Run the complete analysis."""
        print("🔍 Analyzing n8n workflows for crew duplicates...")
        
        # Fetch workflows
        workflows = self.fetch_workflows()
        if not workflows:
            print("❌ No workflows found or failed to fetch")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Analyze duplicates
        analysis = self.analyze_crew_duplicates(workflows)
        
        # Generate and display report
        report = self.generate_report(analysis)
        print("\n" + report)
        
        # Save detailed analysis
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"crew_duplicate_analysis_{timestamp}.json"
        
        with open(filename, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        print(f"\n💾 Detailed analysis saved to: {filename}")
        
        return analysis

if __name__ == "__main__":
    from datetime import datetime
    
    try:
        analyzer = CrewDuplicateAnalyzer()
        analyzer.run_analysis()
    except Exception as e:
        print(f"❌ Analysis failed: {e}")
