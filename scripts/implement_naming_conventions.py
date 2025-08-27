#!/usr/bin/env python3
"""
Implement Naming Conventions Script
Renames all workflows using the approved naming convention and updates the remote n8n server.
"""

import json
import requests
import os
from collections import defaultdict
from typing import Dict, List
from datetime import datetime

class NamingConventionImplementer:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        if not self.n8n_url or not self.n8n_api_key:
            raise ValueError("N8N_URL and N8N_API_KEY environment variables must be set")
        
        self.headers = {
            'X-N8N-API-Key': self.n8n_api_key,
            'Content-Type': 'application/json'
        }
        
        # Define naming convention mappings
        self.naming_conventions = {
            'Captain Jean-Luc Picard': 'CREW-LEADERSHIP-PICARD',
            'Commander William Riker': 'CREW-TACTICAL-RIKER',
            'Dr. Beverly Crusher': 'CREW-MEDICAL-CRUSHER',
            'Commander Data': 'CREW-ANALYTICS-DATA',
            'Lieutenant Commander Geordi La Forge': 'CREW-ENGINEERING-LA_FORGE',
            'Lieutenant Worf': 'CREW-SECURITY-WORF',
            'Counselor Deanna Troi': 'CREW-COUNSELING-TROI',
            'Lieutenant Uhura': 'CREW-COMMUNICATIONS-UHURA',
            'Quark': 'CREW-BUSINESS_INTELLIGENCE-QUARK',
            'Enhanced Federation Crew - Complete Mission Control': 'SYSTEM-ORCHESTRATION-FEDERATION',
            'AlexAI Optimized Crew - Complete Mission Control': 'SYSTEM-COORDINATION-ALEXAI',
            'Federation Crew - OpenRouter Agent Coordination': 'SYSTEM-AGENT-OPENROUTER',
            'Federation Concise Agency - OpenRouter Crew': 'SYSTEM-AGENCY-CONCISE'
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
    
    def get_new_name(self, current_name: str) -> str:
        """Get the new standardized name for a workflow."""
        return self.naming_conventions.get(current_name, current_name)
    
    def categorize_workflows(self, workflows: List[Dict]) -> Dict:
        """Categorize workflows for renaming."""
        crew_workflows = []
        system_workflows = []
        unknown_workflows = []
        
        for workflow in workflows:
            if not workflow.get('active', False):
                continue
                
            name = workflow.get('name', '')
            new_name = self.get_new_name(name)
            
            workflow_info = {
                'id': workflow.get('id', ''),
                'current_name': name,
                'new_name': new_name,
                'needs_rename': name != new_name,
                'category': self.get_workflow_category(name)
            }
            
            if workflow_info['category'] == 'crew':
                crew_workflows.append(workflow_info)
            elif workflow_info['category'] == 'system':
                system_workflows.append(workflow_info)
            else:
                unknown_workflows.append(workflow_info)
        
        return {
            'crew_workflows': crew_workflows,
            'system_workflows': system_workflows,
            'unknown_workflows': unknown_workflows,
            'total_workflows': len(crew_workflows) + len(system_workflows) + len(unknown_workflows)
        }
    
    def get_workflow_category(self, workflow_name: str) -> str:
        """Determine the category of a workflow."""
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
                return 'crew'
        
        if any(term in workflow_name for term in ['Federation', 'AlexAI', 'OpenRouter']):
            return 'system'
        
        return 'unknown'
    
    def rename_workflow(self, workflow_id: str, new_name: str, current_name: str) -> bool:
        """Rename a workflow using the n8n API."""
        try:
            # First, get the current workflow
            response = requests.get(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", headers=self.headers)
            response.raise_for_status()
            workflow = response.json()
            
            # Update the name
            workflow['name'] = new_name
            
            # Update the workflow
            update_response = requests.put(f"{self.n8n_url}/api/v1/workflows/{workflow_id}", 
                                        headers=self.headers, 
                                        json=workflow)
            update_response.raise_for_status()
            
            print(f"✅ Renamed: '{current_name}' → '{new_name}' (ID: {workflow_id})")
            return True
            
        except requests.exceptions.RequestException as e:
            print(f"❌ Failed to rename workflow {current_name} (ID: {workflow_id}): {e}")
            return False
    
    def generate_renaming_plan(self, categorization: Dict) -> str:
        """Generate a comprehensive renaming plan."""
        plan = []
        plan.append("🎯 WORKFLOW RENAMING PLAN")
        plan.append("=" * 60)
        plan.append("")
        plan.append("This plan shows all workflows that will be renamed using the new naming convention.")
        plan.append("")
        
        # Crew workflows
        if categorization['crew_workflows']:
            plan.append("👥 CREW WORKFLOWS:")
            plan.append("-" * 30)
            for workflow in categorization['crew_workflows']:
                if workflow['needs_rename']:
                    plan.append(f"   🔄 RENAME: '{workflow['current_name']}'")
                    plan.append(f"        → '{workflow['new_name']}'")
                    plan.append(f"        ID: {workflow['id']}")
                    plan.append("")
                else:
                    plan.append(f"   ✅ KEEP: '{workflow['current_name']}' (already correct)")
                    plan.append(f"        ID: {workflow['id']}")
                    plan.append("")
        
        # System workflows
        if categorization['system_workflows']:
            plan.append("🔧 SYSTEM WORKFLOWS:")
            plan.append("-" * 30)
            for workflow in categorization['system_workflows']:
                if workflow['needs_rename']:
                    plan.append(f"   🔄 RENAME: '{workflow['current_name']}'")
                    plan.append(f"        → '{workflow['new_name']}'")
                    plan.append(f"        ID: {workflow['id']}")
                    plan.append("")
                else:
                    plan.append(f"   ✅ KEEP: '{workflow['current_name']}' (already correct)")
                    plan.append(f"        ID: {workflow['id']}")
                    plan.append("")
        
        # Unknown workflows
        if categorization['unknown_workflows']:
            plan.append("❓ UNKNOWN WORKFLOWS:")
            plan.append("-" * 30)
            for workflow in categorization['unknown_workflows']:
                plan.append(f"   ⚠️  REVIEW: '{workflow['current_name']}'")
                plan.append(f"        ID: {workflow['id']}")
                plan.append(f"        Category: {workflow['category']}")
                plan.append("")
        
        # Summary
        plan.append("📊 RENAMING SUMMARY:")
        plan.append("=" * 30)
        plan.append(f"Total Workflows: {categorization['total_workflows']}")
        plan.append(f"Crew Workflows: {len(categorization['crew_workflows'])}")
        plan.append(f"System Workflows: {len(categorization['system_workflows'])}")
        plan.append(f"Unknown Workflows: {len(categorization['unknown_workflows'])}")
        
        needs_rename = sum(1 for w in categorization['crew_workflows'] + categorization['system_workflows'] if w['needs_rename'])
        plan.append(f"Workflows to Rename: {needs_rename}")
        
        return "\n".join(plan)
    
    def run_implementation(self, dry_run: bool = True):
        """Run the naming convention implementation."""
        if dry_run:
            print("🔍 DRY RUN MODE - No workflows will be renamed")
        else:
            print("🚀 IMPLEMENTATION MODE - Workflows will be renamed")
        
        print(f"📡 Querying deployed n8n instance: {self.n8n_url}")
        
        # Fetch current workflows
        print("📋 Fetching current workflows...")
        workflows = self.fetch_current_workflows()
        if not workflows:
            print("❌ No workflows found")
            return
        
        print(f"📋 Found {len(workflows)} total workflows")
        
        # Categorize workflows
        print("🎯 Categorizing workflows...")
        categorization = self.categorize_workflows(workflows)
        
        # Display renaming plan
        print("\n" + "=" * 60)
        renaming_plan = self.generate_renaming_plan(categorization)
        print(renaming_plan)
        
        # Execute renaming if not dry run
        if not dry_run:
            print("\n🚀 EXECUTING RENAMING...")
            print("=" * 40)
            
            success_count = 0
            total_count = 0
            
            # Rename crew workflows
            for workflow in categorization['crew_workflows']:
                if workflow['needs_rename']:
                    total_count += 1
                    if self.rename_workflow(workflow['id'], workflow['new_name'], workflow['current_name']):
                        success_count += 1
            
            # Rename system workflows
            for workflow in categorization['system_workflows']:
                if workflow['needs_rename']:
                    total_count += 1
                    if self.rename_workflow(workflow['id'], workflow['new_name'], workflow['current_name']):
                        success_count += 1
            
            print(f"\n📊 RENAMING RESULTS:")
            print("=" * 30)
            print(f"Successfully Renamed: {success_count}/{total_count}")
            print(f"Failed: {total_count - success_count}")
            
            if success_count == total_count:
                print("🎉 All workflows successfully renamed!")
                print("🎯 n8n server now uses standardized naming conventions!")
            else:
                print("⚠️  Some workflows failed to rename - review manually")
        
        elif dry_run:
            print(f"\n🔍 DRY RUN COMPLETE")
            print("=" * 30)
            needs_rename = sum(1 for w in categorization['crew_workflows'] + categorization['system_workflows'] if w['needs_rename'])
            print(f"Found {needs_rename} workflows that need renaming")
            print("Run with dry_run=False to execute actual renaming")
        
        return categorization

if __name__ == "__main__":
    import sys
    
    # Check if --execute flag is provided
    dry_run = True
    if len(sys.argv) > 1 and sys.argv[1] == '--execute':
        dry_run = False
    
    try:
        implementer = NamingConventionImplementer()
        implementer.run_implementation(dry_run=dry_run)
    except Exception as e:
        print(f"❌ Implementation failed: {e}")
