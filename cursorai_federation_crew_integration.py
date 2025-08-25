#!/usr/bin/env python3
"""
🏛️ CURSORAI FEDERATION CREW INTEGRATION
Direct access to Federation Crew insights through CursorAI chat console
No need to go through n8n - direct OpenRouter agent communication
"""

import os
import json
import requests
import time
from datetime import datetime
from typing import Dict, List, Any

class CursorAIFederationCrew:
    """Direct Federation Crew integration for CursorAI"""
    
    def __init__(self):
        self.config = {
            "system_name": "CursorAI Federation Crew Integration",
            "openrouter_api_key": None,
            "created_at": datetime.now().isoformat()
        }
        
        # Get OpenRouter API key from environment
        self.config["openrouter_api_key"] = os.getenv("OPENROUTER_API_KEY")
        if not self.config["openrouter_api_key"]:
            print("⚠️  OPENROUTER_API_KEY environment variable not set")
            print("💡 Set it with: export OPENROUTER_API_KEY='your_api_key'")
        
        # Define the Federation Crew members
        self.crew_members = {
            "picard": {
                "name": "Captain Jean-Luc Picard",
                "role": "Strategic Leadership & Mission Command",
                "model": "anthropic/claude-3.5-sonnet",
                "temperature": 0.3,
                "personality": "You are Captain Jean-Luc Picard, commanding officer of the USS Enterprise. You excel at strategic thinking, diplomatic solutions, and moral leadership. You value exploration, understanding, and peaceful resolution of conflicts. Your approach is measured, thoughtful, and always considers the greater good."
            },
            "riker": {
                "name": "Commander William T. Riker",
                "role": "Tactical Execution & Mission Planning",
                "model": "openai/gpt-4o",
                "temperature": 0.4,
                "personality": "You are Commander William T. Riker, Executive Officer of the Enterprise. You excel at tactical execution, mission planning, and resource optimization. You're bold, confident, and excel at thinking on your feet. You have a strong sense of duty and always put your crew first."
            },
            "data": {
                "name": "Lieutenant Commander Data",
                "role": "Analytics & Logic Operations",
                "model": "openai/gpt-4o",
                "temperature": 0.3,
                "personality": "You are Lieutenant Commander Data, an android with exceptional analytical capabilities. You provide data-driven insights, pattern recognition, and logical analysis. You're curious, precise, and always seek to understand. You excel at processing large amounts of information and identifying key patterns."
            },
            "geordi": {
                "name": "Lieutenant Commander Geordi La Forge",
                "role": "Infrastructure & System Integration",
                "model": "anthropic/claude-3.5-sonnet",
                "temperature": 0.4,
                "personality": "You are Lieutenant Commander Geordi La Forge, Chief Engineer of the Enterprise. Your expertise is in technical implementation, systems engineering, and creative problem-solving. You're innovative, practical, and can make anything work. You think in terms of systems and how they interconnect."
            },
            "crusher": {
                "name": "Dr. Beverly Crusher",
                "role": "Health & Optimization Specialist",
                "model": "anthropic/claude-3.5-sonnet",
                "temperature": 0.3,
                "personality": "You are Dr. Beverly Crusher, Chief Medical Officer of the Enterprise. Your role is to monitor system health, optimize performance, and ensure operational efficiency. You're compassionate, thorough, and always consider the well-being of your patients. You think in terms of prevention and holistic health."
            },
            "worf": {
                "name": "Lieutenant Worf",
                "role": "Security & Compliance Operations",
                "model": "openai/gpt-4o",
                "temperature": 0.4,
                "personality": "You are Lieutenant Worf, Chief of Security and Tactical Officer of the Enterprise. Your role is to assess security risks, implement protective measures, and ensure mission safety. You're honorable, disciplined, and always prepared. You think in terms of threats, security protocols, and tactical advantage."
            },
            "troi": {
                "name": "Counselor Deanna Troi",
                "role": "User Experience & Empathy Analysis",
                "model": "anthropic/claude-3.5-sonnet",
                "temperature": 0.5,
                "personality": "You are Counselor Deanna Troi, Ship's Counselor of the Enterprise. Your role is to ensure user experience excellence, emotional intelligence, and empathetic design. You're intuitive, caring, and deeply understand human emotions. You think in terms of human needs, accessibility, and emotional resonance."
            },
            "uhura": {
                "name": "Lieutenant Uhura",
                "role": "Communications & I/O Specialist",
                "model": "openai/gpt-4o",
                "temperature": 0.4,
                "personality": "You are Lieutenant Uhura, Communications Officer of the Enterprise. Your role is to manage all communications, API integrations, data flow, and input/output operations. You're skilled, efficient, and excel at managing complex communication systems. You think in terms of connectivity, information flow, and seamless integration."
            },
            "quark": {
                "name": "Quark",
                "role": "Business & Budget Specialist",
                "model": "openai/gpt-4o",
                "temperature": 0.4,
                "personality": "You are Quark, a Ferengi businessman with expertise in commerce, resource management, and cost optimization. Your role is to provide business intelligence, budget analysis, and resource optimization strategies. You're shrewd, practical, and always think about the bottom line. You think in terms of cost-effectiveness, ROI, and business value."
            }
        }
    
    def query_crew_member(self, crew_member: str, query: str) -> Dict[str, Any]:
        """Query a specific crew member for their insights"""
        if crew_member not in self.crew_members:
            return {"error": f"Unknown crew member: {crew_member}"}
        
        crew_info = self.crew_members[crew_member]
        
        try:
            headers = {
                "Authorization": f"Bearer {self.config['openrouter_api_key']}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": crew_info["model"],
                "messages": [
                    {
                        "role": "system",
                        "content": f"{crew_info['personality']} You are {crew_info['name']}, {crew_info['role']}. Respond to queries in character, providing insights based on your expertise and personality. Keep responses concise but insightful."
                    },
                    {
                        "role": "user",
                        "content": query
                    }
                ],
                "temperature": crew_info["temperature"]
            }
            
            response = requests.post(
                "https://api.openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                crew_response = result["choices"][0]["message"]["content"]
                
                return {
                    "crew_member": crew_info["name"],
                    "role": crew_info["role"],
                    "model": crew_info["model"],
                    "response": crew_response,
                    "timestamp": datetime.now().isoformat()
                }
            else:
                return {"error": f"API request failed: {response.status_code}"}
                
        except Exception as e:
            return {"error": f"Error querying crew member: {e}"}
    
    def get_crew_insight(self, query: str, crew_members: List[str] = None) -> Dict[str, Any]:
        """Get insights from multiple crew members on a query"""
        if crew_members is None:
            # Default to all crew members
            crew_members = list(self.crew_members.keys())
        
        print(f"🏛️ FEDERATION CREW INSIGHT REQUEST")
        print(f"📝 Query: {query}")
        print(f"👥 Consulting: {len(crew_members)} crew members")
        print("=" * 80)
        
        insights = {}
        for crew_member in crew_members:
            if crew_member in self.crew_members:
                print(f"🔍 Consulting {self.crew_members[crew_member]['name']}...")
                insight = self.query_crew_member(crew_member, query)
                insights[crew_member] = insight
                
                if "error" not in insight:
                    print(f"✅ {self.crew_members[crew_member]['name']}: {insight['response'][:100]}...")
                else:
                    print(f"❌ {self.crew_member}: {insight['error']}")
                
                time.sleep(1)  # Rate limiting
        
        return insights
    
    def extract_meeting_intent(self, command: str) -> str:
        """Extract the specific intent from an Observation Lounge command"""
        command_lower = command.lower()
        
        # Common intent patterns
        intent_patterns = [
            "in order to",
            "to review",
            "to analyze",
            "to discuss",
            "to address",
            "to examine",
            "to investigate",
            "to plan",
            "to strategize",
            "to optimize",
            "to troubleshoot",
            "to deploy",
            "to implement",
            "to assess",
            "to evaluate"
        ]
        
        for pattern in intent_patterns:
            if pattern in command_lower:
                # Extract everything after the pattern
                start_idx = command_lower.find(pattern) + len(pattern)
                intent = command[start_idx:].strip()
                if intent:
                    return intent
        
        # If no specific pattern found, try to extract meaningful intent
        if "project" in command_lower:
            return "fulfill project requirements and objectives"
        elif "bug" in command_lower:
            return "review and resolve system issues"
        elif "deployment" in command_lower:
            return "plan and execute deployment strategy"
        elif "performance" in command_lower:
            return "analyze and optimize system performance"
        elif "security" in command_lower:
            return "assess and enhance security measures"
        else:
            return "conduct general senior staff briefing and status review"
    
    def get_observation_lounge_synthesis(self, query: str, crew_insights: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesize crew insights in the Observation Lounge context"""
        try:
            # Prepare crew insights for synthesis
            synthesis_input = f"Query: {query}\n\nCrew Insights:\n"
            for crew_member, insight in crew_insights.items():
                if "error" not in insight:
                    synthesis_input += f"\n{insight['crew_member']} ({insight['role']}): {insight['response']}\n"
            
            headers = {
                "Authorization": f"Bearer {self.config['openrouter_api_key']}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "anthropic/claude-3.5-sonnet",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are the Observation Lounge Hub, the central coordination point for Federation crew collaboration. Synthesize insights from all crew members, identify synergies, resolve conflicts, and build comprehensive resolutions. Maintain the collaborative context and ensure optimal information flow between all specialists. Provide a unified, actionable response that incorporates the best insights from each crew member."
                    },
                    {
                        "role": "user",
                        "content": synthesis_input
                    }
                ],
                "temperature": 0.3
            }
            
            response = requests.post(
                "https://api.openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                result = response.json()
                synthesis = result["choices"][0]["message"]["content"]
                
                return {
                    "observation_lounge_synthesis": synthesis,
                    "timestamp": datetime.now().isoformat(),
                    "crew_consulted": len([i for i in crew_insights.values() if "error" not in i])
                }
            else:
                return {"error": f"Failed to synthesize insights: {response.status_code}"}
                
        except Exception as e:
            return {"error": f"Error in Observation Lounge synthesis: {e}"}
    
    def interactive_crew_consultation(self):
        """Interactive crew consultation interface"""
        print("🏛️ CURSORAI FEDERATION CREW CONSULTATION")
        print("=" * 80)
        print("Available crew members:")
        for key, crew in self.crew_members.items():
            print(f"  • {key}: {crew['name']} - {crew['role']}")
        print("\nCommands:")
        print("  • query <crew_member> <question> - Ask a specific crew member")
        print("  • consult <crew_members> <question> - Consult multiple crew members")
        print("  • synthesize <question> - Get full crew synthesis")
        print("  • exit - Exit consultation")
        print("\n🎯 Natural Language Commands:")
        print("  • 'Gather the crew in the observation lounge'")
        print("  • 'Call a meeting of the senior staff'")
        print("  • 'Assemble the crew for briefing'")
        print("  • 'Observation lounge meeting'")
        print("\n🎯 Enhanced Intent Commands:")
        print("  • 'Observation lounge in order to fulfill project criteria'")
        print("  • 'Gather the crew to review bug'")
        print("  • 'Senior staff meeting to analyze system performance'")
        print("  • 'Crew briefing to plan deployment strategy'")
        print("  • 'Observation lounge to troubleshoot security issues'")
        print("\n🎬 Film Script Format Commands:")
        print("  • 'Observation lounge with full crew debate'")
        print("  • 'Gather the crew for detailed discussion'")
        print("  • 'Senior staff meeting with individual insights'")
        print("  • 'Observation lounge - film script format'")
        print("  • 'Crew briefing with crew debate'")
        print("=" * 80)
        
        while True:
            try:
                command = input("\n🏛️ Federation Crew > ").strip()
                
                if command.lower() == "exit":
                    print("🖖 Live long and prosper!")
                    break
                
                if command.startswith("query "):
                    parts = command[6:].split(" ", 1)
                    if len(parts) == 2:
                        crew_member, question = parts
                        insight = self.query_crew_member(crew_member, question)
                        if "error" not in insight:
                            print(f"\n{insight['crew_member']} ({insight['role']}):")
                            print(f"{insight['response']}")
                        else:
                            print(f"❌ Error: {insight['error']}")
                    else:
                        print("❌ Usage: query <crew_member> <question>")
                
                elif command.startswith("consult "):
                    parts = command[8:].split(" ", 1)
                    if len(parts) == 2:
                        crew_list, question = parts
                        crew_members = [c.strip() for c in crew_list.split(",")]
                        insights = self.get_crew_insight(question, crew_members)
                        print(f"\n📋 Crew Insights for: {question}")
                        for crew, insight in insights.items():
                            if "error" not in insight:
                                print(f"\n{insight['crew_member']}: {insight['response']}")
                
                elif command.startswith("synthesize "):
                    question = command[11:]
                    print(f"\n🔍 Consulting full crew on: {question}")
                    insights = self.get_crew_insight(question)
                    synthesis = self.get_observation_lounge_synthesis(question, insights)
                    
                    if "error" not in synthesis:
                        print(f"\n🏛️ OBSERVATION LOUNGE SYNTHESIS:")
                        print(f"{synthesis['observation_lounge_synthesis']}")
                        print(f"\n📊 Crew consulted: {synthesis['crew_consulted']}")
                    else:
                        print(f"❌ Synthesis error: {synthesis['error']}")
                
                # Natural language commands for Observation Lounge meetings
                elif any(phrase in command.lower() for phrase in [
                    "gather the crew in the observation lounge",
                    "call a meeting of the senior staff", 
                    "assemble the crew for briefing",
                    "observation lounge meeting",
                    "senior staff meeting",
                    "crew briefing"
                ]) and not any(phrase in command.lower() for phrase in [
                    "with full crew debate",
                    "detailed discussion",
                    "individual insights",
                    "film script format",
                    "crew debate"
                ]):
                    print(f"\n🏛️ ADMIRAL'S ORDER RECEIVED: {command}")
                    print("🔍 Assembling senior staff in the Observation Lounge...")
                    
                    # Extract specific intent from the command
                    intent = self.extract_meeting_intent(command)
                    print(f"🎯 MISSION OBJECTIVE: {intent}")
                    
                    # Get crew insights focused on the specific intent
                    focused_query = f"Admiral has requested a senior staff meeting to: {intent}. Provide your specialized analysis and recommendations for this specific objective."
                    insights = self.get_crew_insight(focused_query)
                    synthesis = self.get_observation_lounge_synthesis(f"Admiral's briefing request: {intent}", insights)
                    
                    if "error" not in synthesis:
                        print(f"\n🏛️ OBSERVATION LOUNGE - SENIOR STAFF MEETING:")
                        print(f"🎯 FOCUS: {intent}")
                        print(f"{synthesis['observation_lounge_synthesis']}")
                        print(f"\n📊 Crew consulted: {synthesis['crew_consulted']}")
                        
                        # Picard's Admiral briefing with specific focus
                        print(f"\n🎖️ CAPTAIN PICARD'S ADMIRAL BRIEFING:")
                        print(f"Admiral, I've assembled the senior staff to address: {intent}")
                        print("Based on our collective analysis of this specific objective, here are my strategic")
                        print("recommendations and the current status of all relevant departments.")
                        print("What are your orders, Admiral?")
                    else:
                        print(f"❌ Meeting coordination error: {synthesis['error']}")
                
                # Film script format Observation Lounge meetings
                elif any(phrase in command.lower() for phrase in [
                    "with full crew debate",
                    "detailed discussion",
                    "individual insights",
                    "film script format",
                    "crew debate",
                    "full crew discussion"
                ]):
                    print(f"\n🏛️ ADMIRAL'S ORDER RECEIVED: {command}")
                    print("🎬 FILM SCRIPT FORMAT - FULL CREW DEBATE")
                    print("🔍 Assembling senior staff for detailed discussion...")
                    
                    # Extract specific intent from the command
                    intent = self.extract_meeting_intent(command)
                    print(f"🎯 MISSION OBJECTIVE: {intent}")
                    
                    # Get individual crew insights with debate format
                    print(f"\n🏛️ OBSERVATION LOUNGE - FULL CREW DEBATE:")
                    print("=" * 80)
                    
                    # Picard opens the meeting
                    print(f"🎖️ CAPTAIN PICARD: Admiral, I've assembled the senior staff to address: {intent}")
                    print("Let's hear from each department. Commander Riker, your tactical assessment?")
                    print("-" * 60)
                    
                    # Get insights from each crew member individually
                    crew_order = ["riker", "data", "geordi", "crusher", "worf", "troi", "uhura", "quark"]
                    
                    for crew_member in crew_order:
                        if crew_member in self.crew_members:
                            crew_info = self.crew_members[crew_member]
                            print(f"\n{crew_info['name'].upper()}: ", end="")
                            
                            # Get individual insight
                            focused_query = f"Admiral has requested detailed analysis on: {intent}. Provide your specialized perspective, potential disagreements with other approaches, and your specific recommendations. Speak in character as {crew_info['name']}."
                            insight = self.query_crew_member(crew_member, focused_query)
                            
                            if "error" not in insight:
                                print(insight['response'])
                            else:
                                print(f"Unable to provide analysis at this time.")
                            
                            print("-" * 60)
                            time.sleep(1)  # Dramatic pause
                    
                    # Picard's synthesis and Admiral briefing
                    print(f"\n🎖️ CAPTAIN PICARD: Excellent points from all departments. Based on this debate,")
                    print(f"my strategic assessment for {intent} is as follows:")
                    
                    # Get synthesis
                    focused_query = f"Admiral has requested a senior staff meeting to: {intent}. Provide your specialized analysis and recommendations for this specific objective."
                    insights = self.get_crew_insight(focused_query)
                    synthesis = self.get_observation_lounge_synthesis(f"Admiral's briefing request: {intent}", insights)
                    
                    if "error" not in synthesis:
                        print(f"\n🎖️ CAPTAIN PICARD'S STRATEGIC ASSESSMENT:")
                        print(f"{synthesis['observation_lounge_synthesis']}")
                        print(f"\n📊 Crew consulted: {synthesis['crew_consulted']}")
                        
                        print(f"\n🎖️ CAPTAIN PICARD: Admiral, that concludes our analysis.")
                        print("What are your orders?")
                    else:
                        print(f"\n🎖️ CAPTAIN PICARD: Admiral, we've completed our discussion.")
                        print("What are your orders?")
                
                else:
                    print("❌ Unknown command. Use: query, consult, synthesize, or exit")
                    
            except KeyboardInterrupt:
                print("\n🖖 Live long and prosper!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")

def main():
    """Main function"""
    crew = CursorAIFederationCrew()
    
    if not crew.config["openrouter_api_key"]:
        print("❌ OPENROUTER_API_KEY not set - cannot proceed")
        exit(1)
    
    # Start interactive consultation
    crew.interactive_crew_consultation()

if __name__ == "__main__":
    main()
