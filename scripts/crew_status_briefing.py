#!/usr/bin/env python3
"""
Crew Status Briefing Script
Coordinates responses from all crew members through their n8n workflows
"""

import os
import json
import sys
import requests
import time
from pathlib import Path
from typing import Dict, Any, List
from datetime import datetime

class CrewStatusBriefing:
    def __init__(self):
        # Load environment variables
        self.load_environment_variables()
        
        # Configuration
        self.n8n_url = os.getenv('N8N_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        
        # Headers for n8n API
        self.headers = {
            'Content-Type': 'application/json',
            'X-N8N-API-Key': self.n8n_api_key or 'n8n_api_key_placeholder'
        }
        
        # Crew member configurations
        self.crew_members = {
            'Captain Jean-Luc Picard': {
                'role': 'Strategic Leadership & Mission Command',
                'department': 'Command',
                'responsibilities': ['Mission planning', 'Strategic decisions', 'Crew coordination'],
                'webhook_path': 'crew-captain-jean-luc-picard'
            },
            'Commander William Riker': {
                'role': 'Tactical Execution & Workflow Management',
                'department': 'Operations',
                'responsibilities': ['Tactical planning', 'Workflow coordination', 'Crew deployment'],
                'webhook_path': 'crew-commander-william-riker'
            },
            'Dr. Beverly Crusher': {
                'role': 'Health & Diagnostics Officer',
                'department': 'Medical',
                'responsibilities': ['System health monitoring', 'Performance diagnostics', 'Issue resolution'],
                'webhook_path': 'crew-dr-beverly-crusher'
            },
            'Commander Data': {
                'role': 'Analytics & Logic Operations',
                'department': 'Science',
                'responsibilities': ['Data analysis', 'Logical assessment', 'Pattern recognition'],
                'webhook_path': 'crew-commander-data'
            },
            'Lieutenant Commander Geordi La Forge': {
                'role': 'Infrastructure & System Integration',
                'department': 'Engineering',
                'responsibilities': ['System architecture', 'Infrastructure maintenance', 'Integration oversight'],
                'webhook_path': 'crew-lieutenant-commander-geordi-la-forge'
            },
            'Lieutenant Worf': {
                'role': 'Security & Compliance Operations',
                'department': 'Security',
                'responsibilities': ['Security protocols', 'Compliance verification', 'Threat assessment'],
                'webhook_path': 'crew-lieutenant-worf'
            },
            'Lieutenant Uhura': {
                'role': 'Communications & I/O Operations Officer',
                'department': 'Communications',
                'responsibilities': ['Communication protocols', 'Data flow management', 'System interfaces'],
                'webhook_path': 'crew-lieutenant-uhura'
            },
            'Counselor Deanna Troi': {
                'role': 'User Experience & Empathy Analysis',
                'department': 'Counseling',
                'responsibilities': ['User experience', 'Emotional intelligence', 'Human factors'],
                'webhook_path': 'crew-counselor-deanna-troi'
            },
            'Quark': {
                'role': 'Business Intelligence & Budget Optimization',
                'department': 'Finance',
                'responsibilities': ['Resource optimization', 'Cost analysis', 'Efficiency metrics'],
                'webhook_path': 'crew-quark'
            }
        }
        
        print("🚀 CREW STATUS BRIEFING - OBSERVATION LOUNGE")
        print("=" * 70)

    def load_environment_variables(self):
        """Load environment variables from ~/.zshrc"""
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
                        
        except Exception as e:
            print(f"⚠️  Warning: Could not load ~/.zshrc: {e}")

    def test_n8n_connection(self) -> bool:
        """Test connection to n8n instance"""
        try:
            print("🔍 Testing n8n connection...")
            
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, timeout=10)
            
            if response.status_code == 200:
                print("   ✅ n8n connection successful")
                return True
            else:
                print(f"   ❌ n8n connection failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ n8n connection failed: {e}")
            return False

    def get_crew_workflow_status(self) -> Dict[str, Any]:
        """Get the current status of all crew workflows"""
        print("\n📊 GATHERING CREW WORKFLOW STATUS...")
        
        try:
            response = requests.get(f"{self.n8n_url}/api/v1/workflows", headers=self.headers, timeout=30)
            
            if response.status_code != 200:
                print(f"   ❌ Failed to fetch workflows: {response.status_code}")
                return {}
            
            data = response.json()
            
            # Handle different response formats
            if isinstance(data, list):
                workflows = data
            elif isinstance(data, dict) and 'data' in data:
                workflows = data['data']
            elif isinstance(data, str):
                # If it's a string, try to parse it as JSON
                try:
                    workflows = json.loads(data)
                    if not isinstance(workflows, list):
                        workflows = [workflows]
                except:
                    print(f"   ❌ Unexpected response format: {type(data)}")
                    return {}
            else:
                print(f"   ❌ Unexpected response format: {type(data)}")
                return {}
            
            crew_status = {}
            
            for crew_name, crew_info in self.crew_members.items():
                crew_workflows = [w for w in workflows if crew_name in w.get('name', '')]
                
                if crew_workflows:
                    # Find the active workflow
                    active_workflow = next((w for w in crew_workflows if w.get('active')), None)
                    enhanced_workflow = next((w for w in crew_workflows if 'Memory' in str(w.get('nodes', []))), None)
                    
                    crew_status[crew_name] = {
                        'total_workflows': len(crew_workflows),
                        'active_workflow': active_workflow,
                        'enhanced_workflow': enhanced_workflow,
                        'has_active': active_workflow is not None,
                        'has_enhanced': enhanced_workflow is not None,
                        'webhook_path': crew_info['webhook_path'],
                        'status': self._determine_crew_status(active_workflow, enhanced_workflow)
                    }
                else:
                    crew_status[crew_name] = {
                        'total_workflows': 0,
                        'active_workflow': None,
                        'enhanced_workflow': None,
                        'has_active': False,
                        'has_enhanced': False,
                        'webhook_path': crew_info['webhook_path'],
                        'status': 'MISSING'
                    }
            
            return crew_status
            
        except Exception as e:
            print(f"   ❌ Error fetching crew status: {e}")
            return {}

    def _determine_crew_status(self, active_workflow: Dict, enhanced_workflow: Dict) -> str:
        """Determine the operational status of a crew member"""
        if not active_workflow:
            return "INACTIVE"
        
        if not enhanced_workflow:
            return "ACTIVE_BASIC"
        
        if active_workflow.get('id') == enhanced_workflow.get('id'):
            return "ACTIVE_ENHANCED"
        else:
            return "ACTIVE_OUTDATED"

    def generate_crew_briefing_request(self, crew_name: str, crew_info: Dict) -> Dict[str, Any]:
        """Generate a briefing request for a specific crew member"""
        return {
            "task": f"Provide a comprehensive status report for {crew_name}",
            "department": crew_info['department'],
            "role": crew_info['role'],
            "responsibilities": crew_info['responsibilities'],
            "request_type": "status_briefing",
            "priority": "high",
            "executionMode": "production",
            "webhookUrl": f"http://0.0.0.0:5678/webhook/{crew_info['webhook_path']}"
        }

    def request_crew_status_reports(self, crew_status: Dict[str, Any]) -> Dict[str, Any]:
        """Request status reports from all crew members"""
        print("\n📡 REQUESTING CREW STATUS REPORTS...")
        
        crew_responses = {}
        
        for crew_name, crew_info in self.crew_members.items():
            if crew_name not in crew_status:
                continue
            
            status = crew_status[crew_name]
            webhook_path = status['webhook_path']
            
            print(f"\n   📡 Requesting report from: {crew_name}")
            print(f"      Department: {crew_info['department']}")
            print(f"      Status: {status['status']}")
            
            # Generate briefing request
            briefing_request = self.generate_crew_briefing_request(crew_name, crew_info)
            
            # Send request to crew member's webhook
            try:
                webhook_url = f"{self.n8n_url}/webhook/{webhook_path}"
                response = requests.post(
                    webhook_url,
                    headers={'Content-Type': 'application/json'},
                    json=briefing_request,
                    timeout=30
                )
                
                if response.status_code in [200, 201, 202]:
                    print(f"      ✅ Status report requested successfully")
                    crew_responses[crew_name] = {
                        'status': 'requested',
                        'response_code': response.status_code,
                        'webhook_url': webhook_url
                    }
                else:
                    print(f"      ❌ Failed to request status report: {response.status_code}")
                    crew_responses[crew_name] = {
                        'status': 'failed',
                        'response_code': response.status_code,
                        'error': f"HTTP {response.status_code}"
                    }
                    
            except Exception as e:
                print(f"      ❌ Error requesting status report: {e}")
                crew_responses[crew_name] = {
                    'status': 'error',
                    'error': str(e)
                }
            
            # Brief pause between requests
            time.sleep(1)
        
        return crew_responses

    def generate_commander_riker_tactical_assessment(self, crew_status: Dict[str, Any], crew_responses: Dict[str, Any]) -> Dict[str, Any]:
        """Generate Commander Riker's tactical assessment of crew operations"""
        print("\n⚡ GENERATING COMMANDER RIKER'S TACTICAL ASSESSMENT...")
        
        # Analyze crew readiness
        total_crew = len(self.crew_members)
        active_crew = sum(1 for status in crew_status.values() if status['status'] in ['ACTIVE_ENHANCED', 'ACTIVE_BASIC'])
        enhanced_crew = sum(1 for status in crew_status.values() if status['status'] == 'ACTIVE_ENHANCED')
        inactive_crew = sum(1 for status in crew_status.values() if status['status'] == 'INACTIVE')
        
        # Analyze department readiness
        department_status = {}
        for crew_name, crew_info in self.crew_members.items():
            dept = crew_info['department']
            if dept not in department_status:
                department_status[dept] = {'total': 0, 'active': 0, 'enhanced': 0}
            
            department_status[dept]['total'] += 1
            if crew_name in crew_status:
                status = crew_status[crew_name]['status']
                if status in ['ACTIVE_ENHANCED', 'ACTIVE_BASIC']:
                    department_status[dept]['active'] += 1
                if status == 'ACTIVE_ENHANCED':
                    department_status[dept]['enhanced'] += 1
        
        # Generate tactical recommendations
        tactical_recommendations = []
        
        if inactive_crew > 0:
            tactical_recommendations.append(f"CRITICAL: {inactive_crew} crew members are inactive and require immediate activation")
        
        if enhanced_crew < total_crew:
            tactical_recommendations.append(f"PRIORITY: {total_crew - enhanced_crew} crew members need enhanced workflow deployment")
        
        # Department-specific recommendations
        for dept, status in department_status.items():
            if status['active'] < status['total']:
                tactical_recommendations.append(f"DEPARTMENT: {dept} has {status['total'] - status['active']} inactive crew members")
        
        return {
            'tactical_assessment': {
                'crew_readiness': {
                    'total_crew': total_crew,
                    'active_crew': active_crew,
                    'enhanced_crew': enhanced_crew,
                    'inactive_crew': inactive_crew,
                    'readiness_percentage': (active_crew / total_crew) * 100 if total_crew > 0 else 0
                },
                'department_status': department_status,
                'operational_status': self._determine_operational_status(active_crew, enhanced_crew, total_crew)
            },
            'tactical_recommendations': tactical_recommendations,
            'immediate_actions': self._generate_immediate_actions(crew_status, crew_responses)
        }

    def _determine_operational_status(self, active_crew: int, enhanced_crew: int, total_crew: int) -> str:
        """Determine the overall operational status"""
        if active_crew == 0:
            return "CRITICAL - No crew members active"
        elif active_crew < total_crew * 0.5:
            return "HIGH RISK - Less than 50% crew active"
        elif active_crew < total_crew:
            return "MODERATE RISK - Some crew members inactive"
        elif enhanced_crew < total_crew:
            return "OPERATIONAL - All crew active, some need enhancement"
        else:
            return "FULLY OPERATIONAL - All crew enhanced and active"

    def _generate_immediate_actions(self, crew_status: Dict[str, Any], crew_responses: Dict[str, Any]) -> List[str]:
        """Generate immediate action items"""
        actions = []
        
        # Check for critical issues
        for crew_name, status in crew_status.items():
            if status['status'] == 'INACTIVE':
                actions.append(f"ACTIVATE: {crew_name} workflow is inactive")
            elif status['status'] == 'ACTIVE_OUTDATED':
                actions.append(f"UPGRADE: {crew_name} needs enhanced workflow activation")
        
        # Check for failed responses
        for crew_name, response in crew_responses.items():
            if response['status'] == 'failed':
                actions.append(f"INVESTIGATE: {crew_name} webhook response failed")
        
        return actions

    def display_crew_status_briefing(self, crew_status: Dict[str, Any], crew_responses: Dict[str, Any], tactical_assessment: Dict[str, Any]) -> None:
        """Display the comprehensive crew status briefing"""
        print(f"\n🎖️ CREW STATUS BRIEFING - OBSERVATION LOUNGE")
        print("=" * 70)
        print(f"📅 Briefing Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🎯 Mission: Comprehensive Crew Status Assessment")
        
        # Display crew member status
        print(f"\n👥 CREW MEMBER STATUS")
        print("-" * 50)
        
        for crew_name, crew_info in self.crew_members.items():
            if crew_name in crew_status:
                status = crew_status[crew_name]
                status_icon = self._get_status_icon(status['status'])
                dept = crew_info['department']
                role = crew_info['role']
                
                print(f"{status_icon} {crew_name}")
                print(f"   Department: {dept}")
                print(f"   Role: {role}")
                print(f"   Status: {status['status']}")
                print(f"   Workflows: {status['total_workflows']}")
                print(f"   Active: {'✅ Yes' if status['has_active'] else '❌ No'}")
                print(f"   Enhanced: {'✅ Yes' if status['has_enhanced'] else '❌ No'}")
                
                if crew_name in crew_responses:
                    response = crew_responses[crew_name]
                    response_status = response['status']
                    if response_status == 'requested':
                        print(f"   Response: ✅ Status report requested")
                    elif response_status == 'failed':
                        print(f"   Response: ❌ Failed ({response.get('error', 'Unknown error')})")
                    else:
                        print(f"   Response: ⚠️ {response_status}")
                print()
        
        # Display tactical assessment
        print(f"⚡ COMMANDER RIKER'S TACTICAL ASSESSMENT")
        print("-" * 50)
        
        tactical = tactical_assessment['tactical_assessment']
        readiness = tactical['crew_readiness']
        
        print(f"🎯 Crew Readiness: {readiness['readiness_percentage']:.1f}%")
        print(f"📊 Total Crew: {readiness['total_crew']}")
        print(f"🟢 Active Crew: {readiness['active_crew']}")
        print(f"🧠 Enhanced Crew: {readiness['enhanced_crew']}")
        print(f"🔴 Inactive Crew: {readiness['inactive_crew']}")
        print(f"🚀 Operational Status: {tactical['operational_status']}")
        
        # Department status
        print(f"\n🏢 DEPARTMENT STATUS")
        for dept, status in tactical['department_status'].items():
            dept_icon = "✅" if status['active'] == status['total'] else "⚠️"
            print(f"{dept_icon} {dept}: {status['active']}/{status['total']} active")
        
        # Tactical recommendations
        print(f"\n💡 TACTICAL RECOMMENDATIONS")
        for rec in tactical_assessment['tactical_recommendations']:
            print(f"   • {rec}")
        
        # Immediate actions
        print(f"\n🚨 IMMEDIATE ACTIONS REQUIRED")
        actions = tactical_assessment['immediate_actions']
        if actions:
            for action in actions:
                print(f"   🔥 {action}")
        else:
            print(f"   ✅ No immediate actions required")
        
        print(f"\n🎖️ BRIEFING COMPLETE")
        print("=" * 70)

    def _get_status_icon(self, status: str) -> str:
        """Get appropriate icon for crew status"""
        status_icons = {
            'ACTIVE_ENHANCED': '✅',
            'ACTIVE_BASIC': '🟡',
            'ACTIVE_OUTDATED': '⚠️',
            'INACTIVE': '❌',
            'MISSING': '❓'
        }
        return status_icons.get(status, '❓')

    def run_crew_briefing(self) -> bool:
        """Run the complete crew status briefing"""
        try:
            print("🚀 INITIATING CREW STATUS BRIEFING...")
            
            # Test n8n connection
            if not self.test_n8n_connection():
                print("\n❌ Cannot proceed without n8n connection")
                return False
            
            # Get crew workflow status
            crew_status = self.get_crew_workflow_status()
            if not crew_status:
                print("\n❌ Failed to gather crew status")
                return False
            
            # Request status reports from crew members
            crew_responses = self.request_crew_status_reports(crew_status)
            
            # Generate Commander Riker's tactical assessment
            tactical_assessment = self.generate_commander_riker_tactical_assessment(crew_status, crew_responses)
            
            # Display comprehensive briefing
            self.display_crew_status_briefing(crew_status, crew_responses, tactical_assessment)
            
            print(f"\n🎉 Crew status briefing completed successfully!")
            return True
            
        except Exception as e:
            print(f"\n❌ Crew briefing failed: {e}")
            return False

def main():
    """Main execution function"""
    briefing = CrewStatusBriefing()
    
    success = briefing.run_crew_briefing()
    
    if success:
        print("   Next: Review tactical recommendations and implement immediate actions")
    else:
        print("   Check the error messages above for issues")
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
