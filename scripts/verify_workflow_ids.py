#!/usr/bin/env python3
"""
Workflow ID Verification Script
Displays exact workflow IDs, names, and timestamps for manual cleanup verification.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class WorkflowIDVerifier:
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
    
    def generate_verification_report(self, workflows: List[Dict]) -> str:
        """Generate a verification report with exact IDs and timestamps."""
        # Group workflows by crew member
        crew_workflows = defaultdict(list)
        
        for workflow in workflows:
            if not workflow.get('active', False):
                continue
                
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member and crew_member != 'System Workflow':
                crew_workflows[crew_member].append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'created': workflow.get('createdAt', ''),
                    'updated': workflow.get('updatedAt', ''),
                    'formatted_created': self.format_timestamp(workflow.get('createdAt', '')),
                    'formatted_updated': self.format_timestamp(workflow.get('updatedAt', ''))
                })
        
        # Generate report
        report = []
        report.append("🔍 WORKFLOW ID VERIFICATION REPORT")
        report.append("=" * 60)
        report.append("")
        report.append("Use this report to verify workflow IDs during manual cleanup.")
        report.append("")
        
        for crew_member, workflow_list in sorted(crew_workflows.items()):
            report.append(f"👥 {crew_member}")
            report.append("-" * 40)
            
            if len(workflow_list) == 1:
                wf = workflow_list[0]
                report.append(f"✅ KEEP (Single Workflow):")
                report.append(f"   Name: {wf['name']}")
                report.append(f"   ID: {wf['id']}")
                report.append(f"   Created: {wf['formatted_created']}")
                report.append(f"   Updated: {wf['formatted_updated']}")
            else:
                # Sort by update time (most recent first)
                workflow_list.sort(key=lambda x: x['updated'], reverse=True)
                
                report.append(f"🎯 KEEP (Most Recent):")
                wf = workflow_list[0]
                report.append(f"   Name: {wf['name']}")
                report.append(f"   ID: {wf['id']}")
                report.append(f"   Created: {wf['formatted_created']}")
                report.append(f"   Updated: {wf['formatted_updated']}")
                
                report.append("")
                report.append("🗑️  DEACTIVATE (Duplicates):")
                for duplicate in workflow_list[1:]:
                    report.append(f"   Name: {duplicate['name']}")
                    report.append(f"   ID: {duplicate['id']}")
                    report.append(f"   Created: {duplicate['formatted_created']}")
                    report.append(f"   Updated: {duplicate['formatted_updated']}")
                    report.append("")
            
            report.append("")
        
        return "\n".join(report)
    
    def generate_cleanup_checklist(self, workflows: List[Dict]) -> str:
        """Generate a cleanup checklist with exact IDs."""
        # Group workflows by crew member
        crew_workflows = defaultdict(list)
        
        for workflow in workflows:
            if not workflow.get('active', False):
                continue
                
            name = workflow.get('name', '')
            crew_member = self.extract_crew_member(name)
            
            if crew_member and crew_member != 'System Workflow':
                crew_workflows[crew_member].append({
                    'id': workflow.get('id', ''),
                    'name': name,
                    'updated': workflow.get('updatedAt', '')
                })
        
        # Generate checklist
        checklist = []
        checklist.append("🧹 MANUAL CLEANUP CHECKLIST")
        checklist.append("=" * 50)
        checklist.append("")
        checklist.append("Check off each workflow as you deactivate it:")
        checklist.append("")
        
        total_to_deactivate = 0
        
        for crew_member, workflow_list in sorted(crew_workflows.items()):
            if len(workflow_list) > 1:
                # Sort by update time (most recent first)
                workflow_list.sort(key=lambda x: x['updated'], reverse=True)
                
                checklist.append(f"👥 {crew_member}")
                checklist.append(f"   ✅ KEEP: {workflow_list[0]['id']} (Most Recent)")
                
                # Add duplicates to checklist
                for i, duplicate in enumerate(workflow_list[1:], 1):
                    checklist.append(f"   ☐ DEACTIVATE {i}: {duplicate['id']}")
                    total_to_deactivate += 1
                
                checklist.append("")
        
        checklist.append(f"📊 TOTAL TO DEACTIVATE: {total_to_deactivate}")
        checklist.append("")
        checklist.append("After cleanup, you should have exactly 10 active workflows:")
        checklist.append("1. Enhanced Federation Crew")
        checklist.append("2. Captain Jean-Luc Picard")
        checklist.append("3. Commander William Riker")
        checklist.append("4. Dr. Beverly Crusher")
        checklist.append("5. Commander Data")
        checklist.append("6. Lieutenant Commander Geordi La Forge")
        checklist.append("7. Lieutenant Worf")
        checklist.append("8. Counselor Deanna Troi")
        checklist.append("9. Quark")
        checklist.append("10. Lieutenant Uhura")
        
        return "\n".join(checklist)
    
    def run_verification(self):
        """Run the complete verification process."""
        print("🔍 Starting workflow ID verification...")
        
        # Fetch workflows
        workflows = self.fetch_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Generate verification report
        print("\n" + "=" * 60)
        verification_report = self.generate_verification_report(workflows)
        print(verification_report)
        
        # Generate cleanup checklist
        print("\n" + "=" * 60)
        cleanup_checklist = self.generate_cleanup_checklist(workflows)
        print(cleanup_checklist)
        
        # Save detailed report
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"workflow_verification_{timestamp}.json"
        
        # Prepare data for saving
        verification_data = {
            'timestamp': timestamp,
            'total_workflows': len(workflows),
            'crew_workflows': {}
        }
        
        # Group workflows for saving
        crew_workflows = defaultdict(list)
        for workflow in workflows:
            if workflow.get('active', False):
                name = workflow.get('name', '')
                crew_member = self.extract_crew_member(name)
                if crew_member and crew_member != 'System Workflow':
                    crew_workflows[crew_member].append({
                        'id': workflow.get('id', ''),
                        'name': name,
                        'createdAt': workflow.get('createdAt', ''),
                        'updatedAt': workflow.get('updatedAt', '')
                    })
        
        verification_data['crew_workflows'] = dict(crew_workflows)
        
        with open(filename, 'w') as f:
            json.dump(verification_data, f, indent=2)
        
        print(f"\n💾 Detailed verification data saved to: {filename}")
        
        return verification_data

if __name__ == "__main__":
    try:
        verifier = WorkflowIDVerifier()
        verifier.run_verification()
    except Exception as e:
        print(f"❌ Verification failed: {e}")
