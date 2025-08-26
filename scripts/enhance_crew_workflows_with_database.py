#!/usr/bin/env python3
"""
Enhance Crew Workflows with Database Integration
Adds Supabase database nodes to existing crew workflows for memory storage
"""

import requests
import json
import os
import sys
from typing import Dict, Any, List

class CrewWorkflowEnhancer:
    def __init__(self):
        self.n8n_base_url = "https://n8n.pbradygeorgen.com"
        self.api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTA3ZGJlZi0yZDJmLTQ2YjUtYWQ3ZC0yYjIzZTk2ZWE1NjYiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzU2MDk3MjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw"
        self.headers = {
            "X-N8N-API-KEY": self.api_key,
            "Content-Type": "application/json"
        }
        
        # Load Supabase configuration
        self.load_supabase_config()

    def load_supabase_config(self):
        """Load Supabase configuration from environment"""
        try:
            zshrc_path = os.path.expanduser("~/.zshrc")
            if os.path.exists(zshrc_path):
                with open(zshrc_path, 'r') as f:
                    content = f.read()
                
                lines = content.split('\n')
                for line in lines:
                    if line.startswith('export ') and '=' in line:
                        key, value = line.replace('export ', '').split('=', 1)
                        os.environ[key] = value.strip('"')
            
            self.supabase_url = os.getenv('SUPABASE_URL')
            self.supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')
            
            if self.supabase_url and self.supabase_anon_key:
                print(f"✅ Supabase configuration loaded: {self.supabase_url}")
            else:
                print("⚠️  Supabase configuration not found")
                print("   Please set SUPABASE_URL and SUPABASE_ANON_KEY in ~/.zshrc")
                
        except Exception as e:
            print(f"⚠️  Warning: Could not load Supabase config: {e}")

    def get_crew_workflows(self) -> List[Dict]:
        """Get all crew-related workflows"""
        try:
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code == 200:
                workflows = response.json().get("data", [])
                crew_workflows = [
                    w for w in workflows 
                    if any(crew in w.get("name", "").lower() 
                           for crew in ["riker", "crusher", "uhura", "quark", "picard", "data", "geordi", "worf", "troi"])
                ]
                return crew_workflows
            else:
                print(f"❌ Failed to get workflows: {response.status_code}")
                return []
                
        except Exception as e:
            print(f"❌ Error getting workflows: {e}")
            return []

    def create_database_nodes(self, crew_member: str) -> List[Dict]:
        """Create database nodes for a crew member"""
        nodes = []
        
        # Memory Storage Node
        memory_node = {
            "id": f"memory_storage_{crew_member.lower().replace(' ', '_')}",
            "name": f"{crew_member} - Memory Storage",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 1,
            "position": [1100, 300],
            "parameters": {
                "url": "{{ $env.SUPABASE_URL }}/rest/v1/crew_memories",
                "method": "POST",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "nodeCredentialType": "httpHeaderAuth",
                "httpHeaderAuth": f"Bearer {{ $env.SUPABASE_ANON_KEY }}",
                "sendBody": True,
                "bodyParameters": [
                    {"name": "crew_member", "value": f"={{\"$json.crew_member\"}}"},
                    {"name": "mission_id", "value": "={{ $json.mission_id || 'general' }}"},
                    {"name": "memory_type", "value": "mission_experience"},
                    {"name": "content", "value": "={{ $json.response || $json.content }}"},
                    {"name": "timestamp", "value": "={{ new Date().toISOString() }}"},
                    {"name": "importance", "value": "medium"}
                ],
                "options": {}
            }
        }
        nodes.append(memory_node)
        
        # Mission Log Node
        mission_log_node = {
            "id": f"mission_log_{crew_member.lower().replace(' ', '_')}",
            "name": f"{crew_member} - Mission Log",
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 1,
            "position": [1100, 500],
            "parameters": {
                "url": "{{ $env.SUPABASE_URL }}/rest/v1/mission_logs",
                "method": "POST",
                "authentication": "genericCredentialType",
                "genericAuthType": "httpHeaderAuth",
                "nodeCredentialType": "httpHeaderAuth",
                "httpHeaderAuth": f"Bearer {{ $env.SUPABASE_ANON_KEY }}",
                "sendBody": True,
                "bodyParameters": [
                    {"name": "mission_id", "value": "={{ $json.mission_id || 'general' }}"},
                    {"name": "mission_name", "value": f"={{\"$json.mission_name || '{crew_member} Mission'\"}}"},
                    {"name": "mission_type", "value": "crew_operation"},
                    {"name": "crew_size", "value": "1"},
                    {"name": "status", "value": "completed"},
                    {"name": "start_time", "value": "={{ $json.start_time || new Date().toISOString() }}"},
                    {"name": "end_time", "value": "={{ new Date().toISOString() }}"},
                    {"name": "outcome", "value": "success"},
                    {"name": "crew_member", "value": f"={{\"$json.crew_member\"}}"},
                    {"name": "response_summary", "value": "={{ $json.response || $json.content }}"}
                ],
                "options": {}
            }
        }
        nodes.append(mission_log_node)
        
        return nodes

    def enhance_workflow_with_database(self, workflow: Dict[str, Any]) -> Dict[str, Any]:
        """Enhance a workflow with database nodes"""
        workflow_id = workflow.get("id")
        workflow_name = workflow.get("name", "")
        
        print(f"\n🔧 Enhancing workflow: {workflow_name}")
        
        # Extract crew member name from workflow name
        crew_member = None
        for crew in ["Riker", "Crusher", "Uhura", "Quark", "Picard", "Data", "Geordi", "Worf", "Troi"]:
            if crew in workflow_name:
                crew_member = crew
                break
        
        if not crew_member:
            print(f"   ⚠️  Could not identify crew member in: {workflow_name}")
            return workflow
        
        print(f"   🎯 Identified crew member: {crew_member}")
        
        # Get current workflow details
        try:
            response = requests.get(
                f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}",
                headers=self.headers,
                timeout=10
            )
            
            if response.status_code != 200:
                print(f"   ❌ Failed to get workflow details: {response.status_code}")
                return workflow
            
            workflow_data = response.json().get("data", {})
            current_nodes = workflow_data.get("nodes", [])
            current_connections = workflow_data.get("connections", {})
            
            # Check if database nodes already exist
            existing_db_nodes = [n for n in current_nodes if "memory" in n.get("name", "").lower() or "log" in n.get("name", "").lower()]
            if existing_db_nodes:
                print(f"   ✅ Database nodes already exist for {crew_member}")
                return workflow
            
            # Create new database nodes
            print(f"   🆕 Creating database nodes for {crew_member}...")
            new_nodes = self.create_database_nodes(crew_member)
            
            # Add new nodes to workflow
            enhanced_nodes = current_nodes + new_nodes
            
            # Update connections to include database nodes
            enhanced_connections = current_connections.copy()
            
            # Find the last node in the workflow (usually response/communication node)
            last_node_name = None
            for node in current_nodes:
                if "response" in node.get("name", "").lower() or "communication" in node.get("name", "").lower():
                    last_node_name = node.get("name")
                    break
            
            if last_node_name and enhanced_connections.get(last_node_name):
                # Connect last node to memory storage
                memory_node_name = f"{crew_member} - Memory Storage"
                enhanced_connections[last_node_name]["main"][0].append({
                    "node": memory_node_name,
                    "type": "main",
                    "index": 0
                })
                
                # Connect memory storage to mission log
                mission_log_node_name = f"{crew_member} - Mission Log"
                enhanced_connections[memory_node_name] = {
                    "main": [[{
                        "node": mission_log_node_name,
                        "type": "main",
                        "index": 0
                    }]]
                }
                
                print(f"   🔗 Connected database nodes for {crew_member}")
            
            # Create enhanced workflow data
            enhanced_workflow = {
                "name": workflow_name,
                "nodes": enhanced_nodes,
                "connections": enhanced_connections,
                "settings": workflow_data.get("settings", {}),
                "active": workflow_data.get("active", False)
            }
            
            # Update the workflow
            update_response = requests.put(
                f"{self.n8n_base_url}/api/v1/workflows/{workflow_id}",
                headers=self.headers,
                json=enhanced_workflow,
                timeout=30
            )
            
            if update_response.status_code == 200:
                print(f"   ✅ Successfully enhanced {crew_member} workflow with database nodes")
                return enhanced_workflow
            else:
                print(f"   ❌ Failed to update workflow: {update_response.status_code}")
                return workflow
                
        except Exception as e:
            print(f"   ❌ Error enhancing workflow: {e}")
            return workflow

    def enhance_all_crew_workflows(self) -> bool:
        """Enhance all crew workflows with database integration"""
        print("🚀 ENHANCING CREW WORKFLOWS WITH DATABASE INTEGRATION")
        print("=" * 65)
        
        if not self.supabase_url or not self.supabase_anon_key:
            print("❌ Supabase configuration not available")
            print("   Please configure SUPABASE_URL and SUPABASE_ANON_KEY first")
            return False
        
        # Get crew workflows
        print("📋 Fetching crew workflows...")
        crew_workflows = self.get_crew_workflows()
        
        if not crew_workflows:
            print("❌ No crew workflows found")
            return False
        
        print(f"   Found {len(crew_workflows)} crew workflows")
        
        # Enhance each workflow
        enhanced_count = 0
        for workflow in crew_workflows:
            enhanced_workflow = self.enhance_workflow_with_database(workflow)
            if enhanced_workflow != workflow:
                enhanced_count += 1
        
        # Summary
        print(f"\n📊 Enhancement Results: {enhanced_count}/{len(crew_workflows)} workflows enhanced")
        
        if enhanced_count > 0:
            print("🎉 Database integration added to crew workflows!")
            print("   Crew members can now store memories and mission logs in Supabase.")
        else:
            print("⚠️  No workflows were enhanced")
        
        return enhanced_count > 0

def main():
    """Main enhancement function"""
    enhancer = CrewWorkflowEnhancer()
    
    success = enhancer.enhance_all_crew_workflows()
    
    if success:
        print("\n🚀 Crew workflows are now database-enabled!")
        print("   Next step: Test memory storage functionality")
    else:
        print("\n❌ Workflow enhancement failed")
        print("   Please check configuration and try again")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
