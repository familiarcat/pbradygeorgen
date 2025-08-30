#!/usr/bin/env python3
"""
Observation Lounge Meeting - Project Assessment
Comprehensive project analysis by all crew members via N8N integration
"""

import os
import sys
import requests
from datetime import datetime
from typing import Dict, List, Any

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

class ObservationLoungeMeeting:
    def __init__(self):
        """Initialize the Observation Lounge Meeting"""
        self.n8n_base_url = "https://n8n.pbradygeorgen.com/webhook"
        self.crew_endpoints = {
            "picard": f"{self.n8n_base_url}/picard-crew-analysis",
            "data": f"{self.n8n_base_url}/data-crew-analysis", 
            "riker": f"{self.n8n_base_url}/riker-crew-analysis",
            "worf": f"{self.n8n_base_url}/worf-crew-analysis",
            "geordi": f"{self.n8n_base_url}/geordi-crew-analysis",
            "troi": f"{self.n8n_base_url}/troi-crew-analysis",
            "uhura": f"{self.n8n_base_url}/uhura-crew-analysis",
            "crusher": f"{self.n8n_base_url}/crusher-crew-analysis",
            "quark": f"{self.n8n_base_url}/quark-crew-analysis"
        }
        
        self.crew_profiles = {
            "picard": {
                "name": "Captain Jean-Luc Picard",
                "role": "Strategic Leadership & Mission Command",
                "specialization": "Strategic planning, diplomatic solutions, command decisions"
            },
            "data": {
                "name": "Commander Data", 
                "role": "Scientific Analysis & Logical Reasoning",
                "specialization": "Data analysis, scientific method, logical deduction"
            },
            "riker": {
                "name": "Commander William Riker",
                "role": "Tactical Execution & Workflow Management", 
                "specialization": "Tactical operations, workflow optimization, execution planning"
            },
            "worf": {
                "name": "Lieutenant Worf",
                "role": "Tactical Analysis & Security Operations",
                "specialization": "Security assessment, threat analysis, defense strategies"
            },
            "geordi": {
                "name": "Lieutenant Commander Geordi La Forge",
                "role": "Engineering & Technical Problem-Solving",
                "specialization": "Technical architecture, system integration, engineering solutions"
            },
            "troi": {
                "name": "Counselor Deanna Troi", 
                "role": "Psychological Analysis & Emotional Intelligence",
                "specialization": "Team dynamics, user experience, emotional intelligence"
            },
            "uhura": {
                "name": "Lieutenant Uhura",
                "role": "Communications & Diplomatic Relations",
                "specialization": "Communication protocols, interface design, cultural relations"
            },
            "crusher": {
                "name": "Dr. Beverly Crusher",
                "role": "Medical Analysis & Healthcare Planning",
                "specialization": "System health, diagnostics, preventive maintenance"
            },
            "quark": {
                "name": "Quark",
                "role": "Business Operations & Financial Analysis", 
                "specialization": "Business logic, resource optimization, profit analysis"
            }
        }
    
    def conduct_crew_meeting(self, project_brief: str) -> Dict[str, Any]:
        """Conduct a comprehensive crew meeting for project analysis"""
        
        print("🏛️ OBSERVATION LOUNGE MEETING")
        print("=" * 60)
        print(f"📅 Meeting Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📋 Project Brief: {project_brief}")
        print("=" * 60)
        print()
        
        meeting_results = {
            "meeting_timestamp": datetime.now().isoformat(),
            "project_brief": project_brief,
            "crew_analyses": {},
            "meeting_summary": {},
            "action_items": [],
            "next_steps": []
        }
        
        # Get analysis from each crew member
        for crew_id, crew_info in self.crew_profiles.items():
            print(f"🎤 {crew_info['name']} - {crew_info['role']}")
            print("-" * 50)
            
            try:
                # Call N8N endpoint for this crew member
                analysis = self.get_crew_analysis(crew_id, project_brief)
                
                if analysis['status'] == 'success':
                    meeting_results['crew_analyses'][crew_id] = {
                        'crew_member': crew_info['name'],
                        'role': crew_info['role'],
                        'analysis': analysis['response'],
                        'specialization_focus': crew_info['specialization'],
                        'timestamp': datetime.now().isoformat()
                    }
                    
                    print(f"✅ Analysis received: {len(analysis['response'])} characters")
                    print(f"📝 Key insights: {analysis['response'][:200]}...")
                else:
                    print(f"❌ Analysis failed: {analysis.get('error', 'Unknown error')}")
                    meeting_results['crew_analyses'][crew_id] = {
                        'crew_member': crew_info['name'],
                        'role': crew_info['role'],
                        'analysis': f"[UNAVAILABLE] {analysis.get('error', 'Connection failed')}",
                        'status': 'error'
                    }
                
            except Exception as e:
                print(f"💥 Error getting analysis from {crew_info['name']}: {e}")
                meeting_results['crew_analyses'][crew_id] = {
                    'crew_member': crew_info['name'],
                    'role': crew_info['role'],
                    'analysis': f"[ERROR] {str(e)}",
                    'status': 'error'
                }
            
            print()
        
        # Generate meeting summary
        meeting_results['meeting_summary'] = self.generate_meeting_summary(meeting_results)
        
        print("📊 MEETING SUMMARY")
        print("=" * 30)
        print(f"✅ Crew members present: {len([a for a in meeting_results['crew_analyses'].values() if a.get('status') != 'error'])}")
        print(f"❌ Crew members unavailable: {len([a for a in meeting_results['crew_analyses'].values() if a.get('status') == 'error'])}")
        print()
        
        return meeting_results
    
    def get_crew_analysis(self, crew_id: str, project_brief: str) -> Dict[str, Any]:
        """Get analysis from a specific crew member via N8N"""
        
        if crew_id not in self.crew_endpoints:
            return {
                'status': 'error',
                'error': f'Unknown crew member: {crew_id}'
            }
        
        try:
            # Prepare the payload for N8N webhook
            payload = {
                'crewMemberId': crew_id,
                'projectBrief': project_brief,
                'requestType': 'project_analysis',
                'timestamp': datetime.now().isoformat()
            }
            
            # Make the request to N8N
            response = requests.post(
                self.crew_endpoints[crew_id],
                json=payload,
                timeout=30,
                headers={'Content-Type': 'application/json'}
            )
            
            if response.status_code == 200:
                return {
                    'status': 'success',
                    'response': response.json().get('analysis', response.text),
                    'crew_id': crew_id
                }
            else:
                return {
                    'status': 'error', 
                    'error': f'HTTP {response.status_code}: {response.text}',
                    'crew_id': crew_id
                }
                
        except requests.exceptions.Timeout:
            return {
                'status': 'error',
                'error': 'Request timeout (30s)',
                'crew_id': crew_id
            }
        except requests.exceptions.ConnectionError:
            return {
                'status': 'error',
                'error': 'Connection failed - N8N endpoint unavailable',
                'crew_id': crew_id
            }
        except Exception as e:
            return {
                'status': 'error',
                'error': f'Unexpected error: {str(e)}',
                'crew_id': crew_id
            }
    
    def generate_meeting_summary(self, meeting_results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a comprehensive meeting summary"""
        
        successful_analyses = [
            analysis for analysis in meeting_results['crew_analyses'].values() 
            if analysis.get('status') != 'error'
        ]
        
        failed_analyses = [
            analysis for analysis in meeting_results['crew_analyses'].values()
            if analysis.get('status') == 'error'
        ]
        
        return {
            'total_crew_members': len(meeting_results['crew_analyses']),
            'successful_analyses': len(successful_analyses),
            'failed_analyses': len(failed_analyses),
            'participation_rate': f"{len(successful_analyses)/len(meeting_results['crew_analyses'])*100:.1f}%",
            'meeting_effectiveness': 'High' if len(successful_analyses) >= 7 else 'Medium' if len(successful_analyses) >= 4 else 'Low',
            'key_perspectives': [analysis['specialization_focus'] for analysis in successful_analyses if 'specialization_focus' in analysis],
            'next_meeting_recommended': len(failed_analyses) > 3
        }
    
    def display_formatted_meeting_report(self, meeting_results: Dict[str, Any]) -> None:
        """Display a beautifully formatted meeting report"""
        
        print("\n🚀 OBSERVATION LOUNGE MEETING REPORT")
        print("=" * 70)
        print(f"📅 Meeting Date: {meeting_results['meeting_timestamp']}")
        print(f"📋 Project: {meeting_results['project_brief']}")
        print("=" * 70)
        
        print("\n👥 CREW PARTICIPATION")
        print("-" * 30)
        summary = meeting_results['meeting_summary']
        print(f"• Total Crew: {summary['total_crew_members']}")
        print(f"• Present: {summary['successful_analyses']}")
        print(f"• Unavailable: {summary['failed_analyses']}")
        print(f"• Participation Rate: {summary['participation_rate']}")
        print(f"• Meeting Effectiveness: {summary['meeting_effectiveness']}")
        
        print("\n📝 CREW ANALYSES")
        print("-" * 30)
        
        for crew_id, analysis in meeting_results['crew_analyses'].items():
            status_icon = "✅" if analysis.get('status') != 'error' else "❌"
            print(f"\n{status_icon} {analysis['crew_member']}")
            print(f"   Role: {analysis['role']}")
            
            if analysis.get('status') != 'error':
                analysis_text = analysis['analysis']
                if len(analysis_text) > 300:
                    print(f"   Analysis: {analysis_text[:300]}...")
                else:
                    print(f"   Analysis: {analysis_text}")
            else:
                print(f"   Status: {analysis['analysis']}")
        
        print(f"\n📊 MEETING CONCLUSIONS")
        print("-" * 30)
        if summary['successful_analyses'] >= 7:
            print("🎉 Excellent crew participation - comprehensive analysis achieved")
        elif summary['successful_analyses'] >= 4:
            print("👍 Good crew participation - solid analysis foundation")
        else:
            print("⚠️ Limited crew participation - follow-up meeting recommended")
        
        if summary.get('next_meeting_recommended'):
            print("📅 Recommendation: Schedule follow-up meeting with unavailable crew members")
        
        print("\n" + "=" * 70)

def main():
    """Run the Observation Lounge Meeting"""
    
    meeting = ObservationLoungeMeeting()
    
    # Define the project brief for analysis
    project_brief = """
    Analyze the current Claude Code Integration project with comprehensive perspective across all domains:
    
    1. TECHNICAL ARCHITECTURE: System design, integration patterns, scalability
    2. USER EXPERIENCE: Interface design, workflow optimization, accessibility 
    3. SECURITY: Authentication, authorization, data protection
    4. PERFORMANCE: Speed, reliability, resource optimization
    5. BUSINESS VALUE: ROI, strategic alignment, market position
    6. TEAM DYNAMICS: Collaboration effectiveness, skill development
    7. COMMUNICATION: Documentation, knowledge sharing, stakeholder alignment
    8. SYSTEM HEALTH: Monitoring, diagnostics, maintenance requirements
    9. RESOURCE MANAGEMENT: Cost optimization, infrastructure efficiency
    
    Provide insights from your specialized perspective and recommend actionable next steps.
    """
    
    # Conduct the meeting
    meeting_results = meeting.conduct_crew_meeting(project_brief)
    
    # Display the formatted report
    meeting.display_formatted_meeting_report(meeting_results)
    
    return meeting_results

if __name__ == "__main__":
    results = main()